---
summary: Tienda BCD Integer y Pop
---

## Descripción

Convierte el valor en el registro ST(0) en un entero BCD de 18 dígitos, almacena el resultado en el operando de destino y abre la pila de registro. Si el valor fuente es un valor no integrado, se redondea a un valor entero, según el modo de redondeo especificado por el campo RC de la palabra de control FPU. Para abrir la pila de registro, el procesador marca el registro ST(0) como vacío y aumenta el puntero de pila (TOP) por 1.

El operando de destino especifica la dirección donde se almacena el primer valor de destino byte. El valor BCD (incluyendo su bit de signo) requiere 10 bytes de espacio en memoria.

La siguiente tabla muestra los resultados obtenidos al almacenar varias clases de números en formato BCD empaquetado.

** Resultados FBSTP**

| - | o valor demasiado grande para el formato DEST | * |
| --- | --- | --- |
|  | F-1 | -D |
|  | -1 < F < -0 | ** |
|  | -0 | -0 |
|  | +0 | +0 |
|  | + 0 < F < +1 | ** |
|  | F  +1 | +D |
| + | o valor demasiado grande para el formato DEST | * |
|  | Nan | * |

## Operación

```text
DEST := BCD(ST(0));
PopRegisterStack;

FPU Flags Affected

C1                   Set to 0 if stack underflow occurred.

                     Set if result was rounded up; cleared otherwise.

C0, C2, C3           Undefined.
```

## Excepciones coma flotante

```text
#IS     Stack underflow occurred.
```

```text
#IA     Converted value that exceeds 18 BCD digits in length.
```

Operando de origen es un SNaN, QNaN, +/-, o en un formato sin soporte.

```text
#P      Value cannot be represented exactly in destination format.
```
