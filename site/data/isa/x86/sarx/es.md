---
summary: Cambio sin afectar banderas
---

## Descripción

Cambia los bits del primer operando de origen (el segundo operando) a la izquierda o derecha por un valor COUNT especificado en el segundo operando de origen (el tercer operando). El resultado está escrito al operando de destino (el primer operando).

La derecha aritmética del cambio (SARX) y las instrucciones de la derecha lógica del cambio (SHRX) desplazan los bits del operando de destino a la derecha (hacia lugares de bits menos significativos), SARX mantiene y propaga el bit mas significativo ( bit del signo) mientras cambia.

El cambio lógico a la izquierda (SHLX) desplaza los bits del operando de destino a la izquierda (hacia lugares más significativos).

Esta instrucción no es compatible en modo real y modo virtual-8086. El tamaño de operando es siempre 32 bits si no en modo de 64 bits. En modo de 64 bits tamaño de operando 64 requiere VEX.W1. VEX.W1 es ignorado en modos no-64-bit. Un intento de ejecutar esta instrucción con VEX.L no igual a 0 causará #UD.

Si el valor especificado en el primer operando de origen excede OperandSize -1, el valor COUNT está enmascarado.

Las instrucciones SARX,SHRX y SHLX no actualizan las banderas.

## Operación

```text
TEMP := SRC1;
IF VEX.W1 and CS.L = 1
THEN

    countMASK := 3FH;
ELSE

    countMASK := 1FH;
FI
COUNT := SRC2 AND countMASK;

DO WHILE (COUNT  0)
    IF instruction is SHLX
          THEN
                TEMP := TEMP *2;


         ELSE IF instruction is SHRX

         THEN

                TEMP := TEMP /2; //unsigned divide

         ELSE   // SARX

                TEMP := TEMP /2; // signed divide, round toward negative infinity

    FI;

    COUNT := COUNT - 1;

OD

DEST := TEMP;
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-29, "Tipo 13 Condiciones de Excepción de Clase".
