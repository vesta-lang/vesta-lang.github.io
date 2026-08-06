---
summary: Salida a Puerto
---

## Descripción

Copie el valor del segundo operando (operando de origen) al puerto I/O especificado con el operando de destino (primer operando). El operando de origen se puede registrar AL, AX, o EAX, dependiendo del tamaño del puerto que se accede (8, 16, o 32 bits, respectivamente); el operando de destino puede ser un byte-immediate o el registro DX. Utilizando un byte inmediato permite acceder a las direcciones de puerto I/O 0 a 255; utilizando el registro DX como un operando de origen permite acceder a puertos I/O de 0 a 65.535.

El tamaño del puerto I/O que se accede es determinado por el código de operación para un puerto I/O de 8 bits o por el atributo el operando de tamaño de la instrucción para un puerto I/O de 16 o 32 bits.

En el nivel de código de máquina, las instrucciones I/O son más cortas al acceder a puertos I/O de 8 bits. Aquí, las ocho partes superiores de la dirección del puerto serán 0.

Esta instrucción sólo es útil para acceder a los puertos I/O ubicados en el espacio de dirección I/O del procesador. Ver el capítulo 20, "Input/Output", en el Manual de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 1, para obtener más información sobre el acceso a puertos I/O en el espacio de direcciones I/O.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Compatibilidad de arquitectura IA-32

Después de ejecutar una instrucción OUT, el procesador Pentium(R) garantiza que el pin EWBE# haya sido muestreado activo antes de comenzar a ejecutar la siguiente instrucción. (Nota que la instrucción puede ser prefetched si EWBE# no es activa, pero no se ejecutará hasta que el pin EWBE# se muestre activo.) Sólo la familia procesadora de Pentium tiene el pin EWBE#.

## Operación

```text
IF ((PE = 1) and ((CPL > IOPL) or (VM = 1)))
    THEN (* Protected mode with CPL > IOPL or virtual-8086 mode *)
         IF (Any I/O Permission Bit for I/O port being accessed = 1)
                THEN (* I/O operation is not allowed *)
                      #GP(0);
                ELSE ( * I/O operation is allowed *)
                      DEST := SRC; (* Writes to selected I/O port *)
          FI;
    ELSE (Real Mode or Protected Mode with CPL  IOPL *)
          DEST := SRC; (* Writes to selected I/O port *)

FI;
```

## Banderas afectadas

None.
