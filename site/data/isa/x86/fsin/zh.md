---
summary: 正弦
---

## 说明

在寄存器 ST (0) 中计算 源操作数 正弦的近似值,并将结果存储于 ST (0) 。 源操作数必须用弧度给出,并且必须在-263到+263之间. 下表显示

假定不发生下流,在采用各类数字的正弦时取得的结果。

** FSIN 结果**

| SRC (ST(0)) | DEST (ST(0)) |
| --- | --- |
| - | * |
| -F | - 1 to + 1 |
| -0 | -0 |
| +0 | +0 |
| +F | - 1 to +1 |
| + | * |
| 纳恩 | 纳恩 |

## 行动

```text
IF -263 < ST(0) < 263
    THEN
          C2 := 0;
          ST(0) := fsin(ST(0)); // approximation of the mathematical sin function
    ELSE (* Source operand out of range *)
          C2 := 1;

FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Set if result was rounded up; cleared otherwise.

C2                  Set to 1 if outside range (-263 < source operand < +263); otherwise, set to 0.

C0, C3              Undefined.
```

## 浮点 例外

```text
#IS         Stack underflow occurred.
```

```text
#IA         Source operand is an SNaN value, , or unsupported format.
```

```text
#D          Source operand is a denormal value.
```

```text
#P          Value cannot be represented exactly in destination format.
```
