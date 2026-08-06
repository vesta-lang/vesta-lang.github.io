---
title: "Control flow - Learn Vesta"
description: "Conditionals and loops in Vesta: if, while, do-while, for, foreach over arrays, break and continue."
section: "learn"
---

# Control flow

Deciding and repeating. If you come from C, C++, Java or C#, all of this will
look familiar down to the punctuation.

<!-- SNIPPET:control -->

```text
aprobado
while 0
while 1
while 2
intentos = 5
for 0
for 1
for 2
suma = 100
impar 1
impar 3
impar 5
mayor = 9
desconocido:
  codigo = 3
```

## Conditionals

`if`, `else if` and `else`, with the condition in parentheses.

Braces are optional when the body is a single statement, as in C:

```vx
if (n > 0) println("positive");
```

Even so, put them in anyway. It is the habit that avoids the family of bugs that
shows up when someone adds a second line to a braceless `if` and that line ends
up running no matter what.

A number works as a condition too: zero is false, anything else is true. `if (n)`
compiles and does what you expect. Writing `if (n != 0)` says the same thing more
explicitly, and that is what this path uses.

## `while` and `do-while`

`while` checks the condition **before** entering, so it may not run at all.

`do { ... } while (cond);` runs the body and checks **afterwards**, so it always
runs at least once. That is what you want when the body itself produces the value
you are going to test: reading input, attempting a connection, processing a
block.

Note the semicolon at the end of the `do-while`: it is part of the syntax.

## `for`

The classic `for`, with its three parts separated by semicolons:

```vx
for (i64 k = 0; k < 3; k++) { ... }
```

Initialisation, condition and step. The variable declared there only exists
inside the loop.

## Walking an array

When all you want is to visit every element, the index is in the way:

```vx
i64[4] datos = {10, 20, 30, 40};
for (i64 v : datos) {
    total = total + v;
}
```

Read it as *"for each `v` of type `i64` in `datos`"*. `v` is a copy of the
element, not the element, so changing it does not change the array.

Arrays get their own chapter later; knowing how to walk them is enough here.

## `break` and `continue`

`break` leaves the loop. `continue` abandons the current pass and jumps to the
next. Both act on the innermost loop that contains them.

```vx
for (i64 m = 0; m < 10; m++) {
    if (m % 2 == 0) { continue; }   // evens are not interesting
    if (m > 6) { break; }           // from 7 on, we are done
    println("impar ${m}");
}
```

## `goto`

The language has `goto` and labels, for the same job as in C: leaving several
nested loops at once, or jumping to a shared cleanup block.

> **Jumping backwards does not work today.** A jump to an earlier label loses
> whatever was written into variables since that label, so the loop never makes
> progress and the program spins. Use `while` or `for` until this is fixed.

## The ternary

When all you want is to pick between two values, `if` is too much:

```vx
i64 mayor = a > b ? a : b;
```

Read it as *"if `a > b` then `a`, otherwise `b`"*.

> **Do not put it inside a string.** `"${a > b ? a : b}"` does not compile: the
> colon of the ternary is mistaken for the separator of the `${expr:fmt}` format
> specifier. Work the value out first, then interpolate it.

## `match`

`match` compares a value against several possible shapes. If you come from C or
Java, it takes the place of `switch`, which in Vesta **does not exist**.

```vx
match codigo {
    case 1 => println("aceptado");
    case 2 => println("pendiente");
    case _ => {
        println("desconocido:");
        println("  codigo = ${codigo}");
    }
}
```

Each case takes `=>` followed by a statement or a braced block. The underscore
`_` catches everything that did not match earlier, playing the role of
`default`.

Two differences from C's `switch` you will appreciate: **cases do not fall
through**, so there is no `break` to write at the end of each one, and therefore
no bug from forgetting it.

Here `match` is comparing numbers, and for that you would hardly need a
construct of its own. Its real use arrives with `enum` types, where besides
matching the shape it **pulls out the data carried inside**. That is a couple of
chapters away.

## What comes next

You can compute, decide and repeat. Next comes giving all of that a name:
functions.
