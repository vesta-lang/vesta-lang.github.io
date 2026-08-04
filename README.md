<div align="center">
  <img src="site/assets/img/logo.png" width="140" height="140" alt="">

# vesta-lang.github.io

**Sitio web oficial del lenguaje de programacion [Vesta](https://github.com/vesta-lang/vesta).**

[vesta-lang.github.io](https://vesta-lang.github.io)

</div>

---

Este repositorio contiene **solo la web**. El compilador, la maquina virtual, el
JIT, el backend nativo y la biblioteca estandar viven en
[vesta-lang/vesta](https://github.com/vesta-lang/vesta).

El sitio se publica en ingles y en espanol, y se genera con un constructor
escrito para el proyecto, **sin dependencias de terceros**: solo hace falta Node
para construirlo.

## Como se construye

```bash
node build.mjs            # genera el sitio en dist/
node build.mjs --serve    # lo genera y lo sirve en http://localhost:8080
```

No hay `npm install` ni fichero de bloqueo. El generador usa unicamente la
biblioteca estandar de Node.

La decision es deliberada: el gestor de paquetes de Vesta existe en parte porque
la cadena de suministro de npm es un problema conocido, y levantar la web del
lenguaje sobre `npm ci` diria lo contrario de lo que el propio proyecto
defiende.

## Estructura

```text
build.mjs              Constructor: recorre el contenido y escribe dist/
tools/
  markdown.mjs         Markdown a HTML (el subconjunto que usa el sitio)
  layout.mjs           Plantilla de pagina, metadatos y navegacion
  site.mjs             Identidad, idiomas, rutas y cadenas de interfaz
  highlight.mjs        Resaltado de respaldo (C, Rust, Go, Python, Java, bash)
  snippet.mjs          Indice semantico de un fragmento Vesta a HTML
  diagram.mjs          Diagramas del sitio, en SVG generado
  og-image.mjs         Imagen de vista previa al compartir un enlace
  gen_snippets.py      Genera el indice semantico (se ejecuta en local)
site/
  content/<idioma>/    Paginas en Markdown
  snippets/            Fragmentos .vx reales, con su indice semantico
  assets/              Hojas de estilo, scripts e imagenes
dist/                  Salida del build (no se versiona)
```

## El codigo de los ejemplos es codigo real

Los fragmentos Vesta que aparecen en el sitio no son transcripciones: son
ficheros `.vx` de `site/snippets/` que **compilan de verdad**, y su resaltado lo
produce el propio compilador a traves de su servidor LSP.

```bash
# 1. Comprobar que el fragmento compila.
vesta --vx site/snippets/<nombre>.vx -o /tmp/prueba

# 2. Generar su indice semantico (crea <nombre>.tokens.json al lado).
python tools/gen_snippets.py <nombre>

# 3. Verificar que ningun fragmento quedo desincronizado.
python tools/gen_snippets.py --check
```

El indice se genera **en local** y se versiona como JSON: ni la accion de
integracion continua ni GitHub Pages necesitan el compilador, y ningun binario
se sube al repositorio.

Cada indice guarda el hash SHA-256 del `.vx` del que salio, y el build lo
comprueba. Editar un fragmento y olvidar regenerarlo **rompe la construccion**,
que es preferible a publicar un codigo cuyo coloreado corresponde a otra
version.

## Que verifica el build

| Comprobacion | Que detecta | Efecto |
| --- | --- | --- |
| Hash de fragmentos | Un `.vx` editado sin regenerar su indice | Falla |
| Diagnosticos del compilador | Un fragmento que no compila | Falla |
| Enlaces internos | Un enlace que no lleva a ninguna parte | Avisa |
| Cobertura del resaltado | Identificadores sin clasificar | Avisa |

## Ramas

```text
main            lo que esta publicado; un push aqui despliega el sitio
develop         integracion
feature/*       trabajo nuevo, sale de develop y vuelve a develop
hotfix/*        arreglo urgente, sale de main y se fusiona en main y develop
```

Las ramas de trabajo y las pull requests construyen el sitio, pero **no
despliegan**: solo `main` publica.

## Contribuir

Las correcciones de contenido, las traducciones y los arreglos de accesibilidad
son bienvenidos. Antes de abrir una pull request conviene tener presente que:

- Todo bloque de codigo Vesta debe compilar, y su indice debe estar regenerado.
- Las paginas existen en los dos idiomas, o en ninguno: no se publica un
  `hreflang` que apunte a una traduccion que no existe.
- Las cifras de rendimiento salen de una medicion real, citando hardware y
  fecha.
- Las funcionalidades en desarrollo se senalan como tales. Un lector no debe
  poder confundir lo que funciona hoy con lo que esta previsto.

## Licencia

Conviven dos clases de material y se licencian por separado, porque reutilizar
el generador y republicar un texto sobre el lenguaje son cosas distintas:

| Material | Licencia |
| --- | --- |
| Codigo (`build.mjs`, `tools/`, hojas de estilo y scripts) | MIT |
| Contenido (paginas, fragmentos de ejemplo y diagramas) | CC BY 4.0 |
| Nombre y logotipo de Vesta | Marca del proyecto, fuera de ambas |

Los fragmentos de `site/snippets/` se publican ademas con la intencion de que
puedan copiarse en programas propios sin atribucion: son ejemplos, y un ejemplo
que no se puede copiar no sirve de nada.

Detalle completo en [LICENSE](LICENSE). El compilador y la biblioteca estandar
tienen sus propios terminos, en
[vesta-lang/vesta](https://github.com/vesta-lang/vesta).
