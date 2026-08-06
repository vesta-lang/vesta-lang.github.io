"""Motor de traduccion por lotes, sobre el modelo que instala Argos Translate.

## Por que no se llama a Argos y ya esta

Argos trae una funcion `translate(texto)` comoda y perfectamente valida para
traducir un parrafo suelto. Para diez mil frases no sirve, por dos motivos que
solo se ven al medirlo:

- **Traduce de una en una.** Cada llamada arma su propio lote de un elemento,
  y antes parte el texto en frases con un detector de fronteras que aqui sobra,
  porque lo que se le pasa ya ES una frase.
- **No usa la GPU.** Decide el dispositivo por su cuenta y responde `GPU
  requested, but is not available!` aunque CTranslate2 vea la tarjeta.

Medido sobre este corpus, en una RTX 4060:

    Argos, una a una, CPU        0,044 s/frase      7,3 min
    CTranslate2, en lote, GPU    0,0011 s/frase    0,2 min

Cuarenta veces. Con esa diferencia, traducir el manual entero deja de ser una
tarea que se planifica y pasa a ser algo que se rehace cuando convenga, que es
justo lo que hace falta mientras el glosario todavia se esta afinando.

## Que se toma prestado y que no

El **modelo** es el de Argos: se instala con su gestor de paquetes, se
descarga una vez y se queda en el disco. De su paquete salen tambien el
tokenizador y el prefijo de destino, porque son parte del modelo y adivinarlos
seria inventar.

Lo unico que se sustituye es **como se invoca**: un `Translator` de
CTranslate2 propio, con el dispositivo elegido aqui y las frases agrupadas en
lotes.

## Las bibliotecas de CUDA

CTranslate2 no trae el runtime de CUDA. En Windows busca `cublas64_12.dll` por
el `PATH` del proceso, y los paquetes `nvidia-cublas-cu12` y `nvidia-cudnn-cu12`
lo dejan dentro de `site-packages`, donde nadie lo busca. Registrar esos
directorios es lo que separa "no hay GPU" de "hay GPU": no falta la tarjeta,
falta la ruta.

Si no estan, se sigue por CPU sin decir nada mas que un aviso. La GPU acelera;
no es un requisito.
"""

import glob
import os
import site
import sys

# Tamano del lote, en tokens. CTranslate2 agrupa por longitud, asi que contar
# tokens reparte mejor que contar frases: un lote de frases largas y otro de
# cortas ocupan lo mismo.
BATCH_TOKENS = 4096

# Cuantas frases se procesan entre dos avisos de progreso. No afecta al
# resultado, solo a que una corrida larga de CPU no parezca colgada.
CHUNK = 512


def register_cuda_libraries():
    """Anade al `PATH` los directorios de las bibliotecas de CUDA de pip.

    Se hace **antes** de importar CTranslate2: la busqueda de DLL ocurre al
    cargar la extension, y cambiar el `PATH` despues no sirve de nada.

    @returns Los directorios registrados.
    """
    directories = []
    for base in site.getsitepackages():
        directories.extend(glob.glob(os.path.join(base, "nvidia", "*", "bin")))

    if not directories:
        return []

    os.environ["PATH"] = os.pathsep.join(directories) + os.pathsep + os.environ["PATH"]

    # `add_dll_directory` solo existe en Windows, y hace falta ademas del
    # `PATH` porque una extension puede cargarse con la busqueda restringida.
    if hasattr(os, "add_dll_directory"):
        for directory in directories:
            try:
                os.add_dll_directory(directory)
            except OSError:
                # Un directorio que desaparecio entre el `glob` y esto no es
                # motivo para abortar: se prueba el siguiente.
                continue

    return directories


class Engine:
    """Traductor por lotes para un par de idiomas.

    Carga el modelo una vez y lo mantiene abierto. Instanciarlo por frase
    tiraria por tierra toda la ventaja: el coste esta en cargar el modelo, no
    en traducir.
    """

    def __init__(self, from_code, to_code, device=None, compute_type=None):
        """Prepara el traductor.

        @param from_code Idioma de origen, `en`.
        @param to_code Idioma de destino.
        @param device `cuda`, `cpu`, o `None` para usar la GPU si la hay.
        @param compute_type Precision de CTranslate2. Por omision `float32`,
               porque el tiempo ya no es el problema y asi no hay que
               preguntarse si la cuantizacion cambio alguna frase.
        """
        register_cuda_libraries()

        import ctranslate2
        import argostranslate.package

        installed = [
            p for p in argostranslate.package.get_installed_packages()
            if p.from_code == from_code and p.to_code == to_code
        ]
        if not installed:
            raise RuntimeError(
                "no hay modelo instalado para %s -> %s" % (from_code, to_code))

        self.package = installed[0]
        self.device = device or self._detect(ctranslate2)
        self.compute_type = compute_type or ("float32" if self.device == "cuda"
                                             else "int8")
        self.translator = ctranslate2.Translator(
            os.path.join(str(self.package.package_path), "model"),
            device=self.device,
            compute_type=self.compute_type,
        )

    @staticmethod
    def _detect(ctranslate2):
        """Elige dispositivo: la GPU si CTranslate2 la ve, y si no la CPU."""
        try:
            return "cuda" if ctranslate2.get_cuda_device_count() > 0 else "cpu"
        except Exception:  # noqa: BLE001 - sin GPU la consulta puede reventar
            return "cpu"

    def translate_all(self, texts, progress=None, variants=1):
        """Traduce una lista de frases y devuelve otra del mismo tamano.

        Se traduce **todo lo que se pide**, en el mismo orden. La
        correspondencia por posicion es lo que permite luego devolver cada
        traduccion a su frase sin volver a buscarla.

        @param texts Frases a traducir, ya enmascaradas.
        @param progress Funcion opcional `(hechas, totales)` para informar.
        @param variants Cuantas traducciones alternativas devolver de cada
               frase. Con 1 se devuelve la cadena; con mas, la lista. Sirve
               para reintentar: si la mejor traduccion se comio un marcador,
               puede que la segunda no.
        @returns Lista de traducciones, o de listas de traducciones.
        """
        out = []
        prefix = None
        if self.package.target_prefix:
            prefix = self.package.target_prefix

        for start in range(0, len(texts), CHUNK):
            chunk = texts[start:start + CHUNK]
            tokens = [self.package.tokenizer.encode(text) for text in chunk]

            results = self.translator.translate_batch(
                tokens,
                target_prefix=[[prefix]] * len(tokens) if prefix else None,
                replace_unknowns=True,
                max_batch_size=BATCH_TOKENS,
                batch_type="tokens",
                beam_size=max(4, variants),
                num_hypotheses=variants,
                length_penalty=0.2,
            )

            for result in results:
                decoded = [self._decode(h, prefix) for h in result.hypotheses]
                out.append(decoded if variants > 1 else decoded[0])

            if progress:
                progress(len(out), len(texts))

        return out

    def _decode(self, tokens, prefix):
        """Reconstruye el texto de una hipotesis, sin lo que anade el modelo."""
        value = self.package.tokenizer.decode(tokens)
        if prefix and value.startswith(prefix):
            value = value[len(prefix):]
        # El tokenizador deja un espacio al principio que no es del texto.
        return value.lstrip()


def describe(engine):
    """Devuelve una linea legible con el dispositivo y la precision en uso."""
    return "%s / %s" % (engine.device, engine.compute_type)


def warn_no_gpu(stream=sys.stderr):
    """Explica por que no hay GPU cuando la hay pero no se puede usar."""
    print("sin GPU: instala 'nvidia-cublas-cu12' y 'nvidia-cudnn-cu12' para "
          "usarla, o sigue por CPU", file=stream)
