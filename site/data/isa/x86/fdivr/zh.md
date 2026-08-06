---
summary: 反向分割
---

## 说明

将 源操作数 除以 目标操作数 并将结果存储在目的地位置. 目标操作数(divisor)总是在FPU的登记册中;源操作数(dividend)可以是注册或内存位置. 内存中的源操作数可以是单精度或双精度浮点格式,单词或双词整数格式.

这些指令执行FDIV,FDIVP,和FIDIV指令的反向操作. 提供这些服务是为了支持更有效的编码。

无操作数版本的指令将ST(0)注册的内容除以ST(1)注册的内容. One-操作数版本将内存位置(或浮点或整数)的内容除以ST(0)寄存器的内容. 双操作数版本,将ST(i)注册的内容除以ST(0)注册的内容或反之.

FDIVRP指令在存储结果后执行附加操作,将FPU寄存堆栈弹出. 要弹出寄存器堆栈,处理器将ST(0)寄存器标记为空,并将 栈指针 (TOP) 递增为 1 。 无操作数版本的浮点分割指令总是导致寄存器堆栈被弹出. 在一些组装器中,这个指令的元音是FDIVR,而不是FDIVRP.

FIDIVR指令在进行分割前将整数源操作数转换成双倍扩展精度浮点格式.

如果生成一个未显示的除零例外(#Z),则不存储结果;如果该例外被掩盖,则将一个合适的符号存储在目标操作数中.

下表显示在划分各类数字时获得的结果,假设既不出现溢出,也不出现流量不足。

** FDIVR/FDIVRP/FIDIVR 结果**

| SRC | -F | +0 | +F | ** | ** | -F | -0 | 纳恩 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -I | +0 | +F | ** | ** | -F | -0 | 纳恩 |
|  | -0 | +0 | +0 | * | * | -0 | -0 | 纳恩 |
|  | +0 | -0 | -0 | * | * | +0 | +0 | 纳恩 |
|  | +I | -0 | -F | ** | ** | +F | +0 | 纳恩 |
|  | +F | -0 | -F | ** | ** | +F | +0 | 纳恩 |
|  | + | * | - | - | + | + | * | 纳恩 |
|  | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 |

## 行动

```text
IF DEST = 0

    THEN
          #Z;

    ELSE

        IF Instruction = FIDIVR

                THEN
                      DEST := ConvertToDoubleExtendedPrecisionFP(SRC) / DEST;

                ELSE (* Source operand is floating-point value *)
                      DEST := SRC / DEST;

          FI;
FI;

IF Instruction = FDIVRP

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
#IS     Stack underflow occurred.
```

```text
#IA     Operand is an SNaN value or unsupported format.
```

+/- / +/-; +/-0 / +/-0

```text
#D      Source is a denormal value.
```

```text
#Z      SRC / +/-0, where SRC is not equal to +/-0.
```

```text
#U      Result is too small for destination format.
```

```text
#O      Result is too large for destination format.
```

```text
#P      Value cannot be represented exactly in destination format.
```
