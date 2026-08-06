---
summary: 乘数
---

## 说明

乘以目的地和源操作数,并将产品存储在目的地位置. 目标操作数始终是一个FPU数据登记册;源操作数可以是FPU数据登记册或内存位置. 内存中的源操作数可以是单精度或双精度浮点格式,也可以是单词或双词整数格式.

指令的No-操作数版本将ST(1)注册的内容乘以ST(0)注册的内容,并在ST(1)注册中存储产品. One-操作数版本通过一个内存位置(或是一个浮点或一个整数)的内容将ST(0)注册的内容乘以,并将产品存储在ST(0)注册. 双操作数版本,将ST(0)注册的内容乘以ST(i)注册的内容,或者反之亦然,结果存储在第一个操作数(目标操作数)指定的注册中.

FMULP指令在存储产品后执行将FPU寄存器堆栈弹出的额外操作. 要弹出寄存器堆栈,处理器将ST(0)寄存器标记为空,并将 栈指针 (TOP) 递增为 1 。 无操作数版本的浮点乘法指令总是导致寄存器堆栈被弹出. 在一些组装器中,这个指令的元音是FMUL,而不是FMULP.

FIMUL指令在进行乘法前将整数源操作数转换成双倍扩展精度浮点格式.

结果的标志总是源标志的专属-OR,即使一个或数个乘以0或. 源操作数为整数0时,作为+0处理.

下表显示在假定不出现溢出或下流的情况下,将各种数字相乘的结果。

** FMUL/FMULP/FIMUL 结果**

| - | + | + | * | * | - | - | 纳恩 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| -F | + | +F | +0 | -0 | -F | - | 纳恩 |
| -I | + | +F | +0 | -0 | -F | - | 纳恩 |
| -0 | * | +0 | +0 | -0 | -0 | * | 纳恩 |
| +0 | * | -0 | -0 | +0 | +0 | * | 纳恩 |
| +I | - | -F | -0 | +0 | +F | + | 纳恩 |
| +F | - | -F | -0 | +0 | +F | + | 纳恩 |
| + | - | - | * | * | + | + | 纳恩 |
| 纳恩 | 纳恩纳恩 | 纳恩 |  | 纳恩 | 纳恩 | 纳恩 | 纳恩 |

## 行动

```text
IF Instruction = FIMUL

    THEN
          DEST := DEST  ConvertToDoubleExtendedPrecisionFP(SRC);

    ELSE (* Source operand is floating-point value *)
          DEST := DEST  SRC;

FI;

IF Instruction = FMULP

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

One operand is +/-0 and the other is +/-.

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
