---
title: "Anatomy of a program - Learn Vesta"
description: "The pieces of a Vesta file: comments, constants, functions, the entry point and string interpolation."
section: "learn"
---

# Anatomy of a program

So far you have compiled three lines. This chapter names the pieces that show up
in any `.vx` file, so the rest of the path does not have to stop and explain
them.

<!-- SNIPPET:anatomy -->

Running it with two arguments:

```bash
vesta --vx anatomy.vx -o anatomy
vesta --run anatomy.velb one two
```

```text
recorta(60)  = 60
recorta(500) = 100
argumentos recibidos: 2
```

## Comments

`//` runs to the end of the line and `/* ... */` covers whatever it encloses,
across several lines. No surprises if you come from C, C++, Java or Rust.

## Functions

A function is a named piece of code that takes values and gives back a result.
`recorta` takes a number and returns that same number, or `MAXIMO` if it goes
over.

Declaring one follows the C, C++ and Java shape: **the returned type first, then
the name, then the parameters, each with its own type in front**.

```text
i64 recorta(i64 x)
 |     |      |
 |     |      +-- takes an i64, called x inside
 |     +--------- is called recorta
 +--------------- returns an i64
```

Variables follow the same order: `i64 valor = 60;` declares a variable named
`valor`, of type `i64`, starting at 60.

`i64` is a signed 64-bit integer. Vesta's numeric types state their size in the
name, and the next chapter walks through all of them.

## Constants

`const i64 MAXIMO = 100;` declares a value that cannot be reassigned; trying is
a compile error, not a runtime failure.

A constant declared outside any function is visible from anywhere in the file.

> **Careful with floating-point constants.** Today, a `const` of type `f32` or
> `f64` declared at top level compiles, but its name does not resolve when you
> use it. Integer, string and boolean constants work, and inside a function
> there is no problem. It is a known compiler limitation.

## The entry point

`i32 main()` is where the program starts. It returns the process exit code: `0`
means everything went fine.

A file **without** `main` is still valid: it is not runnable on its own, but it
can be imported as a module from another file.

## Command-line arguments

There is a trap here worth knowing. The `main(string[] args)` signature is
accepted, but **that parameter is not populated**: indexing it gives you an empty
string.

Arguments are read through two builtins:

```text
args_count()    how many arguments there are
args_get(i)     argument number i
```

`args_get(0)` is the **first user argument**, not the executable name. Neither of
them compiles to a native binary yet.

## Interpolation

`"recorta(${valor})"` puts the result of an expression inside a string. Anything
that is an expression works between the braces, including a function call.

Whatever the compiler can work out on its own disappears from the final program:
in `recorta(500)`, the call is computed at build time and the binary carries the
`100` directly.

## What is missing

`import` for pulling in modules, and the `#define` preprocessor, are not here
because they deserve their own place: modules arrive in the part about
organising code.
