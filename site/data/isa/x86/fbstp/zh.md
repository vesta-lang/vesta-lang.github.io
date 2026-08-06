---
summary: 存储 BCD 整数和 Pop
---

## 说明

将ST( 0) 寄存器中的值转换为18位组合的 BCD 整数,将结果存储在 目标操作数 中,并弹出寄存器堆栈。 如果源值是非整体值,则按照FPU控制词的RC字段指定的四舍五入模式将其四舍五入为整数值. 要弹出寄存器堆栈,处理器将ST(0)寄存器标记为空,并将 栈指针 (TOP) 递增为 1 。

目标操作数指定了要存储第一个字节目的值的地址. BCD值(包括其标志位值)在内存中需要10字节的空间.

下表显示了以包装的BCD格式存储各类数字时获得的结果.

** FBSTP 结果**

| - | 或 DEST 格式的值太大 | * |
| --- | --- | --- |
|  | F-1 | -D |
|  | -1 < F < -0 | ** |
|  | -0 | -0 |
|  | +0 | +0 |
|  | + 0 < F < +1 | ** |
|  | F  +1 | +D |
| + | 或 DEST 格式的值太大 | * |
|  | 纳恩 | * |

## 行动

```text
DEST := BCD(ST(0));
PopRegisterStack;

FPU Flags Affected

C1                   Set to 0 if stack underflow occurred.

                     Set if result was rounded up; cleared otherwise.

C0, C2, C3           Undefined.
```

## 浮点 例外

```text
#IS     Stack underflow occurred.
```

```text
#IA     Converted value that exceeds 18 BCD digits in length.
```

源操作数是一个SNaN,QNaN,+/-,或者以不支持的形式.

```text
#P      Value cannot be represented exactly in destination format.
```
