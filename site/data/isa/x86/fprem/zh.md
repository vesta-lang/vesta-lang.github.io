---
summary: 部分残存
---

## 说明

从ST(0)登记册中的值(红利)除以ST(1)登记册中的值(divisor或modulus)计算所得的剩余部分,并将结果存储在ST(0)中。 其余价值如下:

```text
Remainder := ST(0) - (Q  ST(1))
```

这里,Q是一个整数值,通过将[ST(0)/ST(1)]的浮点数乘以零得到. 其余的标志与红利的标志相同. 其余部分的幅度小于模数,除非部分剩余部分被计算出来(见下文)。

本指令产生准确结果;不准确结果例外不发生,四舍五入控制无效. 下表显示计算各类数字剩余部分时获得的结果,假设不存在下流.

** FPREM 结果**

| ST(0) | -F | ST(0) | -F or -0 | * | * | -F or -0 | ST(0) | 纳恩 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -0 | -0 | -0 | * | * | -0 | -0 | 纳恩 |
|  | +0 | +0 | +0 | * | * | +0 | +0 | 纳恩 |
|  | +F | ST(0) | +F or +0 | * | * | +F or +0 | ST(0) | 纳恩 |
|  | + | * | * | * | * | * | * | 纳恩 |
|  | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 | 纳恩 |

## 行动

```text
D := exponent(ST(0))  exponent(ST(1));

IF D < 64
    THEN
          Q := Integer(TruncateTowardZero(ST(0) / ST(1)));
          ST(0) := ST(0)  (ST(1)  Q);
          C2 := 0;
          C0, C3, C1 := LeastSignificantBits(Q); (* Q2, Q1, Q0 *)
    ELSE
          C2 := 1;
          N := An implementation-dependent number between 32 and 63;
          QQ := Integer(TruncateTowardZero((ST(0) / ST(1)) / 2(D - N)));
          ST(0) := ST(0)  (ST(1)  QQ  2(D - N));

FI;

FPU Flags Affected

C0                        Set to bit 2 (Q2) of the quotient.

C1                        Set to 0 if stack underflow occurred; otherwise, set to least significant bit of quotient (Q0).

C2                        Set to 0 if reduction complete; set to 1 if incomplete.

C3                        Set to bit 1 (Q1) of the quotient.
```

## 浮点 例外

```text
#IS                       Stack underflow occurred.
```

```text
#IA                       Source operand is an SNaN value, modulus is 0, dividend is , or unsupported format.
```

```text
#D                        Source operand is a denormal value.
```

```text
#U                        Result is too small for destination format.
```
