---
summary: 装入 浮点 值
---

## 说明

将 源操作数 推向 FPU 寄存器堆栈 。 源操作数可以是单精度,双精度,也可以是双扩展精度的浮点格式. 如果源操作数为单精度或双精度浮点格式,则在被推到堆栈之前,自动转换为双倍扩展精度的浮点格式.

FLD指令也可以将选定的FPU寄存器[ST(i)]中的值推到堆栈上. 在此, 推动寄存器 ST( 0) 重复堆栈顶部 。

NOTE

当FLD指令加载一个异常值,且CW中的DM位不蒙蔽时,会标出一个例外,但该值仍然被推到x87堆栈上.

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
IF SRC is ST(i)
    THEN
          temp := ST(i);

FI;

TOP := TOP - 1;

IF SRC is memory-operand
    THEN
          ST(0) := ConvertToDoubleExtendedPrecisionFP(SRC);
    ELSE (* SRC is ST(i) *)
          ST(0) := temp;

FI;

FPU Flags Affected

C1                  Set to 1 if stack overflow occurred; otherwise, set to 0.

C0, C2, C3          Undefined.
```

## 浮点 例外

```text
#IS                 Stack underflow or overflow occurred.
```

```text
#IA                 Source operand is an SNaN. Does not occur if the source operand is in double extended-preci-
```

sion 浮点格式(FLD m80fp或FLD ST(i)).

```text
#D                  Source operand is a denormal value. Does not occur if the source operand is in double
```

扩展精度浮点格式.

## 说明

在 FPU 寄存器堆栈中,将7个常用常数中的1个(双倍扩展精度浮点格式)推向. 可装入这些指令的常数包括+1.0,+0.0,对数210,对数2e, log102,和对数2. 对于每个常数,一个内部的66位常数被四舍五入(按照RC字段在FPU控制词中的规定),以双倍的扩展精度浮点格式. 不精确结果例外(#P)不是通过四舍五入生成的,如果值被四舍五入,在x87 FPU状态单词中也没有设置C1旗.

见Intel(R)64和IA-32架构软件开发者手册第1卷第8章中题为"Pi的表示"的章节,以说明常数.

此指令的操作在非64位模式和64位模式中是相同的.

## IA-32 架构兼容性

当RC域被设定为圆到近时,FPU会产生由Intel 8087和Intel 287数学共处理器产生的相同的常数.

## 行动

```text
TOP := TOP - 1;

ST(0) := CONSTANT;

FPU Flags Affected

C1                  Set to 1 if stack overflow occurred; otherwise, set to 0.

C0, C2, C3          Undefined.
```

## 浮点 例外

```text
#IS                 Stack overflow occurred.
```
