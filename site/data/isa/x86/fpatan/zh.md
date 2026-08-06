---
summary: 部分 Arctangent 语句
---

## 说明

计算寄存器ST(1)中源操作数的弧形,除以寄存器ST(0)中的源操作数,将结果存储在ST(1)中,并弹出FPU寄存器堆栈. 寄存ST(0)的结果与源操作数 ST(1)具有相同的标志,其星等小于+.

FPATAN指令返回X轴与从起源到点(X,Y)之间的角度,Y(坐标)为ST(1),X(abscissa)为ST(0). 角度取决于X和Y独立的标志,而不仅仅是比例Y/X的标志. 这是因为一个点(-X,Y)位于第二象限中,导致在2到 之间有一个角,而一个点(X,-Y)位于第四象限中,导致在0到 -/2之间有一个角. 一个点(-X,-Y)位于第三象限,给出了-/2和-之间的角度.

下表显示计算各类数字的弧度时获得的结果,假设不存在下流.

** FPATAN 结果**

| ST(1) | -F | -p | - to -/2 | -/2 | -/2 | -/2 to -0 | -0 | 纳恩 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -0 | -p | -p | -p* | - 0* | -0 | -0 | 纳恩 |
|  | +0 | +p | +p | + * | + 0* | +0 | +0 | 纳恩 |
|  | +F | +p | + to +/2 | + /2 | +/2 | +/2 to +0 | +0 | 纳恩 |
|  | + | +3/4* | +/2 | +/2 | +/2 | + /2 | + /4* | 纳恩 |
|  | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 |

## IA-32 架构兼容性

此指令的 源操作数 对80287 数学共处理器的限制范围如下: 0 QQST(1)| < QQST(0)| < +

## 行动

```text
ST(1) := arctan(ST(1) / ST(0));
PopRegisterStack;

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
#IA                 Source operand is an SNaN value or unsupported format.
```

```text
#D                  Source operand is a denormal value.
```

```text
#U                  Result is too small for destination format.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
