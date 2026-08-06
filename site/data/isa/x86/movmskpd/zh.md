---
summary: 提取包装的 双精度浮点 签名罩
---

## 说明

从 源操作数 (秒 操作数) 中的 打包双精度浮点值 中提取符号位,将其格式化为2位面罩,并将面罩存储在 目标操作数 (第一个操作数)中. 源操作数是一个XMM登记册,目标操作数是一个通用寄存器. 面具存储在目标操作数的2个低序位. 零延伸目的地上位.

在64位模式下,指令可以访问额外的注册(XMM8-XMM15, R8-R15与 a 一起使用时REX.R前缀。 默认的操作数大小为64位,模式为64位.

128位版本 : 源操作数是一个YMM登记册. 目标操作数是一个通用注册.

VEX.256 编码版本 : 源操作数是一个YMM登记册. 目标操作数是一个通用注册.

说明: 在VEX-encoded版本中,VEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
(V)MOVMSKPD (128-bit Versions)
DEST[0] := SRC[63]
DEST[1] := SRC[127]
IF DEST = r32

    THEN DEST[31:2] := 0;
    ELSE DEST[63:2] := 0;
FI

VMOVMSKPD (VEX.256 Encoded Version)
DEST[0] := SRC[63]
DEST[1] := SRC[127]
DEST[2] := SRC[191]
DEST[3] := SRC[255]
IF DEST = r32

    THEN DEST[31:4] := 0;
    ELSE DEST[63:4] := 0;
FI
```

## Intel C/C++ 内在编译器

```c
MOVMSKPD int _mm_movemask_pd ( __m128d a) VMOVMSKPD _mm256_movemask_pd(__m256d a);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-24,"第7类例外条件",另外:

```text
#UD               If VEX.vvvv  1111B.
```
