---
summary: 存储 浮点 值
---

## 说明

FST指令将ST(0)寄存器中的值复制到目标操作数,它可以是内存位置或FPU寄存器堆栈中的另一个寄存器. 在存储内存中值时,该值被转换为单精度或双精度浮点格式.

FSTP指令执行与FST指令相同的操作,然后弹出寄存器堆栈. 要弹出寄存器堆栈,处理器将ST(0)寄存器标记为空,并将 栈指针 (TOP) 递增为 1 。 FSTP指令也可以以双倍扩展精度浮点格式存储内存中的值.

如果 目标操作数 是 内存位置,则 操作数 指定要存储目的地值的第一个字节的地址. 如果 目标操作数 是一个寄存器,则 操作数 在寄存器堆栈中指定一个相对于堆栈顶部的寄存器.

如果目的地大小是单精度或双精度,所存储的值的符号和值被四舍五入到目的地的宽度(根据FPU控制词的RC字段指定的四舍五入模式),而引子则转换成目的地格式的宽度和偏差. 如果存储的值对目的格式来说太大,则生成一个数字溢出例外(#O),如果例外被解析,则目标操作数中不存储值. 如果存储的值是异常值,则不生成异常例外(#D). 此条件仅作为数字下流例外(#U)条件表示.

如果所存储的值是+/-0,+/-,或者一个NaN,则符号和符号中最小的位点会被切换以适应目的地格式. 此操作保留了该值作为 0, 或 NaN 的特性.

如果 目标操作数 是非空的寄存器,则无效操作例外不会生成.

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
DEST := ST(0);

IF Instruction = FSTP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Indicates rounding direction of if the floating-point inexact exception (#P) is generated: 0 :=
                    not roundup; 1 := roundup.

C0, C2, C3          Undefined.
```

## 浮点 例外

```text
#IS     Stack underflow occurred.
```

```text
#IA     If destination result is an SNaN value or unsupported format, except when the destination
```

格式为双倍扩展精度浮点格式。

```text
#U      Result is too small for the destination format.
```

```text
#O      Result is too large for the destination format.
```

```text
#P      Value cannot be represented exactly in destination format.
```
