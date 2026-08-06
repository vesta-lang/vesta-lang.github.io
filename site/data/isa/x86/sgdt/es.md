---
summary: Store Global Descriptor Table Register
---

## Descripción

Almacena el contenido del registro mundial de tablas de descriptores (GDTR) en el operando de destino. El operando de destino especifica una ubicación de memoria.

En el modo legado o compatibilidad, el operando de destino es una ubicación de memoria de 6 bytes. Si el atributo el operando-size es de 16 o 32 bits, el campo límite de 16 bits del registro se almacena en los 2 bytes bajos de la ubicación de memoria y la dirección base de 32 bits se almacena en los 4 bytes altos.

En modo de 64 bits, el tamaño de operando se fija en 8+2 bytes. La instrucción almacena una base de 8 bytes y un límite de 2 bytes.

SGDT es útil sólo por software del sistema operativo. Sin embargo, se puede utilizar en programas de aplicación sin causar una excepción a generar si CR4.UMIP = 0. Ver "LGDT/LIDT--Load Global/Interrupt Descriptor Table Register" en Capítulo 3, Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2A, para información sobre la carga del GDTR y IDTR.

## Compatibilidad de arquitectura IA-32

La forma de 16 bits del SGDT es compatible con el procesador Intel 286 si no se hacen referencia a los 8 bits superiores. El procesador Intel 286 llena estos bits con 1s; generaciones procesadoras más tarde que el procesador Intel 286 llenan estos bits con 0s.

## Operación

```text
IF instruction is SGDT
          IF OperandSize =16 or OperandSize = 32 (* Legacy or Compatibility Mode *)
                THEN
                      DEST[0:15] := GDTR(Limit);
                      DEST[16:47] := GDTR(Base); (* Full 32-bit base address stored *)
                      FI;
                ELSE (* 64-bit Mode *)
                      DEST[0:15] := GDTR(Limit);
                      DEST[16:79] := GDTR(Base); (* Full 64-bit base address stored *)
          FI;

FI;
```

## Banderas afectadas

None.
