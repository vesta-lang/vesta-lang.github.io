---
summary: Pendiente de salida al puerto
---

## Descripción

Copia datos del operando de origen (segundo operando) al puerto I/O especificado con el operando de destino (primer operando). El operando de origen es una ubicación de memoria, cuya dirección se lee desde los registros DS:SI, DS:ESI o RSI (dependiendo del atributo de tamaño de la instrucción, 16, 32 o 64, respectivamente). (El segmento DS puede ser anulado con un prefijo de override de segmento.) el operando de destino es una dirección de puerto I/O (de 0 a 65,535) que se lee en el registro DX. El tamaño del puerto I/O que se accede (es decir, el tamaño de la fuente y operandos de destino) es determinado por el código de operación para un puerto I/O de 8 bits o por el atributo el operando-size de la instrucción para un puerto I/O de 16 o 32 bits.

En el nivel de código de montaje se permiten dos formas de esta instrucción: la forma "explicit-operandos" y la forma "nooperands". La forma explícita-operandos (especificada con el OUTS mnemonic) permite que la fuente y operandos de destino se especifiquen explícitamente. Aquí, el operando de origen debe ser un símbolo que indica el tamaño del puerto I/O y la dirección de origen, y el operando de destino debe ser DX. Esta forma explícita-operandos se proporciona para permitir la documentación; sin embargo, tenga en cuenta que la documentación proporcionada por este formulario puede ser engañosa. Es decir, el símbolo el operando de origen debe especificar el tipo correcto (tamaño) del operando (byte, palabra o palabra doble), pero no tiene que especificar la ubicación correcta. La ubicación siempre es especificada por los registros DS:(E)SI o RSI, que deben ser cargados correctamente antes de ejecutar la instrucción OUTS.

La forma no-operandos proporciona "formas cortas" de las versiones de byte, palabra y doble palabra de las instrucciones OUTS. Aquí también DS:(E)SI se supone que es el operando de origen y DX se supone que es el operando de destino. El tamaño del puerto I/O se especifica con la opción de mnemonic: OUTSB (byte), OUTSW (palabra), o OUTSD (palabra doble).

Después de que el byte, palabra o palabra doble se transfiere de la ubicación de memoria al puerto I/O, el registro SI/ESI/RSI se aumenta o decrece automáticamente según el ajuste de la bandera DF en el registro EFLAGS. (Si la bandera DF es 0, el registro (E)SI se aumenta; si la bandera DF es 1, el registro SI/ESI/RSI es decrementado.) El registro SI/ESI/RSI es incrementado o decrementado por 1 para operaciones de byte, por 2 para operaciones de palabras, y por 4 para operaciones de doble palabra.

Las instrucciones OUTS, OUTSB, OUTSW y OUTSD pueden ser precedidas por el prefijo REP para la entrada de bloque de bytes ECX, palabras, o palabras dobles. Ver "REP/REPE/REPZ /REPNE/REPNZ--Repeat String Operation Prefix" en este

capítulo para una descripción del prefijo REP. Esta instrucción sólo es útil para acceder a los puertos I/O ubicados en el espacio de dirección I/O del procesador. Ver el capítulo 20, "Input/Output", en el Manual de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 1, para obtener más información sobre el acceso a puertos I/O en el espacio de direcciones I/O.

En modo de 64 bits, el tamaño de operando predeterminado es de 32 bits; tamaño de operando no es promovido por el uso de REX.W. En modo de 64 bits, el tamaño de la dirección predeterminada es de 64 bits, y la dirección de 64 bits se especifica usando RSI por defecto. La dirección de 32 bits usando ESI es compatible con el prefijo 67H, pero la dirección de 16 bits no se admite en modo de 64 bits.

## Compatibilidad de arquitectura IA-32

Después de ejecutar una instrucción OUTS, OUTSB, OUTSW, o OUTSD, el procesador Pentium asegura que el pin EWBE# haya sido muestreado activo antes de comenzar a ejecutar la siguiente instrucción. (Nota que la instrucción puede ser prefetched si EWBE# no es activa, pero no se ejecutará hasta que el pin EWBE# se muestre activo.) Sólo la familia procesadora de Pentium tiene el pin EWBE#.

Para el Pentium 4, Intel(R) Xeon(R), y P6 procesador familia, al ejecutar una instrucción OUTS, OUTSB, OUTSW, o OUTSD, el procesador no ejecutará la siguiente instrucción hasta que la fase de datos de la transacción esté completa.

## Operación

```text
IF ((PE = 1) and ((CPL > IOPL) or (VM = 1)))
    THEN (* Protected mode with CPL > IOPL or virtual-8086 mode *)
         IF (Any I/O Permission Bit for I/O port being accessed = 1)
                THEN (* I/O operation is not allowed *)
                      #GP(0);
                ELSE (* I/O operation is allowed *)
                      DEST := SRC; (* Writes to I/O port *)
          FI;
    ELSE (Real Mode or Protected Mode or 64-Bit Mode with CPL  IOPL *)
          DEST := SRC; (* Writes to I/O port *)

FI;

Byte transfer:
    IF 64-bit mode
          Then
                IF 64-Bit Address Size
                      THEN
                          IF DF = 0
                                  THEN RSI := RSI RSI + 1;
                                  ELSE RSI := RSI or  1;
                            FI;
                      ELSE (* 32-Bit Address Size *)
                          IF DF = 0
                                  THEN ESI := ESI + 1;
                                  ELSE ESI := ESI  1;
                            FI;
                FI;
          ELSE
               IF DF = 0
                      THEN (E)SI := (E)SI + 1;
                      ELSE (E)SI := (E)SI  1;
                FI;
    FI;

Word transfer:
    IF 64-bit mode
          Then
                IF 64-Bit Address Size


                      THEN
                          IF DF = 0
                                  THEN RSI := RSI RSI + 2;
                                  ELSE RSI := RSI or  2;

                            FI;

                      ELSE (* 32-Bit Address Size *)
                          IF DF = 0
                                  THEN ESI := ESI + 2;
                                  ELSE ESI := ESI  2;

                            FI;

                FI;

          ELSE
               IF DF = 0
                      THEN (E)SI := (E)SI + 2;
                      ELSE (E)SI := (E)SI  2;

                FI;

    FI;

Doubleword transfer:

    IF 64-bit mode

          Then

                IF 64-Bit Address Size

                      THEN
                          IF DF = 0
                                  THEN RSI := RSI RSI + 4;
                                  ELSE RSI := RSI or  4;

                            FI;

                      ELSE (* 32-Bit Address Size *)
                          IF DF = 0
                                  THEN ESI := ESI + 4;
                                  ELSE ESI := ESI  4;

                            FI;

                FI;

          ELSE
               IF DF = 0
                      THEN (E)SI := (E)SI + 4;
                      ELSE (E)SI := (E)SI  4;

                FI;

    FI;
```

## Banderas afectadas

None.
