---
summary: 右移双四字
---

## 说明

将 目标操作数 (第一个 操作数) 移到右侧, 以计数 操作数 (第二个 操作数) 中指定的字节数表示. 空高序字节被清除(设置为所有 0s). 如果计数 操作数 指定的值大于 15,则 目标操作数 设定为全部 0s 。 计数操作数为8位即时.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

128位遗产 SSE 版本 : 来源与目标操作数相同. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 来源和目标操作数是XMM登记册. 目的地YMM的位数(MAXVL-1:128)登记被清零.

VEX.256 编码版本 : 源操作数是一个YMM登记册. 目标操作数是一个YMM登记册. 对应的ZMM注册被清零的位数(MAXVL-1:256). 计数操作数既适用于低车道,也适用于高128位车道.

EVEX 编码版本 : 源操作数是一个ZMM/YMM/XMM的登记册或512/256/128位内存位置. 目标操作数是一个ZMM/YMM/XMM登记册. 操作数的计数适用于每128位车道.

说明: VEX.vvvv/EVEX.vvvv编码目的地注册.

## 行动

```text
VPSRLDQ (EVEX.512 Encoded Version)
TEMP := COUNT
IF (TEMP > 15) THEN TEMP := 16; FI
DEST[127:0] := SRC[127:0] >> (TEMP * 8)
DEST[255:128] := SRC[255:128] >> (TEMP * 8)
DEST[383:256] := SRC[383:256] >> (TEMP * 8)
DEST[511:384] := SRC[511:384] >> (TEMP * 8)
DEST[MAXVL-1:512] := 0;

VPSRLDQ (VEX.256 and EVEX.256 Encoded Version)
TEMP := COUNT
IF (TEMP > 15) THEN TEMP := 16; FI
DEST[127:0] := SRC[127:0] >> (TEMP * 8)
DEST[255:128] := SRC[255:128] >> (TEMP * 8)
DEST[MAXVL-1:256] := 0;

VPSRLDQ (VEX.128 and EVEX.128 Encoded Version)
TEMP := COUNT
IF (TEMP > 15) THEN TEMP := 16; FI
DEST := SRC >> (TEMP * 8)
DEST[MAXVL-1:128] := 0;

PSRLDQ (128-bit Legacy SSE Version)
TEMP := COUNT
IF (TEMP > 15) THEN TEMP := 16; FI
DEST := DEST >> (TEMP * 8)
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
(V)PSRLDQ __m128i _mm_srli_si128 ( __m128i a, int imm) VPSRLDQ __m256i _mm256_bsrli_epi128 ( __m256i, const int) VPSRLDQ __m512i _mm512_bsrli_epi128 ( __m512i, int);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

非EVEX-encoded指令,参见表2-24"Type 7类例外条件". EVEX-encoded指令,参见表2-52"Type E4NF类例外条件"中的例外类型E4NF.nb.
