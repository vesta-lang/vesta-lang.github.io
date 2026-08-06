---
summary: 快速系统调用
---

## 说明

SYSCALL在特权级0引用OS系统调用处理器. 它的运行取决于FRED过渡是否被启用.

FRED 过渡未启用时操作

当FRED的过渡无法启用时,SYSCALL通过将RIP从IA32 LSTAR MSR(在将SYSCALL之后的指令地址保存到RCX)加载到OS处理器中. (MSR写作确保IA32 LSTAR MSR总是包含一个犬形地址. ) OS处理器使用SYSRET指令返回.

SYSCALL还保存RFLAGS输入R11然后是面具RFLAGS使用 IA32 FMASKMSR (MSR地址C0000084H);具体地说,处理器在RFLAGS每一点对应 IA32 FMASK 中设置的一点MSR.

SYSCALL 加载CS和SS选择器,其数值来源于IA32 STAR MSR中的位数47:32. 然而,CS和SS的描述缓存并没有从这些选择者引用的描述符(在GDT或LDT)中加载. 相反,描述符缓存被装入固定值. 详情见行动科。 OS软件有责任确保这些选择器值引用的描述符(在GDT或LDT中)与装入描述符缓存的固定值相对应;SYSCALL指令不保证这种对应.

SYSCALL指令不保存栈指针(RSP). 如果OS系统调用处理器会改变栈指针,则由软件负责保存栈指针的先前值. 这可能在SYSCALL执行之前完成,软件恢复栈指针,指令遵循SYSCALL(将在SYSRET之后执行). 或者,OS系统调用处理器可以在执行SYSRET之前保存栈指针并恢复它.

当在引用 SYSCALL 指令的特权级别启用阴影堆栈时, SSP 会被保存到 IA32 PL3 SSP MSR. 如果在特权级别 0 启用阴影堆栈, SSP 则加载 0 。 参考英特尔(R)64和IA-32架构软件开发者手册第1卷第6章"程序调用,中断,和例外"和第18章"控制流执行技术(CET)",以获得额外的CET细节.

FRED 过渡启用时

当FRED过渡被启用时,SYSCALL通过执行FRED事件交付来引用OS处理器. 见8.3节,"FRED事件交付",载于Intel(R)64和IA-32架构软件开发者手册第3卷. 该事件使用事件类型7和矢量1来交付. 随着FRED的过渡,OS处理器使用ERETU指令返回到运行于CPL 3的调用代码.

指令令. 遵循一个SYSCALL的指令,可以在早期指令完成执行之前从内存中获取,但是在SYSCALL之前的所有指令完成执行之前,它们不会执行(甚至推测)(在早期指令存储的数据变得全球可见之前,后期指令可能执行).

## 行动

```text
IF IA32_EFER.LMA = 0 OR CS.L = 0 (* SYSCALL can be used only in 64-bit mode *)

    THEN #UD;
ELSE IF CR4.FRED = 0


THEN

IF IA32_EFER.SCE = 0

      THEN #UD;

      ELSE

      RCX := RIP;                                            (* Will contain address of next instruction *)

      RIP := IA32_LSTAR;

      R11 := RFLAGS;

      RFLAGS := RFLAGS AND NOT(IA32_FMASK);

      CS.Selector := IA32_STAR[47:32] AND FFFCH (* Operating system provides CS; RPL forced to 0 *)

      (* Set rest of CS to a fixed value *)

      CS.Base := 0;                                          (* Flat segment *)

      CS.Limit := FFFFFH;                                    (* With 4-KByte granularity, implies a 4-GByte limit *)

      CS.Type := 11;                                         (* Execute/read code, accessed *)

      CS.S := 1;

      CS.DPL := 0;

      CS.P := 1;

      CS.L := 1;                                             (* Entry is to 64-bit mode *)

      CS.D := 0;                                             (* Required if CS.L = 1 *)

      CS.G := 1;                                             (* 4-KByte granularity *)

      IF ShadowStackEnabled(CPL)
            THEN (* adjust so bits 63:N get the value of bit N1, where N is the CPU's maximum linear-address width *)
                  IA32_PL3_SSP := LA_adjust(SSP);
                  (* With shadow stacks enabled the system call is supported from Ring 3 to Ring 0 *)
                  (* OS supporting Ring 0 to Ring 0 system calls or Ring 1/2 to ring 0 system call *)
                  (* Must preserve the contents of IA32_PL3_SSP to avoid losing ring 3 state *)

      FI;

      CPL := 0;

      IF ShadowStackEnabled(CPL)
            SSP := 0;

      FI;
      IF EndbranchEnabled(CPL)

            IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
            IA32_S_CET.SUPPRESS = 0
      FI;

                      SS.Selector := IA32_STAR[47:32] + 8;   (* SS just above CS *)
                      (* Set rest of SS to a fixed value *)  (* Flat segment *)
                      SS.Base := 0;                          (* With 4-KByte granularity, implies a 4-GByte limit *)
                      SS.Limit := FFFFFH;                    (* Read/write data, accessed *)
                      SS.Type := 3;
                      SS.S := 1;                             (* 32-bit stack segment *)
                      SS.DPL := 0;                           (* 4-KByte granularity *)
                      SS.P := 1;
                      SS.B := 1;                             (* save instruction length on stack *)
                      SS.G := 1;
          FI;
    ELSE (* CR4.FRED = 1 *)
          FRED event delivery of SYSCALL;
FI;
```

## 受影响的旗帜

All.
