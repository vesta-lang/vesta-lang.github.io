---
summary: Tile Op/ 64/32 bit CPUID Feature
---

## Descripción

Esta instrucción devuelve TILECFG y TILEDATA al estado INIT. Cualquier intento de ejecutar la instrucción TILERELEASE dentro de una transacción Intel TSX resultará en un aborto de transacción.

## Operación

```text
zero_all_tile_data()
tilecfg := 0// equivalent to 64B of zeros
TILES_CONFIGURED := 0
```

## Intel C/C++ compilador intrínseco

```c
TILERELEASE void _tile_release(void);
```

## Banderas afectadas

None.

Excepciones AMX-E6; ver Sección 2.10, "Intel(R) AMX Clases de Excepción de Instrucción", para detalles.
