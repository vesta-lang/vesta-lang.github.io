---
summary: Event Return to Supervisor
---

## Description

ERETS returns from an event handler, establishing the state based on the contents of the stack (typically, that which was in effect before FRED event delivery). ERETS can be executed only if CPL = 0, and it does not change CPL. For this reason, ERETS is used to return from handling events that occurred while CPL = 0.

ERETS takes no explicit arguments; its operation depends on the contents of the regular stack and (when enabled) the shadow stack.

Execution of ERETS causes an invalid-opcode exception (#UD) if FRED transitions are not enabled or if CPL > 0. For this reason, ERETS can be executed only in 64-bit mode.

Section 8.4.1, "ERETS (Event Return to Supervisor)," of the Intel(R) 64 and IA-32 Architectures software developer's Manual, Volume 3 includes a detailed discussion of ERETS.

Instruction ordering. Instructions following execution of ERETS may be fetched from memory before earlier instructions complete execution, but they will not execute (even speculatively) until all instructions prior to ERETS have completed execution (the later instructions may execute before data stored by the earlier instructions have become globally visible).

## Operation

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

## Flags affected

All defined flags and fields in the RFLAGS register are potentially modified except for the VM flag.
