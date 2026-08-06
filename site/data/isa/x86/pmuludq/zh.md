---
summary: 乘以未签名的双字整数
---

## 说明

将第一个操作数(目标操作数)乘以第二个操作数(源操作数),并将结果存储在目标操作数中.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE版本 64位 操作数: 源操作数可以是存储在MMX技术注册簿或64位内存位置的低双词中的无符号双字整数. 目标操作数可以是存储在MMX技术登记册的低双字中无符号的双字整数. 结果是没有签名

四字形整数存储在目的地的MMX技术登记册. 当一个四字形的结果太大,无法以64位表示(过度流)时,结果被包裹,低64位被写到目的地元素(即背负被忽略).

对于64位的内存操作数,从内存中获取64位,但在计算中只使用低双词.

128位遗产 SSE 版本 : 第二源操作数是储存在XMM寄存器或128位内存位置的第一个(低)和第三个双字的两块无符号双字整数. 对于128位的内存操作数,从内存中获取128位,但在计算中只使用第一和第三双词. 第一源操作数是一个XMM寄存器的第一个和第三个双字存储的两个无符号双字整数. 目的地包含两个无符号的四字整数存储在XMM寄存器中. 相应的YMM目的地注册保持不变的位数(MAXVL-128).

VEX.128 编码版本 : 第二源操作数是储存在XMM寄存器或128位内存位置的第一个(低)和第三个双字的两块无符号双字整数. 对于128位的内存操作数,从内存中获取128位,但在计算中只使用第一和第三双词. 第一源操作数是一个XMM寄存器的第一个和第三个双字存储的两个无符号双字整数. 目的地包含两个无符号的四字整数存储在XMM寄存器中. 目的地YMM的比特(MAXVL-128)注册被清零.

VEX.256 编码版本 : 第二源操作数是存储在YMM寄存器或256位内存位置的第1(低),第3,第5和第7个双字的4个无符号双字整数. 对于256位内存操作数,从内存中获取了256位,但在计算中只使用了第一,第三,第五,第七双词. 第一源操作数是一个YMM寄存器的第1,第3,第5,和第7个双字存储的4个无符号的双字整数. 目的地包含四组不匹配的四字整数,存储在YMM寄存器中.

EVEX 编码版本 : 无符号的输入双字整数取自源操作数的偶数元素. 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位向量从64位内存位置广播. 目的地为ZMM/YMM/XMM登记册,根据写掩码在64位颗粒度上进行更新.

## 行动

```text
PMULUDQ (With 64-Bit Operands)
    DEST[63:0] := DEST[31:0]  SRC[31:0];

PMULUDQ (With 128-Bit Operands)
    DEST[63:0] := DEST[31:0]  SRC[31:0];
    DEST[127:64] := DEST[95:64]  SRC[95:64];

VPMULUDQ (VEX.128 Encoded Version)
DEST[63:0] := SRC1[31:0] * SRC2[31:0]
DEST[127:64] := SRC1[95:64] * SRC2[95:64]
DEST[MAXVL-1:128] := 0

VPMULUDQ (VEX.256 Encoded Version)
DEST[63:0] := SRC1[31:0] * SRC2[31:0]
DEST[127:64] := SRC1[95:64] * SRC2[95:64
DEST[191:128] := SRC1[159:128] * SRC2[159:128]
DEST[255:192] := SRC1[223:192] * SRC2[223:192]
DEST[MAXVL-1:256] := 0


VPMULUDQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := ZeroExtend64( SRC1[i+31:i]) * ZeroExtend64( SRC2[31:0] )

                  ELSE DEST[i+63:i] := ZeroExtend64( SRC1[i+31:i]) * ZeroExtend64( SRC2[i+31:i] )

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*               ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPMULUDQ __m512i _mm512_mul_epu32(__m512i a, __m512i b);
VPMULUDQ __m512i _mm512_mask_mul_epu32(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPMULUDQ __m512i _mm512_maskz_mul_epu32( __mmask8 k, __m512i a, __m512i b);
VPMULUDQ __m256i _mm256_mask_mul_epu32(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPMULUDQ __m256i _mm256_maskz_mul_epu32( __mmask8 k, __m256i a, __m256i b);
VPMULUDQ __m128i _mm_mask_mul_epu32(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMULUDQ __m128i _mm_maskz_mul_epu32( __mmask8 k, __m128i a, __m128i b);
PMULUDQ __m64 _mm_mul_su32 (__m64 a, __m64 b) (V)PMULUDQ __m128i _mm_mul_epu32 ( __m128i a, __m128i b) VPMULUDQ __m256i _mm256_mul_epu32( __m256i a, __m256i b);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21,"第4类例外条件". EVEX-encoded discription,参见表2-51,"第E4类例外条件".
