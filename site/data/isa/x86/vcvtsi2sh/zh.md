---
summary: 将已签名的双字/ 四字整数转换为 FP16 值
---

## 说明

本指令将第二个源代码操作中签名的双字整数(或如果操作大小为64位的话签名的四字整数)转换为目的地操作中FP16值. 结果存储在 目标操作数 的低词中. 当转换不准确时,返回的值按照MXCSR寄存器或嵌入式四舍五入控件中的四舍五入控制位进行四舍五入.

第二源操作数可以是通用寄存器或32/64位的内存位置. 第一个来源和目标操作数是XMM登记册. XMM注册目的地中的比特127:16从第一源操作数中的相应比特复制. 目的地的Bits MAXVL-1:128注册被清零.

如果转换操作结果溢出,MXCSR.OM=0,则用OE=1,PE=1提出SIMD例外.

## 行动

```text
VCVTSI2SH dest, src1, src2
IF *SRC2 is a register* and (EVEX.b = 1):

    SET_RM(EVEX.RC)
ELSE:

    SET_RM(MXCSR.RC)

IF 64-mode and OperandSize == 64:
    DEST.fp16[0] := Convert_integer64_to_fp16(SRC2.qword)

ELSE:
    DEST.fp16[0] := Convert_integer32_to_fp16(SRC2.dword)

DEST[127:16] := SRC1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTSI2SH __m128h _mm_cvt_roundi32_sh (__m128h a, int b, int rounding);
VCVTSI2SH __m128h _mm_cvt_roundi64_sh (__m128h a, __int64 b, int rounding);
VCVTSI2SH __m128h _mm_cvti32_sh (__m128h a, int b);
VCVTSI2SH __m128h _mm_cvti64_sh (__m128h a, __int64 b);
```

## SIMD 浮点 例外

Overflow, Precision.

## 其他例外

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".
