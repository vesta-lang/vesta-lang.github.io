---
summary: 返回主管
---

## 说明

ERETS从事件处理器返回,根据堆栈的内容建立状态(典型的,是FRED事件交付前有效的状态). ERETS只有在CPL=0的情况下才能执行,并且不会改变CPL. 为此,ERETS用于处理CPL=0.

ERETS不采用明确的参数;其操作取决于正则堆栈和(在启用时)阴影堆栈的内容.

执行ERETS时,如果FRED的过渡没有被启用,或者CPL > 0,则导致无效的-操作码例外(#UD). 为此,ERETS只能以64位模式执行.

Intel(R)64和IA-32 Architectures软件开发者手册第8.4.1节,"ERETS(Event Return to December)",第3卷包含了对ERETS的详细讨论.

指令令. 执行ERETS后的指示可能在早先的指示完成执行之前从内存中获取,但是在ERETS前的所有指示完成执行之前不会执行(甚至推测)(以后的指示可能在先前的指示存储的数据变得全球可见之前执行).

## 行动

```text
IF CR4.FRED = 0 OR CPL > 0

    THEN #UD;
FI;
// CR4.FRED = 1 and CPL = 0 implies IA32_EFER.LMA = CS.L = 1

// pop old state from regular stack and check it

RSP := RSP + 8;    // skip over error code so that RSP references the return state

pop8B newRIP;

pop8B tempCS;      // not used to load CS

pop8B newRFLAGS;

pop8B newRSP;

pop8B tempSS;      // not used to load SS

IF newRIP is not paging canonical OR

     tempCS & FFFFFFFF_FFF8FFFFH  current CS selector OR

     newRFLAGS & FFFFFFFF_FFC2802AH  2 OR                // enforce bit 1 set; VM, reserved bits clear

     tempSS & FFF8FFFFH  current SS selector OR          // do not check bits 63:32

     THEN #GP(0);

FI;

// ERETS will not numerically increase stack level
newCSL := min{CSL,tempCS[17:16]};
IBT_restore := tempCS[18];
STI_block := tempSS[16];
pend_DB := tempSS[17];
NMI_unblock := tempSS[18];


// If supervisor shadow stacks are enabled, pop and check values from the shadow stack

IF CR4.CET = 1 AND IA32_S_CET.SH_STK_EN = 1

     THEN

     IF SSP & 7  0                           // require 8-byte alignment

           THEN #CP(FAR-RET/IRET);

     FI;

     popSS_8B newSSP;

     popSS_8B checkSSLIP;

     popSS_8B checkSSCS;

     IF checkSSCS  tempCS                    // 64-bit compare

           OR checkSSLIP  newRIP

           OR newSSP & 3H  0

           THEN #CP(FAR-RET/IRET);

     FI;

     IF newSSP not CPU canonical

           THEN #GP(0);

     FI;

     // If the stack level is changing, compare SSP to the FRED SSP MSR for the old stack level

     IF newCSL < CSL AND IA32_FRED_SSPi  SSP // where i = CSL

           THEN #CP(FAR-RET/IRET);

     FI;

FI;

// update registers for return state

RIP := newRIP;

RFLAGS := newRFLAGS;                         // ERETS can set RFLAGS.RF to 1

RSP := newRSP;

CSL := newCSL;                               // reflect in IA32_FRED_CONFIG[1:0]

IF CR4.CET = 1 AND IA32_S_CET.SH_STK_EN = 1

     THEN SSP := newSSP;

FI;

IF CR4.CET = 1 AND IA32_S_CET.ENDBR_EN = 1 AND IA32_S_CET.SUPPRESS = 0 AND IBT_restore = 1

     THEN IA32_S_CET.TRACKER := 1;

FI;

// update event-related state
IF STI_block = 1 AND RFLAGS.IF = 1 AND STI blocking was not in effect prior to ERETS

    THEN establish STI blocking after ERETS;
FI;
IF pend_DB = 1 AND RFLAGS.TF =1

    THEN pend a single-step debug exception (#DB) to be delivered after ERETS;
FI;
IF NMI_unblock = 1

    THEN unblock NMIs;
FI;
```

## 受影响的旗帜

RFLAGS登记册中所有定义的旗帜和字段,除了VM旗之外,都有潜在的修改.
