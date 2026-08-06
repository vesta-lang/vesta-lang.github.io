---
summary: Señalado Divide
---

## Descripción

Divide el valor (firmado) en el AX, DX:AX, o EDX:EAX (dividend) por el operando de origen (divisor) y almacena el resultado en los registros AX (AH:AL), DX:AX, o EDX:EAX. El operando de origen puede ser un registro de proposito general o una ubicación de memoria. La acción de esta instrucción depende del tamaño de operando (dividend/divisor).

Los resultados no integrados son truncados (recortados) hacia 0. El resto es siempre menos que el divisor en magnitud. El desbordamiento se indica con la excepción #DE (divide error) en lugar de con la bandera CF.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits. En modo de 64 bits cuando se aplica REX.W, la instrucción divide el valor con signo en RDX:RAX por el operando de origen. RAX contiene un cociente de 64 bits; RDX contiene un resto de 64 bits.

Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites. Véase el cuadro 3-53.

** Resultados IDIV**

| Tamaño de operando | Dividend | Divisor | Quotient | Restante | Quotient Range |
| --- | --- | --- | --- | --- | --- |
| e                           AX |  | r/m8           AL |  | AH | -128 to +127 |

## Operación

```text
IF SRC = 0

    THEN #DE; (* Divide error *)
FI;

IF OperandSize = 8 (* Word/byte operation *)

    THEN
          temp := AX / SRC; (* Signed division *)
          IF (temp > 7FH) or (temp < 80H)
          (* If a positive result is greater than 7FH or a negative result is less than 80H *)
                THEN #DE; (* Divide error *)
                ELSE
                       AL := temp;
                       AH := AX SignedModulus SRC;
          FI;

   ELSE IF OperandSize = 16 (* Doubleword/word operation *)

          THEN
                temp := DX:AX / SRC; (* Signed division *)
                IF (temp > 7FFFH) or (temp < 8000H)
                (* If a positive result is greater than 7FFFH
                or a negative result is less than 8000H *)
                       THEN
                             #DE; (* Divide error *)
                       ELSE
                             AX := temp;
                             DX := DX:AX SignedModulus SRC;
                FI;

          FI;
    ELSE IF OperandSize = 32 (* Quadword/doubleword operation *)

                temp := EDX:EAX / SRC; (* Signed division *)
                IF (temp > 7FFFFFFFH) or (temp < 80000000H)
                (* If a positive result is greater than 7FFFFFFFH
                or a negative result is less than 80000000H *)

                       THEN
                             #DE; (* Divide error *)

                       ELSE
                             EAX := temp;
                             EDX := EDXE:AX SignedModulus SRC;

                FI;
          FI;
    ELSE IF OperandSize = 64 (* Doublequadword/quadword operation *)

                temp := RDX:RAX / SRC; (* Signed division *)
                IF (temp > 7FFFFFFFFFFFFFFFH) or (temp < 8000000000000000H)
                (* If a positive result is greater than 7FFFFFFFFFFFFFFFH
                or a negative result is less than 8000000000000000H *)

                       THEN
                             #DE; (* Divide error *)

                       ELSE
                             RAX := temp;
                             RDX := RDE:RAX SignedModulus SRC;

                FI;
          FI;
FI;
```

## Banderas afectadas

El CF, OF, SF, ZF, AF y PF banderas quedan indefinidas.
