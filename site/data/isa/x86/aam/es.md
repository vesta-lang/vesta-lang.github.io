---
summary: ASCII Ajustar AX Después Multiply
---

## Descripción

Ajusta el resultado de la multiplicación de dos valores BCD sin empaquetar para crear un par de valores sin empaquetar (base 10) BCD. El registro AX es la fuente implícita y operando de destino para esta instrucción. La instrucción AAM sólo es útil cuando sigue una instrucción MUL que multiplica ( multiplicación binaria) dos valores BCD sin empaquetar y almacena un resultado de palabra en el registro AX. La instrucción AAM ajusta el contenido del registro AX para contener el resultado correcto de 2 dígitos sin empaquetar (base 10) BCD.

La versión generalizada de esta instrucción permite ajustar el contenido del AX para crear dos dígitos sin empaquetar de cualquier base de números (ver la sección "Operación" a continuación). Aquí, el byte imm8 se establece en la base número seleccionada (por ejemplo, 08H para octal, 0AH para decimal, o 0CH para números base 12). El AAM mnemonic es interpretado por todos los montadores para significar ajustar a los valores de ASCII (base 10). Para ajustarse a valores en otra base de números, la instrucción debe ser codificada a mano en código de máquina (D4 imm8).

Esta instrucción se ejecuta como se describe en modo de compatibilidad y modo legado. No es válido en modo de 64 bits.

## Operación

```text
IF 64-Bit Mode
    THEN
          #UD;
    ELSE
          tempAL := AL;
          AH := tempAL / imm8; (* imm8 is set to 0AH for the AAM mnemonic *)
          AL := tempAL MOD imm8;

FI;

The immediate value (imm8) is taken from the second byte of the instruction.
```

## Banderas afectadas

Las banderas SF, ZF y PF se establecen según el valor binario resultante en el registro AL. La OF, AF y CF banderas quedan indefinidas.
