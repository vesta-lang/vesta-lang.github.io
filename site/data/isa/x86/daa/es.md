---
summary: Ajuste decimal AL después de la adición
---

## Descripción

Ajuste la suma de dos valores de BCD empaquetados para crear un resultado de BCD empaquetado. El registro AL es la fuente implícita y operando de destino. La instrucción DAA sólo es útil cuando sigue una instrucción ADD que añade (adicionario binario) dos valores de 2 dígitos, empaquetados BCD y almacena un resultado byte en el registro AL. La instrucción DAA ajusta el contenido del registro AL para contener el resultado correcto de 2 dígitos, empaquetado BCD. Si se detecta una carga decimal, las banderas CF y AF se establecen en consecuencia.

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
                     AL := AL + 6;
                     CF := old_CF or (Carry from AL := AL + 6);
                       AF := 1;

                 ELSE
                       AF := 0;

          FI;
         IF ((old_AL > 99H) or (old_CF = 1))

                THEN
                     AL := AL + 60H;
                       CF := 1;

                ELSE
                       CF := 0;

          FI;
FI;

Example     Before: AL=79H BL=35H EFLAGS(OSZAPC)=XXXXXX
ADD AL, BL  After: AL=AEH BL=35H EFLAGS(0SZAPC)=110000
            Before: AL=AEH BL=35H EFLAGS(OSZAPC)=110000
DAA         After: AL=14H BL=35H EFLAGS(0SZAPC)=X00111
            Before: AL=2EH BL=35H EFLAGS(OSZAPC)=110000
DAA         After: AL=34H BL=35H EFLAGS(0SZAPC)=X00101
```

## Banderas afectadas

Las banderas CF y AF se establecen si el ajuste del valor resulta en una carga decimal en cualquiera de los dígitos del resultado (ver la sección "Operación" arriba). Las banderas SF, ZF y PF se establecen según el resultado. La bandera OF no está definida.
