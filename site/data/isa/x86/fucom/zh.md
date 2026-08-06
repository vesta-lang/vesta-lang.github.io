---
summary: 无序比较 浮点值
---

## 说明

对寄存器ST(0)和ST(i)的内容进行无序比较,并根据结果在FPU状态单词中设置条件代号C0,C2和C3(见下表). 如果未指定操作数,则比较ST(0)和ST(1)登记册的内容。 0的标志被忽略,因此0.0等于+0.0.

** FUCOM/FUCOMP/FUCOMPP 结果**

| 比较结果* | C3 | C2 | C0 |
| --- | --- | --- | --- |
| ST0 > ST(i) | 0 | 0 | 0 |
| ST0 < ST(i) | 0 | 0 | 1 |
| ST0 = ST(i) | 1 | 0 | 0 |
| 无序 | 1 | 1 | 1 |

## 行动

```text
CASE (relation of operands) OF

    ST > SRC:  C3, C2, C0 := 000;

    ST < SRC:  C3, C2, C0 := 001;

    ST = SRC:  C3, C2, C0 := 100;

ESAC;

IF ST(0) or SRC = QNaN, but not SNaN or unsupported format

    THEN
          C3, C2, C0 := 111;

    ELSE (* ST(0) or SRC is SNaN or unsupported format *)
           #IA;

        IF FPUControlWord.IM = 1

                THEN
                      C3, C2, C0 := 111;

          FI;
FI;

IF Instruction = FUCOMP

    THEN

          PopRegisterStack;

FI;

IF Instruction = FUCOMPP

    THEN

          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

C0, C2, C3          See Table 3-43.
```

## 浮点 例外

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 One or both operands are SNaN values or have unsupported formats. Detection of a QNaN
```

值本身不会提出无效的- 操作数 例外。

```text
#D                  One or both operands are denormal values.
```
