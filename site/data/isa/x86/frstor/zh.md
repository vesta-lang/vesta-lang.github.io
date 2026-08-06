---
summary: 恢复 x87 FPU 状态
---

## 说明

从 源操作数 指定的内存区域装入 FPU 状态(运行环境和寄存器堆栈). 此状态数据一般由之前的FSAVE/FNSAVE指令写入指定的内存位置.

FPU操作环境包括FPU控制词,状态词,标记词,指令指针,数据指针,以及最后一个操作码. Intel(R)64和IA-32架构软件开发者手册第1卷中的图8-9至8-12,根据处理器的操作模式(受保护或真实)和目前的操作数大小属性(16位或32位),显示存储环境的内存布局. 在虚拟 8086 模式中,使用真实模式布局. FPU寄存器堆栈的内容紧接在操作环境图像之后的80字节中.

FRSTOR指令应与对应的FSAVE/FNSAVE指令以相同的操作模式执行.

如果在新的 FPU 状态单词中设置了一个或多个未卸载的例外位,则在下个 浮点 指令执行时将生成 浮点 例外(除了无等待 浮点 指令,请参见Intel(R)64和IA-32架构软件开发者手册第1卷第8章中题为"软件例外处理"的部分. 为避免在加载新的操作环境时提出例外,清除正在加载的FPU状态词中的所有例外标记.

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
FPUControlWord := SRC[FPUControlWord];
FPUStatusWord := SRC[FPUStatusWord];
FPUTagWord := SRC[FPUTagWord];
FPUDataPointer := SRC[FPUDataPointer];
FPUInstructionPointer := SRC[FPUInstructionPointer];
FPULastInstructionOpcode := SRC[FPULastInstructionOpcode];

ST(0) := SRC[ST(0)];
ST(1) := SRC[ST(1)];
ST(2) := SRC[ST(2)];
ST(3) := SRC[ST(3)];
ST(4) := SRC[ST(4)];
ST(5) := SRC[ST(5)];
ST(6) := SRC[ST(6)];
ST(7) := SRC[ST(7)];

FPU Flags Affected

The C0, C1, C2, C3 flags are loaded.
```

## 浮点 例外

无;然而,如果在状态单词中装入一个未装模作样的例外,则在下一个"等待"浮点指令执行时生成.
