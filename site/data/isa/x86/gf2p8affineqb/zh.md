---
summary: 加洛瓦场芳香变换
---

## 说明

AFFINEB指令计算出加洛瓦场28场的芳香变换. 对于此指令,A定义了外缘转换 * x + b 其中"A"为8乘8位矩阵,"x"和"b"为8位矢量. 一个SIMD寄存器(操作数 1)持有"x"为16,32或64个8位向量. 一个第二个SIMD(操作数 2)寄存器或内存操作数包含2,4或8个"A"值,这些值由第一个寄存器中对应的8个"x"值运行. "b"矢量是用于所有计算并包含在即时字节中的常数.

本指令的EVEX编码形式不支持内存断层压制. SSE编码的指令形式要求对其内存操作进行16B对齐.

## 行动

```text
define parity(x):

t := 0              // single bit

FOR i := 0 to 7:

t = t xor x.bit[i]

return t

define affine_byte(tsrc2qw, src1byte, imm):

    FOR i := 0 to 7:
          * parity(x) = 1 if x has an odd number of 1s in it, and 0 otherwise.*

         retbyte.bit[i] := parity(tsrc2qw.byte[7-i] AND src1byte) XOR imm8.bit[i]
    return retbyte


VGF2P8AFFINEQB dest, src1, src2, imm8 (EVEX Encoded Version)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1:

    IF SRC2 is memory and EVEX.b==1:
         tsrc2 := SRC2.qword[0]

    ELSE:
         tsrc2 := SRC2.qword[j]

    FOR b := 0 to 7:
          IF k1[j*8+b] OR *no writemask*:
               DEST.qword[j].byte[b] := affine_byte(tsrc2, SRC1.qword[j].byte[b], imm8)
          ELSE IF *zeroing*:
               DEST.qword[j].byte[b] := 0
          *ELSE DEST.qword[j].byte[b] remains unchanged*

DEST[MAX_VL-1:VL] := 0

VGF2P8AFFINEQB dest, src1, src2, imm8 (128b and 256b VEX Encoded Versions)
(KL, VL) = (2, 128), (4, 256)
FOR j := 0 TO KL-1:

    FOR b := 0 to 7:
         DEST.qword[j].byte[b] := affine_byte(SRC2.qword[j], SRC1.qword[j].byte[b], imm8)

DEST[MAX_VL-1:VL] := 0

GF2P8AFFINEQB srcdest, src1, imm8 (128b SSE Encoded Version)
FOR j := 0 TO 1:

    FOR b := 0 to 7:
         SRCDEST.qword[j].byte[b] := affine_byte(SRC1.qword[j], SRCDEST.qword[j].byte[b], imm8)
```

## Intel C/C++ 内在编译器

```c
(V)GF2P8AFFINEQB __m128i _mm_gf2p8affine_epi64_epi8(__m128i, __m128i, int);
(V)GF2P8AFFINEQB __m128i _mm_mask_gf2p8affine_epi64_epi8(__m128i, __mmask16, __m128i, __m128i, int);
(V)GF2P8AFFINEQB __m128i _mm_maskz_gf2p8affine_epi64_epi8(__mmask16, __m128i, __m128i, int);
VGF2P8AFFINEQB __m256i _mm256_gf2p8affine_epi64_epi8(__m256i, __m256i, int);
VGF2P8AFFINEQB __m256i _mm256_mask_gf2p8affine_epi64_epi8(__m256i, __mmask32, __m256i, __m256i, int);
VGF2P8AFFINEQB __m256i _mm256_maskz_gf2p8affine_epi64_epi8(__mmask32, __m256i, __m256i, int);
VGF2P8AFFINEQB __m512i _mm512_gf2p8affine_epi64_epi8(__m512i, __m512i, int);
VGF2P8AFFINEQB __m512i _mm512_mask_gf2p8affine_epi64_epi8(__m512i, __mmask64, __m512i, __m512i, int);
VGF2P8AFFINEQB __m512i _mm512_maskz_gf2p8affine_epi64_epi8(__mmask64, __m512i, __m512i, int);
```

## SIMD 浮点 例外

None.

## 其他例外

遗留编码和 VEX 编码: 参见表2-21"第4类例外条件".

EVEX 编码 : 参见表2-52"Type E4NF类例外条件".
