---
title: "Descargas - Vesta"
description: "Como conseguir Vesta: instalador de Windows o compilacion desde el codigo fuente. Todavia no hay binarios publicados."
section: "download"
---

# Instalar Vesta

Vesta esta en **alfa**. El codigo fuente es publico y se puede compilar hoy;
los binarios preparados llegaran con la primera version publicada.

<!-- TABS:instalar -->
<!-- TAB:binarios Descargar binarios -->

<p class="notice">
<strong>En desarrollo.</strong> Todavia no hay binarios publicados, asi que de
momento la via para probar Vesta es compilarlo desde el codigo fuente.
</p>

Cuando existan, aqui apareceran los paquetes para Windows, Linux y macOS junto a
su suma de verificacion y su firma.

Que no haya binarios no significa que no se pueda usar. En Windows, ademas, el
propio proyecto genera su instalador con una sola orden.

<p class="hero-actions"><label class="button" for="instalar-fuente">Compilar desde el fuente</label></p>

<!-- TAB:fuente Compilar desde el fuente -->

## 1. Dependencias

| Plataforma | Orden |
| --- | --- |
| Debian y Ubuntu | `sudo apt install build-essential cmake libssl-dev` |
| Arch Linux | `sudo pacman -S base-devel cmake openssl` |
| macOS | `brew install cmake openssl` |
| Windows | TDM-GCC-64 (o MinGW) y CMake, mas OpenSSL |

Keystone, Capstone y LibPEparse vienen como submodulos y se clonan solos. No
hace falta nada mas.

## 2. Clonar y compilar

```bash
git clone --recursive https://github.com/vesta-lang/vesta.git
cd vesta

cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```

En Windows con TDM-GCC hay que pedir el generador de MinGW:

```bash
cmake -G "MinGW Makefiles" -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```

Con CMake 4 o superior puede hacer falta anadir
`-DCMAKE_POLICY_VERSION_MINIMUM=3.5`, porque alguno de los submodulos declara un
minimo mas antiguo del que esa version acepta.

El ejecutable resultante es `build/vm`. Al instalarlo pasa a llamarse `vesta`.

## 3. Comprobar que funciona

```bash
./build/vm --version
```

## 4. Tu primer programa

Guarda esto como `hola.vx`:

<!-- SNIPPET:hello -->

Y compilalo, **desde la raiz del repositorio** (ver la nota sobre la biblioteca
estandar, mas abajo):

```bash
./build/vm --vx hola.vx -o hola
./build/vm --run hola.velb
```

El mismo fuente se puede compilar a un ejecutable nativo autonomo, sin la
maquina virtual:

```bash
./build/vm --vx hola.vx -m aot -o hola
./hola
```

<!-- TAB:posix Instalar en Linux y macOS -->

<p class="notice">
<strong>No hay <code>make install</code>.</strong> El empaquetado del proyecto es
hoy solo de Windows, asi que en Linux y macOS la instalacion se hace copiando
los ficheros a mano. Son cuatro ordenes.
</p>

No basta con copiar el binario. El compilador resuelve la biblioteca estandar,
los complementos nativos y las cabeceras del preprocesador **relativos a su
propia ubicacion**, asi que hay que llevarselos con el.

```bash
sudo mkdir -p /usr/local/lib/vesta
sudo cp build/vm            /usr/local/lib/vesta/vesta
sudo cp -r stdlib           /usr/local/lib/vesta/
sudo cp -r preprocessor/include_lib /usr/local/lib/vesta/
```

Queda una disposicion que satisface las tres busquedas a la vez:

```text
/usr/local/lib/vesta/
    vesta              el compilador
    stdlib/vx/         modulos de la biblioteca estandar
    stdlib/native/     complementos nativos
    include_lib/       cabeceras del preprocesador
```

Y para invocarlo desde cualquier parte, un enlace simbolico:

```bash
sudo ln -s /usr/local/lib/vesta/vesta /usr/local/bin/vesta
vesta --version
```

El enlace funciona porque en Linux el compilador averigua donde esta leyendo
`/proc/self/exe`, que resuelve el enlace y devuelve la ruta real.

<p class="notice">
<strong>En macOS, mejor sin enlace simbolico.</strong> Alli la ruta del
ejecutable se obtiene de otro modo y puede devolver la del propio enlace, con lo
que el compilador buscaria sus recursos en <code>/usr/local/bin</code>. Anade el
directorio al <code>PATH</code> en su lugar:
</p>

```bash
echo 'export PATH="/usr/local/lib/vesta:$PATH"' >> ~/.zshrc
```

<!-- TAB:instalador Instalador de Windows -->

En Windows no hace falta quedarse con el arbol de compilacion: el proyecto
genera su propio instalador desde CMake, y **descarga NSIS por su cuenta** si no
lo tienes.

```bash
cmake --build build --target installer
```

Deja un `VestaVM-<version>-win64.exe` que instala en `Archivos de programa`,
anade Vesta al `PATH` y crea el acceso directo del menu de inicio.

Si prefieres no instalar nada, hay una version portable en ZIP:

```bash
cmake --build build --target installer-zip
```

### Instalacion personalizada

El instalador deja elegir que componentes quieres:

| Componente | Que incluye |
| --- | --- |
| `core` | El compilador, el runtime y las bibliotecas de enlace. Obligatorio. |
| `stdlib` | La biblioteca estandar y los complementos nativos. |
| `lsp` | El servidor de lenguaje, para editores. |
| `examples` | Los programas de ejemplo. |
| `tools` | Utilidades del proyecto. |
| `sdk` | Cabeceras y bibliotecas para embeber Vesta o escribir complementos. |

Merece la pena marcar **`stdlib`**: sin ella el compilador funciona, pero
cualquier programa que importe un modulo de la biblioteca estandar no compilara.

<!-- TABS:end -->

## Como encuentra el compilador sus recursos

Es la causa mas frecuente de que una instalacion recien hecha falle, asi que
conviene conocerla. El compilador no lleva sus recursos dentro: los busca en
disco, y **no todos se buscan igual**.

| Recurso | Que es | Donde se busca |
| --- | --- | --- |
| `stdlib/vx` | Modulos de la biblioteca estandar | `VX_STDLIB_DIR`, luego relativo al directorio de trabajo, luego al ejecutable |
| `include_lib` | Cabeceras del preprocesador VPP | Relativo al ejecutable |
| `stdlib/native` | Complementos nativos (E/S, matematicas) | **Solo** relativo al ejecutable |

La ultima fila es la que sorprende: los complementos nativos **no** miran ni la
variable de entorno ni el directorio de trabajo. Por eso copiar unicamente el
binario a `/usr/local/bin` deja un compilador que arranca y falla en cuanto un
programa hace entrada o salida.

Para `stdlib/vx`, el orden completo es:

1. La variable **`VX_STDLIB_DIR`**, si esta definida.
2. Relativa al **directorio de trabajo**: `stdlib/vx`, `../stdlib/vx` o
   `../../stdlib/vx`.
3. Relativa al **ejecutable**: `<directorio>/stdlib/vx` o
   `<directorio>/../stdlib/vx`.

De ahi que los ejemplos de mas arriba se ejecuten **desde la raiz del
repositorio**: `build/vm` no tiene ninguna `stdlib/` al lado, y funciona por la
segunda regla. En cuanto cambias de directorio, deja de funcionar.

Hay ademas una variable **`VX_PATH`**, con la misma forma que `PATH`, para
anadir directorios donde buscar modulos propios.

## Que esperar de una alfa

El lenguaje, el compilador, la maquina virtual y el JIT funcionan y tienen
pruebas. Hay partes en desarrollo activo, y se senalan como tales alli donde
aparecen en esta documentacion.

No se recomienda todavia para produccion, y la sintaxis puede cambiar entre
versiones. Si encuentras un fallo, el sitio para contarlo es el
[repositorio del proyecto](https://github.com/vesta-lang/vesta).
