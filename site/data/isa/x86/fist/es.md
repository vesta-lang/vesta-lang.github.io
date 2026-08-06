---
summary: Store Integer
---

## Descripción

La instrucción FIST convierte el valor en el registro ST(0) a un entero firmado y almacena el resultado en el operando de destino. Los valores se pueden almacenar en formato entero de palabra o palabra doble. El operando de destino especifica la dirección donde se almacena el primer byte del valor de destino.

La instrucción FISTP realiza la misma operación que la instrucción FIST y luego aparece la pila de registro. Para abrir la pila de registro, el procesador marca el registro ST(0) como vacío y aumenta el puntero de pila (TOP) por 1. La instrucción FISTP también almacena valores en formato cuádpago entero.

La siguiente tabla muestra los resultados obtenidos al almacenar varias clases de números en formato entero.

** Resultados FIST/FISTP**

| - | o valor demasiado grande para el formato DEST | * |
| --- | --- | --- |
|  | F  -1 | -I |
|  | -1 < F < -0 | ** |
|  | -0 | 0 |
|  | +0 | 0 |
|  | +0<F<+1 | ** |
|  | F+1 | +I |
| + | o valor demasiado grande para el formato DEST | * |
|  | Nan | * |

## Operación

```text
DEST := Integer(ST(0));

IF Instruction = FISTP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                         Set to 0 if stack underflow occurred.

                           Indicates rounding direction of if the inexact exception (#P) is generated: 0 := not roundup; 1
                           := roundup.

                           Set to 0 otherwise.

C0, C2, C3                 Undefined.
```

## Excepciones coma flotante

```text
#IS                        Stack underflow occurred.
```

```text
#IA                        Converted value is too large for the destination format.
```

Operando de origen es un formato SNaN, QNaN, +/- o no compatible.

```text
#P                         Value cannot be represented exactly in destination format.
```
