---
summary: Registro de la tabla descriptor interrumpido
---

## Descripción

Almacena el contenido del registro de tabla de descriptor interrumpido (IDTR) en el operando de destino. El operando de destino especifica una ubicación de memoria de 6 bytes.

En modos no-64 bits, el campo límite de 16 bits del registro se almacena en los 2 bytes bajos de la ubicación de memoria y la dirección base de 32 bits se almacena en los 4 bytes altos.

En modo de 64 bits, el tamaño de operando fijo a 8+2 bytes. La instrucción almacena valores de base de 8 bytes y límite de 2 bytes.

SIDT sólo es útil en el software del sistema operativo; sin embargo, puede ser utilizado en los programas de aplicación sin causar una excepción a ser generado si CR4.UMIP = 0. Ver "LGDT/LIDT--Load Global/Interrupt Descriptor Table Register" en Capítulo 3, Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2A, para información sobre la carga del GDTR y IDTR.

## Compatibilidad de arquitectura IA-32

La forma de 16 bits de SIDT es compatible con el procesador Intel 286 si no se hacen referencia a los 8 bits superiores. El procesador Intel 286 llena estos bits con 1s; generaciones procesadoras más tarde que el procesador Intel 286 llenan estos bits con 0s.

## Operación

```text
IF instruction is SIDT
    THEN
          IF OperandSize =16 or OperandSize = 32 (* Legacy or Compatibility Mode *)
                THEN
                      DEST[0:15] := IDTR(Limit);
                      DEST[16:47] := IDTR(Base); FI; (* Full 32-bit base address stored *)
                ELSE (* 64-bit Mode *)
                      DEST[0:15] := IDTR(Limit);
                      DEST[16:79] := IDTR(Base); (* Full 64-bit base address stored *)
          FI;

FI;
```

## Banderas afectadas

None.
