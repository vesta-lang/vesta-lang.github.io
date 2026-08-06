---
summary: 乘法和添加包装整数
---

## 说明

将目标操作数(第一个操作数)的个人签名单词乘以源操作数(第二个操作数)的相应签名单词,产生临时签名,双词的结果. 相邻的双词结果随后被归纳并存储在目标操作数中. 例如,源代码和目标操作数中对应的低序词(15-0)和31-16)相互乘以,双词结果加在一起并存储在目的地登记册的低序双词(31-0)中. 在相邻的其他对词上进行同样的操作. (图4-11在使用64位的操作数时显示此操作).

(V)PMADDWD的指令只在一种情况下环绕:当一组中运行的2对单词都是8000H时. 在这种情况下,结果被包裹到80000000H.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE 版本 : 第一个来源和目标操作数是MMX登记册. 第二源操作数是一个MMX的寄存器或64位的内存位置.

128位遗产 SSE 版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目的地YMM的位数(MAXVL-1:128)登记被清零.

VEX.256 编码版本 : 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 第一个来源和目标操作数是YMM登记册.

EVEX.512 编码版本 : 第二源操作数可以是ZMM寄存器或512位内存位置. 第一个来源和目标操作数是ZMM登记册.

```text
                                           SRC   X3  X2      X1  X0
```

DEST

```text
                                                 Y3  Y2      Y1  Y0
```

TEMP  X3  Y3                                         X2  Y2      X1  Y1           X0  Y0

```text
                                           DEST  (X3Y3) + (X2Y2) (X1Y1) + (X0Y0)
```

图4-11. PMADDWD 使用64位 操作数 执行模型

## 行动

```text
PMADDWD (With 64-bit Operands)
    DEST[31:0] := (DEST[15:0]  SRC[15:0]) + (DEST[31:16]  SRC[31:16]);
    DEST[63:32] := (DEST[47:32]  SRC[47:32]) + (DEST[63:48]  SRC[63:48]);

PMADDWD (With 128-bit Operands)
    DEST[31:0] := (DEST[15:0]  SRC[15:0]) + (DEST[31:16]  SRC[31:16]);
    DEST[63:32] := (DEST[47:32]  SRC[47:32]) + (DEST[63:48]  SRC[63:48]);
    DEST[95:64] := (DEST[79:64]  SRC[79:64]) + (DEST[95:80]  SRC[95:80]);
    DEST[127:96] := (DEST[111:96]  SRC[111:96]) + (DEST[127:112]  SRC[127:112]);

VPMADDWD (VEX.128 Encoded Version)
DEST[31:0] := (SRC1[15:0] * SRC2[15:0]) + (SRC1[31:16] * SRC2[31:16])
DEST[63:32] := (SRC1[47:32] * SRC2[47:32]) + (SRC1[63:48] * SRC2[63:48])
DEST[95:64] := (SRC1[79:64] * SRC2[79:64]) + (SRC1[95:80] * SRC2[95:80])
DEST[127:96] := (SRC1[111:96] * SRC2[111:96]) + (SRC1[127:112] * SRC2[127:112])
DEST[MAXVL-1:128] := 0


VPMADDWD (VEX.256 Encoded Version)
DEST[31:0] := (SRC1[15:0] * SRC2[15:0]) + (SRC1[31:16] * SRC2[31:16])
DEST[63:32] := (SRC1[47:32] * SRC2[47:32]) + (SRC1[63:48] * SRC2[63:48])
DEST[95:64] := (SRC1[79:64] * SRC2[79:64]) + (SRC1[95:80] * SRC2[95:80])
DEST[127:96] := (SRC1[111:96] * SRC2[111:96]) + (SRC1[127:112] * SRC2[127:112])
DEST[159:128] := (SRC1[143:128] * SRC2[143:128]) + (SRC1[159:144] * SRC2[159:144])
DEST[191:160] := (SRC1[175:160] * SRC2[175:160]) + (SRC1[191:176] * SRC2[191:176])
DEST[223:192] := (SRC1[207:192] * SRC2[207:192]) + (SRC1[223:208] * SRC2[223:208])
DEST[255:224] := (SRC1[239:224] * SRC2[239:224]) + (SRC1[255:240] * SRC2[255:240])
DEST[MAXVL-1:256] := 0

VPMADDWD (EVEX Encoded Versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := (SRC2[i+31:i+16]* SRC1[i+31:i+16]) + (SRC2[i+15:i]*SRC1[i+15:i])

     ELSE

             IF *merging-masking*          ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE *zeroing-masking*    ; zeroing-masking

                    DEST[i+31:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPMADDWD __m512i _mm512_madd_epi16( __m512i a, __m512i b);
VPMADDWD __m512i _mm512_mask_madd_epi16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPMADDWD __m512i _mm512_maskz_madd_epi16( __mmask32 k, __m512i a, __m512i b);
VPMADDWD __m256i _mm256_mask_madd_epi16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMADDWD __m256i _mm256_maskz_madd_epi16( __mmask16 k, __m256i a, __m256i b);
VPMADDWD __m128i _mm_mask_madd_epi16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMADDWD __m128i _mm_maskz_madd_epi16( __mmask8 k, __m128i a, __m128i b);
PMADDWD __m64 _mm_madd_pi16(__m64 m1, __m64 m2) (V)PMADDWD __m128i _mm_madd_epi16 ( __m128i a, __m128i b) VPMADDWD __m256i _mm256_madd_epi16 ( __m256i a, __m256i b);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

非EVEX-encoded指令,参见表2-21"第4类例外条件". EVEX-encoded指令,参见表2-52中的例外类型E4NF.nb,"Type E4NF Class Except Convention Centers".
