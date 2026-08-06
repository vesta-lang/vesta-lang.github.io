---
summary: 事件返回用户
---

## 说明

ERETU从事件处理器返回,根据堆栈的内容建立状态(典型的,是FRED事件交付前有效的状态). ERETU只有在CPL=0的情况下才能执行,它将CPL修改为3. 为此,ERETU用于处理CPL=3.

ERETU不采用明确的参数;其操作取决于正则堆栈的内容.

执行ERETU时,如果FRED的过渡没有被启用,或者CPL > 0,则导致无效的-操作码例外(#UD). 为此,ERETU只能以64位模式执行.

ERETU以三种不同方式之一确定了CS和SS的新值:

* 如果从堆栈中跳出的值对应 IA32 STAR [63:48] + 16 和

IA32 STAR [63:48] + 8,CS和SS分别加载了64位模式操作的标准值(类似由64位形式SYSCALL所建立的标准值).

* 如果从堆栈中跳出的值对应 IA32 STAR [63:48] 和 IA32 STAR [63:48] + 的值.

8,CS和SS分别被装入兼容模式下操作的标准值(类似由32位形式SYSCALL所建立的标准值).

* 否则, CS 和 SS 从 GDT 或 LDT 中装入 。

IRET的64位形式使用的方式。

详见下面的操作部分和第8.4.2节,"ERETU(Event Return to User)",载于Intel(R)64和IA-32架构软件开发者手册第3卷.

指令令. 执行ERETU后的指示可能在早先的指示完成执行之前从内存中获取,但是在ERETU前的所有指示完成执行之前不会执行(甚至推测)(以后的指示可能在先前的指示存储的数据变得全球可见之前执行).

## 行动

```text
IF CR4.FRED = 0 OR CS.L = 0 OR CPL > 0

     THEN #UD;

FI;

IF CSL > 0

     THEN #GP(0);

FI;

// pop old state from regular stack and check it

RSP := RSP + 8;              // skip over error code so that RSP references the return state

pop8B newRIP;

pop8B tempCS;

pop8B newRFLAGS;

pop8B newRSP;

pop8B tempSS;

IF tempCS & FFFFFFFF_FFFF0003H  3 OR              // enforce return to ring 3

     newRFLAGS & FFFFFFFF_FFC2B02AH  2 OR // enforce bit 1 set; IOPL, VM, reserved bits clear

     tempSS & FFF80003H  3                        // do not check bits 63:32

     THEN #GP(0);


FI;

pend_DB := tempSS[17];

NMI_unblock := tempSS[18];

IF tempCS[15:0] = IA32_STAR[63:48] + 16 AND tempSS[15:0] = IA32_STAR[63:48] + 8

     THEN                                   // Return to ring 3 in standard 64-bit configuration

     // set newCS to standard values used ring 3 in 64-bit mode

           newCS.selector := tempCS[15:0];

           newCS.base := 0;

           newCS.limit := FFFFFH;

           newCS.type := 11;

           newCS.S := 1;

           newCS.DPL := 3;

           newCS.P := 1;

           newCS.L := 1;

           newCS.D := 0;

           newCS.G := 1;

           newCS.unusable := 0;

     // set newSS to standard values for ring 3

           newSS.selector := tempSS[15:0];

           newSS.base := 0;

           newSS.limit := FFFFFH;

           newSS.type := 3;

           newSS.S := 1;

           newSS.DPL := 3;

           newSS.P := 1;

           newSS.B := 1;

           newSS.G := 1;

           newSS.unusable := 0;

ELSIF tempCS[15:0] = IA32_STAR[63:48] AND tempSS[15:0] = IA32_STAR[63:48] + 8

     THEN

     // set newCS to standard values used ring 3 in compatibility mode

           newCS.selector := tempCS[15:0];

           newCS.base := 0;

           newCS.limit := FFFFFH;

           newCS.type := 11;

           newCS.S := 1;

           newCS.DPL := 3;

           newCS.P := 1;

           newCS.L := 0;

           newCS.D := 1;

           newCS.G := 1;

           newCS.unusable := 0;

     // set newSS to standard values for ring 3

           newSS.selector := tempSS[15:0];

           newSS.base := 0;

           newSS.limit := FFFFFH;

           newSS.type := 3;

           newSS.S := 1;

           newSS.DPL := 3;

           newSS.P := 1;

           newSS.B := 1;

           newSS.G := 1;

           newSS.unusable := 0;

     ELSE


     load newCS using tempCS[15:0];          // load each as is done by IRET, including

     load newSS using tempSS[15:0];          // checks that may lead to a fault

FI;

IF newCS.L = 1

     THEN // return to 64-bit mode

     IF newRIP is not paging canonical

              THEN #GP(0);

     FI;

     ELSE // return to compatibility mode

     newRIP[63:32] := 0;

     IF newRIP is not within newCS's limit (based on limit field and G bit)

              // newRIP is always within the limit with standard values for ring 3 in compatibility mode

              THEN #GP(0);

     FI;

     newRSP[63:32] := 0;

FI;

// If user shadow stacks are enabled, check new SSP value on return to compatibility mode

IF CR4.CET = 1 AND IA32_U_CET.SH_STK_EN = 1 AND newCS.L = 0 AND IA32_PL3_SSP[63:32]  0

     THEN #GP(0);

FI;

// If supervisor shadow stacks are enabled, compare SSP to the FRED SSP MSR for stack level 0

IF CR4.CET = 1 AND IA32_S_CET.SH_STK_EN = 1 AND IA32_FRED_SSP0  SSP

     THEN #CP(FAR-RET/IRET);

FI;

// update registers for return state

RIP := newRIP;

RFLAGS := newRFLAGS;                       // ERETU can set RFLAGS.RF to 1

RSP := newRSP;                             // load all 64 bits regardless of new mode

CS := newCS;                               // selector and descriptor

SS := newSS;                               // selector and descriptor

CPL := 3;

// swap GS.base and IA32_KERNEL_GS_BASE

tempGSB := GS.base;

GS.base := IA32_KERNEL_GS_BASE;

IA32_KERNEL_GS_BASE := tempGSB;

IF CR4.CET = 1 AND IA32_U_CET.SH_STK_EN = 1

     THEN SSP := IA32_PL3_SSP;

FI;

// update event-related state

IF NMI_unblock = 1

     THEN unblock NMIs;

FI;

IF pend_DB = 1 AND RFLAGS.TF =1

     THEN pend a single-step debug exception (#DB) to be delivered after ERETU;

FI;
```

## 受影响的旗帜

RFLAGS登记册中所有定义的旗帜和字段,除了VM旗之外,都有潜在的修改.
