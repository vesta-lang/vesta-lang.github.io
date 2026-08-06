---
summary: 组合词
---

## 说明

来自源操作数(第二代操作数)的字元根据立即数操作数(第三代操作数)中的位数,有条件地写入目标操作数(第一代操作数). 即时位数(bits 7:0)形成一个面具,决定目的地中对应的词是否从源头复制. 如果口罩中的一点,对应一个词是"1",那么该词被复制,否则该词不变.

VEX.128 编码版本 : 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 第一个来源和目标操作数是XMM登记册. 对应的YMM注册被清零的位数(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册.

## 行动

```text
VPBLENDD (VEX.256 encoded version)
IF (imm8[0] == 1) THEN DEST[31:0] := SRC2[31:0]
ELSE DEST[31:0] := SRC1[31:0]
IF (imm8[1] == 1) THEN DEST[63:32] := SRC2[63:32]
ELSE DEST[63:32] := SRC1[63:32]
IF (imm8[2] == 1) THEN DEST[95:64] := SRC2[95:64]
ELSE DEST[95:64] := SRC1[95:64]
IF (imm8[3] == 1) THEN DEST[127:96] := SRC2[127:96]
ELSE DEST[127:96] := SRC1[127:96]
IF (imm8[4] == 1) THEN DEST[159:128] := SRC2[159:128]
ELSE DEST[159:128] := SRC1[159:128]
IF (imm8[5] == 1) THEN DEST[191:160] := SRC2[191:160]
ELSE DEST[191:160] := SRC1[191:160]
IF (imm8[6] == 1) THEN DEST[223:192] := SRC2[223:192]
ELSE DEST[223:192] := SRC1[223:192]
IF (imm8[7] == 1) THEN DEST[255:224] := SRC2[255:224]
ELSE DEST[255:224] := SRC1[255:224]


VPBLENDD (VEX.128 encoded version)
IF (imm8[0] == 1) THEN DEST[31:0] := SRC2[31:0]
ELSE DEST[31:0] := SRC1[31:0]
IF (imm8[1] == 1) THEN DEST[63:32] := SRC2[63:32]
ELSE DEST[63:32] := SRC1[63:32]
IF (imm8[2] == 1) THEN DEST[95:64] := SRC2[95:64]
ELSE DEST[95:64] := SRC1[95:64]
IF (imm8[3] == 1) THEN DEST[127:96] := SRC2[127:96]
ELSE DEST[127:96] := SRC1[127:96]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VPBLENDD:      __m128i _mm_blend_epi32 (__m128i v1, __m128i v2, const int mask) VPBLENDD:      __m256i _mm256_blend_epi32 (__m256i v1, __m256i v2, const int mask);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".

Additionally:

```text
#UD               If VEX.W = 1.
```
