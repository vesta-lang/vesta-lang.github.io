---
summary: 最小水平字包
---

## 说明

确定源操作数(第二操作数)中最小的未签名字值,并将未签名字放在目标操作数(第一操作数)的低词(bits 0-15)中. 最小值的单词索引以目标操作数的位数16-18存储. 目的地剩下的上位被设定为0.

128位遗产 SSE 版本 : 相应的XMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 目的地XMM的位数(MAXVL-1:128)登记被清零. VEX.vvvv是保留的,必须是1111b,VEX.L必须是0,否则指令会是#UD.

## 行动

```text
PHMINPOSUW (128-bit Legacy SSE Version)
INDEX := 0;
MIN := SRC[15:0]
IF (SRC[31:16] < MIN)

    THEN INDEX := 1; MIN := SRC[31:16]; FI;
IF (SRC[47:32] < MIN)

    THEN INDEX := 2; MIN := SRC[47:32]; FI;
* Repeat operation for words 3 through 6
IF (SRC[127:112] < MIN)

    THEN INDEX := 7; MIN := SRC[127:112]; FI;
DEST[15:0] := MIN;
DEST[18:16] := INDEX;
DEST[127:19] := 0000000000000000000000000000H;

VPHMINPOSUW (VEX.128 Encoded Version)
INDEX := 0
MIN := SRC[15:0]
IF (SRC[31:16] < MIN) THEN INDEX := 1; MIN := SRC[31:16]
IF (SRC[47:32] < MIN) THEN INDEX := 2; MIN := SRC[47:32]
* Repeat operation for words 3 through 6
IF (SRC[127:112] < MIN) THEN INDEX := 7; MIN := SRC[127:112]
DEST[15:0] := MIN
DEST[18:16] := INDEX
DEST[127:19] := 0000000000000000000000000000H
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
PHMINPOSUW __m128i _mm_minpos_epu16( __m128i packed_words);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",另外:

```text
#UD               If VEX.L = 1.
```

```text
                  If VEX.vvvv  1111B.
```
