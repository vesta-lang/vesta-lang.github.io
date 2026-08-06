---
summary: 将 打包双精度浮点值 转换为包装的单精度
---

## 说明

将 源操作数(第二个操作数)中的2,4或8个打包双精度浮点值转换为 目标操作数(第一个操作数)中的2,4或8个打包单精度浮点值.

当转换不准确时,返回的值按照MXCSR寄存器或嵌入式圆形控制位的圆形控制位进行四舍五入.

EVEX 编码版本 : 源操作数是一个ZMM/YMM/XMM的登记器,一个512/256/128位的内存位置,或者从64位的内存位置广播的512/256/128位矢量. 目标操作数是一个YMM/XMM/XMM(低64位)的注册,有条件更新使用写掩码 k1. 上位(MAXVL - 1:256/128/64)对应目的地被清零.

VEX.256 编码版本 : 源操作数是一个YMM寄存器或256位内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

VEX.128 编码版本 : 源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:64).

128位遗产 SSE 版本 : 源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 目的地的比特[127:64] XMM注册被清零. 然而,对应的ZMM注册目的地的上位位(MAXVL-1:128)没有修改.

VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

```text
                 SRC     X3                 X2                 X1          X0
```

```text
                 DEST                    0              X3         X2  X1      X0
```

图3-8. VCVTPD2PS(VEX.256编码版本)

## 行动

```text
VCVTPD2PS (EVEX Encoded Version) When SRC Operand is a Register
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF (VL = 512) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

i := j * 32

k := j * 64

IF k1[j] OR *no writemask*

     THEN

             DEST[i+31:i] := Convert_Double_Precision_Floating_Point_To_Single_Precision_Floating_Point(SRC[k+63:k])

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                       ; zeroing-masking

                      DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0


VCVTPD2PS (EVEX Encoded Version) When SRC Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

k := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1)

                  THEN

                    DEST[i+31:i] :=Convert_Double_Precision_Floating_Point_To_Single_Precision_Floating_Point(SRC[63:0])

                  ELSE

                    DEST[i+31:i] := Convert_Double_Precision_Floating_Point_To_Single_Precision_Floating_Point(SRC[k+63:k])

             FI;

     ELSE

             IF *merging-masking*      ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                 ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0

VCVTPD2PS (VEX.256 Encoded Version)
DEST[31:0] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[63:0])
DEST[63:32] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[127:64])
DEST[95:64] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[191:128])
DEST[127:96] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[255:192)
DEST[MAXVL-1:128] := 0

VCVTPD2PS (VEX.128 Encoded Version)
DEST[31:0] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[63:0])
DEST[63:32] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[127:64])
DEST[MAXVL-1:64] := 0

CVTPD2PS (128-bit Legacy SSE Version)
DEST[31:0] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[63:0])
DEST[63:32] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[127:64])
DEST[127:64] := 0
DEST[MAXVL-1:128] (unmodified)
```

## Intel C/C++ 内在编译器

```c
VCVTPD2PS __m256 _mm512_cvtpd_ps( __m512d a);
VCVTPD2PS __m256 _mm512_mask_cvtpd_ps( __m256 s, __mmask8 k, __m512d a);
VCVTPD2PS __m256 _mm512_maskz_cvtpd_ps( __mmask8 k, __m512d a);
VCVTPD2PS __m256 _mm512_cvt_roundpd_ps( __m512d a, int r);
VCVTPD2PS __m256 _mm512_mask_cvt_roundpd_ps( __m256 s, __mmask8 k, __m512d a, int r);
VCVTPD2PS __m256 _mm512_maskz_cvt_roundpd_ps( __mmask8 k, __m512d a, int r);
VCVTPD2PS __m128 _mm256_mask_cvtpd_ps( __m128 s, __mmask8 k, __m256d a);
VCVTPD2PS __m128 _mm256_maskz_cvtpd_ps( __mmask8 k, __m256d a);
VCVTPD2PS __m128 _mm_mask_cvtpd_ps( __m128 s, __mmask8 k, __m128d a);
VCVTPD2PS __m128 _mm_maskz_cvtpd_ps( __mmask8 k, __m128d a);
VCVTPD2PS __m128 _mm256_cvtpd_ps (__m256d a) CVTPD2PS __m128 _mm_cvtpd_ps (__m128d a);
```

## SIMD 浮点 例外

Invalid, Precision, Underflow, Overflow, Denormal.

## 其他例外

VEX-encoded指令,参见表2-19"第2类例外条件".

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".

Additionally:     If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.

```text
#UD
```
