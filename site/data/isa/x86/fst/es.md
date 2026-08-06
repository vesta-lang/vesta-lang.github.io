---
summary: Tienda valor en coma flotante
---

## Descripción

La instrucción FST copia el valor en el registro ST(0) al operando de destino, que puede ser una ubicación de memoria u otro registro en la pila de registro FPU. Al almacenar el valor en la memoria, el valor se convierte en una sola precisión o formato coma flotante de precisión doble.

La instrucción FSTP realiza la misma operación que la instrucción FST y luego aparece la pila de registro. Para abrir la pila de registro, el procesador marca el registro ST(0) como vacío y aumenta el puntero de pila (TOP) por 1. La instrucción FSTP también puede almacenar valores en memoria en formato coma flotante de doble precisión.

Si el operando de destino es una ubicación de memoria, el operando especifica la dirección donde se almacena el primer byte del valor de destino. Si el operando de destino es un registro, el operando especifica un registro en la pila de registro relativo a la parte superior de la pila.

Si el tamaño de destino es de precisión simple o doble precisión, el significado del valor que se almacena se redondea a la anchura del destino (según el modo de redondeo especificado por el campo RC de la palabra de control FPU), y el exponente se convierte en la anchura y sesgo del formato de destino. Si el valor almacenado es demasiado grande para el formato de destino, se genera una excepción numérica de desbordamiento (#O) y, si la excepción se desenmascara, ningún valor se almacena en el operando de destino. Si el valor almacenado es un valor denormal, la excepción denormal (#D) no se genera. Esta condición es simplemente señalizada como una condición de excepción numérica de subida (#U).

Si el valor que se almacena es +/-0, +/-, o un NaN, los bits menos significativos del significado y el exponente se truncan para adaptarse al formato de destino. Esta operación conserva la identidad del valor como 0, , o NaN.

Si el operando de destino es un registro no vacío, la excepción de la operación inválida no se genera.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
DEST := ST(0);

IF Instruction = FSTP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Indicates rounding direction of if the floating-point inexact exception (#P) is generated: 0 :=
                    not roundup; 1 := roundup.

C0, C2, C3          Undefined.
```

## Excepciones coma flotante

```text
#IS     Stack underflow occurred.
```

```text
#IA     If destination result is an SNaN value or unsupported format, except when the destination
```

formato coma flotante de doble precisión.

```text
#U      Result is too small for the destination format.
```

```text
#O      Result is too large for the destination format.
```

```text
#P      Value cannot be represented exactly in destination format.
```
