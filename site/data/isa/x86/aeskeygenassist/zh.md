---
summary: AES 回合 密钥 生成辅助
---

## 说明

协助扩展AES密码密钥,通过计算生成一个圆形的密钥进行加密的步骤,使用源操作数指定的128位数据和一个8位的圆形常数作为即时指定,将结果存储在目标操作数中.

目标操作数是一个XMM登记册. 源操作数可以是XMM的寄存器,也可以是128位的内存位置.

128位遗产 SSE 版本 : 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 目的地YMM的位数(MAXVL-1:128)登记被清零.

说明: 在VEX-encoded版本中,VEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
AESKEYGENASSIST
X3[31:0] := SRC [127: 96];
X2[31:0] := SRC [95: 64];
X1[31:0] := SRC [63: 32];
X0[31:0] := SRC [31: 0];
RCON[31:0] := ZeroExtend(imm8[7:0]);
DEST[31:0] := SubWord(X1);
DEST[63:32 ] := RotWord( SubWord(X1) ) XOR RCON;
DEST[95:64] := SubWord(X3);
DEST[127:96] := RotWord( SubWord(X3) ) XOR RCON;
DEST[MAXVL-1:128] (Unmodified)


VAESKEYGENASSIST
X3[31:0] := SRC [127: 96];
X2[31:0] := SRC [95: 64];
X1[31:0] := SRC [63: 32];
X0[31:0] := SRC [31: 0];
RCON[31:0] := ZeroExtend(imm8[7:0]);
DEST[31:0] := SubWord(X1);
DEST[63:32 ] := RotWord( SubWord(X1) ) XOR RCON;
DEST[95:64] := SubWord(X3);
DEST[127:96] := RotWord( SubWord(X3) ) XOR RCON;
DEST[MAXVL-1:128] := 0;
```

## Intel C/C++ 内在编译器

```c
(V)AESKEYGENASSIST __m128i _mm_aeskeygenassist (__m128i, const int);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",另外:

```text
#UD               If VEX.vvvv  1111B.
```
