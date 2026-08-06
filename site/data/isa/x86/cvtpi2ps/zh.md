---
summary: 将包装的字组转换为 打包单精度浮点值
---

## 说明

将源操作数(第二个操作数)中两个已装入的签名双字整数转换为目标操作数(第一个操作数)中的两个打包单精度浮点值.

源操作数可以是MMX技术寄存器或64位内存位置. 目标操作数是一个XMM登记册. 结果存储在目标操作数的低四字中,高四字不变. 当转换不准确时,返回的值按照MXCSR寄存器中的四舍五入控制位数进行四舍五入.

本指令导致从x87 FPU到MMX技术操作的过渡(即将x87 FPU顶端-of-栈指针设置为0,将x87 FPU标记词设置为所有 0s [有效]). 如果执行此指令时有一个 x87 FPU 浮点 例外待决,则在 CVTPI2PS 指令执行前处理该例外.

在64位模式中,使用REX.R前缀允许此指令访问额外的注册(XMM8-XMM15).

## 行动

```text
DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[31:0]);
DEST[63:32] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[63:32]);
(* High quadword of destination unchanged *)
```

## Intel C/C++ 内在编译器

```c
CVTPI2PS __m128 _mm_cvtpi32_ps(__m128 a, __m64 b);
```

## SIMD 浮点 例外

Precision.

## 其他例外

见Intel(R)64和IA-32架构软件开发者手册第3B卷第25.25.3节"SIMD在MMX注册上操作的遗产指令的例外条件".
