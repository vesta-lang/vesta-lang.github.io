---
summary: Enviar Interruptor de Interprocesador de Usuario
---

## Descripción

La instrucción SENDUIPI envía la interrupción del interprocesador del usuario (IPI) indicada por su registro operando. (el operando siempre tiene 64 bits; operando-size anula como el prefijo 66 son ignorados.)

SENDUIPI utiliza una estructura de datos llamada la tabla de destino interrumpida por el usuario (UITT). Esta tabla se encuentra en la dirección lineal UITTADDR (en el IA32 UINTR TT MSR); consta de entradas UITTSZ+1 de 16 bytes, donde UITTSZ = IA32 UINT MISC[31:0]. SENDUIPI utiliza la entrada UITT (UITTE) indexada por el registro de la instrucción operando. Cada UITTE tiene el siguiente formato:

* Un poco: V, un poco válido. * Los bits 7:1 están reservados y deben ser 0. * Bits 15:8: UV, el vector de interrupción del usuario (en el rango 063, por lo que los bits 15:14 deben ser 0). * Los bits 63:16 están reservados. * Bits 127:64: UPIDADDR, la dirección lineal de un descriptor de interfaz de usuario (UPID). (UPIDADDR es 64-

byte alineado, por lo que los bits 69:64 de cada UITTE debe ser 0.)

Cada UPID tiene el siguiente formato (campos y bits no referenciados están reservados):

* El bit 0 (ON) indica una notificación pendiente. Si se establece este bit, hay una notificación pendiente para uno o

más usuarios interrumpen en PIR.

* El bit 1 (SN) indica que las notificaciones deben suprimirse. Si se establece este bit, agentes (incluyendo SENDUIPI)

no debe enviar notificaciones cuando el usuario interrumpe en este descriptor.

* Los bits 23:16 (NV) contienen el vector de notificación. Esto es utilizado por los agentes que envían notificaciones interrumpidas por el usuario

(incluyendo SENDUIPI).

* Los bits 63:32 (NDST) contienen el destino de notificación. Este es el identificador APIC físico objetivo (en modo xAPIC,

bits 47:40 son el ID APIC de 8 bits; en modo x2APIC, todo el campo forma el ID APIC de 32 bits).

* Los bits 127:64 (PIF) contienen solicitudes de interrupción publicadas. Hay un poco para cada vector interrumpido por el usuario. Hay un

solicitud de interrupción del usuario para un vector si el bit correspondiente es 1.

Aunque SENDUIPI puede ser ejecutado a cualquier nivel de privilegio, todos los accesos de memoria de la instrucción (a un UITTE y un UPID) se realizan con privilegio supervisor.

SENDUIPI envía una interrupción del usuario publicando una interrupción del usuario con el vector V en el UPID referenciado por UPIDADDR y luego enviando, como un IPI ordinario, cualquier interrupción de notificación especificada en ese UPID.

## Operación

```text
    IF reg > UITTSZ;
          THEN #GP(0);

    FI;
    read tempUITTE from 16 bytes at UITTADDR+ (reg << 4);
    IF tempUITTE.V = 0 or tempUITTE sets any reserved bit

          THEN #GP(0);
    FI;


read tempUPID from 16 bytes at tempUITTE.UPIDADDR;// under lock
IF tempUPID sets any reserved bits or bits that must be zero

      THEN #GP(0); // release lock
FI;
tempUPID.PIR[tempUITTE.UV] := 1;
IF tempUPID.SN = tempUPID.ON = 0

      THEN
            tempUPID.ON := 1;
            sendNotify := 1;

      ELSE sendNotify := 0;
FI;
write tempUPID to 16 bytes at tempUITTE.UPIDADDR;// release lock
IF sendNotify = 1

      THEN
            IF local APIC is in x2APIC mode
                  THEN send ordinary IPI with vector tempUPID.NV
                        to 32-bit physical APIC ID tempUPID.NDST;
                  ELSE send ordinary IPI with vector tempUPID.NV
                        to 8-bit physical APIC ID tempUPID.NDST[15:8];
            FI;

FI;
```

## Banderas afectadas

None.
