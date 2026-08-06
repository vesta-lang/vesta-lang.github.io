---
title: "Encoding reference - Vesta"
description: "How instructions are encoded: the VestaVM bytecode and each native target the toolchain emits."
section: "docs"
---

# Encoding reference

How an instruction becomes bytes. This is what you need to write a
disassembler, to read a dump, or to work out what the compiler actually
emitted.

<!-- BOOKINDEX -->

## Two lists worth not confusing

The toolchain does two different things with architectures, and the command
line presents them as if they were one:

| What it does | How many architectures |
| --- | --- |
| **Assemble and disassemble** a standalone file | Several |
| **Generate code** from a Vesta program | Fewer |

`--list-arch` prints the first list, which comes from the assembler and
disassembler libraries. A reader who takes it for the second will conclude they
can compile for an architecture that has no code generator, and the mistake
only surfaces on trying it.

Hence this section devotes a page to telling them apart, with the check made by
running the compiler rather than reading its help.
