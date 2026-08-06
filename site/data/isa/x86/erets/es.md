---
summary: Evento Volver al Supervisor
---

## Descripción

ERETS regresa de un manipulador de eventos, estableciendo el estado basado en el contenido de la pila (típicamente, que estaba en vigor antes de la entrega de eventos FRED). ERETS se puede ejecutar sólo si CPL = 0, y no cambia CPL. Por esta razón, ERETS se utiliza para regresar de los eventos de manejo que ocurrieron mientras CPL = 0.

ERETS no toma argumentos explícitos; su funcionamiento depende del contenido de la pila regular y (cuando está habilitado) la pila de sombras.

La ejecución de ERETS causa una excepción de código de operación no válido (#UD) si las transiciones FRED no están habilitadas o si CPL > 0. Por esta razón, ERETS se puede ejecutar sólo en modo de 64 bits.

Sección 8.4.1, "ERETS (Event Return to Supervisor)," del Manual del desarrollador de software Intel(R) 64 e IA-32 Architectures, Volumen 3 incluye una discusión detallada de ERETS.

Ordenación de instrucciones. Las instrucciones después de la ejecución de ERETS pueden ser arrebatadas de memoria antes de que las instrucciones anteriores completen la ejecución, pero no ejecutarán (incluso especulativamente) hasta que todas las instrucciones anteriores a ERETS hayan completado la ejecución (las instrucciones posteriores pueden ejecutarse antes de que los datos almacenados por las instrucciones anteriores se hayan vuelto mundialmente visibles).

## Operación

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

## Banderas afectadas

Todas las banderas y campos definidos en el registro RFLAGS son potencialmente modificados excepto para la bandera VM.
