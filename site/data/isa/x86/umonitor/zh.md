---
summary: 用户级别设置监视器地址
---

## 说明

UMONITOR指令臂使用源寄存器中指定的地址地址地址监测硬件(通过使用CPUID.05H可以确定存储操作的监测硬件检查的地址范围). 存储到指定地址范围内的地址会触发监控硬件. 监视器硬件状态由UMWAIT使用.

来源登记册的内容是一个有效的地址。 默认情况下,DS段用于创建被监控的线性地址. 可使用线段覆盖 。 地址范围必须使用回写类型的内存. 只有回写内存才能保证正确触发监控硬件. 关于确定用于防止假醒的地址范围的额外信息,见Intel(R)64和IA-32架构软件开发者手册第3A卷第11章"多处理器管理".

UMONITOR指令作为其他内存交易的负载操作命令. 该指令受许可检查以及与一个字节负载相关的故障的约束. 像负载一样,UMONITOR在页面表格中设置A位而不是D位.

UMONITOR和UMWAIT在CPUID.07H.00H:ECX.WAITPKG[5]被列举为1. UMONITOR和UMWAIT可以在任何特权级别执行. 除源寄存器的宽度外,指令的操作在非64位模式和64位模式下是相同的.

UMONITOR不与遗留的MWAIT指令互操作. 如果 UMONITOR 在执行 MWAIT 之前被执行,并且在最近执行遗留的 MONITOR 指令之后, MWAIT 将不会进入优化状态. 将继续执行MWAIT之后的指示。

UMONITOR 指令在一个交易区域内使用时会导致交易中止。

源寄存器的宽度(16b,32b或64b)由有效地址宽度决定,以标准方式受到机器模式设置和67个前缀的影响.

## 行动

```text
UMONITOR sets up an address range for the monitor hardware using the content of source register as an effective
address and puts the monitor hardware in armed state. A store to the specified address range will trigger the
monitor hardware.
```

## Intel C/C++ 内在编译器

```c
UMONITOR void _umonitor(void *address);
```

## 数字例外

None.

1. 联合国 ModR/M字节的Mod字段必须有值11B.
