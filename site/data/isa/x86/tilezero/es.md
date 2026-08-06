---
summary: Zero Tile
---

## Descripción

Esta instrucción nutre el nivel de destino. Cualquier intento de ejecutar la instrucción TILEZERO dentro de una transacción Intel TSX resultará en un aborto de transacción.

## Operación

```text
TILEZERO tdest

nbytes := palette_table[palette_id].bytes_per_row

for i in 0 ... palette_table[palette_id].max_rows-1:
    for j in 0 ... nbytes-1:
          tdest.row[i].byte[j] := 0

zero_tilecfg_start()
```

## Intel C/C++ compilador intrínseco

```c
TILEZERO void _tile_zero(__tile dst);
```

## Banderas afectadas

None.

Excepciones AMX-E5; ver Sección 2.10, "Intel(R) AMX Clases de Excepción de Instrucción", para detalles.
