---
summary: TEST 坐标
---

## 说明

将ST(0)寄存器中的值与0.0进行比较,并根据结果设置条件代号C0,C2,FPU状态单词中的C3(见下表).

** FTST 结果**

| 条件 | C3 | C2 | C0 |
| --- | --- | --- | --- |
| ST(0) > 0.0 | 0 | 0 | 0 |
| ST(0) < 0.0 | 0 | 0 | 1 |
| ST(0) = 0.0 | 1 | 0 | 0 |
| 无序 | 1 | 1 | 1 |

## 行动

```text
CASE (relation of operands) OF

    Not comparable: C3, C2, C0 := 111;

    ST(0) > 0.0:  C3, C2, C0 := 000;

    ST(0) < 0.0:  C3, C2, C0 := 001;

    ST(0) = 0.0:  C3, C2, C0 := 100;

ESAC;

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          See Table 3-42.
```

## 浮点 例外

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 The source operand is a NaN value or is in an unsupported format.
```

```text
#D                  The source operand is a denormal value.
```
