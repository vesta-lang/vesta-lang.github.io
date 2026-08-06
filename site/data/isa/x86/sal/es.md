---
summary: Cambio
---

## Descripción

Cambia los bits en el primer operando (operando de destino) a la izquierda o derecha por el número de bits especificados en el segundo operando (cuenta operando). Bits shifted beyondel operando de destinoLos límites se desplazan por primera vez a la bandera CF, y luego se descartan. Al final de la operación de cambio, la bandera CF contiene el último bit desplazado fuera del operando de destino.

El operando de destino puede ser un registro o una ubicación de memoria. El conteo operando puede ser un valor inmediato o el registro CL. El conteo está enmascarado a 5 bits (o 6 bits con un operando de 64 bits). El rango de conteo se limita a 0 a 31 (o 63 con un operando de 64 bits). Se proporciona una codificación código de operación especial para un recuento de 1.

La izquierda aritmética de desplazamiento (SAL) y las instrucciones lógicas de desplazamiento izquierda (SHL) realizan la misma operación; cambian los bits en el operando de destino a la izquierda (hacia lugares bit más significativos). Para cada cuenta de cambio, el bit mas significativo del operando de destino se desplaza a la bandera CF, y el bit menos significativo se pone a cero (ver Figura 7-7 en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1).

La derecha aritmética de cambio (SAR) y las instrucciones lógicas de la derecha (SHR) desplazan los bits del operando de destino a la derecha (hacia lugares de bit menos significativos). Para cada cuenta de cambio, el bit menos significativo del operando de destino se desplaza a la bandera CF, y el bit mas significativo se establece o se aclara dependiendo del tipo de instrucción. La instrucción SHR aclara el bit mas significativo (ver Figura 7-8 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1); la instrucción SAR establece o aclara el bit mas significativo para corresponder al signo (mas significativo bit) del valor original en el operando de destino. En efecto, la instrucción SAR llena el valor cambiado de posición de bits vacíos con el signo del valor no modificado (véase la Figura 7-9 en el Manual de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 1).

Las instrucciones SAR y SHR pueden utilizarse para realizar una división firmada o no firmada, respectivamente, del operando de destino por poderes de 2. Por ejemplo, el uso de la instrucción SAR para cambiar un entero firmado 1 bit a la derecha divide el valor en 2.

Utilizar la instrucción SAR para realizar una operación de división no produce el mismo resultado que la instrucción IDIV. El cociente de la instrucción IDIV se redondea hacia cero, mientras que el "cociente" de la instrucción SAR se redondea hacia el infinito negativo. Esta diferencia es evidente sólo para números negativos. Por ejemplo, cuando la instrucción IDIV se utiliza para dividir -9 por 4, el resultado es -2 con un resto de -1. Si la instrucción SAR se utiliza para

cambio -9 derecho por dos bits, el resultado es -3 y el "remanente" es +3; sin embargo, la instrucción SAR almacena sólo el bit mas significativo del resto (en la bandera CF).

La bandera OF se ve afectada sólo en turnos de 1 bit. Para los turnos izquierdos, la bandera OF se establece a 0 si la parte más significativa del resultado es la misma que la bandera CF (es decir, los dos primeros pedazos del operando original eran los mismos); de lo contrario, se establece a 1. Para la instrucción SAR, el OF flag se pone a cero para todos los turnos de 1 bit. Para la instrucción SHR, la bandera OF se fija en la parte más significativa del operando original.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits y el ancho de máscara para CL es de 5 bits. El uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Usando un prefijo REX en forma de REX.W promueve la operación a 64 bits y establece el ancho de máscara para CL a 6 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Compatibilidad de arquitectura IA-32

El 8086 no enmascara el recuento de turno. Sin embargo, todos los demás procesadores IA-32 (comenzando con el procesador Intel 286) enmascaran el recuento de turno a 5 bits, dando como resultado un recuento máximo de 31. Este enmascaramiento se realiza en todos los modos operativos (incluyendo el modo virtual-8086) para reducir el tiempo máximo de ejecución de las instrucciones.

## Operación

```text
IF OperandSize = 64
    THEN
          countMASK := 3FH;
    ELSE
          countMASK := 1FH;

FI

tempCOUNT := (COUNT AND countMASK);

origDEST := DEST;
tempDEST := DEST;

WHILE (tempCOUNT  0)

DO
    IF instruction is SAL or SHL
          THEN
                CF := MSB(tempDEST);
          ELSE (* Instruction is SAR or SHR *)
                CF := LSB(tempDEST);
    FI;
    IF instruction is SAL or SHL
          THEN
               tempDEST := tempDEST  2;
          ELSE
                IF instruction is SAR
                      THEN
                            tempDEST := tempDEST / 2; (* Signed divide, rounding toward negative infinity *)
                      ELSE (* Instruction is SHR *)
                            tempDEST := tempDEST / 2 ; (* Unsigned divide *)
                FI;
    FI;
    tempCOUNT := tempCOUNT  1;

OD;

(* Determine overflow for the various instructions *)
IF (COUNT and countMASK) = 1

    THEN
          IF instruction is SAL or SHL


                THEN
                      OF := MSB(tempDEST) XOR CF;

                ELSE
                      IF instruction is SAR
                            THEN
                                  OF := 0;
                            ELSE (* Instruction is SHR *)
                                  OF := MSB(origDEST);
                      FI;

          FI;
    ELSE IF (COUNT AND countMASK) = 0

          THEN
                All flags unchanged;

          ELSE (* COUNT not 1 or 0 *)
                OF := undefined;

    FI;
FI;
DEST := tempDEST;
```

## Banderas afectadas

La bandera CF contiene el valor del último bit desplazado fuera del operando de destino; es indefinido para las instrucciones SHL y SHR donde el conteo es mayor o igual al tamaño (en bits) del operando de destino. La bandera OF se ve afectada sólo por turnos de 1 bit (ver "Descripción" arriba); de lo contrario, no está definida. Las banderas SF, ZF y PF se establecen según el resultado. Si la cuenta es 0, las banderas no se ven afectadas. Para un conteo no cero, la bandera AF no está definida.
