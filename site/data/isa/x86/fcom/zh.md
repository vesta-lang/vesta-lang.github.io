---
summary: 比较 浮点值
---

## 说明

比较寄存器ST(0)和源值的内容,并根据结果在FPU状态词中设置条件代码标记C0,C2和C3(见下表). 源操作数可以是数据寄存器或内存位置. 如果没有给出源操作数,则将ST(0)中的值与ST(1)中的值进行比较. 0的标志被忽略,因此0.0等于+0.0.

** FCOM/FCOMP/FCOMPP 结果**

| 条件 | C3 | C2 | C0 |
| --- | --- | --- | --- |
| ST(0) > SRC | 0 | 0 | 0 |
| ST(0) < SRC | 0 | 0 | 1 |
| ST(0) = SRC | 1 | 0 | 0 |
| 无序* | 1 | 1 | 1 |

## 行动

```text
CASE (relation of operands) OF

    ST > SRC:  C3, C2, C0 := 000;

    ST < SRC:  C3, C2, C0 := 001;

    ST = SRC:  C3, C2, C0 := 100;

ESAC;

IF ST(0) or SRC = NaN or unsupported format

    THEN

          #IA

        IF FPUControlWord.IM = 1

                THEN

                      C3, C2, C0 := 111;

          FI;

FI;

IF Instruction = FCOMP

    THEN

          PopRegisterStack;

FI;

IF Instruction = FCOMPP

    THEN
          PopRegisterStack;
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

注册为空 。

```text
#D                  One or both operands are denormal values.
```
