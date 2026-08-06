---
summary: 位字段提取
---

## 说明

从第一源操作数(第二个操作数)中提取毗连比特,使用第二源操作数(第三个操作数)中指定的指数值和长度值. 第二源操作数的比特7:0指定了比特提取的起始比特位置. 一个超过操作数大小的START值将不会从第二源操作数中提取任何位点. 第二源操作数的比特15:8指定了从START位置开始提取的最大比特数(LENGTH). 只提取 第一源操作数 上( OperandSize - 1)的位位置 。 提取的位点被写入目的地寄存器,从最小位开始. 目标操作数中所有更高的顺序位(开始于位位置 LENGTH) 被清零. 如果没有提取到位数,则清除目的地登记册。

此指令不支持真实模式和 虚拟 8086 模式 。 操作数大小如果不是64位模式,总是32位. 在64位模式操作数大小 64中需要VEX.W1. VEX.W1在非64位模式中被忽略. 试图用不等于0的 VEX.L 执行此指令将导致 #UD.

## 行动

```text
START := SRC2[7:0];
LEN := SRC2[15:8];
TEMP := ZERO_EXTEND_TO_512 (SRC1 );
DEST := ZERO_EXTEND(TEMP[START+LEN -1: START]);
ZF := (DEST = 0);
```

## 受影响的旗帜

ZF根据结果更新. AF,SF,和PF没有定义. 所有其他旗帜都被清除.

## Intel C/C++ 内在编译器

```c
BEXTR unsigned __int32 _bextr_u32(unsigned __int32 src, unsigned __int32 start. unsigned __int32 len);
BEXTR unsigned __int64 _bextr_u64(unsigned __int64 src, unsigned __int32 start. unsigned __int32 len);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-29,"第13类例外条件",另外:

```text
#UD                       If VEX.W = 1.
```
