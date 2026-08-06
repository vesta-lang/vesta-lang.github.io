---
summary: 浮点 有条件移动
---

## 说明

测试EFLAGS寄存器中的状态标志,如果给定的测试条件属实,则将源操作数(第二次操作数)移动至目标操作数(第一次操作数). 上文描述栏和英特尔(R)64和IA-32架构软件开发者手册第1卷第8章给出的每个mnemonic os的条件. 源操作数总是在ST(i)注册,目标操作数总是ST(0).

FCMOVcc指令对优化IF小构件很有用. 它们还有助于消除IF业务的分支间接费用,以及处理器可能出现分支误测。

处理器可能不支持FCMOVcc指令. 软件可以通过使用CPUID指令(参见"COMISS-Compare 标量 Ordered 单精度浮点 values and Set EFLAGS")检查处理器的特性信息是否支持FCMOVcc指令. 如果同时设置了CMOV和FPU的特征位,则支持FCMOVcc指令.

此指令的操作在非64位模式和64位模式中是相同的.

## IA-32 架构兼容性

FCMOVcc指令被引入到P6家庭处理器的IA-32架构中,在早期的IA-32处理器中并不存在.

## 行动

```text
IF condition TRUE
    THEN ST(0) := ST(i);

FI;

FPU Flags Affected

C1                        Set to 0 if stack underflow occurred.

C0, C2, C3                Undefined.
```

## 浮点 例外

```text
#IS                       Stack underflow occurred.
```

整数旗影响无.
