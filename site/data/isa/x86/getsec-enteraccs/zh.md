---
summary: 执行认证的芯片集代码
---

## 说明

GETSEC[ENTERACCS]函数负载,认证,并使用Intel(R)TXT平台芯片的公用密钥执行认证的代码模块. GETSEC的ENTERACCS 叶在条目中被选中,EAX设置为2.

对执行GETSEC[ENTERACCS]指令的处理器有某些限制:

* 除非处理器以 保护模式 或 IA-32e 模式使用 CPL = 0 并

EFLAGS.VM = 0.

* 处理器缓存必须可用而不禁用,即CR0.CD和CR0.NW比特必须是0. * 对于包含多个逻辑处理器的处理器包,检查CR0.CD以确保一致性

在启用的逻辑处理器之间。

* 要使用 Interrupt 16 执行操作与数字例外报告的一致性, CR0.NE 必须是

set.

* 情报TXT- 必须通过对电源进行取样,将能动芯片传送给处理器。

重置后配置能力字段 。

* 处理器无法在先前启动的认证代码执行模式中

GETSEC [ENTERACCS] 或 GETSEC [SENTER] 指令,没有使用 GETSEC [EXITAC] 进行后续退出.

* 为了避免模式之间可能出现的可操作性冲突,不允许处理器执行此指令

if it currently is in SMM or VMX operation.

* 为了确保对 SIPI 信件的一致处理,执行 GETSEC [ENTERACCS] 指令的处理器

还必须指定 BSP (boot-strap 处理器),由 IA32_APIC_BASE.BSP (Bit 8) 定义。

不符合上述条件导致处理器发出一般保护例外信号。

在ENTERACCS 叶执行前,平台中的其他逻辑处理器,即RLP,必须是:

* 在一个等待- SIPI 状态中闲置( 由 INIT 断言发起, 或通过为指定的非 BSP 重置)

processors), or

* 在由启动逻辑处理器(ILP)的GETSEC[SENTER]启动的SENTER睡眠状态中.

如果同一包中的其他逻辑处理器(s)在这些状态中之一不闲置,则执行ENTERACCS表示一般保护例外. 如果同一包中的其他逻辑处理器没有CR0.CD=0.

ENTERACCS的成功执行导致ILP进入了认证的代码执行模式. 到达此点之前,处理器会进行几次检查. 其中包括:

* 建立和检查指定认证代码模块的位置和大小,由

processor.

* 隐藏 ILP 对外部事件的回应: INIT,A20M,NMI,和SMI. * 广播一个消息,以便保护内存和I/O免受其他处理器代理。 * 将指定的代码模块装入认证的代码执行区域 。 * 将认证代码执行区的内容从外部的进一步状态修改中隔离

agents.

* 认证认证的代码模块 。 * 根据认证代码模块中的信息初始化启动逻辑处理器状态

header.

* 解锁英特尔(R) TXT 有能力的芯片私人配置空间和 TPM 局部 3 空间.

* 在指定的切入点开始执行已认证的代码模块 。

GETSEC[ENTERACCS]函数需要在通用注册EBX和ECX中增加两个输入参数. EBX持有经认证的代码(AC)模块物理基址(AC模块必须位于物理地址空间的4GBytes以下),ECX持有AC模块大小(以字节表示). 物理基址和大小用于从系统内存中检索代码模块并将其加载到内部认证的代码执行区. 检查基本物理地址,以核实它位于一个modulo-4096字节边界上。 经核实,其大小为64倍,不超过内部认证的代码执行区容量(如GETSEC[CAPABILITIES]报告),且AC模块的顶部地址不超过32位. 错误条件导致认证代码执行启动中止,并发出一般保护例外信号。

作为正确处理器硬件操作的完整检查,GETSEC[ENTERACCS]的执行也会检查所有机器检查状态登记册的内容(如MSRs IA32 MCi STATUS所报告),以了解任何有效的无法纠正的错误条件. 此外,全球机器检查状态登记册IA32 MCG STATUS MCIP bit必须清除,IERR处理器包针(或其等价)不得断言,表示目前没有机器检查例外处理正在进行. 这些检查是在启动经认证的代码模块装载之前进行的。 此时这些状态登记册中存在的任何未解决的有效无法更正的机器检查错误条件,将会导致处理器发出一般的保护违规信号.

ILP掩盖了对外部信号INIT#,A20M,NMI#和SMI#的断言的反应. 这种蒙面动作一直活跃到GETSEC[EXITAC]可选解面(这个定义的解面行为假设GETSEC[ENTERACCS]没有被之前的GETSEC[SENTER]执行). 这种遮掩控制的目的是防止暴露于可能不受认证代码模块控制的现有外部事件处理器.

ILP设置了一个内部旗帜,以表示它已经进入了认证的代码执行模式. A20M披针的状态同样被蒙蔽,并被内部逼迫到一个解塞状态,这样任何外部断言在经过认证的代码执行模式中不被承认.

为了防止其他(逻辑)处理器干扰在认证代码执行模式下运行的ILP,内存(不包括隐性回写交易)访问和源自其他处理器代理的I/O被封锁. 此保护从 ILP 进入认证代码执行模式时开始 。 只允许从 ILP 启动的内存和 I/O 交易进行。 退出认证的代码执行模式是通过执行 GETSEC [EXITAC]. 对内存和I/O活动的保护一直有效,直到ILP执行GETSEC[EXITAC].

在使用 GETSEC [ENTERACCS] 或 GETSEC [SENTER] 启动经认证的执行模块之前,处理器的MTRR(Memory Type Range Registers)必须首先初始化,将经认证的RAM地址映射为WB(writeback). 不这样做可能会影响处理器保持加载认证代码模块隔离的能力. 如果处理器检测不到这一要求,它将在加载经认证的代码模块时以错误代码信号一个Intel(R)TXT重置条件.

虽然负载模块内的物理地址必须被映射为WB,但模块边界外位置的内存类型必须被映射为GETSEC[PARAME-TERS](或作为默认的UC)返回的支持内存类型之一.

为了符合指定内存类型的MTRR MSR的最小颗粒性,认证代码RAM(ACRAM)分配到4096字节颗粒区块中的处理器. 如果 ECX 中指定的 AC 模块大小不是 4096 的倍数,那么处理器将分配到下一个 4096 字节边界,用于以 ACRAM 绘制不确定的数据. 认证的代码模块无法看到此页区域作为外部内存,也不能依赖用于填充页区域的数据值.

在成功完成GETSEC[ENTERACCS]时,处理器的建筑状态从被认证代码模块头所持有的内容部分初始化. 处理器GDTR,CS,DS选择器从认证代码模块内的字段初始化. 由于经认证的代码模块必须可重新调用,所有地址引用必须相对于EBX中经认证的代码模块基地址. 处理器GDTR基值初始化为AC模块头字段GDTBasePtr + 模块基地址在EBX中持有,GDTR限值设定为GDTLimit字段的值. CS选择器初始化为AC模块头 SegSel字段,而DS选择器初始化为CS+8. 段描述符字段默认初始化为BASE=0,LIMIT=FFFh,G=1,D=1,P=1,S=1,读/写DS的访问,执行/读CS的访问. 处理器以EIP集开始经认证的代码模块执行,到AC模块头端的Enterpoint字段+模块基址(EBX). 用于初始化处理器状态的基于 AC 模块的字段会被检查是否一致,任何失败都会导致关闭状态.

GETSEC[ENTERACCS]成功完成后,对处理器的注册状态初始化情况汇总见表7-4. 输入经认证的代码执行模式时已禁用 。 经认证的代码模块被加载,最初使用物理地址执行. GETSEC[ENTERACCS]执行后,系统软件应建立一个新的(或恢复其先前的)呼呼环境,并配有适当的映射,以满足新的保护要求. EBP被初始化为经认证的代码模块基础物理地址,用于在经认证的环境中初始执行. 因此,由于经认证的代码模块必须位置独立,因此可以参考EBP进行相对基于地址的引用.

** GETSEC [ENTERACCS] 之后的注册国**

| 注册国 | 初始化状态 | 注释 |
| --- | --- | --- |
| CR0 | PG0, AM0, WP0 坐标: 其他无改动 | 呼叫、对齐检查、写保护被禁用。 |
| CR4 | MCE0, CET0, PCIDE0, FRED0: q: 其他人员 | 机器检查例外、控制流执行技术、进程文本 |
|  | 不变 | 识别器, FRED 已禁用 。 |
| EFLAGS | 00000002H |  |
| IA32_EFER | 0H | IA-32e模式已禁用. |
| EIP | AC.base + 条目点 | AC.base在EBX中作为输入GETSEC[ENTERACCS]. |
| [E\|R]BX | 前 ENTERACCS 状态 : GETSEC [ENTERACCS] 之前的下一个 [E\|R]IP | 横跨 GETSEC[ENTERACCS]的向前64位处理器状态. |
| ECX | 前ENTERACCS状态: [31:16]=GDTR.limit; [15:0]=CS.sel | 横跨GETSEC[ENTERACCS]的前进处理器状态. |
| [E\|R]DX | 前 ENTERACCS 状态 : GDTR 基数 | 横跨 GETSEC[ENTERACCS]的向前64位处理器状态. |
| EBP | AC.base 坐标 |  |
| CS | SEL=[SegSel],基数=0,极限=FFFh,G=1,D=1,AR=9BH. |  |
| DS | SEL=[SegSel]+8,基数=0,极限=FFFh,G=1,D=1,AR=93H |  |
| GDTR | 碱性=AC.base(EBX)+[GDTBasePtr],限制=[GDTLimit] |  |
| DR7 | 00000400H |  |
| IA32_DEBUGCTL | 0H |  |
| IA32_MISC_ENABLE | 例如,见表7-5。 | 由于处理器的执行,初始化字段的数目可能会发生变化。 |
| 业绩 | 0H |  |
| 计数器和计数器 |  |  |
| 控制登记册 |  |  |

与性能有关的柜台和柜台控制登记册作为执行ENTERACCS的一部分予以清理。 这意味着ENTERACCS执行时任何时候的任何活动性能计数器都将被禁用. 要反应处理器性能计数器,这种状态必须重新初始化并重新启用.

IA32 MISC ENABLE MSR 进入认证执行模式后初始化. 此 MSR 的某些位之所以被保留,是因为保存这些位对于维护先前建立的平台设置可能很重要(见表7-5的脚注). 其余的比特被清除,目的是为经认证的代码模块的执行建立一个更加一致的环境. 这个 MSR 初始化的影响之一是 MONITOR 指令确定的任何先前条件将被清除.

为了支持在GETSEC[ENTERACCS]执行前可能返回处理器架构状态,在指令完成时会捕获某些关键处理器状态并存储在通用登记簿中. [EXXR]BX拥有在GETSEC[ENTERACCS],ECX[15:0]执行之后下一个执行指令的有效地址([EXXR]IP),ECX[31:16]持有GDTR限制域,[EXXXR]DX持有GDTR基域. 之后经过认证的代码可以保存这些注册簿的内容,以便在需要时,在GETSEC[EXITAC]退出经过认证的代码执行模式之前,可以手动恢复此状态. 对于退出认证代码执行模式后的处理器状态,参见GETSEC[SEXIT]的描述.

**IA32 MISC ENABLE MSR 初始化1 由 ENTERACCS 和 SENTER **

| 外地 | 位位置 | 说明 |
| --- | --- | --- |
| 启用快速字符串 | 0 | 清除到0。 |
| FOPCODE 兼容模式 | 2 | 清除到0。 |
| 启用 |  |  |
| 启用热监视器 | 3 | 如果未启用其他热监测能力,则设定为1。 |
| 拆分锁禁用 | 4 | 清除到0。 |
| 缓存线的巴士锁定 | 8 | 清除到0。 |
| 禁用 |  |  |
| 硬件预置禁用 | 9 | 清除到0。 |
| GV1/2 遗产启用 | 15 | 清除到0。 |
| MONITOR/MWAIT s/m 启用 | 18 | 清除到0。 |
| 相邻扇区预切禁用 | 19 | 清除到0。 |

在统一处理器平台上操作

(* 内部旗帜ACMODEFLAG的状态持续跨越指令边界*)

```text
IF (CR4.SMXE=0)
```

```text
    THEN #UD;
```

ELSIF(在 VMX 非根操作中)

```text
    THEN VM Exit (reason="GETSEC instruction");
```

ELSIF (GETSEC 叶 不支持)

```text
    THEN #UD;
```

ELSIF ((in VMX operation) or

(CR0.PE=0)或(CR0.CD=1)或(CR0.NW=1)或(CR0.NE=0)或(CPL>0)或(EFLAGS.VM=1)或(IA32_APIC_BASE.BSP=0)或(TXT芯片没有)或(ACMODEFLAG=1)或(IN SMM=1).

```text
          THEN #GP(0);
IF (GETSEC[PARAMETERS].Parameter_Type = 5, MCA_Handling (bit 6) = 0)
```

```text
    FOR I = 0 to IA32_MCG_CAP.COUNT-1 DO
          IF (IA32_MC[I]_STATUS = uncorrectable error)
                THEN #GP(0);
```

OD; FI;

```text
IF (IA32_MCG_STATUS.MCIP=1) or (IERR pin is asserted)
```

```text
    THEN #GP(0);
ACBASE := EBX;
ACSIZE := ECX;
IF (((ACBASE MOD 4096)  0) or ((ACSIZE MOD 64 )  0 ) or (ACSIZE < minimum module size) OR (ACSIZE > authenticated RAM
```

capacity)) or ((ACBASE+ACSIZE) > (2^32 -1)))

```text
    THEN #GP(0);
IF (secondary thread(s) CR0.CD = 1) or ((secondary thread(s) NOT(wait-for-SIPI)) and
```

(二级线程不在 SENTER 睡眠状态)

```text
    THEN #GP(0);
```

A. 马斯克 SMI、INIT、A20M和NMI外部针事件;

```text
IA32_MISC_ENABLE := (IA32_MISC_ENABLE & MASK_CONST*)
```

(* MASK CONST的十六进制值可能因处理器执行而异*)

```text
A20M := 0;
IA32_DEBUGCTL := 0;
```

无效处理器 TLB(s); 排水业务;

```text
ACMODEFLAG := 1;
```

信号TXTMessage(处理器包); A. 根据AC模块大小装载内部的ACRAM; (* 确保所有 ACRAM 负载击中回写内存空间 *)

```text
IF (ACRAM memory type  WB)
    THEN TXT-SHUTDOWN(#BadACMMType);
IF (AC module header version isnot supported) OR (ACRAM[ModuleType]  2)
    THEN TXT-SHUTDOWN(#UnsupportedACM);
```

(* 认证 AC 模块,如果失败则关闭错误 )

```text
KEY := GETKEY(ACRAM, ACBASE);
KEYHASH := HASH(KEY);
CSKEYHASH := READ(TXT.PUBLIC.KEY);
IF (KEYHASH  CSKEYHASH)
    THEN TXT-SHUTDOWN(#AuthenticateFail);
SIGNATURE := DECRYPT(ACRAM, ACBASE, KEY);
```

(* The value of SIGNATURE_LEN_CONST is implementation-specific*)

```text
FOR I=0 to SIGNATURE_LEN_CONST - 1 DO
    ACRAM[SCRATCH.I] := SIGNATURE[I];
```

```text
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
IF ((ACMCONTROL.0 = 1) and (ACMCONTROL.1 = 1) and (snoop hit to modified line detected on ACRAM load))
    THEN ACEntryPoint := ACBASE+ACRAM[ErrorEntryPoint];
ELSE
    ACEntryPoint := ACBASE+ACRAM[EntryPoint];
IF ((ACEntryPoint >= ACSIZE) OR (ACEntryPoint < (ACRAM[HeaderLen] * 4 + Scratch_size)))THEN TXT-SHUTDOWN(#BadACMFormat);
IF (ACRAM[GDTLimit] & FFFF0000h)
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[SegSel] > (ACRAM[GDTLimit] - 15)) OR (ACRAM[SegSel] < 8))
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[SegSel].TI=1) OR (ACRAM[SegSel].RPL0))
    THEN TXT-SHUTDOWN(#BadACMFormat);
CR0.[PG.AM.WP] := 0;
CR4.MCE := 0;
ACRAM[CR4High].FRED := CR4.FRED;
CR4.FRED := 0;
EFLAGS := 00000002h;
IA32_EFER := 0h;
[E|R]BX := [E|R]IP of the instruction after GETSEC[ENTERACCS];
ECX := Pre-GETSEC[ENTERACCS] GDT.limit:CS.sel;
[E|R]DX := Pre-GETSEC[ENTERACCS] GDT.base;
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
DR7 := 00000400h;
IA32_DEBUGCTL := 0;
```

SignalTXTMsg(OpenPrivate); SignalTXTMsg(OpenLocality3);

```text
EIP := ACEntryPoint;
```

END;

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
