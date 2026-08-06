---
summary: 减法包装的四字整数
---

## 说明

从第一个操作数(目标操作数)中减去第二个操作数(源操作数),并将结果存储在目标操作数中. 当使用已打包的四字 操作数 时,执行 SIMD 减法. 当一个四字形的结果太大,无法以64位表示(过度流)时,结果被包裹,低64位被写到目的地元素(即背负被忽略).

注意(V)PSUBQ指令可以在无签名或签名(两个"补充注")整数上运行;然而,它并没有在EFLAGS寄存器中设置比特,以表示溢出和/或结转. 为防止未被发现的溢出条件,软件必须控制其运行的值范围.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE版本 64位 操作数: 源操作数可以是存储在MMX技术登记册或64位内存位置的四字整数.

128位遗产 SSE 版本 : 第二源操作数是一个XMM的寄存器或128位的内存位置. 第一源操作数和目标操作数是XMM登记册. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 第二源操作数是一个XMM的寄存器或128位的内存位置. 第一源操作数和目标操作数是XMM登记册. 目的地YMM的位数(MAXVL-1:128)登记被清零.

VEX.256 编码版本 : 第二源操作数是一个YMM的寄存器或256位的内存位置. 第一源操作数和目标操作数是YMM登记册. 对应的ZMM注册被清零的位数(MAXVL-1:256).

EVEX 编码为 VPSUBQ : 第二源操作数是一个ZMM/YMM/XMM的登记器,512/256/128位内存位置或512/256/128位矢量从32/64位内存位置广播. 第一源操作数和目标操作数是ZMM/YMM/XMM登记册. 目的地以写掩码 k1有条件更新.

## 行动

```text
PSUBQ (With 64-Bit Operands)
    DEST[63:0] := DEST[63:0] - SRC[63:0];

PSUBQ (With 128-Bit Operands)

    DEST[63:0] := DEST[63:0] - SRC[63:0];
    DEST[127:64] := DEST[127:64] - SRC[127:64];

VPSUBQ (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0]-SRC2[63:0]
DEST[127:64] := SRC1[127:64]-SRC2[127:64]
DEST[MAXVL-1:128] := 0

VPSUBQ (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0]-SRC2[63:0]
DEST[127:64] := SRC1[127:64]-SRC2[127:64]
DEST[191:128] := SRC1[191:128]-SRC2[191:128]
DEST[255:192] := SRC1[255:192]-SRC2[255:192]
DEST[MAXVL-1:256] := 0

VPSUBQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := SRC1[i+63:i] - SRC2[63:0]

                  ELSE DEST[i+63:i] := SRC1[i+63:i] - SRC2[i+63:i]

             FI;

     ELSE

             IF *merging-masking*             ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPSUBQ __m512i _mm512_sub_epi64(__m512i a, __m512i b);
VPSUBQ __m512i _mm512_mask_sub_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPSUBQ __m512i _mm512_maskz_sub_epi64( __mmask8 k, __m512i a, __m512i b);
VPSUBQ __m256i _mm256_mask_sub_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPSUBQ __m256i _mm256_maskz_sub_epi64( __mmask8 k, __m256i a, __m256i b);
VPSUBQ __m128i _mm_mask_sub_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPSUBQ __m128i _mm_maskz_sub_epi64( __mmask8 k, __m128i a, __m128i b);
PSUBQ __m64 _mm_sub_si64(__m64 m1, __m64 m2) (V)PSUBQ __m128i _mm_sub_epi64(__m128i m1, __m128i m2) VPSUBQ __m256i _mm256_sub_epi64(__m256i m1, __m256i m2);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded VPSUBQ,参见表2-51"Type E4类例外条件".
