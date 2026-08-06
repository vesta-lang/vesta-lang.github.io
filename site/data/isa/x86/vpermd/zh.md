---
summary: 永久包装双字/字元
---

## 说明

根据第一源操作数(第二个操作数)中的指数,从第二源操作数(第三个操作数)到目标操作数(第一个操作数)的复制双字(或单字). 请注意,本指令允许将源操作数中的双字(字)复制到目标操作数中多个位置.

VEX.256 编码为 VPERMD : 第一个和第二个操作数是YMM登记册,第三个操作数可以是YMM登记册或内存位置. 对应目的地的比特(MAXVL-1:256)注册被清零.

EVEX 编码为 VPERMD : 第一个和第二个操作数是ZMM/YMM登记器,第三个操作数可以是ZMM/YMM登记器,512/256位内存位置或512/256位矢量通过32位内存位置广播. 目的地的元素使用写掩码 k1更新.

VPERMW:第一和第二个操作数是ZMM/YMM/XMM登记册,第三个操作数可以是ZMM/YMM/XMM登记册,或者512/256/128-bit 内存位置. 目的地使用写掩码 k1更新.

EVEX.128 编码版本 : 对应的ZMM注册被清零的位数(MAXVL-1:128).

## 行动

```text
VPERMD (EVEX encoded versions)

(KL, VL) = (8, 256), (16, 512)

IF VL = 256 THEN n := 2; FI;

IF VL = 512 THEN n := 3; FI;

FOR j := 0 TO KL-1

i := j * 32

id := 32*SRC1[i+n:i]

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+31:i] := SRC2[31:0];

                  ELSE DEST[i+31:i] := SRC2[id+31:id];

             FI;

     ELSE

             IF *merging-masking*          ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                     ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPERMD (VEX.256 encoded version)
DEST[31:0] := (SRC2[255:0] >> (SRC1[2:0] * 32))[31:0];
DEST[63:32] := (SRC2[255:0] >> (SRC1[34:32] * 32))[31:0];
DEST[95:64] := (SRC2[255:0] >> (SRC1[66:64] * 32))[31:0];
DEST[127:96] := (SRC2[255:0] >> (SRC1[98:96] * 32))[31:0];
DEST[159:128] := (SRC2[255:0] >> (SRC1[130:128] * 32))[31:0];
DEST[191:160] := (SRC2[255:0] >> (SRC1[162:160] * 32))[31:0];
DEST[223:192] := (SRC2[255:0] >> (SRC1[194:192] * 32))[31:0];
DEST[255:224] := (SRC2[255:0] >> (SRC1[226:224] * 32))[31:0];
DEST[MAXVL-1:256] := 0

VPERMW (EVEX encoded versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

IF VL = 128 THEN n := 2; FI;

IF VL = 256 THEN n := 3; FI;

IF VL = 512 THEN n := 4; FI;

FOR j := 0 TO KL-1

i := j * 16

id := 16*SRC1[i+n:i]

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SRC2[id+15:id]

     ELSE

             IF *merging-masking*          ; merging-masking

                  THEN *DEST[i+15:i] remains unchanged*

                  ELSE                     ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPERMD __m512i _mm512_permutexvar_epi32( __m512i idx, __m512i a);
VPERMD __m512i _mm512_mask_permutexvar_epi32(__m512i s, __mmask16 k, __m512i idx, __m512i a);
VPERMD __m512i _mm512_maskz_permutexvar_epi32( __mmask16 k, __m512i idx, __m512i a);
VPERMD __m256i _mm256_permutexvar_epi32( __m256i idx, __m256i a);
VPERMD __m256i _mm256_mask_permutexvar_epi32(__m256i s, __mmask8 k, __m256i idx, __m256i a);
VPERMD __m256i _mm256_maskz_permutexvar_epi32( __mmask8 k, __m256i idx, __m256i a);
VPERMW __m512i _mm512_permutexvar_epi16( __m512i idx, __m512i a);
VPERMW __m512i _mm512_mask_permutexvar_epi16(__m512i s, __mmask32 k, __m512i idx, __m512i a);
VPERMW __m512i _mm512_maskz_permutexvar_epi16( __mmask32 k, __m512i idx, __m512i a);
VPERMW __m256i _mm256_permutexvar_epi16( __m256i idx, __m256i a);
VPERMW __m256i _mm256_mask_permutexvar_epi16(__m256i s, __mmask16 k, __m256i idx, __m256i a);
VPERMW __m256i _mm256_maskz_permutexvar_epi16( __mmask16 k, __m256i idx, __m256i a);
VPERMW __m128i _mm_permutexvar_epi16( __m128i idx, __m128i a);
VPERMW __m128i _mm_mask_permutexvar_epi16(__m128i s, __mmask8 k, __m128i idx, __m128i a);
VPERMW __m128i _mm_maskz_permutexvar_epi16( __mmask8 k, __m128i idx, __m128i a);
```

## SIMD 浮点 例外

None

## 其他例外

无EVEX-编码指令,见表2-21,"第4类例外条件"。EVEX- 编码VPERMD,见表2-52,"TypeE4NF阶级例外条件".EVEX- 编码VPERMW类型E4NF.nb表2-52中的"类型"E4NF阶级例外条件".

Additionally:

```text
#UD               If VEX.L = 0.
```

If EVEX.L'L = 0 for VPERMD.
