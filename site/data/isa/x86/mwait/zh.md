---
summary: 监视器等待
---

## 说明

MWAIT指令提供了提示,允许处理器输入一个依赖执行的优化状态. 有两个主要的目标用途:地址距监测器和先进的电力管理。 MWAIT的两种用法都需要使用MONITOR指令.

CPUID.01H:ECX.MONITOR[3]表示处理器中MONITOR和MWAIT的可用性. 设定时, MWAIT 只能在特权级别 0 执行(在任何其他特权级别上使用会导致无效的-操作码例外). 操作系统或系统BIOS可以通过使用IA32 MISC ENABLE MSR来禁用此指令;禁用MWAIT清除CPUID特征旗,并导致执行生成无效的-操作码例外.

此指令的操作在非64位模式和64位模式中是相同的.

ECX指定了MWAIT指令的可选扩展. EAX可能包含诸如处理器应输入的首选优化状态等提示. 第一个执行MWAIT的处理器只支持EAX和ECX的零值. 后期处理器允许设置 ECX[0] 以允许蒙面中断作为 MWAIT 的中断事件(见下文). 软件可以使用CPUID指令来确定处理器支持的扩展和提示.

MWAIT 地址区域监测

对于地址距监测,MWAIT指令与MONITOR指令运行. 这两个指令允许定义一个等待(MONITOR)的地址,以及一个依赖执行的优化操作在等待地址(MWAIT)开始. MWAIT的执行是对处理器的提示,它可以在等待一个事件或存储操作到MONITOR武装的地址范围时进入一个依赖执行的优化状态.

以下导致处理器退出执行依赖的优化状态: MONITOR指令武装的地址范围的商店, NMI或 SMI,调试例外,机器检查例外, BINIT#信号, INIT#信号,以及 RESET#信号. 其他依赖执行的事件还可能导致处理器退出依赖执行的优化状态。

此外,外部中断导致处理器退出依赖执行的优化状态,或者(1)如果中断会交付给软件(例如,如果HLT被执行而不是MWAIT);或者(2)如果ECX[0]=1. 软件只能使用 ECX [0] = 1执行 MWAIT 如果 CPUID.05H: ECX [1] = 1. (特定执行条件可能导致中断导致处理器退出依赖执行的优化状态,即使中断被掩盖,ECX[0]=0.

退出执行依赖的优化状态后,控制通过MWAIT指令的指令. 未蒙面(包括NMI或SMI)的待决中断可在执行该指示之前交付。 与HLT指令不同,MWAIT指令不支持在MWAIT指令处理一个SMI后重启.

如果之前的 MONITOR 指令没有成功解除地址范围,或者在执行 MONITOR 指令之前没有执行 MWAIT ,那么处理器将不会进入执行依赖-优化状态. MWAIT之后的指示将继续执行。

MWAIT 用于电力管理

MWAIT接受给处理器的提示和可选扩展,在等待一个事件或存储操作到MONITOR武装的地址范围时,它可以输入指定的目标C状态. 对MWAIT电力管理扩展的支持通过CPUID.05H:ECX[0]报告1.

EAX和ECX用于向MWAIT指令传递附加信息,如处理器应输入的优化状态类型. ECX指定了MWAIT指令的可选扩展. EAX可能包含诸如处理器应输入的首选优化状态等提示. 执行特定条件可能导致处理器忽略提示,进入不同的优化状态. 未来的处理器执行可能执行几个优化的"等待"状态,并将根据提示参数在这些状态中选择.

表4-10说明了ECX和EAX注册MWAIT扩展的意义.

```text
          Bits                          Table 4-10. MWAIT Extension Register (ECX)
```

0                                                                                  Description

31: 1 即使蒙面也视中断为中断事件(例如,即使EFLAGS.IF=0). 只有在 CPUID.05H: ECX [1] = 1. 时才能设定.

Reserved

```text
          Bits                             Table 4-11. MWAIT Hints Register (EAX)
```

3:0 描述 7:4 子 C状态在一个C状态内,以位数表示 [7:4] 目标 C状态 * 值 0 表示 C1; 1 表示 C2 等 值 011B 表示 C0

31:8 注: MWAIT扩展的目标C状态是处理器专用的C状态,而不是ACPI C状态保留.

注意,如果MWAIT用于输入任何数字上高于C1的C状态,则由MONITOR指令武装到地址范围的商店,只有在商店来自其他处理器代理的情况下,才会导致处理器退出MWAIT. 非处理器代理的商店在这种情况下可能不会导致处理器退出MWAIT.

MWAIT扩展的更多细节,见Intel(R)64和IA-32架构软件开发者手册第3A卷第17章"权力与热管理".

## 行动

```text
(* MWAIT takes the argument in EAX as a hint extension and is architected to take the argument in ECX as an instruction extension
MWAIT EAX, ECX *)
{
WHILE ( ("Monitor Hardware is in armed state")) {

    implementation_dependent_optimized_state(EAX, ECX); }
Set the state of Monitor Hardware as triggered;
}
```

## Intel C/C++ 内在编译器

```c
MWAIT void _mm_mwait(unsigned extensions, unsigned hints) Example MONITOR/MWAIT instruction pair must be coded in the same loop because execution of the MWAIT instruction will trigger the monitor hardware. It is not a proper usage to execute MONITOR once and then execute MWAIT in a loop. Setting up MONITOR without executing MWAIT has no adverse effects. Typically the MONITOR/MWAIT pair is used in a sequence, such as: EAX = Logical Address(Trigger) ECX = 0 (*Hints *) EDX = 0 (* Hints *) IF ( !trigger_store_happened) { MONITOR EAX, ECX, EDX IF ( !trigger_store_happened ) { MWAIT EAX, ECX } } The above code sequence makes sure that a triggering store does not happen between the first check of the trigger and the execution of the monitor instruction. Without the second check that triggering store would go unnoticed. Typical usage of MONITOR and MWAIT would have the above code sequence within a loop.;
```

## 数字例外

None.
