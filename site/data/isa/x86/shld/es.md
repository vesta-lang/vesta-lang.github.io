---
summary: Cambio de doble precisión izquierda
---

## Descripción

La instrucción SHLD se utiliza para turnos de multiprecisión de 64 bits o más.

La instrucción cambia el primer operando (operando de destino) a la izquierda el número de bits especificados por el tercer operando (cuenta operando). El segundo operando (operando de origen) proporciona bits para cambiar de la derecha (comenzando con el bit 0 del operando de destino).

El operando de destino puede ser un registro o una ubicación de memoria; el operando de origen es un registro. El conteo operando es un entero sin firma que se puede almacenar en un byte inmediato o en el registro CL. Si el conteo operando es CL, el recuento de cambios es el AND lógico de CL y una máscara de conteo. En modos no-64-bit y modo 64-bit predeterminado; sólo se utilizan bits 0 a 4 de la cuenta. Esto enmascara el recuento a un valor entre 0 y 31. Si un conteo es mayor que el tamaño de operando, el resultado es indefinido.

Si el recuento es 1 o mayor, la bandera CF se llena con el último bit desplazado fuera del operando de destino. Para un cambio de 1 bit, la bandera OF se establece si se produjo un cambio de signo; de lo contrario, se pone a cero. Si el conteo operando es 0, las banderas no se ven afectadas.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Usando un prefijo REX en forma de REX.W promueve la operación a 64 bits (ajustando la máscara de conteo a 6 bits). Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
IF (In 64-Bit Mode and REX.W = 1)
    THEN COUNT := COUNT MOD 64;
    ELSE COUNT := COUNT MOD 32;

FI
SIZE := OperandSize;
tempDEST := DEST;
IF COUNT > SIZE

    THEN (* Bad parameters *)
          tempDEST is undefined;


          CF, OF, SF, ZF, AF, PF are undefined;
    ELSE IF COUNT > 0 (* Perform the shift *)

          CF := BIT[tempDEST, SIZE  COUNT];
          (* Last bit shifted out on exit *)
          FOR i := SIZE  1 DOWN TO COUNT

                DO
                      Bit(tempDEST, i) := Bit(tempDEST, i  COUNT);

                OD;
          FOR i := COUNT  1 DOWN TO 0

                DO
                      BIT[tempDEST, i] := BIT[SRC, i  COUNT + SIZE];

                OD;
FI;
DEST := tempDEST;
```

## Banderas afectadas

Si el recuento es 1 o mayor, la bandera CF se llena con el último bit desplazado del operando de destino y las banderas SF, ZF y PF se establecen según el valor del resultado. Para un cambio de 1 bit, la bandera OF se establece si se produjo un cambio de signo; de lo contrario, se pone a cero. Para los turnos superiores a 1 bit, la bandera OF no está definida. Si se produce un cambio, la bandera AF no está definida. Si el conteo operando es 0, las banderas no se ven afectadas. Si el conteo es mayor que el tamaño de operando, las banderas quedan indefinidas.
