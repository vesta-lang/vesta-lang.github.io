---
summary: ASCII Ajuste después de la adición
---

## Descripción

Ajuste la suma de dos valores BCD sin empaquetar para crear un resultado BCD sin empaquetar. El registro AL es la fuente implícita y operando de destino para esta instrucción. La instrucción AAA sólo es útil cuando sigue una instrucción ADD que añade (adicionario binario) dos valores BCD sin empaquetar y almacena un resultado byte en el registro AL. La instrucción AAA ajusta el contenido del registro AL para contener el resultado de BCD de 1 dígitos correcto.

Si la adición produce una carga decimal, los incrementos de registro AH por 1, y las banderas CF y AF se establecen. Si no hubo carga decimal, las banderas CF y AF se limpian y el registro AH no se cambia. En cualquier caso, los bits 4 a 7 del registro AL se fijan a 0.

Esta instrucción se ejecuta como se describe en modo de compatibilidad y modo legado. No es válido en modo de 64 bits.

## Operación

```text
IF 64-Bit Mode
    THEN
          #UD;
    ELSE

        IF ((AL AND 0FH) > 9) or (AF = 1)

                THEN
                      AX := AX + 106H;
                      AF := 1;
                      CF := 1;

                ELSE
                      AF := 0;
                      CF := 0;

          FI;
          AL := AL AND 0FH;
FI;
```

## Banderas afectadas

Las banderas AF y CF se establecen a 1 si el ajuste resulta en un port decimal; de lo contrario se fijan a 0. Las banderas OF, SF, ZF y PF quedan indefinidas.
