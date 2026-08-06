---
summary: Subtracto inverso
---

## Descripción

Sustrae el operando de destino del operando de origen y almacena la diferencia en la ubicación de destino. El operando de destino es siempre un registro FPU; el operando de origen puede ser un registro o una ubicación de memoria. Operandos de origen en memoria puede estar en forma de precisión simple o coma flotante de precisión doble o en formato de palabra o doble palabra.

Estas instrucciones realizan las operaciones inversas de las instrucciones FSUB, FSUBP y FISUB. Se les proporciona para apoyar una codificación más eficiente.

La versión no-operando de la instrucción resta el contenido del registro ST(1) del registro ST(0) y almacena el resultado en ST(1). La versión one-operando resta el contenido del registro ST(0) del contenido de una ubicación de memoria (ya sea una coma flotante o un valor entero) y almacena el resultado en ST(0). La versión de dos operando, resta el contenido del registro ST(i) del registro ST(0) o viceversa.

Las instrucciones FSUBRP realizan el funcionamiento adicional de la pila de registro FPU después de la resta. Para abrir la pila de registro, el procesador marca el registro ST(0) como vacío y aumenta el puntero de pila (TOP) por 1. La versión no-operando de las instrucciones de subtracto inverso de la coma flotante siempre resulta en la pila de registro que se está llenando. En algunos ensambladores, la mnemónica para esta instrucción es FSUBR en lugar de FSUBRP.

Las instrucciones FISUBR convierten un integer operando de origen a formato coma flotante de doble precisión antes de realizar la resta.

En el cuadro siguiente se muestran los resultados obtenidos cuando se restringen varias clases de números entre sí, asumiendo que no se produce desbordamiento ni desbordamiento. Aquí, el valor DEST se resta del valor SRC (SRC - DEST = resultado).

Cuando la diferencia entre dos operandos de signo similar es 0, el resultado es +0, excepto por el modo redondo hacia -, en cuyo caso el resultado es -0. Esta instrucción también garantiza que +0 - (-0) = +0, y que -0 - (+0) = -0. Cuando el operando de origen es un entero 0, se trata como un +0.

Cuando un operando es , el resultado es del signo esperado. Si ambos operandos son del mismo signo, se genera una excepción de cooperación inválida.

**FSUBR/FSUBRP/FISUBR Resultados**

| - | * | + | + | + | + | + | Nan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| -F         - | +/-F or +/-0 | - | DEST | -DE | ST  +F | + | Nan |
| -0         - | SRC |  | +/-0 | +0 | SRC | + | Nan |
| +0         - | SRC |  | -0 | +/-0 | SRC | + | Nan |
| +F         - |  | -F  -DEST |  | -DEST | +/-F or +/ | -0  + | Nan |
| +          - |  | - | - | - | - | * | Nan |
| Nan Nan | Nan |  | Nan | Nan | Nan | Nan | Nan |

## Operación

```text
IF Instruction = FISUBR
    THEN

        DEST := ConvertToDoubleExtendedPrecisionFP(SRC) - DEST;

    ELSE (* Source operand is floating-point value *)

        DEST := SRC - DEST; FI;

IF Instruction = FSUBRP
    THEN
          PopRegisterStack; FI;

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

Operandos son infinitos de signo.

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
