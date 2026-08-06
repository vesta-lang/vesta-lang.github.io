---
summary: Configuración del nivel de almacenamiento
---

## Descripción

La instrucción STTILECFG lleva un puntero a una entrada ubicación de memoria de 64 bytes (descrita en la tabla 3-56 en la entrada "LDTI- LECFG--Configuración de azulejos de carga) que, después de la ejecución exitosa de esta instrucción, contendrá la descripción de los azulejos que fueron configurados. Para configurar los azulejos, se debe configurar el bit AMX TILE en CPUID y el sistema operativo debe haber habilitado la arquitectura de los azulejos.

Si los azulejos no están configurados, entonces STTILECFG almacena 64B de ceros al ubicación de memoria indicado.

Cualquier intento de ejecutar la instrucción STTILECFG dentro de una transacción Intel TSX resultará en un aborto de transacción.

## Operación

```text
STTILECFG mem
if TILES_CONFIGURED == 0:

    //write 64 bytes of zeros at mem pointer
    buf[0..63] := 0
    write_memory(mem, 64, buf)
else:
    buf.byte[0] := tilecfg.palette_id
    buf.byte[1] := tilecfg.start_row
    buf.byte[2..15] := 0

    p := 16
    for n in 0 ... palette_table[tilecfg.palette_id].max_names-1:

          buf.word[p/2] := tilecfg.t[n].colsb
          p := p + 2
    if p < 47:
          buf.byte[p..47] := 0
    p := 48
    for n in 0 ... palette_table[tilecfg.palette_id].max_names-1:
          buf.byte[p++] := tilecfg.t[n].rows
    if p < 63:
          buf.byte[p..63] := 0

    write_memory(mem, 64, buf)
```

## Intel C/C++ compilador intrínseco

```c
STTILECFGvoid _tile_storeconfig(void *);
```

## Banderas afectadas

None.

Excepciones AMX-E2; ver Sección 2.10, "Intel(R) AMX Clases de Excepción de Instrucción", para detalles.
