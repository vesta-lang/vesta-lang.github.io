---
summary: 交换登记册内容
---

## 说明

交换登记册ST(0)和ST(i)的内容。 如果没有指定源操作数,则交换ST(0)和ST(1)的内容.

本指令提供了将 FPU 寄存器堆栈中的值移动到堆栈顶部 [ST( 0)] 的简单手段,这样它们就可以由那些 浮点 指令运行,这些指令只能运行在 ST( 0) 中的值上. 例如,以下指令序列从寄存器堆栈的顶端取出第三个寄存器的方根:

FXCH ST(3); FSQRT; FXCH ST(3);

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
IF (Number-of-operands) is 1
    THEN
          temp := ST(0);
          ST(0) := SRC;
          SRC := temp;
    ELSE
          temp := ST(0);
          ST(0) := ST(1);
          ST(1) := temp;

FI;

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          Undefined.
```

## 浮点 例外

```text
#IS                 Stack underflow occurred.
```
