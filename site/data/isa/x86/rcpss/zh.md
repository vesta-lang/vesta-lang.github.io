---
summary: 计算 标量 单精度浮点 值
---

## 说明

计算源操作数(第二个操作数)中低单精度浮点值的近似对等值,并存储单精度浮点结果为目标操作数. 源操作数可以是XMM寄存器,也可以是32位的内存位置. 目标操作数是一个XMM登记册. 目标操作数 保持不变的三个高序双词. 见Intel(R)64和IA-32 Architecture Software开发者手册第一卷中的图10-6,关于标量单精度浮点操作的插图.

此近似值的相对错误是:

```text
    |Relative Error|  1.5  2-12
```

RCPSS指令不受MXCSR寄存器中四舍五入控制位的影响. 当源值为0.0时,返回源值的符号。 一个异常源值作为0.0(同一标志)处理. 小结果(见第4.9.1.5节,Intel(R)64和IA-32 Architecture Software开发者手册第1卷中的"Nummeric Underflow Exception (#U)")总是被冲到0.0,并带有操作数的标志. (输入值大于或等于QQ1.1111110100000B2125|,保证不产生微小结果;输入值小于或等于QQ100000000110000001B*2126|,保证产生微小结果,然后冲到0.0;在这个范围内之间的输入值可能或不会产生微小结果,取决于执行. )当一个源值是SNaN或QNaN时,SNaN转换为QNaN或源QNaN返回.

在64位模式中,使用REX前缀的形式为REX.R,允许此指令访问额外的注册(XMM8-XMM15).

128位遗产 SSE 版本 : 第一源操作数和目标操作数是相同的. 相应的YMM目的地注册保持不变的位数(MAXVL-1:32).

VEX.128 编码版本 : 目的地YMM的位数(MAXVL-1:128)登记被清零.

## 行动

```text
RCPSS (128-bit Legacy SSE Version)
DEST[31:0] := APPROXIMATE(1/SRC[31:0])
DEST[MAXVL-1:32] (Unmodified)


VRCPSS (VEX.128 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SRC2[31:0])
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
RCPSS __m128 _mm_rcp_ss(__m128 a);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-22"第5类例外条件".
