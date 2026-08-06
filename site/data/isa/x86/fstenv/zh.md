---
summary: 存储 x87 FPU 环境
---

## 说明

将当前 FPU 运行环境保存在与目的操作指定的内存位置,然后掩盖所有浮点例外. FPU操作环境包括FPU控制词,状态词,标记词,指令指针,数据指针,以及最后一个操作码. Intel(R)64和IA-32架构软件开发者手册第1卷中的图8-9至8-12,根据处理器的操作模式(受保护或真实)和目前的操作数大小属性(16位或32位),显示存储环境的内存布局. 在虚拟 8086 模式中,使用真实模式布局.

FSTENV 指令检查和 句柄 任何待解密的 浮点 例外,在存储 FPU 环境之前; FNSTENV 指令没有. 保存的图像反映了FPU在指令流中FSTENV/FNSTENV指令之前的所有浮点指令已经执行之后的状态.

这些指令经常被例外处理器使用,因为它们提供了FPU指令和数据指针的访问. 环境一般保存在堆栈中. 保存环境后掩盖所有例外,防止浮点例外中断例外处理器.

组装器为FSTENV指令发布两个指令(一个FWAIT指令,然后是FNSTENV指令),处理器分别执行每个指令. 如果为其中任一指令生成例外,保存的EIP指导致例外的指令.

此指令的操作在非64位模式和64位模式中是相同的.

## IA-32 架构兼容性

当在MS-DOS兼容模式下运行一个Pentium或Intel486处理器时,可以在FNSTENV指令执行到句柄之前中断一个待决的FPU例外. 参见Intel(R)64和IA-32架构软件开发者手册第1卷附录D中题为"No-wait FPU指令可以让 FPU干扰窗口"的章节,以说明这些情况. FNSTENV指令不能在后来的英特尔处理器上以这种方式中断,除了英特尔夸克TM X1000处理器.

## 行动

```text
DEST[FPUControlWord] := FPUControlWord;
DEST[FPUStatusWord] := FPUStatusWord;
DEST[FPUTagWord] := FPUTagWord;
DEST[FPUDataPointer] := FPUDataPointer;
DEST[FPUInstructionPointer] := FPUInstructionPointer;
DEST[FPULastInstructionOpcode] := FPULastInstructionOpcode;

FPU Flags Affected

The C0, C1, C2, and C3 are undefined.
```

## 浮点 例外

None.
