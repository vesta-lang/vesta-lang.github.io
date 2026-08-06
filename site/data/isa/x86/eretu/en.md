---
summary: Event Return to User
---

## Description

ERETU returns from an event handler, establishing the state based on the contents of the stack (typically, that which was in effect before FRED event delivery). ERETU can be executed only if CPL = 0, and it changes CPL to 3. For this reason, ERETU is used to return from handling events that occurred while CPL = 3.

ERETU takes no explicit arguments; its operation depends on the contents of the regular stack.

Execution of ERETU causes an invalid-opcode exception (#UD) if FRED transitions are not enabled or if CPL > 0. For this reason, ERETU can be executed only in 64-bit mode.

ERETU establishes new values of CS and SS in one of three different ways:

* If the values popped from the stack correspond to the values of IA32_STAR[63:48] + 16 and

IA32_STAR[63:48] + 8, respectively, CS and SS are loaded with standard values for operation in 64-bit mode (similar those established by the 64-bit form of SYSCALL).

* If the values popped from the stack correspond to the values of IA32_STAR[63:48] and IA32_STAR[63:48] +

8, respectively, CS and SS are loaded with standard values for operation in compatibility mode (similar those established by the 32-bit form of SYSCALL).

* Otherwise, CS and SS are loaded from the GDT or LDT using the selectors popped from the stack (similar to the

manner used by the 64-bit form of IRET).

For further details see the Operation section below and Section 8.4.2, "ERETU (Event Return to User)," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3.

Instruction ordering. Instructions following execution of ERETU may be fetched from memory before earlier instructions complete execution, but they will not execute (even speculatively) until all instructions prior to ERETU have completed execution (the later instructions may execute before data stored by the earlier instructions have become globally visible).

## Operation

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

## Flags affected

All defined flags and fields in the RFLAGS register are potentially modified except for the VM flag.
