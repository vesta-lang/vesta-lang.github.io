---
summary: Empuje palabra, palabra doble o palabra cuádruple en la plataforma
---

## Descripción

Decrementos el puntero de pila y luego almacena el operando de origen en la parte superior de la pila. Los tamaños de dirección y operando se determinan y utilizan de la siguiente manera:

* Tamaño de la dirección. La bandera D en el descriptor de código-segment actual determina el tamaño de la dirección predeterminada; puede ser

prefijo de instrucción (67H).

El tamaño de la dirección se utiliza sólo cuando se hace referencia a un operando de origen en memoria.

* Tamaño de operando. La bandera D en el descriptor de código actual determina el tamaño de operando predeterminado; puede

ser sobrescribido por prefijos de instrucción (66H o REX.W).

El tamaño de operando (16, 32 o 64 bits) determina la cantidad por la que el puntero de pila es decrementado (2, 4 o 8).

Si el operando de origen es un tamaño inmediato inferior al tamaño de operando, se presiona un valor añadido de signo en la pila. Si el operando de origen es un registro de segmentos (16 bits) y el tamaño de operando es de 64 bits, un valor de ceroextended es empujado en la pila; si el tamaño de operando es de 32 bits, un valor de cero-extended es empujado en la pila o el selector de segmento está escrito en la pila usando un movimiento de 16 bits. Para el último caso, todos los procesadores Intel Core e Intel Atom recientes realizan un movimiento de 16 bits, dejando la parte superior de la ubicación de la pila sin modificar.

* Tamaño de la dirección. Fuera del modo 64-bit, la bandera B en el descriptor de la pila actual determina el

tamaño del puntero de pila (16 o 32 bits); en modo de 64 bits, el tamaño del puntero de pila es siempre 64 bits.

El tamaño de la dirección de la pila determina el ancho del puntero de pila al escribir para apilar en la memoria y al decrementar el puntero de pila. (Como se indicó anteriormente, la cantidad por la que el puntero de pila es decrementado es determinada por el tamaño de operando.)

Si el tamaño de operando es menor que el tamaño de la dirección de la pila, la instrucción PUSH puede resultar en un puntero de pila mal alineado (un puntero de pila que no está alineado en una palabra doble o límite de cuádpago).

La instrucción PUSH ESP empuja el valor del registro ESP ya que existía antes de ejecutar la instrucción. Si una instrucción PUSH utiliza un operando de memoria en la que se utiliza el registro ESP para calcular la dirección el operando, la dirección del operando se calcula antes de que el registro ESP se decremente.

Si el registro ESP o SP es 1 cuando la instrucción PUSH se ejecuta en modo de direccion real, una excepción de fallo de pila (#SS) se genera (porque se viola el límite del segmento de la pila). Su entrega encuentra una segunda excepción apilfault (por la misma razón), causando la generación de una excepción doble falla (#DF). La entrega de la excepción doble falla encuentra un tercer excepción de fallo de pila, y el procesador lógico entra en modo de cierre. Vea la discusión de la excepción doble falla en el Capítulo 7 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A.

## Compatibilidad de arquitectura IA-32

Para los procesadores IA-32 del Intel 286 en adelante, la instrucción PUSH ESP empuja el valor del registro ESP como existía antes de la instrucción fue ejecutada. (Esto también es cierto para la arquitectura Intel 64, real-address y virtual- 8086 modos de arquitectura IA-32.) Para el procesador Intel(R) 8086, la instrucción PUSH SP empuja el nuevo valor del registro SP (es decir, el valor después de que haya sido decrementado por 2).

## Operación

```text
(* See Description section for possible sign-extension or zero-extension of source operand and for *)

(* a case in which the size of the memory store may be smaller than the instruction's operand size *)

IF StackAddrSize = 64

THEN

IF OperandSize = 64

           THEN

           RSP := RSP  8;

           Memory[SS:RSP] := SRC;                        (* push quadword *)

ELSE IF OperandSize = 32

           THEN

           RSP := RSP  4;

           Memory[SS:RSP] := SRC;                        (* push dword *)

           ELSE (* OperandSize = 16 *)

           RSP := RSP  2;

           Memory[SS:RSP] := SRC;                        (* push word *)

FI;

ELSE IF StackAddrSize = 32                               (* push quadword *)
                                                         (* push dword *)
    THEN                                                 (* push word *)

          IF OperandSize = 64

                THEN

                    ESP := ESP  8;
                    Memory[SS:ESP] := SRC;
          ELSE IF OperandSize = 32

                THEN

                    ESP := ESP  4;
                    Memory[SS:ESP] := SRC;
                ELSE (* OperandSize = 16 *)

                    ESP := ESP  2;
                    Memory[SS:ESP] := SRC;


          FI;                                            (* push dword *)
                                                         (* push word *)
    ELSE (* StackAddrSize = 16 *)

          IF OperandSize = 32

                THEN

                    SP := SP  4;
                    Memory[SS:SP] := SRC;
                ELSE (* OperandSize = 16 *)

                    SP := SP  2;
                    Memory[SS:SP] := SRC;
          FI;

FI;
```

## Banderas afectadas

None.
