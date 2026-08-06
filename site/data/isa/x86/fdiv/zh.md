---
summary: 除号
---

## 说明

将 目标操作数 除以 源操作数 并将结果存储在目的地位置. 目标操作数(dividend)总是在FPU的登记册中;源操作数(divisor)可以是注册或内存位置. 内存中的源操作数可以是单精度或双精度浮点格式,单词或双词整数格式.

无操作数版本的指令将ST(1)注册的内容除以ST(0)注册的内容. One-操作数版本将ST(0)寄存器的内容除以一个内存位置的内容(要么是一个浮点,要么是一个整数). 双操作数版本,将ST(0)注册的内容除以ST(i)注册的内容或反之.

FDIVP指令在存储结果后执行附加操作,将FPU寄存堆栈弹出. 要弹出寄存器堆栈,处理器将ST(0)寄存器标记为空,并将 栈指针 (TOP) 递增为 1 。 无操作数版本的浮点分割指令总是导致寄存器堆栈被弹出. 在一些组装器中,这个指令的元音是FDIV,而不是FDIVP.

FIDIV指令在进行分割前将整数源操作数转换成双倍扩展精度浮点格式. 源操作数为整数0时,作为+0处理.

如果生成一个未显示的除零例外(#Z),则不存储结果;如果该例外被掩盖,则将一个合适的符号存储在目标操作数中.

下表显示在划分各类数字时获得的结果,假设既不出现溢出,也不出现流量不足。

** FDIV/FDIVP/FIDIV 结果**

| - | * | +0 | +0 | -0 | -0 | * | 纳恩 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| -F | + | +F | +0 | -0 | -F | - | 纳恩 |
| -I | + | +F | +0 | -0 | -F | - | 纳恩 |
| -0 | + | ** | * | * | ** | - | 纳恩 |
| +0 | - | ** | * | * | ** | + | 纳恩 |
| +I | - | -F | -0 | +0 | +F | + | 纳恩 |
| +F | - | -F | -0 | +0 | +F | + | 纳恩 |
| + | * | -0 | -0 | +0 | +0 | * | 纳恩 |
| 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 |

## 行动

```text
IF SRC = 0

    THEN
          #Z;

    ELSE
          IF Instruction is FIDIV
                THEN
                      DEST := DEST / ConvertToDoubleExtendedPrecisionFP(SRC);
                ELSE (* Source operand is floating-point value *)
                      DEST := DEST / SRC;
          FI;

FI;

IF Instruction = FDIVP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                        Set to 0 if stack underflow occurred.

                          Set if result was rounded up; cleared otherwise.

C0, C2, C3                Undefined.
```

## 浮点 例外

```text
#IS                       Stack underflow occurred.
```

```text
#IA                       Operand is an SNaN value or unsupported format.
```

+/- / +/-; +/-0 / +/-0

```text
#D                        Source is a denormal value.
```

```text
#Z                        DEST / +/-0, where DEST is not equal to +/-0.
```

```text
#U                        Result is too small for destination format.
```

```text
#O                        Result is too large for destination format.
```

```text
#P                        Value cannot be represented exactly in destination format.
```
