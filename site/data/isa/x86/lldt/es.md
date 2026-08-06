---
summary: Cargar Registro de la tabla local descriptor
---

## Descripción

Carga el operando de origen en el campo el selector de segmento del registro de la mesa descriptor local (LDTR). El operando de origen (un registro de proposito general o una ubicación de memoria) contiene un selector de segmento que apunta a una mesa descriptor local (LDT). Después de que el selector de segmento está cargado en el LDTR, el procesador utiliza el selector de segmento para localizar el descriptor de segmento para el LDT en la tabla de descriptor global (GDT). Luego carga el límite de segmento y la dirección base para el LDT del descriptor de segmento en el LDTR. El segmento registra DS, ES, SS, FS, GS y CS no se ven afectados por esta instrucción, ni el campo LDTR en el segmento de estado de tarea (TSS) para la tarea actual.

Si los bits 2-15 del operando de origen son 0, LDTR es inválido marcado y la instrucción LLDT completa silenciosamente. Sin embargo, todas las referencias posteriores a los descriptores en las instrucciones LDT (excepto por las instrucciones LAR, VERR, VERW o LSL) causan una excepción de protección general (#GP).

El atributo el operando-size no tiene efecto en esta instrucción.

La instrucción LLDT se proporciona para uso en el software del sistema operativo; no debe ser utilizado en los programas de aplicación. Esta instrucción sólo se puede ejecutar en modo modo protegido o 64 bits.

En modo de 64 bits, el tamaño de operando se fija a 16 bits.

## Operación

```text
IF SRC(Offset) > descriptor table limit

    THEN #GP(segment selector); FI;

IF segment selector is valid

    Read segment descriptor;

   IF SegmentDescriptor(Type)  LDT

          THEN #GP(segment selector); FI;
    IF segment descriptor is not present

          THEN #NP(segment selector); FI;

    LDTR(SegmentSelector) := SRC;
    LDTR(SegmentDescriptor) := GDTSegmentDescriptor;
ELSE LDTR := INVALID
FI;
```

## Banderas afectadas

None.
