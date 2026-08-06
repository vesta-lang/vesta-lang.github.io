---
summary: 解包和间隔高 打包双精度浮点值
---

## 说明

执行 第一源操作数 和 第二源操作数 的高 双精度浮点 值的互页解析。 参见Intel(R)64和IA-32架构软件开发者手册第2B卷中的图4-15.

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(ZMM注册点)没有修改. 当从 内存操作数 解开时,一个执行可能只获取适当的64位;然而,与 16 字节边界的对齐和正常的段检查仍然会被执行.

VEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册.

EVEX.512 编码版本 : 第一源操作数是一个ZMM登记册. 第二源操作数是一个ZMM寄存器,512位内存位置,或512位矢量从64位内存位置广播. 目标操作数是一个ZMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器,256位的内存位置,或由64位的内存位置广播的256位矢量. 目标操作数是一个YMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM寄存器,一个128位的内存位置,或者从64位的内存位置广播128位的矢量. 目标操作数是一个XMM的寄存器,有条件的更新使用写掩码 k1.

## 行动

```text
VUNPCKHPD (EVEX Encoded Versions When SRC2 is a Register)

(KL, VL) = (2, 128), (4, 256), (8, 512)

IF VL >= 128

     TMP_DEST[63:0] := SRC1[127:64]

     TMP_DEST[127:64] := SRC2[127:64]

FI;

IF VL >= 256

     TMP_DEST[191:128] := SRC1[255:192]

     TMP_DEST[255:192] := SRC2[255:192]

FI;

IF VL >= 512

     TMP_DEST[319:256] := SRC1[383:320]

     TMP_DEST[383:320] := SRC2[383:320]

     TMP_DEST[447:384] := SRC1[511:448]

     TMP_DEST[511:448] := SRC2[511:448]

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VUNPCKHPD (EVEX Encoded Version When SRC2 is Memory)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF (EVEX.b = 1)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0]
          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i]
    FI;
ENDFOR;
IF VL >= 128
    TMP_DEST[63:0] := SRC1[127:64]
    TMP_DEST[127:64] := TMP_SRC2[127:64]
FI;
IF VL >= 256
    TMP_DEST[191:128] := SRC1[255:192]
    TMP_DEST[255:192] := TMP_SRC2[255:192]
FI;
IF VL >= 512
    TMP_DEST[319:256] := SRC1[383:320]
    TMP_DEST[383:320] := TMP_SRC2[383:320]
    TMP_DEST[447:384] := SRC1[511:448]
    TMP_DEST[511:448] := TMP_SRC2[511:448]
FI;

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VUNPCKHPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[127:64]
DEST[127:64] := SRC2[127:64]
DEST[191:128] := SRC1[255:192]
DEST[255:192] := SRC2[255:192]
DEST[MAXVL-1:256] := 0

VUNPCKHPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[127:64]
DEST[127:64] := SRC2[127:64]
DEST[MAXVL-1:128] := 0

UNPCKHPD (128-bit Legacy SSE Version)
DEST[63:0] := SRC1[127:64]
DEST[127:64] := SRC2[127:64]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VUNPCKHPD __m512d _mm512_unpackhi_pd( __m512d a, __m512d b);
VUNPCKHPD __m512d _mm512_mask_unpackhi_pd(__m512d s, __mmask8 k, __m512d a, __m512d b);
VUNPCKHPD __m512d _mm512_maskz_unpackhi_pd(__mmask8 k, __m512d a, __m512d b);
VUNPCKHPD __m256d _mm256_unpackhi_pd(__m256d a, __m256d b) VUNPCKHPD __m256d _mm256_mask_unpackhi_pd(__m256d s, __mmask8 k, __m256d a, __m256d b);
VUNPCKHPD __m256d _mm256_maskz_unpackhi_pd(__mmask8 k, __m256d a, __m256d b);
UNPCKHPD __m128d _mm_unpackhi_pd(__m128d a, __m128d b) VUNPCKHPD __m128d _mm_mask_unpackhi_pd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VUNPCKHPD __m128d _mm_maskz_unpackhi_pd(__mmask8 k, __m128d a, __m128d b);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded 指令,参见表2-21,"第4类例外条件".

EVEX-encoded 指令,参见表2-52,"Type E4NF class Exception Centers".
