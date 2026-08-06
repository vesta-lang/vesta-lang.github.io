---
summary: 计算 2x1
---

## 说明

将2的指数值计算为源操作数乘以1的功率。 源操作数位于寄存器ST(0)中,结果也存储在ST(0)中. 源操作数的值必须位于1.0到+1.0之间. 如果源值超出此范围,则结果未定义.

下表显示计算各类数字的指数值时获得的结果,假设既不溢出也不流出。

** 从F2XM1获得的结果**

| ST(0) SRC | ST(0) DEST |
| --- | --- |
| - 1.0 to -0 | - 0.5 to - 0 |
| -0 | -0 |
| +0 | +0 |
| + 0 to +1.0 | + 0 to 1.0 |
| 使用下列公式进行说明: |  |
| tion在非64位模式和64位模式中是相同的. |  |

## 行动

```text
ST(0) := (2ST(0) - 1);

FPU Flags Affected

C1                      Set to 0 if stack underflow occurred.

                        Set if result was rounded up; cleared otherwise.

C0, C2, C3              Undefined.
```

## 浮点 例外

```text
#IS                     Stack underflow occurred.
```

```text
#IA                     Source operand is an SNaN value or unsupported format.
```

```text
#D                      Source is a denormal value.
```

```text
#U                      Result is too small for destination format.
```

```text
#P                      Value cannot be represented exactly in destination format.
```
