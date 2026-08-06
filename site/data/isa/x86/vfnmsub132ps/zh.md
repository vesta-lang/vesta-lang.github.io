---
summary: 引信负数乘以
---

## 说明

VFNMSUB132PS : (英语). 将第一源操作数中的四,八或十六打包单精度浮点值乘以第三源操作数中的四,八或十六打包单精度浮点值. 从否定的无限精确中间结果中减去第二源操作数中的四,八或十六个打包单精度浮点值,进行四舍五入,并将所产生的四,八或十六个打包单精度浮点值存储到目标操作数(第一源操作数).

VFNMSUB213PS : (英语). 将第二源操作数中的四,八或十六打包单精度浮点值乘以第一源操作数中的四,八或十六打包单精度浮点值. 从否定的无限精确中间结果中减去第三源操作数中的四,八或十六打包单精度浮点值,进行四舍五入,并将由此产生的四,八或十六打包单精度浮点值存储到目标操作数(第一源操作数).

VFNMSUB231PS : (英语). 将四,八或十六打包单精度浮点值从第二来源乘以第三 源操作数中的四,八或十六打包单精度浮点值. 从否定的无限精度中间结果中,减去第一源操作数中四,八或十六包单精度浮点值,进行四舍五入,并将所产生的四,八或十六打包单精度浮点值存储到目标操作数(第一源操作数).

EVEX 编码版本 : 目标操作数(也是第一源操作数)和第二源操作数是ZMM/YMM/XMM登记册. 第三个源操作数是一个ZMM/YMM/XMM注册,一个512/256/128位内存位置或512/256/128位矢量从32位内存位置广播. 目标操作数是有条件更新的,带有写面具k1.

VEX.256 编码版本 : 目标操作数(也是第一源操作数)是一个YMM的注册,并在reg field中编码. 第二源操作数是一个YMM的寄存器,编码为VEX.vvvv. 第三个源操作数是一个YMM寄存器或256位内存位置,并在rm field中编码.

VEX.128 编码版本 : 目标操作数(也是第一源操作数)是一个XMM的注册,并在reg field中编码. 第二源操作数是一个XMM的寄存器,编码为VEX.vvvv. 第三个源操作数是一个XMM寄存器或128位内存位置,并在rm field中编码. YMM目的地的上方128位注册被清零.

## 行动

```text
In the operations below, "*" and "-" symbols represent multiplication and subtraction with infinite precision inputs and outputs (no
rounding).


VFNMSUB132PS DEST, SRC2, SRC3 (VEX encoded version)
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM-1 {

    n := 32*i;
    DEST[n+31:n] := RoundFPControl_MXCSR( - (DEST[n+31:n]*SRC3[n+31:n]) - SRC2[n+31:n])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFNMSUB213PS DEST, SRC2, SRC3 (VEX encoded version)
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM-1 {

    n := 32*i;
    DEST[n+31:n] := RoundFPControl_MXCSR( - (SRC2[n+31:n]*DEST[n+31:n]) - SRC3[n+31:n])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFNMSUB231PS DEST, SRC2, SRC3 (VEX encoded version)
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM-1 {

    n := 32*i;
    DEST[n+31:n] := RoundFPControl_MXCSR( - (SRC2[n+31:n]*SRC3[n+31:n]) - DEST[n+31:n])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI


VFNMSUB132PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

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

                  RoundFPControl(-(DEST[i+31:i]*SRC3[i+31:i]) - SRC2[i+31:i])

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFNMSUB132PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF (EVEX.b = 1)

                       THEN

                       DEST[i+31:i] :=

                  RoundFPControl_MXCSR(-(DEST[i+31:i]*SRC3[31:0]) - SRC2[i+31:i])

                       ELSE

                       DEST[i+31:i] :=

                  RoundFPControl_MXCSR(-(DEST[i+31:i]*SRC3[i+31:i]) - SRC2[i+31:i])

                  FI;

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VFNMSUB213PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

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

                  RoundFPControl_MXCSR(-(SRC2[i+31:i]*DEST[i+31:i]) - SRC3[i+31:i])

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFNMSUB213PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF (EVEX.b = 1)

                       THEN

                       DEST[i+31:i] :=

                  RoundFPControl_MXCSR(-(SRC2[i+31:i]*DEST[i+31:i]) - SRC3[31:0])

                       ELSE

                       DEST[i+31:i] :=

                  RoundFPControl_MXCSR(-(SRC2[i+31:i]*DEST[i+31:i]) - SRC3[i+31:i])

                  FI;

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VFNMSUB231PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

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

                  RoundFPControl_MXCSR(-(SRC2[i+31:i]*SRC3[i+31:i]) - DEST[i+31:i])

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFNMSUB231PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF (EVEX.b = 1)

                       THEN

                       DEST[i+31:i] :=

                  RoundFPControl_MXCSR(-(SRC2[i+31:i]*SRC3[31:0]) - DEST[i+31:i])

                       ELSE

                       DEST[i+31:i] :=

                  RoundFPControl_MXCSR(-(SRC2[i+31:i]*SRC3[i+31:i]) - DEST[i+31:i])

                  FI;

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VFNMSUBxxxPS __m512 _mm512_fnmsub_ps(__m512 a, __m512 b, __m512 c);
VFNMSUBxxxPS __m512 _mm512_fnmsub_round_ps(__m512 a, __m512 b, __m512 c, int r);
VFNMSUBxxxPS __m512 _mm512_mask_fnmsub_ps(__m512 a, __mmask16 k, __m512 b, __m512 c);
VFNMSUBxxxPS __m512 _mm512_maskz_fnmsub_ps(__mmask16 k, __m512 a, __m512 b, __m512 c);
VFNMSUBxxxPS __m512 _mm512_mask3_fnmsub_ps(__m512 a, __m512 b, __m512 c, __mmask16 k);
VFNMSUBxxxPS __m512 _mm512_mask_fnmsub_round_ps(__m512 a, __mmask16 k, __m512 b, __m512 c, int r);
VFNMSUBxxxPS __m512 _mm512_maskz_fnmsub_round_ps(__mmask16 k, __m512 a, __m512 b, __m512 c, int r);
VFNMSUBxxxPS __m512 _mm512_mask3_fnmsub_round_ps(__m512 a, __m512 b, __m512 c, __mmask16 k, int r);
VFNMSUBxxxPS __m256 _mm256_mask_fnmsub_ps(__m256 a, __mmask8 k, __m256 b, __m256 c);
VFNMSUBxxxPS __m256 _mm256_maskz_fnmsub_ps(__mmask8 k, __m256 a, __m256 b, __m256 c);
VFNMSUBxxxPS __m256 _mm256_mask3_fnmsub_ps(__m256 a, __m256 b, __m256 c, __mmask8 k);
VFNMSUBxxxPS __m128 _mm_mask_fnmsub_ps(__m128 a, __mmask8 k, __m128 b, __m128 c);
VFNMSUBxxxPS __m128 _mm_maskz_fnmsub_ps(__mmask8 k, __m128 a, __m128 b, __m128 c);
VFNMSUBxxxPS __m128 _mm_mask3_fnmsub_ps(__m128 a, __m128 b, __m128 c, __mmask8 k);
VFNMSUBxxxPS __m128 _mm_fnmsub_ps (__m128 a, __m128 b, __m128 c);
VFNMSUBxxxPS __m256 _mm256_fnmsub_ps (__m256 a, __m256 b, __m256 c);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

VEX-encoded指令,参见表2-19,"第2类例外条件". EVEX-encoded指令,参见表2-48,"第E2类例外条件".
