---
summary: 将 标量 单精度浮点 值转换为 标量 双精度
---

## 说明

将单精度浮点值在"convert- from"中的源操作数转换为目标操作数中的双精度浮点值. 当"convert- from"源操作数是一个XMM的登记册时,单精度浮点的值包含在寄存器的低双词中. 结果存储在 目标操作数 的低四字中.

128位遗产 SSE 版本 : "convert- from" 源操作数(第二个操作数)是一个XMM登记册或内存位置. 相应的目的地注册保持不变的位数(MAXVL-1:64). 目标操作数是一个XMM登记册.

VEX.128和EVEX编码版本: "转换自"源操作数(第三代操作数)可以是XMM寄存器或32位内存位置. 第一个来源和目标操作数是XMM登记册. XMM注册目的地的比特(127:64)从第一源操作数中的相应比特复制. 目的地的位数(MAXVL-1:128)登记被清零.

软件应确保VCVTSS2SD的编码与VEX.L=0. 用 VEX.L = 1 编码 VCVTSS2SD 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
VCVTSS2SD (EVEX Encoded Version)

IF k1[0] or *no writemask*

     THEN DEST[63:0] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC2[31:0]);

     ELSE

     IF *merging-masking*         ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                   ; zeroing-masking

           THEN DEST[63:0] = 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

VCVTSS2SD (VEX.128 Encoded Version)
DEST[63:0] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC2[31:0])
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

CVTSS2SD (128-bit Legacy SSE Version)
DEST[63:0] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[31:0]);
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VCVTSS2SD __m128d _mm_cvt_roundss_sd(__m128d a, __m128 b, int r);
VCVTSS2SD __m128d _mm_mask_cvt_roundss_sd(__m128d s, __mmask8 m, __m128d a,__m128 b, int r);
VCVTSS2SD __m128d _mm_maskz_cvt_roundss_sd(__mmask8 k, __m128d a, __m128 a, int r);
VCVTSS2SD __m128d _mm_mask_cvtss_sd(__m128d s, __mmask8 m, __m128d a,__m128 b);
VCVTSS2SD __m128d _mm_maskz_cvtss_sd(__mmask8 m, __m128d a,__m128 b);
CVTSS2SD __m128d_mm_cvtss_sd(__m128d a, __m128 a);
```

## SIMD 浮点 例外

Invalid, Denormal.

## 其他例外

VEX-encoded 指令,参见表2-20,"Type 3 Class Exception条件". EVEX-encoded 指令,参见表2-49,"Type E3 Class Exceptity条件".
