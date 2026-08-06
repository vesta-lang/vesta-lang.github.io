---
summary: 计算拖动零位数
---

## 说明

TZCNT计算了源操作数(第二个操作数)中最不显著的零位数,并返回目标操作数(第一个操作数)中的结果. TZCNT是BSF指令的扩展. TZCNT和BSF指令的关键区别在于当源代码为0时,TZCNT会将运行大小输出给目的代码,而BSF则会离开目的代码代码代码未修改.

在不支持TZCNT的处理器上,指令字节编码以BSF执行.

## 行动

```text
temp := 0
DEST := 0
DO WHILE ( (temp < OperandSize) and (SRC[ temp] = 0) )

    temp := temp +1
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

ZF在输出为零时设定为1(来源中最不重要的位被设定),而如果输入为零,否则CF为1。 OF, SF, PF,和AF的旗帜没有定义.

## Intel C/C++ 内在编译器

```c
TZCNT unsigned __int32 _tzcnt_u32(unsigned __int32 src);
TZCNT unsigned __int64 _tzcnt_u64(unsigned __int64 src);
```
