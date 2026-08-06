---
summary: NOT Mask Register
---

## Description

Performs a bitwise NOT of vector mask k2 and writes the result into vector mask k1.

## Operation

```text
KNOTW
DEST[15:0] := BITWISE NOT SRC[15:0]
DEST[MAX_KL-1:16] := 0

KNOTB
DEST[7:0] := BITWISE NOT SRC[7:0]
DEST[MAX_KL-1:8] := 0

KNOTQ
DEST[63:0] := BITWISE NOT SRC[63:0]
DEST[MAX_KL-1:64] := 0

KNOTD
DEST[31:0] := BITWISE NOT SRC[31:0]
DEST[MAX_KL-1:32] := 0
```

## Intel C/C++ compiler intrinsics

```c
KNOTW __mmask16 _mm512_knot(__mmask16 a);
```

## Flags affected

None.

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-65, "TYPE K20 Exception Definition (VEX-Encoded OpMask Instructions w/o Memory Arg)."
