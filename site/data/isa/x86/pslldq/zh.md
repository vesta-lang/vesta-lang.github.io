---
summary: 左移双四字逻辑
---

## 说明

将 目标操作数(第一个操作数)向左移动,以计数 操作数(第二个操作数)中指定的字节数表示. 空的低序字节被清除(设置为所有 0s). 如果计数 操作数 指定的值大于 15,则 目标操作数 设定为全部 0s 。 计数操作数为8位即时.

128位遗产 SSE 版本 : 来源与目标操作数相同. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 来源和目标操作数是XMM登记册. 目的地YMM的位数(MAXVL-1:128)登记被清零.

VEX.256 编码版本 : 源操作数为YMM注册. 目标操作数是一个YMM登记册. 对应的ZMM注册被清零的位数(MAXVL-1:256). 计数操作数既适用于低车道,也适用于高128位车道.

EVEX 编码版本 : 源操作数是一个ZMM/YMM/XMM的登记册或512/256/128位内存位置. 目标操作数是一个ZMM/YMM/XMM登记册. 操作数的计数适用于每128位车道.

## 行动

```text
VPSLLDQ (EVEX.U1.512 Encoded Version)
TEMP := COUNT
IF (TEMP > 15) THEN TEMP := 16; FI
DEST[127:0] := SRC[127:0] << (TEMP * 8)
DEST[255:128] := SRC[255:128] << (TEMP * 8)
DEST[383:256] := SRC[383:256] << (TEMP * 8)
DEST[511:384] := SRC[511:384] << (TEMP * 8)
DEST[MAXVL-1:512] := 0

VPSLLDQ (VEX.256 and EVEX.256 Encoded Version)
TEMP := COUNT
IF (TEMP > 15) THEN TEMP := 16; FI
DEST[127:0] := SRC[127:0] << (TEMP * 8)
DEST[255:128] := SRC[255:128] << (TEMP * 8)
DEST[MAXVL-1:256] := 0

VPSLLDQ (VEX.128 and EVEX.128 Encoded Version)
TEMP := COUNT
IF (TEMP > 15) THEN TEMP := 16; FI
DEST := SRC << (TEMP * 8)
DEST[MAXVL-1:128] := 0

PSLLDQ(128-bit Legacy SSE Version)
TEMP := COUNT
IF (TEMP > 15) THEN TEMP := 16; FI
DEST := DEST << (TEMP * 8)
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
(V)PSLLDQ __m128i _mm_slli_si128 ( __m128i a, int imm) VPSLLDQ __m256i _mm256_slli_si256 ( __m256i a, const int imm) VPSLLDQ __m512i _mm512_bslli_epi128 ( __m512i a, const int imm);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

非EVEX-encoded指令,参见表2-24"Type 7类例外条件". EVEX-encoded指令,参见表2-52"Type E4NF类例外条件"中的例外类型E4NF.nb.
