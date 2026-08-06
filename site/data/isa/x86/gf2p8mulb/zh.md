---
summary: 加卢瓦字段乘数字节
---

## 说明

指令在有限字段GF(28)中乘以元素,在第一源操作数中运行一个字节(字段元素),在第二源操作数中运行相应的字节. 字段GF(28)以多元表示法表示,还原多元表示法为x8+x4+x3+x+1.

该指示不支持广播。

本指令的EVEX编码形式支持内存断层压制. SSE编码的指令形式要求对其内存操作进行16B对齐.

## 行动

```text
define gf2p8mul_byte(src1byte, src2byte):

tword := 0
FOR i := 0 to 7:

IF src2byte.bit[i]:

           tword := tword XOR (src1byte<< i)

* carry out polynomial reduction by the characteristic polynomial p*

FOR i := 14 downto 8:
p := 0x11B << (i-8)
                                        *0x11B = 0000_0001_0001_1011 in binary*

IF tword.bit[i]:

           tword := tword XOR p

return tword.byte[0]

VGF2P8MULB dest, src1, src2 (EVEX Encoded Version)

(KL, VL) = (16, 128), (32, 256), (64, 512)
FOR j := 0 TO KL-1:

    IF k1[j] OR *no writemask*:
         DEST.byte[j] := gf2p8mul_byte(SRC1.byte[j], SRC2.byte[j])

    ELSE IF *zeroing*:
         DEST.byte[j] := 0

    * ELSE DEST.byte[j] remains unchanged*
DEST[MAX_VL-1:VL] := 0

VGF2P8MULB dest, src1, src2 (128b and 256b VEX Encoded Versions)

(KL, VL) = (16, 128), (32, 256)
FOR j := 0 TO KL-1:

    DEST.byte[j] := gf2p8mul_byte(SRC1.byte[j], SRC2.byte[j])
DEST[MAX_VL-1:VL] := 0

GF2P8MULB srcdest, src1 (128b SSE Encoded Version)
FOR j := 0 TO 15:

    SRCDEST.byte[j] :=gf2p8mul_byte(SRCDEST.byte[j], SRC1.byte[j])
```

## Intel C/C++ 内在编译器

```c
(V)GF2P8MULB __m128i _mm_gf2p8mul_epi8(__m128i, __m128i);
(V)GF2P8MULB __m128i _mm_mask_gf2p8mul_epi8(__m128i, __mmask16, __m128i, __m128i);
(V)GF2P8MULB __m128i _mm_maskz_gf2p8mul_epi8(__mmask16, __m128i, __m128i);
VGF2P8MULB __m256i _mm256_gf2p8mul_epi8(__m256i, __m256i);
VGF2P8MULB __m256i _mm256_mask_gf2p8mul_epi8(__m256i, __mmask32, __m256i, __m256i);
VGF2P8MULB __m256i _mm256_maskz_gf2p8mul_epi8(__mmask32, __m256i, __m256i);
VGF2P8MULB __m512i _mm512_gf2p8mul_epi8(__m512i, __m512i);
VGF2P8MULB __m512i _mm512_mask_gf2p8mul_epi8(__m512i, __mmask64, __m512i, __m512i);
VGF2P8MULB __m512i _mm512_maskz_gf2p8mul_epi8(__mmask64, __m512i, __m512i);
```

## SIMD 浮点 例外

None.

## 其他例外

遗留编码和 VEX 编码: 参见表2-21,"第4类例外条件". EVEX-encoded: 参见表2-51"E4类例外条件".
