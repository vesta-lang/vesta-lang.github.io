---
summary: 包装水平减法和饱和度
---

## 说明

(V)PHSUBSW通过从源头每对最小的单词和目标操作数中减去最显著的单词,对相邻的每对16位有符号整数进行水平减值. 签名的,饱和的16位结果被打包到目标操作数(第一个操作数). 当源操作数是128位的内存操作数时,操作数必须在16字节边界或一般保护例外(#GP)上对齐.

遗产 SSE 版本 : 两个操作数都可以是MMX注册. 第二源操作数可以是MMX的寄存器,也可以是64位的内存位置.

128位遗产 SSE 版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

在64位模式中,使用REX前缀访问额外的注册.

VEX.128 编码版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目的地YMM的位数(MAXVL-1:128)登记被清零.

VEX.256 编码版本 : 第一个来源和目标操作数是YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置.

## 行动

```text
PHSUBSW (With 64-bit Operands)
    mm1[15-0] = SaturateToSignedWord(mm1[15-0] - mm1[31-16]);
    mm1[31-16] = SaturateToSignedWord(mm1[47-32] - mm1[63-48]);
    mm1[47-32] = SaturateToSignedWord(mm2/m64[15-0] - mm2/m64[31-16]);
    mm1[63-48] = SaturateToSignedWord(mm2/m64[47-32] - mm2/m64[63-48]);


PHSUBSW (With 128-bit Operands)
    xmm1[15-0] = SaturateToSignedWord(xmm1[15-0] - xmm1[31-16]);
    xmm1[31-16] = SaturateToSignedWord(xmm1[47-32] - xmm1[63-48]);
    xmm1[47-32] = SaturateToSignedWord(xmm1[79-64] - xmm1[95-80]);
    xmm1[63-48] = SaturateToSignedWord(xmm1[111-96] - xmm1[127-112]);
    xmm1[79-64] = SaturateToSignedWord(xmm2/m128[15-0] - xmm2/m128[31-16]);
    xmm1[95-80] =SaturateToSignedWord(xmm2/m128[47-32] - xmm2/m128[63-48]);
    xmm1[111-96] =SaturateToSignedWord(xmm2/m128[79-64] - xmm2/m128[95-80]);
    xmm1[127-112]= SaturateToSignedWord(xmm2/m128[111-96] - xmm2/m128[127-112]);

VPHSUBSW (VEX.128 Encoded Version)
DEST[15:0]= SaturateToSignedWord(SRC1[15:0] - SRC1[31:16])
DEST[31:16] = SaturateToSignedWord(SRC1[47:32] - SRC1[63:48])
DEST[47:32] = SaturateToSignedWord(SRC1[79:64] - SRC1[95:80])
DEST[63:48] = SaturateToSignedWord(SRC1[111:96] - SRC1[127:112])
DEST[79:64] = SaturateToSignedWord(SRC2[15:0] - SRC2[31:16])
DEST[95:80] = SaturateToSignedWord(SRC2[47:32] - SRC2[63:48])
DEST[111:96] = SaturateToSignedWord(SRC2[79:64] - SRC2[95:80])
DEST[127:112] = SaturateToSignedWord(SRC2[111:96] - SRC2[127:112])
DEST[MAXVL-1:128] := 0

VPHSUBSW (VEX.256 Encoded Version)
DEST[15:0]= SaturateToSignedWord(SRC1[15:0] - SRC1[31:16])
DEST[31:16] = SaturateToSignedWord(SRC1[47:32] - SRC1[63:48])
DEST[47:32] = SaturateToSignedWord(SRC1[79:64] - SRC1[95:80])
DEST[63:48] = SaturateToSignedWord(SRC1[111:96] - SRC1[127:112])
DEST[79:64] = SaturateToSignedWord(SRC2[15:0] - SRC2[31:16])
DEST[95:80] = SaturateToSignedWord(SRC2[47:32] - SRC2[63:48])
DEST[111:96] = SaturateToSignedWord(SRC2[79:64] - SRC2[95:80])
DEST[127:112] = SaturateToSignedWord(SRC2[111:96] - SRC2[127:112])
DEST[143:128]= SaturateToSignedWord(SRC1[143:128] - SRC1[159:144])
DEST[159:144] = SaturateToSignedWord(SRC1[175:160] - SRC1[191:176])
DEST[175:160] = SaturateToSignedWord(SRC1[207:192] - SRC1[223:208])
DEST[191:176] = SaturateToSignedWord(SRC1[239:224] - SRC1[255:240])
DEST[207:192] = SaturateToSignedWord(SRC2[143:128] - SRC2[159:144])
DEST[223:208] = SaturateToSignedWord(SRC2[175:160] - SRC2[191:176])
DEST[239:224] = SaturateToSignedWord(SRC2[207:192] - SRC2[223:208])
DEST[255:240] = SaturateToSignedWord(SRC2[239:224] - SRC2[255:240])
```

## Intel C/C++ 内在编译器

```c
PHSUBSW __m64 _mm_hsubs_pi16 (__m64 a, __m64 b) (V)PHSUBSW __m128i _mm_hsubs_epi16 (__m128i a, __m128i b) VPHSUBSW __m256i _mm256_hsubs_epi16 (__m256i a, __m256i b);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",另外:

```text
#UD               If VEX.L = 1.
```
