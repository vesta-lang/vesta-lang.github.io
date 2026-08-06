---
summary: 打包双精度浮点值 转换为包装
---

## 说明

将源操作数(第二个操作数)中的两个打包双精度浮点值转换为目标操作数(第一个操作数)中的两个已包装的签名双字整数. 源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目标操作数是一个MMX技术登记册.

当转换不准确时,将返回切换结果(圆向零)。 如果转换结果大于最大签名的双字整数,则提高浮点无效例外,如果掩盖了这一例外,则返回无限期整数值80000000H.

本指令导致从x87 FPU到MMX技术操作的过渡(即将x87 FPU顶端-of-栈指针设置为0,将x87 FPU标记词设置为所有 0s [有效]). 如果执行此指令时有一个 x87 FPU 浮点 例外待决,则在 CVTTPD2PI 指令执行前处理该例外.

在64位模式中,使用REX.R前缀允许此指令访问额外的注册(XMM8-XMM15).

## 行动

```text
DEST[31:0] := Convert_Double_Precision_Floating_Point_To_Integer32_Truncate(SRC[63:0]);
DEST[63:32] := Convert_Double_Precision_Floating_Point_To_Integer32_Truncate(SRC[127:64]);
```

## Intel C/C++ 内在编译器

```c
CVTTPD1PI __m64 _mm_cvttpd_pi32(__m128d a);
```

## SIMD 浮点 例外

Invalid, Precision.

其他模式例外见第25.25.3节,"遗产的例外条件"SIMD运行于MMXIntel(R)64和IA-32 Architectures软件开发者手册第3B卷中的注册".
