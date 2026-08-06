---
summary: 测量环境中的睡眠处理器
---

## 说明

GETSEC[WAKEUP]叶函数向目前SENTER睡眠状态下的所有逻辑处理器播送提醒消息. 此 GETSEC 叶 只能由 ILP 执行,以便唤醒 RLPs. 响应逻辑处理器(RLPs)在SENTER会合序列完成后进入SENTER睡眠状态.

GETSEC[WAKEUP]指令只能执行:

* 在GETSEC[SENTER]执行启动的测量环境中. * 在认证代码执行模式之外. * 除非处理器在保护模式中与CPL=0和EFLAGS.VM=0. * 此外,逻辑处理器必须指定为通过设置配置的启动陷阱处理器

IA32_APIC_BASE.BSP = 1.

如果不符合这些条件,试图执行GETSEC[WAKEUP]导致普遍违反保护。

RLP退出SENTER睡眠状态并开始执行,以应对ILP执行GETSEC[WAKEUP]启动的WAKEUP信号. RLP检索到一个指针到一个包含信息的数据结构,以便从指定的切入点执行. 这个数据结构的定位使用一个在Intel(R)TXTcapable芯片配置注册LT.MLE.JOIN中持有的物理地址. 该寄存器由所有处理器在芯片中公开书写,不受Intel(R)TXT-capable芯片配置寄存器锁状态的限制. 这一数据结构的格式定义于表7-12.

表 7-12的偏移情况 RLP MVMM JOIN 数据结构 0 场 4 GDT 极限 8 GDT 基点 12 段选择子 初始化器 EIP

MLE JOIN的数据结构包含了初始化RLP处理器状态的必要信息,并允许处理器加入被测量的环境. GDTR,LIP,以及CS,DS,SS,和ES选择器的数值都是使用这个数据结构初始化的. CS选择器指数直接来源于段选择子初始化场; 2. DS,SS,和ES选择器初始化为CS+8. 片段描述符字段以 BASE = 0, LIMIT = FFFFFH, G = 1, D = 1, P = 1, S = 1; 读/写/访问 DS, SS, ES; 执行/读/访问 CS. 外部软件有责任建立由MLE JOIN数据结构指向的GDT,其中包含与处理器初始化的隐含设置一致的描述词条目(见表7-6). 表7-12内容中的某些状态在执行前由处理器核对是否一致。 任何一致性检查的失败导致 RLP 中止进入受保护环境,并信号一个 Intel(R) TXT 关闭条件 。 具体检查情况见本节下文。 在成功完成处理器一致性检查并随后初始化后,RLP在测量环境中的执行从切入点开始,以抵消12(如表7-12所示).

## 行动

```text
(* The state of the internal flag ACMODEFLAG and SENTERFLAG persist across instruction boundary *)
IF (CR4.SMXE=0)

    THEN #UD;
ELSE IF (in VMX non-root operation)

    THEN VM Exit (reason="GETSEC instruction");
ELSE IF (GETSEC leaf unsupported)

    THEN #UD;
ELSE IF ((CR0.PE=0) or (CPL>0) or (EFLAGS.VM=1) or (SENTERFLAG=0) or (ACMODEFLAG=1) or (IN_SMM=0) or (in VMX operation) or
(IA32_APIC_BASE.BSP=0) or (TXT chipset not present))

    THEN #GP(0);
ELSE

    SignalTXTMsg(WAKEUP);
END;

RLP_SIPI_WAKEUP_FROM_SENTER_ROUTINE: (RLP Only)
WHILE (no SignalWAKEUP event);
IF (IA32_SMM_MONITOR_CTL[0]  ILP.IA32_SMM_MONITOR_CTL[0])

    THEN TXT-SHUTDOWN(#IllegalEvent)
IF (IA32_SMM_MONITOR_CTL[0] = 0)

    THEN Unmask SMI pin event;
ELSE

    Mask SMI pin event;
Mask A20M, and NMI external pin events (unmask INIT);
Mask SignalWAKEUP event;
Invalidate processor TLB(s);
Drain outgoing transactions;
TempGDTRLIMIT := LOAD(LT.MLE.JOIN);
TempGDTRBASE := LOAD(LT.MLE.JOIN+4);
TempSegSel := LOAD(LT.MLE.JOIN+8);
TempEIP := LOAD(LT.MLE.JOIN+12);
IF (TempGDTLimit & FFFF0000h)

    THEN TXT-SHUTDOWN(#BadJOINFormat);
IF ((TempSegSel > TempGDTRLIMIT-15) or (TempSegSel < 8))

    THEN TXT-SHUTDOWN(#BadJOINFormat);
IF ((TempSegSel.TI=1) or (TempSegSel.RPL0))

    THEN TXT-SHUTDOWN(#BadJOINFormat);
CR0.[PG,CD,NW,AM,WP] := 0;
CR0.[NE,PE] := 1;
CR4 := 00004000h;
EFLAGS := 00000002h;
IA32_EFER := 0;
GDTR.BASE := TempGDTRBASE;
GDTR.LIMIT := TempGDTRLIMIT;
CS.SEL := TempSegSel;
CS.BASE := 0;
CS.LIMIT := FFFFFh;
CS.G := 1;
CS.D := 1;
CS.AR := 9Bh;
DS.SEL := TempSegSel+8;
DS.BASE := 0;
DS.LIMIT := FFFFFh;
DS.G := 1;



DS.D := 1;
DS.AR := 93h;
SS := DS;
ES := DS;
DR7 := 00000400h;
IA32_DEBUGCTL := 0;
EIP := TempEIP;
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

REX                  Ignored.
