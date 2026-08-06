---
summary: 中断返回
---

## 说明

将程序控制从例外或中断处理器返回到被例外中断,外部中断,或软件生成中断的程序或程序. 这些指令也用于执行一个嵌入式任务的返回. (当使用 CALL 指令启动任务切换时,或者当中断或例外导致任务切换到中断或例外处理器时,创建了嵌套任务. )参见Intel(R)64和IA-32架构软件开发者手册第10章中题为"任务链接"的章节,第3A卷.

IRET和IRETD是同一种操作码的mnemonics. IRETD mnemonic(中断返回双倍)在使用32位的操作数大小时从中断返回时打算使用;然而,大多数组装器在IRET mnemonic上均互换使用操作数大小.

在实地址模式中,IRET指令对中断的程序或程序进行远返回. 在此操作中, 处理器会弹出返回指令指针返回代码段选择子,以及EFLAGS从堆栈到堆栈的图像EIP,CS,以及EFLAGS分别登记,然后恢复执行中断的程序或程序。

在保护模式中,IRET指令的动作取决于当前堆栈存储的NT(已取消的任务)和EFLAGS登记册中的VM旗和EFLAGS图像中的VM旗的设置. 根据这些旗帜的设置,处理器执行下列类型的中断返回:

* 从虚拟 8086 模式返回。 * 回归虚拟-8086模式. * 内保级归. * 跨特权级回报. * 从嵌入任务返回( 任务切换) 。

如果NT旗(EFLAGS register)被清除,则IRET指令执行一个远离中断程序的返回,没有任务切换. 返回的代码段必须比中断处理程序常规(如代码RPL的段选择子字段从堆栈中弹出)具有同等或更少的特权.

与实地址模式中断返回一样,IRET指令将返回的指令指针,返回代码段选择子,以及EFLAGS图像分别从堆栈到EIP,CS,和EFLAGS登记册,然后恢复执行中断的程序或程序. 如果返回到另一个特权级别,IRET指令也会从堆栈中弹出栈指针和SS,然后恢复程序执行. 如果返回到 虚拟 8086 模式,处理器也会从堆栈中弹出数据段记录器。

如果设置了NT旗,IRET指令会执行一个任务切换(返回)从嵌套任务(一个名为CALL指令的任务,中断,或例外)返回呼叫或中断的任务. 执行 IRET 指令的任务更新状态保存在其 TSS 中. 如果任务稍后再进入,则执行IRET指令之后的代码.

如果NT旗被设定,处理器处于IA-32e模式,则IRET指令导致一般保护例外.

如果非任务中断(NMIS)被屏蔽(见Intel(R)64和IA-32架构软件开发者手册第3A卷第7.7.1节,"Handling Multimes NMIs"),则执行IRET指令解封NMIs.

即使指令造成过错,也会出现这种解封现象。 在这种情况下,在援引例外处理者之前,应先揭开NMI的面纱。

在64位模式下,指令的默认操作大小为32位. 使用REX.W前缀将操作提升到64位(IRETQ). 参见本节开头的汇总图,用于编码数据和限制.

参见第6章"程序调用,中断,和例外"和第18章"控制流执行技术(CET)"在Intel(R)64和IA-32架构软件开发者手册第1卷,用于CET的细节.

当FRED的过渡被启用时,IRET的一次执行会改变CPL,导致一般保护例外,IRET的一次执行也会在CPL为0时进入兼容模式.

指令令. IRET是一个序列化指令. 见英特尔(R)64和IA-32架构软件开发者手册第11.3节,第3A卷.

请参看Intel(R)64和IA-32架构软件开发者手册第3C卷第28章中的"VMX非root操作中的改变指令行为",以了解VMX非root操作中此指令行为的更多信息.

## 行动

```text
IF PE = 0
    THEN GOTO REAL-ADDRESS-MODE;

ELSIF (IA32_EFER.LMA = 0)
    THEN
          IF (EFLAGS.VM = 1)
                THEN GOTO RETURN-FROM-VIRTUAL-8086-MODE;
                ELSE GOTO PROTECTED-MODE;
          FI;
    ELSE GOTO IA-32e-MODE;

FI;

REAL-ADDRESS-MODE;
    IF OperandSize = 32
          THEN
                EIP := Pop();
                CS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)
                tempEFLAGS := Pop();
                EFLAGS := (tempEFLAGS AND 257FD5H) OR (EFLAGS AND 1A0000H);

        ELSE (* OperandSize = 16 *)

                EIP := Pop(); (* 16-bit pop; clear upper 16 bits *)
                CS := Pop(); (* 16-bit pop *)
                EFLAGS[15:0] := Pop();
    FI;
    END;

RETURN-FROM-VIRTUAL-8086-MODE:
(* Processor is in virtual-8086 mode when IRET is executed and stays in virtual-8086 mode *)

   IF IOPL = 3 (* Virtual mode: PE = 1, VM = 1, IOPL = 3 *)
        THEN IF OperandSize = 32

                THEN
                      EIP := Pop();
                      CS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)
                      EFLAGS := Pop();
                      (* VM, IOPL,VIP and VIF EFLAG bits not modified by pop *)
                      IF EIP not within CS limit
                            THEN #GP(0); FI;

             ELSE (* OperandSize = 16 *)

                      EIP := Pop(); (* 16-bit pop; clear upper 16 bits *)


                     CS := Pop(); (* 16-bit pop *)
                     EFLAGS[15:0] := Pop(); (* IOPL in EFLAGS not modified by pop *)
                     IF EIP not within CS limit

                           THEN #GP(0); FI;
               FI;
         ELSE

             #GP(0); (* Trap to virtual-8086 monitor: PE = 1, VM = 1, IOPL < 3 *)

    FI;
END;

PROTECTED-MODE:

   IF NT = 1
        THEN GOTO TASK-RETURN; (* PE = 1, VM = 0, NT = 1 *)

    FI;

   IF OperandSize = 32

          THEN

                EIP := Pop();

                CS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)

                tempEFLAGS := Pop();

        ELSE (* OperandSize = 16 *)

                EIP := Pop(); (* 16-bit pop; clear upper bits *)

                CS := Pop(); (* 16-bit pop *)

                tempEFLAGS := Pop(); (* 16-bit pop; clear upper bits *)

    FI;

   IF tempEFLAGS(VM) = 1 and CPL = 0

          THEN GOTO RETURN-TO-VIRTUAL-8086-MODE;

          ELSE GOTO PROTECTED-MODE-RETURN;

    FI;

TASK-RETURN: (* PE = 1, VM = 0, NT = 1 *)

    SWITCH-TASKS (without nesting) to TSS specified in link field of current TSS;
    Mark the task just abandoned as NOT BUSY;
    IF EIP is not within CS limit

          THEN #GP(0); FI;
END;

RETURN-TO-VIRTUAL-8086-MODE:

   (* Interrupted procedure was in virtual-8086 mode: PE = 1, CPL=0, VM = 1 in flag image *)

    (* If shadow stack or indirect branch tracking at CPL3 then #GP(0) *)
    IF CR4.CET AND (IA32_U_CET.ENDBR_EN OR IA32_U_CET.SHSTK_EN)

          THEN #GP(0); FI;
    shadowStackEnabled = ShadowStackEnabled(CPL)
    IF EIP not within CS limit

          THEN #GP(0); FI;
    EFLAGS := tempEFLAGS;
    ESP := Pop();
    SS := Pop(); (* Pop 2 words; throw away high-order word *)
    ES := Pop(); (* Pop 2 words; throw away high-order word *)
    DS := Pop(); (* Pop 2 words; throw away high-order word *)
    FS := Pop(); (* Pop 2 words; throw away high-order word *)
    GS := Pop(); (* Pop 2 words; throw away high-order word *)
    IF shadowStackEnabled

          (* check if 8 byte aligned *)
          IF SSP AND 0x7 != 0


            THEN #CP(FAR-RET/IRET); FI;
FI;

CPL := 3;

(* Resume execution in Virtual-8086 mode *)

tempOldSSP = SSP;

(* Now past all faulting points; safe to free the token. The token free is done using the old SSP

* and using a supervisor override as old CPL was a supervisor privilege level *)

IF shadowStackEnabled

      expected_token_value = tempOldSSP | BUSY_BIT (* busy bit - bit position 0 - must be set *)

      new_token_value = tempOldSSP                       (* clear the busy bit *)

      shadow_stack_lock_cmpxchg8b(tempOldSSP, new_token_value, expected_token_value)

FI;

END;

PROTECTED-MODE-RETURN: (* PE = 1 *)

    IF CS(RPL) > CPL
          THEN GOTO RETURN-TO-OUTER-PRIVILEGE-LEVEL;

          ELSE GOTO RETURN-TO-SAME-PRIVILEGE-LEVEL; FI;

END;

RETURN-TO-OUTER-PRIVILEGE-LEVEL:

   IF OperandSize = 32

          THEN
                tempESP := Pop();
                tempSS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)

   ELSE IF OperandSize = 16

          THEN
                tempESP := Pop(); (* 16-bit pop; clear upper bits *)
                tempSS := Pop(); (* 16-bit pop *)

        ELSE (* OperandSize = 64 *)

                tempRSP := Pop();
                tempSS := Pop(); (* 64-bit pop, high-order 48 bits discarded *)
    FI;

   IF new mode  64-Bit Mode

          THEN
                IF EIP is not within CS limit
                      THEN #GP(0); FI;

          ELSE (* new mode = 64-bit mode *)
                IF RIP is non-canonical
                            THEN #GP(0); FI;

    FI;
    EFLAGS (CF, PF, AF, ZF, SF, TF, DF, OF, NT) := tempEFLAGS;

   IF OperandSize = 32 or OperandSize = 64

          THEN EFLAGS(RF, AC, ID) := tempEFLAGS; FI;
    IF CPL  IOPL

          THEN EFLAGS(IF) := tempEFLAGS; FI;

   IF CPL = 0

          THEN
                EFLAGS(IOPL) := tempEFLAGS;

             IF OperandSize = 32 or OperandSize = 64

                      THEN EFLAGS(VIF, VIP) := tempEFLAGS; FI;
    FI;
    IF ShadowStackEnabled(CPL)


          (* check if 8 byte aligned *)
          IF SSP AND 0x7 != 0

                THEN #CP(FAR-RET/IRET); FI;
          IF CS(RPL) != 3

                THEN
                       tempSsCS = shadow_stack_load 8 bytes from SSP+16;
                       tempSsLIP = shadow_stack_load 8 bytes from SSP+8;
                       tempSSP = shadow_stack_load 8 bytes from SSP;
                       SSP = SSP + 24;
                       (* Do 64 bit compare to detect bits beyond 15 being set *)
                       tempCS = CS; (* zero padded to 64 bit *)
                       IF tempCS != tempSsCS
                             THEN #CP(FAR-RET/IRET); FI;
                       (* Do 64 bit compare; pad CSBASE+RIP with 0 for 32 bit LIP *)
                       IF CSBASE + RIP != tempSsEIP
                             THEN #CP(FAR-RET/IRET); FI;
                       (* check if 4 byte aligned *)
                       IF tempSSP AND 0x3 != 0
                             THEN #CP(FAR-RET/IRET); FI;

          FI;
    FI;
    tempOldCPL = CPL;
    CPL := CS(RPL);

          IF OperandSize = 64
                THEN
                       RSP := tempRSP;
                       SS := tempSS;

          ELSE
                ESP := tempESP;
                SS := tempSS;

          FI;
          IF new mode != 64-Bit Mode

                THEN
                       IF EIP is not within CS limit
                             THEN #GP(0); FI;

          ELSE (* new mode = 64-bit mode *)
                IF RIP is non-canonical
                       THEN #GP(0); FI;

          FI;
          tempOldSSP = SSP;
          IF ShadowStackEnabled(CPL)

                IF CPL = 3
                       THEN tempSSP := IA32_PL3_SSP; FI;

          IF ((IA32_EFER.LMA AND CS.L) = 0 AND tempSSP[63:32] != 0) OR
              ((IA32_EFER.LMA AND CS.L) = 1 AND tempSSP is not canonical relative to the current paging mode)
                THEN #GP(0); FI;

          SSP := tempSSP
          FI;
          (* Now past all faulting points; safe to free the token. The token free is done using the old SSP
           * and using a supervisor override as old CPL was a supervisor privilege level *)
          IF ShadowStackEnabled(tempOldCPL)

                expected_token_value = tempOldSSP | BUSY_BIT (* busy bit - bit position 0 - must be set *)
                new_token_value = tempOldSSP (* clear the busy bit *)
                shadow_stack_lock_cmpxchg8b(tempOldSSP, new_token_value, expected_token_value)


          FI;

    FOR each SegReg in (ES, FS, GS, and DS)
          DO
                tempDesc := descriptor cache for SegReg (* hidden part of segment register *)
                IF (SegmentSelector == NULL) OR (tempDesc(DPL) < CPL AND tempDesc(Type) is (data or non-conforming code)))
                      THEN (* Segment register invalid *)
                            SegmentSelector := 0; (*Segment selector becomes null*)
                FI;
          OD;

END;

RETURN-TO-SAME-PRIVILEGE-LEVEL: (* PE = 1, RPL = CPL *)
   IF new mode  64-Bit Mode

          THEN
                IF EIP is not within CS limit
                      THEN #GP(0); FI;

          ELSE (* new mode = 64-bit mode *)
                IF RIP is non-canonical
                            THEN #GP(0); FI;

    FI;
    EFLAGS (CF, PF, AF, ZF, SF, TF, DF, OF, NT) := tempEFLAGS;
    IF OperandSize = 32 or OperandSize = 64

          THEN EFLAGS(RF, AC, ID) := tempEFLAGS; FI;
    IF CPL  IOPL

          THEN EFLAGS(IF) := tempEFLAGS; FI;
    IF CPL = 0

           THEN
                 EFLAGS(IOPL) := tempEFLAGS;
                 IF OperandSize = 32 or OperandSize = 64
                      THEN EFLAGS(VIF, VIP) := tempEFLAGS; FI;

    FI;
    IF ShadowStackEnabled(CPL)

          IF SSP AND 0x7 != 0 (* check if aligned to 8 bytes *)
                THEN #CP(FAR-RET/IRET); FI;

          tempSsCS = shadow_stack_load 8 bytes from SSP+16;
          tempSsLIP = shadow_stack_load 8 bytes from SSP+8;
          tempSSP = shadow_stack_load 8 bytes from SSP;
          SSP = SSP + 24;
          tempCS = CS; (* zero padded to 64 bit *)
          IF tempCS != tempSsCS (* 64 bit compare; CS zero padded to 64 bits *)

                THEN #CP(FAR-RET/IRET); FI;
          IF CSBASE + RIP != tempSsLIP (* 64 bit compare; CSBASE+RIP zero padded to 64 bit for 32 bit LIP *)

                THEN #CP(FAR-RET/IRET); FI;
          IF tempSSP AND 0x3 != 0 (* check if aligned to 4 bytes *)

                THEN #CP(FAR-RET/IRET); FI;
          IF ((IA32_EFER.LMA AND CS.L) = 0 AND tempSSP[63:32] != 0) OR

             ((IA32_EFER.LMA AND CS.L) = 1 AND tempSSP is not canonical relative to the current paging mode)
                THEN #GP(0); FI;

    FI;
    IF ShadowStackEnabled(CPL)

          IF IA32_EFER.LMA = 1
          (* In IA-32e-mode the IRET may be switching stacks if the interrupt/exception was delivered
           through an IDT with a non-zero IST *)


         (* In IA-32e mode for same CPL IRET there is always a stack switch. The below check verifies if the

         stack switch was to self stack and if so, do not try to free the token on this shadow stack. If the

         tempSSP was not to same stack then there was a stack switch so do attempt to free the token *)

              IF tempSSP != SSP

                   THEN

                   expected_token_value = SSP | BUSY_BIT  (* busy bit - bit position 0 - must be set *)

                   new_token_value = SSP                  (* clear the busy bit *)

                   shadow_stack_lock_cmpxchg8b(SSP, new_token_value, expected_token_value)

              FI;

         FI;

         SSP := tempSSP

    FI;
END;

IA-32e-MODE:
    IF NT = 1
          THEN #GP(0);

   ELSE IF OperandSize = 32

          THEN
                EIP := Pop();
                CS := Pop();
                tempEFLAGS := Pop();

        ELSE IF OperandSize = 16

                THEN
                      EIP := Pop(); (* 16-bit pop; clear upper bits *)
                      CS := Pop(); (* 16-bit pop *)
                      tempEFLAGS := Pop(); (* 16-bit pop; clear upper bits *)

                FI;

        ELSE (* OperandSize = 64 *)

                THEN
                            RIP := Pop();
                            CS := Pop(); (* 64-bit pop, high-order 48 bits discarded *)
                            tempRFLAGS := Pop();

    FI;
    IF CS.RPL < CPL or (CR4.FRED = 1 and CS.RPL > CPL)

          THEN #GP(CS.selector); FI;
    IF CS.RPL > CPL

          THEN GOTO RETURN-TO-OUTER-PRIVILEGE-LEVEL;
          ELSE (* CS.RPL = CPL *)

                IF CR4.FRED = 1 and CPL = 0 and CS.L = 0
                      THEN #GP(CS.selector); FI;

                IF instruction began in 64-Bit Mode
                      THEN

                       IF OperandSize = 32

                                  THEN
                                        ESP := Pop();
                                        SS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)

                       ELSE IF OperandSize = 16

                                  THEN
                                        ESP := Pop(); (* 16-bit pop; clear upper bits *)
                                        SS := Pop(); (* 16-bit pop *)

                            ELSE (* OperandSize = 64 *)

                                        RSP := Pop();
                                        SS := Pop(); (* 64-bit pop, high-order 48 bits discarded *)


                    FI;
        FI;
        GOTO RETURN-TO-SAME-PRIVILEGE-LEVEL; FI;

END;
```

## 受影响的旗帜

EFLAGS登记册中的所有旗帜和字段都根据处理器的操作模式而可能修改. 如果执行从嵌套任务返回到先前任务,则EFLAGS登记册将根据EFLAGS图像存储于上一个任务TSS.
