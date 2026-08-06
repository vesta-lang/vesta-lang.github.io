---
summary: Verifique el índice de rayos contra libras
---

## Descripción

BOUND determina si el primer operando (índice de rayos) está dentro de los límites de un array especificado el segundo operando (puntos operando). El índice de matriz es un entero firmado situado en un registro. Los límites operando es una ubicación de memoria que contiene un par de números firmados (cuando el operando-size atributo es 32) o un par de números firmados (cuando el operando-size es 16). La primera palabra doble (o palabra) es la parte inferior de la matriz y la segunda palabra doble (o palabra) es la parte superior de la matriz. El índice de matriz debe ser mayor o igual al límite inferior y inferior o igual al límite superior más el tamaño de operando en bytes. Si el índice no está dentro de los límites, un rango BOUND superó la excepción (#BR) se señaliza. Cuando se genera esta excepción, el retorno salvado puntero de instruccion apunta a la instrucción BOUND.

Los límites limitan la estructura de datos (dos palabras o palabras dobles que contienen los límites inferiores y superiores de la matriz) se colocan generalmente justo antes de la matriz misma, haciendo que los límites se dirijan a través de un offset constante desde el principio de la matriz. Debido a que la dirección de la matriz ya estará presente en un registro, esta práctica evita ciclos de autobús adicionales para obtener la dirección efectiva de los límites de la matriz.

Esta instrucción se ejecuta como se describe en modo de compatibilidad y modo legado. No es válido en modo de 64 bits.

## Operación

```text
IF 64bit Mode
    THEN
          #UD;
    ELSE
          IF (ArrayIndex < LowerBound OR ArrayIndex > UpperBound) THEN
          (* Below lower bound or above upper bound *)
                IF <equation for PL enabled> THEN BNDSTATUS := 0
                #BR;
          FI;

FI;
```

## Banderas afectadas

None.
