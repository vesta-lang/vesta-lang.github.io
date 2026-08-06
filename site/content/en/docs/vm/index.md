---
title: "Platform reference - Vesta"
description: "The Vesta virtual machine as a specification: instruction set, registers, calling convention, binary formats and syscalls."
section: "docs"
---

# Platform reference

The virtual machine described as a **specification**, not as a program. Which
instructions exist, what each one does, how arguments are passed and how the
file it executes is laid out.

<!-- BOOKINDEX -->

## Why this is not in Compiler Internals

The virtual machine might look like the internal detail par excellence. But the
split in this documentation is not by topic, it is by the kind of claim, and
these pages are normative: they describe a contract any implementation would
have to honour.

The difference shows best with an example. That an instruction takes its
operands in a given order is part of the contract, and a file compiled years
ago has to keep running. Whether the interpreter dispatches those instructions
with a jump table or a `switch` is invisible from outside, and so it lives in
[Compiler Internals](/internals/).

If somebody ever writes another implementation of VestaVM, this section is what
they would write it against.
