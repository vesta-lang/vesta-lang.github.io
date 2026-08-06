---
summary: Bit Scan Forward
---

## Descripción

Busca el operando de origen (segundo operando) para el bit menos significativo fijado (1 bit). Si se encuentra un bit menos significativo, su índice de bits se almacena en el operando de destino (primer operando). El operando de origen puede ser un registro o una ubicación de memoria; el operando de destino es un registro. El índice de bits es un offset sin firmar del bit 0 del operando de origen. Si el contenido del operando de origen es cero, el operando de destino no está modificado.1

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
IF SRC <> 0
    THEN
          temp := 0;
          WHILE Bit(SRC, temp) = 0
          DO
               temp := temp + 1;
          OD;
          DEST := temp;

FI;
```

## Banderas afectadas

La bandera ZF se establece a 1 si el operando de origen es 0; de lo contrario, la bandera ZF se pone a cero. La bandera PF se establece a 1 si el número de bits fijados en el operando de origen es incluso; de lo contrario, se pone a cero. Las banderas CF, OF, SF y AF están limpiadas.2
