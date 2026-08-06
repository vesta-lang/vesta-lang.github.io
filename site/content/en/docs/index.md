---
title: "Documentation - Vesta"
description: "Vesta reference: the language, the toolchain, the virtual machine and instruction encoding."
section: "docs"
---

# Documentation

This is a reference. It is not read in order: it is searched.

If what you want is to learn the language, the place to start is
[Learn](/learn/), which is meant to be read straight through and assumes
nothing. Here every page stands on its own, is entered from a search box and
answers one specific question.

> **Under construction.** The structure and the tags are settled; the pages are
> being written. The ones that do not exist yet appear in the index without a
> link, so that what is missing is visible instead of looking unnecessary.

## The four books

<!-- BOOKINDEX -->

## What belongs here and what does not

Documentation, Compiler Internals and the Standard Library talk about the same
things from different places. The line between them is not by topic, it is by
**the kind of claim**:

| Section | What it claims | Can change without notice |
| --- | --- | --- |
| **Documentation** | What is guaranteed. Normative | No |
| [**Compiler Internals**](/internals/) | How it is achieved. Descriptive | Yes |
| [**Standard Library**](/stdlib/) | What is written in Vesta on top of that | Per its own version |

An example of the difference: that `match` has no fall-through between cases is
a guarantee of the language and lives here. That the JIT compiles a function
after a certain number of calls is an implementation decision, may change in
any release, and lives in Compiler Internals.

That is why the virtual machine instruction set and its binary formats are in
this section and not in Internals: they are specifications somebody could write
another implementation against.

## How to read the tags

Every reference entry carries the tags that apply to it. They are there to
answer, before you read, whether it is any use to you.

<!-- TAGLEGEND -->

Two details worth knowing:

**A missing mode means it is not there.** An entry tagged `VM` `JIT` is saying
it does not exist in native compilation. There is no negative tag, and that is
deliberate: absences do not get forgotten, negative tags do.

**Colour groups, but is never the only thing carrying the information.** Every
tag states what it is in its own text, and its family shows on hover. Only the
status tag is filled, because it is the one to see before copying anything.
