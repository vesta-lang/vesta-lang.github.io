---
summary: Montaje de carga
---

## Descripción

Carga un byte, palabra o palabra doble del operando de origen en el registro AL, AX, o EAX, respectivamente. El operando de origen es una ubicación de memoria, cuya dirección se lee en los registros DS:ESI o DS:SI (dependiendo del atributo tamaño de la instrucción, 32 o 16, respectivamente). El segmento DS puede ser anulado con un prefijo de anulación de segmento.

En el nivel de código de montaje se permiten dos formas de esta instrucción: la forma "explicit-operandos" y la forma "nooperands". La forma explícita-operandos (especificada con el LODS mnemonic) permite que el operando de origen se especifique explícitamente. Aquí, el operando de origen debe ser un símbolo que indica el tamaño y la ubicación del valor fuente. El operando de destino se selecciona automáticamente para igualar el tamaño del operando de origen (el registro AL para byte operandos, AX para la palabra operandos, y EAX para la palabra doble operandos). Esta forma explícita-operandos se proporciona para permitir la documentación; sin embargo, tenga en cuenta que la documentación proporcionada por este formulario puede ser engañosa. Es decir, el símbolo el operando de origen debe especificar el tipo correcto (tamaño) del operando (byte, palabra o palabra doble), pero no tiene que especificar la ubicación correcta. La ubicación siempre es especificada por los registros DS:(E)SI, que deben ser cargados correctamente antes de ejecutar la instrucción de cadena de carga.

La forma no-operandos proporciona "formas cortas" de las versiones de byte, palabra y doble palabra de las instrucciones LODS. Aquí también DS:(E)SI se supone que es el operando de origen y el registro AL, AX, o EAX se supone que es el operando de destino. El tamaño de la fuente y operandos de destino es seleccionado con la mnemónica: LODSB (byte loaded into register AL), LODSW (word loaded into AX), o LODSD (dobleword loaded into EAX).

Después de que el byte, palabra o palabra doble se transfiere de la ubicación de memoria en el registro AL, AX o EAX, el registro (E)SI se aumenta o decrementa automáticamente según el ajuste de la bandera DF en el registro EFLAGS. (Si la bandera DF es 0, el registro (E)SI se aumenta; si la bandera DF es 1, el registro ESI se decrementa.) El registro (E)SI es incrementado o decrementado por 1 para operaciones de byte, por 2 para operaciones de palabra, o por 4 para operaciones de doble palabra.

En modo de 64 bits, el uso del prefijo REX.W promueve el funcionamiento a 64 bits. LODS/LODSQ carga el cuádpago en la dirección (R)SI en RAX. El registro (R)SI se aumenta o decrece automáticamente según el ajuste de la bandera DF en el registro EFLAGS.

Las instrucciones LODS, LODSB, LODSW y LODSD pueden ser precedidas por el prefijo REP para cargas de bloques de bytes ECX, palabras, o palabras dobles. Más a menudo, sin embargo, estas instrucciones se utilizan dentro de un constructo LOOP porque el procesamiento posterior de los datos trasladados al registro es generalmente necesario antes de que se pueda realizar la próxima transferencia. Ver "REP/REPE/REPZ /REPNE/REPNZ--Repeat String Operation Prefix" en el Capítulo 4 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2B, para una descripción del prefijo REP.

## Operación

```text
IF AL := SRC; (* Byte load *)
    THEN AL := SRC; (* Byte load *)

        IF DF = 0

                THEN (E)SI := (E)SI + 1;
                ELSE (E)SI := (E)SI  1;
          FI;
ELSE IF AX := SRC; (* Word load *)

   THEN IF DF = 0

                THEN (E)SI := (E)SI + 2;
                ELSE (E)SI := (E)SI  2;
          IF;
    FI;
ELSE IF EAX := SRC; (* Doubleword load *)

   THEN IF DF = 0

                THEN (E)SI := (E)SI + 4;
                ELSE (E)SI := (E)SI  4;
          FI;
    FI;
ELSE IF RAX := SRC; (* Quadword load *)

   THEN IF DF = 0

                THEN (R)SI := (R)SI + 8;
                ELSE (R)SI := (R)SI  8;
          FI;
    FI;
FI;
```

## Banderas afectadas

None.
