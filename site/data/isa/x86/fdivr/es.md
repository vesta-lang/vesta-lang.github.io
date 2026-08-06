---
summary: Divideo inverso
---

## Descripción

Divide el operando de origen por el operando de destino y almacena el resultado en la ubicación de destino. El operando de destino (divisor) está siempre en un registro FPU; el operando de origen (dividend) puede ser un registro o una ubicación de memoria. Operandos de origen en memoria puede estar en un formato de precisión simple o coma flotante de precisión doble, formato de palabra o doble palabra entero.

Estas instrucciones realizan las operaciones inversas de las instrucciones FDIV, FDIVP y FIDIV. Se les proporciona para apoyar una codificación más eficiente.

La versión no-operando de la instrucción divide el contenido del registro ST(0) por el contenido del registro ST(1). La versión one-operando divide el contenido de una ubicación de memoria (ya sea una coma flotante o un valor entero) por el contenido del registro ST(0). La versión bi-operando divide el contenido del registro ST(i) por el contenido del registro ST(0) o viceversa.

Las instrucciones FDIVRP realizan el funcionamiento adicional de la pila de registro FPU después de almacenar el resultado. Para abrir la pila de registro, el procesador marca el registro ST(0) como vacío y aumenta el puntero de pila (TOP) por 1. La versión no-operando de las instrucciones de división la coma flotante siempre resulta en la pila de registro que se está saltando. En algunos ensambladores, la mnemónica para esta instrucción es FDIVR en lugar de FDIVRP.

Las instrucciones FIDIVR convierten un integer operando de origen a formato coma flotante de doble precisión antes de realizar la división.

Si se genera una excepción de división por cero (#Z), no se almacena ningún resultado; si se enmascara la excepción, se almacena un signo adecuado en el operando de destino.

El siguiente cuadro muestra los resultados obtenidos al dividir varias clases de números, asumiendo que no se produce desbordamiento ni desbordamiento.

**FDIVR/FDIVRP/FIDIVR Resultados**

| SRC | -F | +0 | +F | ** | ** | -F | -0 | Nan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -I | +0 | +F | ** | ** | -F | -0 | Nan |
|  | -0 | +0 | +0 | * | * | -0 | -0 | Nan |
|  | +0 | -0 | -0 | * | * | +0 | +0 | Nan |
|  | +I | -0 | -F | ** | ** | +F | +0 | Nan |
|  | +F | -0 | -F | ** | ** | +F | +0 | Nan |
|  | + | * | - | - | + | + | * | Nan |
|  | Nan | Nan | Nan | Nan | Nan | Nan | Nan | Nan |

## Operación

```text
IF DEST = 0

    THEN
          #Z;

    ELSE

        IF Instruction = FIDIVR

                THEN
                      DEST := ConvertToDoubleExtendedPrecisionFP(SRC) / DEST;

                ELSE (* Source operand is floating-point value *)
                      DEST := SRC / DEST;

          FI;
FI;

IF Instruction = FDIVRP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Set if result was rounded up; cleared otherwise.

C0, C2, C3          Undefined.
```

## Excepciones coma flotante

```text
#IS     Stack underflow occurred.
```

```text
#IA     Operand is an SNaN value or unsupported format.
```

+/- / +/-; +/-0 / +/-0

```text
#D      Source is a denormal value.
```

```text
#Z      SRC / +/-0, where SRC is not equal to +/-0.
```

```text
#U      Result is too small for destination format.
```

```text
#O      Result is too large for destination format.
```

```text
#P      Value cannot be represented exactly in destination format.
```
