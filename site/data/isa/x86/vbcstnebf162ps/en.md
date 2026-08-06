---
summary: Load BF16 Element and Convert to FP32 Element With Broadcast
---

## Description

This instruction loads one BF16 element from memory, converts it to FP32, and broadcasts it to a SIMD register.

This instruction does not generate floating-point exceptions and does not consult or update MXCSR.

Since any BF16 number can be represented in FP32, the conversion result is exact and no rounding is needed.

## Operation

```text
VBCSTNEBF162PS dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/32

FOR i in range(0, KL):
    tmp.dword[i].word[0] = src.word[0] // reads 16b from memory

FOR i in range(0, KL):
    dest.dword[i] = make_fp32(TMP.dword[i].word[0])

DEST[MAXVL-1:VL] := 0
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
VBCSTNEBF162PS __m128 _mm_bcstnebf16_ps (const __bf16* __A);
VBCSTNEBF162PS __m256 _mm256_bcstnebf16_ps (const __bf16* __A);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-22, "Type 5 Class Exception Conditions."
