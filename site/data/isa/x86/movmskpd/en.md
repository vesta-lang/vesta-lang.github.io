---
summary: Extract Packed Double Precision Floating-Point Sign Mask
---

## Description

Extracts the sign bits from the packed double precision floating-point values in the source operand (second operand), formats them into a 2-bit mask, and stores the mask in the destination operand (first operand). The source operand is an XMM register, and the destination operand is a general-purpose register. The mask is stored in the 2 low-order bits of the destination operand. Zero-extend the upper bits of the destination.

In 64-bit mode, the instruction can access additional registers (XMM8-XMM15, R8-R15) when used with a REX.R prefix. The default operand size is 64-bit in 64-bit mode.

128-bit versions: The source operand is a YMM register. The destination operand is a general purpose register.

VEX.256 encoded version: The source operand is a YMM register. The destination operand is a general purpose register.

Note: In VEX-encoded versions, VEX.vvvv is reserved and must be 1111b, otherwise instructions will #UD.

## Operation

```text
(V)MOVMSKPD (128-bit Versions)
DEST[0] := SRC[63]
DEST[1] := SRC[127]
IF DEST = r32

    THEN DEST[31:2] := 0;
    ELSE DEST[63:2] := 0;
FI

VMOVMSKPD (VEX.256 Encoded Version)
DEST[0] := SRC[63]
DEST[1] := SRC[127]
DEST[2] := SRC[191]
DEST[3] := SRC[255]
IF DEST = r32

    THEN DEST[31:4] := 0;
    ELSE DEST[63:4] := 0;
FI
```

## Intel C/C++ compiler intrinsics

```c
MOVMSKPD int _mm_movemask_pd ( __m128d a) VMOVMSKPD _mm256_movemask_pd(__m256d a);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-24, "Type 7 Class Exception Conditions," additionally:

```text
#UD               If VEX.vvvv  1111B.
```
