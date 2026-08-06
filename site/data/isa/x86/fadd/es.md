---
summary: Añadir
---

## Descripción

Añade el destino y operandos de origen y almacena la suma en la ubicación de destino. El operando de destino es siempre un registro FPU; el operando de origen puede ser un registro o una ubicación de memoria. Operandos de origen en memoria puede estar en forma de precisión simple o coma flotante de precisión doble o en formato de palabra o doble palabra.

La versión no-operando de la instrucción agrega el contenido del registro ST(0) al registro ST(1). La versión oneoperand añade el contenido de una ubicación de memoria (ya sea una coma flotante o un valor entero) al contenido del registro ST(0). La versión dos-operando, añade el contenido del registro ST(0) al registro ST(i) o viceversa. El valor en ST(0) se puede duplicar mediante codificación:

FADD ST(0), ST(0);

Las instrucciones FADDP realizan el funcionamiento adicional de la pila de registro FPU después de almacenar el resultado. Para abrir la pila de registro, el procesador marca el registro ST(0) como vacío y aumenta el puntero de pila (TOP) por 1. (La versión no-operando de la coma flotante añadir instrucciones siempre resulta en la pila de registro que se está cayendo. En algunos ensambladores, la mnemónica para esta instrucción es FADD en lugar de FADDP.)

Las instrucciones FIADD convierten un integer operando de origen a formato coma flotante de doble precisión antes de realizar la adición.

La tabla de la siguiente página muestra los resultados obtenidos al agregar varias clases de números, asumiendo que no se produce desbordamiento ni desbordamiento.

Cuando la suma de dos operandos con signos opuestos es 0, el resultado es +0, excepto por el modo redondo hacia -, en cuyo caso el resultado es -0. Cuando el operando de origen es un entero 0, se trata como un +0.

Cuando ambos operando son infinitos del mismo signo, el resultado es del signo esperado. Si ambos operandos son infinidades de signos opuestos, se genera una excepción de cooperación inválida. Véase el cuadro 3-20.

**FADD/FADDP/FIADD Resultados**

| - F or - I | - | -F | SRC | SRC | +/- F or | +/- | 0 | + | Nan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| -0 | - | DEST | -0 | +/-0 | DEST |  | + | Na | N |

## Operación

```text
IF Instruction = FIADD

    THEN
          DEST := DEST + ConvertToDoubleExtendedPrecisionFP(SRC);

    ELSE (* Source operand is floating-point value *)
          DEST := DEST + SRC;

FI;

IF Instruction = FADDP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                      Set to 0 if stack underflow occurred.

                        Set if result was rounded up; cleared otherwise.

C0, C2, C3              Undefined.
```

## Excepciones coma flotante

```text
#IS                     Stack underflow occurred.
```

```text
#IA                     Operand is an SNaN value or unsupported format.
```

Operandos son infinitos de signo diferente.

```text
#D                      Source operand is a denormal value.
```

```text
#U                      Result is too small for destination format.
```

```text
#O                      Result is too large for destination format.
```

```text
#P                      Value cannot be represented exactly in destination format.
```
