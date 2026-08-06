---
summary: 用符号扩展包装移动
---

## 说明

遗留和VEX编码版本: 被包装的字节,单词,或dword整数在源操作符(第二个操作符)的低字节中的符号扩展为单词,dword,或四字整数,并存储在被包装的签名字节中,即目的地操作符.

128位遗产 SSE 版本 : 对应目的地的比特(MAXVL-1:128)注册保持不变.

VEX.128和EVEX.128编码版本: 对应目的地的比特(MAXVL-1:128)注册被清零.

VEX.256和EVEX.256编码版本: 对应目的地的比特(MAXVL-1:256)注册被清零.

EVEX 编码版本 : 包装的字节,词或词的整数,从源操作(第二个操作)的低字节开始,符号扩展为词,词或四字整数,并存储在写屏下的目的地操作. 目的地注册为XMM,YMM或ZMM注册.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
Packed_Sign_Extend_BYTE_to_WORD(DEST, SRC)
DEST[15:0] := SignExtend(SRC[7:0]);
DEST[31:16] := SignExtend(SRC[15:8]);
DEST[47:32] := SignExtend(SRC[23:16]);
DEST[63:48] := SignExtend(SRC[31:24]);
DEST[79:64] := SignExtend(SRC[39:32]);
DEST[95:80] := SignExtend(SRC[47:40]);
DEST[111:96] := SignExtend(SRC[55:48]);
DEST[127:112] := SignExtend(SRC[63:56]);


Packed_Sign_Extend_BYTE_to_DWORD(DEST, SRC)
DEST[31:0] := SignExtend(SRC[7:0]);
DEST[63:32] := SignExtend(SRC[15:8]);
DEST[95:64] := SignExtend(SRC[23:16]);
DEST[127:96] := SignExtend(SRC[31:24]);

Packed_Sign_Extend_BYTE_to_QWORD(DEST, SRC)
DEST[63:0] := SignExtend(SRC[7:0]);
DEST[127:64] := SignExtend(SRC[15:8]);

Packed_Sign_Extend_WORD_to_DWORD(DEST, SRC)
DEST[31:0] := SignExtend(SRC[15:0]);
DEST[63:32] := SignExtend(SRC[31:16]);
DEST[95:64] := SignExtend(SRC[47:32]);
DEST[127:96] := SignExtend(SRC[63:48]);

Packed_Sign_Extend_WORD_to_QWORD(DEST, SRC)
DEST[63:0] := SignExtend(SRC[15:0]);
DEST[127:64] := SignExtend(SRC[31:16]);

Packed_Sign_Extend_DWORD_to_QWORD(DEST, SRC)
DEST[63:0] := SignExtend(SRC[31:0]);
DEST[127:64] := SignExtend(SRC[63:32]);

VPMOVSXBW (EVEX Encoded Versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

Packed_Sign_Extend_BYTE_to_WORD(TMP_DEST[127:0], SRC[63:0])

IF VL >= 256

     Packed_Sign_Extend_BYTE_to_WORD(TMP_DEST[255:128], SRC[127:64])

FI;

IF VL >= 512

     Packed_Sign_Extend_BYTE_to_WORD(TMP_DEST[383:256], SRC[191:128])

     Packed_Sign_Extend_BYTE_to_WORD(TMP_DEST[511:384], SRC[255:192])

FI;

FOR j := 0 TO KL-1

     i := j * 16

     IF k1[j] OR *no writemask*

          THEN DEST[i+15:i] := TEMP_DEST[i+15:i]

          ELSE

                  IF *merging-masking*            ; merging-masking

                      THEN *DEST[i+15:i] remains unchanged*

                      ELSE *zeroing-masking*      ; zeroing-masking

                      DEST[i+15:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VPMOVSXBD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

Packed_Sign_Extend_BYTE_to_DWORD(TMP_DEST[127:0], SRC[31:0])

IF VL >= 256

     Packed_Sign_Extend_BYTE_to_DWORD(TMP_DEST[255:128], SRC[63:32])

FI;

IF VL >= 512

     Packed_Sign_Extend_BYTE_to_DWORD(TMP_DEST[383:256], SRC[95:64])

     Packed_Sign_Extend_BYTE_to_DWORD(TMP_DEST[511:384], SRC[127:96])

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TEMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*            ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*      ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPMOVSXBQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

Packed_Sign_Extend_BYTE_to_QWORD(TMP_DEST[127:0], SRC[15:0])

IF VL >= 256

     Packed_Sign_Extend_BYTE_to_QWORD(TMP_DEST[255:128], SRC[31:16])

FI;

IF VL >= 512

     Packed_Sign_Extend_BYTE_to_QWORD(TMP_DEST[383:256], SRC[47:32])

     Packed_Sign_Extend_BYTE_to_QWORD(TMP_DEST[511:384], SRC[63:48])

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TEMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*            ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*      ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VPMOVSXWD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

Packed_Sign_Extend_WORD_to_DWORD(TMP_DEST[127:0], SRC[63:0])

IF VL >= 256

     Packed_Sign_Extend_WORD_to_DWORD(TMP_DEST[255:128], SRC[127:64])

FI;

IF VL >= 512

     Packed_Sign_Extend_WORD_to_DWORD(TMP_DEST[383:256], SRC[191:128])

     Packed_Sign_Extend_WORD_to_DWORD(TMP_DEST[511:384], SRC[256:192])

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TEMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*            ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*      ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPMOVSXWQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

Packed_Sign_Extend_WORD_to_QWORD(TMP_DEST[127:0], SRC[31:0])

IF VL >= 256

     Packed_Sign_Extend_WORD_to_QWORD(TMP_DEST[255:128], SRC[63:32])

FI;

IF VL >= 512

     Packed_Sign_Extend_WORD_to_QWORD(TMP_DEST[383:256], SRC[95:64])

     Packed_Sign_Extend_WORD_to_QWORD(TMP_DEST[511:384], SRC[127:96])

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TEMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*            ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*      ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VPMOVSXDQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

Packed_Sign_Extend_DWORD_to_QWORD(TEMP_DEST[127:0], SRC[63:0])

IF VL >= 256

     Packed_Sign_Extend_DWORD_to_QWORD(TEMP_DEST[255:128], SRC[127:64])

FI;

IF VL >= 512

     Packed_Sign_Extend_DWORD_to_QWORD(TEMP_DEST[383:256], SRC[191:128])

     Packed_Sign_Extend_DWORD_to_QWORD(TEMP_DEST[511:384], SRC[255:192])

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TEMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*            ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*      ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPMOVSXBW (VEX.256 Encoded Version)
Packed_Sign_Extend_BYTE_to_WORD(DEST[127:0], SRC[63:0])
Packed_Sign_Extend_BYTE_to_WORD(DEST[255:128], SRC[127:64])
DEST[MAXVL-1:256] := 0

VPMOVSXBD (VEX.256 Encoded Version)
Packed_Sign_Extend_BYTE_to_DWORD(DEST[127:0], SRC[31:0])
Packed_Sign_Extend_BYTE_to_DWORD(DEST[255:128], SRC[63:32])
DEST[MAXVL-1:256] := 0

VPMOVSXBQ (VEX.256 Encoded Version)
Packed_Sign_Extend_BYTE_to_QWORD(DEST[127:0], SRC[15:0])
Packed_Sign_Extend_BYTE_to_QWORD(DEST[255:128], SRC[31:16])
DEST[MAXVL-1:256] := 0

VPMOVSXWD (VEX.256 Encoded Version)
Packed_Sign_Extend_WORD_to_DWORD(DEST[127:0], SRC[63:0])
Packed_Sign_Extend_WORD_to_DWORD(DEST[255:128], SRC[127:64])
DEST[MAXVL-1:256] := 0

VPMOVSXWQ (VEX.256 Encoded Version)
Packed_Sign_Extend_WORD_to_QWORD(DEST[127:0], SRC[31:0])
Packed_Sign_Extend_WORD_to_QWORD(DEST[255:128], SRC[63:32])
DEST[MAXVL-1:256] := 0

VPMOVSXDQ (VEX.256 Encoded Version)
Packed_Sign_Extend_DWORD_to_QWORD(DEST[127:0], SRC[63:0])
Packed_Sign_Extend_DWORD_to_QWORD(DEST[255:128], SRC[127:64])
DEST[MAXVL-1:256] := 0


VPMOVSXBW (VEX.128 Encoded Version)
Packed_Sign_Extend_BYTE_to_WORDDEST[127:0], SRC[127:0]()
DEST[MAXVL-1:128] := 0

VPMOVSXBD (VEX.128 Encoded Version)
Packed_Sign_Extend_BYTE_to_DWORD(DEST[127:0], SRC[127:0])
DEST[MAXVL-1:128] := 0

VPMOVSXBQ (VEX.128 Encoded Version)
Packed_Sign_Extend_BYTE_to_QWORD(DEST[127:0], SRC[127:0])
DEST[MAXVL-1:128] := 0

VPMOVSXWD (VEX.128 Encoded Version)
Packed_Sign_Extend_WORD_to_DWORD(DEST[127:0], SRC[127:0])
DEST[MAXVL-1:128] := 0

VPMOVSXWQ (VEX.128 Encoded Version)
Packed_Sign_Extend_WORD_to_QWORD(DEST[127:0], SRC[127:0])
DEST[MAXVL-1:128] := 0

VPMOVSXDQ (VEX.128 Encoded Version)
Packed_Sign_Extend_DWORD_to_QWORD(DEST[127:0], SRC[127:0])
DEST[MAXVL-1:128] := 0

PMOVSXBW
Packed_Sign_Extend_BYTE_to_WORD(DEST[127:0], SRC[127:0])
DEST[MAXVL-1:128] (Unmodified)

PMOVSXBD
Packed_Sign_Extend_BYTE_to_DWORD(DEST[127:0], SRC[127:0])
DEST[MAXVL-1:128] (Unmodified)

PMOVSXBQ
Packed_Sign_Extend_BYTE_to_QWORD(DEST[127:0], SRC[127:0])
DEST[MAXVL-1:128] (Unmodified)

PMOVSXWD
Packed_Sign_Extend_WORD_to_DWORD(DEST[127:0], SRC[127:0])
DEST[MAXVL-1:128] (Unmodified)

PMOVSXWQ
Packed_Sign_Extend_WORD_to_QWORD(DEST[127:0], SRC[127:0])
DEST[MAXVL-1:128] (Unmodified)

PMOVSXDQ
Packed_Sign_Extend_DWORD_to_QWORD(DEST[127:0], SRC[127:0])
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VPMOVSXBW __m512i _mm512_cvtepi8_epi16(__m512i a);
VPMOVSXBW __m512i _mm512_mask_cvtepi8_epi16(__m512i a, __mmask32 k, __m512i b);
VPMOVSXBW __m512i _mm512_maskz_cvtepi8_epi16( __mmask32 k, __m512i b);
VPMOVSXBD __m512i _mm512_cvtepi8_epi32(__m512i a);
VPMOVSXBD __m512i _mm512_mask_cvtepi8_epi32(__m512i a, __mmask16 k, __m512i b);
VPMOVSXBD __m512i _mm512_maskz_cvtepi8_epi32( __mmask16 k, __m512i b);
VPMOVSXBQ __m512i _mm512_cvtepi8_epi64(__m512i a);
VPMOVSXBQ __m512i _mm512_mask_cvtepi8_epi64(__m512i a, __mmask8 k, __m512i b);
VPMOVSXBQ __m512i _mm512_maskz_cvtepi8_epi64( __mmask8 k, __m512i a);
VPMOVSXDQ __m512i _mm512_cvtepi32_epi64(__m512i a);
VPMOVSXDQ __m512i _mm512_mask_cvtepi32_epi64(__m512i a, __mmask8 k, __m512i b);
VPMOVSXDQ __m512i _mm512_maskz_cvtepi32_epi64( __mmask8 k, __m512i a);
VPMOVSXWD __m512i _mm512_cvtepi16_epi32(__m512i a);
VPMOVSXWD __m512i _mm512_mask_cvtepi16_epi32(__m512i a, __mmask16 k, __m512i b);
VPMOVSXWD __m512i _mm512_maskz_cvtepi16_epi32(__mmask16 k, __m512i a);
VPMOVSXWQ __m512i _mm512_cvtepi16_epi64(__m512i a);
VPMOVSXWQ __m512i _mm512_mask_cvtepi16_epi64(__m512i a, __mmask8 k, __m512i b);
VPMOVSXWQ __m512i _mm512_maskz_cvtepi16_epi64( __mmask8 k, __m512i a);
VPMOVSXBW __m256i _mm256_cvtepi8_epi16(__m256i a);
VPMOVSXBW __m256i _mm256_mask_cvtepi8_epi16(__m256i a, __mmask16 k, __m256i b);
VPMOVSXBW __m256i _mm256_maskz_cvtepi8_epi16( __mmask16 k, __m256i b);
VPMOVSXBD __m256i _mm256_cvtepi8_epi32(__m256i a);
VPMOVSXBD __m256i _mm256_mask_cvtepi8_epi32(__m256i a, __mmask8 k, __m256i b);
VPMOVSXBD __m256i _mm256_maskz_cvtepi8_epi32( __mmask8 k, __m256i b);
VPMOVSXBQ __m256i _mm256_cvtepi8_epi64(__m256i a);
VPMOVSXBQ __m256i _mm256_mask_cvtepi8_epi64(__m256i a, __mmask8 k, __m256i b);
VPMOVSXBQ __m256i _mm256_maskz_cvtepi8_epi64( __mmask8 k, __m256i a);
VPMOVSXDQ __m256i _mm256_cvtepi32_epi64(__m256i a);
VPMOVSXDQ __m256i _mm256_mask_cvtepi32_epi64(__m256i a, __mmask8 k, __m256i b);
VPMOVSXDQ __m256i _mm256_maskz_cvtepi32_epi64( __mmask8 k, __m256i a);
VPMOVSXWD __m256i _mm256_cvtepi16_epi32(__m256i a);
VPMOVSXWD __m256i _mm256_mask_cvtepi16_epi32(__m256i a, __mmask16 k, __m256i b);
VPMOVSXWD __m256i _mm256_maskz_cvtepi16_epi32(__mmask16 k, __m256i a);
VPMOVSXWQ __m256i _mm256_cvtepi16_epi64(__m256i a);
VPMOVSXWQ __m256i _mm256_mask_cvtepi16_epi64(__m256i a, __mmask8 k, __m256i b);
VPMOVSXWQ __m256i _mm256_maskz_cvtepi16_epi64( __mmask8 k, __m256i a);
VPMOVSXBW __m128i _mm_mask_cvtepi8_epi16(__m128i a, __mmask8 k, __m128i b);
VPMOVSXBW __m128i _mm_maskz_cvtepi8_epi16( __mmask8 k, __m128i b);
VPMOVSXBD __m128i _mm_mask_cvtepi8_epi32(__m128i a, __mmask8 k, __m128i b);
VPMOVSXBD __m128i _mm_maskz_cvtepi8_epi32( __mmask8 k, __m128i b);
VPMOVSXBQ __m128i _mm_mask_cvtepi8_epi64(__m128i a, __mmask8 k, __m128i b);
VPMOVSXBQ __m128i _mm_maskz_cvtepi8_epi64( __mmask8 k, __m128i a);
VPMOVSXDQ __m128i _mm_mask_cvtepi32_epi64(__m128i a, __mmask8 k, __m128i b);
VPMOVSXDQ __m128i _mm_maskz_cvtepi32_epi64( __mmask8 k, __m128i a);
VPMOVSXWD __m128i _mm_mask_cvtepi16_epi32(__m128i a, __mmask16 k, __m128i b);
VPMOVSXWD __m128i _mm_maskz_cvtepi16_epi32(__mmask16 k, __m128i a);
VPMOVSXWQ __m128i _mm_mask_cvtepi16_epi64(__m128i a, __mmask8 k, __m128i b);
VPMOVSXWQ __m128i _mm_maskz_cvtepi16_epi64( __mmask8 k, __m128i a);
PMOVSXBW __m128i _mm_ cvtepi8_epi16 ( __m128i a);
PMOVSXBD __m128i _mm_ cvtepi8_epi32 ( __m128i a);
PMOVSXBQ __m128i _mm_ cvtepi8_epi64 ( __m128i a);
PMOVSXWD __m128i _mm_ cvtepi16_epi32 ( __m128i a);
PMOVSXWQ __m128i _mm_ cvtepi16_epi64 ( __m128i a);
PMOVSXDQ __m128i _mm_ cvtepi32_epi64 ( __m128i a);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-22,"第5类例外条件".

EVEX-encoded 指令,参见表2-53,"Type E5类例外条件".

Additionally:

```text
#UD               If VEX.vvvv != 1111B, or EVEX.vvvv != 1111B.
```
