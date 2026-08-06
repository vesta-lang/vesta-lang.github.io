---
summary: 计算包装 单精度浮点 的平方根
---

## 说明

执行 SIMD 计算 源操作数(第二个 操作数)中四个 打包单精度浮点值 的平方根的大约对等值,并将所包装的 单精度浮点 结果存储在 目标操作数 中. 源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目标操作数是一个XMM登记册. 参见Intel(R)64和IA-32 Architectures Software开发者手册第1卷图10-5中的SIMD 单精度浮点操作的插图.

此近似值的相对错误是:

```text
    |Relative Error|  1.5  2-12
```

RSQRTPS指令不受MXCSR寄存器中四舍五入控制位的影响. 当源值为0.0时,返回源值的符号。 一个异常源值作为0.0(同一标志)处理. 当一个源值为负值(除 -0.0)时,返回 浮点 的无限期值。 当一个源值是SNaN或QNaN时,将SNaN转换成QNaN或返回源QNaN.

在64位模式中,使用REX前缀的形式为REX.R,允许此指令访问额外的注册(XMM8-XMM15).

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(YMM注册点)没有修改.

VEX.128编码版本:第一源操作数是一个XMM的寄存器或128位内存位置. 目标操作数是一个XMM登记册. 对应的YMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册.

说明: 在VEX-encoded版本中,VEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
RSQRTPS (128-bit Legacy SSE Version)
DEST[31:0] := APPROXIMATE(1/SQRT(SRC[31:0]))
DEST[63:32] := APPROXIMATE(1/SQRT(SRC1[63:32]))
DEST[95:64] := APPROXIMATE(1/SQRT(SRC1[95:64]))
DEST[127:96] := APPROXIMATE(1/SQRT(SRC2[127:96]))
DEST[MAXVL-1:128] (Unmodified)

VRSQRTPS (VEX.128 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SQRT(SRC[31:0]))
DEST[63:32] := APPROXIMATE(1/SQRT(SRC1[63:32]))
DEST[95:64] := APPROXIMATE(1/SQRT(SRC1[95:64]))
DEST[127:96] := APPROXIMATE(1/SQRT(SRC2[127:96]))
DEST[MAXVL-1:128] := 0

VRSQRTPS (VEX.256 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SQRT(SRC[31:0]))
DEST[63:32] := APPROXIMATE(1/SQRT(SRC1[63:32]))
DEST[95:64] := APPROXIMATE(1/SQRT(SRC1[95:64]))
DEST[127:96] := APPROXIMATE(1/SQRT(SRC2[127:96]))
DEST[159:128] := APPROXIMATE(1/SQRT(SRC2[159:128]))
DEST[191:160] := APPROXIMATE(1/SQRT(SRC2[191:160]))
DEST[223:192] := APPROXIMATE(1/SQRT(SRC2[223:192]))
DEST[255:224] := APPROXIMATE(1/SQRT(SRC2[255:224]))
```

## Intel C/C++ 内在编译器

```c
RSQRTPS __m128 _mm_rsqrt_ps(__m128 a) RSQRTPS __m256 _mm256_rsqrt_ps (__m256 a);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",另外:

```text
#UD               If VEX.vvvv  1111B.
```
