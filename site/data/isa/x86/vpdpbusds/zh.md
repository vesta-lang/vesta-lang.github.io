---
summary: 以饱和度乘以并添加未签名和已签名字节
---

## 说明

将 第一源操作数 的单个未签名字节乘以 第二源操作数 的相应签名字节,产生中间签名字数结果. 然后将单词结果汇总并累积在目的地词元素大小操作数中. 如果中间和数超过一个32b的签名数,则结果饱和为0x7FFF FFFF正数,负数为0x8000 00。

本指令支持内存断层抑制.

## 行动

```text
VPDPBUSDS dest, src1, src2 (VEX encoded versions)
VL=(128, 256)
KL=VL/32

ORIGDEST := DEST
FOR i := 0 TO KL-1:

    // Extending to 16b
    // src1extend := ZERO_EXTEND
    // src2extend := SIGN_EXTEND

    p1word := src1extend(SRC1.byte[4*i+0]) * src2extend(SRC2.byte[4*i+0])
    p2word := src1extend(SRC1.byte[4*i+1]) * src2extend(SRC2.byte[4*i+1])
    p3word := src1extend(SRC1.byte[4*i+2]) * src2extend(SRC2.byte[4*i+2])
    p4word := src1extend(SRC1.byte[4*i+3]) * src2extend(SRC2.byte[4*i+3])
    DEST.dword[i] := SIGNED_DWORD_SATURATE(ORIGDEST.dword[i] + p1word + p2word + p3word + p4word)

DEST[MAX_VL-1:VL] := 0

VPDPBUSDS dest, src1, src2 (EVEX encoded versions)
(KL,VL)=(4,128), (8,256), (16,512)
ORIGDEST := DEST
FOR i := 0 TO KL-1:

    IF k1[i] or *no writemask*:
          // Byte elements of SRC1 are zero-extended to 16b and
          // byte elements of SRC2 are sign extended to 16b before multiplication.
          IF SRC2 is memory and EVEX.b == 1:
                t := SRC2.dword[0]
          ELSE:
                t := SRC2.dword[i]
          p1word := ZERO_EXTEND(SRC1.byte[4*i]) * SIGN_EXTEND(t.byte[0])
          p2word := ZERO_EXTEND(SRC1.byte[4*i+1]) * SIGN_EXTEND(t.byte[1])
          p3word := ZERO_EXTEND(SRC1.byte[4*i+2]) * SIGN_EXTEND(t.byte[2])
          p4word := ZERO_EXTEND(SRC1.byte[4*i+3]) *SIGN_EXTEND(t.byte[3])
          DEST.dword[i] := SIGNED_DWORD_SATURATE(ORIGDEST.dword[i] + p1word + p2word + p3word + p4word)

    ELSE IF *zeroing*:
          DEST.dword[i] := 0

    ELSE: // Merge masking, dest element unchanged
          DEST.dword[i] := ORIGDEST.dword[i]

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPDPBUSDS __m128i _mm_dpbusds_avx_epi32(__m128i, __m128i, __m128i);
VPDPBUSDS __m128i _mm_dpbusds_epi32(__m128i, __m128i, __m128i);
VPDPBUSDS __m128i _mm_mask_dpbusds_epi32(__m128i, __mmask8, __m128i, __m128i);
VPDPBUSDS __m128i _mm_maskz_dpbusds_epi32(__mmask8, __m128i, __m128i, __m128i);
VPDPBUSDS __m256i _mm256_dpbusds_avx_epi32(__m256i, __m256i, __m256i);
VPDPBUSDS __m256i _mm256_dpbusds_epi32(__m256i, __m256i, __m256i);
VPDPBUSDS __m256i _mm256_mask_dpbusds_epi32(__m256i, __mmask8, __m256i, __m256i);
VPDPBUSDS __m256i _mm256_maskz_dpbusds_epi32(__mmask8, __m256i, __m256i, __m256i);
VPDPBUSDS __m512i _mm512_dpbusds_epi32(__m512i, __m512i, __m512i);
VPDPBUSDS __m512i _mm512_mask_dpbusds_epi32(__m512i, __mmask16, __m512i, __m512i);
VPDPBUSDS __m512i _mm512_maskz_dpbusds_epi32(__mmask16, __m512i, __m512i, __m512i);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21,"第4类例外条件". EVEX-encoded discription,参见表2-51,"第E4类例外条件".
