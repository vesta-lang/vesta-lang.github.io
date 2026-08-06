---
summary: Cambio de signo
---

## Descripción

Complementa el bit de señal de ST(0). Esta operación cambia un valor positivo en un valor negativo de igual magnitud o viceversa. La siguiente tabla muestra los resultados obtenidos al cambiar el signo de varias clases de números.

** Resultados FCHS**

| ST(0) SRC | ST(0) DEST |
| --- | --- |
| + |  |
| +F |  |
| +0 |  |
| -0 |  |
| -F |  |
| - |  |
| Nan |  |

## Operación

```text
SignBit(ST(0)) := NOT (SignBit(ST(0)));

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          Undefined.
```

## Excepciones coma flotante

```text
#IS                 Stack underflow occurred.
```
