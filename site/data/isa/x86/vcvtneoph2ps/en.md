---
summary: Convert Odd Elements of Packed FP16 Values to FP32 Values
---

## Description

This instruction loads packed FP16 elements from memory, converts the odd elements to FP32, and writes the result to the destination SIMD register.

This instruction does not generate floating-point exceptions and does not consult or update MXCSR.

Input FP16 denormals are converted to normal FP32 numbers and not treated as zero. Since any FP16 number can be represented in FP32, the conversion result is exact and no rounding is needed.

## Operation

```text
VCVTNEOPH2PS dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/32

FOR i in range(0, KL):
    dest.dword[i] = convert_fp16_to_fp32(src.dword[i].word[1]) //SAE

DEST[MAXVL-1:VL] := 0
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
VCVTNEOPH2PS __m128 _mm_cvtneoph_ps (const __m128h* __A);
VCVTNEOPH2PS __m256 _mm256_cvtneoph_ps (const __m256h* __A);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-21, "Type 4 Class Exception Conditions."
