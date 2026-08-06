---
summary: 平方根
---

## 说明

在 ST( 0) 寄存器中计算源值的平方根,并将结果存储于 ST( 0) 。

下表显示在假定不出现溢出或下流的情况下,从各种数字的平方根得出的结果。

** FSQRT 结果**

| SRC (ST(0)) | DEST (ST(0)) |
| --- | --- |
| - | * |
| -F | * |
| -0 | -0 |
| +0 | +0 |
| +F | +F |
| + | + |
| 纳恩 | 纳恩 |

## 行动

```text
ST(0) := SquareRoot(ST(0));

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

源操作数是一个负值(除-0).

```text
#D                  Source operand is a denormal value.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
