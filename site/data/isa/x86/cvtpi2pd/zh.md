---
summary: 将包装的字组转换为 打包双精度浮点值
---

## 说明

将源操作数(第二个操作数)中两个已装入的签名双字整数转换为目标操作数(第一个操作数)中的两个打包双精度浮点值.

源操作数可以是MMX技术寄存器或64位内存位置. 目标操作数是一个XMM登记册. 此外,根据操作数配置:

* 对于 操作数 xmm, mm: 指令导致从 x87 FPU 到 MMX 技术操作的过渡(即

,x87 FPU 顶端-栈指针 设置为 0,x87 FPU 标记词设置为全部 0s [有效]). 如果执行此指令时有一个 x87 FPU 浮点 例外待决,则在 CVTPI2PD 指令执行前处理该例外.

* 对于 操作数 xmm, m64: 指令不会导致向 MMX 技术的过渡, 并且不取

x87 FPU exceptions.

在64位模式中,使用REX.R前缀允许此指令访问额外的注册(XMM8-XMM15).

## 行动

```text
DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[31:0]);
DEST[127:64] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[63:32]);
```

## Intel C/C++ 内在编译器

```c
CVTPI2PD __m128d _mm_cvtpi32_pd(__m64 a);
```

## SIMD 浮点 例外

None.

## 其他例外

见Intel(R)64和IA-32架构软件开发者手册第3B卷第25.25.3节"SIMD在MMX注册上操作的遗产指令的例外条件".
