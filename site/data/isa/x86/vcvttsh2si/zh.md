---
summary: 以 Truncation Low FP16 值转换为已签名整数
---

## 说明

本指令将 源操作数 中低的 FP16 元素转换为目的地通用寄存器中的签名整数.

当转换不准确时,返回一个切换值(圆向零)。

如果转换结果超过签名的双字整数(在非64位模式或64位模式中与REX.W/VEX.W/EVEX.W=0)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回无限期整数值80000000H.

如果转换结果超过签名的四字整数(在64位模式和REX.W/VEX.W/EVEX.W=1)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回不定期整数值80000 00000H.

## 行动

```text
VCVTTSH2SI dest, src
IF 64-mode and OperandSize == 64:

    DEST.qword := Convert_fp16_to_integer64_truncate(SRC.fp16[0])
ELSE:

    DEST.dword := Convert_fp16_to_integer32_truncate(SRC.fp16[0])
```

## Intel C/C++ 内在编译器

```c
VCVTTSH2SI int _mm_cvtt_roundsh_i32 (__m128h a, int sae);
VCVTTSH2SI __int64 _mm_cvtt_roundsh_i64 (__m128h a, int sae);
VCVTTSH2SI int _mm_cvttsh_i32 (__m128h a);
VCVTTSH2SI __int64 _mm_cvttsh_i64 (__m128h a);
```

## SIMD 浮点 例外

Invalid, Precision.

## 其他例外

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".
