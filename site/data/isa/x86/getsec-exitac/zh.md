---
summary: 退出认证代码执行模式
---

## 说明

GETSEC[EXITAC]叶函数退出ILP由GETSEC[ENTERACCS]或GETSEC[SENTER]建立的认证代码执行模式. GETSEC的EXITAC 叶在条目中被选中,EAX设置为3. EBX(或RBX,如果在64位模式下)持有近跳目标偏移,用于处理器在退出认证代码执行模式后恢复执行的地方. EDX包含额外的参数控制信息. 目前仅支持EDX中的0输入值. 所有其他EDX设置均被视为保留,并导致普遍的保护侵权.

GETSEC[EXITAC]只有在处理器位于保护模式,且CPL=0,EFLAGS.VM=0时,才能执行. 处理器也必须处于认证的代码执行模式. 为了避免模式之间潜在的可操作性冲突,如果处理器在SMM或VMX操作中,则不允许执行此指令. 违反这些条件导致普遍违反保护规定。

完成GETSEC[EXITAC]操作后,处理器对外部事件信号INIT#,NMI#,和SMI#的反应. 这种解密是有条件的,基于认证的代码执行模式是通过GETSEC[SENTER]或GETSEC[ENTERACCS]的执行输入的. 如果由于执行GETSEC[SENTER]而使处理器处于认证的代码执行模式,那么这些外部事件信号仍将蒙蔽. 在这种情况下,A20M被保留在被测量的环境中,直到被测量的环境执行GETSEC[SEXIT]. INIT#被EXITAC无条件解密. 请注意,任何在认证代码执行模式中被屏蔽的待决事件,如果披针事件解密,将在GETSEC[EXITAC]指令完成时予以确认.

提供可选离开披针事件SMI#,NMI#蒙面的能力的意图是支持完成一个使用VMX的测量环境提升. 在这种设想的安全使用情景中,在建立适当的虚拟机以便以更安全的方式为这些事件提供现场服务之前,这些活动将保持遮掩。 关于VMX操作中事件何时被掩盖和如何被揭发的详情,见Intel(R)64和IA-32架构软件开发者手册,第3C卷. 需要提醒的是,如果GETSEC[EXITAC]之后没有VMX环境启动,这些事件将保持掩盖,直到所测量的环境与GETSEC[SEXIT]退出. 如果不想要这样做,则在此语境下GETSEC函数SMCTRL(0)可用于解密SMI#. NMI#可以通过执行IRET相应解码.

成功退出认证的代码执行模式需要 ILP 执行以下附加步骤:

* 无效内部认证代码执行区的内容 。 * 无效处理器 TLBs 。 * 清除内部处理器 AC 模式指示旗。 * 重新锁定 TPM 地点 3 空间 。 * 解锁 Intel( R) TXT 可控芯片存储器和 I/O 保护器, 允许其他存储器和 I/O 活动

处理器代理。

* 进行近乎绝对的间接跳转到指定指令位置.

认证代码执行区的内容被硬件作废,以保护其不被进一步使用或可见. 这个内部处理器存储区在GETSEC[EXITAC]之后不能再使用或依赖. 数据结构如果要在EXITAC之后被引用,需要在认证代码执行区之外重新建立. 由于先前映射到认证代码执行区的地址内存内容在EXITAC后可能不再与外部系统内存一致,因此支持线性到物理地址翻译的处理器TLBs也宣告无效.

GETSEC[EXITAC]完成后,用装有EBX内容的EIP(基于当前运行模式大小)进行近乎绝对的间接传输. 在64位模式下,如果REX.W在GETSEC[EXITAC]之前,所有64位的RBX被装入RIP. 否则,RBX即使在64位模式下也被当作32位. 常规CS限制检查是作为这种控制转让的一部分进行的。 作为这种控制转移的一部分所产生的任何例外条件都将被指向现有的IDT;因此,建议如果需要故障处理,在EXITAC功能执行之前,也应确定IDTR. 此外,EXITAC之后使用的任何分区(和呼)数据结构,都应该在EXITAC之前由认证代码重新建立或验证.

此外,EXITAC之后使用的任何分区(和page)数据结构都需要在EXITAC之前通过经认证的代码在RAM指定区域之外重新建立和映射. RAM分配区域内的任何数据结构在EXITAC完成后将不再可访问。

## 行动

```text
(* The state of the internal flag ACMODEFLAG and SENTERFLAG persist across instruction boundary *)
IF (CR4.SMXE=0)

    THEN #UD;
ELSIF ( in VMX non-root operation)

    THEN VM Exit (reason="GETSEC instruction");
ELSIF (GETSEC leaf unsupported)

    THEN #UD;
ELSIF ((in VMX operation) or ( (in 64-bit mode) and ( RBX is non-canonical) )

    (CR0.PE=0) or (CPL>0) or (EFLAGS.VM=1) or
    (ACMODEFLAG=0) or (IN_SMM=1)) or (EDX  0))
    THEN #GP(0);
IF (OperandSize = 32)
    THEN tempEIP := EBX;
ELSIF (OperandSize = 64)
    THEN tempEIP := RBX;
ELSE
    tempEIP := EBX AND 0000FFFFH;
IF (tempEIP > code segment limit)
    THEN #GP(0);
IF (ACRAM[CR4High].FRED = 1) and (IA32_EFER.LMA = 0)
    THEN #GP(0);
ELSE CR4.FRED = ACRAM[CR4High].FRED;
Invalidate ACRAM contents;
Invalidate processor TLB(s);
Drain outgoing messages;
SignalTXTMsg(CloseLocality3);
SignalTXTMsg(LockSMRAM);
SignalTXTMsg(ProcessorRelease);
Unmask INIT;
IF (SENTERFLAG=0)
    THEN Unmask SMI, INIT, NMI, and A20M pin event;
ELSEIF (IA32_SMM_MONITOR_CTL[0] = 0)
    THEN Unmask SMI pin event;
ACMODEFLAG := 0;
IF IA32_EFER.LMA == 1
    THEN CR3 := R8;
EIP := tempEIP;
END;
```

## 受影响的旗帜

None.

Use of Prefixes

LOCK 原因 #UD. 中国植物物种信息数据库.

REP* 原因 #UD(包括REPNE/REPNZ和REP/REPE/REPZ).

操作数大小 原因 #UD. 中国植物物种信息数据库.

NP 66/F2/F3 前缀不允许使用.

线段覆盖已忽略 。

地址大小已忽略 。

REX.W 设置64位模式 操作数大小属性.
