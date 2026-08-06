---
summary: ASCII Ajustar AL Después de la Sustracción
---

## Descripción

Ajusta el resultado de la resta de dos valores BCD sin empaquetar para crear un resultado BCD sin empaquetar. El registro AL es la fuente implícita y operando de destino para esta instrucción. La instrucción AAS sólo es útil cuando sigue una instrucción SUB que resta (tracción binaria) un valor BCD desempaquetado de otro y almacena un resultado byte en el registro AL. La instrucción AAA ajusta el contenido del registro AL para contener el resultado de BCD de 1 dígitos correcto.

Si la resta produjo un porte decimal, el AH registra decrementos en 1, y las banderas CF y AF se establecen. Si no se produce ningún transporte decimal, las banderas CF y AF se limpian, y el registro AH no se cambia. En cualquier caso, el registro AL se deja con sus cuatro primeros bits fijados a 0.

Esta instrucción se ejecuta como se describe en modo de compatibilidad y modo legado. No es válido en modo de 64 bits.

## Operación

```text
IF 64-bit mode
    THEN
          #UD;
    ELSE

        IF ((AL AND 0FH) > 9) or (AF = 1)

                THEN
                      AX := AX  6;
                      AH := AH  1;
                      AF := 1;
                      CF := 1;
                      AL := AL AND 0FH;

                ELSE
                      CF := 0;
                      AF := 0;
                      AL := AL AND 0FH;

          FI;
FI;
```

## Banderas afectadas

Las banderas AF y CF se fijan a 1 si hay un préstamo decimal; de lo contrario, se limpian a 0. Las banderas OF, SF, ZF y PF quedan indefinidas.
