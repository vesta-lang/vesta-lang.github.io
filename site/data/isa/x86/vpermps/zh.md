---
summary: 永久 单精度浮点 元素
---

## 说明

根据第一源操作数(第二代操作数)中的指数,将第二源操作数(第三代操作数)到目标操作数(第一代操作数)的数值复制为单精度浮点的双字元素. 请注意,本指令允许将源操作数中的双字复制到目标操作数中多个位置.

VEX.256 版本 : 第一个和第二个操作数是YMM登记册,第三个操作数可以是YMM登记册或内存位置. 对应目的地的比特(MAXVL-1:256)注册被清零.

EVEX 编码版本 : 第一个和第二个操作数是ZMM注册,第三个操作数可以是ZMM注册,512位内存位置或512位矢量从32位内存位置广播. 目的地的元素使用写掩码 k1更新.

如果 VPERMPS 以 VEX.L = 0 编码,试图执行以 VEX.L = 0 编码的指令将会导致

```text
#UD exception.
```

## 行动

```text
VPERMPS (EVEX forms)
(KL, VL) (8, 256),= (16, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0];
          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i];
    FI;
ENDFOR;

IF VL = 256
    TMP_DEST[31:0] := (TMP_SRC2[255:0] >> (SRC1[2:0] * 32))[31:0];
    TMP_DEST[63:32] := (TMP_SRC2[255:0] >> (SRC1[34:32] * 32))[31:0];
    TMP_DEST[95:64] := (TMP_SRC2[255:0] >> (SRC1[66:64] * 32))[31:0];
    TMP_DEST[127:96] := (TMP_SRC2[255:0] >> (SRC1[98:96] * 32))[31:0];
    TMP_DEST[159:128] := (TMP_SRC2[255:0] >> (SRC1[130:128] * 32))[31:0];
    TMP_DEST[191:160] := (TMP_SRC2[255:0] >> (SRC1[162:160] * 32))[31:0];
    TMP_DEST[223:192] := (TMP_SRC2[255:0] >> (SRC1[193:192] * 32))[31:0];


     TMP_DEST[255:224] := (TMP_SRC2[255:0] >> (SRC1[226:224] * 32))[31:0];

FI;

IF VL = 512

     TMP_DEST[31:0] := (TMP_SRC2[511:0] >> (SRC1[3:0] * 32))[31:0];

     TMP_DEST[63:32] := (TMP_SRC2[511:0] >> (SRC1[35:32] * 32))[31:0];

     TMP_DEST[95:64] := (TMP_SRC2[511:0] >> (SRC1[67:64] * 32))[31:0];

     TMP_DEST[127:96] := (TMP_SRC2[511:0] >> (SRC1[99:96] * 32))[31:0];

     TMP_DEST[159:128] := (TMP_SRC2[511:0] >> (SRC1[131:128] * 32))[31:0];

     TMP_DEST[191:160] := (TMP_SRC2[511:0] >> (SRC1[163:160] * 32))[31:0];

     TMP_DEST[223:192] := (TMP_SRC2[511:0] >> (SRC1[195:192] * 32))[31:0];

     TMP_DEST[255:224] := (TMP_SRC2[511:0] >> (SRC1[227:224] * 32))[31:0];

     TMP_DEST[287:256] := (TMP_SRC2[511:0] >> (SRC1[259:256] * 32))[31:0];

     TMP_DEST[319:288] := (TMP_SRC2[511:0] >> (SRC1[291:288] * 32))[31:0];

     TMP_DEST[351:320] := (TMP_SRC2[511:0] >> (SRC1[323:320] * 32))[31:0];

     TMP_DEST[383:352] := (TMP_SRC2[511:0] >> (SRC1[355:352] * 32))[31:0];

     TMP_DEST[415:384] := (TMP_SRC2[511:0] >> (SRC1[387:384] * 32))[31:0];

     TMP_DEST[447:416] := (TMP_SRC2[511:0] >> (SRC1[419:416] * 32))[31:0];

     TMP_DEST[479:448] :=(TMP_SRC2[511:0] >> (SRC1[451:448] * 32))[31:0];

     TMP_DEST[511:480] := (TMP_SRC2[511:0] >> (SRC1[483:480] * 32))[31:0];

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE                      ; zeroing-masking

                       DEST[i+31:i] := 0                      ;zeroing-masking

                  FI;

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPERMPS (VEX.256 encoded version)
DEST[31:0] := (SRC2[255:0] >> (SRC1[2:0] * 32))[31:0];
DEST[63:32] := (SRC2[255:0] >> (SRC1[34:32] * 32))[31:0];
DEST[95:64] := (SRC2[255:0] >> (SRC1[66:64] * 32))[31:0];
DEST[127:96] := (SRC2[255:0] >> (SRC1[98:96] * 32))[31:0];
DEST[159:128] := (SRC2[255:0] >> (SRC1[130:128] * 32))[31:0];
DEST[191:160] := (SRC2[255:0] >> (SRC1[162:160] * 32))[31:0];
DEST[223:192] := (SRC2[255:0] >> (SRC1[194:192] * 32))[31:0];
DEST[255:224] := (SRC2[255:0] >> (SRC1[226:224] * 32))[31:0];
DEST[MAXVL-1:256] := 0
```

## Intel C/C++ 内在编译器

```c
VPERMPS __m512 _mm512_permutexvar_ps(__m512i i, __m512 a);
VPERMPS __m512 _mm512_mask_permutexvar_ps(__m512 s, __mmask16 k, __m512i i, __m512 a);
VPERMPS __m512 _mm512_maskz_permutexvar_ps( __mmask16 k, __m512i i, __m512 a);
VPERMPS __m256 _mm256_permutexvar_ps(__m256 i, __m256 a);
VPERMPS __m256 _mm256_mask_permutexvar_ps(__m256 s, __mmask8 k, __m256 i, __m256 a);
VPERMPS __m256 _mm256_maskz_permutexvar_ps( __mmask8 k, __m256 i, __m256 a);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

Additionally:

```text
#UD               If VEX.L = 0.
```

EVEX-encoded discription,参见表2-52,"Type E4NF类例外条件".
