---
summary: 对齐双字/四字矢量
---

## 说明

将第一源操作数(第二代操作数)和第二源操作数(第三代操作数)的右双字/quadword元素调和并转换为1024/512/256位中间向量. 中间向量的低512/256/128位被写成目标操作数(第一个操作数),使用写掩码 k1. 目的地和第一个源操作数是ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位矢量从32/64位内存位置播出.

此指令被写入, 因此只有那些在矢量掩码中的对应比特设置的元素 k1 被计算并存储到 zmm1 中. 在 zmm1 中,在 k1 中具有相应的比特清晰的元素保留其先前的值(merging-masking)或被设定为 0(0ing-masking).

## 行动

```text
VALIGND (EVEX Encoded Versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (SRC2 *is memory*) (AND EVEX.b = 1)

     THEN

          FOR j := 0 TO KL-1

                  i := j * 32

                  src[i+31:i] := SRC2[31:0]

          ENDFOR;

     ELSE src := SRC2

FI

; Concatenate sources

tmp[VL-1:0] := src[VL-1:0]

tmp[2VL-1:VL] := SRC1[VL-1:0]

; Shift right doubleword elements

IF VL = 128

     THEN SHIFT = imm8[1:0]

     ELSE

          IF VL = 256

                  THEN SHIFT = imm8[2:0]

                  ELSE SHIFT = imm8[3:0]

          FI

FI;

tmp[2VL-1:0] := tmp[2VL-1:0] >> (32*SHIFT)

; Apply writemask

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := tmp[i+31:i]

          ELSE

                  IF *merging-masking*            ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                        ; zeroing-masking

                               DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VALIGNQ (EVEX Encoded Versions)
(KL, VL) = (2, 128), (4, 256),(8, 512)
IF (SRC2 *is memory*) (AND EVEX.b = 1)

    THEN
          FOR j := 0 TO KL-1
                i := j * 64
                src[i+63:i] := SRC2[63:0]
          ENDFOR;

    ELSE src := SRC2
FI
; Concatenate sources
tmp[VL-1:0] := src[VL-1:0]
tmp[2VL-1:VL] := SRC1[VL-1:0]
; Shift right quadword elements


IF VL = 128

     THEN SHIFT = imm8[0]

     ELSE

          IF VL = 256

                  THEN SHIFT = imm8[1:0]

                  ELSE SHIFT = imm8[2:0]

          FI

FI;

tmp[2VL-1:0] := tmp[2VL-1:0] >> (64*SHIFT)

; Apply writemask

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := tmp[i+63:i]

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                       DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VALIGND __m512i _mm512_alignr_epi32( __m512i a, __m512i b, int cnt);
VALIGND __m512i _mm512_mask_alignr_epi32(__m512i s, __mmask16 k, __m512i a, __m512i b, int cnt);
VALIGND __m512i _mm512_maskz_alignr_epi32( __mmask16 k, __m512i a, __m512i b, int cnt);
VALIGND __m256i _mm256_mask_alignr_epi32(__m256i s, __mmask8 k, __m256i a, __m256i b, int cnt);
VALIGND __m256i _mm256_maskz_alignr_epi32( __mmask8 k, __m256i a, __m256i b, int cnt);
VALIGND __m128i _mm_mask_alignr_epi32(__m128i s, __mmask8 k, __m128i a, __m128i b, int cnt);
VALIGND __m128i _mm_maskz_alignr_epi32( __mmask8 k, __m128i a, __m128i b, int cnt);
VALIGNQ __m512i _mm512_alignr_epi64( __m512i a, __m512i b, int cnt);
VALIGNQ __m512i _mm512_mask_alignr_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b, int cnt);
VALIGNQ __m512i _mm512_maskz_alignr_epi64( __mmask8 k, __m512i a, __m512i b, int cnt);
VALIGNQ __m256i _mm256_mask_alignr_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b, int cnt);
VALIGNQ __m256i _mm256_maskz_alignr_epi64( __mmask8 k, __m256i a, __m256i b, int cnt);
VALIGNQ __m128i _mm_mask_alignr_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b, int cnt);
VALIGNQ __m128i _mm_maskz_alignr_epi64( __mmask8 k, __m128i a, __m128i b, int cnt);
```
