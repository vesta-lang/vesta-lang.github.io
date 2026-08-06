---
summary: 乘以包装 有符号整数 并存储低结果
---

## 说明

执行SIMD在目标操作数(第一个操作数)和源操作数(第二个操作数)中签名的已装入的签名单词整数的乘法,并将每个中间32位结果的低16位存储在目标操作数中. (图4-12在使用64位操作数时显示此操作.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE版本 64位 操作数: 源操作数可以是MMX技术寄存器或64位内存位置. 目标操作数是一个MMX技术登记册.

128位遗产 SSE 版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目的地YMM的位数(MAXVL-1:128)登记被清零. VEX.L必须是0,否则指令会#UD.

VEX.256 编码版本 : 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 第一个来源和目标操作数是YMM登记册.

EVEX 编码版本 : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数是一个ZMM/YMM/XMM登记册,一个512/256/128位的内存位置. 目标操作数基于写掩码 k1有条件更新.

SRC               X3                                          X2       X1  X0 DEST

```text
                  Y3                                          Y2       Y1  Y0
```

TEMP Z3 = X3  Y3  Z2 = X2  Y2                                          Z1 = X1  Y1  Z0 = X0  Y0

DEST              Z3[15:0] Z2[15:0] Z1[15:0] Z0[15:0]

图4-13. PMULLU 指令操作 使用 64 位 操作数

## 行动

```text
PMULLW (With 64-bit Operands)
    TEMP0[31:0] := DEST[15:0]  SRC[15:0]; (* Signed multiplication *)
    TEMP1[31:0] := DEST[31:16]  SRC[31:16];
    TEMP2[31:0] := DEST[47:32]  SRC[47:32];
    TEMP3[31:0] := DEST[63:48]  SRC[63:48];
    DEST[15:0] := TEMP0[15:0];
    DEST[31:16] := TEMP1[15:0];
    DEST[47:32] := TEMP2[15:0];
    DEST[63:48] := TEMP3[15:0];

PMULLW (With 128-bit Operands)
    TEMP0[31:0] := DEST[15:0]  SRC[15:0]; (* Signed multiplication *)
    TEMP1[31:0] := DEST[31:16]  SRC[31:16];
    TEMP2[31:0] := DEST[47:32]  SRC[47:32];
    TEMP3[31:0] := DEST[63:48]  SRC[63:48];
    TEMP4[31:0] := DEST[79:64]  SRC[79:64];
    TEMP5[31:0] := DEST[95:80]  SRC[95:80];
    TEMP6[31:0] := DEST[111:96]  SRC[111:96];
    TEMP7[31:0] := DEST[127:112]  SRC[127:112];
    DEST[15:0] := TEMP0[15:0];
    DEST[31:16] := TEMP1[15:0];
    DEST[47:32] := TEMP2[15:0];
    DEST[63:48] := TEMP3[15:0];
    DEST[79:64] := TEMP4[15:0];
    DEST[95:80] := TEMP5[15:0];
    DEST[111:96] := TEMP6[15:0];
    DEST[127:112] := TEMP7[15:0];

DEST[MAXVL-1:256] := 0


VPMULLW (VEX.128 Encoded Version)
Temp0[31:0] := SRC1[15:0] * SRC2[15:0]
Temp1[31:0] := SRC1[31:16] * SRC2[31:16]
Temp2[31:0] := SRC1[47:32] * SRC2[47:32]
Temp3[31:0] := SRC1[63:48] * SRC2[63:48]
Temp4[31:0] := SRC1[79:64] * SRC2[79:64]
Temp5[31:0] := SRC1[95:80] * SRC2[95:80]
Temp6[31:0] := SRC1[111:96] * SRC2[111:96]
Temp7[31:0] := SRC1[127:112] * SRC2[127:112]
DEST[15:0] := Temp0[15:0]
DEST[31:16] := Temp1[15:0]
DEST[47:32] := Temp2[15:0]
DEST[63:48] := Temp3[15:0]
DEST[79:64] := Temp4[15:0]
DEST[95:80] := Temp5[15:0]
DEST[111:96] := Temp6[15:0]
DEST[127:112] := Temp7[15:0]
DEST[MAXVL-1:128] := 0

PMULLW (EVEX Encoded Versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN

             temp[31:0] := SRC1[i+15:i] * SRC2[i+15:i]

             DEST[i+15:i] := temp[15:0]

     ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*                 ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPMULLW __m512i _mm512_mullo_epi16(__m512i a, __m512i b);
VPMULLW __m512i _mm512_mask_mullo_epi16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPMULLW __m512i _mm512_maskz_mullo_epi16( __mmask32 k, __m512i a, __m512i b);
VPMULLW __m256i _mm256_mask_mullo_epi16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMULLW __m256i _mm256_maskz_mullo_epi16( __mmask16 k, __m256i a, __m256i b);
VPMULLW __m128i _mm_mask_mullo_epi16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMULLW __m128i _mm_maskz_mullo_epi16( __mmask8 k, __m128i a, __m128i b);
PMULLW __m64 _mm_mullo_pi16(__m64 m1, __m64 m2) (V)PMULLW __m128i _mm_mullo_epi16 ( __m128i a, __m128i b) VPMULLW __m256i _mm256_mullo_epi16 ( __m256i a, __m256i b);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

非EVEX-encoded指令,参见表2-21"第4类例外条件". EVEX-encoded指令,参见表2-51"第E4类例外条件"中的例外类型E4.nb.
