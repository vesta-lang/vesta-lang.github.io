---
summary: 混合 打包单精度浮点值
---

## 说明

来自第二源操作数(第三代操作数)的打包单精度浮点值被有条件地与来自第一源操作数(第二代操作数)的数值合并,并写入目标操作数(第一代操作数). 即时位数 [7:0] 确定目的地对应的单精度浮点值是否从第二个来源或第一个来源复制. 如果口罩中的一点,对应一个单词是"1",那么第二源操作数中的单精度浮点值会被复制,否则第一源操作数中的值会被复制.

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(YMM注册点)没有修改.

VEX.128 编码版本 : 第一源操作数 a XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 对应的YMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册.

## 行动

```text
BLENDPS (128-bit Legacy SSE Version)
IF (IMM8[0] = 0) THEN DEST[31:0] :=DEST[31:0]

          ELSE DEST [31:0] := SRC[31:0] FI
IF (IMM8[1] = 0) THEN DEST[63:32] := DEST[63:32]

          ELSE DEST [63:32] := SRC[63:32] FI
IF (IMM8[2] = 0) THEN DEST[95:64] := DEST[95:64]

          ELSE DEST [95:64] := SRC[95:64] FI
IF (IMM8[3] = 0) THEN DEST[127:96] := DEST[127:96]

          ELSE DEST [127:96] := SRC[127:96] FI
DEST[MAXVL-1:128] (Unmodified)


VBLENDPS (VEX.128 Encoded Version)
IF (IMM8[0] = 0) THEN DEST[31:0] :=SRC1[31:0]

          ELSE DEST [31:0] := SRC2[31:0] FI
IF (IMM8[1] = 0) THEN DEST[63:32] := SRC1[63:32]

          ELSE DEST [63:32] := SRC2[63:32] FI
IF (IMM8[2] = 0) THEN DEST[95:64] := SRC1[95:64]

          ELSE DEST [95:64] := SRC2[95:64] FI
IF (IMM8[3] = 0) THEN DEST[127:96] := SRC1[127:96]

          ELSE DEST [127:96] := SRC2[127:96] FI
DEST[MAXVL-1:128] := 0

VBLENDPS (VEX.256 Encoded Version)
IF (IMM8[0] = 0) THEN DEST[31:0] :=SRC1[31:0]

          ELSE DEST [31:0] := SRC2[31:0] FI
IF (IMM8[1] = 0) THEN DEST[63:32] := SRC1[63:32]

          ELSE DEST [63:32] := SRC2[63:32] FI
IF (IMM8[2] = 0) THEN DEST[95:64] := SRC1[95:64]

          ELSE DEST [95:64] := SRC2[95:64] FI
IF (IMM8[3] = 0) THEN DEST[127:96] := SRC1[127:96]

          ELSE DEST [127:96] := SRC2[127:96] FI
IF (IMM8[4] = 0) THEN DEST[159:128] := SRC1[159:128]

          ELSE DEST [159:128] := SRC2[159:128] FI
IF (IMM8[5] = 0) THEN DEST[191:160] := SRC1[191:160]

          ELSE DEST [191:160] := SRC2[191:160] FI
IF (IMM8[6] = 0) THEN DEST[223:192] := SRC1[223:192]

          ELSE DEST [223:192] := SRC2[223:192] FI
IF (IMM8[7] = 0) THEN DEST[255:224] := SRC1[255:224]

          ELSE DEST [255:224] := SRC2[255:224] FI.
```

## Intel C/C++ 内在编译器

```c
BLENDPS __m128 _mm_blend_ps (__m128 v1, __m128 v2, const int mask);
VBLENDPS __m256 _mm256_blend_ps (__m256 a, __m256 b, const int mask);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".
