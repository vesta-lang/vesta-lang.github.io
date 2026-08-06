---
summary: Evento Volver al Usuario
---

## Descripción

ERETU regresa de un manipulador de eventos, estableciendo el estado basado en el contenido de la pila (típicamente, que estaba en vigor antes de la entrega de eventos FRED). ERETU se puede ejecutar sólo si CPL = 0, y cambia CPL a 3. Por esta razón, ERETU se utiliza para regresar de los eventos de manejo que ocurrieron mientras CPL = 3.

ERETU no toma argumentos explícitos; su operación depende del contenido de la pila regular.

La ejecución de ERETU causa una excepción de código de operación no válido (#UD) si las transiciones FRED no están habilitadas o si CPL > 0. Por esta razón, ERETU se puede ejecutar sólo en modo de 64 bits.

ERETU establece nuevos valores de CS y SS de una de tres maneras diferentes:

* Si los valores saltados de la pila corresponden a los valores de IA32 STAR[63:48] + 16 y

IA32 STAR[63:48] + 8, respectivamente, CS y SS están cargados con valores estándar para la operación en modo de 64 bits (similar los establecidos por la forma de 64 bits de SYSCALL).

* Si los valores aparecidos de la pila corresponden a los valores de IA32 STAR[63:48] e IA32 STAR[63:48] +

8, respectivamente, CS y SS están cargados con valores estándar para el funcionamiento en modo de compatibilidad (similar los establecidos por la forma de 32 bits de SYSCALL).

* De lo contrario, CS y SS se cargan desde el GDT o LDT utilizando los selectores saltados de la pila (similar a la

la manera utilizada por la forma de 64 bits de IRET).

Para más detalles, consulte la sección de Operación a continuación y la sección 8.4.2, "ERETU (Event Return to User)," en el Manual de Desarrolladores de Software de Arquitectura Intel(R) 64 e IA-32, Volumen 3.

Ordenación de instrucciones. Las instrucciones después de la ejecución de ERETU pueden ser arrebatadas de memoria antes de que las instrucciones anteriores completen la ejecución, pero no ejecutarán (incluso especulativamente) hasta que todas las instrucciones anteriores a ERETU hayan completado la ejecución (las instrucciones posteriores pueden ejecutarse antes de que los datos almacenados por las instrucciones anteriores se hayan vuelto mundialmente visibles).

## Operación

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

## Banderas afectadas

Todas las banderas y campos definidos en el registro RFLAGS son potencialmente modificados excepto para la bandera VM.
