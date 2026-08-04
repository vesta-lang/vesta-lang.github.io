---
title: "Hello world - Learn Vesta"
description: "Your first Vesta program: build it, run it, and understand every line."
section: "learn"
---

# Hello world

First you need the compiler. If you do not have it yet, go through
[installing Vesta](/download/) and come back; it takes a few minutes.

## The program

Save this as `hello.vx`:

<!-- SNIPPET:hello -->

## Build it and run it

Vesta compiles to a bytecode with the `.velb` extension, which its virtual
machine runs:

```bash
vesta --vx hello.vx -o hello
vesta --run hello.velb
```

You should see:

```text
Hello from Vesta 2!
```

If instead you get an error about modules that cannot be found, the compiler is
not locating the standard library. The cause and the fix are in
[where the standard library lives](/download/).

## What each line says

`i32 main()` declares the entry point. The type comes **before** the name, as in
C or Java, and it returns the process exit code: `0` means everything went fine.

`println` writes a line to standard output. You do not need to import anything
to use it.

The interesting part is inside the string. `${1 + 1}` is **interpolation**:
whatever sits between the braces is evaluated and its result is placed into the
text. And because `1 + 1` is an expression the compiler can work out on its own,
**no addition survives into the final program**: the binary carries the string
`Hello from Vesta 2!` directly.

It is a tiny example of something you will see everywhere in Vesta: what can be
known at build time is not paid for at run time.

## Next

The program you just compiled can run in three different ways without you
changing a single line. That is what comes next.
