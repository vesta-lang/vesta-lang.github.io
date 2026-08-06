---
summary: Adición sin firma de dos operandos con bandera de acarreo
---

## Descripción

Realiza una adición no firmada del operando de destino (primer operando), el operando de origen (segundo operando) y el plomo (CF) y almacena el resultado en el operando de destino. El operando de destino es un registro para fines generales, mientras que el operando de origen puede ser un registro de proposito general o ubicación de memoria. El estado de CF puede representar una carga de una adición anterior. La instrucción establece la bandera CF con el porte generado por la adición no firmada de los operandos.

La instrucción ADCX se ejecuta en el contexto de la adición de multiprecisión, donde se agrega una serie de operandos con una cadena de carga. Al comienzo de una cadena de adiciones, necesitamos asegurarnos de que el CF esté en un estado inicial deseado. A menudo, este estado inicial necesita ser 0, que se puede lograr con una instrucción a cero el CF (por ejemplo, XOR).

Esta instrucción se soporta en modo real y modo virtual-8086. El tamaño de operando es siempre 32 bits si no en modo de 64 bits.

En modo 64-bit, el tamaño de operación predeterminado es de 32 bits. Utilizando un Prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-15). Utilizando REX Prefix en forma de REX.W promueve la operación a 64 bits.

ADCX ejecuta normalmente dentro o fuera de una región de transacción. Nota: ADCX define la bandera OF de forma diferente a las instrucciones ADD/ADC definidas en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2A.

## Operación

```text
IF OperandSize is 64-bit

    THEN CF:DEST[63:0] := DEST[63:0] + SRC[63:0] + CF;
    ELSE CF:DEST[31:0] := DEST[31:0] + SRC[31:0] + CF;
FI;
```

## Banderas afectadas

CF se actualiza sobre la base del resultado. Las banderas de SF, ZF, AF y PF no están modificadas.

## Intel C/C++ compilador intrínseco

```c
unsigned char _addcarryx_u32 (unsigned char c_in, unsigned int src1, unsigned int src2, unsigned int *sum_out);
unsigned char _addcarryx_u64 (unsigned char c_in, unsigned __int64 src1, unsigned __int64 src2, unsigned __int64 *sum_out);
```

## SIMD coma flotante Excepciones

None.
