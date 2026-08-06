---
summary: 计算 标量 单精度浮点 的平方根的对称值
---

## 说明

计算 源操作数(第二个操作数)中低单精度浮点值的平方根的大约对等值,存储 单精度浮点 的结果为 目标操作数. 源操作数可以是XMM寄存器,也可以是32位的内存位置. 目标操作数是一个XMM登记册. 目标操作数 保持不变的三个高序双词. 见Intel(R)64和IA-32 Architecture Software开发者手册第一卷中的图10-6,关于标量单精度浮点操作的插图.

此近似值的相对错误是:

```text
    |Relative Error|  1.5  2-12
```

RSQRTSS指令不受MXCSR寄存器中四舍五入控制位的影响. 当源值为0.0时,返回源值的符号。 一个异常源值作为0.0(同一标志)处理. 当一个源值为负值(除 -0.0)时,返回 浮点 的无限期值。 当一个源值是SNaN或QNaN时,将SNaN转换成QNaN或返回源QNaN.

在64位模式中,使用REX前缀的形式为REX.R,允许此指令访问额外的注册(XMM8-XMM15).

128位遗产 SSE 版本 : 第一源操作数和目标操作数是相同的. 相应的YMM目的地注册保持不变的位数(MAXVL-1:32).

VEX.128 编码版本 : 目的地YMM的位数(MAXVL-1:128)登记被清零.

## 行动

```text
RSQRTSS (128-bit Legacy SSE Version)
DEST[31:0] := APPROXIMATE(1/SQRT(SRC2[31:0]))
DEST[MAXVL-1:32] (Unmodified)

VRSQRTSS (VEX.128 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SQRT(SRC2[31:0]))
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
RSQRTSS __m128 _mm_rsqrt_ss(__m128 a);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-22"第5类例外条件".
