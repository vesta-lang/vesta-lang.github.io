---
summary: 打包单精度浮点值 转换为包装
---

## 说明

将源操作数(第二个操作数)中的两个打包单精度浮点值转换为目标操作数(第一个操作数)中的两个已包装的签名双字整数. 源操作数可以是XMM的寄存器,也可以是64位的内存位置. 目标操作数是一个MMX技术登记册. 当源操作数是一个XMM的寄存器时,两个单精度浮点的值包含在寄存器的低四字中.

当转换不准确时,将返回切换结果(圆向零)。 如果转换结果大于最大签名的双字整数,则提高浮点无效例外,如果掩盖了这一例外,则返回无限期整数值80000000H.

本指令导致从x87 FPU到MMX技术操作的过渡(即将x87 FPU顶端-of-栈指针设置为0,将x87 FPU标记词设置为所有 0s [有效]). 如果执行此指令时有一个 x87 FPU 浮点 例外待决,则在 CVTTPS2PI 指令执行前处理该例外.

在64位模式中,使用REX.R前缀允许此指令访问额外的注册(XMM8-XMM15).

## 行动

```text
DEST[31:0] := Convert_Single_Precision_Floating_Point_To_Integer_Truncate(SRC[31:0]);
DEST[63:32] := Convert_Single_Precision_Floating_Point_To_Integer_Truncate(SRC[63:32]);
```

## Intel C/C++ 内在编译器

```c
CVTTPS2PI __m64 _mm_cvttps_pi32(__m128 a);
```

## SIMD 浮点 例外

Invalid, Precision.

## 其他例外

见Intel(R)64和IA-32架构软件开发者手册第3B卷第25.25.3节"SIMD在MMX注册上操作的遗产指令的例外条件".
