---
summary: Base de carga GS
---

## Descripción

LKGS funciona de la misma manera que MOV a GS excepto que la dirección base del descriptor se carga en el IA32 KERNEL GS BASE MSR en lugar del caché descriptor del segmento GS.

LKGS toma un solo (fuente) operando, que puede ser un registro de proposito general o una ubicación de memoria. El operando debe ser un selector de segmento válido. La instrucción carga el descriptor del segmento referenciado por ese selector de segmento en el caché descriptor GS, con la excepción de la dirección base. La dirección base en el caché descriptor GS no se modifica; la dirección base del descriptor de segmento se carga en el IA32 KERNEL GS BASE MSR. (Ya que la dirección base en el descriptor es sólo 32 bits, los 32 bits superiores de la MSR se limpian.)

Un selector de segmento null (valores 0000-0003) se puede cargar sin causar una excepción. Sin embargo, cualquier intento subsiguiente de referencia GS fuera del modo 64-bit causa una excepción de protección general (#GP) y ninguna referencia de memoria ocurre. LKGS con un selector de segmento null carga cero en IA32 KERNEL GS BASE.

## Operación

```text
IF CPL > 0 OR logical processor not in 64-bit mode
    THEN #UD; FI;

IF SRC is null
    THEN
          GS.selector := SRC;
          mark GS as null;
          IA32_KERNEL_GS_BASE := 0;
    ELSE
          IF SRC.index is outside descriptor table limits
                THEN #GP(selector); FI;
          read referenced descriptor for descriptor table;
          IF the descriptor is not for a data or readable code segment OR SRC.RPL > descriptor.DPL
                THEN #GP(selector); FI;
          IF the descriptor is not marked present
                THEN #NP(selector);
                ELSE
                      GS.selector := SRC;
                      GS.attributes := descriptor.attributes;
                      IA32_KERNEL_GS_BASE := descriptor.base; // bits 63:32 cleared
          FI;

FI;
```

## Banderas afectadas

None.
