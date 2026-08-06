---
summary: Entrar en un entorno seguro
---

## Descripción

La instrucción GETSEC[SENTER] inicia el lanzamiento de un entorno medido y coloca al procesador lógico iniciador (ILP) en el modo de ejecución de código autenticado. El SENTER hoja de GETSEC es seleccionado con EAX fijado a 4 en ejecución. La dirección de base física del módulo AC a cargar y autenticar se especifica en EBX. El tamaño del módulo de bytes se especifica en ECX. EDX controla el nivel de funcionalidad soportado por el lanzamiento del entorno medido. Para permitir la plena funcionalidad del lanzamiento del entorno protegido, EDX debe ser inicializado a cero.

Los parámetros de base de código autenticado y tamaño (en bytes) se pasan a la instrucción GETSEC[SENTER] utilizando EBX y ECX respectivamente. El ILP evalúa el contenido de estos registros de acuerdo con las reglas para la dirección del módulo AC en GETSEC[ENTERACCS]. La ejecución del módulo AC sigue las mismas reglas, establecidas por GETSEC[ENTERACCS].

El software de lanzamiento debe asegurar que el bit TPM.ACCESS_0.activeLocality sea claro antes de ejecutar la instrucción GETSEC[SENTER].

Existen restricciones impuestas por el procesador para la ejecución de la instrucción GETSEC[SENTER]:

* La ejecución no está permitida a menos que el procesador esté en el modo modo protegido o IA-32e con CPL = 0 y

EFLAGS.VM = 0.

* El caché de procesador debe estar disponible y no deshabilitado usando los bits CR0.CD y NW. * Para asegurar la consistencia de la operación con la excepción numérica reportando usando Interrupt 16, CR0.NE debe ser

set.

* Un chipset compatible con Intel TXT debe estar presente como comunicado al procesador por muestreo de la potencia-on

campo de la capacidad de configuración después del reinicio.

* El procesador no puede estar en modo de ejecución de código autenticado o ya en un entorno medido (como

lanzado por una instrucción anterior GETSEC[ENTERACCS] o GETSEC[SENTER]).

* Para evitar posibles conflictos de operabilidad entre modos, no se permite al procesador ejecutar esta instrucción

if it currently is in SMM or VMX operation.

* Para asegurar el manejo constante de los mensajes SIPI, el procesador ejecuta la instrucción GETSEC[SENTER]

debe también ser designado el BSP (procesador de arranque-procesador) definido por IA32_APIC_BASE.BSP (Bit 8).

* EDX debe ser inicializado a un ajuste compatible con el procesador. A menos que la enumeración por el GETSEC[PARAM-

ETERS] hoja informa de otra manera, sólo se admite un valor de cero.

El incumplimiento de las condiciones anteriores da lugar al procesador señalando una violación general de la protección.

Esta instrucción hoja inicia el lanzamiento de un entorno medido iniciando una secuencia de encuentro para todos los procesadores lógicos en la plataforma. La secuencia de citas implica que el procesador lógico iniciador envía un mensaje (por ejecutar GETSEC[SENTER]) y otros procesadores lógicos respondiendo (RLPs) reconociendo el mensaje, sincronizando así el RLP(s) con el ILP.

En respuesta a un mensaje indicando la terminación de la cita, RLPs despeja la bandera del indicador del procesador de arranque (IA32_APIC_BASE.BSP) e introduce un estado de sueño SENTER. En este estado de sueño, RLPs entra en una condición de procesador ocioso mientras espera ser activado después de que un entorno medido ha sido establecido por el ejecutivo del sistema. Los RLP en el estado de sueño SENTER sólo pueden ser activados por la función GETSEC hoja WAKEUP en un ambiente medido.

Un exitoso lanzamiento de los resultados del entorno medido en el procesador lógico iniciado que entra en el modo de ejecución de código autenticado. Antes de llegar a este punto, el ILP realiza los siguientes pasos internamente:

* Inhibir la respuesta del procesador a los eventos externos: INIT, A20M, NMI y SMI. * Establecer y comprobar la ubicación y el tamaño del módulo de código autenticado para ser ejecutado por el ILP. * Revise la existencia de un chipset compatible con Intel(R) TXT. * Verificar la configuración actual de gestión de energía es aceptable. * Difundir un mensaje para permitir la protección de la memoria y el I/O de las actividades de otros agentes procesadores. * Cargue el módulo AC designado en el área de ejecución de código autenticado. * Aislar el contenido del área de ejecución de códigos autenticado de la modificación de estado adicional por agentes externos. * Autentice el módulo AC. * Actualizado el Módulo de Plataforma Confiada (TPM) con el hash del módulo de código autenticado. * Iniciar el estado del procesador basado en la información del encabezado del módulo de código autenticado. * Desbloquear el espacio de registro de configuración privada Intel(R) TXT y TPM locality 3. * Iniciar la ejecución en el módulo de código autenticado en el punto de entrada definido.

Como comprobación de integridad para una correcta operación de hardware de procesador, la ejecución de GETSEC[SENTER] también comprobará el contenido de todos los registros de estado de comprobación de la máquina (como informó el MSRs IA32 MCi STATUS) para cualquier condición de error no corregida válida. Además, el registro de estado de control de máquina global IA32 MCG STATUS MCIP bit debe ser aclarado y el pin de paquete de procesador IERR (o su equivalente) no debe ser afirmado, indicando que ningún procesamiento de la excepción de comprobación de máquina está actualmente en marcha. Estos cheques se realizan dos veces: una vez por el ILP antes de la transmisión del mensaje de cita a RLPs, y más tarde en respuesta a RLPs reconociendo el mensaje de cita. Cualquier condición de error de comprobación de máquina no corregible válida pendiente presente en los registros de estado de comprobación de la máquina en el primer punto de verificación resultará en la señalización de ILP una violación general de protección. Si una condición de error de comprobación de máquina no corregible válida pendiente está presente en el segundo punto de control, entonces esto resultará en el procesador lógico correspondiente indicando la condición más severa TXT-shutdown con un código de error de 12.

Antes de realizar la carga y autenticación del módulo de código de destino, el procesador también comprueba que las codificacións de tensión y relación de autobús actuales corresponden a valores buenos conocidos soportables por el procesador. Los valores de MSR IA32 PERF STATUS se comparan con el ajuste máximo de destino de operación soportado por el procesador, el ajuste del sistema o el objetivo de operación del monitor térmico. Si la configuración actual no cumple ninguno de estos criterios, la función SENTER intentará cambiar el voltaje y el ratio de bus selecciona los controles de forma específica del procesador. Este ajuste puede ser para el monitor térmico, mínimo (si es diferente), o máximo objetivo de funcionamiento dependiendo del procesador.

Esto implica que algunos parámetros de destino de operación térmica configurados por BIOS pueden ser anulados por SENTER. El software de medio ambiente medido puede tener que asumir la responsabilidad de restaurar los ajustes que se consideran seguros, pero no necesariamente reconocidos por SENTER. Si un ajuste no es posible cuando se descubre un ajuste fuera de rango, entonces el procesador abortará el lanzamiento medido. Este puede ser el caso de la configuración controlada de chipset de estos valores o si la controlabilidad no está habilitada en el procesador. En este caso es responsabilidad del software externo programar la relación de voltaje de chipset ID y/o bus selecciona la configuración a valores conocidos reconocidos por el procesador, antes de ejecutar SENTER.

NOTE

Para un procesador móvil, se puede realizar un ajuste según el objetivo de operación del monitor térmico. Para un procesador quad-core el mecanismo de ajuste SENTER puede resultar en un ajuste de tensión más conservador pero no uniforme, dependiendo de la configuración pre-SENTER por núcleo.

Los ILP y RLP enmascaran la respuesta a la afirmación de las señales externas INIT#, A20M, NMI# y SMI#. El propósito de este control de enmascaramiento es prevenir la exposición a los controladores de eventos externos existentes hasta que se haya puesto en marcha un manejador protegido para descriptor directamente estos eventos. Los eventos de pin externo enmascarados pueden ser desenmascarados condicional o incondicionalmente a través deGETSEC[EXITAC], GETSEC[SEXIT], GETSEC[SMCTRL] o para específicoVMXoperaciones relacionadas tales como una entrada VM oVMXOFFinstrucción (véanse las respectivasGETSEC hojase Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C, para más detalles). El estado del pin A20M está enmascarado y obligado internamente a un estado desgastado para que la aserción externa no sea reconocida. A20M enmascarado como fijado por

GETSEC[SENTER] se deshace sólo después de derribar el entorno medido con la instrucción GETSEC[SEXIT] o reinicio del procesador. INTR está enmascarado simplemente limpiando el bit EFLAGS.IF. Es responsabilidad del software del sistema controlar la respuesta del procesador a INTR a través de la gestión adecuada de EFLAGS.

Para evitar que otros procesadores (lógicos) interfieran con el ILP que opera en modo de ejecución de código autenticado, se bloquean la memoria (excluyendo las transacciones implícitas de devolución de escritura) y las actividades I/O originarias de otros agentes procesadores. Esta protección comienza cuando el ILP entra en modo de ejecución de código autenticado. Sólo se permiten realizar transacciones de memoria e I/O iniciadas desde el ILP. El modo de ejecución de código autenticado se hace ejecutando GETSEC[EXITAC]. La protección de la memoria y las actividades I/O se mantiene en vigor hasta que el ILP ejecute GETSEC[EXITAC].

Una vez que el módulo de código autenticado se ha cargado en el área de ejecución de códigos autenticados, está protegido contra nuevas modificaciones de los bucles de autobús externos. También hay un requisito de que el tipo de memoria para el rango de dirección del módulo de código autenticado sea WB (a través de la inicialización de los MTRR antes de la ejecución de esta instrucción). Si esta condición no está satisfecha, es una violación de la seguridad y el procesador forzará un restablecimiento del sistema TXT (después de escribir un código de error al registro chipset LT.ERRORCODE). Esta acción se conoce como una condición de reseteo Intel(R) TXT. Se realiza cuando se considera que no es fiable señalar un error a través del mecanismo convencional de presentación de informes de excepciones.

Para ajustarse a la granularidad mínima de MTRR MSRs para especificar el tipo de memoria, el código autenticado RAM (ACRAM) se asigna al procesador en bloques granulares de 4096 byte. Si un tamaño del módulo AC especificado en ECX no es un múltiplo de 4096, el procesador asignará hasta el siguiente límite de 4096 byte para el mapeo como ACRAM con datos indeterminados. Este área de almohadilla no será visible al módulo de código autenticado como memoria externa ni puede depender del valor de los datos utilizados para llenar el área de almohadilla.

Una vez que la autenticación exitosa ha sido completada por el ILP, el hash computed se almacena en una instalación de almacenamiento de confianza en la plataforma. Se admiten las siguientes instalaciones de almacenamiento de confianza:

* Si la plataforma registra FTM INTERFACE ID.[bits 3:0] = 0, el hash computed se almacena en el TPM de la plataforma

en PCR17 después de este registro se reinicia implícitamente. PCR17 es un registro dedicado para mantener el hash computed del módulo de código autenticado cargado y ejecutado posteriormente por el GETSEC[SENTER]. Como parte de este proceso, los PCRs dinámicos 18-22 son reajustados para que puedan ser utilizados por software ulterior para el registro de los módulos de código y datos.

* Si la plataforma registra FTM INTERFACE ID.[bits 3:0] = 1, el hash computed se almacena en un firmware de confianza

módulo (FTM) utilizando un protocolo modificado similar al protocolo utilizado para escribir a TPM's PCR17.

Después de la ejecución exitosa de SENTER, ya sea PCR17 (si FTM no está habilitado) o el FTM (si está habilitado) contiene la medición del código AC y los parámetros de lanzamiento SENTER.

Después de la autenticación se completa con éxito, el espacio de configuración privado del chipset compatible con Intel(R) TXT se desbloquea para que el módulo de código autenticado y el software de medio ambiente medido puedan acceder a este estado de chipset normalmente restringido. El espacio de configuración privada de chipset compatible con Intel(R) TXT puede ser bloqueado más adelante mediante la escritura de software al registro de chipset LT.CMD.CLOSE-PRIVATE o utilizando incondicionalmente la instrucción GETSEC[SEXIT].

La función SENTER hoja también inicializa un estado de arquitectura procesador para el ILP de contenidos mantenidos en el encabezado del módulo de código autenticado. Dado que el módulo de código autenticado es relocalable, todas las referencias de la dirección son relativas a la dirección de base transmitida a través de EBX. El valor base ILP GDTR se inicializa a EBX + [GDTBasePtr] y GDTR límite establecido a [GDTLimit]. El selector de CS se inicializa al valor mantenido en el campo de encabezado del módulo AC SegSel, mientras que los selectores DS, SS y ES se inicializan a CS+8. Los campos descriptores de segmento se inicializan implícitamente con BASE=0, LIMIT=FFFFFh, G=1, D=1, P=1, S=1, read/write/accessed for DS, SS, and ES, mientras se ejecutan/read/accessed for CS. La ejecución en el módulo de código autenticado para el ILP comienza con el EIP fijado a EBX + [EntryPoint]. Los campos definidos del módulo AC utilizados para la inicialización del estado del procesador son la consistencia verificada con un fallo que resulta en una condición TXT-shutdown.

En el cuadro 7-6 se presenta un resumen de la inicialización del estado procesador para los ILP y RLP(s) después de la terminación exitosa de GETSEC[SENTER]. Para ILP y RLP(s), el paging es deshabilitado al entrar en el entorno medido. Corresponde al ILP establecer un entorno de paging de confianza, con asignaciones apropiadas, para satisfacer los requisitos de protección establecidos durante el lanzamiento del entorno medido. La inicialización del estado de RLP no se completa hasta que la función ILP haya sido señalizada posteriormente por la ejecución de la función GETSEC[WAKEUP].

**Iniciación del Estado del Registro Después de GETSEC[SENTER] y GETSEC[WAKEUP]**

| Estado | ILP después de GETSEC[SENTER] | RLP después de GETSEC[WAKEUP] |
| --- | --- | --- |
| CR0 | PG0, AM0, WP0; Otros sin cambios | PG0, CD0, NW0, AM0, WP0; PE1, NE1 |
| CR4 | 00004000H | 00004000H |
| EFLAGS | 00000002H | 00000002H |
| IA32_EFER | 0H | 0 |
| EIP | [EntryPoint de MLE header1] | [LT.MLE.JOIN + 12] |
| EBX | Sin cambios [SINIT.BASE] | Sin cambios |
| EDX | Banderas de control SENTER | Sin cambios |
| EBP | SINIT.BASE | Sin cambios |
| CS | Sel=[SINIT SegSel], base=0, limit=FFFh, G=1, D=1, AR=9BH | Sel = [LT.MLE.JOIN + 8], base = 0, límite = FFFFFH, G = 1, D = 1, AR = 9BH |
| DS, ES, SS | Sel=[SINIT SegSel] +8, base=0, limit=FFFh, G=1, D=1, AR=93H | Sel = [LT.MLE.JOIN + 8] +8, base = 0, limit = FFFFFH, G = 1, D = 1, AR = 93H |
| GDTR | Base= SINIT.base (EBX) + [SINIT.GDTBasePtr], Limit=[SINIT.GDTLimit] | Base = [LT.MLE.JOIN + 4], Límite = [LT.MLE.JOIN] |
| DR7 | 00000400H | 00000400H |
| IA32_DEBUGCTL | 0H | 0H |
| Contrapesos de rendimiento | 0H | 0H |
| y control contrario |  |  |
| registros |  |  |
| IA32_MISC_ENABLE | Cuadro 7-5 | Cuadro 7-5 |
| IA32_SMM_MONITOR_ | Bit 20 | Bit 20 |
| CTL |  |  |

El MSR IA32 EFER también está despejado incondicionalmente como parte del estado procesador inicializado por SENTER para los ILP y RLP. Dado que el paging está deshabilitado al entrar en modo de ejecución de código autenticado, un nuevo entorno de paging tendrá que ser restablecido si se desea habilitar el modo IA-32e mientras opera en modo de ejecución de código autenticado.

El control de características diversas MSR, IA32 MISC ENABLE, se inicializa como parte del lanzamiento del medio ambiente medido. Algunos bits de este MSR se conservan porque preservar estos bits puede ser importante para mantener la configuración de plataforma establecida previamente. Véase la nota de pie de página para el cuadro 7-5 Los bits restantes se aclaran con el fin de establecer un entorno más coherente para la ejecución de módulos de código autenticado. Entre los efectos de la inicialización de este MSR, cualquier condición anterior establecida por la instrucción MONITOR será aclarada.

Efecto de MSR IA32 FEATURE CONTROL MSR

Bits 15:8 del IA32 FEATURE CONTROL MSR afectan la ejecución de GETSEC[SENTER]. Estos trozos consisten en dos campos:

* Bit 15: a global enable control for execution of SENTER. * Bits 14:8: un campo de control del parámetro que proporciona la capacidad de calificar la ejecución SENTER basado en el nivel de

funcionalidad especificada con bits de parámetro EDX correspondientes 6:0.

El diseño de estos campos en el IA32 FEATURE CONTROL MSR se muestra en la tabla 7-1.

Antes de la ejecución de GETSEC[SENTER], el pedazo de bloqueo de IA32 FEATURE CONTROL MSR debe ser fijado para afirmar la configuración a utilizar. Una vez que el bit de bloqueo se establece, sólo una condición de reajuste de encendido limpiará este MSR. El IA32 FEA- TURE CONTROL MSR debe configurarse de acuerdo con el uso previsto en la inicialización de la plataforma. Tenga en cuenta que este MSR sólo está disponible en los procesadores SMX o VMX habilitados. De lo contrario, IA32 FEATURE CONTROL es tratado como reservado.

La Guía de Programación de Medio Ambiente Lanzada Medida Intel(R) Trusted Execution Technology ofrece detalles y requisitos adicionales para programar software de medio ambiente medido para lanzar en una plataforma Intel TXT.

Funcionamiento en una Plataforma de Procesadores Uni

(* El estado de la bandera interna ACMODEFLAG y SENTERFLAG persisten en el límite de instrucción *)

GETSEC[SENTER] (ILP Only):

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

(CR0.PE=0) o (CR0.CD=1) o (CR0.NW=1) o (CR0.NE=0) o (CPL)>0) o (EFLAGS.VM=1) o (IA32_APIC_BASE.BSP=0) o (TXTchipset no presente) o (SENTERFLAG=1) o (ACMODEFLAG=1) o (IN SMM=1)TPMinterfaz no está presente) o

```text
    (EDX  (SENTER_EDX_support_mask & EDX)) or
```

(IA32_FEATURE_CONTROL[0]=0) or (IA32_FEATURE_CONTROL[15]=0) or

```text
    ((IA32_FEATURE_CONTROL[14:8] & EDX[6:0])  EDX[6:0]))
```

```text
          THEN #GP(0);
IF (GETSEC[PARAMETERS].Parameter_Type = 5, MCA_Handling (bit 6) = 0)
```

```text
    FOR I = 0 to IA32_MCG_CAP.COUNT-1 DO
          IF IA32_MC[I]_STATUS = uncorrectable error
                THEN #GP(0);
```

FI;

OD; FI;

```text
IF (IA32_MCG_STATUS.MCIP=1) or (IERR pin is asserted)
```

```text
    THEN #GP(0);
ACBASE := EBX;
ACSIZE := ECX;
IF (((ACBASE MOD 4096)  0) or ((ACSIZE MOD 64)  0 ) or (ACSIZE < minimum
```

(ACSIZE > AC RAM) o (ACBASE+ACSIZE) > (2^32 -1))

```text
          THEN #GP(0);
```

Mask SMI, INIT, A20M, y NMI eventos de pin externo; SignalTXTMsg (SENTER); Sí.

```text
WHILE (no SignalSENTER message);
```

TXT SENTER  MSG EVENT (ILP &amp; RLP): Máscara y claro evento SignalSENTER; Unmask SignalSEXIT evento;

```text
IF (in VMX operation)
```

```text
    THEN TXT-SHUTDOWN(#IllegalEvent);
FOR I = 0 to IA32_MCG_CAP.COUNT-1 DO
```

```text
    IF IA32_MC[I]_STATUS = uncorrectable error
          THEN TXT-SHUTDOWN(#UnrecovMCError);
```

FI; OD;

```text
IF (IA32_MCG_STATUS.MCIP=1) or (IERR pin is asserted)
```

```text
    THEN TXT-SHUTDOWN(#UnrecovMCError);
IF (Voltage or bus ratio status are NOT at a known good state)
```

```text
    THEN IF (Voltage select and bus ratio are internally adjustable)
          THEN
```

Hacer un ajuste específico del producto en los parámetros operativos;

```text
          ELSE
```

TXT-SHUTDOWN(#IIlegalVIDBRatio);

FI;

```text
IA32_MISC_ENABLE := (IA32_MISC_ENABLE & MASK_CONST*)
```

(* El valor hexadecimal de MASK CONST puede variar debido a las implementaciones del procesador *)

```text
A20M := 0;
IA32_DEBUGCTL := 0;
```

Procesador invalidado TLB(s); D) Realizar operaciones salientes; Control y control de control de rendimiento claro;

```text
SENTERFLAG := 1;
```

SignalTXTMsg(SENTERAck);

```text
IF (logical processor is not ILP)
```

```text
    THEN GOTO RLP_SENTER_ROUTINE;
```

(* ILP espera a todos los procesadores lógicos a ACK *) DO

```text
    DONE := TXT.READ(LT.STS);
WHILE (not DONE);
```

SignalTXTMsg(SENTERContinue); SignalTXTMsg(ProcessorHold);

```text
FOR I=ACBASE to ACBASE+ACSIZE-1 DO
```

```text
    ACRAM[I-ACBASE].ADDR := I;
    ACRAM[I-ACBASE].DATA := LOAD(I);
```

OD;

```text
IF (ACRAM memory type  WB)
    THEN TXT-SHUTDOWN(#BadACMMType);
```

```text
IF (AC module header version is not supported) OR (ACRAM[ModuleType]  2)
    THEN TXT-SHUTDOWN(#UnsupportedACM);
```

```text
KEY := GETKEY(ACRAM, ACBASE);
KEYHASH := HASH(KEY);
CSKEYHASH := LT.READ(LT.PUBLIC.KEY);
IF (KEYHASH  CSKEYHASH)
```

```text
    THEN TXT-SHUTDOWN(#AuthenticateFail);
SIGNATURE := DECRYPT(ACRAM, ACBASE, KEY);
```

(* The value of SIGNATURE_LEN_CONST is implementation-specific*)

```text
FOR I=0 to SIGNATURE_LEN_CONST - 1 DO
```

```text
    ACRAM[SCRATCH.I] := SIGNATURE[I];
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
IF ((ACMCONTROL.0 = 1) and (ACMCONTROL.1 = 1) and (snoop hit to modified
```

línea detectada en carga ACRAM)

```text
    THEN ACEntryPoint := ACBASE+ACRAM[ErrorEntryPoint];
ELSE
    ACEntryPoint := ACBASE+ACRAM[EntryPoint];
IF ((ACEntryPoint >= ACSIZE) or (ACEntryPoint < (ACRAM[HeaderLen] * 4 + Scratch_size)))
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[SegSel] > (ACRAM[GDTLimit] - 15)) or (ACRAM[SegSel] < 8))
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[SegSel].TI=1) or (ACRAM[SegSel].RPL0))
    THEN TXT-SHUTDOWN(#BadACMFormat);
```

```text
IF (FTM_INTERFACE_ID.[3:0] = 1 ) (* Alternate FTM Interface has been enabled *)
    THEN (* TPM_LOC_CTRL_4 is located at 0FED44008H, TMP_DATA_BUFFER_4 is located at 0FED44080H *)
          WRITE(TPM_LOC_CTRL_4) := 01H; (* Modified HASH.START protocol *)
```

(* Escribir para almacenamiento de firmware *)

```text
          WRITE(TPM_DATA_BUFFER_4) := SIGNATURE_LEN_CONST + 4;
          FOR I=0 to SIGNATURE_LEN_CONST - 1 DO
                WRITE(TPM_DATA_BUFFER_4 + 2 + I ) := ACRAM[SCRATCH.I];
          WRITE(TPM_DATA_BUFFER_4 + 2 + SIGNATURE_LEN_CONST) := EDX;
          WRITE(FTM.LOC_CTRL) := 06H; (* Modified protocol combining HASH.DATA and HASH.END *)
    ELSE IF (FTM_INTERFACE_ID.[3:0] = 0 ) (* Use standard TPM Interface *)
          ACRAM[SCRATCH.SIGNATURE_LEN_CONST] := EDX;
          WRITE(TPM.HASH.START) := 0;
          FOR I=0 to SIGNATURE_LEN_CONST + 3 DO
                WRITE(TPM.HASH.DATA) := ACRAM[SCRATCH.I];
          WRITE(TPM.HASH.END) := 0;
```

FI;

```text
ACMODEFLAG := 1;
CR0.[PG.AM.WP] := 0;
```

```text
CR4 := 00004000h;
EFLAGS := 00000002h;
IA32_EFER := 0;
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
SS := DS;
ES := DS;
DR7 := 00000400h;
IA32_DEBUGCTL := 0;
```

SignalTXTMsg(UnlockSMRAM); SignalTXTMsg(OpenPrivate); SignalTXTMsg(OpenLocality3);

```text
EIP := ACEntryPoint;
```

END;

RLP SENTER ROUTINE: (sólo RLP) Mask SMI, INIT, A20M y NMI eventos de pasadores externos Unmask SignalWAKEUP evento; Espere a que se presenten las señales

```text
IA32_APIC_BASE.BSP := 0;
```

GOTO SENTER estado de sueño; END;

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
