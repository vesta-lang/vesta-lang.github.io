---
title: "Operators and casts - Learn Vesta"
description: "Arithmetic, comparisons, logic, bit operations, compound assignment and explicit conversion in Vesta."
section: "learn"
---

# Operators and casts

Vesta's operators are the ones you expect if you have written anything in the C
family. This chapter walks through them and stops at the three places where the
behaviour surprises people: integer division, overflow, and converting between
types.

<!-- SNIPPET:operators -->

```text
17 + 5 = 22
17 - 5 = 12
17 * 5 = 85
17 / 5 = 3      (division entera)
17 % 5 = 2      (resto)
17.0 / 5.0 = 3.4
a == b -> false
a >= b -> true
si && no -> false
si || no -> true
!si      -> false
x & y  = 8
x | y  = 14
x ^ y  = 6
x << 2 = 48
x >> 2 = 3
c tras += 5, *= 2 y %= 7 -> 2
(i64) 3.9 = 3
```

## Arithmetic

`+`, `-`, `*`, `/` and `%`, with the usual precedence: multiply and divide
first, add and subtract after, and parentheses above everything.

**Division between integers is integer division.** `17 / 5` gives `3`, not
`3.4`. Nothing is rounded: the decimal part is dropped. If you want decimals, one
of the two operands has to be floating point:

```text
17 / 5       -> 3
17.0 / 5.0   -> 3.4
```

`%` gives the remainder of that integer division: `17 % 5` is `2`.

## Comparisons

`==`, `!=`, `<`, `<=`, `>` and `>=` return a `bool`. Nothing remarkable.

## Logic

`&&`, `||` and `!` work on `bool`.

The first two **short-circuit**: if the left side already settles the result, the
right side is never evaluated.

```vx
false && whatever()    // whatever() does not run
true  || whatever()    // nor here
```

That is not a performance detail, it is a tool: it lets you write
`if (hasData() && firstItem() > 0)` knowing the second call only happens when the
first was true.

## Bit operations

This is where a systems language parts ways with an application one. These
operators do not look at the number, they look at **its bits**.

| Operator | What it does | With `12` and `10` |
| --- | --- | --- |
| `&` | Bit set only if set in both | `1100 & 1010 = 1000` = 8 |
| `\|` | Bit set if set in either | `1100 \| 1010 = 1110` = 14 |
| `^` | Bit set if set in one but not the other | `1100 ^ 1010 = 0110` = 6 |
| `~` | Flips every bit | |
| `<<` | Shifts left | `1100 << 2 = 110000` = 48 |
| `>>` | Shifts right | `1100 >> 2 = 11` = 3 |

Shifting left by one is the same as multiplying by two, and right by one, as
dividing by two. They are used to pack several small values into a single
integer, to read fields out of a hardware register, or to work with flags.

Writing the literals in binary, as `0b1100`, makes these far easier to read than
their decimal counterparts.

## Compound assignment

`c += 5` is `c = c + 5`. There is one for every arithmetic and bit operator:
`-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`, `<<=` and `>>=`.

## Explicit conversion

`(i64) 3.9` converts to an integer, and **truncates toward zero**: it gives `3`,
not `4`.

The cast is also what you use to move to a narrower type, as you saw in the
previous chapter. Remember that today the compiler accepts narrowing without a
cast, so writing it is what records that you meant it.

## The ternary

`condition ? ifTrue : ifFalse` picks between two values without writing an `if`:

```vx
i64 mayor = a > b ? a : b;
```

## Two operators you cannot use yet

You will see two more operators in Vesta code, and both go **after** the value:

| Operator | What it is for |
| --- | --- |
| `!!` | Pulls the value out of something that might not have one, and fails if it does not |
| `?` | On error, returns from the function passing it along; otherwise carries on |

They are not explained here because they only make sense next to `Optional` and
`Result`, the types that stand for *"there may be no value"* and *"this either
worked or failed"*. They get their own chapter, in the part about absence and
error.

They are named now so that, if you run into them first, you know you have not
skipped anything.

## Two things that fail quietly

**Overflow wraps around.** An `i8` reaches 127 and the next value is -128:

```vx
i8 max = 127;
max = max + 1;    // -128
```

There is no warning at build time or at run time. This is normal behaviour for a
systems language, and sometimes exactly what you want, but keep it in mind: if a
counter can grow past what fits in its type, the type is the wrong one.

**Dividing by zero stops the program without saying anything.** Today there is no
message and no error code: the process simply halts where it was and returns 0,
as if it had finished cleanly. Check the divisor before using it.

## What comes next

With values and operators you can compute. Next comes deciding and repeating:
conditionals, loops and `match`.
