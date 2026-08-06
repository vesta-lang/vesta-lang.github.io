---
summary: 用户中断返回
---

## 说明

UIRET 从处理用户中断返回 。 无论CPL,都可以执行.

在交易区域内执行UIRET会导致交易中止;中止负载EAX,因为如果执行IRET的话.

UIRET可以通过建筑最后分支记录(LBRs),英特尔处理器追踪(英特尔PT)和性能监测来跟踪. 对于英特尔PT和LBR,UIRET的录制方式与IRET完全相同. 因此,对于LBR,UIRETs属于其他 BRANCH类别,这意味着必须设定IA32_LBR_CTL.OTHER_BRANCH[bit 22]来记录用户中断的发送,并且IA32 LBR x INFO.BR TYPE字段会为任何被记录的用户中断表示其他 BRANCH. 对于Intel PT,控制流跟踪必须通过设置IA32_RTIT_CTL.BranchEn[bit 13]来实现.

UIRET还将启用计数BR_INST_RETIRED.FAR_BRANCH的递增性能计数器.

## 行动

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

## 受影响的旗帜

见行动科。
