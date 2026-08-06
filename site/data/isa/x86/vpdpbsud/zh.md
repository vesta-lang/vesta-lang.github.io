---
summary: 乘并添加未签名和已签名的字节
---

## 说明

将第一源操作数的单个字节乘以第二源操作数的相应字节,产生中间字数结果. 然后将单词结果汇总并累积在目的地词元素大小操作数中.

对于无符号饱和值,当单个结果值超过一个无符号双词的范围(即大于FFFFF FFFFH)时,FFFF FFH的饱和无符号双词整数值存储在双词目的地.

对于签名饱和,当单个结果超过签名双字整数的范围(即大于7FFF FFFH或小于8000 00H)时,7FFF FFH或8000 00H的饱和值分别写成目标操作数.

## 行动

```text
VPDPB[SU,UU,SS]D[,S] dest, src1, src2 (VEX encoded version)
VL = (128, 256)
KL = VL/32

ORIGDEST := DEST
FOR i := 0 TO KL-1:

IF *src1 is signed*:
      src1extend := SIGN_EXTEND // SU, SS

ELSE:
      src1extend := ZERO_EXTEND // UU

IF *src2 is signed*:
      src2extend := SIGN_EXTEND // SS

ELSE:
      src2extend := ZERO_EXTEND // UU, SU

p1word := src1extend(SRC1.byte[4*i+0]) * src2extend(SRC2.byte[4*i+0])
p2word := src1extend(SRC1.byte[4*i+1]) * src2extend(SRC2.byte[4*i+1])
p3word := src1extend(SRC1.byte[4*i+2]) * src2extend(SRC2.byte[4*i+2])
p4word := src1extend(SRC1.byte[4*i+3]) * src2extend(SRC2.byte[4*i+3])

IF *saturating*:


          IF *UU instruction version*:
                DEST.dword[i] := UNSIGNED_DWORD_SATURATE(ORIGDEST.dword[i] + p1word + p2word + p3word + p4word)

          ELSE:
                DEST.dword[i] := SIGNED_DWORD_SATURATE(ORIGDEST.dword[i] + p1word + p2word + p3word + p4word)

    ELSE:
          DEST.dword[i] := ORIGDEST.dword[i] + p1word + p2word + p3word + p4word

DEST[MAXVL-1:VL] := 0
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VPDPBSSD __m128i _mm_dpbssd_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPBSSD __m256i _mm256_dpbssd_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPBSSDS __m128i _mm_dpbssds_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPBSSDS __m256i _mm256_dpbssds_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPBSUD __m128i _mm_dpbsud_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPBSUD __m256i _mm256_dpbsud_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPBSUDS __m128i _mm_dpbsuds_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPBSUDS __m256i _mm256_dpbsuds_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPBUUD __m128i _mm_dpbuud_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPBUUD __m256i _mm256_dpbuud_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPBUUDS __m128i _mm_dpbuuds_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPBUUDS __m256i _mm256_dpbuuds_epi32 (__m256i __W, __m256i __A, __m256i __B);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".
