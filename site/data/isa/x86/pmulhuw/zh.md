---
summary: 乘以包装 无符号整数 并存储高结果
---

## 说明

在目标操作数(第一个操作数)和源操作数(第二个操作数)中执行一个SIMD无符号的无符号字词整数乘法,并将每个32位中间结果的高16位存储在目标操作数中. (图4-12在使用64位操作数时显示此操作.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE版本 64位 操作数: 源操作数可以是MMX技术寄存器或64位内存位置. 目标操作数是一个MMX技术登记册.

128位遗产 SSE 版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目的地YMM的位数(MAXVL-1:128)登记被清零. VEX.L必须是0,否则指令会#UD.

VEX.256 编码版本 : 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 第一个来源和目标操作数是YMM登记册.

EVEX 编码版本 : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM登记器,512/256/128位内存位置. 目标操作数是一个ZMM/YMM/XMM的登记册,有条件的更新有写掩码 k1.

SRC               X3                                              X2     X1  X0 DEST

```text
                  Y3                                              Y2     Y1  Y0
```

TEMP Z3 = X3  Y3  Z2 = X2  Y2                                            Z1 = X1  Y1  Z0 = X0  Y0

DEST              Z3[31:16] Z2[31:16] Z1[31:16] Z0[31:16]

图4-12. PMULHUW 和 PMULHW 指令操作 使用 64 位 操作数

## 行动

```text
PMULHUW (With 64-bit Operands)
    TEMP0[31:0] := DEST[15:0]  SRC[15:0]; (* Unsigned multiplication *)
    TEMP1[31:0] := DEST[31:16]  SRC[31:16];
    TEMP2[31:0] := DEST[47:32]  SRC[47:32];
    TEMP3[31:0] := DEST[63:48]  SRC[63:48];
    DEST[15:0] := TEMP0[31:16];
    DEST[31:16] := TEMP1[31:16];
    DEST[47:32] := TEMP2[31:16];
    DEST[63:48] := TEMP3[31:16];

PMULHUW (With 128-bit Operands)
    TEMP0[31:0] := DEST[15:0]  SRC[15:0]; (* Unsigned multiplication *)
    TEMP1[31:0] := DEST[31:16]  SRC[31:16];
    TEMP2[31:0] := DEST[47:32]  SRC[47:32];
    TEMP3[31:0] := DEST[63:48]  SRC[63:48];
    TEMP4[31:0] := DEST[79:64]  SRC[79:64];
    TEMP5[31:0] := DEST[95:80]  SRC[95:80];
    TEMP6[31:0] := DEST[111:96]  SRC[111:96];
    TEMP7[31:0] := DEST[127:112]  SRC[127:112];
    DEST[15:0] := TEMP0[31:16];
    DEST[31:16] := TEMP1[31:16];
    DEST[47:32] := TEMP2[31:16];
    DEST[63:48] := TEMP3[31:16];
    DEST[79:64] := TEMP4[31:16];
    DEST[95:80] := TEMP5[31:16];
    DEST[111:96] := TEMP6[31:16];
    DEST[127:112] := TEMP7[31:16];

VPMULHUW (VEX.128 Encoded Version)


TEMP0[31:0] := SRC1[15:0] * SRC2[15:0]
TEMP1[31:0] := SRC1[31:16] * SRC2[31:16]
TEMP2[31:0] := SRC1[47:32] * SRC2[47:32]
TEMP3[31:0] := SRC1[63:48] * SRC2[63:48]
TEMP4[31:0] := SRC1[79:64] * SRC2[79:64]
TEMP5[31:0] := SRC1[95:80] * SRC2[95:80]
TEMP6[31:0] := SRC1[111:96] * SRC2[111:96]
TEMP7[31:0] := SRC1[127:112] * SRC2[127:112]
DEST[15:0] := TEMP0[31:16]
DEST[31:16] := TEMP1[31:16]
DEST[47:32] := TEMP2[31:16]
DEST[63:48] := TEMP3[31:16]
DEST[79:64] := TEMP4[31:16]
DEST[95:80] := TEMP5[31:16]
DEST[111:96] := TEMP6[31:16]
DEST[127:112] := TEMP7[31:16]
DEST[MAXVL-1:128] := 0

PMULHUW (VEX.256 Encoded Version)
TEMP0[31:0] := SRC1[15:0] * SRC2[15:0]
TEMP1[31:0] := SRC1[31:16] * SRC2[31:16]
TEMP2[31:0] := SRC1[47:32] * SRC2[47:32]
TEMP3[31:0] := SRC1[63:48] * SRC2[63:48]
TEMP4[31:0] := SRC1[79:64] * SRC2[79:64]
TEMP5[31:0] := SRC1[95:80] * SRC2[95:80]
TEMP6[31:0] := SRC1[111:96] * SRC2[111:96]
TEMP7[31:0] := SRC1[127:112] * SRC2[127:112]
TEMP8[31:0] := SRC1[143:128] * SRC2[143:128]
TEMP9[31:0] := SRC1[159:144] * SRC2[159:144]
TEMP10[31:0] := SRC1[175:160] * SRC2[175:160]
TEMP11[31:0] := SRC1[191:176] * SRC2[191:176]
TEMP12[31:0] := SRC1[207:192] * SRC2[207:192]
TEMP13[31:0] := SRC1[223:208] * SRC2[223:208]
TEMP14[31:0] := SRC1[239:224] * SRC2[239:224]
TEMP15[31:0] := SRC1[255:240] * SRC2[255:240]
DEST[15:0] := TEMP0[31:16]
DEST[31:16] := TEMP1[31:16]
DEST[47:32] := TEMP2[31:16]
DEST[63:48] := TEMP3[31:16]
DEST[79:64] := TEMP4[31:16]
DEST[95:80] := TEMP5[31:16]
DEST[111:96] := TEMP6[31:16]
DEST[127:112] := TEMP7[31:16]
DEST[143:128] := TEMP8[31:16]
DEST[159:144] := TEMP9[31:16]
DEST[175:160] := TEMP10[31:16]
DEST[191:176] := TEMP11[31:16]
DEST[207:192] := TEMP12[31:16]
DEST[223:208] := TEMP13[31:16]
DEST[239:224] := TEMP14[31:16]
DEST[255:240] := TEMP15[31:16]
DEST[MAXVL-1:256] := 0

PMULHUW (EVEX Encoded Versions)


(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN

             temp[31:0] := SRC1[i+15:i] * SRC2[i+15:i]

             DEST[i+15:i] := tmp[31:16]

     ELSE

             IF *merging-masking*          ; merging-masking

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
VPMULHUW __m512i _mm512_mulhi_epu16(__m512i a, __m512i b);
VPMULHUW __m512i _mm512_mask_mulhi_epu16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPMULHUW __m512i _mm512_maskz_mulhi_epu16( __mmask32 k, __m512i a, __m512i b);
VPMULHUW __m256i _mm256_mask_mulhi_epu16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMULHUW __m256i _mm256_maskz_mulhi_epu16( __mmask16 k, __m256i a, __m256i b);
VPMULHUW __m128i _mm_mask_mulhi_epu16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMULHUW __m128i _mm_maskz_mulhi_epu16( __mmask8 k, __m128i a, __m128i b);
PMULHUW __m64 _mm_mulhi_pu16(__m64 a, __m64 b) (V)PMULHUW __m128i _mm_mulhi_epu16 ( __m128i a, __m128i b) VPMULHUW __m256i _mm256_mulhi_epu16 ( __m256i a, __m256i b);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

非EVEX-encoded指令,参见表2-21"第4类例外条件". EVEX-encoded指令,参见表2-51"第E4类例外条件"中的例外类型E4.nb.
