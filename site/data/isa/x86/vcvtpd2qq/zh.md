---
summary: 将 打包双精度浮点值 转换为包装的四方字
---

## 说明

将 源操作数(第二个操作数)中的打包双精度浮点值转换为目标操作数(第一个操作数)中的包装四字整数.

EVEX 编码版本 : 源操作数是一个ZMM/YMM/XMM的登记册或512/256/128位内存位置. 目的地业务是ZMM/YMM/XMM的登记册,以写掩码k1有条件更新.

当转换不准确时,返回的值按照MXCSR寄存器或嵌入式圆形控制位的圆形控制位进行四舍五入. 如果转换后的结果不能以目的格式表示,则提高 浮点 无效例外,如果掩盖这个例外,则返回80000 00000H的不定整数.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VCVTPD2QQ (EVEX Encoded Version) When SRC Operand is a Register
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF (VL == 512) AND (EVEX.b == 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

THEN DEST[i+63:i] :=

             Convert_Double_Precision_Floating_Point_To_QuadInteger(SRC[i+63:i])

ELSE

             IF *merging-masking*               ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                           ; zeroing-masking

                    DEST[i+63:i] := 0

             FI


    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VCVTPD2QQ (EVEX Encoded Version) When SRC Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b == 1)

                  THEN

                    DEST[i+63:i] :=    Convert_Double_Precision_Floating_Point_To_QuadInteger(SRC[63:0])

                  ELSE

                    DEST[i+63:i] := Convert_Double_Precision_Floating_Point_To_QuadInteger(SRC[i+63:i])

             FI;

     ELSE

             IF *merging-masking*      ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                 ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTPD2QQ __m512i _mm512_cvtpd_epi64( __m512d a);
VCVTPD2QQ __m512i _mm512_mask_cvtpd_epi64( __m512i s, __mmask8 k, __m512d a);
VCVTPD2QQ __m512i _mm512_maskz_cvtpd_epi64( __mmask8 k, __m512d a);
VCVTPD2QQ __m512i _mm512_cvt_roundpd_epi64( __m512d a, int r);
VCVTPD2QQ __m512i _mm512_mask_cvt_roundpd_epi64( __m512i s, __mmask8 k, __m512d a, int r);
VCVTPD2QQ __m512i _mm512_maskz_cvt_roundpd_epi64( __mmask8 k, __m512d a, int r);
VCVTPD2QQ __m256i _mm256_mask_cvtpd_epi64( __m256i s, __mmask8 k, __m256d a);
VCVTPD2QQ __m256i _mm256_maskz_cvtpd_epi64( __mmask8 k, __m256d a);
VCVTPD2QQ __m128i _mm_mask_cvtpd_epi64( __m128i s, __mmask8 k, __m128d a);
VCVTPD2QQ __m128i _mm_maskz_cvtpd_epi64( __mmask8 k, __m128d a);
VCVTPD2QQ __m256i _mm256_cvtpd_epi64 (__m256d src) VCVTPD2QQ __m128i _mm_cvtpd_epi64 (__m128d src);
```

## SIMD 浮点 例外

Invalid, Precision.

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".

Additionally:

```text
#UD                     If EVEX.vvvv != 1111B.
```
