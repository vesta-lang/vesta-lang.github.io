---
summary: Compute y log2(x +1)
---

## Descripción

Computes (ST(1) log2(ST(0) + 1.0)), almacena el resultado en el registro ST(1), y abre la pila de registro FPU. El operando de origen en ST(0) debe estar en el rango:

```text
     (1  2 / 2) )to(1  2 / 2)
```

El operando de origen en ST(1) puede variar de - a +. Si el ST(0) operando está fuera de su rango aceptable, el resultado es indefinido y el software no debe confiar en una excepción que se genera. En algunas circunstancias se pueden generar excepciones cuando ST(0) está fuera de alcance, pero este comportamiento es específico de la implementación y no garantizado.

En el cuadro siguiente se muestran los resultados obtenidos al tomar el epsilón de registro de varias clases de números, asumiendo que el flujo no se produce.

**FYL2XP1 Results**

| -(1 - ( | 2 / 2 )) to -0 | -0 | +0 | +0 to +(1 - ( | 2 / 2 )) | Nan |
| --- | --- | --- | --- | --- | --- | --- |
|  | + | * | * | - |  | Nan |
|  | +F | +0 | -0 | -F |  | Nan |
|  | +0 | +0 | -0 | -0 |  | Nan |
|  | -0 | -0 | +0 | +0 |  | Nan |
|  | -F | -0 | +0 | +F |  | Nan |
|  | - | * | * | + |  | Nan |
|  | Nan | Nan | Nan | Nan |  | Nan |

## Operación

```text
ST(1) := ST(1)  log2(ST(0) + 1.0);
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
#IA                 Either operand is an SNaN value or unsupported format.
```

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
