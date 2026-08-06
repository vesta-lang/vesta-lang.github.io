---
summary: Exit Authenticated Code Execution Mode
---

## Descripción

La función GETSEC[EXITAC] hoja sale del ILP fuera del modo de ejecución de código autenticado establecido por GETSEC[ENTERACCS] o GETSEC[SENTER]. El EXITAC hoja de GETSEC es seleccionado con EAX fijado a 3 en la entrada. EBX (o RBX, si en modo de 64 bits) tiene el objetivo de salto cercano offset para donde la ejecución del procesador se reanudará al salir del modo de ejecución de código autenticado. EDX contiene información adicional de control del parámetro. Actualmente solo se admite un valor de entrada de 0 en EDX. Todos los demás ajustes EDX se consideran reservados y resultan en una violación general de la protección.

GETSEC[EXITAC] sólo se puede ejecutar si el procesador está en modo protegido con CPL = 0 y EFLAGS.VM = 0. El procesador también debe estar en modo de ejecución de código autenticado. Para evitar posibles conflictos de operabilidad entre modos, el procesador no se permite ejecutar esta instrucción si está en SMM o en VMX operación. Una violación de estas condiciones da lugar a una violación general de la protección.

Al finalizar la operación GETSEC[EXITAC], el procesador desenmascara las respuestas a las señales de eventos externos INIT#, NMI# y SMI#. Este desenmascaramiento se realiza condicionalmente, sobre la base de si el modo de ejecución de código autenticado fue introducido a través de la ejecución de GETSEC[SENTER] o GETSEC[ENTERACCS]. Si el procesador está en modo de ejecución de código autenticado debido a la ejecución de GETSEC[SENTER], entonces estas señales de eventos externos permanecerán enmascaradas. En este caso, A20M se mantiene deshabilitado en el entorno medido hasta que el entorno medido ejecute GETSEC[SEXIT]. INIT# es desenmascarado incondicionalmente por EXITAC. Tenga en cuenta que cualquier evento que esté pendiente, pero que se han bloqueado mientras que en modo de ejecución de código autenticado, será reconocido al finalizar la instrucción GETSEC[EXITAC] si el evento de pin es desenmascarado.

La intención de proporcionar la capacidad de dejar opcionalmente los eventos de pin SMI#, y NMI# enmascarado es apoyar la terminación de un acercamiento de entorno medido que hace uso de VMX. En este escenario previsto de uso de la seguridad, estos eventos permanecerán enmascarados hasta que se haya establecido una máquina virtual adecuada para el servicio de campo de estos eventos de una manera más segura. Detalles sobre cuándo y cómo los eventos están enmascarados y desenmascaradosVMXoperación se describen en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C. Debe advertirse que si no se activa ningún entorno VMX después de GETSEC[EXITAC], estos eventos permanecerán enmascarados hasta que el entorno medido se salga con GETSEC[SEXIT]. Si esto no es deseado entonces la función GETSEC SMCTRL(0) se puede utilizar para desenmascarar SMI# en este contexto. NMI# se puede desenmascarar por ejecución de IRET.

Una salida exitosa del modo de ejecución de códigos autenticado requiere que el ILP realice pasos adicionales como se indica a continuación:

* Invalidar el contenido del área de ejecución de código autenticado interno. * Procesador invalidato TLBs. * Limpiar el procesador interno AC Mode indicador bandera. * Re-bloquear la localidad TPM 3 espacio. * Desbloquear la memoria de chipset compatible con Intel(R) TXT y las protecciones I/O para permitir la memoria y la actividad I/O por otros

agentes de procesadores.

* Realizar un salto indirecto casi absoluto al lugar de instrucción designado.

El contenido del área de ejecución de códigos autenticados es invalidado por hardware para protegerlo de uso o visibilidad posterior. Este área de almacenamiento de procesadores internos ya no se puede utilizar o depender después de GETSEC[EXITAC]. Las estructuras de datos deben ser restablecidas fuera del área de ejecución de códigos autenticada si deben ser referenciadas después de EXITAC. Dado que el contenido de memoria abordado anteriormente en el área de ejecución de códigos autenticados puede ya no ser coherente con la memoria del sistema externo después de EXITAC, el procesador TLBs en apoyo de la traducción lineal a la dirección física también son invalidados.

Una vez terminado GETSEC[EXITAC] se realiza una transferencia indirecta casi absoluta con EIP cargado con el contenido de EBX (basado en el tamaño del modo operativo actual). En modo de 64 bits, los 64 bits de RBX se cargan en RIP si REX.W precede a GETSEC[EXITAC]. De lo contrario RBX es tratado como 32 bits incluso mientras que en modo 64-bit. La comprobación del límite de CS convencional se realiza como parte de esta transferencia de control. Cualquier condición de excepción generada como parte de esta transferencia de control se dirigirá a la IDT existente; por lo tanto se recomienda que un IDTR también debe establecerse antes de la ejecución de la función EXITAC si hay una necesidad de manejo de fallas. Además, cualquier segmentación relacionada (y paging) estructuras de datos que se utilicen después de EXITAC debe ser restablecida o validada por el código autenticado antes de EXITAC.

Además, cualquier segmentación relacionada (y paging) estructuras de datos que se utilizarán después de que EXITAC tenga que ser restablecido y mapeado fuera del área designada RAM autenticada por el código autenticado antes de EXITAC. Cualquier estructura de datos que se mantenga dentro de la zona autenticada RAM asignada ya no será accesible después de su terminación por EXITAC.

## Operación

```text
(* The state of the internal flag ACMODEFLAG and SENTERFLAG persist across instruction boundary *)
IF (CR4.SMXE=0)

    THEN #UD;
ELSIF ( in VMX non-root operation)

    THEN VM Exit (reason="GETSEC instruction");
ELSIF (GETSEC leaf unsupported)

    THEN #UD;
ELSIF ((in VMX operation) or ( (in 64-bit mode) and ( RBX is non-canonical) )

    (CR0.PE=0) or (CPL>0) or (EFLAGS.VM=1) or
    (ACMODEFLAG=0) or (IN_SMM=1)) or (EDX  0))
    THEN #GP(0);
IF (OperandSize = 32)
    THEN tempEIP := EBX;
ELSIF (OperandSize = 64)
    THEN tempEIP := RBX;
ELSE
    tempEIP := EBX AND 0000FFFFH;
IF (tempEIP > code segment limit)
    THEN #GP(0);
IF (ACRAM[CR4High].FRED = 1) and (IA32_EFER.LMA = 0)
    THEN #GP(0);
ELSE CR4.FRED = ACRAM[CR4High].FRED;
Invalidate ACRAM contents;
Invalidate processor TLB(s);
Drain outgoing messages;
SignalTXTMsg(CloseLocality3);
SignalTXTMsg(LockSMRAM);
SignalTXTMsg(ProcessorRelease);
Unmask INIT;
IF (SENTERFLAG=0)
    THEN Unmask SMI, INIT, NMI, and A20M pin event;
ELSEIF (IA32_SMM_MONITOR_CTL[0] = 0)
    THEN Unmask SMI pin event;
ACMODEFLAG := 0;
IF IA32_EFER.LMA == 1
    THEN CR3 := R8;
EIP := tempEIP;
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

REX.W Sets 64-bit mode tamaño de operando atributo.
