---
summary: 移动或合并 标量 双精度浮点 值
---

## 说明

将 标量 双精度浮点 值从 源操作数 (第二个 操作数) 移动到 目标操作数 (第一个 操作数) . 来源和目标操作数可以是XMM登记器或64位内存位置. 此指令可用于将一个 双精度浮点 值移动到一个 XMM 的低四字和一个64位的 内存位置 ,或者在两个 XMM 的低四字之间移动一个 双精度浮点 值. 该指令不能用于在内存位置之间传输数据.

遗留版本 : 当来源和目的操作为XMM注册时,目的地操作的位元MAXVL:64保持不变. 当 源操作数 是一个 内存位置, 目标操作数 是一个 XMM

登记簿中,目的地操作符中127:64的四字被清除到所有 0s,目的地操作符中的MAXVL:128没有改变。

VEX 和 EVEX 编码的注册语法 : 将 标量 双精度浮点 值从 第二源操作数(第三个操作数)移动到 目标操作数(第一个操作数)的低四字元素. 目标操作数的比特127:64从第一源操作数(第二个操作数)复制. 对应目的地的比特(MAXVL-1:128)注册被清零.

VEX和EVEX编码的内存存储语法: 当源操作数是一个内存位置,目标操作数是一个XMM登记器时,比特的MAXVL:64的目标操作数被清除到所有0s.

EVEX 编码版本 : 目的地的低四字根据写掩码更新.

说明: 对于VMOVSD(记忆存储和负载表),VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VMOVSD (EVEX.LLIG.F2.0F 10 /r: VMOVSD xmm1, m64 With Support for 32 Registers)

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SRC[63:0]

     ELSE

     IF *merging-masking*           ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                     ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[MAXVL-1:64] := 0

VMOVSD (EVEX.LLIG.F2.0F 11 /r: VMOVSD m64, xmm1 With Support for 32 Registers)

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SRC[63:0]

     ELSE *DEST[63:0] remains unchanged*        ; merging-masking

FI;

VMOVSD (EVEX.LLIG.F2.0F 11 /r: VMOVSD xmm1, xmm2, xmm3)

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SRC2[63:0]

     ELSE

     IF *merging-masking*           ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                     ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

MOVSD (128-bit Legacy SSE Version: MOVSD xmm1, xmm2)
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] (Unmodified)


VMOVSD (VEX.128.F2.0F 11 /r: VMOVSD xmm1, xmm2, xmm3)
DEST[63:0] := SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

VMOVSD (VEX.128.F2.0F 10 /r: VMOVSD xmm1, xmm2, xmm3)
DEST[63:0] := SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

VMOVSD (VEX.128.F2.0F 10 /r: VMOVSD xmm1, m64)
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0

MOVSD/VMOVSD (128-bit Versions: MOVSD m64, xmm1 or VMOVSD m64, xmm1)
DEST[63:0] := SRC[63:0]

MOVSD (128-bit Legacy SSE Version: MOVSD xmm1, m64)
DEST[63:0] := SRC[63:0]
DEST[127:64] := 0
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VMOVSD __m128d _mm_mask_load_sd(__m128d s, __mmask8 k, double * p);
VMOVSD __m128d _mm_maskz_load_sd( __mmask8 k, double * p);
VMOVSD __m128d _mm_mask_move_sd(__m128d sh, __mmask8 k, __m128d sl, __m128d a);
VMOVSD __m128d _mm_maskz_move_sd( __mmask8 k, __m128d s, __m128d a);
VMOVSD void _mm_mask_store_sd(double * p, __mmask8 k, __m128d s);
MOVSD __m128d _mm_load_sd (double *p) MOVSD void _mm_store_sd (double *p, __m128d a) MOVSD __m128d _mm_move_sd ( __m128d a, __m128d b);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-22,"第5类例外条件",另外还有:

```text
#UD               If VEX.vvvv != 1111B.
```

EVEX-encoded discription,参见表2-60"Type E10类例外条件".
