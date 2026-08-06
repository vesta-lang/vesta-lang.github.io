---
summary: Complemento bandera de acarreo
---

## Descripción

Complementa la bandera CF en el registro EFLAGS. La operación CMC es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
EFLAGS.CF[bit 0] := NOT EFLAGS.CF[bit 0];
```

## Banderas afectadas

La bandera CF contiene el complemento de su valor original. Las banderas OF, ZF, SF, AF y PF no son afectadas.
