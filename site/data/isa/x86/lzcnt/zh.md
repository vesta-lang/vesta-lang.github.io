---
summary: 计算领先零位数
---

## 说明

LZCNT计算一个源操作数(第二个操作数)中领先最显著的零位数,并在目的地返回结果(第一个操作数). LZCNT是BSR指令的扩展. LZCNT和BSR指令的关键区别在于当源代码为0时,LZCNT会将运行大小输出给目的代码,而BSR则会离开目的代码代码代码未修改.

在不支持LZCNT的处理器上,指令字节编码以BSR执行.

## 行动

```text
temp := OperandSize - 1
DEST := 0
WHILE (temp >= 0) AND (Bit(SRC, temp) = 0)
DO

    temp := temp - 1
    DEST := DEST+ 1
OD

IF DEST = OperandSize
    CF := 1

ELSE
    CF := 0

FI

IF DEST = 0
    ZF := 1

ELSE
    ZF := 0

FI
```

## 受影响的旗帜

ZF旗在输出为零时设定为1(来源中最显著的位被设定),而到0时,如果输入为零,否则CF旗被设定为1. OF, SF, PF,和AF的旗帜没有定义.

## Intel C/C++ 内在编译器

```c
LZCNT unsigned __int32 _lzcnt_u32(unsigned __int32 src);
LZCNT unsigned __int64 _lzcnt_u64(unsigned __int64 src);
```
