---
summary: 比较 浮点值 和 设置 EFLAGS
---

## 说明

对ST(0)和ST(i)登记册的内容进行无序比较,并根据结果将状态标志 ZF,PF和CF设置在EFLAGS登记册中(见下表)。 比较时忽略了0的标志,因此0.0等于+0.0.

** FCOMI/FCOMIP/FUCOMI/FUCOMIP 结果**

| 比较结果* | ZF | PF | CF |
| --- | --- | --- | --- |
| ST0 > ST(i) | 0 | 0 | 0 |
| ST0 < ST(i) | 0 | 0 | 1 |
| ST0 = ST(i) | 1 | 0 | 0 |
| 无序** | 1 | 1 | 1 |

## IA-32 架构兼容性

FCOMI/FCOMIP/FUCOMI/FUCOMIP指令被引入到P6家族处理器的IA-32架构中,在早期的IA-32处理器中并不存在.

FCOMI/FCOMIP/FUCOMI/FUCOMIP-Compare 浮点值和设置EFLAGS.

## 行动

```text
CASE (relation of operands) OF

    ST(0) > ST(i):  ZF, PF, CF := 000;

    ST(0) < ST(i):  ZF, PF, CF := 001;

    ST(0) = ST(i):  ZF, PF, CF := 100;

ESAC;

IF Instruction is FCOMI or FCOMIP
    THEN

        IF ST(0) or ST(i) = NaN or unsupported format

                THEN
                      #IA

                  IF FPUControlWord.IM = 1

                            THEN
                                  ZF, PF, CF := 111;

                      FI;
          FI;
FI;

IF Instruction is FUCOMI or FUCOMIP
    THEN

        IF ST(0) or ST(i) = QNaN, but not SNaN or unsupported format

                THEN
                      ZF, PF, CF := 111;

                ELSE (* ST(0) or ST(i) is SNaN or unsupported format *)
                       #IA;

                  IF FPUControlWord.IM = 1

                            THEN
                                  ZF, PF, CF := 111;

                      FI;
          FI;
FI;

IF Instruction is FCOMIP or FUCOMIP
    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          Not affected.
```

## 浮点 例外

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 (FCOMI or FCOMIP instruction) One or both operands are NaN values or have unsupported
```

formats.

(FUCOMI或FUCOMIP指令)一个或两个操作数都是SNaN值(但不是QNaNs)或者有未定义的格式. 检测 QNaN 值不会引起无效的- 操作数 例外 。

FCOMI/FCOMIP/FUCOMI/FUCOMIP-Compare 浮点值和设置EFLAGS.
