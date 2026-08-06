---
summary: 比较整数
---

## 说明

将ST(0)中的值与整数源操作数相比较,并根据结果设置条件代号C0,C2和FPU状态词中的C3(见下表). 整数值在比较前转换成双倍扩展精度浮点格式.

** FICOM/FICOMP 结果**

| 条件 | C3 | C2 | C0 |
| --- | --- | --- | --- |
| > SRC | 0 | 0 | 0 |
| < SRC | 0 | 0 | 1 |
| = SRC | 1 | 0 | 0 |
| 无序 | 1 | 1 | 1 |

## 行动

```text
CASE (relation of operands) OF

    ST(0) > SRC:  C3, C2, C0 := 000;

    ST(0) < SRC:  C3, C2, C0 := 001;

    ST(0) = SRC:  C3, C2, C0 := 100;

    Unordered:    C3, C2, C0 := 111;

ESAC;

IF Instruction = FICOMP

    THEN

          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          See table on previous page.
```

## 浮点 例外

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 One or both operands are NaN values or have unsupported formats.
```

```text
#D                  One or both operands are denormal values.
```
