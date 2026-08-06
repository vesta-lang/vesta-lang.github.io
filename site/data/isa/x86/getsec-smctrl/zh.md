---
summary: SMX 模式控制
---

## 说明

GETSEC[SMCTRL]指令可用于执行某些SMX特定模式控制操作. 要执行的操作通过输入寄存器EBX选择. 目前仅支持输入值为0的EBX. 所有其他 EBX 设置都会导致一般保护侵权的信号.

如果 EBX 设置为 0,那么 SMCTRL 叶 用于重现 SMI 事件. SMI被执行GETSEC[SENTER]指令的ILP(SMI在响应SENTER会合消息的逻辑处理器中也被遮掩). 确定何时允许使用此指令以及解码事件取决于处理器上下文(见表7-11)。 为简洁,使用SMCTRL,其中EBX=0将称为GETSEC[SMCTRL(0)].

作为支持启动一个测量环境的一部分,SMI,NMI,和INIT事件在GETSEC[SENTER]后被蒙蔽,在退出认证的执行模式后仍被蒙蔽. 在揭开这些活动的假象的同时,应当使这些活动的处理者安全地发挥作用。 在VMX操作中,这些安全问题可以通过MVMM来解决.

自愿监测器可以选择两种方法:

* 在双监视器方法中,执行软件将设置SMM显示器与执行人VMM(即MVMM)平行,参见第34章"系统管理模式",Intel(R)64和IA-32架构软件开发者手册,第3C卷. SMM显示器专用于处理SMI事件而不损害MVMM的安全. 这种处理SMI在被测量环境活动时的用法模型不需要使用GETSEC[SMCTRL(0)],因为VMX环境发射后的事件重新启用被隐含地和通过单独的VMX控制处理.

* 如果不建立专用的 SMM 显示器,在测量范围内处理 SMI

环境,然后GETSEC[SMCTRL(0)]可以被执行软件用来重新启用由于SENTER而蒙面的SMI.

表7-11定义了GETSEC[SMCTRL(0)]可以使用的处理器上下文,以及哪些事件会被解析. 注意未装潢的事件取决于当前操作处理器上下文.

** 支持GETSEC[SMCTRL(0)]的行动**

| ILP 操作模式 | SMCTRL 执行动作 |
| --- | --- |
| 在 VMX 非根操作中 | VM 退出 |
| SENTERFLAG = 0 | #GP(0), 非法背景 |
| 在认证代码执行模式中 | #GP(0), 非法背景 |
| (ACMODEFLAG = 1) |  |
| SENTERFLAG = 1, 不在 VMX 操作中, 不在 SMM | 解开 SMI 任务 |
| SENTERFLAG = 1, 在 VMX 根操作中, 不在 | 如果 SMM 显示器没有配置, 请解密 SMI, 否则 #GP(0) |
| SMM |  |
| SENTERFLAG = 1, 在 VMX 根操作中, 在 SMM 中 | #GP(0), 非法背景 |
| GETSEC [SMCTRL]-SMX 模式控制 |  |
|  | SAFER MODE EXTENSIONS REFERENCE |

## 行动

```text
(* The state of the internal flag ACMODEFLAG and SENTERFLAG persist across instruction boundary *)
IF (CR4.SMXE=0)

    THEN #UD;
ELSE IF (in VMX non-root operation)

    THEN VM Exit (reason="GETSEC instruction");
ELSE IF (GETSEC leaf unsupported)

    THEN #UD;
ELSE IF ((CR0.PE=0) or (CPL>0) OR (EFLAGS.VM=1))

    THEN #GP(0);
ELSE IF((EBX=0) and (SENTERFLAG=1) and (ACMODEFLAG=0) and (IN_SMM=0) and

           (((in VMX root operation) and (SMM monitor not configured)) or (not in VMX operation)) )
    THEN unmask SMI;
ELSE
    #GP(0);
END
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

REX              Ignored.
