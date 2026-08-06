---
summary: 组合双字整数
---

## 说明

在第一源操作数的偶数(零基参考)元素中,用第二源操作数的相应元素中的已打包的已打包的双字整数乘以已打包的双字整数,并在目标操作数存储已打包的已打包的四字结果.

128位遗产 SSE 版本 : 签名的输入双字整数取自源操作数的偶数元素,即第一(低)和第三双字元素. 对于128位的内存操作数,从内存中获取128位,但在计算中只使用第一和第三双词. 第一源操作数与目的地XMM 操作数相同. 第二源操作数可以是XMM寄存器或128位内存位置. 对应目的地的比特(MAXVL-1:128)注册保持不变.

VEX.128 编码版本 : 签名的输入双字整数取自源操作数的偶数元素,即第一(低)和第三双字元素. 对于128位的内存操作数,从内存中获取128位,但在计算中只使用第一和第三双词. 第一源操作数和目标操作数是XMM的登记. 第二源操作数可以是XMM寄存器或128位内存位置. 对应目的地的比特(MAXVL-1:128)注册被清零.

VEX.256 编码版本 : 签名的输入双字整数取自源操作数的偶数元素,即第一,三,五,七双字元素. 对于256位内存操作数,从内存中获取了256位,但在计算中只使用了四个偶数双字. 第一源操作数和目标操作数是YMM登记册. 第二源操作数可以是YMM寄存器或256位内存位置. 对应目的地ZMM的比特(MAXVL-1:256)登记被清零.

EVEX 编码版本 : 签名的输入双字整数取自源操作数的偶数元素. 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位向量从64位内存位置广播. 目的地为ZMM/YMM/XMM登记册,根据写掩码在64位颗粒度上进行更新.

## 行动

```text
VPMULDQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := SignExtend64( SRC1[i+31:i]) * SignExtend64( SRC2[31:0])

                  ELSE DEST[i+63:i] := SignExtend64( SRC1[i+31:i]) * SignExtend64( SRC2[i+31:i])

             FI;

     ELSE

             IF *merging-masking*            ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPMULDQ (VEX.256 Encoded Version)
DEST[63:0] := SignExtend64( SRC1[31:0]) * SignExtend64( SRC2[31:0])
DEST[127:64] := SignExtend64( SRC1[95:64]) * SignExtend64( SRC2[95:64])
DEST[191:128] := SignExtend64( SRC1[159:128]) * SignExtend64( SRC2[159:128])
DEST[255:192] := SignExtend64( SRC1[223:192]) * SignExtend64( SRC2[223:192])
DEST[MAXVL-1:256] := 0

VPMULDQ (VEX.128 Encoded Version)
DEST[63:0] := SignExtend64( SRC1[31:0]) * SignExtend64( SRC2[31:0])
DEST[127:64] := SignExtend64( SRC1[95:64]) * SignExtend64( SRC2[95:64])
DEST[MAXVL-1:128] := 0

PMULDQ (128-bit Legacy SSE Version)
DEST[63:0] := SignExtend64( DEST[31:0]) * SignExtend64( SRC[31:0])
DEST[127:64] := SignExtend64( DEST[95:64]) * SignExtend64( SRC[95:64])
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VPMULDQ __m512i _mm512_mul_epi32(__m512i a, __m512i b);
VPMULDQ __m512i _mm512_mask_mul_epi32(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPMULDQ __m512i _mm512_maskz_mul_epi32( __mmask8 k, __m512i a, __m512i b);
VPMULDQ __m256i _mm256_mask_mul_epi32(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPMULDQ __m256i _mm256_mask_mul_epi32( __mmask8 k, __m256i a, __m256i b);
VPMULDQ __m128i _mm_mask_mul_epi32(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMULDQ __m128i _mm_mask_mul_epi32( __mmask8 k, __m128i a, __m128i b);
(V)PMULDQ __m128i _mm_mul_epi32( __m128i a, __m128i b);
VPMULDQ __m256i _mm256_mul_epi32( __m256i a, __m256i b);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded 指令,参见表2-51,"Type E4类例外条件".
