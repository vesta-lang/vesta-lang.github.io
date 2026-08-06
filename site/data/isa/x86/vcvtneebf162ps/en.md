---
summary: Convert Even Elements of Packed BF16 Values to FP32 Values
---

## Description

This instruction loads packed BF16 elements from memory, converts the even elements to FP32, and writes the result to the destination SIMD register.

This instruction does not generate floating-point exceptions and does not consult or update MXCSR.

Since any BF16 number can be represented in FP32, the conversion result is exact and no rounding is needed.

## Operation

```text
VCVTNEEBF162PS dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/32

FOR i in range(0, KL):
    dest.dword[i] = make_fp32(src.dword[i].word[0])

DEST[MAXVL-1:VL] := 0
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
VCVTNEEBF162PS __m128 _mm_cvtneebf16_ps (const __m128bh* __A);
VCVTNEEBF162PS __m256 _mm256_cvtneebf16_ps (const __m256bh* __A);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-21, "Type 4 Class Exception Conditions."
