---
summary: 初始化 浮点 单位
---

## 说明

将 FPU 控制、状态、标记、 指令指针 和数据指针登记册设定为默认状态。 FPU控制词设定为037FH(圆形至最近,所有例外都蒙面,64位精度). 状态词被清除(没有设置例外旗帜,TOP被设定为0). 寄存器堆栈中的数据登记册保持不变,但它们都被标记为空(11B). 指令和数据指针都被清除。

FINIT 指令检查和 句柄 执行初始化前任何未解密的 浮点 例外; FNINIT 指令没有.

组装器为FINIT指令发布两个指令(一个FWAIT指令,然后是FNINIT指令),处理器分别执行每个指令. 如果为其中任一指令生成例外,保存的EIP指导致例外的指令.

此指令的操作在非64位模式和64位模式中是相同的.

## IA-32 架构兼容性

当在MS-DOS兼容模式下运行一个Pentium或Intel486处理器时,可以在FNINIT指令执行到句柄之前中断一个待决的FPU例外. 参见Intel(R)64和IA-32架构软件开发者手册第1卷附录D中题为"No-wait FPU指令可以让 FPU干扰窗口"的章节,以说明这些情况. FNINIT指令不能在后来的英特尔处理器上以这种方式中断,除了英特尔夸克TM X1000处理器.

在Intel387数学协处理器中,FINIT/FNINIT指令没有清除指令和数据指针.

此指令仅影响x87 FPU. 它不影响XMM和MXCSR登记册。

## 行动

```text
FPUControlWord := 037FH;
FPUStatusWord := 0;
FPUTagWord := FFFFH;
FPUDataPointer := 0;
FPUInstructionPointer := 0;
FPULastInstructionOpcode := 0;

FPU Flags Affected

C0, C1, C2, C3 set to 0.
```

## 浮点 例外

None.
