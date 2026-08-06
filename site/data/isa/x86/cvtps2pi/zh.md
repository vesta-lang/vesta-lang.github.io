---
summary: 将 打包单精度浮点值 转换为包装的字组
---

## 说明

将源操作数(第二个操作数)中的两个打包单精度浮点值转换为目标操作数(第一个操作数)中的两个已包装的签名双字整数.

源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目标操作数是一个MMX技术登记册. 当源操作数是一个XMM的寄存器时,两个单精度浮点的值包含在寄存器的低四字中. 当转换不准确时,返回的值按照MXCSR寄存器中的四舍五入控制位数进行四舍五入. 如果转换结果大于最大签名的双字整数,则提高浮点无效例外,如果掩盖了这一例外,则返回无限期整数值80000000H.

CVTPS2PI导致从x87 FPU到MMX技术操作的过渡(即x87 FPU顶端-栈指针设置为0,x87 FPU标记词设置为所有 0s [valid]). 如果在等待一个 x87 FPU 浮点例外时执行此指令,则在 CVTPS2PI 指令执行之前处理该例外.

在64位模式中,使用REX.R前缀允许此指令访问额外的注册(XMM8-XMM15).

## 行动

```text
DEST[31:0] := Convert_Single_Precision_Floating_Point_To_Integer(SRC[31:0]);
DEST[63:32] := Convert_Single_Precision_Floating_Point_To_Integer(SRC[63:32]);
```

## Intel C/C++ 内在编译器

```c
CVTPS2PI __m64 _mm_cvtps_pi32(__m128 a);
```

## SIMD 浮点 例外

Invalid, Precision.

## 其他例外

见Intel(R)64和IA-32架构软件开发者手册第3B卷第25.25.3节"SIMD在MMX注册上操作的遗产指令的例外条件".
