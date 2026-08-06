---
summary: 正弦和余弦
---

## 说明

在寄存器 ST (0) 中计算 源操作数 的大概正弦和余弦,并将正弦存储于 ST (0) ,并将余弦推到 FPU 寄存器堆栈的顶端. (此指令比相继执行 FSIN 和 FCOS 指令更快 。)

源操作数必须用弧度给出,并且必须在-263到+263之间. 下表显示在采用各类数字的正弦和余弦时获得的结果,假设不存在下流.

** FSINCOS 结果**

| ST(0) | ST(1) 余弦 | ST( 0) 正弦 |
| --- | --- | --- |
| - | * | * |
| -F | - 1 to + 1 | - 1 to + 1 |
| -0 | +1 | -0 |
| +0 | +1 | +0 |
| +F | - 1 to + 1 | - 1 to + 1 |
| + | * | * |
| 纳恩 | 纳恩 | 纳恩 |

## 行动

```text
IF ST(0) < 263
    THEN
          C2 := 0;
          TEMP := fcos(ST(0)); // approximation of cosine
          ST(0) := fsin(ST(0)); // approximation of sine
          TOP := TOP - 1;
          ST(0) := TEMP;
    ELSE (* Source operand out of range *)
          C2 := 1;

FI;

FPU Flags Affected

C1                        Set to 0 if stack underflow occurred; set to 1 of stack overflow occurs.

                          Set if result was rounded up; cleared otherwise.

C2                        Set to 1 if outside range (-263 < source operand < +263); otherwise, set to 0.

C0, C3                    Undefined.
```

## 浮点 例外

```text
#IS                       Stack underflow or overflow occurred.
```

```text
#IA                       Source operand is an SNaN value, , or unsupported format.
```

```text
#D                        Source operand is a denormal value.
```

```text
#U                        Result is too small for destination format.
```

```text
#P                        Value cannot be represented exactly in destination format.
```
