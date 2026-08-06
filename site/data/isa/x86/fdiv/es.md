---
summary: Divide
---

## Descripción

Divide el operando de destino por el operando de origen y almacena el resultado en la ubicación de destino. El operando de destino (dividend) está siempre en un registro FPU; el operando de origen (divisor) puede ser un registro o una ubicación de memoria. Operandos de origen en memoria puede estar en un formato de precisión simple o coma flotante de precisión doble, formato de palabra o doble palabra entero.

La versión no-operando de la instrucción divide el contenido del registro ST(1) por el contenido del registro ST(0). La versión one-operando divide el contenido del registro ST(0) por el contenido de una ubicación de memoria (ya sea una coma flotante o un valor entero). La versión bi-operando divide el contenido del registro ST(0) por el contenido del registro ST(i) o viceversa.

Las instrucciones FDIVP realizan el funcionamiento adicional de la pila de registro FPU después de almacenar el resultado. Para abrir la pila de registro, el procesador marca el registro ST(0) como vacío y aumenta el puntero de pila (TOP) por 1. La versión no-operando de las instrucciones de división la coma flotante siempre resulta en la pila de registro que se está saltando. En algunos ensambladores, la mnemónica para esta instrucción es FDIV en lugar de FDIVP.

Las instrucciones FIDIV convierten un integer operando de origen a formato coma flotante de doble precisión antes de realizar la división. Cuando el operando de origen es un entero 0, se trata como un +0.

Si se genera una excepción de división por cero (#Z), no se almacena ningún resultado; si se enmascara la excepción, se almacena un signo adecuado en el operando de destino.

El siguiente cuadro muestra los resultados obtenidos al dividir varias clases de números, asumiendo que no se produce desbordamiento ni desbordamiento.

**FDIV/FDIVP/FIDIV Resultados**

| - | * | +0 | +0 | -0 | -0 | * | Nan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| -F | + | +F | +0 | -0 | -F | - | Nan |
| -I | + | +F | +0 | -0 | -F | - | Nan |
| -0 | + | ** | * | * | ** | - | Nan |
| +0 | - | ** | * | * | ** | + | Nan |
| +I | - | -F | -0 | +0 | +F | + | Nan |
| +F | - | -F | -0 | +0 | +F | + | Nan |
| + | * | -0 | -0 | +0 | +0 | * | Nan |
| Nan | Nan | Nan | Nan | Nan | Nan | Nan | Nan |

## Operación

```text
IF SRC = 0

    THEN
          #Z;

    ELSE
          IF Instruction is FIDIV
                THEN
                      DEST := DEST / ConvertToDoubleExtendedPrecisionFP(SRC);
                ELSE (* Source operand is floating-point value *)
                      DEST := DEST / SRC;
          FI;

FI;

IF Instruction = FDIVP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                        Set to 0 if stack underflow occurred.

                          Set if result was rounded up; cleared otherwise.

C0, C2, C3                Undefined.
```

## Excepciones coma flotante

```text
#IS                       Stack underflow occurred.
```

```text
#IA                       Operand is an SNaN value or unsupported format.
```

+/- / +/-; +/-0 / +/-0

```text
#D                        Source is a denormal value.
```

```text
#Z                        DEST / +/-0, where DEST is not equal to +/-0.
```

```text
#U                        Result is too small for destination format.
```

```text
#O                        Result is too large for destination format.
```

```text
#P                        Value cannot be represented exactly in destination format.
```
