---
summary: 设置监视器地址
---

## 说明

MONITOR指令臂使用EAX指定的地址地址地址监测硬件(存储操作的监测硬件检查可以通过使用CPUID来确定的地址范围). 存储到指定地址范围内的地址会触发监控硬件. 监视器硬件状态由MWAIT使用.

地址在RAX/EAX/AX中指定,大小基于编码指令的有效地址大小. 默认情况下,DS段用于创建被监控的线性地址. 可使用线段覆盖 。

ECX和EDX也被使用. 他们向MONITOR传递其他信息. ECX指定可选扩展. EDX指定了可选提示;它不会改变指令的建筑行为. 对于Pentium 4处理器(家族15,型号3),没有定义扩展或提示. EDX中未定义的提示被处理器忽略;ECX中未定义的扩展引起了一般的保护断层.

地址范围必须使用回写类型的内存. 只有回写内存才能正确触发监控硬件. 关于确定用于防止假醒的地址范围的额外信息,见Intel(R)64和IA-32架构软件开发者手册第3A卷第11章"多处理器管理".

MONITOR指令作为其他内存交易的负载操作命令. 该指令受许可检查以及与一个字节负载相关的故障的约束. 像负载一样,MONITOR在页面表格中设置A位而不是D位.

CPUID.01H:ECX.MONITOR[3]表示处理器中MONITOR和MWAIT的可用性. 设定时, MONITOR 只能在特权级别 0 执行(在任何其他特权级别上使用会导致无效的-操作码例外). 操作系统或系统BIOS可以通过使用IA32 MISC ENABLE MSR来禁用此指令;禁用MONITOR清除CPUID特征旗,并导致执行生成无效的-操作码例外.

该指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
MONITOR sets up an address range for the monitor hardware using the content of EAX (RAX in 64-bit mode) as an effective address
and puts the monitor hardware in armed state. Always use memory of the write-back caching type. A store to the specified address
range will trigger the monitor hardware. The content of ECX and EDX are used to communicate other information to the monitor
hardware.
```

## Intel C/C++ 内在编译器

```c
MONITOR void _mm_monitor(void const *p, unsigned extensions,unsigned hints);
```

## 数字例外

None.
