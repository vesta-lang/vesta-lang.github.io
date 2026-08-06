---
summary: 跳跃
---

## 说明

将程序控制传输到指令流中不同的点而不记录返回信息. 目的地( 目标) 操作数 指定被跳转到的指令地址 。 这个操作数可以是即时值,通用寄存器,也可以是内存位置.

此指令可用于执行四种不同类型的跳跃:

* 近跳- A 跳转到当前代码段内的指示( 当前由该代码段指向的段)

CS寄存器),有时简称为区内跳.

* 短跳-A 近跳,其中跳跃范围从目前的EIP值限制为128至+127. * 远跳 - A 跳到位于与当前代码段不同但位于

相同的特权级别,有时也被称为间隙跳跃.

* 任务切换 - A 跳转到位于不同任务中的指令 。

一个任务开关只能在保护模式中执行(参见第10章,Intel(R)64和IA-32架构软件开发者手册第3A卷,用于使用JMP指令执行任务开关的信息).

近与短跃. 当执行近跳时,处理器跳转到目标操作数指定的地址(在当前代码段内). 目标操作数指定了绝对抵消(即从代码段底部抵消)或相对抵消(与当前数字相对的签名移位)

EIP登记册中的指令指针值。 接近跳跃到相对偏移8位(rel8)被称为短跳. CS寄存器在近和短跳时不更改.

在通用寄存器或内存位置(r/m16或r/m32)中间接指定绝对偏移. 操作数大小属性决定目标操作数的大小(16或32位). 绝对偏移直接加载到 EIP 寄存器中. 如果 操作数 大小属性为 16,则EIP 寄存器的上两个字节被清除,导致 指令指针 最大大小为 16 比特.

相对偏移(rel8,rel16,或rel32)在组装代码中一般被指定为标签,但在机器代码级别上,它被编码为签名的8-,16-,或32位直接值. 此值被添加到 EIP 寄存器的值中 。 (此处,EIP注册簿包含JMP指令之后的指令地址). 在使用相对偏移时,操作码(对于短对近跳)和操作数大小属性(对于近相对跳)决定目标操作数的大小(8,16,或32位).

远跳在Real-Address或虚拟 8086 模式. 当在真地址或虚拟 8086 模式中执行一个远跳时,处理器会跳到代码段,并与目标操作数指定抵消. 在此,目标操作数指定绝对远地址,或者直接用指针(ptr16:16或ptr16:32),或者间接用内存位置(m16:16或m16:32). 采用指针法,在指令中编码了称为程序的段和地址,使用4字节(16位操作数大小)或6字节(32位操作数大小)的远近地址. 用间接方法,目标操作数指定一个内存位置,它包含一个4字节(16位操作数大小)或6字节(32位操作数大小)的远地址. 远方地址直接装入CS和EIP登记册. 如果 操作数 大小属性为 16,则EIP 寄存器的上两个字节将被清除.

保护模式中的远跳. 当处理器在 保护模式 中运行时, JMP 指令可用于执行以下三种类型的远跳:

* 远远跳到符合或不符合的代码段. * 从呼叫门跳到很远的地方 * 任务切换

(JMP 指令不能用于执行跨特权级远跳. )

在保护模式中,处理器总是使用远地址的段选择子部分来访问GDT或LDT中相应的描述符. 描述符类型(代码段,呼叫门,任务门,或TSS)和访问权限决定要执行的跳跃类型.

如果选中的描述符是用于代码段,则会执行一个在相同特权级别跳到代码段的远处. (如果选中的代码段处于不同的特权级别,并且代码段不符合规定,则生成一般保护例外. ) 保护模式中远跳到相同的特权级别与在真地址或虚拟 8086 模式中执行的高度相似. 目标操作数指定绝对远地址,或者直接用指针(ptr16:16或ptr16:32),或者间接用内存位置(m16:16或m16:32). 操作数大小属性决定了远地址中偏移(16或32位)的大小. 新的代码段选择子及其描述器被装入CS寄存器,指令的抵消被装入EIP寄存器. 请注意,调用闸门(在下段描述)也可以用于执行远程调用到同一特权级别的代码段. 使用这个机制提供了额外的间接级,也是在16位和32位代码段之间进行跳跃的首选方法.

在通过呼叫门执行远跳时,目标操作数指定的段选择子识别呼叫门. (目标操作数的偏移部分被忽略. )处理器然后跳到呼叫门描述符中指定的代码段,并在呼叫门中指定的偏移处开始执行指令. 没有堆栈开关发生 。 在这里,目标操作数也可以直接用指针(ptr16:16或ptr16:32)或间接用内存位置(m16:16或m16:32)指定呼叫门的远地址.

用 JMP 指令执行任务切换,与通过调用闸门执行跳跃有点相似. 在此,目标操作数指定任务门的段选择子用于切换任务(而目标操作数的抵消部分被忽略). 任务门依次指向任务TSS,它包含了任务代码和堆栈部分的段选择器. TSS中还包含了在任务中止前要执行的下一个指令的EIP值. 这个 指令指针 值被加载到 EIP 寄存器中, 以便任务在此下一个指令中重新开始执行 。

JMP指令也可以直接指定TSS的段选择子,这消除了任务门的间接性. 见Intel(R)64和IA-32 Architecture Software开发者手册第3A卷第10章,关于任务开关的力学的详细信息.

当执行一个 JMP 指令影响任务切换时,巢任务旗(NT)没有设置在 EFLAGS 寄存器中,新的 TSS 之前的任务链接字段没有装入旧任务中的 TSS 选择器. 因此,不能通过执行IRET指令来返回先前的任务。 使用 JMP 指令切换任务在这方面不同于 CALL 指令,该指令确实设置了 NT 旗并保存了上一个任务链接信息,允许使用 IRET 指令返回调用任务.

参见第6章"程序调用,中断,和例外"和第18章"控制流执行技术(CET)"在Intel(R)64和IA-32架构软件开发者手册第1卷,用于CET的细节.

在64比特模式。 指令的操作大小固定在64位. 如果选择者指向一个门,则RIP等于从门取出的64位移位;否则RIP等于从指令中引用的远指针中推算出的0位移位.

当FRED过渡被启用时,一个引用调用闸门的远 JMP的执行会导致一般保护例外,一个远 JMP的执行也会在CPL为0时进入兼容模式.

参见本节开头的汇总图,用于编码数据和限制.

指令令. 远跳之后的指示可能会在之前的指示完成执行之前从内存中获取,但是在远跳之前的所有指示完成执行之前,它们不会执行(甚至猜测)(后来的指示可能在执行之前,早期指示存储的数据已经在全球范围可见).

遵照近乎间接的JMP指令(即未达到目标的指令)依次执行的指令,可以推测. 如果软件需要防止(例如为了防止投机性执行侧通道),那么INT3或LFENCE指令操作码可以在近间接JMP之后放置,以阻止投机性执行.

## 行动

```text
IF near jump
    IF 64-bit Mode
          THEN
                IF near relative jump
                 THEN
                      tempRIP := RIP + DEST; (* RIP is instruction following JMP instruction*)
                 ELSE (* Near absolute jump *)
                      tempRIP := DEST;
                FI;
          ELSE
                IF near relative jump
                 THEN
                      tempEIP := EIP + DEST; (* EIP is instruction following JMP instruction*)
                 ELSE (* Near absolute jump *)
                      tempEIP := DEST;
                FI;
    FI;

   IF (IA32_EFER.LMA = 0 or target mode = Compatibility mode) and tempEIP outside code segment limit

          THEN #GP(0); FI
    IF 64-bit mode and tempRIP is not canonical

          THEN #GP(0);
    FI;

   IF OperandSize = 32

           THEN
                EIP := tempEIP;

           ELSE

             IF OperandSize = 16
                  THEN (* OperandSize = 16 *)

                            EIP := tempEIP AND 0000FFFFH;

                   ELSE (* OperandSize = 64)


                            RIP := tempRIP;
                FI;
     FI;
    IF (JMP near indirect, absolute indirect)
          IF EndbranchEnabledAndNotSuppressed(CPL)
                IF CPL = 3

                      THEN
                            IF ( no 3EH prefix OR IA32_U_CET.NO_TRACK_EN == 0 )
                                  THEN
                                        IA32_U_CET.TRACKER = WAIT_FOR_ENDBRANCH
                            FI;

                      ELSE
                            IF ( no 3EH prefix OR IA32_S_CET.NO_TRACK_EN == 0 )
                                  THEN
                                        IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
                            FI;

                FI;
          FI;
    FI;
FI;

IF far jump and (PE = 0 or (PE = 1 AND VM = 1)) (* Real-address or virtual-8086 mode *)

     THEN
           tempEIP := DEST(Offset); (* DEST is ptr16:32 or [m16:32] *)
           IF tempEIP is beyond code segment limit
                THEN #GP(0); FI;
           CS := DEST(segment selector); (* DEST is ptr16:32 or [m16:32] *)

         IF OperandSize = 32

                 THEN
                      EIP := tempEIP; (* DEST is ptr16:32 or [m16:32] *)

              ELSE (* OperandSize = 16 *)

                      EIP := tempEIP AND 0000FFFFH; (* Clear upper 16 bits *)
           FI;
FI;

IF far jump and (PE = 1 and VM = 0)

(* IA-32e mode or protected mode, not virtual-8086 mode *)
     THEN
           IF effective address in the CS, DS, ES, FS, GS, or SS segment is illegal or segment selector in target operand NULL
                      THEN #GP(0); FI;
           IF segment selector index not within descriptor table limits
                THEN #GP(new selector); FI;
          Read type and access rights of segment descriptor;

        IF (IA32_EFER.LMA = 0)

                THEN
                      IF segment type is not a conforming or nonconforming code segment, call gate, task gate, or TSS
                            THEN #GP(segment selector); FI;

                ELSE
                      IF segment type is not a conforming or nonconforming code segment or call gate
                            THEN #GP(segment selector); FI;

          FI;
          Depending on type and access rights:

                GO TO CONFORMING-CODE-SEGMENT;
                GO TO NONCONFORMING-CODE-SEGMENT;
                GO TO CALL-GATE;
                GO TO TASK-GATE;


                GO TO TASK-STATE-SEGMENT;
     ELSE

           #GP(segment selector);
FI;
CONFORMING-CODE-SEGMENT:

   IF L-Bit = 1 and D-BIT = 1 and IA32_EFER.LMA = 1

          THEN GP(new code segment selector); FI;
     IF DPL > CPL

          THEN #GP(segment selector); FI;
    IF CR4.FRED = 1 and CPL = 0 and L-bit = 0

          THEN GP(new code segment selector); FI;
     IF segment not present

          THEN #NP(segment selector); FI;
    tempEIP := DEST(Offset);

   IF OperandSize = 16

           THEN tempEIP := tempEIP AND 0000FFFFH;
    FI;

   IF (IA32_EFER.LMA = 0 or target mode = Compatibility mode) and

    tempEIP outside code segment limit
          THEN #GP(0); FI

    IF tempEIP is non-canonical
          THEN #GP(0); FI;

    IF ShadowStackEnabled(CPL)
          IF (IA32_EFER.LMA and DEST(segment selector).L) = 0
                (* If target is legacy or compatibility mode then the SSP must be in low 4GB *)
                IF (SSP & 0xFFFFFFFF00000000 != 0)
                       THEN #GP(0); FI;
          FI;

    FI;
    CS := DEST[segment selector]; (* Segment descriptor information also loaded *)
    CS(RPL) := CPL
    EIP := tempEIP;
    IF EndbranchEnabled(CPL)

          IF CPL = 3
                THEN
                       IA32_U_CET.TRACKER = WAIT_FOR_ENDBRANCH
                       IA32_U_CET.SUPPRESS = 0
                ELSE
                       IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
                       IA32_S_CET.SUPPRESS = 0

          FI;
    FI;
END;
NONCONFORMING-CODE-SEGMENT:

   IF L-Bit = 1 and D-BIT = 1 and IA32_EFER.LMA = 1

          THEN GP(new code segment selector); FI;

   IF (RPL > CPL) OR (DPL  CPL)

          THEN #GP(code segment selector); FI;
    IF CR4.FRED = 1 and CPL = 0 and L-bit = 0

          THEN GP(new code segment selector); FI;
    IF segment not present

          THEN #NP(segment selector); FI;
    tempEIP := DEST(Offset);

   IF OperandSize = 16


           THEN tempEIP := tempEIP AND 0000FFFFH; FI;

   IF (IA32_EFER.LMA = 0 OR target mode = Compatibility mode)

    and tempEIP outside code segment limit
          THEN #GP(0); FI

    IF tempEIP is non-canonical THEN #GP(0); FI;
    IF ShadowStackEnabled(CPL)

          IF (IA32_EFER.LMA and DEST(segment selector).L) = 0
                (* If target is legacy or compatibility mode then the SSP must be in low 4GB *)
                IF (SSP & 0xFFFFFFFF00000000 != 0)
                       THEN #GP(0); FI;

          FI;
    FI;
    CS := DEST[segment selector]; (* Segment descriptor information also loaded *)
    CS(RPL) := CPL;
    EIP := tempEIP;
    IF EndbranchEnabled(CPL)

          IF CPL = 3
                THEN
                       IA32_U_CET.TRACKER = WAIT_FOR_ENDBRANCH
                       IA32_U_CET.SUPPRESS = 0
                ELSE
                       IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
                       IA32_S_CET.SUPPRESS = 0

          FI;
    FI;
END;

CALL-GATE:
    IF call gate DPL < CPL or call gate DPL < call gate segment-selector RPL or CR4.FRED = 1
                THEN #GP(call gate selector); FI;
    IF call gate not present
          THEN #NP(call gate selector); FI;
    IF call gate code-segment selector is NULL
          THEN #GP(0); FI;
    IF call gate code-segment selector index outside descriptor table limits
          THEN #GP(code segment selector); FI;
    Read code segment descriptor;
    IF code-segment segment descriptor does not indicate a code segment
    or code-segment segment descriptor is conforming and DPL > CPL

   or code-segment segment descriptor is non-conforming and DPL  CPL

                THEN #GP(code segment selector); FI;

   IF IA32_EFER.LMA = 1 and (code-segment descriptor is not a 64-bit code segment

    or code-segment segment descriptor has both L-Bit and D-bit set)
                THEN #GP(code segment selector); FI;

    IF code segment is not present
          THEN #NP(code-segment selector); FI;

     tempEIP := DEST(Offset);

    IF GateSize = 16

           THEN tempEIP := tempEIP AND 0000FFFFH; FI;

   IF (IA32_EFER.LMA = 0 OR target mode = Compatibility mode) AND tempEIP

    outside code segment limit
          THEN #GP(0); FI

    CS := DEST[SegmentSelector]; (* Segment descriptor information also loaded *)
    CS(RPL) := CPL;


    EIP := tempEIP;
    IF EndbranchEnabled(CPL)

          IF CPL = 3
                THEN
                      IA32_U_CET.TRACKER = WAIT_FOR_ENDBRANCH;
                      IA32_U_CET.SUPPRESS = 0
                ELSE
                      IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH;
                      IA32_S_CET.SUPPRESS = 0

          FI;
    FI;
END;
TASK-GATE:
    IF task gate DPL < CPL
    or task gate DPL < task gate segment-selector RPL

          THEN #GP(task gate selector); FI;
    IF task gate not present

          THEN #NP(gate selector); FI;
    Read the TSS segment selector in the task-gate descriptor;
    IF TSS segment selector local/global bit is set to local
    or index not within GDT limits
    or descriptor is not a TSS segment
    or TSS descriptor specifies that the TSS is busy

          THEN #GP(TSS selector); FI;
     IF TSS not present

          THEN #NP(TSS selector); FI;
     SWITCH-TASKS to TSS;
     IF EIP not within code segment limit

          THEN #GP(0); FI;
END;
TASK-STATE-SEGMENT:

    IF TSS DPL < CPL
    or TSS DPL < TSS segment-selector RPL
    or TSS descriptor indicates TSS not available

          THEN #GP(TSS selector); FI;
    IF TSS is not present

          THEN #NP(TSS selector); FI;
    SWITCH-TASKS to TSS;
    IF EIP not within code segment limit

          THEN #GP(0); FI;
END;
```

## 受影响的旗帜

如果任务切换发生, 所有旗帜都会受到影响; 如果任务切换不发生, 任何旗帜都不会受到影响 。
