---
summary: Dirección Bandera
---

## Descripción

Establece la bandera DF en el registro EFLAGS. Cuando la bandera DF se establece a 1, operaciones de cadenas decrementan los registros del índice (ESI y/o EDI). La operación es la misma en todos los modos.

## Operación

```text
DF := 1;
```

## Banderas afectadas

La bandera DF está lista. Las banderas CF, OF, ZF, SF, AF y PF no son afectadas.
