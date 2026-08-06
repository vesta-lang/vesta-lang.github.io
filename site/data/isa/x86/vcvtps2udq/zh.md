---
summary: 将 打包单精度浮点值 转换为无符号包装
---

## 说明

将 源操作数 中的十六 打包单精度浮点值 转换为 目标操作数 中的十六个无符号双字整数.

当转换不准确时,返回的值按照MXCSR寄存器或嵌入式圆形控制位的圆形控制位进行四舍五入. 如果转换后的结果不能以目的格式表示,则提高 浮点 无效例外,如果掩盖了这个例外,则返回整数值 FFFFFFFFH.

源操作数是一个ZMM/YMM/XMM的登记器,一个512/256/128位的内存位置,或者从32位的内存位置广播的512/256/128位矢量. 目标操作数是一个ZMM/YMM/XMM的登记册,有条件的更新有写掩码 k1.

说明: EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VCVTPS2UDQ (EVEX Encoded Versions) When SRC Operand is a Register
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

             Convert_Single_Precision_Floating_Point_To_UInteger(SRC[i+31:i])

     ELSE

             IF *merging-masking*      ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                 ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VCVTPS2UDQ (EVEX Encoded Versions) When SRC Operand is a Memory Source
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no *

     THEN

             IF (EVEX.b = 1)

                  THEN

                    DEST[i+31:i] :=

             Convert_Single_Precision_Floating_Point_To_UInteger(SRC[31:0])

                  ELSE

                    DEST[i+31:i] :=

             Convert_Single_Precision_Floating_Point_To_UInteger(SRC[i+31:i])

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
VCVTPS2UDQ __m512i _mm512_cvtps_epu32( __m512 a);
VCVTPS2UDQ __m512i _mm512_mask_cvtps_epu32( __m512i s, __mmask16 k, __m512 a);
VCVTPS2UDQ __m512i _mm512_maskz_cvtps_epu32( __mmask16 k, __m512 a);
VCVTPS2UDQ __m512i _mm512_cvt_roundps_epu32( __m512 a, int r);
VCVTPS2UDQ __m512i _mm512_mask_cvt_roundps_epu32( __m512i s, __mmask16 k, __m512 a, int r);
VCVTPS2UDQ __m512i _mm512_maskz_cvt_roundps_epu32( __mmask16 k, __m512 a, int r);
VCVTPS2UDQ __m256i _mm256_cvtps_epu32( __m256d a);
VCVTPS2UDQ __m256i _mm256_mask_cvtps_epu32( __m256i s, __mmask8 k, __m256 a);
VCVTPS2UDQ __m256i _mm256_maskz_cvtps_epu32( __mmask8 k, __m256 a);
VCVTPS2UDQ __m128i _mm_cvtps_epu32( __m128 a);
VCVTPS2UDQ __m128i _mm_mask_cvtps_epu32( __m128i s, __mmask8 k, __m128 a);
VCVTPS2UDQ __m128i _mm_maskz_cvtps_epu32( __mmask8 k, __m128 a);
```

## SIMD 浮点 例外

Invalid, Precision.

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
