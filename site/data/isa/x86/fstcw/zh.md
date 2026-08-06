---
summary: 存储 x87 FPU 控制单词
---

## 说明

在内存中将 FPU 控制词的当前值存储在指定的目的地。 FSTCW指令检查和句柄在存储控制词前待解密的浮点例外;FNSTCW指令没有.

组装器为FSTCW指令发布两个指令(一个FWAIT指令,然后是FNSTCW指令),处理器分别执行每个指令. 如果为其中任一指令生成例外,保存的EIP指导致例外的指令.

此指令的操作在非64位模式和64位模式中是相同的.

## IA-32 架构兼容性

当在MS-DOS兼容模式下运行一个Pentium或Intel486处理器时,可以在FNSTCW指令执行到句柄之前中断一个待决的FPU例外. 参见Intel(R)64和IA-32架构软件开发者手册第1卷附录D中题为"No-wait FPU指令可以让 FPU干扰窗口"的章节,以说明这些情况. FNSTCW指令不能在后来的英特尔处理器上以这种方式中断,除了英特尔夸克TM X1000处理器.

## 行动

```text
DEST := FPUControlWord;

FPU Flags Affected
The C0, C1, C2, and C3 flags are undefined.
```

## 浮点 例外

None.
