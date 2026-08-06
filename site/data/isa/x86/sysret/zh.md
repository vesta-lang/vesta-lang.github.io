---
summary: 从快速系统调用返回
---

## 说明

SYSRET是SYSCALL指令的伴奏指令. 它从OS系统调用处理器返回到特权级别3的用户代码. 它这样做的方式是从RCX装入RIP,从R11.1装入RFLAGS,带有64位的操作数大小,SYSRET仍然处于64位模式;否则,它进入兼容模式,只有低位的32位登记器被装入.

SYSRET用IA32 STAR MSR中的位数63:48来加载CS和SS选择器. 然而,CS和SS的描述缓存并没有从这些选择者引用的描述符(在GDT或LDT)中加载. 相反,描述符缓存被装入固定值. 详情见行动科。 OS软件有责任确保这些选择器值引用的描述符(在GDT或LDT中)与装入描述符缓存的固定值相对应;SYSRET指令不保证这种对应.

SYSRET指令不修改栈指针(ESP或RSP). 为此,软件必须切换到用户堆栈. OS可以在执行SYSRET之前加载用户栈指针(如果它是在SYSCALL之后保存的);或者,用户代码可以在从SYSRET接收控制后加载栈指针(如果是在SYSCALL之前保存的).

如果OS在执行SYSRET前加载了栈指针,它必须确保在恢复栈指针与成功执行SYSRET之间发送的任何中断或例外的处理器不会与用户堆栈一起被引用. 它可以采用以下方法:

* 外部中断。 操作系统可以通过清除 EFLAGS.IF 来防止外部中断发送

在装入用户 栈指针 之前。

* 非任务中断( NMIS) 。 OS 可以确保 NMI 处理器与正确的堆栈一起被引用

使用IDT中闸门2(NMI)的中断堆栈表(IST)机制(见7.14.5节,"中断堆栈表",Intel(R)64和IA-32架构软件开发者手册,第3A卷).

* 一般保护例外(#GP). SYSRET 指令生成 #GP(0) 如果 RCX 的值不是

犬齿. 监督办可采用以下一种或多种办法处理这种可能性:

- 确认RCX的值在执行SYSRET之前是犬科的.

-- 使用 page 来保证 SYSCALL 指令永远不会将一个非卡通值保存到 RCX 中.

- 使用IST机制为IDT中的13号门(#GP).

当在特权级别3启用阴影堆栈时,指令加载SSP,其值来自IA32 PL3 SSP MSR. 参考英特尔(R)64和IA-32架构软件开发者手册第1卷第6章"程序调用,中断,和例外"和第18章"控制流执行技术(CET)",以获得额外的CET细节.

启用 FRED 转换时无法执行指令 。 一个已经允许FRED过渡的操作系统应该使用ERETU代替.

1. 联合国 无论R11的值如何,RF和VM旗在RFLAGS执行SYSRET后总是0. 此外,RFLAGS中的所有保留位保留了固定值.

指令令. 遵循一个SYSRET的指令,可以在早期指令完成执行之前从内存中获取,但是在SYSRET之前的所有指令完成执行之前,它们不会执行(甚至推测)(在早期指令存储的数据变得全球可见之前,后期指令可能执行).

## 行动

```text
IF (CS.L  1 ) or (IA32_EFER.LMA  1) or (IA32_EFER.SCE  1) or (CR4.FRED = 1)

(* Not in 64-Bit Mode or SYSCALL/SYSRET not enabled in IA32_EFER or FRED enabled *)
    THEN #UD; FI;

IF (CPL  0) THEN #GP(0); FI;

IF (operand size is 64-bit)

     THEN (* Return to 64-Bit Mode *)

     IF (RCX is not canonical) THEN #GP(0);

     RIP := RCX;

     ELSE (* Return to Compatibility Mode *)

     RIP := ECX;

FI;

RFLAGS := (R11 & 3C7FD7H) | 2;                (* Clear RF, VM, reserved bits; set bit 1 *)

IF (operand size is 64-bit)

     THEN CS.Selector := IA32_STAR[63:48]+16;

     ELSE CS.Selector := IA32_STAR[63:48];

FI;

CS.Selector := CS.Selector OR 3;              (* RPL forced to 3 *)

(* Set rest of CS to a fixed value *)

CS.Base := 0;                                 (* Flat segment *)

CS.Limit := FFFFFH;                           (* With 4-KByte granularity, implies a 4-GByte limit *)

CS.Type := 11;                                (* Execute/read code, accessed *)

CS.S := 1;

CS.DPL := 3;

CS.P := 1;

IF (operand size is 64-bit)

     THEN (* Return to 64-Bit Mode *)

     CS.L := 1;                               (* 64-bit code segment *)

     CS.D := 0;                               (* Required if CS.L = 1 *)

     ELSE (* Return to Compatibility Mode *)

     CS.L := 0;                               (* Compatibility mode *)

     CS.D := 1;                               (* 32-bit code segment *)

FI;

CS.G := 1;                                    (* 4-KByte granularity *)

CPL := 3;

IF ShadowStackEnabled(CPL)

     SSP := IA32_PL3_SSP;

FI;

SS.Selector := (IA32_STAR[63:48]+8) OR 3;     (* RPL forced to 3 *)
(* Set rest of SS to a fixed value *)         (* Flat segment *)
SS.Base := 0;                                 (* With 4-KByte granularity, implies a 4-GByte limit *)
SS.Limit := FFFFFH;                           (* Read/write data, accessed *)
SS.Type := 3;
SS.S := 1;                                    (* 32-bit stack segment*)
SS.DPL := 3;                                  (* 4-KByte granularity *)
SS.P := 1;
SS.B := 1;
SS.G := 1;
```

## 受影响的旗帜

All.
