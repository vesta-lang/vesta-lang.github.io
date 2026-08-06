---
summary: Divide no firmado
---

## Descripción

Divide sin asignar el valor en el AX, DX:AX,EDX:EAXoRDX:RAXregistros (dividendo) porel operando de origen(divisor) y almacena el resultado en el AX (AH:AL), DX:AX,EDX:EAXoRDX:RAXregistros. El operando de origen puede ser un registro de proposito general o una ubicación de memoria. La acción de esta instrucción depende del tamaño de operando (dividend/divisor). La división que utiliza operando de 64 bits sólo está disponible en modo de 64 bits.

Los resultados no integrados son truncados (recortados) hacia 0. El resto es siempre menos que el divisor en magnitud. El desbordamiento se indica con la excepción #DE (divide error) en lugar de con la bandera CF.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits. En modo de 64 bits cuando se aplica REX.W, la instrucción divide el valor sin signo en RDX:RAX por el operando de origen y almacena el cociente en RAX, el resto en RDX.

Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites. Véase el cuadro 3-17.

**DIV Action**

| Word/byte | AX | r/m8 | AL | AH | 255 |
| --- | --- | --- | --- | --- | --- |
| Espada doble | DX:AX | r/m16 | AX | DX | 65,535 |
| Quadword/dobleword | EDX:EAX | r/m32 | EAX | EDX | 232 - 1 |
| Doble palabra/ | RDX:RAX | r/m64 | RAX | RDX | 264 - 1 |
| quadword |  |  |  |  |  |
| DIV... |  |  |  |  |  |

## Operación

```text
IF SRC = 0

    THEN #DE; FI; (* Divide Error *)
IF OperandSize = 8 (* Word/Byte Operation *)

    THEN
          temp := AX / SRC;
          IF temp > FFH
                THEN #DE; (* Divide error *)
                ELSE
                       AL := temp;
                       AH := AX MOD SRC;
          FI;

   ELSE IF OperandSize = 16 (* Doubleword/word operation *)

          THEN
                temp := DX:AX / SRC;
                IF temp > FFFFH
                       THEN #DE; (* Divide error *)
                ELSE
                       AX := temp;
                       DX := DX:AX MOD SRC;
                FI;

          FI;
    ELSE IF Operandsize = 32 (* Quadword/doubleword operation *)

          THEN
                temp := EDX:EAX / SRC;
                IF temp > FFFFFFFFH
                       THEN #DE; (* Divide error *)
                ELSE
                       EAX := temp;
                       EDX := EDX:EAX MOD SRC;
                FI;

          FI;
    ELSE IF 64-Bit Mode and Operandsize = 64 (* Doublequadword/quadword operation *)

          THEN
                temp := RDX:RAX / SRC;
                IF temp > FFFFFFFFFFFFFFFFH
                       THEN #DE; (* Divide error *)
                ELSE
                       RAX := temp;
                       RDX := RDX:RAX MOD SRC;
                FI;

          FI;
FI;
```

## Banderas afectadas

El CF, OF, SF, ZF, AF y PF banderas quedan indefinidas.
