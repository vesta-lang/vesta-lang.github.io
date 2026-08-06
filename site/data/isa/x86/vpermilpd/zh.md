---
summary: 双精度浮点 值的偶数
---

## 说明

(可变控制版本)

第一源操作数(第二操作数)中双精度浮点值的permute对,每对使用一个1位控制字段,居住在第二源操作数(第三操作数)的相应四字元件中. 被污染的结果被存储在目标操作数(第一个操作数)中.

控制位位于每个四字元素的比特0(见图5-24). 每个控件决定一个输入对中哪一个源元素被选定为目的地元素. 每对源元素必须位于与目的地相同的128位区域.

EVEX 版本 : 第二源操作数(第三代操作数)是一个ZMM/YMM/XMM的注册,一个512/256/128位内存位置或512/256/128位矢量从64位内存位置广播. 写掩码下的标致结果被写入目的地.

```text
                   SRC1  X3                  X2                                X1                 X0
```

```text
                   DEST  X2..X3              X2..X3                            X0..X1             X0..X1
```

图5-23. VPERMILPD 操作

VEX.256 编码版本 : 对应的ZMM注册被清零的位数(MAXVL-1:256).

```text
       255               194 193             127                               66 65   63             21  Bit
```

被忽略 被忽略

```text
                   ignored sel          ...       ignored sel                              ignored sel
```

```text
                   Control Field 4                   Control Field 2                            Control Field1
```

图5-24. VPERMILPD 摇摆控制

即时控制版本 : 第一源操作数(第二个操作数)中双精度浮点值的permute对,每对使用imm8字节中的1位控制字段. 目标操作数(第一个操作数)中的每个元素都使用imm8字节的一个单独的控制位.

VEX 版本 : 源操作数是一个YMM/XMM登记册或256/128位的内存位置,目标操作数是一个YMM/XMM登记册. Imm8字节作为permute控制字段提供了较低的4/2位.

EVEX 版本 : 源操作数(第二架操作数)是一个ZMM/YMM/XMM的收录器,512/256/128位内存位置或512/256/128位矢量从64位内存位置广播. 写掩码下的标致结果被写入目的地. Imm8字节作为permute控制字段提供了较低的8/4/2比特.

说明: 对于imm8版本,VEX.vvvv和EVEX.vvvv被保留,必须是1111b否则指令会

```text
#UD.
```

## 行动

```text
VPERMILPD (EVEX immediate versions)

(KL, VL) = (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF (EVEX.b = 1) AND (SRC1 *is memory*)

          THEN TMP_SRC1[i+63:i] := SRC1[63:0];

          ELSE TMP_SRC1[i+63:i] := SRC1[i+63:i];

     FI;

ENDFOR;

IF (imm8[0] = 0) THEN TMP_DEST[63:0] := SRC1[63:0]; FI;

IF (imm8[0] = 1) THEN TMP_DEST[63:0] := TMP_SRC1[127:64]; FI;

IF (imm8[1] = 0) THEN TMP_DEST[127:64] := TMP_SRC1[63:0]; FI;

IF (imm8[1] = 1) THEN TMP_DEST[127:64] := TMP_SRC1[127:64]; FI;

IF VL >= 256

     IF (imm8[2] = 0) THEN TMP_DEST[191:128] := TMP_SRC1[191:128]; FI;

     IF (imm8[2] = 1) THEN TMP_DEST[191:128] := TMP_SRC1[255:192]; FI;

     IF (imm8[3] = 0) THEN TMP_DEST[255:192] := TMP_SRC1[191:128]; FI;

     IF (imm8[3] = 1) THEN TMP_DEST[255:192] := TMP_SRC1[255:192]; FI;

FI;

IF VL >= 512

     IF (imm8[4] = 0) THEN TMP_DEST[319:256] := TMP_SRC1[319:256]; FI;

     IF (imm8[4] = 1) THEN TMP_DEST[319:256] := TMP_SRC1[383:320]; FI;

     IF (imm8[5] = 0) THEN TMP_DEST[383:320] := TMP_SRC1[319:256]; FI;

     IF (imm8[5] = 1) THEN TMP_DEST[383:320] := TMP_SRC1[383:320]; FI;

     IF (imm8[6] = 0) THEN TMP_DEST[447:384] := TMP_SRC1[447:384]; FI;

     IF (imm8[6] = 1) THEN TMP_DEST[447:384] := TMP_SRC1[511:448]; FI;

     IF (imm8[7] = 0) THEN TMP_DEST[511:448] := TMP_SRC1[447:384]; FI;

     IF (imm8[7] = 1) THEN TMP_DEST[511:448] := TMP_SRC1[511:448]; FI;

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*            ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                        ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VPERMILPD (256-bit immediate version)
IF (imm8[0] = 0) THEN DEST[63:0] := SRC1[63:0]
IF (imm8[0] = 1) THEN DEST[63:0] := SRC1[127:64]
IF (imm8[1] = 0) THEN DEST[127:64] := SRC1[63:0]
IF (imm8[1] = 1) THEN DEST[127:64] := SRC1[127:64]
IF (imm8[2] = 0) THEN DEST[191:128] := SRC1[191:128]
IF (imm8[2] = 1) THEN DEST[191:128] := SRC1[255:192]
IF (imm8[3] = 0) THEN DEST[255:192] := SRC1[191:128]
IF (imm8[3] = 1) THEN DEST[255:192] := SRC1[255:192]
DEST[MAXVL-1:256] := 0

VPERMILPD (128-bit immediate version)
IF (imm8[0] = 0) THEN DEST[63:0] := SRC1[63:0]
IF (imm8[0] = 1) THEN DEST[63:0] := SRC1[127:64]
IF (imm8[1] = 0) THEN DEST[127:64] := SRC1[63:0]
IF (imm8[1] = 1) THEN DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

VPERMILPD (EVEX variable versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0];
          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i];
    FI;
ENDFOR;

IF (TMP_SRC2[1] = 0) THEN TMP_DEST[63:0] := SRC1[63:0]; FI;
IF (TMP_SRC2[1] = 1) THEN TMP_DEST[63:0] := SRC1[127:64]; FI;
IF (TMP_SRC2[65] = 0) THEN TMP_DEST[127:64] := SRC1[63:0]; FI;
IF (TMP_SRC2[65] = 1) THEN TMP_DEST[127:64] := SRC1[127:64]; FI;
IF VL >= 256

    IF (TMP_SRC2[129] = 0) THEN TMP_DEST[191:128] := SRC1[191:128]; FI;
    IF (TMP_SRC2[129] = 1) THEN TMP_DEST[191:128] := SRC1[255:192]; FI;
    IF (TMP_SRC2[193] = 0) THEN TMP_DEST[255:192] := SRC1[191:128]; FI;
    IF (TMP_SRC2[193] = 1) THEN TMP_DEST[255:192] := SRC1[255:192]; FI;
FI;
IF VL >= 512
    IF (TMP_SRC2[257] = 0) THEN TMP_DEST[319:256] := SRC1[319:256]; FI;
    IF (TMP_SRC2[257] = 1) THEN TMP_DEST[319:256] := SRC1[383:320]; FI;
    IF (TMP_SRC2[321] = 0) THEN TMP_DEST[383:320] := SRC1[319:256]; FI;
    IF (TMP_SRC2[321] = 1) THEN TMP_DEST[383:320] := SRC1[383:320]; FI;
    IF (TMP_SRC2[385] = 0) THEN TMP_DEST[447:384] := SRC1[447:384]; FI;
    IF (TMP_SRC2[385] = 1) THEN TMP_DEST[447:384] := SRC1[511:448]; FI;
    IF (TMP_SRC2[449] = 0) THEN TMP_DEST[511:448] := SRC1[447:384]; FI;
    IF (TMP_SRC2[449] = 1) THEN TMP_DEST[511:448] := SRC1[511:448]; FI;
FI;

FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE


        IF *merging-masking*    ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE                ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPERMILPD (256-bit variable version)
IF (SRC2[1] = 0) THEN DEST[63:0] := SRC1[63:0]
IF (SRC2[1] = 1) THEN DEST[63:0] := SRC1[127:64]
IF (SRC2[65] = 0) THEN DEST[127:64] := SRC1[63:0]
IF (SRC2[65] = 1) THEN DEST[127:64] := SRC1[127:64]
IF (SRC2[129] = 0) THEN DEST[191:128] := SRC1[191:128]
IF (SRC2[129] = 1) THEN DEST[191:128] := SRC1[255:192]
IF (SRC2[193] = 0) THEN DEST[255:192] := SRC1[191:128]
IF (SRC2[193] = 1) THEN DEST[255:192] := SRC1[255:192]
DEST[MAXVL-1:256] := 0

VPERMILPD (128-bit variable version)
IF (SRC2[1] = 0) THEN DEST[63:0] := SRC1[63:0]
IF (SRC2[1] = 1) THEN DEST[63:0] := SRC1[127:64]
IF (SRC2[65] = 0) THEN DEST[127:64] := SRC1[63:0]
IF (SRC2[65] = 1) THEN DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VPERMILPD __m512d _mm512_permute_pd( __m512d a, int imm);
VPERMILPD __m512d _mm512_mask_permute_pd(__m512d s, __mmask8 k, __m512d a, int imm);
VPERMILPD __m512d _mm512_maskz_permute_pd( __mmask8 k, __m512d a, int imm);
VPERMILPD __m256d _mm256_mask_permute_pd(__m256d s, __mmask8 k, __m256d a, int imm);
VPERMILPD __m256d _mm256_maskz_permute_pd( __mmask8 k, __m256d a, int imm);
VPERMILPD __m128d _mm_mask_permute_pd(__m128d s, __mmask8 k, __m128d a, int imm);
VPERMILPD __m128d _mm_maskz_permute_pd( __mmask8 k, __m128d a, int imm);
VPERMILPD __m512d _mm512_permutevar_pd( __m512i i, __m512d a);
VPERMILPD __m512d _mm512_mask_permutevar_pd(__m512d s, __mmask8 k, __m512i i, __m512d a);
VPERMILPD __m512d _mm512_maskz_permutevar_pd( __mmask8 k, __m512i i, __m512d a);
VPERMILPD __m256d _mm256_mask_permutevar_pd(__m256d s, __mmask8 k, __m256d i, __m256d a);
VPERMILPD __m256d _mm256_maskz_permutevar_pd( __mmask8 k, __m256d i, __m256d a);
VPERMILPD __m128d _mm_mask_permutevar_pd(__m128d s, __mmask8 k, __m128d i, __m128d a);
VPERMILPD __m128d _mm_maskz_permutevar_pd( __mmask8 k, __m128d i, __m128d a);
VPERMILPD __m128d _mm_permute_pd (__m128d a, int control) VPERMILPD __m256d _mm256_permute_pd (__m256d a, int control) VPERMILPD __m128d _mm_permutevar_pd (__m128d a, __m128i control);
VPERMILPD __m256d _mm256_permutevar_pd (__m256d a, __m256i control);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

Additionally:

```text
#UD               If VEX.W = 1.
```

EVEX-encoded discription,参见表2-52,"Type E4NF类例外条件".

Additionally:

```text
#UD               If either (E)VEX.vvvv != 1111B and with imm8.
```
