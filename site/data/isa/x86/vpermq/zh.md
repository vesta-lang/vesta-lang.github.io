---
summary: 字词元素
---

## 说明

Imm8 版本 : 根据立即数操作数(第三个操作数)指定的指数,从源操作数(第二个操作数)到目标操作数(第一个操作数)的复制四字. 直接字节中的每个2位值在源操作数中选择一个qword元素.

VEX 版本 : 源操作数可以是YMM寄存器,也可以是内存位置寄存器. 对应目的地的比特(MAXVL-1:256)注册被清零.

在EVEX.512编码版本中,目的地的元素使用写掩码 k1进行更新,当控制位点从即刻产生时,imm8位点作为上256位点半的控制位点重新使用. 源操作数可以是ZMM寄存器,512位内存位置或512位向量从64位内存位置广播.

即时控制版本 : VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则会发出指示

```text
#UD.
```

矢量控制版本 : 根据第一源操作数(第二个操作数)中的指数,从第二源操作数(第三个操作数)到目标操作数(第一个操作数)的复制四字. 索引 操作数中每64位元素的前3位选择第二源操作数中哪个四字来复制. 第一个和第二个操作数是ZMM注册,第三个操作数可以是ZMM注册,512位内存位置或512位矢量从64位内存位置广播. 目的地的元素使用写掩码 k1更新.

请注意,本指令允许将 源操作数 中的 qword 复制到 目标操作数 中的多个位置.

如果VPERMPQ被用VEX.L=0或EVEX.128编码,试图执行指令将导致#UD例外.

## 行动

```text
VPERMQ (EVEX - imm8 control forms)


(KL, VL) = (4, 256), (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF (EVEX.b = 1) AND (SRC *is memory*)

          THEN TMP_SRC[i+63:i] := SRC[63:0];

          ELSE TMP_SRC[i+63:i] := SRC[i+63:i];

     FI;

ENDFOR;

     TMP_DEST[63:0] := (TMP_SRC[255:0] >> (IMM8[1:0] * 64))[63:0];

     TMP_DEST[127:64] := (TMP_SRC[255:0] >> (IMM8[3:2] * 64))[63:0];

     TMP_DEST[191:128] := (TMP_SRC[255:0] >> (IMM8[5:4] * 64))[63:0];

     TMP_DEST[255:192] := (TMP_SRC[255:0] >> (IMM8[7:6] * 64))[63:0];

IF VL >= 512

     TMP_DEST[319:256] := (TMP_SRC[511:256] >> (IMM8[1:0] * 64))[63:0];

     TMP_DEST[383:320] := (TMP_SRC[511:256] >> (IMM8[3:2] * 64))[63:0];

     TMP_DEST[447:384] := (TMP_SRC[511:256] >> (IMM8[5:4] * 64))[63:0];

     TMP_DEST[511:448] := (TMP_SRC[511:256] >> (IMM8[7:6] * 64))[63:0];

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE                      ; zeroing-masking

                       DEST[i+63:i] := 0                      ;zeroing-masking

                  FI;

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPERMQ (EVEX - vector control forms)
(KL, VL) = (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0];
          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i];
    FI;
ENDFOR;
IF VL = 256
    TMP_DEST[63:0] := (TMP_SRC2[255:0] >> (SRC1[1:0] * 64))[63:0];
    TMP_DEST[127:64] := (TMP_SRC2[255:0] >> (SRC1[65:64] * 64))[63:0];
    TMP_DEST[191:128] := (TMP_SRC2[255:0] >> (SRC1[129:128] * 64))[63:0];
    TMP_DEST[255:192] := (TMP_SRC2[255:0] >> (SRC1[193:192] * 64))[63:0];
FI;
IF VL = 512
    TMP_DEST[63:0] := (TMP_SRC2[511:0] >> (SRC1[2:0] * 64))[63:0];
    TMP_DEST[127:64] := (TMP_SRC2[511:0] >> (SRC1[66:64] * 64))[63:0];
    TMP_DEST[191:128] := (TMP_SRC2[511:0] >> (SRC1[130:128] * 64))[63:0];
    TMP_DEST[255:192] := (TMP_SRC2[511:0] >> (SRC1[194:192] * 64))[63:0];
    TMP_DEST[319:256] := (TMP_SRC2[511:0] >> (SRC1[258:256] * 64))[63:0];
    TMP_DEST[383:320] := (TMP_SRC2[511:0] >> (SRC1[322:320] * 64))[63:0];


     TMP_DEST[447:384] := (TMP_SRC2[511:0] >> (SRC1[386:384] * 64))[63:0];

     TMP_DEST[511:448] := (TMP_SRC2[511:0] >> (SRC1[450:448] * 64))[63:0];

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE                      ; zeroing-masking

                       DEST[i+63:i] := 0                      ;zeroing-masking

                  FI;

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPERMQ (VEX.256 encoded version)
DEST[63:0] := (SRC[255:0] >> (IMM8[1:0] * 64))[63:0];
DEST[127:64] := (SRC[255:0] >> (IMM8[3:2] * 64))[63:0];
DEST[191:128] := (SRC[255:0] >> (IMM8[5:4] * 64))[63:0];
DEST[255:192] := (SRC[255:0] >> (IMM8[7:6] * 64))[63:0];
DEST[MAXVL-1:256] := 0
```

## Intel C/C++ 内在编译器

```c
VPERMQ __m512i _mm512_permutex_epi64( __m512i a, int imm);
VPERMQ __m512i _mm512_mask_permutex_epi64(__m512i s, __mmask8 k, __m512i a, int imm);
VPERMQ __m512i _mm512_maskz_permutex_epi64( __mmask8 k, __m512i a, int imm);
VPERMQ __m512i _mm512_permutexvar_epi64( __m512i a, __m512i b);
VPERMQ __m512i _mm512_mask_permutexvar_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPERMQ __m512i _mm512_maskz_permutexvar_epi64( __mmask8 k, __m512i a, __m512i b);
VPERMQ __m256i _mm256_permutex_epi64( __m256i a, int imm);
VPERMQ __m256i _mm256_mask_permutex_epi64(__m256i s, __mmask8 k, __m256i a, int imm);
VPERMQ __m256i _mm256_maskz_permutex_epi64( __mmask8 k, __m256i a, int imm);
VPERMQ __m256i _mm256_permutexvar_epi64( __m256i a, __m256i b);
VPERMQ __m256i _mm256_mask_permutexvar_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPERMQ __m256i _mm256_maskz_permutexvar_epi64( __mmask8 k, __m256i a, __m256i b);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

Additionally:

```text
#UD               If VEX.L = 0.
```

If VEX.vvvv != 1111B.

EVEX-encoded discription,参见表2-52,"Type E4NF类例外条件".

Additionally:

```text
#UD               If encoded with EVEX.128.
```

如果 EVEX.vvvv != 1111B 并带有 imm8.
