---
title: "Language reference - Vesta"
description: "What the Vesta language guarantees: lexis, types, expressions, statements, declarations, contracts, comptime and preprocessor."
section: "docs"
---

# Language reference

What the language guarantees, construct by construct. Each page groups a family
of constructs and every entry has its own link, so you can point at `#match`
rather than at the whole page.

This is not where you learn to program in Vesta: that is [Learn](/learn/). This
is where you find out which forms a construct admits, what it guarantees and
which execution modes it exists in.

<!-- BOOKINDEX -->

## What is not here

**How the compiler does it** is not covered here. That a constant is computed
at build time rather than at run time is a compiler decision and lives in
[Compiler Internals](/internals/); what this section states is what value that
constant has, which is the part that does not change between releases.

**Library types** are not here either. `u256` is used like a number and adds
with `+`, but it is not a compiler type: it is written in Vesta and imported.
It lives in the [Standard Library](/stdlib/). The line matters because it is
the project's thesis: much of what other languages ship in the compiler, Vesta
ships in the library.
