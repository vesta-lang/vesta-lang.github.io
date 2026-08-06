---
summary: Apaga un valor de la plataforma
---

## Descripción

Carga el valor desde la parte superior de la pila a la ubicación especificada con el operando de destino (o explícita código de operación) y luego aumenta el puntero de pila. El operando de destino puede ser un registro de proposito general, ubicación de memoria, o registro de segmentos.

Los tamaños de dirección y operando se determinan y utilizan de la siguiente manera:

* Tamaño de la dirección. La bandera D en el descriptor de código-segment actual determina el tamaño de la dirección predeterminada; puede ser

prefijo de instrucción (67H).

El tamaño de la dirección se utiliza sólo cuando se escribe a un operando de destino en memoria.

* Tamaño de operando. La bandera D en el descriptor de código actual determina el tamaño de operando predeterminado; puede

ser sobrescribido por prefijos de instrucción (66H o REX.W).

El tamaño de operando (16, 32, o 64 bits) determina la cantidad por la que se aumenta el puntero de pila (2, 4 o 8).

* Tamaño de la dirección. Fuera del modo 64-bit, la bandera B en el descriptor de la pila actual determina el

tamaño del puntero de pila (16 o 32 bits); en modo de 64 bits, el tamaño del puntero de pila es siempre 64 bits.

El tamaño de la dirección de la pila determina el ancho del puntero de pila cuando la lectura de la pila en la memoria y cuando aumenta el puntero de pila. (Como se indicó anteriormente, la cantidad por la que se aumenta el puntero de pila es determinada por el tamaño de operando.)

Si el operando de destino es uno de los registros del segmento DS, ES, FS, GS o SS, el valor cargado en el registro debe ser un selector de segmento válido. En modo protegido, golpear un selector de segmento en un registro de segmentos automat-

ically causes the descriptor information associated with that segment selector to be loaded into the hidden (shadow) part of the segment register and causes the selector and the descriptor information to be validated (see the "Operation" section below).

Un valor NULL (0000-0003) se puede introducir en el registro DS, ES, FS o GS sin causar una falla de protección general. Sin embargo, cualquier intento subsiguiente de referencia a un segmento cuyo registro de segmento correspondiente se carga con un valor NULL causa una excepción de protección general (#GP). En esta situación, no se produce referencia de memoria y el valor guardado del registro de segmento es NULL.

La instrucción POP no puede introducir un valor en el registro CS. Para cargar el registro CS de la pila, utilice la instrucción RET.

Si el registro ESP se utiliza como un registro base para abordar un operando de destino en memoria, la instrucción POP compute la dirección efectiva del operando después de que aumenta el registro ESP. Para el caso de una pila de 16 bits donde ESP envuelve a 0H como resultado de la instrucción POP, la ubicación resultante de la escritura de memoria es procesor familiar.

La instrucción POP ESP aumenta el puntero de pila (ESP) antes de que los datos en la parte superior antigua de la pila se escriban en el destino.

Cargar el registro SS con una instrucción POP suprime o inhibe algunas excepciones de depuración e inhibe interrumpir en el siguiente límite de instrucción. (La inhibición termina después de la entrega de una excepción o la ejecución de la siguiente instrucción.) Este comportamiento permite que un puntero de pila se cargue en el registro ESP con la siguiente instrucción (POP ESP) antes de que un evento pueda ser entregado. Ver la sección 7.8.3, "Masking Excepciones e Interrupciones Al Interruptores", en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A. Intel recomienda que el software use la instrucción LSS para cargar el registro SS y ESP juntos.

En modo de 64 bits, el uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Cuando en modo de 64 bits, los COP usando operandos de 32 bits no son encodables y los COP a DS, ES, SS no son válidos. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
IF StackAddrSize = 32
    THEN
          IF OperandSize = 32
                THEN
                      DEST := SS:ESP; (* Copy a doubleword *)
                      ESP := ESP + 4;
               ELSE (* OperandSize = 16*)
                      DEST := SS:ESP; (* Copy a word *)
                      ESP := ESP + 2;
          FI;
    ELSE IF StackAddrSize = 64
          THEN
                IF OperandSize = 64
                      THEN
                            DEST := SS:RSP; (* Copy quadword *)
                            RSP := RSP + 8;
                      ELSE (* OperandSize = 16*)
                            DEST := SS:RSP; (* Copy a word *)
                            RSP := RSP + 2;
                FI;
          FI;
    ELSE StackAddrSize = 16
          THEN
                IF OperandSize = 16
                      THEN
                            DEST := SS:SP; (* Copy a word *)
                            SP := SP + 2;


                      ELSE (* OperandSize = 32 *)
                            DEST := SS:SP; (* Copy a doubleword *)
                            SP := SP + 4;

                FI;

FI;

Loading a segment register while in protected mode results in special actions, as described in the following listing.
These checks are performed on the segment selector and the segment descriptor it points to.

64-BIT_MODE
IF FS, or GS is loaded with non-NULL selector;

    THEN
          IF segment selector index is outside descriptor table limits
                OR segment is not a data or readable code segment
                OR ((segment is a data or nonconforming code segment)
                      AND ((RPL > DPL) or (CPL > DPL))
                            THEN #GP(selector);
                IF segment not marked present
                      THEN #NP(selector);
          ELSE
                SegmentRegister := segment selector;
                SegmentRegister := segment descriptor;
          FI;

FI;
IF FS, or GS is loaded with a NULL selector;

          THEN
                SegmentRegister := segment selector;
                SegmentRegister := segment descriptor;

FI;

PREOTECTED MODE OR COMPATIBILITY MODE;

IF SS is loaded;
    THEN
          IF segment selector is NULL
                THEN #GP(0);
          FI;
          IF segment selector index is outside descriptor table limits
               or segment selector's RPL  CPL
                or segment is not a writable data segment
               or DPL  CPL
                      THEN #GP(selector);
          FI;
          IF segment not marked present
                THEN #SS(selector);
                ELSE
                      SS := segment selector;
                      SS := segment descriptor;
          FI;

FI;

IF DS, ES, FS, or GS is loaded with non-NULL selector;
    THEN


          IF segment selector index is outside descriptor table limits
                or segment is not a data or readable code segment
                or ((segment is a data or nonconforming code segment)
                and ((RPL > DPL) or (CPL > DPL))
                      THEN #GP(selector);

          FI;
          IF segment not marked present

                THEN #NP(selector);
                ELSE

                      SegmentRegister := segment selector;
                      SegmentRegister := segment descriptor;
           FI;
FI;

IF DS, ES, FS, or GS is loaded with a NULL selector
    THEN
          SegmentRegister := segment selector;
          SegmentRegister := segment descriptor;

FI;
```

## Banderas afectadas

None.
