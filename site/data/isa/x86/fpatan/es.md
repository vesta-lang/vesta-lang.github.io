---
summary: Partial Arctangent
---

## Descripción

Computes the arctangent ofel operando de origenin register ST(1) divided byel operando de origenen el registro ST(0), almacena el resultado en ST(1), y pops elFPUregistro de pila. El resultado en el registro ST(0) tiene el mismo signo que el operando de origen ST(1) y una magnitud inferior a +.

La instrucción FPATAN devuelve el ángulo entre el eje X y la línea desde el origen hasta el punto (X,Y), donde Y (el ordenado) es ST(1) y X (el abscissa) es ST(0). El ángulo depende del signo de X y Y independientemente, no sólo del signo de la relación Y/X. Esto se debe a que un punto (-X,Y) está en el segundo cuadrante, dando como resultado un ángulo entre /2 y , mientras que un punto (X,-Y) está en el cuarto cuadrante, dando como resultado un ángulo entre 0 y -/2. Un punto (-X,-Y) está en el tercer cuadrante, dando un ángulo entre -/2 y -.

En el cuadro siguiente se muestran los resultados obtenidos al computar el arctangente de varias clases de números, asumiendo que el flujo no ocurre.

** Resultados FPATAN**

| ST(1) | -F | -p | - to -/2 | -/2 | -/2 | -/2 to -0 | -0 | Nan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -0 | -p | -p | -p* | - 0* | -0 | -0 | Nan |
|  | +0 | +p | +p | + * | + 0* | +0 | +0 | Nan |
|  | +F | +p | + to +/2 | + /2 | +/2 | +/2 to +0 | +0 | Nan |
|  | + | +3/4* | +/2 | +/2 | +/2 | + /2 | + /4* | Nan |
|  | Nan | Nan | Nan | Nan | Nan | Nan | Nan | Nan |

## Compatibilidad de arquitectura IA-32

Los operandos de origenpara esta instrucción se restringe para el coprocesador de 80287 matemáticas al siguiente rango: 0 TENST(1)<Silencioso(0)< +

## Operación

```text
ST(1) := arctan(ST(1) / ST(0));
PopRegisterStack;

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
#IA                 Source operand is an SNaN value or unsupported format.
```

```text
#D                  Source operand is a denormal value.
```

```text
#U                  Result is too small for destination format.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
