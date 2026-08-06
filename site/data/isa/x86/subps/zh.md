---
summary: 减法 打包单精度浮点值
---

## 说明

执行SIMD从第一源操作数中减去第二源操作数的打包单精度浮点值,并将包装好的单精度浮点结果存储在目标操作数中.

VEX.128和EVEX.128编码版本: 第二源操作数是一个XMM的寄存器或128位的内存位置. 第一源操作数和目标操作数是XMM登记册. 对应目的地的比特(MAXVL-1:128)注册被清零.

VEX.256和EVEX.256编码版本: 第二源操作数是一个YMM的寄存器或256位的内存位置. 第一源操作数和目标操作数是YMM登记册. 对应目的地的比特(MAXVL-1:256)注册被清零.

EVEX.512 编码版本 : 第二源操作数是一个ZMM寄存器,512位内存位置或512位矢量从32位内存位置广播. 第一源操作数和目标操作数是ZMM登记册. 目标操作数根据写掩码有条件更新.

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册没有区别,对应注册目的地的上位位(MAXVL-1:128)没有修改.

## 行动

```text
VSUBPS (EVEX Encoded Versions When SRC2 Operand is a Vector Register)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF (VL = 512) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC1[i+31:i] - SRC2[i+31:i]

ELSE

     IF *merging-masking*     ; merging-masking

             THEN *DEST[31:0] remains unchanged*

             ELSE             ; zeroing-masking

             DEST[31:0] := 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VSUBPS (EVEX Encoded Versions When SRC2 Operand is a Memory Source)
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask* THEN

                IF (EVEX.b = 1)
                      THEN DEST[i+31:i] := SRC1[i+31:i] - SRC2[31:0];
                      ELSE DEST[i+31:i] := SRC1[i+31:i] - SRC2[i+31:i];

                FI;

ELSE

     IF *merging-masking*     ; merging-masking

             THEN *DEST[31:0] remains unchanged*

             ELSE             ; zeroing-masking

             DEST[31:0] := 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VSUBPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC2[31:0]
DEST[63:32] := SRC1[63:32] - SRC2[63:32]
DEST[95:64] := SRC1[95:64] - SRC2[95:64]
DEST[127:96] := SRC1[127:96] - SRC2[127:96]
DEST[159:128] := SRC1[159:128] - SRC2[159:128]
DEST[191:160] := SRC1[191:160] - SRC2[191:160]
DEST[223:192] := SRC1[223:192] - SRC2[223:192]
DEST[255:224] := SRC1[255:224] - SRC2[255:224].
DEST[MAXVL-1:256] := 0


VSUBPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC2[31:0]
DEST[63:32] := SRC1[63:32] - SRC2[63:32]
DEST[95:64] := SRC1[95:64] - SRC2[95:64]
DEST[127:96] := SRC1[127:96] - SRC2[127:96]
DEST[MAXVL-1:128] := 0

SUBPS (128-bit Legacy SSE Version)
DEST[31:0] := SRC1[31:0] - SRC2[31:0]
DEST[63:32] := SRC1[63:32] - SRC2[63:32]
DEST[95:64] := SRC1[95:64] - SRC2[95:64]
DEST[127:96] := SRC1[127:96] - SRC2[127:96]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VSUBPS __m512 _mm512_sub_ps (__m512 a, __m512 b);
VSUBPS __m512 _mm512_mask_sub_ps (__m512 s, __mmask16 k, __m512 a, __m512 b);
VSUBPS __m512 _mm512_maskz_sub_ps (__mmask16 k, __m512 a, __m512 b);
VSUBPS __m512 _mm512_sub_round_ps (__m512 a, __m512 b, int);
VSUBPS __m512 _mm512_mask_sub_round_ps (__m512 s, __mmask16 k, __m512 a, __m512 b, int);
VSUBPS __m512 _mm512_maskz_sub_round_ps (__mmask16 k, __m512 a, __m512 b, int);
VSUBPS __m256 _mm256_sub_ps (__m256 a, __m256 b);
VSUBPS __m256 _mm256_mask_sub_ps (__m256 s, __mmask8 k, __m256 a, __m256 b);
VSUBPS __m256 _mm256_maskz_sub_ps (__mmask16 k, __m256 a, __m256 b);
SUBPS __m128 _mm_sub_ps (__m128 a, __m128 b);
VSUBPS __m128 _mm_mask_sub_ps (__m128 s, __mmask8 k, __m128 a, __m128 b);
VSUBPS __m128 _mm_maskz_sub_ps (__mmask16 k, __m128 a, __m128 b);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

VEX-encoded指令,参见表2-19"第2类例外条件".

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".
