---
summary: Despertarse los procesadores de sueño en el medio seguro
---

## Descripción

La función GETSEC[WAKEUP] hoja transmite un mensaje de despertar a todos los procesadores lógicos actualmente en el estado de sueño SENTER. Este GETSEC hoja debe ser ejecutado sólo por el ILP, para despertar a los RLPs. Respondiendo a procesadores lógicos (RLPs) entrar en el estado de sueño SENTER después de la terminación de la secuencia de citas SENTER.

La instrucción GETSEC [WAKEUP] sólo puede ejecutarse:

* En un entorno medido como iniciado por la ejecución de GETSEC[SENTER]. * Fuera del modo de ejecución de código autenticado. * La ejecución no está permitida a menos que el procesador esté en modo protegido con CPL = 0 y EFLAGS.VM = 0. * Además, el procesador lógico debe ser designado como el procesador de arranque como configurado mediante el ajuste

IA32_APIC_BASE.BSP = 1.

Si estas condiciones no se cumplen, los intentos de ejecutar GETSEC[WAKEUP] resultan en una violación general de la protección.

Un RLP sale del estado de sueño SENTER y comienza la ejecución en respuesta a una señal WAKEUP iniciada por la ejecución de ILP de GETSEC[WAKEUP]. El RLP recupera un puntero a una estructura de datos que contiene información para permitir la ejecución desde un punto de entrada definido. Esta estructura de datos se encuentra utilizando una dirección física en el registro de configuración de chipsets Intel(R) TXTcapable LT.MLE.JOIN. El registro es de dominio público en el chipset por todos los procesadores y no está restringido por el estado de bloqueo de configuración de chipset compatible con Intel(R) TXT. El formato de esta estructura de datos se define en el cuadro 7-12.

Cuadro 7-12. RLP MVMM JOIN Data Structure 0 Field 4 GDT limit 8 GDT base pointer 12 selector de segmento inicializer EIP

La estructura de datos MLE JOIN contiene la información necesaria para inicializar el estado del procesador RLP y permitir al procesador unirse al entorno medido. Los valores de selección GDTR, LIP y CS, DS, SS y ES se inicializan utilizando esta estructura de datos. El índice de selector CS se deriva directamente del campo de inicialización el selector de segmento; Los selectores DS, SS y ES se inicializan a CS+8. Los campos descriptores de segmento se inicializan implícitamente con BASE = 0, LIMIT = FFFFFH, G = 1, D = 1, P = 1, S = 1; read/write/access for DS, SS, and ES; y ejecuta/read/access for CS. Es responsabilidad del software externo establecer una GDT señalada por la estructura de datos MLE JOIN que contiene entradas descriptoras compatibles con los ajustes implícitos inicializados por el procesador (ver Tabla 7-6). Ciertos estados del contenido de la tabla 7-12 son revisados para la consistencia por el procesador antes de la ejecución. Un fracaso de cualquier comprobación de consistencia resulta en la entrada de RLP abortando en el entorno protegido y señalando una condición de apagado Intel(R) TXT. Los cheques específicos realizados se documentan más adelante en esta sección. Después de completar con éxito los controles de consistencia de los procesadores y la inicialización posterior, la ejecución de RLP en el entorno medido comienza desde el punto de entrada en el offset 12 (como se indica en el cuadro 7-12).

## Operación

```text
(* The state of the internal flag ACMODEFLAG and SENTERFLAG persist across instruction boundary *)
IF (CR4.SMXE=0)

    THEN #UD;
ELSE IF (in VMX non-root operation)

    THEN VM Exit (reason="GETSEC instruction");
ELSE IF (GETSEC leaf unsupported)

    THEN #UD;
ELSE IF ((CR0.PE=0) or (CPL>0) or (EFLAGS.VM=1) or (SENTERFLAG=0) or (ACMODEFLAG=1) or (IN_SMM=0) or (in VMX operation) or
(IA32_APIC_BASE.BSP=0) or (TXT chipset not present))

    THEN #GP(0);
ELSE

    SignalTXTMsg(WAKEUP);
END;

RLP_SIPI_WAKEUP_FROM_SENTER_ROUTINE: (RLP Only)
WHILE (no SignalWAKEUP event);
IF (IA32_SMM_MONITOR_CTL[0]  ILP.IA32_SMM_MONITOR_CTL[0])

    THEN TXT-SHUTDOWN(#IllegalEvent)
IF (IA32_SMM_MONITOR_CTL[0] = 0)

    THEN Unmask SMI pin event;
ELSE

    Mask SMI pin event;
Mask A20M, and NMI external pin events (unmask INIT);
Mask SignalWAKEUP event;
Invalidate processor TLB(s);
Drain outgoing transactions;
TempGDTRLIMIT := LOAD(LT.MLE.JOIN);
TempGDTRBASE := LOAD(LT.MLE.JOIN+4);
TempSegSel := LOAD(LT.MLE.JOIN+8);
TempEIP := LOAD(LT.MLE.JOIN+12);
IF (TempGDTLimit & FFFF0000h)

    THEN TXT-SHUTDOWN(#BadJOINFormat);
IF ((TempSegSel > TempGDTRLIMIT-15) or (TempSegSel < 8))

    THEN TXT-SHUTDOWN(#BadJOINFormat);
IF ((TempSegSel.TI=1) or (TempSegSel.RPL0))

    THEN TXT-SHUTDOWN(#BadJOINFormat);
CR0.[PG,CD,NW,AM,WP] := 0;
CR0.[NE,PE] := 1;
CR4 := 00004000h;
EFLAGS := 00000002h;
IA32_EFER := 0;
GDTR.BASE := TempGDTRBASE;
GDTR.LIMIT := TempGDTRLIMIT;
CS.SEL := TempSegSel;
CS.BASE := 0;
CS.LIMIT := FFFFFh;
CS.G := 1;
CS.D := 1;
CS.AR := 9Bh;
DS.SEL := TempSegSel+8;
DS.BASE := 0;
DS.LIMIT := FFFFFh;
DS.G := 1;



DS.D := 1;
DS.AR := 93h;
SS := DS;
ES := DS;
DR7 := 00000400h;
IA32_DEBUGCTL := 0;
EIP := TempEIP;
END;
```

## Banderas afectadas

None.

Use of Prefixes

LOCK Causa #UD.

REP* Causa #UD (incluye REPNE/REPNZ y REP/REPE/REPZ).

Tamaño de operando Causa #UD.

No se permiten prefijos NP 66/F2/F3.

Segment anula Ignorado.

Tamaño de la dirección Ignorado.

REX                  Ignored.
