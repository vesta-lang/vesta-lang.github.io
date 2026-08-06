---
summary: 退出测量环境
---

## 说明

GETSEC[SEXIT]指令启动 GETSEC[SENTER]确定的测量环境退出. GETSEC的SEXIT 叶被选中,执行时EAX被设定为5. 这个指令叶向平台上的所有逻辑处理器发送一个消息,以信号所测量的环境退出.

执行 GETSEC [SEXIT] 指令的处理器有执行限制 :

* 除非处理器位于 保护模式 (CR0.PE = 1),否则不允许执行 CPL = 0 和 EFLAGS.VM 。

= 0.

* 处理器必须处于先前的GETSEC[SENTER]指令所启动的测量环境中,

但还没有进入认证代码执行模式。

* 为了避免模式之间潜在的互操作性冲突,不允许处理器执行此操作

instruction if it currently is in SMM or in VMX operation.

* 为了确保对 SIPI 信件的一致处理,执行 GETSEC [SEXIT] 指令的处理器必须

也指定由寄存器位点 IA32_APIC_BASE.BSP(位8)定义的 BSP(bootstrap处理器).

不遵守上述条件导致处理器表示普遍违反保护规定。

本指令启动一个序列,使 RLPs 与 ILP 相会. 然后它清除内部处理器旗,表示处理器在被测量的环境中运行.

针对一个信号完成会合的訊息,所有RLPs在GETSEC[SEXIT]确认时要执行的指令重新开始执行. 这适用于所有处理器条件,但以下除外:

* 如果一个 RLP 执行 HLT 并在 GETSEC [SEXIT] 启动信件时处于此停止状态, 那么

执行恢复状态。

* 如果 RLP 正在执行 MWAIT, 那么 GETSEC [SEXIT] 启动的一条消息会导致 MWAIT 退出 。

进入下一个指令。

* 如果 RLP 正在执行字符串指令的中间迭代, 那么处理器将恢复执行

,在GETSEC[SEXIT]启动的信件被识别的点的字符串指示。

* 如果一个RLP仍然处于SENTER睡眠状态(从未用GETSEC[WAKEUP]唤醒),它将被发送到等待...

for-SIPI 状态,在第一次清除靴子处理器指标旗(IA32_APIC_BASE.BSP)和任何待定的SIPI状态后。 在这种情况下,这种RLP被初始化为符合使用INIT#pin的软重置的建筑状态.

在GETSEC[SEXIT]操作完成之前,ILP和任何活跃的RLPs都解析了外部事件信号INIT#,A20M,NMI#和SMI#的反应. 这种脱假是为了无条件识别在GETSEC[SENTER]后蒙面的针状事件。 A20M的状态是解密的,因为A20M的披针在测量到的环境活跃时不被识别.

在被测量环境的成功退出时,ILP重新锁定了Intel(R)TXT-capable芯片私人配置空间. GETSEC[SEXIT]不影响任何PCR的内容.

GETSEC[SEXIT]由ILP完成后,执行开始到下一个指令. 由于 EFLAGS 和调试寄存器状态不被此指令修改,如果先前启用,则一个待发的陷阱条件可以自由信号.

在统一处理器平台上操作

(* 内部旗帜ACMODEFLAG和SENTERFLAG的状态持续跨越指令边界*)

GETSEC[SEXIT] (ILP Only):

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

(CR0.PE=0)或(CPL>0)或(EFLAGS.VM=1)或(IA32_APIC_BASE.BSP=0)或(TXT芯片没有)或(SENTERFLAG=0)或(ACMODEFLAG=1)或(IN SMM=1).

```text
          THEN #GP(0);
```

SignalTXTMsg(SEXIT); DO

```text
WHILE (no SignalSEXIT message);
```

TXT SEXIT MSG EVENT(ILP & RLP) : (中文(简体) ). 遮罩和清除信号SEXIT事件; 清除 MONITOR FSM; 2. 解析信号系统事件;

```text
IF (in VMX operation)
```

```text
    THEN TXT-SHUTDOWN(#IllegalEvent);
```

SignalTXTMsg(SEXITAck);

```text
IF (logical processor is not ILP)
```

```text
    THEN GOTO RLP_SEXIT_ROUTINE;
```

(* ILP 等待所有逻辑处理器到 ACK *) DO

```text
    DONE := READ(LT.STS);
WHILE (NOT DONE);
```

SignalTXTMsg(SEXITContinue); SignalTXTMsg(ClosePrivate);

```text
SENTERFLAG := 0;
```

解析 SMI, INIT, A20M, 和 NMI 外部针头事件; END;

RLP SEXIT ROUTINE(仅限RLPs): 等待信号SEXITCONTINUE消息; 解析 SMI, INIT, A20M, 和 NMI 外部针头事件;

```text
IF (prior execution state = HLT)
```

```text
    THEN reenter HLT state;
IF (prior execution state = SENTER sleep)
```

```text
    THEN
          IA32_APIC_BASE.BSP := 0;
```

清除待定的 SIPI 状态; 拨打INIT PROCESSOR STAE; 解析 SIPI 事件; (一) GOTO WAIT-FOR-SIPI;

FI; END;

## 受影响的旗帜

ILP : (英语). 无。 RLPs : (英语). 所有旗帜都修改为 RLP 。 返回等待- SIPI 状态, 没有其它状态 。

Use of Prefixes

LOCK 原因 #UD. 中国植物物种信息数据库.

REP* 原因 #UD(包括REPNE/REPNZ和REP/REPE/REPZ).

操作数大小 原因 #UD. 中国植物物种信息数据库.

NP 66/F2/F3 前缀不允许使用.

线段覆盖已忽略 。

地址大小已忽略 。

REX              Ignored.
