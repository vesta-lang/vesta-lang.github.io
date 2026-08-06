---
summary: Pop Stack Into EFLAGS 注册
---

## 说明

从堆栈顶部弹出一个双字(POPFD)(如果当前操作数的大小属性为32),并将该值存储在EFLAGS的寄存器中,或者从堆栈顶部弹出一个单词(如果操作数的大小属性为16),并将其存储在EFLAGS寄存器的下16位(即FLAGS寄存器)中. 这些指令推翻了PUSHF/PUSHFD/PUSHFQ指令的操作.

POPF(流行旗)和POPFD(流行旗双人)mnemonics参考了相同的操作码. POPF指令用于操作数大小属性16时;POPFD指令用于操作数大小属性32时. 一些组装器可能会将操作数大小强制到16对POPF,将POPFD强制到32对. 其他可能将mnemonics作为同义词(POPF/POPFD),并使用操作数大小属性的设置来确定从堆栈中弹出值的大小.

POPF/POPFD对EFLAGS寄存器变化的影响,取决于运行模式. 详情见下文表4-20和密钥。

在保护,兼容性,或64位模式下运行特权级别0(或相当于特权级别0的实地址模式)时,除了RF1,VIP,VIF,和VM之外,EFLAGS登记册中的所有非保留旗帜都可以修改. VIP,VIF,和VM保持不受影响.

当在保护,兼容,或64位模式下运行时,特权级别大于0,但小于或等于IOPL时,除了IOPL字段和RF,IF,VIP,VIF,和VM之外,所有旗帜都可以修改;这些旗帜不受影响. 只有操作数的大小属性为32,才能修改AC和ID旗. 中断的旗帜( IF) 只有在执行级别至少与 IOPL 相同时才会更改 。 如果一个 POPF/POPFD 指令执行时没有足够特权,则不发生例外,但特权位不变.

当在虚拟 8086 模式(EFLAGS.VM = 1)中运行时,没有虚拟 8086 模式扩展(CR4.VME = 0),POPF/POPFD指令只能使用IOPL = 3;否则,会出现一般保护例外(#GP). 如果启用虚拟-8086模式扩展(CR4.VME = 1),则POPF(但不是POPFD)可以用IOPL < 3.

(保护-mode虚拟间断功能--通过设置CR4.PVI而启用--以与虚拟 8086 模式扩展相同的方式影响CLI和STI指令. 然而,POPF不受CR4.PVI的影响. )

在64位模式中,mnemonic指定为POPFQ(注意32位操作数不能编码). POPFQ从堆栈中弹出64位. 预留的RFLAGS位(包括RFLAGS的上32位)不受影响.

见英特尔(R)64和IA-32架构软件开发者手册第1卷第3章,关于EFLAGS登记册的更多信息.

1. 联合国 RF在POPF执行后总是0. 这是因为POPF像所有指令一样,在RF开始执行时会清除它.

** POPF/POPFD对EFLAGS登记册的影响**

| 模式 | 操作大小 | CPL | IOPL | 21 | 20 | 19 | 18 | 17 | 16 | 14 | 13:12 | 11 | 10 | 9 | 8 | 7 | 6 | 4 | 2 | 0 | 页:1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  | ID | VIP | VIF | AC | VM | RF | NT | IOPL | OF | DF | IF | TF | SF | ZF | AF | PF | CF |  |
| 实时地址 | 16 | 0 | 0-3 | N | N | N | N | N | 0 | S | S | S | S | S | S | S | S | S | S | S |  |
| 模式 | 32 | 0 | 0-3 | S | N | N | S | N | 0 | S | S | S | S | S | S | S | S | S | S | S |  |
| (CR0.PE = 0) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 保护, | 16 | 0 | 0-3 | N | N | N | N | N | 0 | S | S | S | S | S | S | S | S | S | S | S |  |
| 兼容性, | 16 | 1-3 | <CPL | N | N | N | N | N | 0 | S | N | S | S | N | S | S | S | S | S | S |  |
| 和 64比特 | 16 | 1-3 | CPL | N | N | N | N | N | 0 | S | N | S | S | S | S | S | S | S | S | S |  |
| 模式 | 32, 64 | 0 | 0-3 | S | N | N | S | N | 0 | S | S | S | S | S | S | S | S | S | S | S |  |
| (CR0.PE = 1 | 32, 64 | 1-3 | <CPL | S | N | N | S | N | 0 | S | N | S | S | N | S | S | S | S | S | S |  |
| EFLAGS.VM = 0) | 32, 64 | 1-3 | CPL | S | N | N | S | N | 0 | S | N | S | S | S | S | S | S | S | S | S |  |
|  | 16 | 3 | 0-2 | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | 1 |
| 虚拟-8086 | 16 | 3 | 3 | N | N | N | N | N | 0 | S | N | S | S | S | S | S | S | S | S | S |  |
| (CR0.PE = 1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| EFLAGS.VM = 1 | 32 | 3 | 0-2 | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | 1 |
| CR4.VME = 0) | 32 | 3 | 3 | S | N | N | S | N | 0 | S | N | S | S | S | S | S | S | S | S | S |  |
|  | 16 | 3 | 0-2 | N/ | N/ | SV/ | N/ | N/ | 0/ | S/ | N/X | S/ | S/ | N/ | S/ | S/ | S/ | S/ | S/ | S/ | 2,3 |
| VME |  |  |  | X | X | X | X | X | X | X |  | X | X | X | X | X | X | X | X | X |  |
| (CR0.PE = 1 | 16 | 3 | 3 | N | N | N | N | N | 0 | S | N | S | S | S | S | S | S | S | S | S |  |
| EFLAGS.VM = 1 | 32 | 3 | 0-2 | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | 1 |
| CR4.VME = 1) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | 32 | 3 | 3 | S | N | N | S | N | 0 | S | N | S | S | S | S | S | S | S | S | S |  |

## 行动

```text
IF EFLAGS.VM = 0 (* Not in Virtual-8086 Mode *)
    THEN IF CPL = 0 OR CR0.PE = 0
          THEN
                IF OperandSize = 32;
                      THEN
                            EFLAGS := Pop(); (* 32-bit pop *)
                            (* All non-reserved flags except RF, VIP, VIF, and VM can be modified;
                            VIP, VIF, VM, and all reserved bits are unaffected. RF is cleared. *)
                      ELSE IF (Operandsize = 64)
                            RFLAGS = Pop(); (* 64-bit pop *)
                            (* All non-reserved flags except RF, VIP, VIF, and VM can be modified;
                            VIP, VIF, VM, and all reserved bits are unaffected. RF is cleared. *)


                  ELSE (* OperandSize = 16 *)
                        EFLAGS[15:0] := Pop(); (* 16-bit pop *)
                        (* All non-reserved flags can be modified. *)

            FI;
      ELSE (* CPL > 0 *)

            IF OperandSize = 32
                  THEN
                        IF CPL > IOPL
                              THEN
                                    EFLAGS := Pop(); (* 32-bit pop *)
                                    (* All non-reserved bits except IF, IOPL, VIP, VIF, VM, and RF can be modified;
                                    IF, IOPL, VIP, VIF, VM, and all reserved bits are unaffected; RF is cleared. *)
                              ELSE
                                    EFLAGS := Pop(); (* 32-bit pop *)
                                    (* All non-reserved bits except IOPL, VIP, VIF, VM, and RF can be modified;
                                    IOPL, VIP, VIF, VM, and all reserved bits are unaffected; RF is cleared. *)
                        FI;
                  ELSE IF (Operandsize = 64)
                        IF CPL > IOPL
                              THEN
                                    RFLAGS := Pop(); (* 64-bit pop *)
                                    (* All non-reserved bits except IF, IOPL, VIP, VIF, VM, and RF can be modified;
                                    IF, IOPL, VIP, VIF, VM, and all reserved bits are unaffected; RF is cleared. *)
                              ELSE
                                    RFLAGS := Pop(); (* 64-bit pop *)
                                    (* All non-reserved bits except IOPL, VIP, VIF, VM, and RF can be modified;
                                    IOPL, VIP, VIF, VM, and all reserved bits are unaffected; RF is cleared. *)
                        FI;
                  ELSE (* OperandSize = 16 *)
                        EFLAGS[15:0] := Pop(); (* 16-bit pop *)
                        (* All non-reserved bits except IOPL can be modified; IOPL and all
                        reserved bits are unaffected. *)

            FI;
      FI;
ELSE (* In virtual-8086 mode *)
      IF IOPL = 3

            THEN
                IF OperandSize = 32
                        THEN
                              EFLAGS := Pop();
                              (* All non-reserved bits except IOPL, VIP, VIF, VM, and RF can be modified;
                              VIP, VIF, VM, IOPL, and all reserved bits are unaffected. RF is cleared. *)
                        ELSE
                              EFLAGS[15:0] := Pop(); FI;
                              (* All non-reserved bits except IOPL can be modified; IOPL and all reserved bits are unaffected. *)
                  FI;

            ELSE (* IOPL < 3 *)
                  IF (Operandsize = 32) OR (CR4.VME = 0)
                        THEN #GP(0); (* Trap to virtual-8086 monitor. *)
                        ELSE (* Operandsize = 16 and CR4.VME = 1 *)
                              tempFLAGS := Pop();
                              IF (EFLAGS.VIP = 1 AND tempFLAGS[9] = 1) OR tempFLAGS[8] = 1
                                    THEN #GP(0);
                                    ELSE


                                              EFLAGS.VIF := tempFLAGS[9];
                                              EFLAGS[15:0] := tempFLAGS;
                                              (* All non-reserved bits except IOPL and IF can be modified;
                                              IOPL, IF, and all reserved bits are unaffected. *)
                                  FI;
                      FI;
          FI;
FI;
```

## 受影响的旗帜

所有旗帜都可能会受到影响;详情见行动科。
