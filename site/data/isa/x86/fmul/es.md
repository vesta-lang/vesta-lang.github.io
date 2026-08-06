---
summary: Multiply
---

## Descripción

Multiplica el destino y operandos de origen y almacena el producto en la ubicación de destino. El operando de destino es siempre un registro de datos FPU; el operando de origen puede ser un registro de datos FPU o una ubicación de memoria. Operandos de origen en memoria puede estar en forma de precisión simple o coma flotante de precisión doble o en formato de palabra o doble palabra.

La versión no-operando de la instrucción multiplica el contenido del registro ST(1) por el contenido del registro ST(0) y almacena el producto en el registro ST(1). La versión one-operando multiplica el contenido del registro ST(0) por el contenido de una ubicación de memoria (ya sea una coma flotante o un valor entero) y almacena el producto en el registro ST(0). La versión bi-operando multiplica el contenido del registro ST(0) por el contenido del registro ST(i) o viceversa, con el resultado almacenado en el registro especificado con el primer operando (el operando de destino).

Las instrucciones FMULP realizan el funcionamiento adicional de la pila de registro FPU después de almacenar el producto. Para abrir la pila de registro, el procesador marca el registro ST(0) como vacío y aumenta el puntero de pila (TOP) por 1. La versión no-operando de la coma flotante multiplica las instrucciones siempre resulta en la pila de registro que se está saltando. En algunos ensambladores, la mnemónica para esta instrucción es FMUL en lugar de FMULP.

Las instrucciones de FIMUL convierten un entero operando de origen a formato coma flotante de doble precisión antes de realizar la multiplicación.

El signo del resultado es siempre el exclusivo-OR de los signos de origen, incluso si uno o más de los valores que se multiplican es 0 o . Cuando el operando de origen es un entero 0, se trata como un +0.

El siguiente cuadro muestra los resultados obtenidos al multiplicar varias clases de números, asumiendo que no se produce desbordamiento ni desbordamiento.

**FMUL/FMULP/FIMUL Resultados**

| - | + | + | * | * | - | - | Nan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| -F | + | +F | +0 | -0 | -F | - | Nan |
| -I | + | +F | +0 | -0 | -F | - | Nan |
| -0 | * | +0 | +0 | -0 | -0 | * | Nan |
| +0 | * | -0 | -0 | +0 | +0 | * | Nan |
| +I | - | -F | -0 | +0 | +F | + | Nan |
| +F | - | -F | -0 | +0 | +F | + | Nan |
| + | - | - | * | * | + | + | Nan |
| Nan | Nan Nan | Nan |  | Nan | Nan | Nan | Nan |

## Operación

```text
IF Instruction = FIMUL

    THEN
          DEST := DEST  ConvertToDoubleExtendedPrecisionFP(SRC);

    ELSE (* Source operand is floating-point value *)
          DEST := DEST  SRC;

FI;

IF Instruction = FMULP

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
#IS                 Stack underflow occurred.
```

```text
#IA                 Operand is an SNaN value or unsupported format.
```

One operand is +/-0 and the other is +/-.

```text
#D                  Source operand is a denormal value.
```

```text
#U                  Result is too small for destination format.
```

```text
#O                  Result is too large for destination format.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
