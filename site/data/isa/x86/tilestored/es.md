---
summary: Tienda Azul
---

## Descripción

Esta instrucción es necesaria para usar el tratamiento SIB. El registro de índices sirve como indicador de paso. Si la codificación SIB omite un registro índice, el valor cero se asume para el contenido del registro índice. Esta instrucción almacena una fuente de baldosas de filas y columnas según especifica la configuración del azulejo. El TILECFG.start_row en los datos TILECFG debe ser inicializado a '0' con el fin de almacenar toda la ficha y se establece a cero en la terminación exitosa de la instrucción TILESTORED. TILESTORED es una instrucción de descanso y el TILECFG.start_row no será cero cuando los eventos de descanso ocurren durante la ejecución de la instrucción. Sólo operandos de memoria son compatibles y sólo pueden accederse mediante un modo de dirección SIB, similar al V[P]GATHER*/V[P]SCATTER*. Cualquier intento de ejecutar la instrucción TILESTORED dentro de una transacción Intel TSX resultará en un aborto de transacción.

## Operación

```text
TILESTORED tsib, tsrc

start := tilecfg.start_row

membegin := tsib.base + displacement
// if no index register in the SIB encoding, the value zero is used.
stride := tsib.index << tsib.scale

while start < tdest.rows:
    memptr := membegin + start * stride
    write_memory(memptr, tsrc.colsb, tsrc.row[start])
    start := start + 1

zero_tilecfg_start()
// In the case of a memory fault in the middle of an instruction, the tilecfg.start_row := start
```

## Intel C/C++ compilador intrínseco

```c
TILESTORED void _tile_stored(__tile src, void *base, int stride);
```

## Banderas afectadas

None.

Excepciones AMX-E3; ver Sección 2.10, "Intel(R) AMX Clases de Excepción de Instrucción", para más detalles.
