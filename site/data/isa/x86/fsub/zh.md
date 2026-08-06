---
summary: 减法
---

## 说明

从 目标操作数 中减去 源操作数 ,并将差异存储在目的地位置. 目标操作数总是一个FPU的数据登记册;源操作数可以是寄存器或内存位置. 内存中的源操作数可以是单精度或双精度浮点格式,也可以是单词或双词整数格式.

无操作数版本的指令从ST(1)注册中减去ST(0)注册的内容,并将结果存储为ST(1). One-操作数版本从ST(0)寄存器的内容中减去一个内存位置(浮点或整数)的内容,并将结果存储为ST(0). 双操作数版本,从ST(i)注册中减去ST(0)注册的内容,反之亦然.

FSUBP指令执行在减法后将FPU寄存器堆栈弹出的额外操作. 要弹出寄存器堆栈,处理器将ST(0)寄存器标记为空,并将 栈指针 (TOP) 递增为 1 。 无操作数版本的浮点减码指令总是导致寄存器堆栈被弹出. 在一些组装器中,这个指令的元音是FSUB,而不是FSUBP.

FISUB指令将整数源操作数转换成双倍扩展精度浮点格式后再执行减值.

表3-40显示在假定不出现溢出或下流的情况下,将各种数字相互减去的结果。 在此,SRC值从DEST值(DEST - SRC =结果)中减去.

当两个类似标志的操作数的差值为0时,结果为+0,但向-模式方向的回合除外,在这种情况下,结果为-0. 本指令还保证+0 - (-0) = +0,且 -0 - (+0) = -0. 源操作数为整数0时,作为+0处理.

当一个操作数是 ,结果就是预期的标志. 如果两个操作数都是同一个符号,则生成无效操作例外.

** FSUB/FSUBP/FISUB 结果**

| - | * | - | - | - | - | - | 纳恩 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| -F     + | +/-F or +/-0 |  | DEST | DE | ST  -F | - | 纳恩 |
| -0     + | -SRC |  | +/-0 | -0 | - SRC | - | 纳恩 |
| +0     + | -SRC |  | +0 | +/-0 | - SRC | - | 纳恩 |
| +F     + |  | +F | DEST | DEST | +/-F or +/-0 | - | 纳恩 |
| +      + |  | + | + | + | + | * | 纳恩 |
| 纳恩纳恩 | 纳恩 |  | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 |

## 行动

```text
IF Instruction = FISUB
    THEN

        DEST := DEST - ConvertToDoubleExtendedPrecisionFP(SRC);

    ELSE (* Source operand is floating-point value *)

        DEST := DEST - SRC;

FI;

IF Instruction = FSUBP
    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Set if result was rounded up; cleared otherwise.

C0, C2, C3          Undefined.
```

## 浮点 例外

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 Operand is an SNaN value or unsupported format.
```

操作数是无限的类似标志。

```text
#D                  Source operand is a denormal value.
```

```text
#U                  Result is too small for destination format.
```

```text
#O                  Result is too large for destination format.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
