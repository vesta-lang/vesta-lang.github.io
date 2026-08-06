---
summary: 将 标量 双精度浮点 值转换为 标量 单精度
---

## 说明

将"转换自"源操作中的双精度浮点值(SSE2版本中的第二位操作,否则为第三位操作)转换为目的地操作中的单一精度浮点值.

当"convert- from"操作数是一个XMM的登记册时,双精度浮点值包含在寄存器的低四字中. 结果存储在 目标操作数 的低双词中. 当转换不准确时,返回的值按照MXCSR寄存器中的四舍五入控制位数进行四舍五入.

128位遗产 SSE 版本 : "convert- from" 源操作数(第二个操作数)是一个XMM登记册或内存位置. 相应的目的地注册保持不变的位数(MAXVL-1:32). 目标操作数是一个XMM登记册.

VEX.128和EVEX编码版本: "转换自"源操作数(第三代操作数)可以是XMM寄存器或64位内存位置. 第一个来源和目标操作数是XMM登记册. XMM注册目的地的比特(127:32)从第一源操作数中的相应比特复制. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX编码版本:转换后的结果为写掩码下的目的地低双字元素.

软件应确保VCVTSD2SS的编码与VEX.L=0. 用 VEX.L = 1 编码 VCVTSD2SS 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
VCVTSD2SS (EVEX Encoded Version)

IF (SRC2 *is register*) AND (EVEX.b = 1)

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC2[63:0]);

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0

VCVTSD2SS (VEX.128 Encoded Version)
DEST[31:0] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC2[63:0]);
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

CVTSD2SS (128-bit Legacy SSE Version)
DEST[31:0] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[63:0]);
(* DEST[MAXVL-1:32] Unmodified *)
```

## Intel C/C++ 内在编译器

```c
VCVTSD2SS __m128 _mm_mask_cvtsd_ss(__m128 s, __mmask8 k, __m128 a, __m128d b);
VCVTSD2SS __m128 _mm_maskz_cvtsd_ss( __mmask8 k, __m128 a,__m128d b);
VCVTSD2SS __m128 _mm_cvt_roundsd_ss(__m128 a, __m128d b, int r);
VCVTSD2SS __m128 _mm_mask_cvt_roundsd_ss(__m128 s, __mmask8 k, __m128 a, __m128d b, int r);
VCVTSD2SS __m128 _mm_maskz_cvt_roundsd_ss( __mmask8 k, __m128 a,__m128d b, int r);
CVTSD2SS __m128_mm_cvtsd_ss(__m128 a, __m128d b);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

VEX-encoded 指令,参见表2-20,"Type 3 Class Exception条件". EVEX-encoded 指令,参见表2-49,"Type E3 Class Exceptity条件".
