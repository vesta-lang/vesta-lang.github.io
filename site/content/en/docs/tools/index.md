---
title: "Toolchain reference - Vesta"
description: "The vesta command, its environment variables, diagnostic formats, the shell, the package manager and the file extensions."
section: "docs"
---

# Toolchain reference

The toolchain seen from outside: which commands exist, which options they take
and what they produce.

<!-- BOOKINDEX -->

## Why this section is verified by running it

Command-line help is documentation like any other, and like any other it can
fall out of date. In Vesta it already has: `vesta --help` claims the
just-in-time compiler is off by default, and that is not true.

So no option is published here without having been run exactly as written.
What this section says comes from running the command, not from reading its
help, and where the two disagree the disagreement is documented rather than the
more convenient version being picked.
