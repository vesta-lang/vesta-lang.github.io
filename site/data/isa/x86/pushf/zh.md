---
summary: 将 EFLAGS 注册到堆栈
---

## 说明

将 栈指针 减为 4(如果当前 操作数 大小属性为 32),并将 EFLAGS 寄存器的全部内容推到堆栈上,或将 栈指针 递减为 2(如果 操作数 大小属性为 16),并将 EFLAGS 寄存器的下十六位(即 FLAGS 寄存器)推到堆栈上. 这些指令推翻了POPF/POPFD指令的操作.

当将整个 EFLAGS 寄存器复制到堆栈时,VM 和 RF 旗(位数 16 和 17)不复制;相反,这些旗的值在堆栈存储的 EFLAGS 图像中清除. 见英特尔(R)64和IA-32架构软件开发者手册第1卷第3章,关于EFLAGS登记册的更多信息.

PUSHF(呼号旗)和PUSHFD(呼号旗双)mnemonics参考了相同的操作码. PUSHF指令用于操作数大小属性为16,PUSHFD指令用于操作数大小属性为32时. 一些组装器在使用PUSHF时可能会将操作数大小强制至16,在使用PUSHFD时可能会强制至32. 其他人可能将这些mnemonics作为同义词(PUSHF/PUSHFD)处理,并使用操作数大小属性的当前设置来确定从堆栈中推出的值大小,而不管使用的mnemonic.

在64位模式中,该指令的默认操作是将栈指针(RSP)降为8位,并在堆栈上推动RFLAGS. 16位操作被支持使用操作数大小的超前缀66H. 32位操作数大小在此模式中无法编码. 当将 RFLAGS 复制到堆栈时, VM 和 RF 旗( 位数 16 和 17) 不复制; 相反, 这些旗的值在堆栈存储的 RFLAGS 图像中清除.

当在虚拟 8086 模式(EFLAGS.VM = 1)中运行时,没有虚拟 8086 模式扩展(CR4.VME = 0),PUSHF/PUSHFD指令只能使用IOPL = 3;否则,会出现一般保护例外(#GP). 如果启用虚拟-8086模式扩展(CR4.VME = 1),则PUSHF(但不是PUSHFD)可以用IOPL < 3.

(保护-mode虚拟间断功能--通过设置CR4.PVI而启用--以与虚拟 8086 模式扩展相同的方式影响CLI和STI指令. 然而,PUSHF不受CR4.PVI的影响. )

在实地址模式中,如果ESP或SP寄存器在PUSHF/PUSHFD指令执行时为1:生成#SS例外但未交付(所报告的堆栈错误阻止#SS交付). 接下来,处理器生成一个#DF例外,并进入一个关闭状态,如Intel(R)64第7章和IA-32架构软件开发者手册第3A卷中的#DF讨论所描述.

## 行动

```text
IF (PE = 0) or (PE = 1 and ((VM = 0) or (VM = 1 and IOPL = 3)))
(* Real-Address Mode, Protected mode, or Virtual-8086 mode with IOPL equal to 3 *)

    THEN
          IF OperandSize = 32
                THEN
                      push (EFLAGS AND 00FCFFFFH);
                      (* VM and RF bits are cleared in image stored on the stack *)
                ELSE
                      push (EFLAGS); (* Lower 16 bits only *)


          FI;

    ELSE IF 64-bit MODE (* In 64-bit Mode *)
          IF OperandSize = 64
                THEN
                      push (RFLAGS AND 00000000_00FCFFFFH);
                      (* VM and RF bits are cleared in image stored on the stack; *)
                ELSE
                      push (EFLAGS); (* Lower 16 bits only *)
          FI;

    ELSE (* In Virtual-8086 Mode with IOPL less than 3 *)
          IF (CR4.VME = 0) OR (OperandSize = 32)
                THEN #GP(0); (* Trap to virtual-8086 monitor *)
                ELSE
                      tempFLAGS = EFLAGS[15:0];
                      tempFLAGS[9] = tempFLAGS[19]; (* VIF replaces IF *)
                      tempFlags[13:12] = 3; (* IOPL is set to 3 in image stored on the stack *)
                      push (tempFLAGS);
          FI;

FI;
```

## 受影响的旗帜

None.
