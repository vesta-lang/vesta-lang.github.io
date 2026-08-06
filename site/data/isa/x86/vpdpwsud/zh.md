---
summary: 乘并添加未签名和已签名的单词
---

## 说明

将第一源操作数的单个单词乘以第二源操作数的相应单词,产生中间的dword结果. 然后将填充结果汇总并累积在目的地填充元素大小操作数中.

对于无符号饱和值,当单个结果值超过无符号双词的范围(即大于FFFF FFFH)时,FFFF FFH的饱和无符号双词整数值就存储在双词目的地.

对于签名饱和,当单个结果超过签名双字整数的范围(即大于7FFF FFFH或小于8000 00H)时,7FFF FFH或8000 00H的饱和值分别写成目标操作数.

EVEX版本的VPDPWSSD[,S]之前以AVX512 VNNI推出. VEX版本的VPDPWSSD[,S]之前与AVX VNNI一同引入.

## 行动

```text
VPDPW[UU,SU,US]D[,S] dest, src1, src2 (VEX encoded version)
VL = (128, 256)
KL = VL/32

ORIGDEST := DEST

IF *src1 is signed*:  // SU

src1extend := SIGN_EXTEND

ELSE:                 // UU, US

src1extend := ZERO_EXTEND

IF *src2 is signed*:  // US

src2extend := SIGN_EXTEND

ELSE:                 // UU, SU

src2extend := ZERO_EXTEND

FOR i := 0 TO KL-1:
    p1dword := src1extend(SRC1.word[2*i+0]) * src2extend(SRC2.word[2*i+0])
    p2dword := src1extend(SRC1.word[2*i+1]) * src2extend(SRC2.word[2*i+1])
    IF *saturating version*:
          IF *UU instruction version*:


                DEST.dword[i] := UNSIGNED_DWORD_SATURATE(ORIGDEST.dword[i] + p1dword + p2dword)
          ELSE:

                DEST.dword[i] := SIGNED_DWORD_SATURATE(ORIGDEST.dword[i] + p1dword + p2dword)
    ELSE:

          DEST.dword[i] := ORIGDEST.dword[i] + p1dword + p2dword
DEST[MAX_VL-1:VL] := 0
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VPDPWSUD __m128i _mm_dpwsud_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPWSUD __m256i _mm256_dpwsud_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPWSUDS __m128i _mm_dpwsuds_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPWSUDS __m256i _mm256_dpwsuds_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPWUSD __m128i _mm_dpwusd_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPWUSD __m256i _mm256_dpwusd_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPWUSDS __m128i _mm_dpwusds_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPWUSDS __m256i _mm256_dpwusds_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPWUUD __m128i _mm_dpwuud_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPWUUD __m256i _mm256_dpwuud_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPWUUDS __m128i _mm_dpwuuds_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPWUUDS __m256i _mm256_dpwuuds_epi32 (__m256i __W, __m256i __A, __m256i __B);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".
