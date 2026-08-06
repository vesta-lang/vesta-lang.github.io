---
summary: Ajuste decimal AL Después de la Sustracción
---

## Descripción

Ajusta el resultado de la resta de dos valores BCD empaquetados para crear un resultado BCD empaquetado. El registro AL es la fuente implícita y operando de destino. La instrucción DAS sólo es útil cuando sigue una instrucción SUB que resta (tracción binaria) un valor de 2 dígitos, empaquetado BCD de otro y almacena un resultado byte en el registro AL. La instrucción DAS ajusta el contenido del registro AL para contener el resultado correcto de 2 dígitos, empaquetado BCD. Si se detecta un préstamo decimal, las banderas CF y AF se establecen en consecuencia.

Esta instrucción se ejecuta como se describe anteriormente en modo de compatibilidad y modo legado. No es válido en modo de 64 bits.

## Operación

```text
IF 64-Bit Mode
    THEN
          #UD;
    ELSE
          old_AL := AL;
          old_CF := CF;
          CF := 0;
         IF (((AL AND 0FH) > 9) or AF = 1)
                THEN
                    AL := AL - 6;

                  CF := old_CF or (Borrow from AL := AL - 6);

                      AF := 1;
                ELSE

                      AF := 0;
          FI;
         IF ((old_AL > 99H) or (old_CF = 1))

                 THEN

                  AL := AL - 60H;

                      CF := 1;
          FI;
FI;

Example     Before: AL = 35H, BL = 47H, EFLAGS(OSZAPC) = XXXXXX
SUB AL, BL  After: AL = EEH, BL = 47H, EFLAGS(0SZAPC) = 010111
            Before: AL = EEH, BL = 47H, EFLAGS(OSZAPC) = 010111
DAA         After: AL = 88H, BL = 47H, EFLAGS(0SZAPC) = X10111
```

## Banderas afectadas

Las banderas CF y AF se establecen si el ajuste del valor resulta en un préstamo decimal en cualquiera de los dígitos del resultado (ver la sección "Operación" arriba). Las banderas SF, ZF y PF se establecen según el resultado. La bandera OF no está definida.
