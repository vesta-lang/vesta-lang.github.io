---
title: "Vesta - Sin magia. Sin coste oculto."
description: "Vesta es un lenguaje de sistemas donde todo lo que puede escribirse en el propio lenguaje está escrito en él, y donde lo que no usas no llega a tu binario."
section: ""
layout: home
snippet: hello
---

<div class="hero">
<div class="hero-text">
<h1>Sin magia. Sin coste oculto.</h1>
<p class="hero-lead">Todo lo que puede escribirse en el propio
lenguaje está escrito en él.</p>
<p class="hero-actions"><a class="button" href="/es/download/">Empezar</a><a class="button-quiet" href="/es/learn/">Aprender Vesta</a></p>
</div>
<img class="hero-logo" src="/assets/img/logo.png" alt="" width="208" height="208">
</div>

## Qué es Vesta

Vesta es un lenguaje de sistemas diseñado junto a su compilador, su máquina virtual y
sus herramientas, para que buena parte de la infraestructura que normalmente queda
oculta pueda escribirse en el propio lenguaje.

En términos prácticos: **tipado estático** con inferencia local y sintaxis de la
familia de C. **Multiparadigma** (imperativo, orientado a objetos y funcional ligero),
sin obligar a envolver nada en una clase. Un mismo fuente se ejecuta de tres formas:
como **bytecode** sobre su máquina virtual, con **JIT** cuando el código se calienta, o
**compilado por adelantado** a un ejecutable nativo autónomo. La memoria es
determinista por defecto (RAII, punteros inteligentes y comprobador de préstamos); el
recolector solo aparece si lo pides.

## Por qué existe

En casi todos los lenguajes hay una frontera donde el lenguaje termina y empieza otra
cosa: componentes escritos en C, primitivas especiales del compilador, scripts de
enlazado con su propia sintaxis. Por debajo de esa línea ya no puedes leer, ni
entender, ni cambiar nada.

Vesta intenta mover esa frontera. Los enteros de 512 bits, los tipos atómicos, las
llamadas al sistema, la disposición de secciones o el propio script de enlace no son
magia del compilador: son bibliotecas escritas en Vesta que puedes abrir.

Y eso tiene una consecuencia práctica. Si puedes leer cómo está implementado un
atómico, también puedes adaptarlo a tu caso. El compilador deja de ser una caja negra y
pasa a formar parte del mismo ecosistema que el resto de tu código.

## Qué no intenta hacer

Vesta no nace para sustituir a C, C++ o Rust. Las tecnologías conviven durante décadas
y cada una encuentra su ámbito, así que está diseñado para interoperar con lo que ya
existe, no para pedirte que lo abandones.

El principio que lo guía es proporcionar **mecanismos en lugar de políticas**: el
lenguaje da la herramienta y la decisión es de cada proyecto.

## Hola mundo

El mismo fuente, sin cambiar una línea, corre en la máquina virtual, se compila con JIT
o se convierte en un ejecutable nativo autónomo.

<!-- SNIPPET:hello -->

## Características

<div class="feature-grid">

<article class="feature">
<h3><a href="/es/docs/contratos/">El compilador demuestra lo que cuesta</a></h3>
<p>Una función declara su huella (pura, sin excepciones, cero reservas, O(n)) y el compilador la verifica o rechaza compilar.</p>
</article>

<article class="feature">
<h3><a href="/es/docs/comptime/">Comptime con JIT detrás</a></h3>
<p>Funciones que se ejecutan durante la compilación con el lenguaje completo: ensamblador nativo, llamadas a la API del sistema y generación de código.</p>
</article>

<article class="feature">
<h3><a href="/es/docs/ctpe/">CTPE: el programa, precalculado</a></h3>
<p>Si tu punto de entrada es puro, el compilador lo ejecuta al compilar e inyecta el resultado como constante. Activo por defecto.</p>
</article>

<article class="feature">
<h3><a href="/es/stdlib/">Una biblioteca que lo demuestra</a></h3>
<p>Los enteros de 512 bits, los atómicos y las syscalls están escritos en Vesta, no en C ni en primitivas del compilador.</p>
</article>

<article class="feature">
<h3><a href="/es/internals/enlazador/">Enlazador propio, guionizado en Vesta</a></h3>
<p>El script de enlace es un fichero <code>.vx</code> con una función, no un lenguaje aparte con su propia sintaxis.</p>
</article>

<article class="feature">
<h3><a href="/es/internals/aot/">Nativo, sin runtime</a></h3>
<p>Ejecutables autónomos con memoria determinista. El recolector se enlaza solo si usas <code>gc&lt;T&gt;</code>, y queda dentro del binario.</p>
</article>

<article class="feature">
<h3><a href="/es/docs/overlays/">Vistas tipadas sobre memoria</a></h3>
<p>Describe una cabecera PE, un registro MMIO o un paquete de red una vez, y accede por nombre de campo en lugar de por desplazamiento.</p>
</article>

<article class="feature">
<h3><a href="/es/docs/ffi/">Pensado para interoperar</a></h3>
<p>Llama a bibliotecas de C, a DLL del sistema y a syscalls crudas sin salir del lenguaje ni pasar por libc.</p>
</article>

</div>

## Cómo se compila y se ejecuta

<!-- DIAGRAM:pipeline -->

## Qué puede generar

Del mismo fuente, cambiando solo la orden de compilación:

<ul class="targets">
<li>Bytecode <code>.velb</code> para la máquina virtual</li>
<li>Ejecutable nativo PE (Windows)</li>
<li>Ejecutable nativo ELF (Linux)</li>
<li>Biblioteca compartida <code>.so</code></li>
<li>Biblioteca estática <code>.a</code></li>
<li>Objeto relocatable <code>.o</code> / <code>.obj</code></li>
<li>Binario plano, sin cabecera, para un sector de arranque o una ROM</li>
<li>C99 portable, con su cabecera pública</li>
</ul>

## Hecho desde cero

<ul class="facts">
<li><strong>Sin LLVM.</strong> El generador de código, el optimizador SSA y el emisor x86-64 son propios.</li>
<li><strong>Sin <code>ld</code>, <code>gcc</code> ni <code>ar</code>.</strong> Enlazador y archivador incluidos en el compilador.</li>
<li><strong>Máquina virtual, JIT y compilador AOT</strong> diseñados juntos, compartiendo el mismo IR.</li>
<li><strong>Biblioteca estándar en Vesta</strong>, hasta los atómicos y las llamadas al sistema.</li>
<li><strong>451 programas de ejemplo</strong> que compilan y se ejecutan en los tres modos.</li>
<li><strong>Compilaciones reproducibles</strong>: mismo fuente y mismo compilador, mismo bytecode byte a byte.</li>
</ul>

## Documentación

[Aprende](/es/learn/) está escrito para leerse en orden, desde la instalación hasta el
primer programa de verdad. [Documentación](/es/docs/) es la referencia del lenguaje,
pensada para buscar. [Arquitectura](/es/internals/) documenta el compilador: el SSA, el
optimizador, el JIT, la compilación nativa, el enlazador y la caché incremental.

La [Biblioteca estándar](/es/stdlib/) tiene sección propia, porque está escrita en
Vesta y eso es un argumento sobre el lenguaje, no un catálogo de funciones.

## Descargas

Vesta está en **alfa**: utilizable y con pruebas, y con partes en desarrollo activo.
Esas partes se señalan como tales allí donde aparecen.

<p class="hero-actions"><a class="button" href="/es/download/">Descargar Vesta</a></p>
