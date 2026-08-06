---
summary: ASCII Ajust AX Before Division
---

## Descripción

Ajusta dos dígitos BCD sin empaquetar (el dígito menos significativo en el registro AL y el dígito más significativo en el registro AH) para que una operación de división realizada en el resultado produzca un valor BCD no empaquetado. La instrucción AAD sólo es útil cuando precede una instrucción DIV que divide (división binaria) el valor ajustado en el registro AX por un valor BCD sin empaquetar.

La instrucción AAD establece el valor en el registro AL (AL + (10) * AH)), y luego despeja el registro AH a 00H. El valor en el registro AX es entonces igual al equivalente binario del número original de dos dígitos (base 10) en los registros AH y AL.

La versión generalizada de esta instrucción permite el ajuste de dos dígitos sin empaquetar de cualquier base número (ver la sección "Operación" abajo), estableciendo el byte imm8 a la base número seleccionada (por ejemplo, 08H para octal, 0AH para decimal, o 0CH para números base 12). El AAD mnemonic es interpretado por todos los montadores para ajustar los valores de ASCII (base 10). Para ajustar los valores en otra base de números, la instrucción debe ser codificada a mano en el código de máquina (D5 imm8).

Esta instrucción se ejecuta como se describe en modo de compatibilidad y modo legado. No es válido en modo de 64 bits.

## Operación

```text
IF 64-Bit Mode
    THEN
          #UD;
    ELSE
          tempAL := AL;
          tempAH := AH;
          AL := (tempAL + (tempAH  imm8)) AND FFH;
          (* imm8 is set to 0AH for the AAD mnemonic.*)
          AH := 0;

FI;
The immediate value (imm8) is taken from the second byte of the instruction.
```

## Banderas afectadas

Las banderas SF, ZF y PF se establecen según el valor binario resultante en el registro AL; las banderas OF, AF y CF quedan indefinidas.
