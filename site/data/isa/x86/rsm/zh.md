---
summary: 从系统管理模式恢复
---

## 说明

将系统管理模式(SMM)的程序控制返回到处理器收到SMM中断时中断的应用程序或操作系统程序. 处理器状态从输入SMM时创建的垃圾堆恢复. 如果处理器在状态恢复过程中检测到无效状态信息,则会进入关闭状态. 下列无效信息可导致关闭 :

* 任何预留的 CR4 位被设定为 1. * CR0中任意非法组合位元,如(PG=1和PE=0)或(NW=1和CD=0). * (仅Intel Pentium和Intel486TM处理器. )存储在状态倾卸基场的值不是32-KByte.

对齐地址。

模型特定登记册的内容不受SMM返回的影响。

RSM使用的SMM状态地图支持恢复非64位模式和64位模式的处理器上下文.

参见第34章,"系统管理模式",见Intel(R)64和IA-32架构软件开发者手册,第3C卷,关于SMM和RSM指令行为的更多信息.

## 行动

```text
ReturnFromSMM;
IF (IA-32e mode supported) or (CPUID DisplayFamily_DisplayModel = 06H_0CH )

    THEN
          ProcessorState := Restore(SMMDump(IA-32e SMM STATE MAP));

    Else
          ProcessorState := Restore(SMMDump(Non-32-Bit-Mode SMM STATE MAP));

FI
```

## 受影响的旗帜

All.
