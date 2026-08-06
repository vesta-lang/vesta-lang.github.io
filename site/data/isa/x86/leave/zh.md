---
summary: 高级程序退出
---

## 说明

释放由较早的 ENTER 指令设置的堆栈框架 。 LEAVE指令将帧指针(在EBP寄存器中)复制到栈指针寄存器(ESP)中,释放分配给堆栈帧的堆栈空间. 旧的帧指针(ENTER指令保存的调用程序的帧指针)然后从堆栈中弹出到EBP寄存器,恢复调用程序的堆栈帧.

一个RET指令通常按照一个LEAVE指令执行,以将程序控制返回呼叫程序.

参见英特尔(R)64和IA-32架构软件开发者手册第1卷第6章中的"程序要求 block-Structured languages",关于使用ENTER和LEAVE指令的详细信息.

在64位模式下,指令的默认操作大小为64位;32位操作无法编码. 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
IF StackAddressSize = 32

    THEN
          ESP := EBP;

   ELSE IF StackAddressSize = 64

          THEN RSP := RBP; FI;

   ELSE IF StackAddressSize = 16

          THEN SP := BP; FI;
FI;

IF OperandSize = 32

    THEN EBP := Pop();

   ELSE IF OperandSize = 64

          THEN RBP := Pop(); FI;

   ELSE IF OperandSize = 16

          THEN BP := Pop(); FI;
FI;
```

## 受影响的旗帜

None.
