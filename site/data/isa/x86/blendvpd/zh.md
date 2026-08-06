---
summary: 变量组合 打包双精度浮点值
---

## 说明

有条件地从 第二源操作数 和 第一源操作数 中复制 双精度浮点 值的每个四字数据元素,这取决于面具寄存器 操作数 中定义的掩码位. 面具比特是面具寄存器每个四字元素中最重要的比特.

目标操作数 的每个四字元素都从 :

* (a) 第二源操作数中相应的四字元素,如果一个掩码位为"1";或 * 第一源操作数 中对应的四字元素,如果一个掩码位是"0"

BLENDVPD隐含的面具操作数的登记册分配被定义为建筑登记册XMM0.

128位遗产 SSE 版本 : 第一源操作数和目标操作数是相同的. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128). 面具登记册操作数被隐含地定义为建筑登记册XMM0. 试图用 VEX 前缀执行 BLENDVPD 会导致 #UD.

VEX.128 编码版本 : 第一源操作数和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 面具操作数是第三个源寄存器,以位码[7:4]编码为即时字节(imm8). Imm8的比特[3:0]被忽略. 在32位模式中,imm8[7]被忽略. 对应的YMM注册(目的地注册)的上位(MAXVL-1:128)被清零. VEX.W必须是0,否则,指令会#UD.

VEX.256 编码版本 : 第一源操作数和目标操作数是YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 面具操作数是第三个源寄存器,以位码[7:4]编码为即时字节(imm8). Imm8的比特[3:0]被忽略. 在32位模式中,imm8[7]被忽略. VEX.W必须是0,否则,指令会#UD.

VBLENDVPD允许面具为任何XMM或YMM注册. 相比之下,BLENDVPD暗中将XMM0视为面具,不支持无损目的地操作.

## 行动

```text
BLENDVPD (128-bit Legacy SSE Version)
MASK := XMM0
IF (MASK[63] = 0) THEN DEST[63:0] := DEST[63:0]

          ELSE DEST [63:0] := SRC[63:0] FI
IF (MASK[127] = 0) THEN DEST[127:64] := DEST[127:64]

          ELSE DEST [127:64] := SRC[127:64] FI
DEST[MAXVL-1:128] (Unmodified)

VBLENDVPD (VEX.128 Encoded Version)
MASK := SRC3
IF (MASK[63] = 0) THEN DEST[63:0] := SRC1[63:0]

          ELSE DEST [63:0] := SRC2[63:0] FI
IF (MASK[127] = 0) THEN DEST[127:64] := SRC1[127:64]

          ELSE DEST [127:64] := SRC2[127:64] FI
DEST[MAXVL-1:128] := 0

VBLENDVPD (VEX.256 Encoded Version)
MASK := SRC3
IF (MASK[63] = 0) THEN DEST[63:0] := SRC1[63:0]

          ELSE DEST [63:0] := SRC2[63:0] FI
IF (MASK[127] = 0) THEN DEST[127:64] := SRC1[127:64]

          ELSE DEST [127:64] := SRC2[127:64] FI
IF (MASK[191] = 0) THEN DEST[191:128] := SRC1[191:128]

          ELSE DEST [191:128] := SRC2[191:128] FI
IF (MASK[255] = 0) THEN DEST[255:192] := SRC1[255:192]

          ELSE DEST [255:192] := SRC2[255:192] FI
```

## Intel C/C++ 内在编译器

```c
BLENDVPD __m128d _mm_blendv_pd(__m128d v1, __m128d v2, __m128d v3);
VBLENDVPD __m128 _mm_blendv_pd (__m128d a, __m128d b, __m128d mask);
VBLENDVPD __m256 _mm256_blendv_pd (__m256d a, __m256d b, __m256d mask);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",另外:

```text
#UD               If VEX.W = 1.
```
