---
summary: 缩放
---

## 说明

将 源操作数 中的值( 向 0) 切换为整体值, 并将该值添加到 目标操作数 的参数中 。 目的地和源操作数分别位于ST(0)和ST(1)登记册中的浮点值. 本指令提供2个整体权力的快速乘法或分割. 下表显示在假定不出现溢出或流量不足的情况下,对各类数字进行缩放的结果。

** FSCALE 结果**

| ST(0) | -F | -0 | -F | -F | -F | -F | - | 纳恩 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -0 | -0 | -0 | -0 | -0 | -0 | 纳恩 | 纳恩 |
|  | +0 | +0 | +0 | +0 | +0 | +0 | 纳恩 | 纳恩 |
|  | +F | +0 | +F | +F | +F | +F | + | 纳恩 |
|  | + | 纳恩 | + | + | + | + | + | 纳恩 |
|  | 纳恩 | 纳恩 | 纳恩纳恩 |  | 纳恩 | 纳恩 | 纳恩 | 纳恩 |

## 行动

```text
ST(0) := ST(0)  2RoundTowardZero(ST(1));

FPU Flags Affected

C1                    Set to 0 if stack underflow occurred.

                      Set if result was rounded up; cleared otherwise.

C0, C2, C3            Undefined.
```

## 浮点 例外

```text
#IS            Stack underflow occurred.
```

```text
#IA            Source operand is an SNaN value or unsupported format.
```

```text
#D             Source operand is a denormal value.
```

```text
#U             Result is too small for destination format.
```

```text
#O             Result is too large for destination format.
```

```text
#P             Value cannot be represented exactly in destination format.
```
