---
summary: Rotación
---

## Descripción

Cambios (rota) los bits del primer operando (operando de destino) el número de posiciones de bits especificados en el segundo operando (cuenta operando) y almacena el resultado en el operando de destino. El operando de destino puede ser un registro o una ubicación de memoria; el conteo operando es un entero sin firma que puede ser un valor inmediato o un valor en el registro CL. El conteo está enmascarado a 5 bits (o 6 bits si en modo de 64 bits y REX.W = 1).

Las instrucciones giran a la izquierda (ROL) y giran a través de la izquierda (RCL) desplazan todos los bits hacia posiciones de bits más significativas, excepto por el bit más significativo, que se gira a la ubicación de bits menos significativa. Las instrucciones girar derecha (ROR) y girar a través de la derecha (RCR) desplazan todos los bits hacia posiciones poco significativas menos, excepto por el bit menos significativo, que se gira a la ubicación de bits más significativa.

Las instrucciones RCL y RCR incluyen la bandera CF en la rotación. La instrucción RCL cambia la bandera CF en el bit menos significativo y cambia el bit más significativo en la bandera CF. La instrucción RCR cambia la bandera CF en el bit más significativo y cambia el bit menos significativo en la bandera CF. Para las instrucciones ROL y ROR, el valor original de la bandera CF no es parte del resultado, pero la bandera CF recibe una copia del bit que se cambió de un extremo a otro.

La bandera OF se define sólo para los rotatorios de 1 bit; no está definida en todos los demás casos (excepto las instrucciones RCL y RCR únicamente: un giro de cero bit no hace nada, que no afecta ninguna bandera). Para girar a la izquierda, la bandera OF se fija en el exclusivo quirófano del bit CF (después del giro) y el bit más significativo del resultado. Para girar a la derecha, la bandera OF se fija en el exclusivo OR de los dos bits más significativos del resultado.

En modo de 64 bits, el uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). El uso de REX.W promueve el primer operando a 64 bits y hace que el conteo operando se convierta en un contador de 6 bits.

## Compatibilidad de arquitectura IA-32

El 8086 no enmascara el recuento de rotación. Sin embargo, todos los demás procesadores IA-32 (comenzando con el procesador Intel 286) enmascaran el recuento de rotación a 5 bits, dando como resultado un recuento máximo de 31. Este enmascaramiento se realiza en todos los modos operativos (incluyendo el modo virtual-8086) para reducir el tiempo máximo de ejecución de las instrucciones.

## Operación

```text
(* RCL and RCR Instructions *)
SIZE := OperandSize;
CASE (determine count) OF

    SIZE := 8: tempCOUNT := (COUNT AND 1FH) MOD 9;
    SIZE := 16: tempCOUNT := (COUNT AND 1FH) MOD 17;
    SIZE := 32: tempCOUNT := COUNT AND 1FH;
    SIZE := 64: tempCOUNT := COUNT AND 3FH;
ESAC;
IF OperandSize = 64
    THEN COUNTMASK = 3FH;
    ELSE COUNTMASK = 1FH;
FI;

(* RCL Instruction Operation *)
tempDEST := DEST;
WHILE (tempCOUNT  0)

    DO
          tempCF := MSB(tempDEST);
         tempDEST := (tempDEST  2) + CF;
          CF := tempCF;
          tempCOUNT := tempCOUNT  1;

    OD;
ELIHW;
IF (COUNT & COUNTMASK) = 1

    THEN OF := MSB(tempDEST) XOR CF;
    ELSE OF is undefined;
FI;
DEST := tempDEST;


(* RCR Instruction Operation *)
tempDEST := DEST;
IF (COUNT & COUNTMASK) = 1

    THEN OF := MSB(tempDEST) XOR CF;
    ELSE OF is undefined;
FI;
WHILE (tempCOUNT  0)
    DO

          tempCF := LSB(SRC);
          tempDEST := (tempDEST / 2) + (CF * 2SIZE);
          CF := tempCF;
          tempCOUNT := tempCOUNT  1;
    OD;
DEST := tempDEST;

(* ROL Instruction Operation *)
tempCOUNT := (COUNT & COUNTMASK) MOD SIZE
tempDEST := DEST;

WHILE (tempCOUNT  0)

    DO
          tempCF := MSB(tempDEST);
         tempDEST := (tempDEST  2) + tempCF;
          tempCOUNT := tempCOUNT  1;

    OD;
ELIHW;
IF (COUNT & COUNTMASK)  0

    THEN CF := LSB(tempDEST);
FI;
IF (COUNT & COUNTMASK) = 1

    THEN OF := MSB(tempDEST) XOR CF;
    ELSE OF is undefined;
FI;
DEST := tempDEST;

(* ROR Instruction Operation *)
tempCOUNT := (COUNT & COUNTMASK) MOD SIZE
tempDEST := DEST;

WHILE (tempCOUNT  0)

    DO
          tempCF := LSB(SRC);
         tempDEST := (tempDEST / 2) + (tempCF  2SIZE);
          tempCOUNT := tempCOUNT  1;

    OD;
ELIHW;
IF (COUNT & COUNTMASK)  0

    THEN CF := MSB(tempDEST);
FI;
IF (COUNT & COUNTMASK) = 1

    THEN OF := MSB(tempDEST) XOR MSB - 1(tempDEST);
    ELSE OF is undefined;
FI;
DEST := tempDEST;
```

## Banderas afectadas

Para las instrucciones RCL y RCR, un giro de cero bit no afecta nada, es decir, a ninguna bandera. Para instrucciones ROL y ROR, si el conteo enmascarado es 0, las banderas no se ven afectadas. Si el conteo enmascarado es 1, entonces la bandera OF se ve afectada, de lo contrario (conteo enmascarado es mayor que 1) la bandera OF no está definida.

Para todas las instrucciones, la bandera CF se ve afectada cuando el conteo enmascarado no es cero. Las banderas SF, ZF, AF y PF siempre no están afectadas.
