---
summary: Galois 战地芳香变换反向
---

## 说明

AFFINEINVB指令计算出加洛瓦场28场的芳香变换. 对于此指令,A定义了外缘转换 * inv(x)+b,其中"A"为8乘8位矩阵,"x"和"b"为8位矢量. X 中的字节的反向是针对还原多诺米x8 + x4 + x3 + x + 1.

一个SIMD寄存器(操作数 1)持有"x"为16,32或64个8位向量. 一个第二个SIMD(操作数 2)寄存器或内存操作数包含2,4或8个"A"值,这些值由第一个寄存器中对应的8个"x"值运行. "b"矢量是用于所有计算并包含在即时字节中的常数.

本指令的EVEX编码形式不支持内存断层压制. SSE编码的指令形式要求他们的内存操作进行16B对齐.

每个字节的反数由下表给出. 上硝泡位于垂直轴上,下硝泡位于水平轴上. 例如,0x95的反向是0x8A.

** 反字节列表**

| - | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | A | B | C | D | E | F |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 8D      F6 |  | CB | 52 | 7B | D1 | E8 | 4F        29 |  | C0 | B0 | E1 | E5 | C7 |
| 1 | 74 | B4 | AA      4B |  | 99 | 2B | 60 | 5F | 58 | 3F        FD |  | CC | FF | 40 | EE | B2 |
| 2 | 3A | 6E | 5A      F1 |  | 55 | 4D | A8 | C9 | C1 | A         98 |  | 15 | 30 | 44 | A2 | C2 |
| 3 | 2C | 45 | 92      6C |  | F3 | 39 | 66 | 42 | F2 | 35        20 |  | 6F | 77 | BB | 59 | 19 |
| 4 | 1D | FE | 37      67 |  | 2D | 31 | F5 | 69 | A7 | 64        AB |  | 13 | 54 | 25 | E9 | 9 |
| 5 | ED | 5C | 5       CA |  | 4C | 24 | 87 | BF | 18 | 3E        22 |  | F0 | 51 | EC | 61 | 17 |
| 6 | 16 | 5E | AF      D3 |  | 49 | A6 | 36 | 43 | F4 | 47        91 |  | DF | 33 | 93 | 21 | 3B |
| 7 | 79 | B7 | 97      85 |  | 10 | B5 | BA | 3C | B6 | 70        D0 |  | 6 | A1 | FA | 81 | 82 |
| 8 | 83 | 7E | 7F      80 |  | 96 | 73 | BE | 56 | 9B | 9E        95 |  | D9 | F7 | 2 | B9 | A4 |
| 9 | DE     6A |  | 32      6D |  | D8 | 8A | 84 | 72 | 2A | 14        9F |  | 88 | F9 | DC | 89 | 9A |
| A | FB | 7C | 2E      C3 |  | 8F | B8 | 65 | 48 | 26 | C8        12 |  | 4A | CE | E7 | D2 | 62 |
| B | C | E0 | 1F | EF | 11 | 75 | 78 | 71 | A5 | 8E        76 |  | 3D | BD | BC | 86 | 57 |
| C | B | 28 | 2F      A3 |  | DA | D4 | E4 | F | A9 | 27        53 |  | 4 | 1B | FC | AC | E6 |
| D | 7A | 7 | AE      63 |  | C5 | DB | E2 | EA | 94 | 8B        C4 |  | D5 | 9D | F8 | 90 | 6B |
| E | B1 | D | D6      EB |  | C6 | E | CF | AD | 8 | 4E        D7 |  | E3 | 5D | 50 | 1E | B3 |
| F | 5B | 23 | 38      34 |  | 68 | 46 | 3 | 8C | DD | 9C        7D |  | A0 | CD | 1A | 41 | 1C |

## 行动

```text
define affine_inverse_byte(tsrc2qw, src1byte, imm):
    FOR i := 0 to 7:
          * parity(x) = 1 if x has an odd number of 1s in it, and 0 otherwise.*
          * inverse(x) is defined in the table above *
         retbyte.bit[i] := parity(tsrc2qw.byte[7-i] AND inverse(src1byte)) XOR imm8.bit[i]
    return retbyte

VGF2P8AFFINEINVQB dest, src1, src2, imm8 (EVEX Encoded Version)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1:

    IF SRC2 is memory and EVEX.b==1:
         tsrc2 := SRC2.qword[0]

    ELSE:
         tsrc2 := SRC2.qword[j]

FOR b := 0 to 7:
    IF k1[j*8+b] OR *no writemask*:
         FOR i := 0 to 7:
               DEST.qword[j].byte[b] := affine_inverse_byte(tsrc2, SRC1.qword[j].byte[b], imm8)
    ELSE IF *zeroing*:
         DEST.qword[j].byte[b] := 0
    *ELSE DEST.qword[j].byte[b] remains unchanged*

DEST[MAX_VL-1:VL] := 0


VGF2P8AFFINEINVQB dest, src1, src2, imm8 (128b and 256b VEX Encoded Versions)
(KL, VL) = (2, 128), (4, 256)
FOR j := 0 TO KL-1:

    FOR b := 0 to 7:
         DEST.qword[j].byte[b] := affine_inverse_byte(SRC2.qword[j], SRC1.qword[j].byte[b], imm8)

DEST[MAX_VL-1:VL] := 0

GF2P8AFFINEINVQB srcdest, src1, imm8 (128b SSE Encoded Version)
FOR j := 0 TO 1:

    FOR b := 0 to 7:
         SRCDEST.qword[j].byte[b] := affine_inverse_byte(SRC1.qword[j], SRCDEST.qword[j].byte[b], imm8)
```

## Intel C/C++ 内在编译器

```c
(V)GF2P8AFFINEINVQB __m128i _mm_gf2p8affineinv_epi64_epi8(__m128i, __m128i, int);
(V)GF2P8AFFINEINVQB __m128i _mm_mask_gf2p8affineinv_epi64_epi8(__m128i, __mmask16, __m128i, __m128i, int);
(V)GF2P8AFFINEINVQB __m128i _mm_maskz_gf2p8affineinv_epi64_epi8(__mmask16, __m128i, __m128i, int);
VGF2P8AFFINEINVQB __m256i _mm256_gf2p8affineinv_epi64_epi8(__m256i, __m256i, int);
VGF2P8AFFINEINVQB __m256i _mm256_mask_gf2p8affineinv_epi64_epi8(__m256i, __mmask32, __m256i, __m256i, int);
VGF2P8AFFINEINVQB __m256i _mm256_maskz_gf2p8affineinv_epi64_epi8(__mmask32, __m256i, __m256i, int);
VGF2P8AFFINEINVQB __m512i _mm512_gf2p8affineinv_epi64_epi8(__m512i, __m512i, int);
VGF2P8AFFINEINVQB __m512i _mm512_mask_gf2p8affineinv_epi64_epi8(__m512i, __mmask64, __m512i, __m512i, int);
VGF2P8AFFINEINVQB __m512i _mm512_maskz_gf2p8affineinv_epi64_epi8(__mmask64, __m512i, __m512i, int);
```

## SIMD 浮点 例外

None.

## 其他例外

遗留编码和 VEX 编码: 参见表2-21"第4类例外条件".

EVEX 编码 : 参见表2-52"Type E4NF类例外条件".
