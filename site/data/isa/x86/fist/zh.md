---
summary: 存储整数
---

## 说明

FIST指令将ST(0)寄存器中的值转换为签名整数,并存储结果为目标操作数. 值可以用单词或双词整数格式存储. 目标操作数指定了要存储目的地值的第一个字节的地址.

FISTP指令执行与FIST指令相同的操作,然后弹出寄存器堆栈. 要弹出寄存器堆栈,处理器将ST(0)寄存器标记为空,并将 栈指针 (TOP) 递增为 1 。 FISTP指令也以四字整数格式存储值.

下表显示以整数格式存储各类数字时获得的结果.

** FIST/FISTP 结果**

| - | 或 DEST 格式的值太大 | * |
| --- | --- | --- |
|  | F  -1 | -I |
|  | -1 < F < -0 | ** |
|  | -0 | 0 |
|  | +0 | 0 |
|  | +0<F<+1 | ** |
|  | F+1 | +I |
| + | 或 DEST 格式的值太大 | * |
|  | 纳恩 | * |

## 行动

```text
DEST := Integer(ST(0));

IF Instruction = FISTP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                         Set to 0 if stack underflow occurred.

                           Indicates rounding direction of if the inexact exception (#P) is generated: 0 := not roundup; 1
                           := roundup.

                           Set to 0 otherwise.

C0, C2, C3                 Undefined.
```

## 浮点 例外

```text
#IS                        Stack underflow occurred.
```

```text
#IA                        Converted value is too large for the destination format.
```

源操作数是一种SNaN,QNaN,+/-,或不支持的格式.

```text
#P                         Value cannot be represented exactly in destination format.
```
