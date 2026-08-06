---
summary: 整数
---

## 说明

Permute 128位整数数据来自第一源操作数(第二位操作数)和第二源操作数(第三位操作数),使用8位直接的比特并存储结果为目标操作数(第一位操作数). 第一源操作数是一个YMM登记册,第二源操作数是一个YMM登记册或256位的内存位置登记册,目标操作数是一个YMM登记册.

```text
             SRC2                       Y1                             Y0
```

```text
             SRC1                       X1                             X0
```

```text
             DEST                   X0, X1, Y0, or Y1                  X0, X1, Y0, or Y1
```

Figure 5-22. VPERM2I128 Operation

Imm8[1:0]为第一个目的地128位域选择源,imm8[5:4]为第二个目的地域选择源. 如果 imm8 [3] 设置,则低128位字段 被清零. 如果 imm8 [7] 设置,则高128位字段 被清零. VEX.L必须是1,否则指令会#UD.

## 行动

```text
VPERM2I128
CASE IMM8[1:0] of
0: DEST[127:0] := SRC1[127:0]
1: DEST[127:0] := SRC1[255:128]
2: DEST[127:0] := SRC2[127:0]
3: DEST[127:0] := SRC2[255:128]
ESAC
CASE IMM8[5:4] of
0: DEST[255:128] := SRC1[127:0]
1: DEST[255:128] := SRC1[255:128]
2: DEST[255:128] := SRC2[127:0]
3: DEST[255:128] := SRC2[255:128]
ESAC
IF (imm8[3])
DEST[127:0] := 0
FI

IF (imm8[7])
DEST[255:128] := 0
FI
```

## Intel C/C++ 内在编译器

```c
VPERM2I128: __m256i _mm256_permute2x128_si256 (__m256i a, __m256i b, int control);
```

## SIMD 浮点 例外

None

## 其他例外

参见表2-23"第6类例外条件".

Additionally:

```text
#UD                 If VEX.L = 0,
```

If VEX.W = 1.
