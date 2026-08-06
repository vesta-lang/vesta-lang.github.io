---
summary: Retorno interrumpido del usuario
---

## Descripción

UIRET regresa del manejo de una interrupción del usuario. Se puede ejecutar independientemente de CPL.

La ejecución de UIRET dentro de una región transaccional causa un aborto transaccional; el aborto carga EAX ya que habría sido debido a una ejecución de IRET.

UIRET puede ser rastreado por Architectural Last Branch Records (LBRs), Intel Processor Trace (Intel PT), y Performance Monitoring. Para Intel PT y LBRs, UIRET se registra de la misma manera que IRET. Por lo tanto, para LBRs, los UIRETs entran en la categoría OTHER BRANCH, lo que implica que IA32_LBR_CTL.OTHER_BRANCH[bit 22] debe establecerse para registrar la entrega interrumpida del usuario, y que el campo IA32 LBR x INFO.BR TYPE indicará OTHER BRANCH para cualquier interrupción del usuario registrada. Para Intel PT, el rastreo de flujo de control debe ser habilitado mediante el ajuste IA32_RTIT_CTL.BranchEn[bit 13].

UIRET también aumentará los contadores de rendimiento para los que cuenta BR_INST_RETIRED.FAR_BRANCH está habilitado.

## Operación

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

## Banderas afectadas

Vea la sección Operación.
