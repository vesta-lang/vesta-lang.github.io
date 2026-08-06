---
summary: Comparar String operandos
---

## Descripción

Compara el byte, palabra, palabra doble, o cuádword especificado con el primer operando de origen con el byte, palabra, palabra doble palabra, o cuádword especificado con el segundo operando de origen y establece las banderas de estado en el registro EFLAGS según los resultados.

Ambos operandos de origen están ubicados en memoria. La dirección del primer operando de origen se lee en DS:SI, DS:ESI o RSI (dependiendo del atributo tamaño de la instrucción es 16, 32, o 64, respectivamente). La dirección del segundo operando de origen se lee en ES:DI, ES:EDI o RDI (en función del atributo tamaño de la instrucción es 16, 32, o 64). El segmento DS puede estar anulado con un prefijo de anulación de segmento, pero el segmento ES no puede ser superado.

En el nivel de código de montaje se permiten dos formas de esta instrucción: la forma "explicit-operandos" y la forma "nooperands". La forma explícita-operandos (especificada con el CMPS mnemonic) permite que los dos operandos de origen se especifiquen explícitamente. Aquí, los operandos de origen debe ser símbolos que indican el tamaño y la ubicación de los valores fuente. Este formulario explícito-operando se proporciona para permitir la documentación. Sin embargo, tenga en cuenta que la documentación proporcionada por este formulario puede ser engañosa. Es decir, los símbolos el operando de origen deben especificar el tipo correcto (tamaño) de los operandos (bytes, palabras, o palabras dobles, cuádwords), pero no tienen que especificar la ubicación correcta-

tion. Las ubicaciones de los operandos de origen siempre son especificadas por los registros DS:(E)SI (o RSI) y ES:(E)DI (o RDI) que deben cargarse correctamente antes de que se ejecute la instrucción de la cadena de comparación.

La forma no-operandos proporciona "formas cortas" de las versiones de byte, palabra y doble palabra de las instrucciones CMPS. Aquí también los registros DS:(E)SI (o RSI) y ES:(E)DI (o RDI) son asumidos por el procesador para especificar la ubicación de los operandos de origen. El tamaño de los operandos de origen es seleccionado con la mnemónica: CMPSB (comparación de bytes), CMPSW (contraseña de palabras), CMPSD (contraseña de doble palabra), o CMPSQ (contraseña de palabras con REX.W).

Después de la comparación, el (E/R)SI y (E/R)DI registra aumento o decremento automáticamente según el ajuste de la bandera DF en el registro EFLAGS. (Si la bandera DF es 0, el (E/R)SI y (E/R)DI aumento de registro; si la bandera DF es 1, el decremento de registros.) Los registros aumentan o decrecen por 1 para operaciones de byte, por 2 para operaciones de palabra, 4 para operaciones de doble palabra. Si tamaño de operando es 64, RSI y RDI registra aumento por 8 para operaciones de cuádpago.

Las instrucciones CMPS, CMPSB, CMPSW, CMPSD y CMPSQ pueden ser precedidas por el prefijo REP para las comparaciones de bloques. Más a menudo, sin embargo, estas instrucciones se utilizarán en un constructo LOOP que toma alguna acción basada en el ajuste de las banderas de estado antes de hacer la próxima comparación. Ver "REP/REPE/REPZ /REPNE/REPNZ--Repeat String Operation Prefix" en el Capítulo 4 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2B, para una descripción del prefijo REP.

En modo de 64 bits, el tamaño de la dirección predeterminada de la instrucción es de 64 bits, el tamaño de la dirección de 32 bits es compatible con el prefijo 67H. El uso del prefijo REX.W promueve la operación de doble palabra a 64 bits (ver CMPSQ). Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
temp := SRC1 - SRC2;
SetStatusFlags(temp);

IF (64-Bit Mode)
    THEN
          IF (Byte comparison)

        THEN IF DF = 0

                THEN
                      (R|E)SI := (R|E)SI + 1;
                      (R|E)DI := (R|E)DI + 1;

                ELSE
                      (R|E)SI := (R|E)SI  1;
                      (R|E)DI := (R|E)DI  1;

                FI;
          ELSE IF (Word comparison)

             THEN IF DF = 0

                      THEN
                            (R|E)SI := (R|E)SI + 2;
                            (R|E)DI := (R|E)DI + 2;

                      ELSE
                            (R|E)SI := (R|E)SI  2;
                            (R|E)DI := (R|E)DI  2;

                      FI;
          ELSE IF (Doubleword comparison)

             THEN IF DF = 0

                      THEN
                            (R|E)SI := (R|E)SI + 4;
                            (R|E)DI := (R|E)DI + 4;

                      ELSE
                            (R|E)SI := (R|E)SI  4;
                            (R|E)DI := (R|E)DI  4;

                      FI;


          ELSE (* Quadword comparison *)

             THEN IF DF = 0

                      (R|E)SI := (R|E)SI + 8;
                      (R|E)DI := (R|E)DI + 8;
                ELSE
                      (R|E)SI := (R|E)SI  8;
                      (R|E)DI := (R|E)DI  8;
                FI;
          FI;
    ELSE (* Non-64-bit Mode *)
          IF (byte comparison)

        THEN IF DF = 0

                THEN
                      (E)SI := (E)SI + 1;
                      (E)DI := (E)DI + 1;

                ELSE
                      (E)SI := (E)SI  1;
                      (E)DI := (E)DI  1;

                FI;
          ELSE IF (Word comparison)

             THEN IF DF = 0

                      (E)SI := (E)SI + 2;
                      (E)DI := (E)DI + 2;
                ELSE
                      (E)SI := (E)SI  2;
                      (E)DI := (E)DI  2;
                FI;
          ELSE (* Doubleword comparison *)

             THEN IF DF = 0

                      (E)SI := (E)SI + 4;
                      (E)DI := (E)DI + 4;
                ELSE
                      (E)SI := (E)SI  4;
                      (E)DI := (E)DI  4;
                FI;
          FI;
FI;
```

## Banderas afectadas

Las banderas CF, OF, SF, ZF, AF y PF se establecen según el resultado temporal de la comparación.
