---
summary: 插入 标量 单精度浮点 值
---

## 说明

(登记来源表)

将单精度标量 浮点元素复制到128位矢量寄存器中. 立即数操作数有三个字段,其中ZMask比特指定目的地的哪些元素将被设定为零,Counter D比特指定目的地的哪个元素将被标量值覆盖,对于矢量寄存器源,Counter S比特指定源的哪个元素将被复制. 当 标量 来源为 内存操作数 时, Counter S 位点会被忽略.

(记忆源形式)

从32位的内存位置和目标操作数中装入一个浮点元素,在立即数操作数的Counter D比特表示的位置上装入第一个源. 基于 立即数操作数 的 Zmask 位点存储在目的地和0 输出目的元素.

128位遗产 SSE 版本 : 第一个来源登记册是XMM登记册。 第二源操作数要么是一个XMM寄存器,要么是一个32位的内存位置. 目的地与第一个来源的XMM寄存器没有区别,对应寄存器目的地的上位(MAXVL-1:128)没有修改.

VEX.128和EVEX编码版本: 目的地和第一个来源登记册是XMM登记册. 第二源操作数要么是一个XMM寄存器,要么是一个32位的内存位置. 对应注册目的地MAXVL-1:128的上位数(MAXVL): 被清零.

如果VINSERTPS被用VEX.L=1编码,试图执行用VEX.L=1编码的指令,将导致#UD例外.

## 行动

```text
VINSERTPS (VEX.128 and EVEX Encoded Version)
IF (SRC = REG) THEN COUNT_S := imm8[7:6]

    ELSE COUNT_S := 0
COUNT_D := imm8[5:4]
ZMASK := imm8[3:0]
CASE (COUNT_S) OF

    0: TMP := SRC2[31:0]
    1: TMP := SRC2[63:32]
    2: TMP := SRC2[95:64]
    3: TMP := SRC2[127:96]
ESAC;
CASE (COUNT_D) OF
    0: TMP2[31:0] := TMP

          TMP2[127:32] := SRC1[127:32]
    1: TMP2[63:32] := TMP

          TMP2[31:0] := SRC1[31:0]
          TMP2[127:64] := SRC1[127:64]
    2: TMP2[95:64] := TMP
          TMP2[63:0] := SRC1[63:0]
          TMP2[127:96] := SRC1[127:96]
    3: TMP2[127:96] := TMP
          TMP2[95:0] := SRC1[95:0]
ESAC;

IF (ZMASK[0] = 1) THEN DEST[31:0] := 00000000H
    ELSE DEST[31:0] := TMP2[31:0]

IF (ZMASK[1] = 1) THEN DEST[63:32] := 00000000H
    ELSE DEST[63:32] := TMP2[63:32]

IF (ZMASK[2] = 1) THEN DEST[95:64] := 00000000H
    ELSE DEST[95:64] := TMP2[95:64]

IF (ZMASK[3] = 1) THEN DEST[127:96] := 00000000H
    ELSE DEST[127:96] := TMP2[127:96]

DEST[MAXVL-1:128] := 0

INSERTPS (128-bit Legacy SSE Version)
IF (SRC = REG) THEN COUNT_S :=imm8[7:6]

    ELSE COUNT_S :=0
COUNT_D := imm8[5:4]
ZMASK := imm8[3:0]
CASE (COUNT_S) OF

    0: TMP := SRC[31:0]
    1: TMP := SRC[63:32]
    2: TMP := SRC[95:64]
    3: TMP := SRC[127:96]
ESAC;

CASE (COUNT_D) OF
    0: TMP2[31:0] := TMP
          TMP2[127:32] := DEST[127:32]
    1: TMP2[63:32] := TMP
          TMP2[31:0] := DEST[31:0]
          TMP2[127:64] := DEST[127:64]
    2: TMP2[95:64] := TMP


          TMP2[63:0] := DEST[63:0]
          TMP2[127:96] := DEST[127:96]
    3: TMP2[127:96] := TMP
          TMP2[95:0] := DEST[95:0]
ESAC;

IF (ZMASK[0] = 1) THEN DEST[31:0] := 00000000H
    ELSE DEST[31:0] := TMP2[31:0]

IF (ZMASK[1] = 1) THEN DEST[63:32] := 00000000H
    ELSE DEST[63:32] := TMP2[63:32]

IF (ZMASK[2] = 1) THEN DEST[95:64] := 00000000H
    ELSE DEST[95:64] := TMP2[95:64]

IF (ZMASK[3] = 1) THEN DEST[127:96] := 00000000H
    ELSE DEST[127:96] := TMP2[127:96]

DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VINSERTPS __m128 _mm_insert_ps(__m128 dst, __m128 src, const int nidx);
INSETRTPS __m128 _mm_insert_ps(__m128 dst, __m128 src, const int nidx);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-22,"第5类例外条件",另外还有:

```text
#UD               If VEX.L = 0.
```

EVEX-encoded discription,参见表2-59"Type E9NF类例外条件".
