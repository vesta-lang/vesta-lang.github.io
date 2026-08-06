---
summary: 解包和间隔高 打包单精度浮点值
---

## 说明

执行 第一源操作数 和 第二源操作数 的高 单精度浮点 值的互页解析。

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(ZMM注册点)没有修改. 当从 内存操作数 解开时,一个执行可能只获取适当的64位;然而,与 16 字节边界的对齐和正常的段检查仍然会被执行.

VEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 第二源操作数是一个YMM的寄存器或256位的内存位置. 第一源操作数和目标操作数是YMM登记册.

SRC1 X7  X6  X5  X4  X3                                                             X2  X1  X0

SRC2 Y7  Y6  Y5  Y4  Y3                                                             Y2  Y1  Y0

DEST Y7  X7  Y6  X6  Y3                                                             X3  Y2  X2

图4-27. VUNPCKHPS 操作

EVEX.512 编码版本 : 第一源操作数是一个ZMM登记册. 第二源操作数是一个ZMM寄存器,512位内存位置,或512位矢量从32位内存位置广播. 目标操作数是一个ZMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM寄存器,一个256位的内存位置,或者从32位的内存位置广播的256位矢量. 目标操作数是一个YMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM寄存器,一个128位的内存位置,或者从32位的内存位置广播128位的矢量. 目标操作数是一个XMM的寄存器,有条件的更新使用写掩码 k1.

## 行动

```text
VUNPCKHPS (EVEX Encoded Version When SRC2 is a Register)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF VL >= 128

    TMP_DEST[31:0] := SRC1[95:64]
    TMP_DEST[63:32] := SRC2[95:64]
    TMP_DEST[95:64] := SRC1[127:96]
    TMP_DEST[127:96] := SRC2[127:96]
FI;
IF VL >= 256
    TMP_DEST[159:128] := SRC1[223:192]
    TMP_DEST[191:160] := SRC2[223:192]
    TMP_DEST[223:192] := SRC1[255:224]
    TMP_DEST[255:224] := SRC2[255:224]
FI;
IF VL >= 512
    TMP_DEST[287:256] := SRC1[351:320]
    TMP_DEST[319:288] := SRC2[351:320]
    TMP_DEST[351:320] := SRC1[383:352]
    TMP_DEST[383:352] := SRC2[383:352]
    TMP_DEST[415:384] := SRC1[479:448]
    TMP_DEST[447:416] := SRC2[479:448]
    TMP_DEST[479:448] := SRC1[511:480]
    TMP_DEST[511:480] := SRC2[511:480]
FI;


FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VUNPCKHPS (EVEX Encoded Version When SRC2 is Memory)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF (EVEX.b = 1)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]

          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]

     FI;

ENDFOR;

IF VL >= 128

     TMP_DEST[31:0] := SRC1[95:64]

     TMP_DEST[63:32] := TMP_SRC2[95:64]

     TMP_DEST[95:64] := SRC1[127:96]

     TMP_DEST[127:96] := TMP_SRC2[127:96]

FI;

IF VL >= 256

     TMP_DEST[159:128] := SRC1[223:192]

     TMP_DEST[191:160] := TMP_SRC2[223:192]

     TMP_DEST[223:192] := SRC1[255:224]

     TMP_DEST[255:224] := TMP_SRC2[255:224]

FI;

IF VL >= 512

     TMP_DEST[287:256] := SRC1[351:320]

     TMP_DEST[319:288] := TMP_SRC2[351:320]

     TMP_DEST[351:320] := SRC1[383:352]

     TMP_DEST[383:352] := TMP_SRC2[383:352]

     TMP_DEST[415:384] := SRC1[479:448]

     TMP_DEST[447:416] := TMP_SRC2[479:448]

     TMP_DEST[479:448] := SRC1[511:480]

     TMP_DEST[511:480] := TMP_SRC2[511:480]

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+31:i] := 0


                FI;
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VUNPCKHPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[95:64]
DEST[63:32] := SRC2[95:64]
DEST[95:64] := SRC1[127:96]
DEST[127:96] := SRC2[127:96]
DEST[159:128] := SRC1[223:192]
DEST[191:160] := SRC2[223:192]
DEST[223:192] := SRC1[255:224]
DEST[255:224] := SRC2[255:224]
DEST[MAXVL-1:256] := 0

VUNPCKHPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[95:64]
DEST[63:32] := SRC2[95:64]
DEST[95:64] := SRC1[127:96]
DEST[127:96] := SRC2[127:96]
DEST[MAXVL-1:128] := 0

UNPCKHPS (128-bit Legacy SSE Version)
DEST[31:0] := SRC1[95:64]
DEST[63:32] := SRC2[95:64]
DEST[95:64] := SRC1[127:96]
DEST[127:96] := SRC2[127:96]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VUNPCKHPS __m512 _mm512_unpackhi_ps( __m512 a, __m512 b);
VUNPCKHPS __m512 _mm512_mask_unpackhi_ps(__m512 s, __mmask16 k, __m512 a, __m512 b);
VUNPCKHPS __m512 _mm512_maskz_unpackhi_ps(__mmask16 k, __m512 a, __m512 b);
VUNPCKHPS __m256 _mm256_unpackhi_ps (__m256 a, __m256 b);
VUNPCKHPS __m256 _mm256_mask_unpackhi_ps(__m256 s, __mmask8 k, __m256 a, __m256 b);
VUNPCKHPS __m256 _mm256_maskz_unpackhi_ps(__mmask8 k, __m256 a, __m256 b);
UNPCKHPS __m128 _mm_unpackhi_ps (__m128 a, __m128 b);
VUNPCKHPS __m128 _mm_mask_unpackhi_ps(__m128 s, __mmask8 k, __m128 a, __m128 b);
VUNPCKHPS __m128 _mm_maskz_unpackhi_ps(__mmask8 k, __m128 a, __m128 b);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded 指令,参见表2-21,"第4类例外条件".

EVEX-encoded 指令,参见表2-52,"Type E4NF class Exception Centers".
