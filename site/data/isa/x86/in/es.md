---
summary: Entrada desde Puerto
---

## Descripción

Copie el valor del puerto I/O especificado con el segundo operando (operando de origen) al operando de destino (primer operando). El operando de origen puede ser un byte-immediate o el registro DX; el operando de destino se puede registrar AL, AX o EAX, dependiendo del tamaño del puerto que se accede (8, 16, o 32 bits, respectivamente). Utilizando el registro DX como un operando de origen permite acceder a direcciones portuarias I/O de 0 a 65.535; utilizando un byte inmediato permite acceder a direcciones portuarias I/O 0 a 255.

Al acceder a un puerto I/O de 8 bits, el código de operación determina el tamaño del puerto; al acceder a un puerto I/O de 16 y 32 bits, el atributo el operando-size determina el tamaño del puerto. En el nivel de código de máquina, las instrucciones I/O son más cortas al acceder a puertos I/O de 8 bits. Aquí, las ocho partes superiores de la dirección del puerto serán 0.

Esta instrucción sólo es útil para acceder a los puertos I/O ubicados en el espacio de dirección I/O del procesador. Ver el capítulo 20, "Input/Output", en el Manual de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 1, para obtener más información sobre el acceso a puertos I/O en el espacio de direcciones I/O.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
IF ((PE = 1) and ((CPL > IOPL) or (VM = 1)))

    THEN (* Protected mode with CPL > IOPL or virtual-8086 mode *)

        IF (Any I/O Permission Bit for I/O port being accessed = 1)

                THEN (* I/O operation is not allowed *)
                      #GP(0);

                ELSE ( * I/O operation is allowed *)
                      DEST := SRC; (* Read from selected I/O port *)

          FI;
    ELSE (Real Mode or Protected Mode with CPL  IOPL *)

          DEST := SRC; (* Read from selected I/O port *)
FI;
```

## Banderas afectadas

None.
