---
summary: 装入 x87 FPU 环境
---

## 说明

将完整的x87 FPU操作环境从内存装入FPU登记册. 源操作数指定了内存中操作环境数据的第一个字节. 此数据一般通过FSTENV或FNSTENV指令写入指定的内存位置.

FPU操作环境包括FPU控制词,状态词,标记词,指令指针,数据指针,以及最后一个操作码. Intel(R)64和IA-32架构软件开发者手册第1卷中的图8-9至8-12,根据处理器的操作模式(受保护或真实)和目前的操作数大小属性(16位或32位),显示装入环境的内存布局. 在虚拟 8086 模式中,使用真实模式布局.

FLDENV指令应与对应的FSTENV/FNSTENV指令以相同的操作模式执行.

如果在新的 FPU 状态单词中设置了一个或多个未卸载的例外旗帜,则在下个 浮点 指令执行时将生成 浮点 例外(除无等待 浮点 指令外,参见Intel(R)64第8章中题为"软件例外处理"的章节和IA-32架构软件开发者手册第1卷). 为避免在装入新环境时生成例外, 清除正在装入的 FPU 状态词中的所有例外标记 。

如果在执行本指令期间发生页断或限制断层,断层处理者看到的x87 FPU登记册状态可能与从内存中加载的状态不同. 在这种情况下,断层处理者应忽略x87 FPU登记簿的地位,断层的句柄,并返回. FLDENV指令随后将完成x87 FPU登记册的加载,不会导致上下文不一致.

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
FPUControlWord := SRC[FPUControlWord];
FPUStatusWord := SRC[FPUStatusWord];
FPUTagWord := SRC[FPUTagWord];
FPUDataPointer := SRC[FPUDataPointer];
FPUInstructionPointer := SRC[FPUInstructionPointer];
FPULastInstructionOpcode := SRC[FPULastInstructionOpcode];

FPU Flags Affected

The C0, C1, C2, C3 flags are loaded.
```

## 浮点 例外

无;然而,如果在状态单词中装入一个未装模作样的例外,则在下一个"等待"浮点指令执行时生成.
