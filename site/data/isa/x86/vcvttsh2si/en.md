---
summary: Convert with Truncation Low FP16 Value to a Signed Integer
---

## Description

This instruction converts the low FP16 element in the source operand to a signed integer in the destination general purpose register.

When a conversion is inexact, a truncated (round toward zero) value is returned.

If a converted result exceeds the range limits of signed doubleword integer (in non-64-bit modes or 64-bit mode with REX.W/VEX.W/EVEX.W=0), the floating-point invalid exception is raised, and if this exception is masked, the indefinite integer value 80000000H is returned.

If a converted result exceeds the range limits of signed quadword integer (in 64-bit mode and REX.W/VEX.W/EVEX.W = 1), the floating-point invalid exception is raised, and if this exception is masked, the indefinite integer value 80000000_00000000H is returned.

## Operation

```text
VCVTTSH2SI dest, src
IF 64-mode and OperandSize == 64:

    DEST.qword := Convert_fp16_to_integer64_truncate(SRC.fp16[0])
ELSE:

    DEST.dword := Convert_fp16_to_integer32_truncate(SRC.fp16[0])
```

## Intel C/C++ compiler intrinsics

```c
VCVTTSH2SI int _mm_cvtt_roundsh_i32 (__m128h a, int sae);
VCVTTSH2SI __int64 _mm_cvtt_roundsh_i64 (__m128h a, int sae);
VCVTTSH2SI int _mm_cvttsh_i32 (__m128h a);
VCVTTSH2SI __int64 _mm_cvttsh_i64 (__m128h a);
```

## SIMD Floating-Point Exceptions

Invalid, Precision.

## Other Exceptions

EVEX-encoded instructions, see Table 2-50, "Type E3NF Class Exception Conditions."
