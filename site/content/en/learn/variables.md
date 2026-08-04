---
title: "Variables and types - Learn Vesta"
description: "Vesta's primitive types, why they state their size, how literals are written and what happens when you convert between them."
section: "learn"
---

# Variables and types

If you come from Python, JavaScript or Java, you are used to a number just being
a number. In Vesta you choose **how many bits it takes**, and that choice has
consequences.

<!-- SNIPPET:types -->

```text
i8=100 i32=70000 i64=9000000000
u8=255 u64=18000000000000000000
f32=2.5 f64=3.14159
bool=true char=A string=hola
42 = 42 = 42 = 42 = 42
auto: 0 y 1.5
```

## Why the type states its size

`i64` means *signed 64-bit integer*. The number is not decoration: it says
exactly how much memory the variable takes and, therefore, which values fit in
it.

That matters for two reasons. The first is **capacity**: an `i8` holds 256
distinct values and not one more, so if you store 300 the result will not be 300.
The second is **space**: a million `i64` values take eight megabytes and a
million `i8` values take one. When you handle large structures, or talk to
hardware that expects an exact layout, that difference is the whole point of the
language.

Languages that hide the size pick for you, usually the largest one, and in
exchange spare you the thought. Vesta lets you choose because sometimes the
choice is the problem you are solving.

## The primitive types

Signed integers:

| Type | Bits | From | To |
| --- | ---: | ---: | ---: |
| `i8` | 8 | -128 | 127 |
| `i16` | 16 | -32,768 | 32,767 |
| `i32` | 32 | -2,147,483,648 | 2,147,483,647 |
| `i64` | 64 | -9,223,372,036,854,775,808 | 9,223,372,036,854,775,807 |

Unsigned integers:

| Type | Bits | From | To |
| --- | ---: | ---: | ---: |
| `u8` | 8 | 0 | 255 |
| `u16` | 16 | 0 | 65,535 |
| `u32` | 32 | 0 | 4,294,967,295 |
| `u64` | 64 | 0 | 18,446,744,073,709,551,615 |

Signed versus unsigned changes **which** values fit, not how many. A `u8` and an
`i8` both take one byte and both hold 256 distinct values; what changes is where
the range starts and ends.

And the rest:

| Type | Bits | What it is |
| --- | ---: | --- |
| `f32` | 32 | Single-precision floating point |
| `f64` | 64 | Double-precision floating point |
| `bool` | 8 | `true` or `false` |
| `char` | 32 | A Unicode code point |
| `string` | — | Text, managed by the runtime |

## Four ways to write the same number

```text
i64 dec = 42;
i64 hex = 0x2A;
i64 bin = 0b101010;
i64 oct = 0o52;
```

Those are the same value written in base ten, sixteen, two and eight. Which one
you pick depends on what you are expressing: a bit mask reads far better in
binary than in decimal.

## Letting the type be inferred

When the initial value already says what the type is, `auto` saves repeating it:

```text
auto contador = 0;      // i64
auto ratio = 1.5;       // f64
```

It works for local variables. It is sugar, not magic: the type is pinned down at
build time exactly as if you had written it.

> **`auto` currently fails with strings.** `auto s = "hola";` does not infer
> `string`, and printing it shows a number instead of the text. Write
> `string s = "hola";` until this is fixed.

## `char` is a number

A `char` holds a Unicode code point, and interpolating it shows that number:

```text
char letra = 'A';
println("${letra}");         // 65
println("${letra:char}");    // A
```

`${expr:char}` is a **format specifier**: it says how you want the value written,
not what the value is. There are more, such as `:hex` for hexadecimal, and they
get their own chapter in the strings part.

## Converting between types

Going to a wider type loses nothing and needs no asking:

```text
i32 a = 7;
i64 b = a;      // plenty of room
```

The other way round does lose information, and here you want to be careful:

```text
i64 grande = 300;
i8 pequeno = (i8) grande;   // 44
```

300 does not fit in an `i8`, so the low bits are kept and the result is 44. The
`(i8)` is a **cast**: you are telling the compiler you know what you are doing.

> **The cast is not required, and that is the trap.** `i8 pequeno = grande;`
> without a cast also compiles today, also gives 44, and warns about nothing.
> Write the cast whenever you narrow: it does not change the result, but it
> records that you meant it.

## Constants

`const` marks a value that cannot be reassigned:

```text
const i64 MAXIMO = 100;
```

Trying to change it is a compile error. Remember the limitation from the
previous chapter: at top level, `f32` and `f64` constants do not yet resolve
their name when used.

## What comes next

You have values now. Next comes operating on them: arithmetic, comparisons, bit
logic and the precedence rules.
