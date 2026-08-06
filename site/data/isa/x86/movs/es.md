---
summary: Mover datos de la cuerda a la cuerda
---

## Descripción

Mueva el byte, palabra o palabra doble especificado con el segundo operando (operando de origen) a la ubicación especificada con el primer operando (operando de destino). Tanto la fuente como operandos de destino se encuentran en memoria. La dirección del operando de origen se lee en los registros DS:ESI o DS:SI (dependiendo del atributo tamaño de la instrucción, 32 o 16, respectivamente). La dirección del operando de destino se lee en los registros ES:EDI o ES:DI (en función del atributo tamaño de la instrucción). El segmento DS puede estar anulado con un prefijo de anulación de segmento, pero el segmento ES no puede ser superado.

En el nivel de código de montaje se permiten dos formas de esta instrucción: la forma "explicit-operandos" y la forma "nooperands". La forma explícita-operandos (especificada con el MOVS mnemonic) permite que la fuente y operandos de destino se especifiquen explícitamente. Aquí, la fuente y operandos de destino deben ser símbolos que indican el tamaño y la ubicación del valor fuente y el destino, respectivamente. Esta forma explícita-operandos se proporciona para permitir la documentación; sin embargo, tenga en cuenta que la documentación proporcionada por este formulario puede ser engañosa. Es decir, la fuente y los símbolos operando de destino deben especificar el tipo correcto (tamaño) de los operandos (bytes, palabras o palabras dobles), pero no tienen que especificar la ubicación correcta. Las ubicaciones de la fuente y operandos de destino son siempre especificadas por los registros DS:(E)SI y ES:(E)DI, que deben ser cargados correctamente antes de que se ejecute la instrucción de la cadena de movimiento.

La forma no-operandos proporciona "formas cortas" de las versiones de byte, palabra y doble palabra de las instrucciones MOVS. Aquí también DS:(E)SI y ES:(E)DI se supone que son la fuente y operandos de destino, respectivamente. El tamaño de la fuente y operandos de destino es seleccionado con la mnemónica: MOVSB (movimiento del byte), MOVSW (movimiento de la palabra), o MOVSD (movimiento de doble palabra).

Después de la operación de movimiento, los registros (E)SI y (E)DI se incrementan o decrecen automáticamente según el ajuste de la bandera DF en el registro EFLAGS. (Si la bandera DF es 0, el registro (E)SI y (E)DI son incre-

; si la bandera DF es 1, los registros (E)SI y (E)DI son decrementados.) Los registros son incrementados o decrementados por 1 para operaciones de byte, por 2 para operaciones de palabra, o por 4 para operaciones de doble palabra.

NOTE

Para mejorar el rendimiento, los procesadores más recientes soportan modificaciones a la operación del procesador durante las operaciones de la cadena iniciadas con MOVS y MOVSB. Ver la sección 7.3.9.3 en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para información adicional sobre el funcionamiento de la cadena rápida.

ElMOVS, MOVSB, MOVSW, yMOVSDlas instrucciones pueden ser precedidas porREPprefijo (ver "REP/REPE/REPZ /REPNE/REPNZ--Repeat String Operation Prefix" para una descripción de laREPprefijo) para movimientos de bloques deECXbytes, palabras o palabras dobles.

En modo de 64 bits, el tamaño de la dirección predeterminada de la instrucción es de 64 bits, el tamaño de la dirección de 32 bits es compatible con el prefijo 67H. Las direcciones de 64 bits son especificadas por RSI y RDI; dirección de 32 bits son especificadas por ESI y EDI. El uso del prefijo REX.W promueve la operación de doble palabra a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
DEST := SRC;
Non-64-bit Mode:
IF (Byte move)

   THEN IF DF = 0

          THEN
                (E)SI := (E)SI + 1;
                (E)DI := (E)DI + 1;

          ELSE
                (E)SI := (E)SI  1;
                (E)DI := (E)DI  1;

          FI;
    ELSE IF (Word move)

        THEN IF DF = 0

                (E)SI := (E)SI + 2;
                (E)DI := (E)DI + 2;
                FI;
          ELSE
                (E)SI := (E)SI  2;
                (E)DI := (E)DI  2;
          FI;
    ELSE IF (Doubleword move)

        THEN IF DF = 0

                (E)SI := (E)SI + 4;
                (E)DI := (E)DI + 4;
                FI;
          ELSE
                (E)SI := (E)SI  4;
                (E)DI := (E)DI  4;
          FI;
FI;
64-bit Mode:
IF (Byte move)

   THEN IF DF = 0

          THEN
                (R|E)SI := (R|E)SI + 1;
                (R|E)DI := (R|E)DI + 1;


          ELSE
                (R|E)SI := (R|E)SI  1;
                (R|E)DI := (R|E)DI  1;

          FI;
    ELSE IF (Word move)

        THEN IF DF = 0

                (R|E)SI := (R|E)SI + 2;
                (R|E)DI := (R|E)DI + 2;
                FI;
          ELSE
                (R|E)SI := (R|E)SI  2;
                (R|E)DI := (R|E)DI  2;
          FI;
    ELSE IF (Doubleword move)

        THEN IF DF = 0

                (R|E)SI := (R|E)SI + 4;
                (R|E)DI := (R|E)DI + 4;
                FI;
          ELSE
                (R|E)SI := (R|E)SI  4;
                (R|E)DI := (R|E)DI  4;
          FI;
    ELSE IF (Quadword move)

        THEN IF DF = 0

                (R|E)SI := (R|E)SI + 8;
                (R|E)DI := (R|E)DI + 8;
                FI;
          ELSE
                (R|E)SI := (R|E)SI  8;
                (R|E)DI := (R|E)DI  8;
          FI;
FI;
```

## Banderas afectadas

None.
