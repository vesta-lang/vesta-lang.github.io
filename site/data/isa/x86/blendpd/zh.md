---
summary: 混合 打包双精度浮点值
---

## 说明

来自第二源操作数(第三操作数)的双精度浮点值被有条件地与来自第一源操作数(第二操作数)的值合并,并写入目标操作数(第一操作数). 即时位数[3:0]确定目的地对应的双精度浮点值是从第二个来源还是第一个来源复制的. 如果口罩中的一点,对应一个单词是"1",那么第二源操作数中的双精度浮点值会被复制,否则第一源操作数中的值会被复制.

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(YMM注册点)没有修改.

VEX.128编码版本:第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 对应的YMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册.

## 行动

```text
BLENDPD (128-bit Legacy SSE Version)
IF (IMM8[0] = 0)THEN DEST[63:0] := DEST[63:0]

          ELSE DEST [63:0] := SRC[63:0] FI
IF (IMM8[1] = 0) THEN DEST[127:64] := DEST[127:64]

          ELSE DEST [127:64] := SRC[127:64] FI
DEST[MAXVL-1:128] (Unmodified)

VBLENDPD (VEX.128 Encoded Version)
IF (IMM8[0] = 0)THEN DEST[63:0] := SRC1[63:0]

          ELSE DEST [63:0] := SRC2[63:0] FI
IF (IMM8[1] = 0) THEN DEST[127:64] := SRC1[127:64]

          ELSE DEST [127:64] := SRC2[127:64] FI
DEST[MAXVL-1:128] := 0


VBLENDPD (VEX.256 Encoded Version)
IF (IMM8[0] = 0)THEN DEST[63:0] := SRC1[63:0]

          ELSE DEST [63:0] := SRC2[63:0] FI
IF (IMM8[1] = 0) THEN DEST[127:64] := SRC1[127:64]

          ELSE DEST [127:64] := SRC2[127:64] FI
IF (IMM8[2] = 0) THEN DEST[191:128] := SRC1[191:128]

          ELSE DEST [191:128] := SRC2[191:128] FI
IF (IMM8[3] = 0) THEN DEST[255:192] := SRC1[255:192]

          ELSE DEST [255:192] := SRC2[255:192] FI
```

## Intel C/C++ 内在编译器

```c
BLENDPD __m128d _mm_blend_pd (__m128d v1, __m128d v2, const int mask);
VBLENDPD __m256d _mm256_blend_pd (__m256d a, __m256d b, const int mask);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".
