---
summary: 未签名的整数添加 2 操作数 与 进位标志
---

## 说明

执行目标操作数(第一操作数),源操作数(第二操作数)和承载旗(CF)的无符号添加,并将结果存储在目标操作数中. 目标操作数是一个通用寄存器,而源操作数可以是通用寄存器或内存位置. CF状态可以代表以前加法的载荷. 指令将CF旗与未签名的操作数加载产生的载荷设置在一起.

ADCX指令是在多精度添加的背景下执行的,我们在这里添加了一系列带有载链的操作数. 在一连串添加的开始,我们需要确保CF处于理想的初始状态. 通常,这种初始状态需要0,通过指令到零CF(如XOR)即可实现.

此指令以真实模式和 虚拟 8086 模式 支持 。 操作数大小如果不是64位模式,总是32位.

在64位模式下,默认操作大小为32位. 使用REX的前缀形式为REX.R,允许访问额外的登记册(R8-15). 使用REX 前缀的形式为REX.W,促进运行到64位.

ADCX通常在一个交易区域内外执行. 说明: ADCX对OF旗的定义不同于Intel(R)64和IA-32架构软件开发者手册Volume 2A中定义的ADD/ADC指令.

## 行动

```text
IF OperandSize is 64-bit

    THEN CF:DEST[63:0] := DEST[63:0] + SRC[63:0] + CF;
    ELSE CF:DEST[31:0] := DEST[31:0] + SRC[31:0] + CF;
FI;
```

## 受影响的旗帜

CF根据结果更新. OF, SF, ZF, AF,和PF 旗帜没有修改.

## Intel C/C++ 内在编译器

```c
unsigned char _addcarryx_u32 (unsigned char c_in, unsigned int src1, unsigned int src2, unsigned int *sum_out);
unsigned char _addcarryx_u64 (unsigned char c_in, unsigned __int64 src1, unsigned __int64 src2, unsigned __int64 *sum_out);
```

## SIMD 浮点 例外

None.
