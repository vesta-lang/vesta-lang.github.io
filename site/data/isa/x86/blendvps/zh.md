---
summary: 变量组合 打包单精度浮点值
---

## 说明

根据面具寄存器操作中定义的面具比特,有条件地从第二源操作和第一源操作中复制单个精度浮点值的单词数据元素. 口罩比特是口罩寄存器每个词元素中最重要的比特.

目标操作数 的每个四字元素都从 :

* (a) 第二源操作数中相应的词元,如果一个面具位是"1";或 * 第一源操作数中相应的词元,如果一个面具位是"0".

BLENDVPS隐含的面具操作数的登记册分配被定义为建筑登记册XMM0.

128位遗产 SSE 版本 : 第一源操作数和目标操作数是相同的. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128). 面具登记册操作数被隐含地定义为建筑登记册XMM0. 试图用 VEX 前缀执行 BLENDVPS 会导致 #UD.

VEX.128 编码版本 : 第一源操作数和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 面具操作数是第三个源寄存器,以位码[7:4]编码为即时字节(imm8). Imm8的比特[3:0]被忽略. 在32位模式中,imm8[7]被忽略. 对应的YMM注册(目的地注册)的上位(MAXVL-1:128)被清零. VEX.W必须是0,否则,指令会#UD.

VEX.256 编码版本 : 第一源操作数和目标操作数是YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 面具操作数是第三个源寄存器,以位码[7:4]编码为即时字节(imm8). Imm8的比特[3:0]被忽略. 在32位模式中,imm8[7]被忽略. VEX.W必须是0,否则,指令会#UD.

VBLENDVPS允许面具为任何XMM或YMM注册. 相比之下,BLENDVPS暗中将XMM0视为面具,不支持无损目的地操作.

## 行动

```text
BLENDVPS (128-bit Legacy SSE Version)
MASK := XMM0
IF (MASK[31] = 0) THEN DEST[31:0] := DEST[31:0]

          ELSE DEST [31:0] := SRC[31:0] FI
IF (MASK[63] = 0) THEN DEST[63:32] := DEST[63:32]

          ELSE DEST [63:32] := SRC[63:32] FI
IF (MASK[95] = 0) THEN DEST[95:64] := DEST[95:64]

          ELSE DEST [95:64] := SRC[95:64] FI
IF (MASK[127] = 0) THEN DEST[127:96] := DEST[127:96]

          ELSE DEST [127:96] := SRC[127:96] FI
DEST[MAXVL-1:128] (Unmodified)

VBLENDVPS (VEX.128 Encoded Version)
MASK := SRC3
IF (MASK[31] = 0) THEN DEST[31:0] := SRC1[31:0]

          ELSE DEST [31:0] := SRC2[31:0] FI
IF (MASK[63] = 0) THEN DEST[63:32] := SRC1[63:32]

          ELSE DEST [63:32] := SRC2[63:32] FI
IF (MASK[95] = 0) THEN DEST[95:64] := SRC1[95:64]

          ELSE DEST [95:64] := SRC2[95:64] FI
IF (MASK[127] = 0) THEN DEST[127:96] := SRC1[127:96]

          ELSE DEST [127:96] := SRC2[127:96] FI
DEST[MAXVL-1:128] := 0

VBLENDVPS (VEX.256 Encoded Version)
MASK := SRC3
IF (MASK[31] = 0) THEN DEST[31:0] := SRC1[31:0]

          ELSE DEST [31:0] := SRC2[31:0] FI
IF (MASK[63] = 0) THEN DEST[63:32] := SRC1[63:32]

          ELSE DEST [63:32] := SRC2[63:32] FI
IF (MASK[95] = 0) THEN DEST[95:64] := SRC1[95:64]

          ELSE DEST [95:64] := SRC2[95:64] FI
IF (MASK[127] = 0) THEN DEST[127:96] := SRC1[127:96]

          ELSE DEST [127:96] := SRC2[127:96] FI
IF (MASK[159] = 0) THEN DEST[159:128] := SRC1[159:128]

          ELSE DEST [159:128] := SRC2[159:128] FI
IF (MASK[191] = 0) THEN DEST[191:160] := SRC1[191:160]

          ELSE DEST [191:160] := SRC2[191:160] FI
IF (MASK[223] = 0) THEN DEST[223:192] := SRC1[223:192]

          ELSE DEST [223:192] := SRC2[223:192] FI
IF (MASK[255] = 0) THEN DEST[255:224] := SRC1[255:224]

          ELSE DEST [255:224] := SRC2[255:224] FI
```

## Intel C/C++ 内在编译器

```c
BLENDVPS __m128 _mm_blendv_ps(__m128 v1, __m128 v2, __m128 v3);
VBLENDVPS __m128 _mm_blendv_ps (__m128 a, __m128 b, __m128 mask);
VBLENDVPS __m256 _mm256_blendv_ps (__m256 a, __m256 b, __m256 mask);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",另外:

```text
#UD               If VEX.W = 1.
```
