---
summary: Scan String
---

## Descripción

En modos no-64-bit y en modo 64-bit predeterminado: esta instrucción compara un byte, palabra, palabra, palabra doble o cuadword especificado usando un operando de memoria con el valor en AL, AX, o EAX. Luego establece banderas de estado en EFLAGS registrando los resultados. La dirección el operando de memoria se lee en el registro ES:(E)DI (según el atributo tamaño de la dirección de la instrucción y el modo operativo actual). Tenga en cuenta que ES no puede ser superado con un prefijo de anulación de segmento.

En el nivel de código de montaje, se permiten dos formas de esta instrucción. La forma explícita-operando y la forma no-operandos. La forma explícita-operando (especificada usando el SCAS mnemonic) permite que un operando de memoria se especifique explícitamente. El operando de memoria debe ser un símbolo que indica el tamaño y la ubicación del valor el operando. El registro operando se selecciona automáticamente para igualar el tamaño del operando de memoria (Registro A para comparaciones de byte, AX para comparaciones de palabras, EAX para comparaciones de dobles palabras). El formulario explícito-operando se proporciona para permitir la documentación. Tenga en cuenta que la documentación proporcionada por este formulario puede ser engañosa. Es decir, el símbolo el operando de memoria debe especificar el tipo correcto (tamaño) del operando (byte, palabra o palabra doble) pero no tiene que especificar la ubicación correcta. La ubicación siempre es especificada por ES:(E)DI.

La forma no-operandos de la instrucción utiliza una forma corta de SCAS. De nuevo, ES:(E)DI se supone que es el operando de memoria y AL, AX, o EAX se supone que es el registro operando. El tamaño de operandos es seleccionado por la mnemónica: SCASB (con comparación de byte), SCASW (con comparación de palabras), o SCASD (con comparación de doble palabra).

Después de la comparación, el registro (E)DI se aumenta o decrece automáticamente según el ajuste de la bandera DF en el registro EFLAGS. Si la bandera DF es 0, el registro (E)DI se aumenta; si la bandera DF es 1, el registro (E)DI se decrementa. El registro es aumentado o decrementado por 1 para operaciones de byte, por 2 para operaciones de palabras, y por 4 para operaciones de doble palabra.

SCAS, SCASB, SCASW, SCASD, y SCASQ pueden ser precedidos por el prefijo REP para las comparaciones de bloques de bytes ECX, palabras, palabras dobles, o cuádwords. A menudo, sin embargo, estas instrucciones se utilizarán en un constructo LOOP que toma alguna acción basada en el ajuste de banderas de estado. Ver "REP/REPE/REPZ /REPNE/REPNZ--Repeat String Operation

Prefijo" en este capítulo para una descripción del prefijo REP.

En modo de 64 bits, el tamaño de la dirección predeterminada de la instrucción es de 64 bits, el tamaño de la dirección de 32 bits es compatible con el prefijo

67H. Utilizar un prefijo REX en forma de REX.W promueve la operación en doble palabra operando a 64 bits. La mnemónica de 64 bits es SCASQ. La dirección del operando de memoria se especifica en RDI o EDI, y AL/AX/EAX/RAX se puede utilizar como el registro operando. Después de una comparación, el registro de destino se aumenta

o decrementado por el tamaño de operando actual (dependiendo del valor de la bandera DF). Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
Non-64-bit Mode:
IF (Byte comparison)

    THEN
          temp := AL - SRC;
          SetStatusFlags(temp);
                THEN IF DF = 0
                      THEN (E)DI := (E)DI + 1;
                      ELSE (E)DI := (E)DI  1; FI;

    ELSE IF (Word comparison)
          THEN
               temp := AX - SRC;
                SetStatusFlags(temp);
                IF DF = 0
                      THEN (E)DI := (E)DI + 2;
                      ELSE (E)DI := (E)DI  2; FI;
          FI;

    ELSE IF (Doubleword comparison)
          THEN
                temp := EAX  SRC;
                SetStatusFlags(temp);
                IF DF = 0
                      THEN (E)DI := (E)DI + 4;
                      ELSE (E)DI := (E)DI  4; FI;
          FI;

FI;

64-bit Mode:
IF (Byte comparison)

    THEN
          temp := AL - SRC;
          SetStatusFlags(temp);
                THEN IF DF = 0
                      THEN (R|E)DI := (R|E)DI + 1;
                      ELSE (R|E)DI := (R|E)DI  1; FI;

    ELSE IF (Word comparison)
          THEN
               temp := AX - SRC;
                SetStatusFlags(temp);
                IF DF = 0
                      THEN (R|E)DI := (R|E)DI + 2;
                      ELSE (R|E)DI := (R|E)DI  2; FI;
          FI;


    ELSE IF (Doubleword comparison)
          THEN
                temp := EAX  SRC;
                SetStatusFlags(temp);
                IF DF = 0
                      THEN (R|E)DI := (R|E)DI + 4;
                      ELSE (R|E)DI := (R|E)DI  4; FI;
          FI;

    ELSE IF (Quadword comparison using REX.W )
          THEN

             temp := RAX - SRC;

                SetStatusFlags(temp);
                IF DF = 0

                      THEN (R|E)DI := (R|E)DI + 8;
                      ELSE (R|E)DI := (R|E)DI  8;
                FI;
    FI;
FI;
```

## Banderas afectadas

Las banderas OF, SF, ZF, AF, PF y CF se establecen según el resultado temporal de la comparación.
