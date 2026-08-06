---
summary: 从程序返回
---

## 说明

将程序控制转到堆栈顶部的返回地址。 地址通常由CALL指令放在堆栈上,返回到遵循CALL指令的指令.

可选的 源操作数 指定返回地址弹出后要释放的堆栈字节数;默认为无. 这个操作数可以用来从堆栈中释放被传递到所谓的程序并且不再需要的参数. 当用于切换到新程序的CALL指令使用非零字数的呼叫门访问新程序时,必须使用它. 在此,用于RET指令的源操作数必须指定与调用闸门的单词计数字段中指定的相同字节数.

RET 指令可用于执行三种不同类型的返回:

* 接近返回 -- -- 返回当前代码段内的调用程序(该段目前指向)

),有时称为区内返回。

* 远返回 -- -- 返回位于与当前代码段不同段的调用程序,

有时也称为间断返回.

* 跨特权级远返 -- -- 远返至与目前不同的特权级

执行程序。

跨特权级返回类型只能在保护模式执行. 见英特尔(R)64和IA-32架构软件开发者手册第1卷第6章中题为"使用呼叫和RET的呼叫程序"的章节,以了解关于近、远和省际级回报的详细资料。

当执行一个接近返回时,处理器从堆栈顶部将返回的指令指针(offset)弹出到EIP寄存器中,并在新的指令指针开始程序执行. CS登记表不变.

当执行远返回时,处理器从堆栈顶部将返回的指令指针弹出到EIP寄存器中,然后从堆栈顶部将段选择子弹出到CS寄存器中. 然后处理器在新的指令指针开始在新的代码段执行程序.

跨特权级远返回的力学类似于间距返回,只是处理器检查了返回的代码和堆栈段的特权级和访问权,以确定是否允许进行控制转移. DS、ES、FS和GS区段登记册,如果是指不允许在新的特权级别进入的区段,则在跨特权级别返回期间,由RET指令批准。 由于堆栈开关也发生于跨特权级别返回上,ESP和党卫军登记器从堆栈中加载.

如果参数在中间优先级调用时被传递到所谓的程序,则必须使用可选的源操作数与RET指令一起在返回时释放参数. 这里,参数从所谓的程序堆栈和调用程序堆栈(即返回的堆栈)中释放出来.

在64位模式中,本指令的默认操作大小是堆栈地址大小,即64位. 这适用于近返回,不远返回;远返回的默认操作大小为32位.

参见第6章"程序调用,中断,和例外",第18章"控制流执行技术(CET)",见Intel(R)64和IA-32架构软件开发者手册,第一卷,CET细节.

启用 FRED 过渡时,执行远 RET 将改变 CPL 导致一般保护例外,执行远 RET 当 CPL 0.

指令令. 远返回后的指示可能会在早先的指示完成执行之前从内存中获取,但是在远返回前的所有指示完成执行之前不会执行(甚至推测)(后来的指示可能在先前的指示存储的数据变得全球可见之前执行).

与接近间接的CALL和接近间接的JMP不同,处理器不会在接近RET后推测执行下一个顺序指令,除非该指令也是跳跃的目标或分支预测器中的目标.

## 行动

```text
(* Near return *)
IF instruction = near return

    THEN;
          IF OperandSize = 32
                THEN
                      IF top 4 bytes of stack not within stack limits
                            THEN #SS(0); FI;
                      EIP := Pop();
                      IF ShadowStackEnabled(CPL)
                            tempSsEIP = ShadowStackPop4B();
                            IF EIP != TempSsEIP
                                  THEN #CP(NEAR_RET); FI;
                      FI;
                ELSE
                      IF OperandSize = 64
                            THEN
                                  IF top 8 bytes of stack not within stack limits
                                        THEN #SS(0); FI;
                                  RIP := Pop();
                                  IF ShadowStackEnabled(CPL)
                                        tempSsEIP = ShadowStackPop8B();
                                        IF RIP != tempSsEIP
                                              THEN #CP(NEAR_RET); FI;
                                  FI;
                            ELSE (* OperandSize = 16 *)
                                  IF top 2 bytes of stack not within stack limits
                                        THEN #SS(0); FI;
                                  tempEIP := Pop();
                                  tempEIP := tempEIP AND 0000FFFFH;
                                  IF tempEIP not within code segment limits
                                        THEN #GP(0); FI;
                                  EIP := tempEIP;
                                  IF ShadowStackEnabled(CPL)
                                        tempSsEip = ShadowStackPop4B();
                                        IF EIP != tempSsEIP
                                              THEN #CP(NEAR_RET); FI;
                                  FI;
                      FI;
          FI;

          IF instruction has immediate operand


                THEN (* Release parameters from stack *)
                    IF StackAddressSize = 32
                             THEN
                                   ESP := ESP + SRC;
                             ELSE
                               IF StackAddressSize = 64
                                         THEN
                                               RSP := RSP + SRC;
                                     ELSE (* StackAddressSize = 16 *)
                                               SP := SP + SRC;
                                   FI;
                       FI;

          FI;
FI;

(* Real-address mode or virtual-8086 mode *)
IF ((PE = 0) or (PE = 1 AND VM = 1)) and instruction = far return

    THEN
          IF OperandSize = 32
                THEN
                       IF top 8 bytes of stack not within stack limits
                             THEN #SS(0); FI;
                       EIP := Pop();
                       CS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)
                ELSE (* OperandSize = 16 *)
                       IF top 4 bytes of stack not within stack limits
                             THEN #SS(0); FI;
                       tempEIP := Pop();
                       tempEIP := tempEIP AND 0000FFFFH;
                       IF tempEIP not within code segment limits
                             THEN #GP(0); FI;
                       EIP := tempEIP;
                       CS := Pop(); (* 16-bit pop *)
          FI;

    IF instruction has immediate operand
          THEN (* Release parameters from stack *)
                SP := SP + (SRC AND FFFFH);

    FI;
FI;

(* Protected mode, not virtual-8086 mode *)
IF (PE = 1 and VM = 0 and IA32_EFER.LMA = 0) and instruction = far return

    THEN
          IF OperandSize = 32
                THEN
                       IF second doubleword on stack is not within stack limits
                             THEN #SS(0); FI;
                ELSE (* OperandSize = 16 *)
                       IF second word on stack is not within stack limits
                             THEN #SS(0); FI;
          FI;
          IF return code segment selector is NULL
                THEN #GP(0); FI;
          IF return code segment selector addresses descriptor beyond descriptor table limit


                THEN #GP(selector); FI;
          Obtain descriptor to which return code segment selector points from descriptor table;
          IF return code segment descriptor is not a code segment

                THEN #GP(selector); FI;
          IF return code segment selector RPL < CPL

                THEN #GP(selector); FI;
          IF return code segment descriptor is conforming and return code segment DPL > return code segment selector RPL

                THEN #GP(selector); FI;

        IF return code segment descriptor is non-conforming and return code segment DPL  return code segment selector RPL

                THEN #GP(selector); FI;
          IF return code segment descriptor is not present

                THEN #NP(selector); FI:
          IF return code segment selector RPL > CPL

                THEN GOTO RETURN-TO-OUTER-PRIVILEGE-LEVEL;
                ELSE GOTO RETURN-TO-SAME-PRIVILEGE-LEVEL;
          FI;
FI;

RETURN-TO-SAME-PRIVILEGE-LEVEL:
    IF the return instruction pointer is not within the return code segment limit
          THEN #GP(0); FI;
    IF OperandSize = 32
          THEN
                EIP := Pop();
                CS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)
         ELSE (* OperandSize = 16 *)
                EIP := Pop();
                EIP := EIP AND 0000FFFFH;
                CS := Pop(); (* 16-bit pop *)
    FI;
    IF instruction has immediate operand
          THEN (* Release parameters from stack *)
               IF StackAddressSize = 32
                      THEN
                            ESP := ESP + SRC;
                    ELSE (* StackAddressSize = 16 *)
                            SP := SP + SRC;
                FI;
    FI;
    IF ShadowStackEnabled(CPL)
          (* SSP must be 8 byte aligned *)
          IF SSP AND 0x7 != 0
                THEN #CP(FAR-RET/IRET); FI;
          tempSsCS = shadow_stack_load 8 bytes from SSP+16;
          tempSsLIP = shadow_stack_load 8 bytes from SSP+8;
          prevSSP = shadow_stack_load 8 bytes from SSP;
          SSP = SSP + 24;
          (* do a 64 bit-compare to check if any bits beyond bit 15 are set *)
          tempCS = CS; (* zero pad to 64 bit *)
          IF tempCS != tempSsCS
                THEN #CP(FAR-RET/IRET); FI;
          (* do a 64 bit-compare; pad CSBASE+RIP with 0 for 32 bit LIP*)
          IF CSBASE + RIP != tempSsLIP
                THEN #CP(FAR-RET/IRET); FI;


          (* prevSSP must be 4 byte aligned *)
          IF prevSSP AND 0x3 != 0

                THEN #CP(FAR-RET/IRET); FI;
          (* In legacy mode SSP must be in low 4GB *)
          IF prevSSP[63:32] != 0

                THEN #GP(0); FI;
          SSP := prevSSP
    FI;

RETURN-TO-OUTER-PRIVILEGE-LEVEL:
    IF top (16 + SRC) bytes of stack are not within stack limits (OperandSize = 32)
    or top (8 + SRC) bytes of stack are not within stack limits (OperandSize = 16)
                THEN #SS(0); FI;
    Read return segment selector;
    IF stack segment selector is NULL
          THEN #GP(0); FI;
    IF return stack segment selector index is not within its descriptor table limits
          THEN #GP(selector); FI;
    Read segment descriptor pointed to by return segment selector;
    IF stack segment selector RPL  RPL of the return code segment selector
    or stack segment is not a writable data segment
    or stack segment descriptor DPL  RPL of the return code segment selector
                THEN #GP(selector); FI;
    IF stack segment not present
          THEN #SS(StackSegmentSelector); FI;
    IF the return instruction pointer is not within the return code segment limit
          THEN #GP(0); FI;
    IF OperandSize = 32
          THEN
                EIP := Pop();
                CS := Pop(); (* 32-bit pop, high-order 16 bits discarded; segment descriptor loaded *)
                CS(RPL) := ReturnCodeSegmentSelector(RPL);
                IF instruction has immediate operand
                       THEN (* Release parameters from called procedure's stack *)
                          IF StackAddressSize = 32
                                   THEN
                                         ESP := ESP + SRC;
                               ELSE (* StackAddressSize = 16 *)
                                         SP := SP + SRC;
                             FI;
                FI;
                tempESP := Pop();
                tempSS := Pop(); (* 32-bit pop, high-order 16 bits discarded; seg. descriptor loaded *)
         ELSE (* OperandSize = 16 *)
                EIP := Pop();
                EIP := EIP AND 0000FFFFH;
                CS := Pop(); (* 16-bit pop; segment descriptor loaded *)
                CS(RPL) := ReturnCodeSegmentSelector(RPL);
                IF instruction has immediate operand
                       THEN (* Release parameters from called procedure's stack *)
                          IF StackAddressSize = 32
                                   THEN
                                         ESP := ESP + SRC;
                               ELSE (* StackAddressSize = 16 *)


                                    SP := SP + SRC;
                        FI;
            FI;
            tempESP := Pop();
            tempSS := Pop(); (* 16-bit pop; segment descriptor loaded *)
      FI;
IF ShadowStackEnabled(CPL)
      (* check if 8 byte aligned *)
      IF SSP AND 0x7 != 0
            THEN #CP(FAR-RET/IRET); FI;
      IF ReturnCodeSegmentSelector(RPL) !=3
            THEN
                  tempSsCS = shadow_stack_load 8 bytes from SSP+16;
                  tempSsLIP = shadow_stack_load 8 bytes from SSP+8;
                  tempSSP = shadow_stack_load 8 bytes from SSP;
                  SSP = SSP + 24;
                  (* Do 64 bit compare to detect bits beyond 15 being set *)
                  tempCS = CS; (* zero extended to 64 bit *)
                  IF tempCS != tempSsCS
                        THEN #CP(FAR-RET/IRET); FI;
                  (* Do 64 bit compare; pad CSBASE+RIP with 0 for 32 bit LA *)
                  IF CSBASE + RIP != tempSsLIP
                        THEN #CP(FAR-RET/IRET); FI;
                  (* check if 4 byte aligned *)
                  IF tempSSP AND 0x3 != 0
                        THEN #CP(FAR-RET/IRET); FI;
      FI;
FI;
      tempOldCPL = CPL;

     CPL := ReturnCodeSegmentSelector(RPL);

     ESP := tempESP;

     SS := tempSS;

     tempOldSSP = SSP;

     IF ShadowStackEnabled(CPL)

          IF CPL = 3

          THEN tempSSP := IA32_PL3_SSP; FI;

          IF tempSSP[63:32] != 0

          THEN #GP(0); FI;

          SSP := tempSSP

     FI;

     (* Now past all faulting points; safe to free the token. The token free is done using the old SSP

     * and using a supervisor override as old CPL was a supervisor privilege level *)

     IF ShadowStackEnabled(tempOldCPL)

          expected_token_value = tempOldSSP | BUSY_BIT (* busy bit - bit position 0 - must be set *)

          new_token_value = tempOldSSP       (* clear the busy bit *)

          shadow_stack_lock_cmpxchg8b(tempOldSSP, new_token_value, expected_token_value)

     FI;

FI;

FOR each SegReg in (ES, FS, GS, and DS)
      DO
            tempDesc := descriptor cache for SegReg (* hidden part of segment register *)
            IF (SegmentSelector == NULL) OR (tempDesc(DPL) < CPL AND tempDesc(Type) is (data or non-conforming code)))


           THEN (* Segment register invalid *)
                 SegmentSelector := 0; (*Segment selector becomes null*)

      FI;
OD;

IF instruction has immediate operand

      THEN (* Release parameters from calling procedure's stack *)

          IF StackAddressSize = 32
                  THEN

                        ESP := ESP + SRC;
                ELSE (* StackAddressSize = 16 *)

                        SP := SP + SRC;
            FI;

FI;

(* IA-32e Mode *)
    IF (PE = 1 and VM = 0 and IA32_EFER.LMA = 1) and instruction = far return
          THEN
                IF OperandSize = 32
                      THEN
                            IF second doubleword on stack is not within stack limits
                                  THEN #SS(0); FI;
                            IF first or second doubleword on stack is not in canonical space
                                  THEN #SS(0); FI;
                      ELSE
                            IF OperandSize = 16
                                  THEN
                                        IF second word on stack is not within stack limits
                                              THEN #SS(0); FI;
                                        IF first or second word on stack is not in canonical space
                                              THEN #SS(0); FI;
                                  ELSE (* OperandSize = 64 *)
                                        IF first or second quadword on stack is not in canonical space
                                              THEN #SS(0); FI;
                            FI
                FI;
          IF return code segment selector is NULL
                THEN GP(0); FI;
          IF return code segment selector addresses descriptor beyond descriptor table limit
                THEN GP(selector); FI;
          IF return code segment selector addresses descriptor in non-canonical space
                THEN GP(selector); FI;
          Obtain descriptor to which return code segment selector points from descriptor table;
          IF return code segment descriptor is not a code segment
                THEN #GP(selector); FI;
          IF return code segment descriptor has L-bit = 1 and D-bit = 1
                THEN #GP(selector); FI;
          IF return code segment selector RPL < CPL or (CR4.FRED = 1 and return code segment selector RPL > CPL)
                THEN #GP(selector); FI;
          IF return code segment descriptor is conforming and return code segment DPL > return code segment selector RPL
                THEN #GP(selector); FI;

        IF return code segment descriptor is non-conforming and return code segment DPL  return code segment selector RPL

                THEN #GP(selector); FI;
          IF CR4.FRED = 1 and CPL = 0 and L-bit is 0 in return code segment descriptor


                THEN #GP(selector); FI;
          IF return code segment descriptor is not present

                THEN #NP(selector); FI:
          IF return code segment selector RPL > CPL

                THEN GOTO IA-32E-MODE-RETURN-TO-OUTER-PRIVILEGE-LEVEL;
                ELSE GOTO IA-32E-MODE-RETURN-TO-SAME-PRIVILEGE-LEVEL;
          FI;
    FI;

IA-32E-MODE-RETURN-TO-SAME-PRIVILEGE-LEVEL:
IF the return instruction pointer is not within the return code segment limit

    THEN #GP(0); FI;
IF the return instruction pointer is not within canonical address space

    THEN #GP(0); FI;
IF OperandSize = 32

    THEN
          EIP := Pop();
          CS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)

    ELSE
          IF OperandSize = 16
                THEN
                       EIP := Pop();
                       EIP := EIP AND 0000FFFFH;
                       CS := Pop(); (* 16-bit pop *)
               ELSE (* OperandSize = 64 *)
                       RIP := Pop();
                       CS := Pop(); (* 64-bit pop, high-order 48 bits discarded *)
          FI;

FI;
IF instruction has immediate operand

    THEN (* Release parameters from stack *)
         IF StackAddressSize = 32
                THEN
                       ESP := ESP + SRC;
                ELSE
                       IF StackAddressSize = 16
                             THEN
                                   SP := SP + SRC;
                          ELSE (* StackAddressSize = 64 *)
                                   RSP := RSP + SRC;
                       FI;
          FI;

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
    IF CSBASE + RIP != tempSsLIP (* 64 bit compare *)


          THEN #CP(FAR-RET/IRET); FI;
    IF tempSSP AND 0x3 != 0 (* check if aligned to 4 bytes *)

          THEN #CP(FAR-RET/IRET); FI;
    IF (CS.L = 0 AND tempSSP[63:32] != 0) OR

        (CS.L = 1 AND tempSSP is not canonical relative to the current paging mode)
          THEN #GP(0); FI;

    SSP := tempSSP
FI;

IA-32E-MODE-RETURN-TO-OUTER-PRIVILEGE-LEVEL:
IF top (16 + SRC) bytes of stack are not within stack limits (OperandSize = 32)
or top (8 + SRC) bytes of stack are not within stack limits (OperandSize = 16)

    THEN #SS(0); FI;
IF top (16 + SRC) bytes of stack are not in canonical address space (OperandSize =32)
or top (8 + SRC) bytes of stack are not in canonical address space (OperandSize = 16)
or top (32 + SRC) bytes of stack are not in canonical address space (OperandSize = 64)

    THEN #SS(0); FI;
Read return stack segment selector;
IF stack segment selector is NULL

    THEN
          IF new CS descriptor L-bit = 0
                THEN #GP(selector);
          IF stack segment selector RPL = 3
                THEN #GP(selector);

FI;
IF return stack segment descriptor is not within descriptor table limits

          THEN #GP(selector); FI;
IF return stack segment descriptor is in non-canonical address space

          THEN #GP(selector); FI;
Read segment descriptor pointed to by return segment selector;
IF stack segment selector RPL  RPL of the return code segment selector
or stack segment is not a writable data segment
or stack segment descriptor DPL  RPL of the return code segment selector

    THEN #GP(selector); FI;
IF stack segment not present

    THEN #SS(StackSegmentSelector); FI;
IF the return instruction pointer is not within the return code segment limit

    THEN #GP(0); FI:
IF the return instruction pointer is not within canonical address space

    THEN #GP(0); FI;
IF OperandSize = 32

    THEN
          EIP := Pop();
          CS := Pop(); (* 32-bit pop, high-order 16 bits discarded, segment descriptor loaded *)
          CS(RPL) := ReturnCodeSegmentSelector(RPL);
          IF instruction has immediate operand
                THEN (* Release parameters from called procedure's stack *)
                    IF StackAddressSize = 32
                             THEN
                                   ESP := ESP + SRC;
                             ELSE
                                   IF StackAddressSize = 16
                                         THEN
                                               SP := SP + SRC;


                                     ELSE (* StackAddressSize = 64 *)
                                               RSP := RSP + SRC;

                                   FI;
                       FI;
          FI;
          tempESP := Pop();
          tempSS := Pop(); (* 32-bit pop, high-order 16 bits discarded, segment descriptor loaded *)
    ELSE
          IF OperandSize = 16
                THEN
                       EIP := Pop();
                       EIP := EIP AND 0000FFFFH;
                       CS := Pop(); (* 16-bit pop; segment descriptor loaded *)
                       CS(RPL) := ReturnCodeSegmentSelector(RPL);
                       IF instruction has immediate operand

                             THEN (* Release parameters from called procedure's stack *)
                               IF StackAddressSize = 32
                                         THEN
                                               ESP := ESP + SRC;
                                         ELSE
                                               IF StackAddressSize = 16
                                                     THEN
                                                           SP := SP + SRC;
                                                ELSE (* StackAddressSize = 64 *)
                                                           RSP := RSP + SRC;
                                               FI;
                                   FI;

                       FI;
                       tempESP := Pop();
                       tempSS := Pop(); (* 16-bit pop; segment descriptor loaded *)
               ELSE (* OperandSize = 64 *)
                       RIP := Pop();
                       CS := Pop(); (* 64-bit pop; high-order 48 bits discarded; seg. descriptor loaded *)
                       CS(RPL) := ReturnCodeSegmentSelector(RPL);
                       IF instruction has immediate operand

                             THEN (* Release parameters from called procedure's stack *)
                                   RSP := RSP + SRC;

                       FI;
                       tempESP := Pop();
                       tempSS := Pop(); (* 64-bit pop; high-order 48 bits discarded; seg. desc. loaded *)
          FI;
FI;

IF ShadowStackEnabled(CPL)
    (* check if 8 byte aligned *)
    IF SSP AND 0x7 != 0
          THEN #CP(FAR-RET/IRET); FI;
    IF ReturnCodeSegmentSelector(RPL) !=3
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

          IF CSBASE + RIP != tempSsLIP

                 THEN #CP(FAR-RET/IRET); FI;

          (* check if 4 byte aligned *)

          IF tempSSP AND 0x3 != 0

                 THEN #CP(FAR-RET/IRET); FI;

     FI;

FI;

tempOldCPL = CPL;

CPL := ReturnCodeSegmentSelector(RPL);

ESP := tempESP;

SS := tempSS;

tempOldSSP = SSP;

IF ShadowStackEnabled(CPL)

     IF CPL = 3

          THEN tempSSP := IA32_PL3_SSP; FI;

     IF (CS.L = 0 AND tempSSP[63:32] != 0) OR

          (CS.L = 1 AND tempSSP is not canonical relative to the current paging mode)

          THEN #GP(0); FI;

     SSP := tempSSP

FI;

(* Now past all faulting points; safe to free the token. The token free is done using the old SSP

* and using a supervisor override as old CPL was a supervisor privilege level *)

IF ShadowStackEnabled(tempOldCPL)

     expected_token_value = tempOldSSP | BUSY_BIT   (* busy bit - bit position 0 - must be set *)

     new_token_value = tempOldSSP                   (* clear the busy bit *)

     shadow_stack_lock_cmpxchg8b(tempOldSSP, new_token_value, expected_token_value)

FI;

FOR each of segment register (ES, FS, GS, and DS)
    DO
          IF segment register points to data or non-conforming code segment
          and CPL > segment descriptor DPL; (* DPL in hidden part of segment register *)
                THEN SegmentSelector := 0; (* SegmentSelector invalid *)
          FI;
    OD;

IF instruction has immediate operand
    THEN (* Release parameters from calling procedure's stack *)
         IF StackAddressSize = 32
                THEN
                      ESP := ESP + SRC;
                ELSE
                      IF StackAddressSize = 16
                            THEN
                                  SP := SP + SRC;
                          ELSE (* StackAddressSize = 64 *)
                                  RSP := RSP + SRC;
                      FI;
          FI;

FI;
```

## 受影响的旗帜

None.

## 说明

以 imm8 指定的计数值旋转 源操作数 的位数,而不影响算术旗帜。 结果写给目标操作数. 此指令不支持真实模式和 虚拟 8086 模式 。 操作数大小如果不是64位模式,总是32位. 在64位模式操作数大小 64中需要VEX.W1. VEX.W1在非64位模式中被忽略. 试图用不等于0的 VEX.L 执行此指令将导致 #UD.

## 行动

```text
IF (OperandSize = 32)

    y := imm8 AND 1FH;
    DEST := (SRC >> y) | (SRC << (32-y));
ELSEIF (OperandSize = 64)
    y := imm8 AND 3FH;
    DEST := (SRC >> y) | (SRC << (64-y));
FI;
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

参见表2-29"十三类例外条件".

RORX - 旋转右逻辑而不影响旗帜
