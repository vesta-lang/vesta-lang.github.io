---
summary: Compute y log2x
---

## Descripción

Computes (ST(1) log2 (ST(0))), almacena el resultado en el registro ST(1), y abre la pila de registro FPU. El operando de origen en ST(0) debe ser un número no cero positivo.

El siguiente cuadro muestra los resultados obtenidos al tomar el registro de varias clases de números, asumiendo que no se produce desbordamiento ni desbordamiento.

**FYL2X Results**

| ST(1) | -F | * | * | ** | +F | -0 | -F | - | Nan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -0 | * | * | * | +0 | -0 | -0 | * | Nan |
|  | +0 | * | * | * | -0 | +0 | +0 | * | Nan |
|  | +F | * | * | ** | -F | +0 | +F | + | Nan |
|  | + | * | * | - | - | * | + | + | Nan |

## Operación

```text
ST(1) := ST(1)  log2ST(0);
PopRegisterStack;

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
#IA                       Either operand is an SNaN or unsupported format.
```

Operando de origen en el registro ST(0) es un valor finito negativo (no -0).

```text
#Z                        Source operand in register ST(0) is +/-0.
```

```text
#D                        Source operand is a denormal value.
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
