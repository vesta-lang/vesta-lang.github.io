---
title: "Vesta - No magic. No hidden cost."
description: "Vesta is a systems language where everything that can be written in the language is written in the language, and where what you never use never reaches your binary."
section: ""
layout: home
snippet: hello
---

<div class="hero">
<div class="hero-text">
<h1>No magic. No hidden cost.</h1>
<p class="hero-lead">Everything that can be written in the language
is written in the language.</p>
<p class="hero-actions"><a class="button" href="/download/">Get started</a><a class="button-quiet" href="/learn/">Learn Vesta</a></p>
</div>
<img class="hero-logo" src="/assets/img/logo.png" alt="" width="208" height="208">
</div>

## What is Vesta

Vesta is a systems language designed together with its compiler, its virtual machine
and its tooling, so that much of the infrastructure that is normally hidden can be
written in the language itself.

In practical terms: **statically typed** with local inference and C-family syntax.
**Multi-paradigm** (imperative, object-oriented and lightly functional), with no
obligation to wrap anything in a class. One source runs three ways: as **bytecode** on
its virtual machine, through a **JIT** once the code gets hot, or **compiled ahead of
time** into a standalone native executable. Memory is deterministic by default (RAII,
smart pointers and a borrow checker); the collector only shows up if you ask for it.

## Why it exists

In almost every language there is a line where the language ends and something else
begins: components written in C, special compiler primitives, link scripts with their
own syntax. Below that line you can no longer read, understand or change anything.

Vesta tries to move that line. 512-bit integers, atomic types, system calls, section
layout and even the link script itself are not compiler magic: they are libraries
written in Vesta that you can open.

That has a practical consequence. If you can read how an atomic is implemented, you can
also adapt it to your case. The compiler stops being a black box and becomes part of
the same ecosystem as the rest of your code.

## What it does not try to do

Vesta is not here to replace C, C++ or Rust. Technologies coexist for decades and each
one finds its place, so it is built to interoperate with what already exists rather
than ask you to leave it behind.

The principle behind it is to provide **mechanisms rather than policies**: the language
supplies the tool, and the decision belongs to each project.

## Hello world

The same source, without changing a line, runs on the virtual machine, compiles through
the JIT, or becomes a standalone native executable.

<!-- SNIPPET:hello -->

## Features

<div class="feature-grid">

<article class="feature">
<h3><a href="/docs/language/">The compiler proves what it costs</a></h3>
<p>A function declares its footprint (pure, non-throwing, zero allocations, O(n)) and the compiler verifies it or refuses to build.</p>
</article>

<article class="feature">
<h3><a href="/docs/language/">Comptime, with a JIT behind it</a></h3>
<p>Functions that run during compilation with the full language: native assembly, system API calls and code generation.</p>
</article>

<article class="feature">
<h3><a href="/internals/">CTPE: the program, precomputed</a></h3>
<p>If your entry point is pure, the compiler runs it at build time and folds the result into a constant. On by default.</p>
</article>

<article class="feature">
<h3><a href="/stdlib/">A library that proves the point</a></h3>
<p>512-bit integers, atomics and syscalls are written in Vesta, not in C and not as compiler primitives.</p>
</article>

<article class="feature">
<h3><a href="/internals/linker/">Its own linker, scripted in Vesta</a></h3>
<p>The link script is a <code>.vx</code> file with a function in it, not a separate language with its own syntax.</p>
</article>

<article class="feature">
<h3><a href="/internals/aot/">Native, no runtime</a></h3>
<p>Standalone executables with deterministic memory. The collector is linked only if you use <code>gc&lt;T&gt;</code>, and it lives inside the binary.</p>
</article>

<article class="feature">
<h3><a href="/docs/language/">Typed views over memory</a></h3>
<p>Describe a PE header, an MMIO register or a network packet once, then read it by field name instead of by offset.</p>
</article>

<article class="feature">
<h3><a href="/docs/language/">Built for interop</a></h3>
<p>Call C libraries, system DLLs and raw syscalls without leaving the language or going through libc.</p>
</article>

</div>

## How it compiles and runs

<!-- DIAGRAM:pipeline -->

## What it can produce

From the same source, changing only the build command:

<ul class="targets">
<li>Bytecode <code>.velb</code> for the virtual machine</li>
<li>Native PE executable (Windows)</li>
<li>Native ELF executable (Linux)</li>
<li>Shared library <code>.so</code></li>
<li>Static library <code>.a</code></li>
<li>Relocatable object <code>.o</code> / <code>.obj</code></li>
<li>Flat binary, no header, for a boot sector or a ROM</li>
<li>Portable C99, with its public header</li>
</ul>

## Built from scratch

<ul class="facts">
<li><strong>No LLVM.</strong> The code generator, the SSA optimizer and the x86-64 emitter are our own.</li>
<li><strong>No <code>ld</code>, <code>gcc</code> or <code>ar</code>.</strong> Linker and archiver ship inside the compiler.</li>
<li><strong>Virtual machine, JIT and AOT compiler</strong> designed together, sharing the same IR.</li>
<li><strong>Standard library written in Vesta</strong>, down to the atomics and the system calls.</li>
<li><strong>451 example programs</strong> that compile and run across all three modes.</li>
<li><strong>Reproducible builds</strong>: same source and same compiler, same bytecode byte for byte.</li>
</ul>

## Documentation

[Learn](/learn/) is written to be read in order, from installation to your first real
program. [Documentation](/docs/) is the language reference, meant to be searched.
[Compiler Internals](/internals/) documents the compiler itself: SSA, the optimizer,
the JIT, native compilation, the linker and the incremental cache.

The [Standard Library](/stdlib/) has its own section, because it is written in Vesta
and that is an argument about the language rather than a catalogue of functions.

## Download

Vesta is in **alpha**: usable and tested, with parts still under active development.
Those parts are marked as such wherever they appear.

<p class="hero-actions"><a class="button" href="/download/">Download Vesta</a></p>
