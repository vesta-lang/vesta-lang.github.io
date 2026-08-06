---
summary: 设置中断的旗帜
---

## 说明

在大多数情况下,STI在EFLAGS登记册中设置中断旗(IF). 这使得处理器能够对可遮掩硬件中断作出反应.

如果IF = 0,在STI执行后,可遮蔽硬件中断在指令边界上仍然受到抑制. (提供本指令的延迟效应是为了允许在程序或子程序返回之前进行中断。) 例如,如果STI的指令后面是RET的指令,则允许在确认外部中断之前执行RET的指令. 如果CLI的处决立即跟随这样的STI的处决,则无法识别中断. ) 抑制在交付另一事件(如例外)或执行下一个指令后结束.

IF旗和STI和CLI指令并不禁止产生例外和不可冒充中断(NMIS). 然而,在STI以IF=0.

操作方式不同,定义如下:

* PVI 模式( 保护- mode 虚拟中断) : CR0.PE=1,EFLAGS.VM=0,CPL=3,CR4.PVI=1; 3. * VME模式(虚拟 8086 模式扩展) : CR0.PE=1,EFLAGS.VM=1,CR4.VME=1.

若IOPL < 3,EFLAGS.VIP = 1,且VME模式或PVI模式均处于活动状态,则STI在EFLAGS登记册中设置VIF旗,离开IF不受影响.

表4-22显示STI指令的动作,取决于处理器操作模式,IOPL,CPL,以及EFLAGS.VIP.

** STI结果决定表**

| 模式 | IOPL | EFLAGS.VIP | STI 结果 |
| --- | --- | --- | --- |
| 地址 | X1 | X | IF = 1 |
| 时,不是 PVI2 | CPL | X | IF = 1 |
|  | < CPL | X | #GP 错误 |
|  | 3 | X | IF = 1 |

## 行动

```text
IF CR0.PE = 0 (* Executing in real-address mode *)
    THEN IF := 1; (* Set Interrupt Flag *)
    ELSE
          IF IOPL  CPL (* CPL = 3 if EFLAGS.VM = 1 *)
                THEN IF := 1; (* Set Interrupt Flag *)
                ELSE
                      IF VME mode OR PVI mode
                            THEN
                                  IF EFLAGS.VIP = 0
                                        THEN VIF := 1; (* Set Virtual Interrupt Flag *)
                                        ELSE #GP(0);
                                  FI;
                            ELSE #GP(0);
                      FI;
          FI;

FI;
```

## 受影响的旗帜

或IF旗或VIF旗设为1. 其他旗帜不受影响.
