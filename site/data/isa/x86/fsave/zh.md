---
summary: 存储 x87 FPU 状态
---

## 说明

在内存中存储当前 FPU 状态(运行环境和寄存器堆栈),然后重新初始化 FPU 。 FSAVE指令检查和句柄待解密的浮点例外后再存储FPU状态;FNSAVE指令没有.

FPU操作环境包括FPU控制词,状态词,标记词,指令指针,数据指针,以及最后一个操作码. Intel(R)64和IA-32架构软件开发者手册第1卷中的图8-9至8-12,根据处理器的操作模式(受保护或真实)和目前的操作数大小属性(16位或32位),显示存储环境的内存布局. 在虚拟 8086 模式中,使用真实模式布局. FPU寄存器堆栈的内容被存储在80字节中,立即跟随操作环境图像.

保存的图像反映了FPU在指令流中FSAVE/FNSAVE指令之前的所有浮点指令已经执行之后的状态.

FPU状态保存后,FPU被重新设定为与FINIT/FNINIT指令相同的默认值(参见本章中的"FINIT/FNINIT-Initialize 浮点 Unit").

FSAVE/FNSAVE指令一般在操作系统需要执行上下文切换时使用,例外处理器需要使用FPU,或者应用程序需要将"干净"的FPU传递到一个程序.

组装器为FSAVE指令发布两个指令(一个FWAIT指令,然后是FNSAVE指令),处理器分别执行每个指令. 如果为其中任一指令生成例外,保存的EIP指导致例外的指令.

此指令的操作在非64位模式和64位模式中是相同的.

## IA-32 架构兼容性

对于Intel Pentium处理器之前的Intel数学协处理器和FPU,在尝试从存储在先前的FSAVE/FNSAVE指令中的内存图像读取前,应当执行FWAIT指令. 这个 FWAIT 指令有助于确保存储操作完成.

当在MS-DOS兼容模式下运行一个Pentium或Intel486处理器时,可以在FNSAVE指令执行到句柄之前中断一个待决的FPU例外. 参见Intel(R)64和IA-32架构软件开发者手册第1卷附录D中题为"No-wait FPU指令可以让 FPU干扰窗口"的章节,以说明这些情况. FNSAVE指令不能在后来的英特尔处理器上以这种方式中断,除了英特尔夸克TM X1000处理器.

## 行动

```text
(* Save FPU State and Registers *)

DEST[FPUControlWord] := FPUControlWord;
DEST[FPUStatusWord] := FPUStatusWord;
DEST[FPUTagWord] := FPUTagWord;
DEST[FPUDataPointer] := FPUDataPointer;
DEST[FPUInstructionPointer] := FPUInstructionPointer;
DEST[FPULastInstructionOpcode] := FPULastInstructionOpcode;

DEST[ST(0)] := ST(0);
DEST[ST(1)] := ST(1);
DEST[ST(2)] := ST(2);
DEST[ST(3)] := ST(3);
DEST[ST(4)]:= ST(4);
DEST[ST(5)] := ST(5);
DEST[ST(6)] := ST(6);
DEST[ST(7)] := ST(7);

(* Initialize FPU *)

FPUControlWord := 037FH;
FPUStatusWord := 0;
FPUTagWord := FFFFH;
FPUDataPointer := 0;
FPUInstructionPointer := 0;
FPULastInstructionOpcode := 0;

FPU Flags Affected
The C0, C1, C2, and C3 flags are saved and then cleared.
```

## 浮点 例外

None.
