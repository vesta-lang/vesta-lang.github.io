---
summary: Exit Measured Environment
---

## Descripción

La instrucción GETSEC[SEXIT] inicia una salida de un entorno medido establecido por GETSEC[SENTER]. El SEXIT hoja de GETSEC es seleccionado con EAX fijado a 5 en ejecución. Esta instrucción hoja envía un mensaje a todos los procesadores lógicos en la plataforma para indicar la salida del medio ambiente medida.

Existen restricciones impuestas por el procesador para la ejecución de la instrucción GETSEC[SEXIT]:

* La ejecución no está permitida a menos que el procesador esté en modo protegido (CR0.PE = 1) con CPL = 0 y EFLAGS.VM

= 0.

* El procesador debe estar en un entorno medido como lanzado por una instrucción anterior GETSEC[SENTER],

pero no todavía en modo de ejecución de código autenticado.

* Para evitar posibles conflictos de interoperabilidad entre modos, no se permite al procesador ejecutar esto

instruction if it currently is in SMM or in VMX operation.

* Para asegurar el manejo constante de los mensajes SIPI, el procesador que ejecuta la instrucción GETSEC[SEXIT] debe

También se designa el BSP (procesador de arranque) definido por el bit de registro IA32_APIC_BASE.BSP (bit 8).

El incumplimiento de las condiciones anteriores da lugar al procesador señalando una violación general de la protección.

Esta instrucción inicia una secuencia para reunir a los RLP con el ILP. Luego aclara la bandera del procesador interno indicando que el procesador está operando en un ambiente medido.

En respuesta a un mensaje que indica la conclusión de la citación, todos los RLP reiniciaron la ejecución con la instrucción que debía ejecutarse en el momento en que se reconoció GETSEC[SEXIT]. Esto se aplica a todas las condiciones del procesador, con las siguientes excepciones:

* Si un RLP ejecutó HLT y estaba en este estado de detención en el momento del mensaje iniciado por GETSEC[SEXIT], entonces

La ejecución se reanudará en el estado de detención.

* Si un RLP estaba ejecutando MWAIT, entonces un mensaje iniciado por GETSEC[SEXIT] causa una salida del MWAIT

estado, cayendo a la siguiente instrucción.

* Si un RLP estaba ejecutando una iteración intermedia de una instrucción de cadena, entonces el procesador reanudará la ejecución

de la instrucción de cadena en el punto que el mensaje iniciado por GETSEC[SEXIT] fue reconocido.

* Si un RLP todavía está en el estado de sueño SENTER (nunca despierto con GETSEC[WAKEUP]), será enviado a la espera-

para el estado de SIPI después de limpiar primero la bandera del indicador del procesador de arranque (IA32_APIC_BASE.BSP) y cualquier estado SIPI pendiente. En este caso, estos RLP se inicializan a un estado arquitectónico consistente con haber tomado un reinicio suave utilizando el pin INIT#.

Antes de la terminación de la operación GETSEC[SEXIT], tanto el ILP como cualquier RLP activo desenmascaran la respuesta de las señales de eventos externos INIT#, A20M, NMI# y SMI#. Este desenmascaramiento se realiza incondicionalmente para reconocer los eventos de pin que están enmascarados después de un GETSEC[SENTER]. El estado de A20M está desenmascarado, ya que el pin A20M no es reconocido mientras el ambiente medido es activo.

En una salida exitosa del entorno medido, el ILP re-bloquea el espacio de configuración privado de chipset compatible con Intel(R) TXT. GETSEC[SEXIT] no afecta el contenido de ningún PCR.

Al completar GETSEC[SEXIT] por el ILP, la ejecución procede a la siguiente instrucción. Dado que EFLAGS y el estado de registro de depuración no son modificados por esta instrucción, una condición de trampa pendiente es libre de ser señalizado si previamente habilitado.

Funcionamiento en una Plataforma de Procesadores Uni

(* El estado de la bandera interna ACMODEFLAG y SENTERFLAG persisten en el límite de instrucción *)

GETSEC[SEXIT] (ILP Only):

```text
IF (CR4.SMXE=0)
```

```text
    THEN #UD;
ELSE IF (in VMX non-root operation)
```

```text
    THEN VM Exit (reason="GETSEC instruction");
ELSE IF (GETSEC leaf unsupported)
```

```text
    THEN #UD;
ELSE IF ((in VMX root operation) or
```

(CR0.PE=0) or (CPL>0) or (EFLAGS.VM=1) or (IA32_APIC_BASE.BSP=0) or (TXT chipset not present) or (SENTERFLAG=0) or (ACMODEFLAG=1) or (IN SMM=1))

```text
          THEN #GP(0);
```

SignalTXTMsg(SEXIT); DO

```text
WHILE (no SignalSEXIT message);
```

TXT SEXIT MSG EVENT (ILP &amp; RLP): Máscara y evento SignalSEXIT claro; Clear MONITOR FSM; Unmask SignalsENTER event;

```text
IF (in VMX operation)
```

```text
    THEN TXT-SHUTDOWN(#IllegalEvent);
```

SignalTXTMsg(SEXITAck);

```text
IF (logical processor is not ILP)
```

```text
    THEN GOTO RLP_SEXIT_ROUTINE;
```

(* ILP espera a todos los procesadores lógicos a ACK *) DO

```text
    DONE := READ(LT.STS);
WHILE (NOT DONE);
```

SignalTXTMsg(SEXITContinue); SignalTXTMsg(ClosePrivate);

```text
SENTERFLAG := 0;
```

Unmask SMI, INIT, A20M y NMI eventos externos de pins; END;

RLP SEXIT ROUTINE (RLPs Only): Esperar la señalSEXITContinuar el mensaje; Unmask SMI, INIT, A20M y NMI eventos externos de pins;

```text
IF (prior execution state = HLT)
```

```text
    THEN reenter HLT state;
IF (prior execution state = SENTER sleep)
```

```text
    THEN
          IA32_APIC_BASE.BSP := 0;
```

Clear pending SIPI state; Call INIT PROCESSOR STATE; Unmask SIPI evento; GOTO WAIT-FOR-SIPI;

FI; END;

## Banderas afectadas

ILP: Ninguno. RLPs: Todas las banderas son modificadas para un estado RLP. volviendo a esperar a SIPI, ninguna otra cosa.

Use of Prefixes

LOCK Causa #UD.

REP* Causa #UD (incluye REPNE/REPNZ y REP/REPE/REPZ).

Tamaño de operando Causa #UD.

No se permiten prefijos NP 66/F2/F3.

Segment anula Ignorado.

Tamaño de la dirección Ignorado.

REX              Ignored.
