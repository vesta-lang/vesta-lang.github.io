---
summary: 节选标识和符号
---

## 说明

将ST( 0) 寄存器中的源值分离到它的寄存器和符号中,将寄存器存储在 ST( 0) 中,并将寄存器推到寄存器堆栈中。 在这次操作后,新的顶级寄存器ST(0)包含以浮点值表示的原始符号值. 此值的标志和标志与 源操作数 中发现的相同,而引号为 3FFFH(对于一个真实的0的表示符的偏差值). ST(1)寄存器中包含以浮点值表示的操作数原生真(无偏见)表示值. (本指令执行的操作是IEEE推荐的logb(x)函数的超集.

此指令和F2XM1指令对于执行功率和射程缩放操作有用. FXTRACT指令对于将双倍扩展精度的浮点格式的数字转换为十进制表示(例如用于打印或显示)也是有用的.

如果 浮点 零分化例外(#Z)被掩盖,源操作数为零,则一个表示值的数值被存储在寄存器ST(1)和0中,并带有源操作数的标志,则存储在寄存器ST(0)中.

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
TEMP := Significand(ST(0));
ST(0) := Exponent(ST(0));

TOP := TOP - 1;

ST(0) := TEMP;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred; set to 1 if stack overflow occurred.

C0, C2, C3          Undefined.
```

## 浮点 例外

```text
#IS                 Stack underflow or overflow occurred.
```

```text
#IA                 Source operand is an SNaN value or unsupported format.
```

```text
#Z                  ST(0) operand is +/-0.
```

```text
#D                  Source operand is a denormal value.
```
