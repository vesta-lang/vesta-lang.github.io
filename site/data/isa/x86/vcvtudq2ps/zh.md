---
summary: 将无符号的双字整数转换为单个精度
---

## 说明

将源操作(第二次操作)中打包的无符号双字整数转换为目的地操作(第一次操作)中单个精度浮点值.

源操作数是一个ZMM/YMM/XMM的登记器,一个512/256/128位内存位置或512/256/128位矢量从32位内存位置广播. 目标操作数是一个ZMM/YMM/XMM的登记册,有条件的更新有写掩码 k1.

说明: EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VCVTUDQ2PS (EVEX Encoded Version) When SRC Operand is a Register
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

THEN DEST[i+31:i] :=

             Convert_UInteger_To_Single_Precision_Floating_Point(SRC[i+31:i])

ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                         ; zeroing-masking

                    DEST[i+31:i] := 0

             FI


    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VCVTUDQ2PS (EVEX Encoded Version) When SRC Operand is a Memory Source
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1)

                  THEN

                    DEST[i+31:i] :=

             Convert_UInteger_To_Single_Precision_Floating_Point(SRC[31:0])

                  ELSE

                    DEST[i+31:i] :=

             Convert_UInteger_To_Single_Precision_Floating_Point(SRC[i+31:i])

             FI;

     ELSE

             IF *merging-masking*      ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                 ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTUDQ2PS __m512 _mm512_cvtepu32_ps( __m512i a);
VCVTUDQ2PS __m512 _mm512_mask_cvtepu32_ps( __m512 s, __mmask16 k, __m512i a);
VCVTUDQ2PS __m512 _mm512_maskz_cvtepu32_ps( __mmask16 k, __m512i a);
VCVTUDQ2PS __m512 _mm512_cvt_roundepu32_ps( __m512i a, int r);
VCVTUDQ2PS __m512 _mm512_mask_cvt_roundepu32_ps( __m512 s, __mmask16 k, __m512i a, int r);
VCVTUDQ2PS __m512 _mm512_maskz_cvt_roundepu32_ps( __mmask16 k, __m512i a, int r);
VCVTUDQ2PS __m256 _mm256_cvtepu32_ps( __m256i a);
VCVTUDQ2PS __m256 _mm256_mask_cvtepu32_ps( __m256 s, __mmask8 k, __m256i a);
VCVTUDQ2PS __m256 _mm256_maskz_cvtepu32_ps( __mmask8 k, __m256i a);
VCVTUDQ2PS __m128 _mm_cvtepu32_ps( __m128i a);
VCVTUDQ2PS __m128 _mm_mask_cvtepu32_ps( __m128 s, __mmask8 k, __m128i a);
VCVTUDQ2PS __m128 _mm_maskz_cvtepu32_ps( __mmask8 k, __m128i a);
```

## SIMD 浮点 例外

Precision.

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".

Additionally:

```text
#UD               If EVEX.vvvv != 1111B.
```
