---
summary: Bandera de dirección clara
---

## Descripción

Limpia la bandera DF en el registro EFLAGS. Cuando la bandera DF se establece a 0, las operaciones de cadena aumentan los registros del índice (ESI y/o EDI). La operación es la misma en todos los modos.

## Operación

```text
DF := 0;
```

## Banderas afectadas

La bandera DF está lista para 0. Las banderas CF, OF, ZF, SF, AF y PF no son afectadas.
