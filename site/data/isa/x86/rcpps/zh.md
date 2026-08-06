---
summary: 计算 打包单精度浮点值 的对称
---

## 说明

执行 SIMD 计算 源操作数(第二个 操作数)中四个 打包单精度浮点值 的近似对等值,将包装的 单精度浮点 结果存储在 目标操作数 中. 源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目标操作数是一个XMM登记册. 参见Intel(R)64和IA-32 Architectures Software开发者手册第1卷图10-5中的SIMD 单精度浮点操作的插图.

此近似值的相对错误是:

```text
    |Relative Error|  1.5  2-12
```

RCPPS指令不受MXCSR寄存器中四舍五入控制位的影响. 当源值为0.0时,返回源值的符号。 一个异常源值作为0.0(同一标志)处理. 小结果(见第4.9.1.5节,Intel(R)64和IA-32 Architecture Software开发者手册第1卷中的"Nummeric Underflow Exception (#U)")总是被冲到0.0,并带有操作数的标志. (输入值大于或等于QQ1.1111110100000B2125|,保证不产生微小结果;输入值小于或等于QQ100000000110000001B*2126|,保证产生微小结果,然后冲到0.0;在这个范围内之间的输入值可能或不会产生微小结果,取决于执行. )当一个源值是SNaN或QNaN时,SNaN转换为QNaN或源QNaN返回.

在64位模式中,使用REX前缀的形式为REX.R,允许此指令访问额外的注册(XMM8-XMM15).

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(YMM注册点)没有修改.

VEX.128编码版本:第一源操作数是一个XMM的寄存器或128位内存位置. 目标操作数是一个XMM登记册. 对应的YMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册.

说明: 在VEX-encoded版本中,VEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
RCPPS (128-bit Legacy SSE Version)
DEST[31:0] := APPROXIMATE(1/SRC[31:0])
DEST[63:32] := APPROXIMATE(1/SRC[63:32])
DEST[95:64] := APPROXIMATE(1/SRC[95:64])
DEST[127:96] := APPROXIMATE(1/SRC[127:96])
DEST[MAXVL-1:128] (Unmodified)

VRCPPS (VEX.128 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SRC[31:0])
DEST[63:32] := APPROXIMATE(1/SRC[63:32])
DEST[95:64] := APPROXIMATE(1/SRC[95:64])
DEST[127:96] := APPROXIMATE(1/SRC[127:96])
DEST[MAXVL-1:128] := 0

VRCPPS (VEX.256 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SRC[31:0])
DEST[63:32] := APPROXIMATE(1/SRC[63:32])
DEST[95:64] := APPROXIMATE(1/SRC[95:64])
DEST[127:96] := APPROXIMATE(1/SRC[127:96])
DEST[159:128] := APPROXIMATE(1/SRC[159:128])
DEST[191:160] := APPROXIMATE(1/SRC[191:160])
DEST[223:192] := APPROXIMATE(1/SRC[223:192])
DEST[255:224] := APPROXIMATE(1/SRC[255:224])
```

## Intel C/C++ 内在编译器

```c
RCCPS __m128 _mm_rcp_ps(__m128 a) RCPPS __m256 _mm256_rcp_ps (__m256 a);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",另外:

```text
#UD               If VEX.vvvv  1111B.
```
