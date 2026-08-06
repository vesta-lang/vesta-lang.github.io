---
summary: Carga Azulejos
---

## Descripción

Esta instrucción es necesaria para usar el tratamiento SIB. El registro de índices sirve como indicador de paso. Si la codificación SIB omite un registro índice, el valor cero se asume para el contenido del registro índice.

Esta instrucción carga un destino de baldosas con filas y columnas según lo especificado por la configuración de baldosas. La versión "T1" proporciona un indicio a la implementación de que los datos serían reutilizados pero no necesita ser residente en los niveles de caché más cercanos.

El TILECFG.start_row en los datos TILECFG debe ser inicializado a '0' para cargar toda la ficha y se establece a cero en la terminación exitosa de la instrucción TILELOADD. TILELOADD es una instrucción de descanso y el TILECFG.start_row no será cero cuando los eventos de descanso ocurren durante la ejecución de la instrucción.

Sólo operandos de memoria son compatibles y sólo pueden accederse mediante un modo de dirección SIB, similar al V[P]GATHER*/V[P]SCATTER*.

Cualquier intento de ejecutar las instrucciones TILELOADD/TILELOADDT1 dentro de una transacción Intel TSX resultará en un aborto de transacción.

## Operación

```text
TILELOADD[,T1] tdest, tsib

start := tilecfg.start_row

zero_upper_rows(tdest,start)

membegin := tsib.base + displacement
// if no index register in the SIB encoding, the value zero is used.
stride := tsib.index << tsib.scale
nbytes := tdest.colsb
while start < tdest.rows:

    memptr := membegin + start * stride
    write_row_and_zero(tdest, start, read_memory(memptr, nbytes), nbytes)
    start := start + 1
zero_tilecfg_start()
// In the case of a memory fault in the middle of an instruction, the tilecfg.start_row := start
```

## Intel C/C++ compilador intrínseco

```c
TILELOADD void _tile_loadd(__tile dst, const void *base, int stride);
TILELOADDT1 void _tile_stream_loadd(__tile dst, const void *base, int stride);
```

## Banderas afectadas

None.

Excepciones AMX-E3; ver Sección 2.10, "Intel(R) AMX Clases de Excepción de Instrucción", para más detalles.
