---
summary: Store String
---

## Descripción

En modo 64-bit y por defecto 64-bit; almacena un byte, palabra o palabra doble del registro AL, AX o EAX (respectivamente) en el operando de destino. El operando de destino es una ubicación de memoria, cuya dirección se lee en el registro ES:EDI o ES:DI (dependiendo del atributo de tamaño de dirección de la instrucción y el modo de operación). El segmento ES no puede ser superado con un prefijo de anulación de segmento.

En el nivel de código de montaje se permiten dos formas de instrucción: la forma "explicit-operandos" y la forma "nooperands". La forma explícita-operandos (especificada con el STOS mnemonic) permite que el operando de destino se especifique explícitamente. Aquí, el operando de destino debe ser un símbolo que indica el tamaño y la ubicación del valor de destino. El operando de origen se selecciona automáticamente para igualar el tamaño del operando de destino (el registro AL para byte operandos, AX para la palabra operandos, EAX para la palabra doble operandos). La forma explícita-operandos se proporciona para permitir la documentación; sin embargo, tenga en cuenta que la documentación proporcionada por este formulario puede ser engañosa. Es decir, el símbolo el operando de destino debe especificar el tipo correcto (tamaño) del operando (byte, palabra o palabra doble), pero no tiene que especificar la ubicación correcta. La ubicación siempre se especifica en el registro ES:(E)DI. Estos deben ser cargados correctamente antes de que se ejecute la instrucción de la cadena de la tienda.

La forma no-operandos proporciona "formas cortas" de las versiones de byte, palabra, palabra doble y cuádpalabra de las instrucciones STOS. Aquí también ES:(E)DI se supone que es el operando de destino y AL, AX, o EAX se supone que es el operando de origen. El tamaño del destino y operandos de origen es seleccionado por la mnemónica: STOSB (porte read from register AL), STOSW (word from AX), STOSD (dobleword from EAX).

Después de que el byte, palabra o palabra doble se transfiere del registro a la ubicación de memoria, el registro (E)DI se incrementa o decrementa según el ajuste de la bandera DF en el registro EFLAGS. Si la bandera DF es 0, el registro se aumenta; si la bandera DF es 1, el registro es decrementado (el registro es incrementado o decrementado por 1 para operaciones byte, por 2 para operaciones de palabras, por 4 para operaciones de doble palabra).

NOTE

Para mejorar el rendimiento, los procesadores más recientes soportan modificaciones a la operación del procesador durante las operaciones de la cadena iniciadas con STOS y STOSB. Ver la sección 7.3.9.3 en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para información adicional sobre el funcionamiento de la cadena rápida.

En modo de 64 bits, el tamaño de la dirección predeterminada es de 64 bits, el tamaño de la dirección de 32 bits es compatible con el prefijo 67H. Utilizar un prefijo REX en forma de REX.W promueve la operación en doble palabra operando a 64 bits. El no-operando mnemonic promovido es STOSQ. STOSQ (y su variante operandos explícita) almacenan un cuádpalo del registro RAX en el

destino dirigido por RDI o EDI. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

Las instrucciones STOS, STOSB, STOSW, STOSD, STOSQ pueden ser precedidas por el prefijo REP para las tiendas de bloques de bytes ECX, palabras, o palabras dobles. Más a menudo, sin embargo, estas instrucciones se utilizan dentro de un constructo LOOP porque los datos deben ser trasladados al registro AL, AX o EAX antes de que pueda ser almacenado. Véase "REP/REPE/REPZ

/REPNE/REPNZ--Repeat String Operation Prefix" en este capítulo para una descripción del prefijo REP.

## Operación

```text
Non-64-bit Mode:
IF (Byte store)

    THEN
          DEST := AL;
                THEN IF DF = 0
                      THEN (E)DI := (E)DI + 1;
                      ELSE (E)DI := (E)DI  1;
                FI;

    ELSE IF (Word store)
          THEN
                DEST := AX;
                      THEN IF DF = 0
                            THEN (E)DI := (E)DI + 2;
                            ELSE (E)DI := (E)DI  2;
                      FI;
          FI;

    ELSE IF (Doubleword store)
          THEN
                DEST := EAX;
                      THEN IF DF = 0
                            THEN (E)DI := (E)DI + 4;
                            ELSE (E)DI := (E)DI  4;
                      FI;
          FI;

FI;

64-bit Mode:
IF (Byte store)

    THEN
          DEST := AL;
                THEN IF DF = 0
                      THEN (R|E)DI := (R|E)DI + 1;
                      ELSE (R|E)DI := (R|E)DI  1;
                FI;

    ELSE IF (Word store)
          THEN
                DEST := AX;
                      THEN IF DF = 0
                            THEN (R|E)DI := (R|E)DI + 2;
                            ELSE (R|E)DI := (R|E)DI  2;
                      FI;
          FI;

    ELSE IF (Doubleword store)


          THEN
                DEST := EAX;
                      THEN IF DF = 0
                            THEN (R|E)DI := (R|E)DI + 4;
                            ELSE (R|E)DI := (R|E)DI  4;
                      FI;

          FI;
    ELSE IF (Quadword store using REX.W )

          THEN
                DEST := RAX;
                      THEN IF DF = 0
                            THEN (R|E)DI := (R|E)DI + 8;
                            ELSE (R|E)DI := (R|E)DI  8;
                      FI;

          FI;
FI;
```

## Banderas afectadas

None.
