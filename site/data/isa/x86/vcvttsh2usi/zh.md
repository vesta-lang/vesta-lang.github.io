---
summary: 以 Truncation Low FP16 值转换为无符号整数
---

## 说明

本指令将 源操作数 中低的 FP16 元素转换为目的地通用寄存器中的无符号整数.

当转换不准确时,返回一个切换值(圆向零)。

如果转换结果超过签名的双字整数(在非64位模式或64位模式中与REX.W/VEX.W/EVEX.W=0)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回整数值FFFFFFFFH.

如果转换结果超过已签名的四字整数(在64位模式和REX.W/VEX.W/EVEX.W=1)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回整数值FFFFFF FFFFFFH.

## 行动

```text
VCVTTSH2USI dest, src
IF 64-mode and OperandSize == 64:

    DEST.qword := Convert_fp16_to_unsigned_integer64_truncate(SRC.fp16[0])
ELSE:

    DEST.dword := Convert_fp16_to_unsigned_integer32_truncate(SRC.fp16[0])
```

## Intel C/C++ 内在编译器

```c
VCVTTSH2USI unsigned int _mm_cvtt_roundsh_u32 (__m128h a, int sae);
VCVTTSH2USI unsigned __int64 _mm_cvtt_roundsh_u64 (__m128h a, int sae);
VCVTTSH2USI unsigned int _mm_cvttsh_u32 (__m128h a);
VCVTTSH2USI unsigned __int64 _mm_cvttsh_u64 (__m128h a);
```

## SIMD 浮点 例外

Invalid, Precision.

## 其他例外

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".
