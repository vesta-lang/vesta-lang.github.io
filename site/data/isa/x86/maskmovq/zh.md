---
summary: 存储选中的四字节
---

## 说明

从 源操作数(第一个操作数)中选择的字节为64位的内存位置. 口罩 操作数(第二个操作数)选择源操作数中哪些字节被写入内存. 来源和面具操作数是MMX技术登记册. 内存位置在 DI/EDI/RDI 寄存器中的有效地址指定的内存位置(默认的片段寄存器是DS,但这可能会被一个片段覆盖前缀所覆盖). 内存位置不需要在自然边界上对齐. (商店地址的大小取决于地址大小属性.

面具操作数中每个字节中最显著的位点决定源操作数中对应的字节是否写到内存中对应的字节位置:0表示不写,1表示写.

MASKMOVQ指令生成非时序提示给处理器,以尽量减少缓存污染. 非时空提示通过使用结合(WC)内存类型协议的写法实现(参见"Caching of Temperal vs. 非时空数据"载于Intel(R)64和IA-32架构软件开发者手册第10章第1卷. 由于WC协议使用一种命令不严的内存一致性模型,如果多个处理器可能使用不同的内存类型来读写/写入目的地内存位置,那么与SFENCE或MFENCE指令一起执行的栅栏操作应当与MASKMOVQ指令一起使用.

本指令导致从x87 FPU到MMX技术状态的过渡(即x87 FPU顶端-of-栈指针设置为0,x87 FPU标记词设置为所有 0s [有效]).

MASKMOVQ指令带有所有0s的面具的行为如下:

* 将不写入数据为内存 。 * 从x87 FPU到MMX技术状态的过渡将会发生. * 与处理内存和页面断层有关的例外可能仍然会发出信号(执行)

dependent).

* 断点信号(代码或数据)不保证(取决于执行). * 如果目标内存区域被映射为 UC 或 WP,则执行这些关联语义

内存类型得不到保证(即保留),而且具体针对执行。

MASKMOVQ指令可用于改进需要按字节合并数据的算法的性能. 它不应导致对所有权的读取;这样做会产生不必要的带宽,因为数据要直接使用字节-mask编写,而不在存储前分配旧数据.

在64位模式中,内存地址由DS:RDI指定.

## 行动

```text
IF (MASK[7] = 1)

    THEN DEST[DI/EDI] := SRC[7:0] ELSE (* Memory location unchanged *); FI;

IF (MASK[15] = 1)

    THEN DEST[DI/EDI +1] := SRC[15:8] ELSE (* Memory location unchanged *); FI;
    (* Repeat operation for 3rd through 6th bytes in source operand *)

IF (MASK[63] = 1)

    THEN DEST[DI/EDI +15] := SRC[63:56] ELSE (* Memory location unchanged *); FI;
```

## Intel C/C++ 内在编译器

```c
void _mm_maskmove_si64(__m64d, __m64n, char * p);
```

## 其他例外

参见表25-8,"没有FP例外的遗产SIMD/MMX指令的例外条件",载于Intel(R)64和IA-32架构软件开发者手册第3B卷.
