---
summary: Entrada desde Port a String
---

## Descripción

Copia los datos del puerto I/O especificados con el operando de origen (segundo operando) al operando de destino (primer operando). El operando de origen es una dirección portuaria I/O (de 0 a 65,535) que se lee en el registro DX. El operando de destino es una ubicación de memoria, cuya dirección se lee en los registros ES:DI, ES:EDI o RDI (dependiendo del atributo de tamaño de la instrucción, 16, 32 o 64, respectivamente). (El segmento ES no puede ser superado con un prefijo de anulación de segmento.) El tamaño del puerto I/O que se accede (es decir, el tamaño de la fuente y operandos de destino) es determinado por el código de operación para un puerto I/O de 8 bits o por el atributo el operando-size de la instrucción para un puerto I/O de 16 o 32 bits.

En el nivel de código de montaje se permiten dos formas de esta instrucción: la forma "explicit-operandos" y la forma "nooperands". La forma explícita-operandos (especificada con el INS mnemonic) permite que la fuente y operandos de destino se especifiquen explícitamente. Aquí, el operando de origen debe ser "DX", y el operando de destino debe ser un símbolo que indica el tamaño del puerto I/O y la dirección de destino. Esta forma explícita-operandos se proporciona para permitir la documentación; sin embargo, tenga en cuenta que la documentación proporcionada por este formulario puede ser engañosa. Es decir, el símbolo el operando de destino debe especificar el tipo correcto (tamaño) del operando (byte, palabra o palabra doble), pero no tiene que especificar la ubicación correcta. La ubicación siempre es especificada por los registros ES:(E)DI, que deben ser cargados correctamente antes de ejecutar la instrucción INS.

La forma no-operandos proporciona "formas cortas" de las versiones de byte, palabra y doble palabra de las instrucciones INS. Aquí también DX es asumido por el procesador para ser el operando de origen y ES:(E)DI se supone que es el operando de destino. El tamaño del puerto I/O se especifica con la opción de mnemonic: INSB (byte), INSW (palabra), o INSD (palabra doble).

Después de que el byte, palabra o palabra doble se transfiere del puerto I/O a la ubicación de memoria, el registro DI/EDI/RDI se aumenta o decrece automáticamente según el ajuste de la bandera DF en el registro EFLAGS. (Si la bandera DF es 0, el registro (E)DI se aumenta; si la bandera DF es 1, el registro (E)DI se decrementa.) El registro (E)DI es aumentado o decrementado por 1 para operaciones byte, por 2 para operaciones de palabras, o por 4 para operaciones de doble palabra.

Las instrucciones INS, INSB, INSW y INSD pueden ser precedidas por el prefijo REP para la entrada de bloque de bytes ECX, palabras, o palabras dobles. Ver "REP/REPE/REPZ /REPNE/REPNZ--Repeat String Operation Prefix" en el Capítulo 4 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2B, para una descripción del prefijo REP.

Estas instrucciones sólo son útiles para acceder a los puertos I/O ubicados en el espacio de dirección I/O del procesador. Ver el capítulo 20, "Input/Output", en el Manual de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 1, para obtener más información sobre el acceso a puertos I/O en el espacio de direcciones I/O.

En modo de 64 bits, el tamaño por defecto de la dirección es de 64 bits, el tamaño de la dirección de 32 bits se soporta utilizando el prefijo 67H. La dirección del destino de memoria es especificada por RDI o EDI. El tamaño de la dirección de 16 bits no es compatible con el modo 64-bit. El tamaño de operando no es promovido.

Estas instrucciones pueden leer desde el puerto I/O sin escribir a la ubicación de memoria si se produce una excepción o salida VM debido a la escritura (por ejemplo. #PF). Si esto sería problemático, por ejemplo, porque el puerto de I/O leído tiene efectos secundarios, el software debe asegurar la escritura a la ubicación de memoria no causa una excepción o salida VM.

## Operación

```text
IF ((PE = 1) and ((CPL > IOPL) or (VM = 1)))

    THEN (* Protected mode with CPL > IOPL or virtual-8086 mode *)

        IF (Any I/O Permission Bit for I/O port being accessed = 1)

                THEN (* I/O operation is not allowed *)
                      #GP(0);

                ELSE (* I/O operation is allowed *)
                      DEST := SRC; (* Read from I/O port *)

          FI;
    ELSE (Real Mode or Protected Mode with CPL IOPL *)

          DEST := SRC; (* Read from I/O port *)
FI;

Non-64-bit Mode:

IF (Byte transfer)

   THEN IF DF = 0

          THEN (E)DI := (E)DI + 1;
          ELSE (E)DI := (E)DI  1; FI;
    ELSE IF (Word transfer)

        THEN IF DF = 0

                THEN (E)DI := (E)DI + 2;
                ELSE (E)DI := (E)DI  2; FI;
          ELSE (* Doubleword transfer *)

             THEN IF DF = 0

                      THEN (E)DI := (E)DI + 4;
                      ELSE (E)DI := (E)DI  4; FI;
          FI;
FI;

FI64-bit Mode:

IF (Byte transfer)

   THEN IF DF = 0

          THEN (E|R)DI := (E|R)DI + 1;
          ELSE (E|R)DI := (E|R)DI  1; FI;
    ELSE IF (Word transfer)

        THEN IF DF = 0

                THEN (E)DI := (E)DI + 2;
                ELSE (E)DI := (E)DI  2; FI;
          ELSE (* Doubleword transfer *)

             THEN IF DF = 0

                      THEN (E|R)DI := (E|R)DI + 4;


                ELSE (E|R)DI := (E|R)DI  4; FI;

          FI;
FI;
```

## Banderas afectadas

None.
