---
summary: User-Interrupt Return
---

## Description

UIRET returns from the handling of a user interrupt. It can be executed regardless of CPL.

Execution of UIRET inside a transactional region causes a transactional abort; the abort loads EAX as it would have had it been due to an execution of IRET.

UIRET can be tracked by Architectural Last Branch Records (LBRs), Intel Processor Trace (Intel PT), and Performance Monitoring. For both Intel PT and LBRs, UIRET is recorded in precisely the same manner as IRET. Hence for LBRs, UIRETs fall into the OTHER_BRANCH category, which implies that IA32_LBR_CTL.OTHER_BRANCH[bit 22] must be set to record user-interrupt delivery, and that the IA32_LBR_x_INFO.BR_TYPE field will indicate OTHER_BRANCH for any recorded user interrupt. For Intel PT, control flow tracing must be enabled by setting IA32_RTIT_CTL.BranchEn[bit 13].

UIRET will also increment performance counters for which counting BR_INST_RETIRED.FAR_BRANCH is enabled.

## Operation

```text
    Pop tempRIP;
    Pop tempRFLAGS; // see below for how this is used to load RFLAGS
    Pop tempRSP;
    IF tempRIP is not canonical in current paging mode

          THEN #GP(0);
    FI;
    IF ShadowStackEnabled(CPL)

          THEN
                PopShadowStack SSRIP;

             IF SSRIP  tempRIP

                      THEN #CP (FAR-RET/IRET);
                FI;
    FI;
    RIP := tempRIP;
    // update in RFLAGS only CF, PF, AF, ZF, SF, TF, DF, OF, NT, RF, AC, and ID
    RFLAGS := (RFLAGS & ~254DD5H) | (tempRFLAGS & 254DD5H);
    RSP := tempRSP;
    IF CPUID.07H.01H:EDX.UIRET_UIF[17] = 1
          THEN UIF := tempRFLAGS[1];
          ELSE UIF := 1;
    FI;
    Clear any cache-line monitoring established by MONITOR or UMONITOR;
```

## Flags affected

See the Operation section.
