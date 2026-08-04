---
title: "The three modes - Learn Vesta"
description: "The same Vesta source runs on the virtual machine, compiles through the JIT, or becomes a native binary."
section: "learn"
---

# The three modes

A `.vx` source is not tied to one way of running. The same file, without
changing a line, can run on a virtual machine, compile itself while it runs, or
become a native executable that needs nothing installed.

This is the program we will use:

<!-- SNIPPET:modes -->

## On the virtual machine

The compiler produces bytecode and the virtual machine runs it:

```bash
vesta --vx modes.vx -o modes
vesta --run modes.velb
```

It starts instantly and the `.velb` is portable: the same file runs on Windows
and on Linux without rebuilding.

## Through the JIT

Here comes the first surprise: **the JIT was already running**. The command
above does not run a pure interpreter. By default the virtual machine compiles
to machine code any function called more than 1500 times, and keeps
interpreting the rest.

To see it:

```bash
vesta --run modes.velb --jit-stats
```

If you want it to compile a function the first time it is called, rather than
waiting for it to get hot:

```bash
vesta --run modes.velb -m jit
```

That drops the threshold to 1. It is useful to check that something does get
compiled; a real program does not want it, because time goes into compiling code
that barely runs. The threshold can also be set by hand with
`--jit-threshold N`.

And the other way around, to run with **no JIT at all**, plain interpreter:

```bash
vesta --run modes.velb -m vm
```

The difference shows. A recursive `fib(27)`, on the machine where this page was
written, takes around 100 ms with `-m vm` and around 66 ms by default.

There are not two different semantics: the JIT and the interpreter produce the
same result, and if the JIT meets an operation it cannot compile yet, that part
falls back to the interpreter without the program noticing.

## Compiled to native

The third mode does not use the virtual machine at all:

```bash
vesta --vx modes.vx -m aot -o modes
./modes
```

That produces a system executable, PE on Windows and ELF on Linux, which
**does not need Vesta installed**. You can copy it to another machine and it
runs.

And it carries no runtime unless you ask for one: memory is released
deterministically when it leaves scope, with no collector. One only appears if
you use `gc<T>`, and then it is linked inside the binary itself.

## Which one to use

| Mode | Command | When |
| --- | --- | --- |
| Pure interpreter | `-m vm` | Diagnosis, or comparing against the JIT |
| Interpreter plus JIT | *(default)* | Development and normal use |
| Eager JIT | `-m jit` | Checking that something gets compiled |
| Native | `-m aot` | Shipping, fast startup, systems with no runtime |

The table is not the point. The point is that the choice **does not change how
you write**. In most languages, deciding between a virtual machine and a native
binary is deciding the language. Here it is a command-line flag.

## Why they agree

All three paths come out of the same IR. The JIT and the native compiler further
share the optimizer and the register allocator, so there are no two
implementations that can drift apart over time.

[Compiler Internals](/internals/) has the detail of that journey.
