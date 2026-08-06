---
summary: 清除中断的旗帜
---

## 说明

在大多数情况下,CLI在EFLAGS登记册中清除IF旗,没有其他旗帜受到影响. 清除IF旗会导致处理器忽略可遮掩的外部中断. IF旗和CLI和STI指令对例外情况的产生没有影响,NMI中断.

操作方式不同,定义如下:

* PVI 模式( 保护- mode 虚拟中断) : CR0.PE=1,EFLAGS.VM=0,CPL=3,CR4.PVI=1; 3. * VME模式(虚拟 8086 模式扩展) : CR0.PE=1,EFLAGS.VM=1,CR4.VME=1.

如果 IOPL < 3 和 VME 模式或 PVI 模式是活动的,则 CLI 在 EFLAGS 登记册中清除 VIF 旗帜,留下 IF 不受影响.

表3-7显示CLI指令的动作,取决于处理器操作模式,IOPL,和CPL.

```text
                   Mode                 Table 3-7. Decision Table for CLI Results  CLI Result
              Real-address                                    IOPL                    IF = 0
          Protected, not PVI2                                  X1                     IF = 0
```

CPL

```text
             Protected, PVI3                                 < CPL                 #GP fault
                                                                3                     IF = 0
        Virtual-8086, not VME3                                02                    VIF = 0
                                                                3                     IF = 0
          Virtual-8086, VME3                                  02
                                                                3                  #GP fault
                                                              02                     IF = 0
```

VIF = 0

NOTES: 1. (中文(简体) ). X = 此设置对指令操作没有影响. 2. 对于本表,"保护模式"适用于CR0.PE=1,EFLAGS.VM=0;它包括兼容模式和64位模式. 3. PVI模式和虚拟 8086 模式各意味着CPL=3.

## 行动

```text
IF CR0.PE = 0
    THEN IF := 0; (* Reset Interrupt Flag *)
    ELSE
          IF IOPL  CPL (* CPL = 3 if EFLAGS.VM = 1 *)
                THEN IF := 0; (* Reset Interrupt Flag *)
                ELSE
                      IF VME mode OR PVI mode
                            THEN VIF := 0; (* Reset Virtual Interrupt Flag *)
                            ELSE #GP(0);
                      FI;
          FI;

FI;
```

## 受影响的旗帜

要么IF旗或VIF旗被清除为0. 其他旗帜不受影响.
