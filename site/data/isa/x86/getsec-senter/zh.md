---
summary: 输入测量环境
---

## 说明

GETSEC[SENTER]指令启动一个被测量环境的启动,并将启动的逻辑处理器(ILP)放入经认证的代码执行模式. GETSEC的SENTER 叶被选中,执行时EAX被设定为4. 要加载和认证的AC模块的物理基址在EBX中指定. 以字节表示的模块大小在ECX中指定. EDX控制被测量到的环境发射所支持的功能水平. 为了实现受保护环境发射的全部功能,EDX必须初始化为零.

经认证的代码基址和大小参数(以字节计)分别通过GETSEC[SENTER]指令和使用EBX和ECX. ILP根据GETSEC[ENTERACCS]中的AC模块地址的规则评价这些登记册的内容. AC模块执行遵循GETSEC[ENTERACCS]设定的相同规则.

发射软件必须保证TPM.ACCESS_0.activeLocality比特在执行GETSEC[SENTER]指令前是清晰的.

执行 GETSEC [SENTER] 指令的处理器有执行限制 :

* 除非处理器以 保护模式 或 IA-32e 模式使用 CPL = 0 并

EFLAGS.VM = 0.

* 处理器缓存必须可用,不能使用 CR0.CD 和 NW 位元禁用. * 要使用 Interrupt 16 执行操作与数字例外报告的一致性, CR0.NE 必须是

set.

* 情报TXT- 必须通过对电源进行取样,将能动芯片传送给处理器。

重置后配置能力字段 。

* 处理器不能处于认证的代码执行模式,也不能已经处于被测量的环境中(例如:

由之前的GETSEC[ENTERACCS]或GETSEC[SENTER]指令发射.

* 为了避免模式之间可能出现的可操作性冲突,不允许处理器执行此指令

if it currently is in SMM or VMX operation.

* 为了确保对 SIPI 信件的一致处理,执行 GETSEC [SENTER] 指令的处理器

还必须指定 BSP (boot-strap 处理器),由 IA32_APIC_BASE.BSP (Bit 8) 定义。

* EDX必须初始化为由处理器支持的设置. 除非用 GETSEC [PARAM -] 计数

ETERS] 叶报告别处,只支持0的值.

不遵守上述条件导致处理器表示普遍违反保护规定。

本指令叶启动一个测量环境,启动平台上所有逻辑处理器的集合序列. 会合序列涉及启动逻辑处理器发送消息(通过执行GETSEC[SENTER])和其他响应逻辑处理器(RLPs)确认消息,从而将RLP(s)与ILP同步.

针对一条信号完成会合的信息,RLP清除靴子处理器指示旗(IA32_APIC_BASE.BSP),进入SENTER睡眠状态. 在这种睡眠状态下,RLPs在等待系统执行官建立测量环境后启动时进入闲置处理器条件. SENTER睡眠状态下的RLP只能由GETSEC 叶函数WAKEUP在一个测量环境中激活.

成功启动测量环境导致启动逻辑处理器进入认证代码执行模式. 在达到这个点之前,ILP在内部执行以下步骤: .

* 对外部事件的inhibit处理器响应 : INIT,A20M,NMI,和SMI. * 建立和检查由 ILP 执行的认证代码模块的位置和大小 。 * 请检查access-date=中的日期值 (帮助) TXT-capable chapet. * 验证当前电源管理配置是可以接受的. * 播放信息,以便能够保护内存和I/O免受其他处理器代理的活动的影响。 * 将指定的 AC 模块装入认证代码执行区域 。 * 将认证代码执行区的内容与外部代理的进一步状态修改隔离。 * 认证AC模块 。 * 以认证代码模块的散列更新了信任平台模块(TPM). * 根据认证的代码模块头信息初始化处理器状态 。 * 解锁Intel(R) TXT-capable 芯片私人配置注册空间和TPM 局部 3 空间. * 在指定的切入点开始执行已认证的代码模块 。

作为正确处理器硬件操作的完整检查,GETSEC[SENTER]的执行也会检查所有机器检查状态登记册的内容(如MSRs IA32 MCi STATUS所报告),以了解任何有效的无法纠正的错误条件. 此外,全球机器检查状态登记册IA32 MCG STATUS MCIP bit必须清除,IERR处理器包针(或其等价)不得断言,表明目前没有机器检查例外处理正在进行中. 这些检查有两次:一次由ILP在向RLPs广播汇合消息之前进行,后来是对RLPs确认汇合消息的回应. 在第一个检查点的机器检查状态登记册中存在任何未解决的无效的无法更正的机器检查错误条件,将导致ILP发出一般的保护违规信号. 如果在第二个检查点存在一个未解决的有效无法更正的机器检查错误条件,那么这将导致相应的逻辑处理器以12号错误代码来信号更为严重的TXT-shutdown条件.

在对目标代码模块进行加载和认证之前,处理器还检查当前电压和总线比编码是否与处理器支持的已知良好值相对应. MSR IA32 PERF STATUS 值与所支持的处理器最大操作目标设定,系统重置设置,或热监视器操作目标进行比较. 如果当前设置不符合任何这些标准,那么SENTER函数将试图以处理器特定的方式改变电压和总线比选择控制. 这种调整可能针对热监视器、最低(如果不同)或视处理器而定的最大操作目标。

这意味着一些由BIOS配置的热操作目标参数可能被SENTER压倒. 被测量的环境软件可能需要负责恢复被认为安全的,但不一定被SENTER承认的这种设置. 如果在发现超出范围设置时无法调整,处理器将中止所测发射. 对于这些值的芯片控制设置,或者在处理器上未启用可控性,可能就是这种情况. 在这种情况下,在SENTER执行之前,外部软件有责任将芯片电压ID和/或总线比选择的设置与处理器承认的已知良好值进行编程.

NOTE

对于移动处理器,可以根据热监视器操作目标进行调整. 对于四核处理器,SENTER调整机制可能会产生更保守但非统一电压的设置,这取决于每个核心的SENTER前置设置.

ILP和RLPs掩盖了对外部信号INIT#,A20M,NMI#和SMI#的断言的反应. 这种遮掩控制的目的是防止暴露于现有的外部事件处理器,直到一个受保护的处理器到位直接用于句柄这些事件. 通过GETSEC[EXITAC],GETSEC[SEXIT],GETSEC[SMCTRL],或用于特定的VMX相关操作,如VM条目或VMXOFF指令(详见各自的GETSEC 叶和Intel(R)64和IA-32架构软件开发者手册,Volume 3C),可以有条件或无条件地解密. A20M披针的状态被蒙上面具,并被内部逼迫到一个解塞状态,这样外部断言就不被承认. A20M 掩码, 由

GETSEC [SENTER] 只有在使用 GETSEC [SEXIT] 指令或处理器重置后,才被撤销。 INTR通过简单的清除EFLAGS.IF比特来遮掩. 通过EFLAGS的适当管理来控制处理器对INTR的反应是系统软件的责任.

为了防止其他(逻辑)处理器干扰在认证代码执行模式下运行的ILP,内存(不包括隐性回写交易)和源自其他处理器代理的I/O活动被屏蔽. 此保护从 ILP 进入认证代码执行模式时开始 。 只允许从 ILP 启动的内存和 I/O 交易进行。 退出认证的代码执行模式是通过执行 GETSEC [EXITAC]. 对内存和I/O活动的保护一直有效,直到ILP执行GETSEC[EXITAC].

一旦经认证的代码模块被装入经认证的代码执行区,就保护它不受外部总线snoops的进一步修改. 还有一项要求是认证代码模块地址范围的内存类型是WB(通过本指令执行前的MTURs初始化). 如果该条件不能满足,则属于违反安全性,处理器会强制TXT系统重置(在将错误代码写入芯片LT.ERRORCODE寄存器之后). 这个动作被称为Intel(R)TXT重置条件. 在认为通过常规例外报告机制发出错误信号不可靠时进行。

为了符合指定内存类型的MTRR MSR的最小颗粒性,认证代码RAM(ACRAM)分配到4096字节颗粒区块中的处理器. 如果 ECX 中指定的 AC 模块大小不是 4096 的倍数,那么处理器将分配到下一个 4096 字节边界,用于以 ACRAM 绘制不确定的数据. 认证的代码模块无法看到此页区域作为外部内存,也不能依赖用于填充页区域的数据值.

ILP完成成功认证后,计算出的散列存储在平台的可信存储设施中. 支持以下可信赖的存储设施:

* 如果平台注册 FTM INTERFACE ID. [bits 3:0] = 0,计算出的散列存储到平台的TPM

在 PCR17 此寄存器被默认重置后 。 PCR17是一个专用的寄存器,用于持有经认证的代码模块的计算散列,然后由GETSEC[SENTER]执行. 作为这一过程的一部分,动态PCR 18-22被重置,这样它们就可以被随后的软件用于代码和数据模块的注册.

* 如果平台注册 FTM INTERFACE ID. [bits 3:0] = 1,计算出的散列存储在信任的固件中

模块 (FTM) 使用类似于用于写入 TPM 的 PCR17 协议的修改协议.

在成功执行SENTER后,要么PCR17(如果未启用FTM),要么FTM(如果启用)包含AC代码和SENTER发射参数的测量.

在成功完成认证后,解锁了Intel(R) TXT-capable 芯片的私人配置空间,以便认证的代码模块和测量到的环境软件能够获得这个通常受限制的芯片状态. Intel(R) TXT 有能力的芯片私人配置空间以后可以通过软件写到芯片的LT.CMD.CLOSE-PRIVATE注册或无条件使用GETSEC[SEXIT]指令来锁定.

SENTER 叶函数也从被认证代码模块头部所持有的内容中初始化了ILP的一些处理器架构状态. 由于经认证的代码模块是可调用的,所有地址引用都相对通过EBX传递的基地址. ILP GDTR基值初始化为EBX + [GDTBasePtr],GDTR 限值设定为[GDTLimit]. CS选择器初始化为AC模块头字段 SegSel中持有的值,DS,SS,ES选择器初始化为CS+8. 片段描述符字段默认初始化为BASE=0,LIMIT=FFFh,G=1,D=1,P=1,S=1,读/写/访问DS,SS,ES,同时执行/读/访问CS. ILP的认证代码模块中执行开始于EIP集到EBX + [EntryPoint]. 用于初始化处理器状态的 AC 模块定义的字段被检查是否与导致 TXT-shutdown 条件的失败一致 。

表7-6提供了ILP和RLP(s)在成功完成GETSEC[SENTER]后处理器状态初始化的概要. 对于ILP和RLP(s),在进入测量环境时,page被禁用. ILP应建立一个可靠的呼号环境,并配有适当的绘图,以满足在启动所测环境时设定的保护要求。 RLP状态初始化工作直到后续的醒悟通过GETSEC[WAKEUP]功能由ILP执行后才能完成.

** GETSEC[SENTER]和GETSEC[WAKEUP]之后的注册国初始化**

| 注册国 | 在 GETSEC [SENTER] 之后的 ILP | 在 GETSEC [WAKEUP] 之后的 RLP |
| --- | --- | --- |
| CR0 | (一) PG0,AM0,WP0; 其他无改动 | PG0, CD0, NW0, AM0, WP0; PE1, NE1 |
| CR4 | 00004000H | 00004000H |
| EFLAGS | 00000002H | 00000002H |
| IA32_EFER | 0H | 0 |
| EIP | [来自 MLE 头部的 EntryPoint ] | [LT.MLE.JOIN + 12] |
| EBX | 未更改 [SINIT.BASE] | 未更改 |
| EDX | SENTER 控制旗 | 未更改 |
| EBP | SINIT.BASE | 未更改 |
| CS | 塞尔=[SINIT SegSel],基数=0,极限=FFFFFh,G=1,D=1,AR=9BH | 塞尔=[LT.MLE.JOIN + 8],基数=0,极限=FFFFFH,G=1,D=1,AR=9BH. |
| DS, ES, SS | 塞尔=[SINIT SegSel],+8,基数=0,极限=FFFh,G=1,D=1,AR=93H | 塞尔=[LT.MLE.JOIN + 8],+8,基数=0,极限=FFFFFH,G=1,D=1,AR=93H. |
| GDTR | 碱性=SINIT.base(EBX)+[SINIT.GDTBasePtr],限制=[SINIT.GDTLimit]. | 碱=[LT.MLE.JOIN + 4],限制=[LT.MLE.JOIN]. |
| DR7 | 00000400H | 00000400H |
| IA32_DEBUGCTL | 0H | 0H |
| 性能计数器 | 0H | 0H |
| 和反控 |  |  |
| 登记册 |  |  |
| IA32_MISC_ENABLE | 见表7-5。 | 见表7-5。 |
| IA32_SMM_MONITOR_ | 位数 20 | 位数 20 |
| CTL |  |  |

MSR IA32 EFER也作为SENTER初始化的处理器状态的一部分,对ILP和RLP均无条件清除. 由于page在进入认证代码执行模式时被禁用,如果要在使用认证代码执行模式时启用IA-32e模式,就必须重新建立新的page环境.

杂项特性控制MSR,IA32 MISC ENABLE,作为测量环境发射的一部分初始化. 这个 MSR 的某些比特被保存下来,因为保存这些比特对于维护先前建立的平台设置可能很重要. 见表7-5的脚注。 其余的字段已清理完毕,以便为执行经认证的代码模块建立一个更加一致的环境。 在初始化此 MSR 的影响中,MONITOR 指令确定的任何先前条件都将被清除.

MSR IA32 FEATURE CONTROL MSR的影响

IA32 FEATURE CONTROL MSR的比特15:8影响GETSEC[SENTER]的执行. 这些位由两个字段组成:

* 位15:执行SENTER的全局启用控制. * 位数 14: 8: 一个参数控制字段, 提供根据级别对 SENTER 执行进行限定的能力

用相应的 EDX 参数位数 6:0. 指定的函数。

IA32 FEATURE CONTROL MSR中的这些字段的布局见表7-1.

在GETSEC[SENTER]执行前,IA32 FEATURE CONTROL MSR的锁位必须设置位以确认要使用的设置. 一旦锁定位被设定,只有功率提升重置条件才能清除这个MSR. IA32 FEA-TURE CONTROL MSR必须按照平台初始化时的预期用途配置. 注意此 MSR 仅在 SMX 或 VMX 启用的处理器上可用. 否则,IA32 FEATURE CONTROL被视为保留.

英特尔(R)受托执行技术测量发射环境编程指南为编程测量环境软件在英特尔TXT平台发射提供了更多细节和要求.

在统一处理器平台上操作

(* 内部旗帜ACMODEFLAG和SENTERFLAG的状态持续跨越指令边界*)

GETSEC[SENTER] (ILP Only):

```text
IF (CR4.SMXE=0)
```

```text
    THEN #UD;
ELSE IF (in VMX non-root operation)
```

```text
    THEN VM Exit (reason="GETSEC instruction");
ELSE IF (GETSEC leaf unsupported)
```

```text
    THEN #UD;
ELSE IF ((in VMX root operation) or
```

(CR0.PE=0)或(CR0.CD=1)或(CR0.NW=1)或(CR0.NE=0)或(CPL>0)或(EFLAGS.VM=1)或(IA32_APIC_BASE.BSP=0)或(TXT芯片没有)或(SENTERFLAG=1)或(ACMODEFLAG=1)或(IN SMM=1)或(TPM接口没有)或(TPM接口没有)

```text
    (EDX  (SENTER_EDX_support_mask & EDX)) or
```

(IA32_FEATURE_CONTROL[0]=0) or (IA32_FEATURE_CONTROL[15]=0) or

```text
    ((IA32_FEATURE_CONTROL[14:8] & EDX[6:0])  EDX[6:0]))
```

```text
          THEN #GP(0);
IF (GETSEC[PARAMETERS].Parameter_Type = 5, MCA_Handling (bit 6) = 0)
```

```text
    FOR I = 0 to IA32_MCG_CAP.COUNT-1 DO
          IF IA32_MC[I]_STATUS = uncorrectable error
                THEN #GP(0);
```

FI;

OD; FI;

```text
IF (IA32_MCG_STATUS.MCIP=1) or (IERR pin is asserted)
```

```text
    THEN #GP(0);
ACBASE := EBX;
ACSIZE := ECX;
IF (((ACBASE MOD 4096)  0) or ((ACSIZE MOD 64)  0 ) or (ACSIZE < minimum
```

模块大小)或(ACSIZE > AC RAM容量)或((ACBASE+ACSIZE) >(2^32-1)).

```text
          THEN #GP(0);
```

A. 马斯克 SMI、INIT、A20M和NMI外部针事件; 信号TXTMsg(SENTER); 开始

```text
WHILE (no SignalSENTER message);
```

TXT SENTEER MSG EVENT (ILP & RLP): MS    z z z z 遮罩和清晰信号系统事件; 解密信号SEXIT事件;

```text
IF (in VMX operation)
```

```text
    THEN TXT-SHUTDOWN(#IllegalEvent);
FOR I = 0 to IA32_MCG_CAP.COUNT-1 DO
```

```text
    IF IA32_MC[I]_STATUS = uncorrectable error
          THEN TXT-SHUTDOWN(#UnrecovMCError);
```

FI; OD;

```text
IF (IA32_MCG_STATUS.MCIP=1) or (IERR pin is asserted)
```

```text
    THEN TXT-SHUTDOWN(#UnrecovMCError);
IF (Voltage or bus ratio status are NOT at a known good state)
```

```text
    THEN IF (Voltage select and bus ratio are internally adjustable)
          THEN
```

对操作参数进行具体产品调整;

```text
          ELSE
```

TXT-SHUTDOWN(#IIlegalVIDBRatio);

FI;

```text
IA32_MISC_ENABLE := (IA32_MISC_ENABLE & MASK_CONST*)
```

(* MASK CONST的十六进制值可能因处理器执行而异*)

```text
A20M := 0;
IA32_DEBUGCTL := 0;
```

无效处理器 TLB(s); 外流交易; 清除性能监测计数器和控制;

```text
SENTERFLAG := 1;
```

SignalTXTMsg(SENTERAck);

```text
IF (logical processor is not ILP)
```

```text
    THEN GOTO RLP_SENTER_ROUTINE;
```

(* ILP 等待所有逻辑处理器到 ACK *) DO

```text
    DONE := TXT.READ(LT.STS);
WHILE (not DONE);
```

SignalTXTMsg(SENTERContinue); SignalTXTMsg(ProcessorHold);

```text
FOR I=ACBASE to ACBASE+ACSIZE-1 DO
```

```text
    ACRAM[I-ACBASE].ADDR := I;
    ACRAM[I-ACBASE].DATA := LOAD(I);
```

OD;

```text
IF (ACRAM memory type  WB)
    THEN TXT-SHUTDOWN(#BadACMMType);
```

```text
IF (AC module header version is not supported) OR (ACRAM[ModuleType]  2)
    THEN TXT-SHUTDOWN(#UnsupportedACM);
```

```text
KEY := GETKEY(ACRAM, ACBASE);
KEYHASH := HASH(KEY);
CSKEYHASH := LT.READ(LT.PUBLIC.KEY);
IF (KEYHASH  CSKEYHASH)
```

```text
    THEN TXT-SHUTDOWN(#AuthenticateFail);
SIGNATURE := DECRYPT(ACRAM, ACBASE, KEY);
```

(* The value of SIGNATURE_LEN_CONST is implementation-specific*)

```text
FOR I=0 to SIGNATURE_LEN_CONST - 1 DO
```

```text
    ACRAM[SCRATCH.I] := SIGNATURE[I];
COMPUTEDSIGNATURE := HASH(ACRAM, ACBASE, ACSIZE);
FOR I=0 to SIGNATURE_LEN_CONST - 1 DO
```

```text
    ACRAM[SCRATCH.SIGNATURE_LEN_CONST+I] := COMPUTEDSIGNATURE[I];
IF (SIGNATURE  COMPUTEDSIGNATURE)
```

```text
    THEN TXT-SHUTDOWN(#AuthenticateFail);
ACMCONTROL := ACRAM[CodeControl];
IF ((ACMCONTROL.0 = 0) and (ACMCONTROL.1 = 1) and (snoop hit to modified line detected on ACRAM load))
```

```text
    THEN TXT-SHUTDOWN(#UnexpectedHITM);
IF (ACMCONTROL reserved bits are set)
```

```text
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[GDTBasePtr] < (ACRAM[HeaderLen] * 4 + Scratch_size)) OR
```

((ACRAM[GDTBasePtr] + ACRAM[GDTLimit]) >= ACSIZE))

```text
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACMCONTROL.0 = 1) and (ACMCONTROL.1 = 1) and (snoop hit to modified
```

在 ACRAM 载荷上检测到的行).

```text
    THEN ACEntryPoint := ACBASE+ACRAM[ErrorEntryPoint];
ELSE
    ACEntryPoint := ACBASE+ACRAM[EntryPoint];
IF ((ACEntryPoint >= ACSIZE) or (ACEntryPoint < (ACRAM[HeaderLen] * 4 + Scratch_size)))
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[SegSel] > (ACRAM[GDTLimit] - 15)) or (ACRAM[SegSel] < 8))
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[SegSel].TI=1) or (ACRAM[SegSel].RPL0))
    THEN TXT-SHUTDOWN(#BadACMFormat);
```

```text
IF (FTM_INTERFACE_ID.[3:0] = 1 ) (* Alternate FTM Interface has been enabled *)
    THEN (* TPM_LOC_CTRL_4 is located at 0FED44008H, TMP_DATA_BUFFER_4 is located at 0FED44080H *)
          WRITE(TPM_LOC_CTRL_4) := 01H; (* Modified HASH.START protocol *)
```

(* 写给固件存储 *)

```text
          WRITE(TPM_DATA_BUFFER_4) := SIGNATURE_LEN_CONST + 4;
          FOR I=0 to SIGNATURE_LEN_CONST - 1 DO
                WRITE(TPM_DATA_BUFFER_4 + 2 + I ) := ACRAM[SCRATCH.I];
          WRITE(TPM_DATA_BUFFER_4 + 2 + SIGNATURE_LEN_CONST) := EDX;
          WRITE(FTM.LOC_CTRL) := 06H; (* Modified protocol combining HASH.DATA and HASH.END *)
    ELSE IF (FTM_INTERFACE_ID.[3:0] = 0 ) (* Use standard TPM Interface *)
          ACRAM[SCRATCH.SIGNATURE_LEN_CONST] := EDX;
          WRITE(TPM.HASH.START) := 0;
          FOR I=0 to SIGNATURE_LEN_CONST + 3 DO
                WRITE(TPM.HASH.DATA) := ACRAM[SCRATCH.I];
          WRITE(TPM.HASH.END) := 0;
```

FI;

```text
ACMODEFLAG := 1;
CR0.[PG.AM.WP] := 0;
```

```text
CR4 := 00004000h;
EFLAGS := 00000002h;
IA32_EFER := 0;
EBP := ACBASE;
GDTR.BASE := ACBASE+ACRAM[GDTBasePtr];
GDTR.LIMIT := ACRAM[GDTLimit];
CS.SEL := ACRAM[SegSel];
CS.BASE := 0;
CS.LIMIT := FFFFFh;
CS.G := 1;
CS.D := 1;
CS.AR := 9Bh;
DS.SEL := ACRAM[SegSel]+8;
DS.BASE := 0;
DS.LIMIT := FFFFFh;
DS.G := 1;
DS.D := 1;
DS.AR := 93h;
SS := DS;
ES := DS;
DR7 := 00000400h;
IA32_DEBUGCTL := 0;
```

SignalTXTMsg(UnlockSMRAM); SignalTXTMsg(OpenPrivate); SignalTXTMsg(OpenLocality3);

```text
EIP := ACEntryPoint;
```

END;

电话: (RLP Only) Mask SMI, INIT, A20M,和 NMI 外部披针事件 Unmask SignalWAKEUP事件; 等待信号SENTER持续消息;

```text
IA32_APIC_BASE.BSP := 0;
```

GOTO SENTER睡眠状态; 2. END;

## 受影响的旗帜

所有旗帜都清空了.

Use of Prefixes

LOCK 原因 #UD. 中国植物物种信息数据库.

REP* 原因 #UD(包括REPNE/REPNZ和REP/REPE/REPZ).

操作数大小 原因 #UD. 中国植物物种信息数据库.

NP 66/F2/F3 前缀不允许使用.

线段覆盖已忽略 。

地址大小已忽略 。

REX                     Ignored.
