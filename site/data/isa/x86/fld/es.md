---
summary: Carga valor en coma flotante
---

## Descripción

Empuja el operando de origen en la pila de registro FPU. El operando de origen puede estar en formato coma flotante de precisión simple, doble precisión o doble precisión extendida. Si el operando de origen está en una sola precisión o formato coma flotante de precisión doble, se convierte automáticamente en el formato coma flotante de doble precisión antes de ser empujado en la pila.

La instrucción FLD también puede empujar el valor en un registro FPU seleccionado [ST(i)] en la pila. Aquí, presionando el registro ST(0) duplica la parte superior de la pila.

NOTE

Cuando la instrucción FLD carga un valor denormal y el bit DM en el CW no está enmascarado, una excepción es insignia pero el valor sigue siendo empujado a la pila x87.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
IF SRC is ST(i)
    THEN
          temp := ST(i);

FI;

TOP := TOP - 1;

IF SRC is memory-operand
    THEN
          ST(0) := ConvertToDoubleExtendedPrecisionFP(SRC);
    ELSE (* SRC is ST(i) *)
          ST(0) := temp;

FI;

FPU Flags Affected

C1                  Set to 1 if stack overflow occurred; otherwise, set to 0.

C0, C2, C3          Undefined.
```

## Excepciones coma flotante

```text
#IS                 Stack underflow or overflow occurred.
```

```text
#IA                 Source operand is an SNaN. Does not occur if the source operand is in double extended-preci-
```

sion coma flotante formato (FLD m80fp o FLD ST(i)).

```text
#D                  Source operand is a denormal value. Does not occur if the source operand is in double
```

formato coma flotante de gran precisión.

## Descripción

Empuja una de las siete constantes de uso común (en formato coma flotante de doble precisión) en la pila de registro FPU. Las constantes que se pueden cargar con estas instrucciones incluyen +1.0, +0.0, log210, log2e, , log102, y loge2. Para cada constante, se redondea una constante interna de 66 bits (como se especifica en el campo RC en la palabra de control FPU) a formato coma flotante de doble precisión. La excepción inexacto-result (#P) no se genera como resultado del redondeo, ni es la bandera C1 establecida en la palabra estado x87 FPU si el valor se redondea.

Vea la sección titulada "Aproximación de Pi" en el capítulo 8 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una descripción de la constante.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Compatibilidad de arquitectura IA-32

Cuando el campo RC se establece para redondear-to-nearest, el FPU produce las mismas constantes que son producidas por los coprocesadores Intel 8087 e Intel 287 de matemáticas.

## Operación

```text
TOP := TOP - 1;

ST(0) := CONSTANT;

FPU Flags Affected

C1                  Set to 1 if stack overflow occurred; otherwise, set to 0.

C0, C2, C3          Undefined.
```

## Excepciones coma flotante

```text
#IS                 Stack overflow occurred.
```
