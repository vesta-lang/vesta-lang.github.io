---
summary: Comparación e intercambio
---

## Descripción

Compara el valor en el registro AL, AX, EAX, o RAX con el primer operando (operando de destino). Si los dos valores son iguales, el segundo operando (operando de origen) se carga en el operando de destino. De lo contrario, el operando de destino se carga en el registro AL, AX, EAX o RAX. El registro RAX está disponible sólo en modo de 64 bits.

Esta instrucción se puede utilizar con un prefijo LOCK para permitir que la instrucción se ejecute atómicamente. Para simplificar la interfaz al bus del procesador, el operando de destino recibe un ciclo de escritura sin tener en cuenta el resultado de la comparación. El operando de destino se escribe de nuevo si la comparación falla; de lo contrario, el operando de origen se escribe en el destino. (El procesador nunca produce una lectura cerrada sin producir también una escritura cerrada.)

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Compatibilidad de arquitectura IA-32

Esta instrucción no es compatible con procesadores Intel antes que los procesadores Intel486.

## Operación

```text
(* Accumulator = AL, AX, EAX, or RAX depending on whether a byte, word, doubleword, or quadword comparison is being performed *)

TEMP := DEST

IF accumulator = TEMP

    THEN
          ZF := 1;
          DEST := SRC;

    ELSE
          ZF := 0;
          accumulator := TEMP;
          DEST := TEMP;

FI;
```

## Banderas afectadas

La bandera ZF se establece si los valores en el operando de destino y registro AL, AX, o EAX son iguales; de lo contrario se pone a cero. Las banderas CF, PF, AF, SF y OF se establecen según los resultados de la operación de comparación.
