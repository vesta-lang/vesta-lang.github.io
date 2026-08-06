---
summary: 执行 AES InvMix 转换
---

## 说明

在 源操作数 上执行 InvMix Columns 转换,并将结果存储在 目标操作数 中. 目标操作数是一个XMM登记册. 源操作数可以是XMM的寄存器,也可以是128位的内存位置.

注: AESIMC指令应适用于扩展后的AES圆形密钥(第一回合和最后一回合密钥除外),以便用"等效反向密码"(定义于FIPS 197)来准备解密.

128位遗产 SSE 版本 : 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 目的地YMM的位数(MAXVL-1:128)登记被清零.

说明: 在VEX-encoded版本中,VEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
AESIMC
DEST[127:0] := InvMixColumns( SRC );
DEST[MAXVL-1:128] (Unmodified)

VAESIMC
DEST[127:0] := InvMixColumns( SRC );
DEST[MAXVL-1:128] := 0;
```

## Intel C/C++ 内在编译器

```c
(V)AESIMC __m128i _mm_aesimc (__m128i);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",另外:

```text
#UD               If VEX.vvvv  1111B.
```
