---
summary: Ejecutar Código de Chipset Authenticated
---

## Descripción

La función GETSEC[ENTERACCS] carga, autentica y ejecuta un módulo de código autenticado utilizando un TXT de plataforma Intel(R) clave público. El ENTERACCS hoja de GETSEC es seleccionado con EAX fijado a 2 en la entrada.

Existen ciertas restricciones impuestas por el procesador para la ejecución de la instrucción GETSEC[ENTERACCS]:

* La ejecución no está permitida a menos que el procesador esté en el modo modo protegido o IA-32e con CPL = 0 y

EFLAGS.VM = 0.

* El caché de procesador debe estar disponible y no deshabilitado, es decir, los bits CR0.CD y CR0.NW deben ser 0. * Para los paquetes procesadores que contienen más de un procesador lógico, CR0.CD se comprueba para asegurar la consistencia

entre procesadores lógicos habilitados.

* Para asegurar la consistencia de la operación con la excepción numérica reportando usando Interrupt 16, CR0.NE debe ser

set.

* Un chipset compatible con Intel TXT debe estar presente como comunicado al procesador por muestreo de la potencia-on

campo de la capacidad de configuración después del reinicio.

* El procesador no puede ya estar en modo de ejecución de código autenticado como lanzado por un anterior

GETSEC[ENTERACCS] o GETSEC[SENTER] instrucción sin una salida posterior utilizando GETSEC[EXITAC]).

* Para evitar posibles conflictos de operabilidad entre modos, no se permite al procesador ejecutar esta instrucción

if it currently is in SMM or VMX operation.

* Para asegurar el manejo constante de los mensajes SIPI, el procesador ejecuta la instrucción GETSEC[ENTERACCS]

debe también ser designado el BSP (procesador de arranque-procesador) definido por IA32_APIC_BASE.BSP (Bit 8).

Si no se ajustan a las condiciones anteriores, el procesador indica una excepción de protección general.

Antes de la ejecución de los ENTERACCS hoja, otros procesadores lógicos, es decir, RLPs, en la plataforma debe ser:

* Entro en una espera para...SIPIestado (como iniciado por unINITo mediante el restablecimiento de laBSPdesignado

processors), or

* En el estado de sueño SENTER como iniciado por un GETSEC[SENTER] del procesador lógico iniciador (ILP).

Si otros procesadores lógicos en el mismo paquete no están ociosos en uno de estos estados, ejecución de las señales ENTERACCS una excepción de protección general. El mismo requisito y la acción se aplica si el otro procesador(s) lógico del mismo paquete no tiene CR0.CD = 0.

Una ejecución exitosa de ENTERACCS resulta en el ILP que entra en un modo de ejecución de código autenticado. Antes de llegar a este punto, el procesador realiza varios cheques. Estos incluyen:

* Establecer y comprobar la ubicación y el tamaño del módulo de código autenticado especificado para ser ejecutado por el

processor.

* Inhibir la respuesta de ILP a los eventos externos: INIT, A20M, NMI y SMI. * Difundir un mensaje para permitir la protección de la memoria y la OI de otros agentes procesadores. * Cargue el módulo de código designado en un área de ejecución de código autenticado. * Aislar el contenido del área de ejecución de códigos autenticados de la modificación de estado por externo

agents.

* Autentice el módulo de código autenticado. * Iniciar el estado de procesador lógico iniciado basado en la información contenida en el módulo de código autenticado

header.

* Desbloquear el espacio de configuración privado de chipsets compatible con Intel(R) TXT y TPM locality 3 espacio.

* Iniciar la ejecución en el módulo de código autenticado en el punto de entrada definido.

La función GETSEC[ENTERACCS] requiere dos parámetros de entrada adicionales en los registros de propósito general EBX y ECX. EBX tiene el código autenticado (AC) dirección de base física del módulo AC (el módulo AC debe residir por debajo de 4 GBytes en el espacio de dirección física) y ECX tiene el tamaño del módulo AC (en bytes). La dirección y tamaño de la base física se utilizan para recuperar el módulo de código de la memoria del sistema y cargarlo en el área de ejecución de código autenticado interno. La dirección física base se verifica para verificar que está en un límite modulo-4096 byte. El tamaño se verifica como un múltiplo de 64, que no excede la capacidad interna autenticada del área de ejecución de códigos (como informó GETSEC[CAPABILITIES]), y que la dirección superior del módulo AC no supera los 32 bits. Una condición de error resulta en un aborto del lanzamiento de ejecución de código autenticado y la señalización de una excepción de protección general.

Como comprobación de integridad para una correcta operación de hardware de procesador, la ejecución de GETSEC[ENTERACCS] también comprobará el contenido de todos los registros de estado de comprobación de la máquina (como informó el MSRs IA32 MCi STATUS) para cualquier condición de error no corregida válida. Además, el registro de estado de control de máquina global IA32 MCG STATUS MCIP bit debe ser aclarado y el pin de paquete de procesador IERR (o su equivalente) no debe ser afirmado, indicando que no se está procesando la excepción de comprobación de máquina. Estos cheques se realizan antes de iniciar la carga del módulo de código autenticado. Cualquier condición de error de comprobación de máquina no corregible válida pendiente presente en estos registros de estado en este punto dará lugar a que el procesador señale una violación de protección general.

El ILP enmascara la respuesta a la afirmación de las señales externas INIT#, A20M, NMI# y SMI#. Este enmascaramiento sigue activo hasta que se desenmascara opcionalmente por GETSEC[EXITAC] (este comportamiento desenmascaramiento definido supone que GETSEC[ENTERACCS] no fue ejecutado por un GETSEC anterior[SENTER]). El propósito de este control de enmascaramiento es prevenir la exposición a los controladores de eventos externos existentes que pueden no estar bajo el control del módulo de código autenticado.

El ILP establece una bandera interna para indicar que ha introducido el modo de ejecución de código autenticado. El estado del pin A20M es igualmente enmascarado y forzado internamente a un estado desactivado para que cualquier afirmación externa no sea reconocida durante el modo de ejecución de código autenticado.

Para evitar que otros procesadores (lógicos) interfieran con el ILP que opera en modo de ejecución de código autenticado, el acceso a la memoria (excluyendo las transacciones implícitas de devolución de escritura) y el I/O originando otros agentes procesadores están bloqueados. Esta protección comienza cuando el ILP entra en modo de ejecución de código autenticado. Sólo se permiten realizar transacciones de memoria e I/O iniciadas desde el ILP. El modo de ejecución de código autenticado se hace ejecutando GETSEC[EXITAC]. La protección de la memoria y las actividades I/O se mantiene en vigor hasta que el ILP ejecute GETSEC[EXITAC].

Antes de lanzar el módulo de ejecución autenticado utilizando GETSEC[ENTERACCS] o GETSEC[SENTER], los MTRR del procesador (Memory Type Range Registers) deben primero ser inicializados para mapear las direcciones autenticadas RAM como WB (recuperación). No hacerlo puede afectar la capacidad del procesador para mantener el aislamiento del módulo de código autenticado cargado. Si el procesador detecta este requisito no se cumple, indicará una condición de reinicio Intel(R) TXT con un código de error durante la carga del módulo de código autenticado.

Mientras que las direcciones físicas dentro del módulo de carga deben ser mapeadas como WB, el tipo de memoria para ubicaciones fuera de los límites del módulo debe ser mapeado a uno de los tipos de memoria soportados como devuelto por GETSEC[PARAME- TERS] (o UC como predeterminado).

Para ajustarse a la granularidad mínima de MTRR MSRs para especificar el tipo de memoria, el código autenticado RAM (ACRAM) se asigna al procesador en bloques granulares de 4096 byte. Si un tamaño del módulo AC especificado en ECX no es un múltiplo de 4096, el procesador asignará hasta el siguiente límite de 4096 byte para el mapeo como ACRAM con datos indeterminados. Este área de almohadilla no será visible al módulo de código autenticado como memoria externa ni puede depender del valor de los datos utilizados para llenar el área de almohadilla.

Al finalizar con éxito GETSEC[ENTERACCS], el estado arquitectónico del procesador se inicializa parcialmente de los contenidos mantenidos en el encabezado del módulo de código autenticado. Los selectores de procesadores GDTR, CS y DS se inicializan desde campos dentro del módulo de código autenticado. Dado que el módulo de código autenticado debe ser relocalable, todas las referencias de la dirección deben ser relativas a la dirección de base del módulo de código autenticado en EBX. El valor base del procesador GDTR se inicializa en el campo de cabecera del módulo AC GDTBasePtr + dirección base del módulo celebrada en EBX y el límite GDTR se establece en el valor en el campo GDTLimit. El selector CS se inicializa en el campo SegSel del módulo AC, mientras que el selector DS se inicializa en CS + 8. Los campos descriptores del segmento se inicializan implícitamente a BASE=0, LIMIT=FFFFFh, G=1, D=1, P=1, S=1, read/write access for DS, y ejecuta/read access for CS. El procesador inicia la ejecución del módulo de código autenticado con el EIP fijado al encabezado del módulo AC EntryPoint campo + dirección base del módulo (EBX). Los campos basados en el módulo AC utilizados para la inicialización del estado del procesador se verifican para la consistencia y los resultados de falla en una condición de cierre.

Se da un resumen de la inicialización del estado de registro después de la terminación exitosa de GETSEC[ENTERACCS] para el procesador en el cuadro 7-4. El paging está deshabilitado al entrar en el modo de ejecución de código autenticado. El módulo de código autenticado se carga y se ejecuta inicialmente mediante direcciones físicas. Depende del software del sistema después de la ejecución de GETSEC[ENTERACCS] para establecer un nuevo (o restaurar su anterior) entorno de pavimentación con un mapeo apropiado para satisfacer nuevos requisitos de protección. EBP se inicializa en la dirección física del módulo de código autenticado para la ejecución inicial en el ambiente autenticado. Como resultado, el código autenticado puede hacer referencia a EBP para referencias basadas en direcciones relativas, dado que el módulo de código autenticado debe ser independiente de posición.

**Iniciación del Estado después de GETSEC[ENTERACCS]**

| Estado | Situación inicial | Comentario |
| --- | --- | --- |
| CR0 | PG0, AM0, WP0: Otros sin cambios | Paging, Alignment Check, Write-protection are disabled. |
| CR4 | MCE0, CET0, PCIDE0, FRED0: Otros | Excepciones de control de la máquina, tecnología de control de flujo, contexto de proceso |
|  | sin cambios | Identificadores, y FRED discapacitados. |
| EFLAGS | 00000002H |  |
| IA32_EFER | 0H | Modo IA-32e desactivado. |
| EIP | AC.base + EntryPoint | AC.base está en EBX como entrada a GETSEC[ENTERACCS]. |
| [E\|R]BX | Pre-ENTERACCS estado: Siguiente [E\ sufrimientoR]IP antes de GETSEC[ENTERACCS] | Carry forward 64-bit processor state across GETSEC[ENTERACCS]. |
| ECX | Pre-ENTERACCS estado: [31:16]=GDTR.limit; [15:0]=CS.sel | Carry forward processor state across GETSEC[ENTERACCS]. |
| [E\|R]DX | Pre-ENTERACCS estado: Base GDTR | Carry forward 64-bit processor state across GETSEC[ENTERACCS]. |
| EBP | AC.base |  |
| CS | Sel=[SegSel], base=0, limit=FFFh, G=1, D=1, AR=9BH |  |
| DS | Sel=[SegSel] +8, base=0, limit=FFFh, G=1, D=1, AR=93H |  |
| GDTR | Base= AC.base (EBX) + [GDTBasePtr], Limit=[GDTLimit] |  |
| DR7 | 00000400H |  |
| IA32_DEBUGCTL | 0H |  |
| IA32_MISC_ENABLE | Véase el cuadro 7-5, por ejemplo. | El número de esferas inicializadas puede cambiar debido a la aplicación del procesador. |
| Ejecución | 0H |  |
| contrapesos y contrapesos |  |  |
| registros de control |  |  |

Los contadores relacionados con el desempeño y los registros de control de contrapesos se limpian como parte de la ejecución de ENTERACCS. Esto implica que cualquier contador de rendimiento activo en cualquier momento de ejecución ENTERACCS será deshabilitado. Para reactivar los contadores de rendimiento del procesador, este estado debe ser reinicializado y re-enabledo.

El IA32 MISC ENABLE MSR se inicializa al entrar en modo de ejecución autenticado. Ciertos bits de este MSR se conservan porque preservar estos bits puede ser importante para mantener los ajustes de plataforma establecidos previamente (ver la nota de pie de página para la tabla 7-5). Los bits restantes se limpian con el fin de establecer un entorno más coherente para la ejecución de módulos de código autenticados. Uno de los impactos de la inicialización de este MSR es cualquier condición anterior establecida por la instrucción MONITOR será aclarado.

Para apoyar el posible retorno al estado arquitectónico procesador antes de la ejecución deGETSEC[ENTERACCS], cierto estado de procesador crítico es capturado y almacenado en los registros para fines generales al completar la instrucción. [E ToddR]BX tiene dirección efectiva ([E durableR]IP) de la instrucción que se ejecutaría después deGETSEC[ENTERACCS], ECX[15:0] tiene el valor selector de CS,ECX[31:16]GDTRcampo límite, y [E durableR]DX sostiene elGDTRCampo base. El siguiente código autenticado puede preservar el contenido de estos registros para que este estado pueda ser restaurado manualmente si es necesario, antes de salir del modo de ejecución de código autenticado con GETSEC[EXITAC]. Para el estado del procesador después de salir del modo de ejecución de código autenticado, vea la descripción de GETSEC[SEXIT].

**IA32 MISC ENABLE MSR Iniciación1 por ENTERACCS y SENTER**

| Campo | Posición de bits | Descripción |
| --- | --- | --- |
| Las cuerdas rápidas permiten | 0 | Despejado a 0. |
| Modo de compatibilidad FOPCODE | 2 | Despejado a 0. |
| habilitación |  |  |
| Monitor térmico | 3 | Set a 1 si no se activa otra capacidad de monitor térmico.2 |
| Desactivación de bloques | 4 | Despejado a 0. |
| Cierre de autobús en las divisiones de la línea de caché | 8 | Despejado a 0. |
| inhabilitación |  |  |
| Hardware prefetch deshable | 9 | Despejado a 0. |
| El legado GV1/2 permite | 15 | Despejado a 0. |
| MONITOR/MWAIT s/m | 18 | Despejado a 0. |
| Adjacent sector prefetch disable | 19 | Despejado a 0. |

Funcionamiento en una Plataforma de Procesadores Uni

(* El estado de la bandera interna ACMODEFLAG persiste en el límite de instrucción *)

```text
IF (CR4.SMXE=0)
```

```text
    THEN #UD;
```

ELSIF (en VMX no-root operation)

```text
    THEN VM Exit (reason="GETSEC instruction");
```

ELSIF (GETSEC hoja sin soporte)

```text
    THEN #UD;
```

ELSIF ((in VMX operation) or

(CR0.PE=0) or (CR0.CD=1) or (CR0.NW=1) or (CR0.NE=0) or (CPL>0) or (EFLAGS.VM=1) or (IA32_APIC_BASE.BSP=0) or (TXT chipset not present) or (ACMODEFLAG=1) or

```text
          THEN #GP(0);
IF (GETSEC[PARAMETERS].Parameter_Type = 5, MCA_Handling (bit 6) = 0)
```

```text
    FOR I = 0 to IA32_MCG_CAP.COUNT-1 DO
          IF (IA32_MC[I]_STATUS = uncorrectable error)
                THEN #GP(0);
```

OD; FI;

```text
IF (IA32_MCG_STATUS.MCIP=1) or (IERR pin is asserted)
```

```text
    THEN #GP(0);
ACBASE := EBX;
ACSIZE := ECX;
IF (((ACBASE MOD 4096)  0) or ((ACSIZE MOD 64 )  0 ) or (ACSIZE < minimum module size) OR (ACSIZE > authenticated RAM
```

capacity)) or ((ACBASE+ACSIZE) > (2^32 -1)))

```text
    THEN #GP(0);
IF (secondary thread(s) CR0.CD = 1) or ((secondary thread(s) NOT(wait-for-SIPI)) and
```

( hilos secundarios no en estado de sueño SENTER)

```text
    THEN #GP(0);
```

Mask SMI, INIT, A20M, y NMI eventos de pin externo;

```text
IA32_MISC_ENABLE := (IA32_MISC_ENABLE & MASK_CONST*)
```

(* El valor hexadecimal de MASK CONST puede variar debido a las implementaciones del procesador *)

```text
A20M := 0;
IA32_DEBUGCTL := 0;
```

Procesador invalidado TLB(s); D) Transacciones salientes;

```text
ACMODEFLAG := 1;
```

SignalTXTMessage(ProcessorHold); Cargar el ACRAM interno basado en el tamaño del módulo AC; (* Asegurar que todas las cargas ACRAM golpeen Escribir espacio de memoria *)

```text
IF (ACRAM memory type  WB)
    THEN TXT-SHUTDOWN(#BadACMMType);
IF (AC module header version isnot supported) OR (ACRAM[ModuleType]  2)
    THEN TXT-SHUTDOWN(#UnsupportedACM);
```

(* Autenticar el módulo AC y cerrar con un error si falla *)

```text
KEY := GETKEY(ACRAM, ACBASE);
KEYHASH := HASH(KEY);
CSKEYHASH := READ(TXT.PUBLIC.KEY);
IF (KEYHASH  CSKEYHASH)
    THEN TXT-SHUTDOWN(#AuthenticateFail);
SIGNATURE := DECRYPT(ACRAM, ACBASE, KEY);
```

(* The value of SIGNATURE_LEN_CONST is implementation-specific*)

```text
FOR I=0 to SIGNATURE_LEN_CONST - 1 DO
    ACRAM[SCRATCH.I] := SIGNATURE[I];
```

```text
COMPUTEDSIGNATURE := HASH(ACRAM, ACBASE, ACSIZE);
FOR I=0 to SIGNATURE_LEN_CONST - 1 DO
```

```text
    ACRAM[SCRATCH.SIGNATURE_LEN_CONST+I] := COMPUTEDSIGNATURE[I];
IF (SIGNATURE  COMPUTEDSIGNATURE)
```

```text
    THEN TXT-SHUTDOWN(#AuthenticateFail);
ACMCONTROL := ACRAM[CodeControl];
IF ((ACMCONTROL.0 = 0) and (ACMCONTROL.1 = 1) and (snoop hit to modified line detected on ACRAM load))
```

```text
    THEN TXT-SHUTDOWN(#UnexpectedHITM);
IF (ACMCONTROL reserved bits are set)
```

```text
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[GDTBasePtr] < (ACRAM[HeaderLen] * 4 + Scratch_size)) OR
```

((ACRAM[GDTBasePtr] + ACRAM[GDTLimit]) >= ACSIZE))

```text
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACMCONTROL.0 = 1) and (ACMCONTROL.1 = 1) and (snoop hit to modified line detected on ACRAM load))
    THEN ACEntryPoint := ACBASE+ACRAM[ErrorEntryPoint];
ELSE
    ACEntryPoint := ACBASE+ACRAM[EntryPoint];
IF ((ACEntryPoint >= ACSIZE) OR (ACEntryPoint < (ACRAM[HeaderLen] * 4 + Scratch_size)))THEN TXT-SHUTDOWN(#BadACMFormat);
IF (ACRAM[GDTLimit] & FFFF0000h)
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[SegSel] > (ACRAM[GDTLimit] - 15)) OR (ACRAM[SegSel] < 8))
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[SegSel].TI=1) OR (ACRAM[SegSel].RPL0))
    THEN TXT-SHUTDOWN(#BadACMFormat);
CR0.[PG.AM.WP] := 0;
CR4.MCE := 0;
ACRAM[CR4High].FRED := CR4.FRED;
CR4.FRED := 0;
EFLAGS := 00000002h;
IA32_EFER := 0h;
[E|R]BX := [E|R]IP of the instruction after GETSEC[ENTERACCS];
ECX := Pre-GETSEC[ENTERACCS] GDT.limit:CS.sel;
[E|R]DX := Pre-GETSEC[ENTERACCS] GDT.base;
EBP := ACBASE;
GDTR.BASE := ACBASE+ACRAM[GDTBasePtr];
GDTR.LIMIT := ACRAM[GDTLimit];
CS.SEL := ACRAM[SegSel];
CS.BASE := 0;
CS.LIMIT := FFFFFh;
CS.G := 1;
CS.D := 1;
CS.AR := 9Bh;
DS.SEL := ACRAM[SegSel]+8;
DS.BASE := 0;
DS.LIMIT := FFFFFh;
DS.G := 1;
DS.D := 1;
DS.AR := 93h;
DR7 := 00000400h;
IA32_DEBUGCTL := 0;
```

SignalTXTMsg(OpenPrivate); SignalTXTMsg(OpenLocality3);

```text
EIP := ACEntryPoint;
```

END;

## Banderas afectadas

Todas las banderas están limpias.

Use of Prefixes

LOCK Causa #UD.

REP* Causa #UD (incluye REPNE/REPNZ y REP/REPE/REPZ).

Tamaño de operando Causa #UD.

No se permiten prefijos NP 66/F2/F3.

Segment anula Ignorado.

Tamaño de la dirección Ignorado.

REX                     Ignored.
