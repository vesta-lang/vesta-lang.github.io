---
summary: 清除例外
---

## 说明

清除 浮点 例外旗帜(PE,UE,OE,ZE,DE,和IE),例外摘要状态旗帜(ES),堆错旗帜(SF),FPU 状态词中的繁忙旗帜(B). FCLEX 指令检查和 句柄 任何未解密的 浮点 例外在清除例外旗帜前; FNCLEX 指令没有.

组装器为FCLEX指令发布两个指令(一个FWAIT指令,然后是FNCLEX指令),处理器分别执行每个指令. 如果为其中任一指令生成例外,保存的EIP指导致例外的指令.

## IA-32 架构兼容性

当在MS-DOS*兼容模式下运行一个Pentium或Intel486处理器时,可以在FNCLEX指令执行到句柄之前中断一个待决的FPU例外. 参见Intel(R)64和IA-32架构软件开发者手册第1卷附录D中题为"No-wait FPU指令可以让 FPU干扰窗口"的章节,以说明这些情况. FNCLEX指令不能在后来的英特尔处理器上以这种方式中断,除了英特尔夸克TM X1000处理器.

此指令仅影响x87 FPU 浮点例外旗帜. 它不影响SIMD 浮点登记簿中的MXCSR例外旗帜.

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
FPUStatusWord[0:7] := 0;
FPUStatusWord[15] := 0;

FPU Flags Affected

The PE, UE, OE, ZE, DE, IE, ES, SF, and B flags in the FPU status word are cleared. The C0, C1, C2, and C3 flags are
undefined.
```

## 浮点 例外

None.
