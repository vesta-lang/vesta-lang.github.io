---
summary: Carga Far Pointer
---

## Descripción

Carga un puntero lejano (selector de segmento y offset) del segundo operando (operando de origen) en un registro de segmentos y el primer operando (operando de destino). El operando de origen especifica un puntero de 48 bits o de 32 bits en memoria dependiendo del ajuste actual del atributo de tamaño el operando (32 bits o 16 bits, respectivamente). La instrucción código de operación y el operando de destino especifican un registro de segmento/registro de proposito general par. El selector de segmento de 16 bits del operando de origen se carga en el registro de segmento especificado con el código de operación (DS, SS, ES, FS, o GS). El offset de 32 bits o 16 bits se carga en el registro especificado con el operando de destino.

Si una de estas instrucciones se ejecuta en modo protegido, la información adicional del descriptor de segmento apuntado por el selector de segmento en el operando de origen se carga en la parte oculta del registro de segmento seleccionado.

También en modo protegido, un selector NULL (valores 0000 a 0003) se puede cargar en registros DS, ES, FS o GS sin causar una excepción de protección. (Cualquier referencia posterior a un segmento cuyo registro de segmento correspondiente está cargado con un selector NULL, causa una excepción de protección general (#GP) y no se produce ninguna referencia de memoria al segmento).

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. Utilizando un prefijo REX en forma de REX.W promueve la operación para especificar la referencia un operando de origen de un puntero de 80 bits (16-bit selector, 64-bit offset) en memoria. El uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
64-BIT_MODE
    IF SS is loaded
          THEN

             IF SegmentSelector = NULL and ( (RPL = 3) or
                       (RPL  3 and RPL  CPL) )

                      THEN #GP(0);
                ELSE IF descriptor is in non-canonical space


                       THEN #GP(selector); FI;
                ELSE IF Segment selector index is not within descriptor table limits

                       or segment selector RPL  CPL

                             or access rights indicate nonwritable data segment

                       or DPL  CPL

                       THEN #GP(selector); FI;
                ELSE IF Segment marked not present

                       THEN #SS(selector); FI;
                FI;
                SS := SegmentSelector(SRC);
                SS := SegmentDescriptor([SRC]);
    ELSE IF attempt to load DS, or ES
          THEN #UD;
    ELSE IF FS, or GS is loaded with non-NULL segment selector
          THEN IF Segment selector index is not within descriptor table limits
                or access rights indicate segment neither data nor readable code segment
                or segment is data or nonconforming-code segment
                and ( RPL > DPL or CPL > DPL)

                       THEN #GP(selector); FI;
                ELSE IF Segment marked not present

                       THEN #NP(selector); FI;
                FI;
                SegmentRegister := SegmentSelector(SRC) ;
                SegmentRegister := SegmentDescriptor([SRC]);
          FI;
    ELSE IF FS, or GS is loaded with a NULL selector:
          THEN
                SegmentRegister := NULLSelector;
                SegmentRegister(DescriptorValidBit) := 0; FI; (* Hidden flag;

                       not accessible by software *)
    FI;
    DEST := Offset(SRC);

PREOTECTED MODE OR COMPATIBILITY MODE;
    IF SS is loaded
          THEN

             IF SegementSelector = NULL

                       THEN #GP(0);
                ELSE IF Segment selector index is not within descriptor table limits

                       or segment selector RPL  CPL

                             or access rights indicate nonwritable data segment

                       or DPL  CPL

                       THEN #GP(selector); FI;
                ELSE IF Segment marked not present

                       THEN #SS(selector); FI;
                FI;
                SS := SegmentSelector(SRC);
                SS := SegmentDescriptor([SRC]);
    ELSE IF DS, ES, FS, or GS is loaded with non-NULL segment selector
          THEN IF Segment selector index is not within descriptor table limits
                or access rights indicate segment neither data nor readable code segment
                or segment is data or nonconforming-code segment
                and (RPL > DPL or CPL > DPL)

                       THEN #GP(selector); FI;
                ELSE IF Segment marked not present


                      THEN #NP(selector); FI;
                FI;
                SegmentRegister := SegmentSelector(SRC) AND RPL;
                SegmentRegister := SegmentDescriptor([SRC]);
          FI;
    ELSE IF DS, ES, FS, or GS is loaded with a NULL selector:
          THEN
                SegmentRegister := NULLSelector;
                SegmentRegister(DescriptorValidBit) := 0; FI; (* Hidden flag;

                      not accessible by software *)
    FI;
    DEST := Offset(SRC);

Real-Address or Virtual-8086 Mode
    SegmentRegister := SegmentSelector(SRC); FI;
    DEST := Offset(SRC);
```

## Banderas afectadas

None.
