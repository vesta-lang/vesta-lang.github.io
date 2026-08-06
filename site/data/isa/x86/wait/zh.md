---
summary: 单单
---

## 说明

导致处理器在程序开始前检查和句柄待处理,解码,浮点的例外. (FWAIT是WAIT的候补元音. )

此指令对代码中关键章节的例外同步有用. 在 浮点 指令后编码 WAIT 指令,确保指令可能提出的任何未卸载的 浮点 例外在处理器修改指令结果之前得到处理. 请参看Intel(R)64和IA-32架构软件开发者手册第1卷第8章中题为"浮点例外同步"的章节,以了解使用WAIT/FWAIT指令的更多信息.

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
CheckForPendingUnmaskedFloatingPointExceptions;

FPU Flags Affected
The C0, C1, C2, and C3 flags are undefined.
```

## 浮点 例外

None.
