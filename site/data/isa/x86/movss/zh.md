---
summary: 移动或合并 标量 单精度浮点 值
---

## 说明

将 标量 单精度浮点 值从 源操作数 (第二个 操作数) 移动到 目标操作数 (第一个 操作数) . 来源和目标操作数可以是XMM注册或32位内存位置. 本指令可用于将一个单精度浮点值移动到一个XMM的低双字和一个32位的内存位置,或者在两个XMM的低双字之间移动一个单精度浮点值. 该指令不能用于在内存位置之间传输数据.

遗留版本 : 当来源和目标操作数是XMM注册时,对应目的地注册的位数(MAXVL-1:32)是未修改的. 当 源操作数 是 内存位置 和目的地时

操作数是一个XMM登记册,目标操作数的比特(127:32)被清除到所有0s,比特(MAXVL):128的比特(目标操作数)保持不变.

VEX 和 EVEX 编码的注册语法 : 将 标量 单精度浮点 值从 第二源操作数(第三个操作数)移动到 目标操作数(第一个操作数)的低双字元素. 127:32的目标操作数从第一源操作数(第二个操作数)复制. 对应目的地的比特(MAXVL-1:128)注册被清零.

VEX和EVEX编码的内存负载语法: 当源操作数是一个内存位置,目标操作数是一个XMM登记器时,比特的MAXVL:32的目标操作数被清除到所有0s.

EVEX 编码版本 : 目的地的低双词根据写掩码更新.

说明: 对于内存存储表指令"VMOVSS m32,xmm1",VEX.vvvv是保留的,必须是1111b否则指令会#UD. 对于内存存储表指令"VMOVSS mv {k1},xmm1",EVEX.vvvv是保留的,必须是1111b否则指令会#UD.

软件应确保VMOVSS的编码与VEX.L=0. 用 VEX.L = 1 编码 VMOVSS 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
VMOVSS (EVEX.LLIG.F3.0F.W0 11 /r When the Source Operand is Memory and the Destination is an XMM Register)

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SRC[31:0]

     ELSE

     IF *merging-masking*           ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                     ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[MAXVL-1:32] := 0

VMOVSS (EVEX.LLIG.F3.0F.W0 10 /r When the Source Operand is an XMM Register and the Destination is Memory)

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SRC[31:0]

     ELSE *DEST[31:0] remains unchanged*        ; merging-masking

FI;

VMOVSS (EVEX.LLIG.F3.0F.W0 10/11 /r Where the Source and Destination are XMM Registers)

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SRC2[31:0]

     ELSE

     IF *merging-masking*           ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                     ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0


MOVSS (Legacy SSE Version When the Source and Destination Operands are Both XMM Registers)
DEST[31:0] := SRC[31:0]
DEST[MAXVL-1:32] (Unmodified)

VMOVSS (VEX.128.F3.0F 11 /r Where the Destination is an XMM Register)
DEST[31:0] := SRC2[31:0]
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

VMOVSS (VEX.128.F3.0F 10 /r Where the Source and Destination are XMM Registers)
DEST[31:0] := SRC2[31:0]
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

VMOVSS (VEX.128.F3.0F 10 /r When the Source Operand is Memory and the Destination is an XMM Register)
DEST[31:0] := SRC[31:0]
DEST[MAXVL-1:32] := 0

MOVSS/VMOVSS (When the Source Operand is an XMM Register and the Destination is Memory)
DEST[31:0] := SRC[31:0]

MOVSS (Legacy SSE Version when the Source Operand is Memory and the Destination is an XMM Register)
DEST[31:0] := SRC[31:0]
DEST[127:32] := 0
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VMOVSS __m128 _mm_mask_load_ss(__m128 s, __mmask8 k, float * p);
VMOVSS __m128 _mm_maskz_load_ss( __mmask8 k, float * p);
VMOVSS __m128 _mm_mask_move_ss(__m128 sh, __mmask8 k, __m128 sl, __m128 a);
VMOVSS __m128 _mm_maskz_move_ss( __mmask8 k, __m128 s, __m128 a);
VMOVSS void _mm_mask_store_ss(float * p, __mmask8 k, __m128 a);
MOVSS __m128 _mm_load_ss(float * p) MOVSS void_mm_store_ss(float * p, __m128 a) MOVSS __m128 _mm_move_ss(__m128 a, __m128 b);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-22,"第5类例外条件",另外还有:

```text
#UD               If VEX.vvvv != 1111B.
```

EVEX-encoded discription,参见表2-60"Type E10类例外条件".
