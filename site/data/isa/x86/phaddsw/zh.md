---
summary: 包装水平添加和饱和
---

## 说明

(V)PHADDSW从源头水平增加两个相邻的16位整数,目标操作数并饱和所签名的结果;将所签名的,饱和的16位结果打包到目标操作数(第一个操作数)时,当源操作数是128位的内存操作数时,操作数必须在16字节边界或一般保护例外(#GP)上对齐.

遗产 SSE 版本 : 两个操作数都可以是MMX注册. 第二源操作数可以是MMX的寄存器,也可以是64位的内存位置.

128位遗产 SSE 版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

在64位模式中,使用REX前缀访问额外的注册.

VEX.128 编码版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目的地YMM的位数(MAXVL-1:128)登记被清零.

VEX.256 编码版本 : 第一个来源和目标操作数是YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置.

## 行动

```text
PHADDSW (With 64-bit Operands)
    mm1[15-0] = SaturateToSignedWord((mm1[31-16] + mm1[15-0]);
    mm1[31-16] = SaturateToSignedWord(mm1[63-48] + mm1[47-32]);
    mm1[47-32] = SaturateToSignedWord(mm2/m64[31-16] + mm2/m64[15-0]);
    mm1[63-48] = SaturateToSignedWord(mm2/m64[63-48] + mm2/m64[47-32]);


PHADDSW (With 128-bit Operands)

    xmm1[15-0]= SaturateToSignedWord(xmm1[31-16] + xmm1[15-0]);
    xmm1[31-16] = SaturateToSignedWord(xmm1[63-48] + xmm1[47-32]);
    xmm1[47-32] = SaturateToSignedWord(xmm1[95-80] + xmm1[79-64]);
    xmm1[63-48] = SaturateToSignedWord(xmm1[127-112] + xmm1[111-96]);
    xmm1[79-64] = SaturateToSignedWord(xmm2/m128[31-16] + xmm2/m128[15-0]);
    xmm1[95-80] = SaturateToSignedWord(xmm2/m128[63-48] + xmm2/m128[47-32]);
    xmm1[111-96] = SaturateToSignedWord(xmm2/m128[95-80] + xmm2/m128[79-64]);
    xmm1[127-112] = SaturateToSignedWord(xmm2/m128[127-112] + xmm2/m128[111-96]);

VPHADDSW (VEX.128 Encoded Version)
DEST[15:0]= SaturateToSignedWord(SRC1[31:16] + SRC1[15:0])
DEST[31:16] = SaturateToSignedWord(SRC1[63:48] + SRC1[47:32])
DEST[47:32] = SaturateToSignedWord(SRC1[95:80] + SRC1[79:64])
DEST[63:48] = SaturateToSignedWord(SRC1[127:112] + SRC1[111:96])
DEST[79:64] = SaturateToSignedWord(SRC2[31:16] + SRC2[15:0])
DEST[95:80] = SaturateToSignedWord(SRC2[63:48] + SRC2[47:32])
DEST[111:96] = SaturateToSignedWord(SRC2[95:80] + SRC2[79:64])
DEST[127:112] = SaturateToSignedWord(SRC2[127:112] + SRC2[111:96])
DEST[MAXVL-1:128] := 0

VPHADDSW (VEX.256 Encoded Version)
DEST[15:0]= SaturateToSignedWord(SRC1[31:16] + SRC1[15:0])
DEST[31:16] = SaturateToSignedWord(SRC1[63:48] + SRC1[47:32])
DEST[47:32] = SaturateToSignedWord(SRC1[95:80] + SRC1[79:64])
DEST[63:48] = SaturateToSignedWord(SRC1[127:112] + SRC1[111:96])
DEST[79:64] = SaturateToSignedWord(SRC2[31:16] + SRC2[15:0])
DEST[95:80] = SaturateToSignedWord(SRC2[63:48] + SRC2[47:32])
DEST[111:96] = SaturateToSignedWord(SRC2[95:80] + SRC2[79:64])
DEST[127:112] = SaturateToSignedWord(SRC2[127:112] + SRC2[111:96])
DEST[143:128]= SaturateToSignedWord(SRC1[159:144] + SRC1[143:128])
DEST[159:144] = SaturateToSignedWord(SRC1[191:176] + SRC1[175:160])
DEST[175:160] = SaturateToSignedWord( SRC1[223:208] + SRC1[207:192])
DEST[191:176] = SaturateToSignedWord(SRC1[255:240] + SRC1[239:224])
DEST[207:192] = SaturateToSignedWord(SRC2[127:112] + SRC2[143:128])
DEST[223:208] = SaturateToSignedWord(SRC2[159:144] + SRC2[175:160])
DEST[239:224] = SaturateToSignedWord(SRC2[191-160] + SRC2[159-128])
DEST[255:240] = SaturateToSignedWord(SRC2[255:240] + SRC2[239:224])
```

## Intel C/C++ 内在编译器

```c
PHADDSW __m64 _mm_hadds_pi16 (__m64 a, __m64 b) (V)PHADDSW __m128i _mm_hadds_epi16 (__m128i a, __m128i b) VPHADDSW __m256i _mm256_hadds_epi16 (__m256i a, __m256i b);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",另外:

```text
#UD               If VEX.L = 1.
```
