---
summary: 调用中断程序
---

## 说明

INT n 指令生成对用 目标操作数 指定的中断或例外处理器的调用(参见Intel(R)64第6章和IA-32架构软件开发者手册第1卷中题为"中断和例外"的章节). 目标操作数指定了0到255的矢量,编码为8位无符号中间值. 每个矢量都提供IDT中一个闸门描述符的索引. 前32个矢量被英特尔保留给系统使用. 其中一些矢量用于内部产生的例外。

当使用 IDT 事件交付时,矢量为 IDT 中的一个门描述符提供了索引. 前32个矢量被英特尔保留给系统使用. 其中一些矢量用于内部产生的例外。 当使用 FRED 事件交付时,矢量会被保存在事件处理器的堆栈上.

INT n 指令是执行软件生成给中断处理器的调用的一般mnemonic. INTO指令是用于调用溢出例外(#OF),例外4. 溢出中断检查 EFLAGS 登记册中的 OF 旗,如果 OF 旗设为 1 ,则调用溢出中断处理器。 (INTO指令不能以64位模式使用.

INT3指令使用单字节的操作码(CC),意在调用调试例外处理器,同时使用断点例外(#BP). (这个单字节形式是有用的,因为它可以取代任何想要一个断点的指令的第一个字节,包括其它单字节指令,而不覆盖其他指令. )

INT1指令还采用了单字节的操作码(F1),并生成一个调试例外(#DB),而不在DR6.1硬件供应商中设置任何位点,可以使用INT1指令进行硬件调试. 为此,英特尔推荐软件供应商将INT3指令用于软件断点.

INTO, INT3, 或 INT1 指令产生的中断, 与 INT n 产生的中断不同 :

* 正常的IOPL检查不发生于虚拟 8086 模式. (无过失)中断使用 IOPL

value.

* 虚拟 8086 模式扩展所允许的中断重定向(VME)不发生. 打断一下

总是由保护模式处理者处理。

* FRED事件交付使用事件类型4(软件中断)用于INT n但使用事件类型5(特权软件)

例外)用于INT1和事件类型6(软件例外)用于INT3和INTO.

(这些特征分别与CD01,CD03,或CD04,INT 1,INT 3和INT 4的"正常"2字节操作码无关. 英特尔和微软组装器不会从任何mnemonic生成CD03 操作码,但这种操作码可以通过直接的数码定义或自行修改代码生成. )

这些指令的操作和使用在很大程度上取决于FRED过渡是否通过设置CR4.FRED而启用. 如果 CR4.FRED = 0,则使用 IDT 事件交付;否则,使用 FRED 事件交付. 以下各节按所示适用。

1. 联合国 Mnemonic ICEBP也被用于使用操作码 F1.

用 IDT 事件交付

随着IDT事件交付,INT n指令(包括INTO,INT3,和INT1指令)的动作与用CALL指令发出的远征类似. 主要区别在于,用 INT n 指令,EFLAGS 寄存器在返回地址之前被推到堆栈上. (返回地址是包含CS和EIP登记册当前值的远地址. )中断程序的返回由IRET指令处理,该指令将EFLAGS信息和返回地址从堆栈中弹出.

INT n,INTO,和INT3指令中,如果CPL大于IDT中选定门标中的DPL值,则每个指令产生一般保护例外(#GP). 相比之下,INT1指令即使CPL大于IDT中描述符1的DPL,也可以提供#DB. (这种行为支持硬件供应商使用INT1进行硬件调试.

矢量在中断描述表(IDT)中指定一个中断描述符;即提供进入IDT的索引. 选中的中断描述符又包含一个指向中断或例外处理程序的指针. 在保护模式中,IDT包含一个由8字节描述符组成的阵列,每个阵列都是中断门,陷阱门,或任务门. 在实地址模式中,IDT是一个由4字节远指向的阵列(2-字节代码段选择子和一个2字节的指令指针),每个阵列都直接指向所选段的一个程序. (注意在实地址模式中,IDT称为中断矢量表,其指针称为中断矢量. )

以下决定表表明,鉴于表上部分的条件,表下部分将采取何种行动。 决策表下一节中的每个Y代表本指令的"操作"部分(#GP除外)中定义的程序.

** 决定表**

| PE | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| VM |  |  |  |  | 0 | 1 | 1 |  |
| IOPL |  |  |  |  |  | <3 | =3 |  |

## 行动

```text
The following operational description applies not only to the INT n, INTO, INT3, or INT1 instructions, but also to the
delivery of external interrupts, nonmaskable interrupts (NMIs), and exceptions. Some of these events push onto
the stack an error code.

The operational description specifies numerous checks whose failure may result in delivery of a nested exception.
In these cases, the original event is not delivered.

The operational description specifies the error code delivered by any nested exception. In some cases, the error
code is specified with a pseudofunction error_code(num,idt,ext), where idt and ext are bit values. The pseudofunc-
tion produces an error code as follows: (1) if idt is 0, the error code is (num & FCH) | ext; (2) if idt is 1, the error
code is (num << 3) | 2 | ext.

In many cases, the pseudofunction error_code is invoked with a pseudovariable EXT. The value of EXT depends on
the nature of the event whose delivery encountered a nested exception: if that event is a software interrupt (INT n,
INT3, or INTO), EXT is 0; otherwise (including INT1), EXT is 1.

IF PE = 0

    THEN
          GOTO REAL-ADDRESS-MODE;

   ELSE (* PE = 1 *)
        IF (EFLAGS.VM = 1 AND CR4.VME = 0 AND IOPL < 3 AND INT n)

                THEN
                       #GP(0); (* Bit 0 of error code is 0 because INT n *)

                ELSE
                      IF (EFLAGS.VM = 1 AND CR4.VME = 1 AND INT n)
                            THEN
                                  Consult bit n of the software interrupt redirection bit map in the TSS;
                                  IF bit n is clear
                                        THEN (* redirect interrupt to 8086 program interrupt handler *)
                                              Push EFLAGS[15:0]; (* if IOPL < 3, save VIF in IF position and save IOPL position as 3 *)
                                              Push CS;
                                              Push IP;
                                              IF IOPL = 3


                                                     THEN IF := 0; (* Clear interrupt flag *)
                                                     ELSE VIF := 0; (* Clear virtual interrupt flag *)
                                              FI;
                                              TF := 0; (* Clear trap flag *)
                                              load CS and EIP (lower 16 bits only) from entry n in interrupt vector table referenced from TSS;
                                        ELSE
                                              IF IOPL = 3
                                                     THEN GOTO PROTECTED-MODE;
                                                     ELSE #GP(0); (* Bit 0 of error code is 0 because INT n *)
                                              FI;
                                  FI;
                            ELSE (* Protected mode, IA-32e mode, or virtual-8086 mode interrupt *)

                            IF (IA32_EFER.LMA = 0)

                                        THEN (* Protected mode, or virtual-8086 mode interrupt *)
                                              GOTO PROTECTED-MODE;

                                        ELSE (* IA-32e mode interrupt *)
                                        GOTO IA-32e-MODE;
                                  FI;
                      FI;
          FI;
FI;
REAL-ADDRESS-MODE:
    IF ((vector_number << 2) + 3) is not within IDT limit
          THEN #GP; FI;
    IF stack not large enough for a 6-byte return information
          THEN #SS; FI;
    Push (EFLAGS[15:0]);
    IF := 0; (* Clear interrupt flag *)
    TF := 0; (* Clear trap flag *)
    AC := 0; (* Clear AC flag *)
    Push(CS);
    Push(IP);
    (* No error codes are pushed in real-address mode*)
    CS := IDT(Descriptor (vector_number << 2), selector));
    EIP := IDT(Descriptor (vector_number << 2), offset)); (* 16 bit offset AND 0000FFFFH *)
END;

PROTECTED-MODE:
    IF ((vector_number << 3) + 7) is not within IDT limits
    or selected IDT descriptor is not an interrupt-, trap-, or task-gate type
          THEN #GP(error_code(vector_number,1,EXT)); FI;
          (* idt operand to error_code set because vector is used *)
    IF software interrupt (* Generated by INT n, INT3, or INTO; does not apply to INT1 *)
          THEN
                IF gate DPL < CPL (* PE = 1, DPL < CPL, software interrupt *)
                      THEN #GP(error_code(vector_number,1,0)); FI;
                      (* idt operand to error_code set because vector is used *)
                      (* ext operand to error_code is 0 because INT n, INT3, or INTO*)
    FI;
    IF gate not present
          THEN #NP(error_code(vector_number,1,EXT)); FI;
          (* idt operand to error_code set because vector is used *)
    IF task gate (* Specified in the selected interrupt table descriptor *)
          THEN GOTO TASK-GATE;


          ELSE GOTO TRAP-OR-INTERRUPT-GATE; (* PE = 1, trap/interrupt gate *)
    FI;
END;

IA-32e-MODE:
    IF INTO and CS.L = 1 (64-bit mode)
          THEN #UD;
    FI;
    IF CR4.FRED = 0
          THEN
                IF ((vector_number << 4) + 15) is not in IDT limits
                or selected IDT descriptor is not an interrupt-, or trap-gate type
                       THEN #GP(error_code(vector_number,1,EXT));
                       (* idt operand to error_code set because vector is used *)
                FI;
                IF software interrupt (* Generated by INT n, INT3, or INTO; does not apply to INT1 *)
                       THEN
                             IF gate DPL < CPL (* PE = 1, DPL < CPL, software interrupt *)
                                   THEN #GP(error_code(vector_number,1,0));
                                   (* idt operand to error_code set because vector is used *)
                                   (* ext operand to error_code is 0 because INT n, INT3, or INTO*)
                             FI;
                FI;
                IF gate not present
                       THEN #NP(error_code(vector_number,1,EXT));
                       (* idt operand to error_code set because vector is used *)
                FI;
                GOTO TRAP-OR-INTERRUPT-GATE; (* Trap/interrupt gate *)
          ELSE (* CR4.FRED = 1 *)
                FRED event delivery of software interrupt, exception, hardware interrupt, or non-maskable interrupt;

END;

TASK-GATE: (* PE = 1, task gate *)
    Read TSS selector in task gate (IDT descriptor);
          IF local/global bit is set to local or index not within GDT limits
                THEN #GP(error_code(TSS selector,0,EXT)); FI;
                (* idt operand to error_code is 0 because selector is used *)
          Access TSS descriptor in GDT;
          IF TSS descriptor specifies that the TSS is busy (low-order 5 bits set to 00001)
                THEN #GP(error_code(TSS selector,0,EXT)); FI;
                (* idt operand to error_code is 0 because selector is used *)
          IF TSS not present
                THEN #NP(error_code(TSS selector,0,EXT)); FI;
                (* idt operand to error_code is 0 because selector is used *)
    SWITCH-TASKS (with nesting) to TSS;
    IF interrupt caused by fault with error code
          THEN
                IF stack limit does not allow push of error code
                       THEN #SS(EXT); FI;
                Push(error code);
    FI;
    IF EIP not within code segment limit
          THEN #GP(EXT); FI;

END;


TRAP-OR-INTERRUPT-GATE:
    Read new code-segment selector for trap or interrupt gate (IDT descriptor);
    IF new code-segment selector is NULL
          THEN #GP(EXT); FI; (* Error code contains NULL selector *)
    IF new code-segment selector is not within its descriptor table limits
          THEN #GP(error_code(new code-segment selector,0,EXT)); FI;
          (* idt operand to error_code is 0 because selector is used *)
    Read descriptor referenced by new code-segment selector;
    IF descriptor does not indicate a code segment or new code-segment DPL > CPL
          THEN #GP(error_code(new code-segment selector,0,EXT)); FI;
          (* idt operand to error_code is 0 because selector is used *)
    IF new code-segment descriptor is not present,
          THEN #NP(error_code(new code-segment selector,0,EXT)); FI;
          (* idt operand to error_code is 0 because selector is used *)
    IF new code segment is non-conforming with DPL < CPL
          THEN
                IF VM = 0
                       THEN
                             GOTO INTER-PRIVILEGE-LEVEL-INTERRUPT;
                             (* PE = 1, VM = 0, interrupt or trap gate, nonconforming code segment,
                             DPL < CPL *)
                       ELSE (* VM = 1 *)

                       IF new code-segment DPL  0

                                   THEN #GP(error_code(new code-segment selector,0,EXT));
                                   (* idt operand to error_code is 0 because selector is used *)
                             GOTO INTERRUPT-FROM-VIRTUAL-8086-MODE; FI;
                             (* PE = 1, interrupt or trap gate, DPL < CPL, VM = 1 *)
                FI;
          ELSE (* PE = 1, interrupt or trap gate, DPL  CPL *)
                IF VM = 1
                       THEN #GP(error_code(new code-segment selector,0,EXT));
                       (* idt operand to error_code is 0 because selector is used *)
                IF new code segment is conforming or new code-segment DPL = CPL
                       THEN
                             GOTO INTRA-PRIVILEGE-LEVEL-INTERRUPT;
                       ELSE (* PE = 1, interrupt or trap gate, nonconforming code segment, DPL > CPL *)
                             #GP(error_code(new code-segment selector,0,EXT));
                             (* idt operand to error_code is 0 because selector is used *)
                FI;
    FI;
END;

INTER-PRIVILEGE-LEVEL-INTERRUPT:
    (* PE = 1, interrupt or trap gate, non-conforming code segment, DPL < CPL *)
    IF (IA32_EFER.LMA = 0) (* Not IA-32e mode *)
          THEN
          (* Identify stack-segment selector for new privilege level in current TSS *)
                IF current TSS is 32-bit
                       THEN
                             TSSstackAddress := (new code-segment DPL << 3) + 4;
                             IF (TSSstackAddress + 5) > current TSS limit
                                   THEN #TS(error_code(current TSS selector,0,EXT)); FI;
                                   (* idt operand to error_code is 0 because selector is used *)


                             NewSS := 2 bytes loaded from (TSS base + TSSstackAddress + 4);
                             NewESP := 4 bytes loaded from (TSS base + TSSstackAddress);
                       ELSE (* current TSS is 16-bit *)
                             TSSstackAddress := (new code-segment DPL << 2) + 2
                             IF (TSSstackAddress + 3) > current TSS limit

                                   THEN #TS(error_code(current TSS selector,0,EXT)); FI;
                                   (* idt operand to error_code is 0 because selector is used *)
                             NewSS := 2 bytes loaded from (TSS base + TSSstackAddress + 2);
                             NewESP := 2 bytes loaded from (TSS base + TSSstackAddress);
                FI;
                IF NewSS is NULL
                       THEN #TS(EXT); FI;
                IF NewSS index is not within its descriptor-table limits

             or NewSS RPL  new code-segment DPL

                       THEN #TS(error_code(NewSS,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)
                Read new stack-segment descriptor for NewSS in GDT or LDT;

             IF new stack-segment DPL  new code-segment DPL

                or new stack-segment Type does not indicate writable data segment
                       THEN #TS(error_code(NewSS,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)

                IF NewSS is not present
                       THEN #SS(error_code(NewSS,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)
                       NewSSP := IA32_PLi_SSP (* where i = new code-segment DPL *)

          ELSE (* IA-32e mode *)
                IF IDT-gate IST = 0
                       THEN TSSstackAddress := (new code-segment DPL << 3) + 4;
                       ELSE TSSstackAddress := (IDT gate IST << 3) + 28;
                FI;
                IF (TSSstackAddress + 7) > current TSS limit
                       THEN #TS(error_code(current TSS selector,0,EXT); FI;
                       (* idt operand to error_code is 0 because selector is used *)
                NewRSP := 8 bytes loaded from (current TSS base + TSSstackAddress);
                NewSS := new code-segment DPL; (* NULL selector with RPL = new CPL *)
                IF IDT-gate IST = 0
                       THEN
                             NewSSP := IA32_PLi_SSP (* where i = new code-segment DPL *)
                       ELSE
                             NewSSPAddress = IA32_INTERRUPT_SSP_TABLE_ADDR + (IDT-gate IST << 3)
                             (* Check if shadow stacks are enabled at CPL 0 *)
                             IF ShadowStackEnabled(CPL 0)
                                   THEN NewSSP := 8 bytes loaded from NewSSPAddress; FI;
                FI;

    FI;
    IF IDT gate is 32-bit

                THEN
                       IF new stack does not have room for 24 bytes (error code pushed)
                       or 20 bytes (no error code pushed)
                             THEN #SS(error_code(NewSS,0,EXT)); FI;
                             (* idt operand to error_code is 0 because selector is used *)

                FI
          ELSE

                IF IDT gate is 16-bit


                       THEN
                             IF new stack does not have room for 12 bytes (error code pushed)
                             or 10 bytes (no error code pushed);
                                   THEN #SS(error_code(NewSS,0,EXT)); FI;
                                   (* idt operand to error_code is 0 because selector is used *)

                ELSE (* 64-bit IDT gate*)
                       IF StackAddress is non-canonical
                             THEN #SS(EXT); FI; (* Error code contains NULL selector *)

          FI;
    FI;
    IF (IA32_EFER.LMA = 0) (* Not IA-32e mode *)

          THEN
                IF instruction pointer from IDT gate is not within new code-segment limits
                       THEN #GP(EXT); FI; (* Error code contains NULL selector *)
                ESP := NewESP;
                SS := NewSS; (* Segment descriptor information also loaded *)

          ELSE (* IA-32e mode *)
                IF instruction pointer from IDT gate contains a non-canonical address
                       THEN #GP(EXT); FI; (* Error code contains NULL selector *)
                RSP := NewRSP & FFFFFFFFFFFFFFF0H;
                SS := NewSS;

    FI;
    IF IDT gate is 32-bit

          THEN
                CS:EIP := Gate(CS:EIP); (* Segment descriptor information also loaded *)

          ELSE
                IF IDT gate 16-bit
                       THEN
                             CS:IP := Gate(CS:IP);
                             (* Segment descriptor information also loaded *)
                       ELSE (* 64-bit IDT gate *)
                             CS:RIP := Gate(CS:RIP);
                             (* Segment descriptor information also loaded *)
                FI;

    FI;
    IF IDT gate is 32-bit

                THEN
                       Push(far pointer to old stack);
                       (* Old SS and ESP, 3 words padded to 4 *)
                       Push(EFLAGS);
                       Push(far pointer to return instruction);
                       (* Old CS and EIP, 3 words padded to 4 *)
                       Push(ErrorCode); (* If needed, 4 bytes *)

                ELSE
                       IF IDT gate 16-bit
                             THEN
                                   Push(far pointer to old stack);
                                   (* Old SS and SP, 2 words *)
                                   Push(EFLAGS(15:0]);
                                   Push(far pointer to return instruction);
                                   (* Old CS and IP, 2 words *)
                                   Push(ErrorCode); (* If needed, 2 bytes *)
                             ELSE (* 64-bit IDT gate *)
                                   Push(far pointer to old stack);


                          (* Old SS and SP, each an 8-byte push *)

                          Push(RFLAGS); (* 8-byte push *)

                          Push(far pointer to return instruction);

                          (* Old CS and RIP, each an 8-byte push *)

                          Push(ErrorCode); (* If needed, 8-bytes *)

           FI;

FI;

IF ShadowStackEnabled(CPL) AND CPL = 3

      THEN

           IF IA32_EFER.LMA = 0

                THEN IA32_PL3_SSP := SSP;

                ELSE (* adjust so bits 63:N get the value of bit N1, where N is the CPU's maximum linear-address width *)

                     IA32_PL3_SSP := LA_adjust(SSP);

           FI;

FI;

CPL := new code-segment DPL;

CS(RPL) := CPL;

IF ShadowStackEnabled(CPL)

      oldSSP := SSP

      SSP := NewSSP

      IF SSP & 0x07 != 0

           THEN #GP(0); FI;

      (* Token and CS:LIP:oldSSP pushed on shadow stack must be contained in a naturally aligned 32-byte region *)

      IF (SSP & ~0x1F) != ((SSP  24) & ~0x1F)

           #GP(0); FI;

      IF ((IA32_EFER.LMA and CS.L) = 0 AND SSP[63:32] != 0)

           THEN #GP(0); FI;

      expected_token_value = SSP                   (* busy bit - bit position 0 - must be clear *)

      new_token_value = SSP | BUSY_BIT             (* Set the busy bit *)

      IF shadow_stack_lock_cmpxchg8b(SSP, new_token_value, expected_token_value) != expected_token_value

           THEN #GP(0); FI;

      IF oldSS.DPL != 3

           ShadowStackPush8B(oldCS); (* Padded with 48 high-order bits of 0 *)

           ShadowStackPush8B(oldCSBASE + oldRIP); (* Padded with 32 high-order bits of 0 for 32 bit LIP*)

           ShadowStackPush8B(oldSSP);

      FI;

FI;

IF EndbranchEnabled (CPL)

      IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH;

      IA32_S_CET.SUPPRESS = 0

FI;

IF IDT gate is interrupt gate

      THEN IF := 0 (* Interrupt flag set to 0, interrupts disabled *); FI;

TF := 0;

VM := 0;

RF := 0;

NT := 0;

END;

INTERRUPT-FROM-VIRTUAL-8086-MODE:
    (* Identify stack-segment selector for privilege level 0 in current TSS *)
    IF current TSS is 32-bit
          THEN
                IF TSS limit < 9


                       THEN #TS(error_code(current TSS selector,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)
                NewSS := 2 bytes loaded from (current TSS base + 8);
                NewESP := 4 bytes loaded from (current TSS base + 4);
          ELSE (* current TSS is 16-bit *)
                IF TSS limit < 5
                       THEN #TS(error_code(current TSS selector,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)
                NewSS := 2 bytes loaded from (current TSS base + 4);
                NewESP := 2 bytes loaded from (current TSS base + 2);
    FI;
    IF NewSS is NULL
          THEN #TS(EXT); FI; (* Error code contains NULL selector *)
    IF NewSS index is not within its descriptor table limits

   or NewSS RPL  0

          THEN #TS(error_code(NewSS,0,EXT)); FI;
          (* idt operand to error_code is 0 because selector is used *)
    Read new stack-segment descriptor for NewSS in GDT or LDT;

   IF new stack-segment DPL  0 or stack segment does not indicate writable data segment

          THEN #TS(error_code(NewSS,0,EXT)); FI;
          (* idt operand to error_code is 0 because selector is used *)
    IF new stack segment not present
          THEN #SS(error_code(NewSS,0,EXT)); FI;
          (* idt operand to error_code is 0 because selector is used *)
    NewSSP := IA32_PL0_SSP (* the new code-segment DPL must be 0 *)
    IF IDT gate is 32-bit
          THEN

                IF new stack does not have room for 40 bytes (error code pushed)
                or 36 bytes (no error code pushed)

                       THEN #SS(error_code(NewSS,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)
          ELSE (* IDT gate is 16-bit)
                IF new stack does not have room for 20 bytes (error code pushed)
                or 18 bytes (no error code pushed)
                       THEN #SS(error_code(NewSS,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)
    FI;
    IF instruction pointer from IDT gate is not within new code-segment limits
          THEN #GP(EXT); FI; (* Error code contains NULL selector *)
    tempEFLAGS := EFLAGS;
    VM := 0;
    TF := 0;
    RF := 0;
    NT := 0;
    IF service through interrupt gate
          THEN IF = 0; FI;
    TempSS := SS;
    TempESP := ESP;
    SS := NewSS;
    ESP := NewESP;
    (* Following pushes are 16 bits for 16-bit IDT gates and 32 bits for 32-bit IDT gates;
    Segment selector pushes in 32-bit mode are padded to two words *)
    Push(GS);
    Push(FS);


    Push(DS);
    Push(ES);
    Push(TempSS);
    Push(TempESP);
    Push(TempEFlags);
    Push(CS);
    Push(EIP);
    GS := 0; (* Segment registers made NULL, invalid for use in protected mode *)
    FS := 0;
    DS := 0;
    ES := 0;
    CS := Gate(CS); (* Segment descriptor information also loaded *)
    CS(RPL) := 0;
    CPL := 0;
    IF IDT gate is 32-bit

          THEN
                EIP := Gate(instruction pointer);

          ELSE (* IDT gate is 16-bit *)
                EIP := Gate(instruction pointer) AND 0000FFFFH;

    FI;
    IF ShadowStackEnabled(0)

          oldSSP := SSP
          SSP := NewSSP
          IF SSP & 0x07 != 0

                THEN #GP(0); FI;
          (* Token and CS:LIP:oldSSP pushed on shadow stack must be contained in a naturally aligned 32-byte region *)

        IF (SSP & ~0x1F) != ((SSP  24) & ~0x1F)

                #GP(0); FI;
    IF ((IA32_EFER.LMA and CS.L) = 0 AND SSP[63:32] != 0)

          THEN #GP(0); FI;
    expected_token_value = SSP (* busy bit - bit position 0 - must be clear *)
    new_token_value = SSP | BUSY_BIT (* Set the busy bit *)
    IF shadow_stack_lock_cmpxchg8b(SSP, new_token_value, expected_token_value) != expected_token_value

          THEN #GP(0); FI;
    FI;
    IF EndbranchEnabled (CPL)

          IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH;
          IA32_S_CET.SUPPRESS = 0
    FI;
(* Start execution of new routine in Protected Mode *)
END;

INTRA-PRIVILEGE-LEVEL-INTERRUPT:
    NewSSP = SSP;
    CHECK_SS_TOKEN = 0
    (* PE = 1, DPL = CPL or conforming segment *)
    IF IA32_EFER.LMA = 1 (* IA-32e mode *)
          IF IDT-descriptor IST  0
                THEN
                      TSSstackAddress := (IDT-descriptor IST << 3) + 28;
                      IF (TSSstackAddress + 7) > TSS limit
                            THEN #TS(error_code(current TSS selector,0,EXT)); FI;
                            (* idt operand to error_code is 0 because selector is used *)
                      NewRSP := 8 bytes loaded from (current TSS base + TSSstackAddress);


                ELSE NewRSP := RSP;
          FI;
          IF IDT-descriptor IST  0

                IF ShadowStackEnabled(CPL)
                       THEN
                             NewSSPAddress = IA32_INTERRUPT_SSP_TABLE_ADDR + (IDT gate IST << 3)
                             NewSSP := 8 bytes loaded from NewSSPAddress
                             CHECK_SS_TOKEN = 1

                FI;
          FI;
    FI;
    IF 32-bit gate (* implies IA32_EFER.LMA = 0 *)
          THEN

                IF current stack does not have room for 16 bytes (error code pushed)
                or 12 bytes (no error code pushed)

                       THEN #SS(EXT); FI; (* Error code contains NULL selector *)
          ELSE IF 16-bit gate (* implies IA32_EFER.LMA = 0 *)

                IF current stack does not have room for 8 bytes (error code pushed)
                or 6 bytes (no error code pushed)

                       THEN #SS(EXT); FI; (* Error code contains NULL selector *)
          ELSE (* IA32_EFER.LMA = 1, 64-bit gate*)

                       IF NewRSP contains a non-canonical address
                             THEN #SS(EXT); (* Error code contains NULL selector *)

          FI;
    FI;
    IF (IA32_EFER.LMA = 0) (* Not IA-32e mode *)

          THEN
                IF instruction pointer from IDT gate is not within new code-segment limit
                       THEN #GP(EXT); FI; (* Error code contains NULL selector *)

          ELSE
                IF instruction pointer from IDT gate contains a non-canonical address
                       THEN #GP(EXT); FI; (* Error code contains NULL selector *)
                RSP := NewRSP & FFFFFFFFFFFFFFF0H;

    FI;
    IF IDT gate is 32-bit (* implies IA32_EFER.LMA = 0 *)

          THEN
                Push (EFLAGS);
                Push (far pointer to return instruction); (* 3 words padded to 4 *)
                CS:EIP := Gate(CS:EIP); (* Segment descriptor information also loaded *)
                Push (ErrorCode); (* If any *)

          ELSE
                IF IDT gate is 16-bit (* implies IA32_EFER.LMA = 0 *)
                       THEN
                             Push (FLAGS);
                             Push (far pointer to return location); (* 2 words *)
                             CS:IP := Gate(CS:IP);
                             (* Segment descriptor information also loaded *)
                             Push (ErrorCode); (* If any *)
                       ELSE (* IA32_EFER.LMA = 1, 64-bit gate*)
                             Push(far pointer to old stack);
                             (* Old SS and SP, each an 8-byte push *)
                             Push(RFLAGS); (* 8-byte push *)
                             Push(far pointer to return instruction);
                             (* Old CS and RIP, each an 8-byte push *)


                            Push(ErrorCode); (* If needed, 8 bytes *)
                            CS:RIP := GATE(CS:RIP);
                            (* Segment descriptor information also loaded *)
                FI;
    FI;
    CS(RPL) := CPL;
    IF ShadowStackEnabled(CPL)
          IF CHECK_SS_TOKEN == 1
                THEN
                      IF NewSSP & 0x07 != 0
                            THEN #GP(0); FI;
          (* Token and CS:LIP:oldSSP pushed on shadow stack must be contained in a naturally aligned 32-byte region *)

        IF (NewSSP & ~0x1F) != ((NewSSP  24) & ~0x1F)

                #GP(0); FI;

                      IF ((IA32_EFER.LMA and CS.L) = 0 AND NewSSP[63:32] != 0)
                            THEN #GP(0); FI;

                      expected_token_value = NewSSP (* busy bit - bit position 0 - must be clear *)
                      new_token_value = NewSSP | BUSY_BIT (* Set the busy bit *)
                      IF shadow_stack_lock_cmpxchg8b(NewSSP, new_token_value, expected_token_value) != expected_token_value

                            THEN #GP(0); FI;
          FI;
          (* Align to next 8 byte boundary *)
          tempSSP = SSP;

       Shadow_stack_store 4 bytes of 0 to (NewSSP - 4)

          SSP = newSSP & 0xFFFFFFFFFFFFFFF8H;
          (* push cs:lip:ssp on shadow stack *)
          ShadowStackPush8B(oldCS); (* Padded with 48 high-order bits of 0 *)
          ShadowStackPush8B(oldCSBASE + oldRIP); (* Padded with 32 high-order bits of 0 for 32 bit LIP*)
          ShadowStackPush8B(tempSSP);
    FI;
    IF EndbranchEnabled (CPL)
          IF CPL = 3

                THEN
                      IA32_U_CET.TRACKER = WAIT_FOR_ENDBRANCH
                      IA32_U_CET.SUPPRESS = 0

                ELSE
                      IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
                      IA32_S_CET.SUPPRESS = 0

          FI;
    FI;
    IF IDT gate is interrupt gate

          THEN IF := 0; FI; (* Interrupt flag set to 0; interrupts disabled *)
    TF := 0;
    NT := 0;
    VM := 0;
    RF := 0;
END;
```

## 受影响的旗帜

EFLAGS寄存器被推到堆栈上. 视具体情况,可清除IF、TF、NT、AC、RF和VM旗帜。

INT指令执行时处理器的操作模式(见"操作"部分)。 如果

中断使用任务门,任何旗帜都可以设置或清除,由EFLAGS新任务中的图像TSS.
