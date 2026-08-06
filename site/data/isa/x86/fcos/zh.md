---
summary: 余弦
---

## 说明

计算寄存器ST( 0) 中 源操作数 的大约余弦,并将结果存储于ST( 0) 。 源操作数必须用弧度给出,并且必须在-263到+263之间. 下表显示

在使用各种数字的余弦时获得的结果。

** FCOS 结果**

| ST(0) SRC | ST(0) DEST |
| --- | --- |
| - | * |
| -F | -1 to +1 |
| -0 | +1 |
| +0 | +1 |
| +F | - 1 to + 1 |
| + | * |
| 纳恩 | 纳恩 |

## 行动

```text
IF |ST(0)| < 263
THEN

    C2 := 0;
    ST(0) := FCOS(ST(0)); // approximation of cosine
ELSE (* Source operand is out-of-range *)
    C2 := 1;
FI;


FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Set if result was rounded up; cleared otherwise.

                    Undefined if C2 is 1.

C2                  Set to 1 if outside range (-263 < source operand < +263); otherwise, set to 0.

C0, C3              Undefined.
```

## 浮点 例外

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 Source operand is an SNaN value, , or unsupported format.
```

```text
#D                  Source is a denormal value.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
