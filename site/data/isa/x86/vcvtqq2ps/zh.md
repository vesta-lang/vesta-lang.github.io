---
summary: 将包装的四字整数转换为包装的 单精度浮点
---

## 说明

将源操作数(第二个操作数)中的已包装四字整数转换为目标操作数(第一个操作数)中的已包装单精度浮点值. 源操作数是一个ZMM/YMM/XMM的登记册或512/256/128位内存位置. 目的地业务为YMM/XMM/XMM(下64位)注册,有条件更新后使用写掩码 k1. EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VCVTQQ2PS (EVEX Encoded Versions) When SRC Operand is a Register
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

k := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[k+31:k] :=

             Convert_QuadInteger_To_Single_Precision_Floating_Point(SRC[i+63:i])

     ELSE

             IF *merging-masking*              ; merging-masking

                 THEN *DEST[k+31:k] remains unchanged*

                 ELSE                          ; zeroing-masking

                    DEST[k+31:k] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0


VCVTQQ2PS (EVEX Encoded Versions) When SRC Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

k := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b == 1)

                  THEN

                    DEST[k+31:k] :=

             Convert_QuadInteger_To_Single_Precision_Floating_Point(SRC[63:0])

                  ELSE

                    DEST[k+31:k] :=

             Convert_QuadInteger_To_Single_Precision_Floating_Point(SRC[i+63:i])

             FI;

     ELSE

             IF *merging-masking*      ; merging-masking

                  THEN *DEST[k+31:k] remains unchanged*

                  ELSE                 ; zeroing-masking

                    DEST[k+31:k] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTQQ2PS __m256 _mm512_cvtepi64_ps( __m512i a);
VCVTQQ2PS __m256 _mm512_mask_cvtepi64_ps( __m256 s, __mmask16 k, __m512i a);
VCVTQQ2PS __m256 _mm512_maskz_cvtepi64_ps( __mmask16 k, __m512i a);
VCVTQQ2PS __m256 _mm512_cvt_roundepi64_ps( __m512i a, int r);
VCVTQQ2PS __m256 _mm512_mask_cvt_roundepi_ps( __m256 s, __mmask8 k, __m512i a, int r);
VCVTQQ2PS __m256 _mm512_maskz_cvt_roundepi64_ps( __mmask8 k, __m512i a, int r);
VCVTQQ2PS __m128 _mm256_cvtepi64_ps( __m256i a);
VCVTQQ2PS __m128 _mm256_mask_cvtepi64_ps( __m128 s, __mmask8 k, __m256i a);
VCVTQQ2PS __m128 _mm256_maskz_cvtepi64_ps( __mmask8 k, __m256i a);
VCVTQQ2PS __m128 _mm_cvtepi64_ps( __m128i a);
VCVTQQ2PS __m128 _mm_mask_cvtepi64_ps( __m128 s, __mmask8 k, __m128i a);
VCVTQQ2PS __m128 _mm_maskz_cvtepi64_ps( __mmask8 k, __m128i a);
```

## SIMD 浮点 例外

Precision.

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".

Additionally:

```text
#UD                     If EVEX.vvvv != 1111B.
```
