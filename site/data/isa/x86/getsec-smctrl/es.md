---
summary: Control de Modo SMX
---

## Descripción

La instrucción GETSEC[SMCTRL] está disponible para realizar ciertas operaciones de control de modos específicas SMX. La operación a realizar se selecciona a través del registro de entrada EBX. Actualmente solo se admite un valor de entrada en EBX de 0. Todas las otras configuraciones de EBX resultarán en la señalización de una violación de protección general.

Si EBX se establece a 0, entonces el SMCTRL hoja se utiliza para eventos SMI re-enable. SMI está enmascarado por el ILP ejecutando la instrucción GETSEC[SENTER] (SMI también está enmascarado en los procesadores lógicos que responden en respuesta a los mensajes de cita SENTER). La determinación de cuándo se permite esta instrucción y los acontecimientos que se desenmascaran dependen del contexto del procesador (véase el cuadro 7-11). Para la brevedad, el uso de SMCTRL donde EBX=0 se denominará GETSEC[SMCTRL(0)].

Como parte del apoyo para el lanzamiento de un entorno medido, los eventos SMI, NMI y INIT se enmascaran después de GETSEC[SENTER], y permanecen enmascarados después de salir del modo de ejecución autenticado. La desenmascaración de estos eventos debe ir acompañada de una ayuda segura a estos organizadores de eventos. Estas preocupaciones de seguridad pueden ser abordadas en la operación VMX por un MVMM.

El monitor VM puede elegir dos enfoques:

* En un enfoque de monitor dual, el software ejecutivo establecerá un monitor SMM en paralelo al ejecutivo VMM (es decir, el MVMM), véase Capítulo 34, "Modo de gestión de sistemas", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C. El monitor SMM está dedicado a manejar eventos SMI sin comprometer la seguridad del MVMM. Este modelo de uso de SMI mientras que un entorno medido es activo no requiere el uso de GETSEC[SMCTRL(0)] como evento de re-envejecimiento después del lanzamiento del entorno VMX se maneja implícitamente y a través de controles basados VMX separados.

* Si no se establecerá un monitor SMM dedicado y los IAM se manejarán dentro de la medida

entorno, entonces GETSEC[SMCTRL(0)] puede ser utilizado por el software ejecutivo para re-enable SMI que ha sido enmascarado como resultado de SENTER.

En el cuadro 7-11 se define el contexto del procesador en el que se puede utilizar GETSEC[SMCTRL(0)] y qué eventos se desenmascararán. Tenga en cuenta que los eventos que están desenmascarados dependen del contexto actual del procesador.

** Acciones supuestas para GETSEC[SMCTRL(0)]**

| Modo de operación ILP | SMCTRL execution action |
| --- | --- |
| En VMX operación no-root | VM de salida |
| SENTERFLAG = 0 | #GP(0), contexto ilegal |
| En modo de ejecución de código autenticado | #GP(0), contexto ilegal |
| (ACMODEFLAG = 1) |  |
| SENTERFLAG = 1, no en la operación VMX, no en SMM | Unmask SMI |
| SENTERFLAG = 1, en la operación raíz VMX, no en | Unmask SMI si el monitor SMM no está configurado, de lo contrario #GP(0) |
| SMM |  |
| SENTERFLAG = 1, En la operación raíz VMX, en SMM | #GP(0), contexto ilegal |
| GETSEC[SMCTRL]--SMX Mode Control |  |
|  | SAFER MODE EXTENSIONS REFERENCE |

## Operación

```text
(* The state of the internal flag ACMODEFLAG and SENTERFLAG persist across instruction boundary *)
IF (CR4.SMXE=0)

    THEN #UD;
ELSE IF (in VMX non-root operation)

    THEN VM Exit (reason="GETSEC instruction");
ELSE IF (GETSEC leaf unsupported)

    THEN #UD;
ELSE IF ((CR0.PE=0) or (CPL>0) OR (EFLAGS.VM=1))

    THEN #GP(0);
ELSE IF((EBX=0) and (SENTERFLAG=1) and (ACMODEFLAG=0) and (IN_SMM=0) and

           (((in VMX root operation) and (SMM monitor not configured)) or (not in VMX operation)) )
    THEN unmask SMI;
ELSE
    #GP(0);
END
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

REX              Ignored.
