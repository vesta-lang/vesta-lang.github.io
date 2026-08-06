---
summary: Moveos
---

## Descripción

Copia el segundo operando (operando de origen) al primer operando (operando de destino). El operando de origen puede ser un valor inmediato, registro de proposito general, registro de segmentos, o ubicación de memoria; el registro de destino puede ser un registro de proposito general, registro de segmentos, o ubicación de memoria. Ambos operandos deben ser del mismo tamaño, que puede ser un byte, una palabra, una palabra doble, o un cuadword.

La instrucción MOV no se puede utilizar para cargar el registro CS. Intento hacerlo resultados en una excepción de código de operación no válido (#UD). Para cargar el registro CS, utilice la instrucción JMP, CALL o RET.

Si el operando de destino es un registro de segmentos (DS, ES, FS, GS o SS), el operando de origen debe ser un selector de segmento válido. En modo protegido, mover un selector de segmento en un registro de segmento automáticamente hace que la información descriptor de segmento asociada a que selector de segmento se cargue en la parte oculta (shadow) del registro de segmento. Al cargar esta información, se valida la información de descriptor el selector de segmento y segmento (ver el algoritmo de "Operación"). Los datos del descriptor de segmento se obtienen de la entrada GDT o LDT para el selector de segmento especificado.

A NULL selector de segmento (valores 0000-0003) se puede cargar en los registros DS, ES, FS y GS sin causar una excepción de protección. Sin embargo, cualquier intento subsiguiente de referencia a un segmento cuyo registro de segmento correspondiente está cargado con un valor NULL causa una excepción de protección general (#GP) y no se produce ninguna referencia de memoria.

Cargar el registro SS con una instrucción MOV suprime o inhibe algunas excepciones de depuración e inhibe interrumpir en el siguiente límite de instrucción. (La inhibición termina después de la entrega de una excepción o la ejecución de la siguiente instrucción.) Este comportamiento permite que un puntero de pila se cargue en el registro ESP con la siguiente instrucción (MOV ESP, valor de punta de pila) antes de que se pueda entregar un evento. Ver la sección 7.8.3, "Masking Excepciones e Interrupciones Al Interruptores", en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A. Intel recomienda que el software use la instrucción LSS para cargar el registro SS y ESP juntos.

Al ejecutar MOV Reg, Sreg, el procesador copia el contenido de Sreg a los 16 bits menos significativo del registro de proposito general. Los bits superiores del registro de destino son cero para la mayoría de procesadores IA-32 (procesadores Pentium Pro y más tarde) y todos los procesadores Intel 64, con la excepción de que bits 31:16 quedan indefinidas para procesadores Intel Quark X1000, Pentium y procesadores anteriores.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
DEST := SRC;

Loading a segment register while in protected mode results in special checks and actions, as described in the following listing. These
checks are performed on the segment selector and the segment descriptor to which it points.

IF SS is loaded
    THEN
          IF segment selector is NULL
                THEN #GP(0); FI;
          IF segment selector index is outside descriptor table limits

        OR segment selector's RPL  CPL


          OR segment is not a writable data segment

        OR DPL  CPL

                THEN #GP(selector); FI;
          IF segment not marked present

                THEN #SS(selector);
                ELSE

                      SS := segment selector;
                      SS := segment descriptor; FI;
FI;

IF DS, ES, FS, or GS is loaded with non-NULL selector
THEN

    IF segment selector index is outside descriptor table limits
    OR segment is not a data or readable code segment
    OR ((segment is a data or nonconforming code segment) AND ((RPL > DPL) or (CPL > DPL)))

          THEN #GP(selector); FI;
    IF segment not marked present

          THEN #NP(selector);
          ELSE

                SegmentRegister := segment selector;
                SegmentRegister := segment descriptor; FI;
FI;

IF DS, ES, FS, or GS is loaded with NULL selector
    THEN
          SegmentRegister := segment selector;
          SegmentRegister := segment descriptor;

FI;
```

## Banderas afectadas

None.
