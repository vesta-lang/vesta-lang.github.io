---
summary: Restante parcial
---

## Descripción

Computa el resto IEEE obtenido de dividir el valor en el registro ST(0) por el valor en el registro ST(1) (el divisor o módulo) y almacena el resultado en ST(0). El resto representa el siguiente valor:

```text
Remainder := ST(0) - (Q  ST(1))
```

Aquí, Q es un valor entero que se obtiene redondeando el número la coma flotante de [ST(0) / ST(1)] hacia el valor entero más cercano. La magnitud del resto es inferior o igual a la mitad de la magnitud del módulo, a menos que se computase un resto parcial (como se describe a continuación).

Esta instrucción produce un resultado exacto; la excepción de precisión (inexacta) no ocurre y el control de redondeo no tiene efecto. En el cuadro siguiente se muestran los resultados obtenidos al calcular el resto de las clases de números, asumiendo que el flujo no se produce.

**FPREM1 Results**

| ST(0) | -F | ST(0) | +/-F or -0 | * | * | +/- F or - 0 | ST(0) | Nan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -0 | -0 | -0                   * | * | -0 | -0 | Nan |  |
|  | +0 | +0 | +0                   * | * | +0 | +0 | Nan |  |
|  | +F | ST(0) | +/- F or + 0 | * | * | +/- F or + 0 | ST(0) | Nan |
|  | + | * | *                    * | * | * | * | Nan |  |

## Operación

```text
D := exponent(ST(0))  exponent(ST(1));

IF D < 64
    THEN
          Q := Integer(RoundTowardNearestInteger(ST(0) / ST(1)));
          ST(0) := ST(0)  (ST(1)  Q);
          C2 := 0;
          C0, C3, C1 := LeastSignificantBits(Q); (* Q2, Q1, Q0 *)
    ELSE
          C2 := 1;
          N := An implementation-dependent number between 32 and 63;
          QQ := Integer(TruncateTowardZero((ST(0) / ST(1)) / 2(D - N)));
          ST(0) := ST(0)  (ST(1)  QQ  2(D - N));

FI;

FPU Flags Affected

C0                  Set to bit 2 (Q2) of the quotient.

C1                  Set to 0 if stack underflow occurred; otherwise, set to least significant bit of quotient (Q0).

C2                  Set to 0 if reduction complete; set to 1 if incomplete.

C3                  Set to bit 1 (Q1) of the quotient.
```

## Excepciones coma flotante

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 Source operand is an SNaN value, modulus (divisor) is 0, dividend is , or unsupported
```

format.

```text
#D                  Source operand is a denormal value.
```

```text
#U                  Result is too small for destination format.
```
