---
summary: 检查 浮点
---

## 说明

检查ST(0)注册的内容,并在FPU状态单词中设置条件代码标记C0,C2和C3,以表示注册簿中的值或数字类别(见下表).

。 。 。 。                                                 表3-44. 妇女状况 FXAM 结果

```text
                         Class                                C3            C2                              C0
```

Unsupported                                                0             0                               0

NaN                                                        0             0                               1

正常限号 0 1 0

Infinity                                                   0             1                               1

Zero                                                       1             0                               0

Empty                                                      1             0                               1

异常数 1 10

C1旗设定为ST(0)中的值符号,无论寄存器是空的还是满的. 此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
C1 := sign bit of ST; (* 0 for positive, 1 for negative *)

CASE (class of value or number in ST(0)) OF

    Unsupported:C3, C2, C0 := 000;

    NaN:        C3, C2, C0 := 001;

    Normal:     C3, C2, C0 := 010;

    Infinity:   C3, C2, C0 := 011;

    Zero:       C3, C2, C0 := 100;

    Empty:      C3, C2, C0 := 101;

    Denormal: C3, C2, C0 := 110;

ESAC;

FPU Flags Affected

C1                       Sign of value in ST(0).

C0, C2, C3               See Table 3-44.
```

## 浮点 例外

None.
