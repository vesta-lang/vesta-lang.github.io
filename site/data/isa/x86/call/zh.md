---
summary: 呼叫程序
---

## 说明

保存将堆栈和分支上的信息与使用目标操作数指定的所谓程序联系起来的程序. 目标操作数在所谓的程序中指定了第一个指令的地址. 操作数可以是即时值,通用寄存器,也可以是内存位置.

此指令可用于执行四种类型的呼叫:

* Near Call -- -- 调用当前代码段的程序(CS目前指出的段)

登记簿),有时被称为区内调用.

* Far Call - 调用位于与当前代码段不同段的程序,有时

称为区间呼叫。

* 跨特权级远征 -- -- 对不同特权级部分程序远征

目前执行的方案或程序。

* 任务切换器--调用位于不同任务的程序.

后两种调用类型(privile-level call和任务切换)只能用保护模式执行. 参见英特尔(R)64和IA-32架构软件开发者手册第1卷第6章中的"使用呼叫和RET的呼叫程序",以了解关于近,远,以及跨特权级别呼叫的更多信息. 参见第十章"任务管理",见Intel(R)64和IA-32 Architectures Software开发者手册第3A卷,关于使用CALL指令执行任务开关的信息.

近唤. 执行近呼时,处理器将EIP寄存器的值(包含CALL指令后指令的偏移)推到堆栈上(以后用作返回-指令指针). 然后处理器分支到目标操作数指定的当前代码段中的地址. 目标操作数指定了代码段的绝对抵消(从代码段的基数中抵消)或相对抵消(与EIP寄存器中指令指针的当前值相对的签名移位;这个值指向CALL指令之后的指令). CS登记簿不会在近距离通话时更改.

对于近呼绝对,在通用寄存器或内存位置(r/m16,r/m32,或r/m64)中间接指定绝对偏移. 操作数大小属性决定目标操作数的大小(16,32或64位). 在64位模式下,用于近呼的操作数大小(以及所有近呼的分支)被迫为64位. 绝对偏移直接加载到EIP(RIP)寄存器中. 如果操作数大小属性为16,则EIP寄存器的上两个字节被清除,导致最大指令指针大小为16位. 在间接使用栈指针 [ESP]作为基准寄存器访问绝对抵消时,所使用的基准值是指令执行前ESP的值.

相对偏移(rel16或rel32)一般在组装代码中指定为标签. 但是在机器代码级别上,它被编码为一个签名的,16位或32位的即时值. 此值会添加到 EIP( RIP) 寄存器中的值中 。 在64位模式下,相对偏移总是一个32位的即时值,在添加到RIP寄存器中用于目标计算值之前,该值被扩展至64位. 与绝对抵消一样,操作数大小属性决定目标操作数的大小(16,32或64位). 在64位模式下,目标操作数将永远是64位,因为操作数大小为接近分支被迫使用64位.

在 Real-Address 或 虚拟 8086 模式 的 Far Calls in Real-Address 或 虚拟 8086 模式 中调用. 当在 real addression 或 虚拟 8086 模式 中执行远调时,处理器将 CS 和 EIP 的当前值都推到堆栈上,作为返回-指令指针 使用. 处理器然后对代码段执行一个"远分支",并用目标操作数为所谓的程序指定抵消. 目标操作数指定绝对远地址,或者直接用指针(ptr16:16或ptr16:32),或者间接用内存位置(m16:16或m16:32). 采用指针法,在指令中用4字节(16-bit 操作数大小)或6字节(32-bit 操作数大小)的远近地址编码称为程序段和抵消. 用间接方法,目标操作数指定一个内存位置,它包含一个4字节(16位操作数大小)或6字节(32位操作数大小)的远地址. 操作数大小属性决定了远地址中偏移(16或32位)的大小. 远方地址直接装入CS和EIP登记册. 如果 操作数 大小属性为 16,则EIP 寄存器的上两个字节将被清除.

保护模式的远征军. 当处理器在 保护模式 中运行时, CALL 指令可以用于执行以下类型的远调:

* {\fn黑体\fs22\bord1\shad0\3aHBE\4aH00\fscx67\fscy66\2cHFFFFFF\3cH808080}这叫特权 * 远调不同的特权级别( 特权级别间调用) * 任务切换( 远程调用另一个任务)

在保护模式中,处理器总是使用远地址的段选择子部分来访问GDT或LDT中相应的描述符. 描述器类型(代码段,调用闸门,任务闸门,或TSS)和访问权限决定了要执行的调用操作类型.

如果选中的描述符是用于代码段,则执行对同一特权级别代码段的远程调用. (如果选中的代码段处于不同的特权级别,并且代码段不符合规定,则生成一般保护例外. ) 保护模式中对相同特权级别的远调非常类似于在真地址或虚拟 8086 模式中执行的. 目标操作数指定绝对远地址,或者直接用指针(ptr16:16或ptr16:32),或者间接用内存位置(m16:16或m16:32). 操作大小属性决定了远地址中偏移(16或32位)的大小. 新的代码段选择子及其描述器被装入CS寄存器;指令的偏移被装入EIP寄存器.

调用闸门(在下段描述)也可以用于在相同特权级别上对代码段进行远调. 使用这个机制提供了额外的间接级别,是16位和32位代码段之间调用的优先方法.

在执行跨省级远程呼叫时,必须通过呼叫门访问被呼叫程序的代码段. 目标操作数指定的段选择子识别呼叫门. 目标操作可以直接用指针(ptr16:16或ptr16:32)或间接用内存位置(m16:16或m16:32)指定调用门段选择器. 处理器从调用闸门描述器获得用于新代码段的段选择子和新的指令指针(offset). (使用呼叫门时,目标操作数的抵消被忽略).

在跨优先级呼叫时,处理器会切换到堆栈,以获取被调用程序的特权级. 段选择子用于新堆栈线段,在TSS中指定用于当前运行的任务. 分支到新代码段发生在堆栈切换后. (注意在使用调用闸门对同一特权级的段进行远程调用时,不会发生堆栈开关. ) 在新堆栈上,处理器将段选择子和栈指针推向调用程序的堆栈,这是调用程序的堆栈的一组可选参数,而段选择子和指令指针则用于调用程序的代码段. (调用门描述符中的一个值决定了要复制到新堆栈的参数数量. ) 最后,处理器分支到程序地址在新代码段内被调用.

用 CALL 指令执行任务切换,类似于通过呼叫门执行呼叫. 目标操作数指定任务门的段选择子,用于开关激活的新任务(目标操作数中的抵消被忽略). 任务门依次指向TSS用于新任务,其中包含任务代码和堆栈部分的分段选择器. 注意TSS中还包含了在调用任务中止前要执行的下一个指令的EIP值. 这个 指令指针 值被加载到 EIP 寄存器中重新启动调用任务.

CALL指令也可以直接指定TSS的段选择子,这消除了任务门的间接性. 参见第十章"任务管理",见Intel(R)64和IA-32 Architecture Software开发者手册第3A卷,关于任务开关的力学信息.

当执行一个 CALL 指令影响任务切换时,在 EFLAGS 寄存器中设置了嵌套任务旗(NT),新的 TSS 前一个任务链接字段装入了旧任务中的 TSS 选择器. 代码有望通过执行 IRET 指令中止此嵌入的任务,由于NT 旗被设定,该指令会自动使用之前的任务链接返回调用的任务. (参见英特尔(R)64和IA-32架构软件开发者手册第3A卷第10章中的"任务链接",以了解筑巢任务信息. ) 与CALL指令的切换任务在这方面不同于JMP指令. JMP不设置NT旗,因此不期望IRET指令中止任务.

混合16比特和32比特呼叫. 在16位和32位代码段之间进行远调时,使用呼叫门. 如果远程调用是从一个32位代码段到一个16位代码段,该调用应从32位代码段的前64 KBytes. 这是因为指令的操作数大小属性被设定为16,所以只能保存一个16位返回地址偏移. 另外,该调用应该使用16位调用闸门进行,这样16位值就可以被推到堆栈上. 参见第24章"混合16-Bit和32-Bit代码",见Intel(R)64和IA-32架构软件开发者手册,第3B卷,欲了解更多信息.

调用兼容模式 。 当处理器在兼容模式下运行时,CALL指令可以用于执行以下类型的远调:

* 远调到相同的特权级别, 保持兼容模式 * 远调到相同的特权级别, 向64位模式过渡 * 远调到不同的特权级别( 间优先级别调用), 过渡到 64 位模式

注意CALL指令不能用于在兼容模式下造成任务切换,因为任务切换不支持IA-32e模式.

在兼容模式中,处理器总是使用远地址的段选择子部分来访问GDT或LDT中相应的描述符. 描述器类型(代码段,呼叫门)和访问权限决定了要执行的呼叫操作类型.

如果选中的描述符是用于代码段,则执行对同一特权级别代码段的远程调用. (如果选中的代码段处于不同的特权级别,并且代码段不符合规定,则生成一个通用保护例外. ) 在兼容模式下对同一特权级别的远调与保护模式中执行的非常相似. 目标操作数指定绝对远地址,或者直接用指针(ptr16:16或ptr16:32),或者间接用内存位置(m16:16或m16:32). 操作数大小属性决定了远地址中偏移(16或32位)的大小. 新的代码段选择子及其描述器被加载到CS寄存器中,指令的抵消部分被加载到EIP寄存器中. 不同的是可以输入64位模式. 在新的代码段描述符中由 L 位指定 。

注意,64位调用闸门(在下段描述)也可以用于在相同特权级别上执行远程调用代码段. 然而,使用这个机制要求目标代码段描述器有L位设定,导致输入64位模式.

当执行跨特权级远调时,程序被调用的代码段必须通过64位调用闸门访问. 目标操作数指定的段选择子识别呼叫门. 目标

opeond可以直接用指针(ptr16:16或ptr16:32)或间接用内存位置(m16:16或m16:32)指定调用门段选择器. 处理器从16字节调用闸门描述器中获取新码段的段选择子和新指令指针(offset). (使用呼叫门时,目标操作数的抵消被忽略).

在跨优先级呼叫时,处理器会切换到堆栈,以获取被调用程序的特权级. 新堆栈段的段选择子设置为NULL. 新的 栈指针 在 TSS 中指定当前运行的任务. 分支到新代码段发生在堆栈切换后. (注意在使用调用闸门对同一特权级的某一段进行远调时,由于输入64位模式而发生隐含的堆栈开关. SS选择器不变,但堆栈段访问器使用0x0的段基,限制被忽略,默认堆栈大小为64位. RSP的全值用于偏移,其中上32位未定义. ) 在新堆栈上,处理器将段选择子和栈指针推向调用程序的堆栈,将段选择子和指令指针推向调用程序的代码段. (Parameter copy不支持IA-32e模式. ) 最后,处理器分支到程序地址在新代码段内调用.

近/(远)调用64位模式 。 当处理器在64位模式下运行时,CALL指令可用于执行以下类型的远调:

* 远调到相同的特权级别, 向兼容模式过渡 * 远调到相同的特权级别, 仍保留在64位模式 * 远调到不同的特权级别( 间优先级别调用) , 保留在 64 位模式

注意在此模式下,CALL指令不能用于在64位模式下造成任务切换,因为任务切换不支持IA-32e模式.

在64位模式中,处理器总是使用远地址的段选择子部分来访问GDT或LDT中相应的描述符. 描述器类型(代码段,呼叫门)和访问权限决定了要执行的呼叫操作类型.

如果选中的描述符是用于代码段,则执行对同一特权级别代码段的远程调用. (如果选中的代码段处于不同的特权级别,并且代码段不符合规定,则生成一般保护例外. )64位模式下对相同特权级别的远调与兼容模式下进行的远调非常相似. 目标操作数以一个内存位置(m16:16,m16:32或m16:64)间接指定绝对远地址. 带有绝对远地址直接规格的CALL的形式没有在64位模式下定义. 操作数大小属性决定了远地址中偏移(16,32或64位)的大小. 新的代码段选择子及其描述器被加载到CS登记册中;指令的偏移被加载到EIP登记册中. 新代码段可能根据L位值指定输入兼容性或64位模式.

一个64位的调用闸门(在下段描述)也可以用于在相同的特权级别上执行对代码段的远调. 然而,使用这个机制要求目标代码段描述器有L位集.

当执行跨特权级远调时,程序被调用的代码段必须通过64位调用闸门访问. 目标操作数指定的段选择子识别呼叫门. 目标操作器只能间接指定一个内存位置的呼叫门段选择器(m16:16,m16:32或m16:64). 处理器从16字节调用闸门描述器中获取新码段的段选择子和新指令指针(offset). (使用呼叫门时,目标操作数的抵消被忽略).

在跨优先级呼叫时,处理器会切换到堆栈,以获取被调用程序的特权级. 新堆栈段的段选择子设置为NULL. 新的 栈指针 在 TSS 中指定当前运行的任务. 分支到新代码段发生在堆栈切换后.

注意,当使用调用闸门对同一特权级的某一段进行远调时,由于输入64位模式而发生隐含的堆栈开关. SS选择器不变,但堆栈段访问器使用0x0的段基,限制被忽略,默认堆栈大小为64位. (RSP的全值用于偏移. ) 在新堆栈上,处理器将段选择子和栈指针用于调用程序的堆栈,并将段选择子和指令指针用于调用程序的代码段. (Parameter copy不支持IA-32e模式. ) 最后,处理器分支到程序地址在新代码段内调用.

参见第6章"程序调用,中断,和例外",第18章"控制流执行技术(CET)",载于Intel(R)64和IA-32架构软件开发者手册第1卷,用于CET.

details.

启用 FRED 转换时, 引用调用闸门的 CALL 远处执行会导致一般- protec -

tv例外,远 CALL的执行也会在CPL为0时进入兼容模式.

指令令. 远程调用后的指示可在先前的指示之前从内存中获取

完全执行,但他们不会执行(甚至猜测) 直到所有指令 在远征之前

已完成执行(后期指示可在先前指示所存储的数据存在之前执行)

(b) 提高全球知名度。

可依次执行近乎间接的CALL指令(即未达到目标的指令)

猜测。 如果软件需要防止这种情况(例如为了防止投机性执行的侧通道),

然后在近间接的CALL之后放置一个 LFENCE 指令 操作码,以阻断投机性执行-

tion.

## 行动

```text
IF near call
    THEN IF near relative call
          THEN
               IF OperandSize = 64
                      THEN
                            tempDEST := SignExtend(DEST); (* DEST is rel32 *)
                            tempRIP := RIP + tempDEST;
                            IF stack not large enough for a 8-byte return address
                                  THEN #SS(0); FI;
                            Push(RIP);
                            IF ShadowStackEnabled(CPL) AND DEST != 0
                                  ShadowStackPush8B(RIP);
                            FI;
                            RIP := tempRIP;
                FI;
               IF OperandSize = 32
                      THEN
                            tempEIP := EIP + DEST; (* DEST is rel32 *)
                            IF tempEIP is not within code segment limit THEN #GP(0); FI;
                            IF stack not large enough for a 4-byte return address
                                  THEN #SS(0); FI;
                            Push(EIP);
                            IF ShadowStackEnabled(CPL) AND DEST != 0
                                  ShadowStackPush4B(EIP);
                            FI;
                            EIP := tempEIP;
                FI;
                IF OperandSize = 16
                      THEN
                            tempEIP := (EIP + DEST) AND 0000FFFFH; (* DEST is rel16 *)
                            IF tempEIP is not within code segment limit THEN #GP(0); FI;
                            IF stack not large enough for a 2-byte return address
                                  THEN #SS(0); FI;
                            Push(IP);
                            IF ShadowStackEnabled(CPL) AND DEST != 0
                                  (* IP is zero extended and pushed as a 32 bit value on shadow stack *)
                                  ShadowStackPush4B(IP);
                            FI;


                             EIP := tempEIP;
                FI;
          ELSE (* Near absolute call *)
               IF OperandSize = 64

                       THEN
                             tempRIP := DEST; (* DEST is r/m64 *)
                             IF stack not large enough for a 8-byte return address
                                   THEN #SS(0); FI;
                             Push(RIP);
                             IF ShadowStackEnabled(CPL)
                                   ShadowStackPush8B(RIP);
                             FI;
                             RIP := tempRIP;

                FI;
               IF OperandSize = 32

                       THEN
                             tempEIP := DEST; (* DEST is r/m32 *)
                             IF tempEIP is not within code segment limit THEN #GP(0); FI;
                             IF stack not large enough for a 4-byte return address
                                   THEN #SS(0); FI;
                             Push(EIP);
                             IF ShadowStackEnabled(CPL)
                                   ShadowStackPush4B(EIP);
                             FI;
                             EIP := tempEIP;

                FI;
               IF OperandSize = 16

                       THEN
                             tempEIP := DEST AND 0000FFFFH; (* DEST is r/m16 *)
                             IF tempEIP is not within code segment limit THEN #GP(0); FI;
                             IF stack not large enough for a 2-byte return address
                                   THEN #SS(0); FI;
                             Push(IP);
                             IF ShadowStackEnabled(CPL)
                                   (* IP is zero extended and pushed as a 32 bit value on shadow stack *)
                                   ShadowStackPush4B(IP);
                             FI;
                             EIP := tempEIP;

                FI;
    FI;rel/abs
    IF (Call near indirect, absolute indirect)

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
FI; near

IF far call and (PE = 0 or (PE = 1 and VM = 1)) (* Real-address or virtual-8086 mode *)
    THEN
         IF OperandSize = 32
                THEN
                       IF stack not large enough for a 6-byte return address
                             THEN #SS(0); FI;
                       IF DEST[31:16] is not zero THEN #GP(0); FI;
                       Push(CS); (* Padded with 16 high-order bits *)
                       Push(EIP);
                       CS := DEST[47:32]; (* DEST is ptr16:32 or [m16:32] *)
                       EIP := DEST[31:0]; (* DEST is ptr16:32 or [m16:32] *)
               ELSE (* OperandSize = 16 *)
                       IF stack not large enough for a 4-byte return address
                             THEN #SS(0); FI;
                       Push(CS);
                       Push(IP);
                       CS := DEST[31:16]; (* DEST is ptr16:16 or [m16:16] *)
                       EIP := DEST[15:0]; (* DEST is ptr16:16 or [m16:16]; clear upper 16 bits *)
          FI;

FI;

IF far call and (PE = 1 and VM = 0) (* Protected mode or IA-32e Mode, not virtual-8086 mode*)
    THEN
          IF segment selector in target operand NULL
                THEN #GP(0); FI;
          IF segment selector index not within descriptor table limits
                THEN #GP(new code segment selector); FI;
          Read type and access rights of selected segment descriptor;
          IF IA32_EFER.LMA = 0
                THEN
                       IF segment type is not a conforming or nonconforming code segment, call gate, task gate, or TSS
                             THEN #GP(segment selector); FI;
                ELSE
                       IF segment type is not a conforming or nonconforming code segment or 64-bit call gate
                             THEN #GP(segment selector); FI;
          FI;
          Depending on type and access rights:
                GO TO CONFORMING-CODE-SEGMENT;
                GO TO NONCONFORMING-CODE-SEGMENT;
                GO TO CALL-GATE;
                GO TO TASK-GATE;
                GO TO TASK-STATE-SEGMENT;

FI;

CONFORMING-CODE-SEGMENT:
    IF L bit = 1 and D bit = 1 and IA32_EFER.LMA = 1
          THEN GP(new code segment selector); FI;
    IF DPL > CPL
          THEN #GP(new code segment selector); FI;
    IF CR4.FRED = 1 and CPL = 0 and L bit = 0


          THEN GP(new code segment selector); FI;
    IF segment not present

          THEN #NP(new code segment selector); FI;
    IF stack not large enough for return address

          THEN #SS(0); FI;
    tempEIP := DEST(Offset);
    IF target mode = Compatibility mode

          THEN tempEIP := tempEIP AND 00000000_FFFFFFFFH; FI;
    IF OperandSize = 16

          THEN
                tempEIP := tempEIP AND 0000FFFFH; FI; (* Clear upper 16 bits *)

    IF (IA32_EFER.LMA = 0 or target mode = Compatibility mode) and (tempEIP outside new code segment limit)
          THEN #GP(0); FI;

    IF tempEIP is non-canonical
          THEN #GP(0); FI;

    IF ShadowStackEnabled(CPL)
          IF OperandSize = 32
                THEN
                       tempPushLIP = CSBASE + EIP;
                ELSE
                       IF OperandSize = 16
                             THEN
                                   tempPushLIP = CSBASE + IP;
                             ELSE (* OperandSize = 64 *)
                                   tempPushLIP = RIP;
                       FI;
          FI;
          tempPushCS = CS;

    FI;
    IF OperandSize = 32

          THEN
                Push(CS); (* Padded with 16 high-order bits *)
                Push(EIP);
                CS := DEST(CodeSegmentSelector);
                (* Segment descriptor information also loaded *)
                CS(RPL) := CPL;
                EIP := tempEIP;

          ELSE
               IF OperandSize = 16
                       THEN
                             Push(CS);
                             Push(IP);
                             CS := DEST(CodeSegmentSelector);
                             (* Segment descriptor information also loaded *)
                             CS(RPL) := CPL;
                             EIP := tempEIP;
                    ELSE (* OperandSize = 64 *)
                             Push(CS); (* Padded with 48 high-order bits *)
                             Push(RIP);
                             CS := DEST(CodeSegmentSelector);
                             (* Segment descriptor information also loaded *)
                             CS(RPL) := CPL;
                             RIP := tempEIP;
                FI;


    FI;
    IF ShadowStackEnabled(CPL)

          IF (IA32_EFER.LMA and DEST(CodeSegmentSelector).L) = 0
                (* If target is legacy or compatibility mode then the SSP must be in low 4GB *)
                IF (SSP & 0xFFFFFFFF00000000 != 0)
                       THEN #GP(0); FI;

          FI;
          (* align to 8 byte boundary if not already aligned *)
          tempSSP = SSP;
          Shadow_stack_store 4 bytes of 0 to (SSP  4)
          SSP = SSP & 0xFFFFFFFFFFFFFFF8H
          ShadowStackPush8B(tempPushCS); (* Padded with 48 high-order bits of 0 *)
          ShadowStackPush8B(tempPushLIP); (* Padded with 32 high-order bits of 0 for 32 bit LIP*)
          ShadowStackPush8B(tempSSP);
    FI;
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
    IF (RPL > CPL) or (DPL  CPL)
          THEN #GP(new code segment selector); FI;
    IF CR4.FRED = 1 and CPL = 0 and L bit = 0
          THEN GP(new code segment selector); FI;
    IF segment not present
          THEN #NP(new code segment selector); FI;
    IF stack not large enough for return address
          THEN #SS(0); FI;
    tempEIP := DEST(Offset);
    IF target mode = Compatibility mode
          THEN tempEIP := tempEIP AND 00000000_FFFFFFFFH; FI;
    IF OperandSize = 16
          THEN tempEIP := tempEIP AND 0000FFFFH; FI; (* Clear upper 16 bits *)
    IF (IA32_EFER.LMA = 0 or target mode = Compatibility mode) and (tempEIP outside new code segment limit)
          THEN #GP(0); FI;
    IF tempEIP is non-canonical
          THEN #GP(0); FI;
    IF ShadowStackEnabled(CPL)
          IF IA32_EFER.LMA & CS.L
                tempPushLIP = RIP
          ELSE
                tempPushLIP = CSBASE + EIP;
          FI;
          tempPushCS = CS;


    FI;
    IF OperandSize = 32

          THEN
                Push(CS); (* Padded with 16 high-order bits *)
                Push(EIP);
                CS := DEST(CodeSegmentSelector);
                (* Segment descriptor information also loaded *)
                CS(RPL) := CPL;
                EIP := tempEIP;

          ELSE
                IF OperandSize = 16
                       THEN
                             Push(CS);
                             Push(IP);
                             CS := DEST(CodeSegmentSelector);
                             (* Segment descriptor information also loaded *)
                             CS(RPL) := CPL;
                             EIP := tempEIP;
                       ELSE (* OperandSize = 64 *)
                             Push(CS); (* Padded with 48 high-order bits *)
                             Push(RIP);
                             CS := DEST(CodeSegmentSelector);
                             (* Segment descriptor information also loaded *)
                             CS(RPL) := CPL;
                             RIP := tempEIP;
                FI;

    FI;
    IF ShadowStackEnabled(CPL)

          IF (IA32_EFER.LMA and DEST(CodeSegmentSelector).L) = 0
                (* If target is legacy or compatibility mode then the SSP must be in low 4GB *)
                IF (SSP & 0xFFFFFFFF00000000 != 0)
                       THEN #GP(0); FI;

          FI;
    (* align to 8 byte boundary if not already aligned *)
    tempSSP = SSP;
    Shadow_stack_store 4 bytes of 0 to (SSP  4)
    SSP = SSP & 0xFFFFFFFFFFFFFFF8H
    ShadowStackPush8B(tempPushCS); (* Padded with 48 high-order 0 bits *)
    ShadowStackPush8B(tempPushLIP); (* Padded 32 high-order bits of 0 for 32 bit LIP*)
    ShadowStackPush8B(tempSSP);
    FI;
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


    IF call gate (DPL < CPL) or (RPL > DPL) or (CR4.FRED = 1)
          THEN #GP(call-gate selector); FI;

    IF call gate not present
          THEN #NP(call-gate selector); FI;

    IF call-gate code-segment selector is NULL
          THEN #GP(0); FI;

    IF call-gate code-segment selector index is outside descriptor table limits
          THEN #GP(call-gate code-segment selector); FI;

    Read call-gate code-segment descriptor;
    IF call-gate code-segment descriptor does not indicate a code segment
    or call-gate code-segment descriptor DPL > CPL

          THEN #GP(call-gate code-segment selector); FI;
    IF IA32_EFER.LMA = 1 AND (call-gate code-segment descriptor is
    not a 64-bit code segment or call-gate code-segment descriptor has both L-bit and D-bit set)

          THEN #GP(call-gate code-segment selector); FI;
    IF call-gate code segment not present

          THEN #NP(call-gate code-segment selector); FI;
    IF call-gate code segment is non-conforming and DPL < CPL

          THEN go to MORE-PRIVILEGE;
          ELSE go to SAME-PRIVILEGE;
    FI;
END;

MORE-PRIVILEGE:
    IF current TSS is 32-bit
          THEN
                TSSstackAddress := (new code-segment DPL  8) + 4;
                IF (TSSstackAddress + 5) > current TSS limit
                       THEN #TS(current TSS selector); FI;
                NewSS := 2 bytes loaded from (TSS base + TSSstackAddress + 4);
                NewESP := 4 bytes loaded from (TSS base + TSSstackAddress);
          ELSE
                IF current TSS is 16-bit
                       THEN
                             TSSstackAddress := (new code-segment DPL  4) + 2
                             IF (TSSstackAddress + 3) > current TSS limit
                                   THEN #TS(current TSS selector); FI;
                             NewSS := 2 bytes loaded from (TSS base + TSSstackAddress + 2);
                             NewESP := 2 bytes loaded from (TSS base + TSSstackAddress);
                       ELSE (* current TSS is 64-bit *)
                             TSSstackAddress := (new code-segment DPL  8) + 4;
                             IF (TSSstackAddress + 7) > current TSS limit
                                   THEN #TS(current TSS selector); FI;
                             NewSS := new code-segment DPL; (* NULL selector with RPL = new CPL *)
                             NewRSP := 8 bytes loaded from (current TSS base + TSSstackAddress);
                FI;
    FI;
    IF IA32_EFER.LMA = 0 and NewSS is NULL
          THEN #TS(NewSS); FI;
    Read new stack-segment descriptor;
    IF IA32_EFER.LMA = 0 and (NewSS RPL  new code-segment DPL
    or new stack-segment DPL  new code-segment DPL or new stack segment is not a
    writable data segment)
          THEN #TS(NewSS); FI


IF IA32_EFER.LMA = 0 and new stack segment not present
      THEN #SS(NewSS); FI;

IF CallGateSize = 32
      THEN
            IF new stack does not have room for parameters plus 16 bytes
                  THEN #SS(NewSS); FI;
            IF CallGate(InstructionPointer) not within new code-segment limit
                  THEN #GP(0); FI;
            SS := newSS; (* Segment descriptor information also loaded *)
            ESP := newESP;
            CS:EIP := CallGate(CS:InstructionPointer);
            (* Segment descriptor information also loaded *)
            Push(oldSS:oldESP); (* From calling procedure *)
            temp := parameter count from call gate, masked to 5 bits;
            Push(parameters from calling procedure's stack, temp)
            Push(oldCS:oldEIP); (* Return address to calling procedure *)
      ELSE
            IF CallGateSize = 16
                  THEN
                        IF new stack does not have room for parameters plus 8 bytes
                              THEN #SS(NewSS); FI;
                        IF (CallGate(InstructionPointer) AND FFFFH) not in new code-segment limit
                              THEN #GP(0); FI;
                        SS := newSS; (* Segment descriptor information also loaded *)
                        ESP := newESP;
                        CS:IP := CallGate(CS:InstructionPointer);
                        (* Segment descriptor information also loaded *)
                        Push(oldSS:oldESP); (* From calling procedure *)
                        temp := parameter count from call gate, masked to 5 bits;
                        Push(parameters from calling procedure's stack, temp)
                        Push(oldCS:oldEIP); (* Return address to calling procedure *)
                  ELSE (* CallGateSize = 64 *)
                        IF pushing 32 bytes on the stack would use a non-canonical address
                              THEN #SS(NewSS); FI;
                        IF (CallGate(InstructionPointer) is non-canonical)
                              THEN #GP(0); FI;
                        SS := NewSS; (* NewSS is NULL)
                        RSP := NewESP;
                        CS:IP := CallGate(CS:InstructionPointer);
                        (* Segment descriptor information also loaded *)
                        Push(oldSS:oldESP); (* From calling procedure *)
                        Push(oldCS:oldEIP); (* Return address to calling procedure *)
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
CPL := CodeSegment(DPL)
CS(RPL) := CPL


IF ShadowStackEnabled(CPL)

      oldSSP := SSP

      SSP := IA32_PLi_SSP; (* where i is the CPL *)

      IF SSP & 0x07 != 0 (* if SSP not aligned to 8 bytes then #GP *)

           THEN #GP(0); FI;

      (* Token and CS:LIP:oldSSP pushed on shadow stack must be contained in a naturally aligned 32-byte region*)

      IF (SSP & ~0x1F) != ((SSP  24) & ~0x1F)

           #GP(0); FI;

      IF ((IA32_EFER.LMA and CS.L) = 0 AND SSP[63:32] != 0)

           THEN #GP(0); FI;

      expected_token_value = SSP        (* busy bit - bit position 0 - must be clear *)

      new_token_value = SSP | BUSY_BIT  (* Set the busy bit *)

      IF shadow_stack_lock_cmpxchg8b(SSP, new_token_value, expected_token_value) != expected_token_value

           THEN #GP(0); FI;

      IF oldSS.DPL != 3

           ShadowStackPush8B(oldCS); (* Padded with 48 high-order bits of 0 *)

           ShadowStackPush8B(oldCSBASE+oldRIP); (* Padded with 32 high-order bits of 0 for 32 bit LIP*)

           ShadowStackPush8B(oldSSP);

      FI;

FI;

IF EndbranchEnabled (CPL)

      IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH

      IA32_S_CET.SUPPRESS = 0

FI;

END;

SAME-PRIVILEGE:
    IF CallGateSize = 32
          THEN
                IF stack does not have room for 8 bytes
                      THEN #SS(0); FI;
                IF CallGate(InstructionPointer) not within code segment limit
                      THEN #GP(0); FI;
                CS:EIP := CallGate(CS:EIP) (* Segment descriptor information also loaded *)
                Push(oldCS:oldEIP); (* Return address to calling procedure *)
          ELSE
               If CallGateSize = 16
                      THEN
                            IF stack does not have room for 4 bytes
                                  THEN #SS(0); FI;
                            IF CallGate(InstructionPointer) not within code segment limit
                                  THEN #GP(0); FI;
                            CS:IP := CallGate(CS:instruction pointer);
                            (* Segment descriptor information also loaded *)
                            Push(oldCS:oldIP); (* Return address to calling procedure *)
                      ELSE (* CallGateSize = 64)
                            IF pushing 16 bytes on the stack touches non-canonical addresses
                                  THEN #SS(0); FI;
                            IF RIP non-canonical
                                  THEN #GP(0); FI;
                            CS:IP := CallGate(CS:instruction pointer);
                            (* Segment descriptor information also loaded *)
                            Push(oldCS:oldIP); (* Return address to calling procedure *)
                FI;


    FI;
    CS(RPL) := CPL
    IF ShadowStackEnabled(CPL)

          (* Align to next 8 byte boundary *)
          tempSSP = SSP;
          Shadow_stack_store 4 bytes of 0 to (SSP  4)
          SSP = SSP & 0xFFFFFFFFFFFFFFF8H;
          (* push cs:lip:ssp on shadow stack *)
          ShadowStackPush8B(oldCS); (* Padded with 48 high-order bits of 0 *)
          ShadowStackPush8B(oldCSBASE + oldRIP); (* Padded with 32 high-order bits of 0 for 32 bit LIP*)
          ShadowStackPush8B(tempSSP);
    FI;
    IF EndbranchEnabled (CPL)
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
    IF task gate DPL < CPL or RPL
          THEN #GP(task gate selector); FI;
    IF task gate not present
          THEN #NP(task gate selector); FI;
    Read the TSS segment selector in the task-gate descriptor;
    IF TSS segment selector local/global bit is set to local
    or index not within GDT limits
          THEN #GP(TSS selector); FI;
    Access TSS descriptor in GDT;
    IF descriptor is not a TSS segment
          THEN #GP(TSS selector); FI;
    IF TSS descriptor specifies that the TSS is busy
          THEN #GP(TSS selector); FI;
    IF TSS not present
          THEN #NP(TSS selector); FI;
    SWITCH-TASKS (with nesting) to TSS;
    IF EIP not within code segment limit
          THEN #GP(0); FI;

END;

TASK-STATE-SEGMENT:
    IF TSS DPL < CPL or RPL
    or TSS descriptor indicates TSS not available
          THEN #GP(TSS selector); FI;
    IF TSS is not present
          THEN #NP(TSS selector); FI;
    SWITCH-TASKS (with nesting) to TSS;
    IF EIP not within code segment limit
          THEN #GP(0); FI;


END;
```

## 受影响的旗帜

如果任务切换发生, 所有旗帜都会受到影响; 如果任务切换不发生, 任何旗帜都不会受到影响 。
