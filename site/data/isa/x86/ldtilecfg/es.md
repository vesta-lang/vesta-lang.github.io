---
summary: Configuración de líneas de carga
---

## Descripción

La instrucción LDTILECFG lleva un operando que contiene un puntero a una ubicación de memoria de 64 bytes que contiene la descripción de los azulejos a ser soportado. Para configurar los azulejos, se debe configurar el bit AMX TILE en CPUID y el sistema operativo debe haber habilitado la arquitectura de los azulejos.

El área de memoria contiene la paleta y describe cuántos azulejos se están utilizando y define cada baldosa en términos de filas y bytes de columna. Las solicitudes deben ser compatibles con las restricciones proporcionadas por CPUID; véase el cuadro 3-56 infra.

Byte(s) Field Name Table 3-56. Área de memoria Diseño 0 paleta Descripción 1 start row Palette selecciona la configuración soportada de los azulejos que se utilizarán. 2-15 reservados, debe ser cero start row se utiliza para almacenar los valores de reinicio para operaciones interrumpidas. 16-17 tile0.colsb 18-19 tile1.colsb Tile 0 bytes por fila. 20-21 tile2.colsb Tile 1 bytes per row. ...          (sequence continues) Azulejos 2 bytes por fila. 30-31 tile7.colsb 32-47 reservados, debe ser cero Azulejos 7 bytes por fila. 48 baldosas0.rows 49 tile1.rows Azulejos 0 filas. 50 baldosas 2.rows Azulejos 1 hileras. ...          (sequence continues) Tile 2 rows. 55 tile7.rows 56-63 reservados, debe ser cero Tile 7 rows.

Si una fila de azulejos y par de columna no se utiliza para especificar los parámetros de azulejos, deben tener el valor cero. Todas las fichas activadas (basadas en la paleta) deben configurarse. Parámetros de azulejos para más fichas que el límite de implementación o el límite de paleta resulta en una falla #GP.

Si el palette id es cero, que significa el estado INIT para TILECFG y TILEDATA. Azulejos se ponen a cero en el estado INIT. El único valor legal no-INIT para palette id es 1.

Cualquier intento de ejecutar la instrucción LDTILECFG dentro de una transacción Intel TSX resultará en un aborto de transacción.

## Operación

```text
LDTILECFG mem
error := False
buf := read_memory(mem, 64)
temp_tilecfg.palette_id := buf.byte[0]
if temp_tilecfg.palette_id > max_palette:

    error := True
if not xcr0_supports_palette(temp_tilecfg.palette_id):

    error := True
if temp_tilecfg.palette_id !=0:

    temp_tilecfg.start_row := buf.byte[1]
    if buf.byte[2..15] is nonzero:

          error := True
    p := 16
    # configure columns
    for n in 0 ... palette_table[temp_tilecfg.palette_id].max_names-1:

          temp_tilecfg.t[n].colsb:= buf.word[p/2]
          p := p + 2
          if temp_tilecfg.t[n].colsb > palette_table[temp_tilecfg.palette_id].bytes_per_row:

                error := True
    if nonzero(buf[p...47]):

          error := True

    # configure rows
    p := 48
    for n in 0 ... palette_table[temp_tilecfg.palette_id].max_names-1:

          temp_tilecfg.t[n].rows:= buf.byte[p]
          if temp_tilecfg.t[n].rows > palette_table[temp_tilecfg.palette_id].max_rows:

                error := True
          p := p + 1

    if nonzero(buf[p...63]):
          error := True

    # validate each tile's row & col configs are reasonable and enable the valid tiles
    for n in 0 ... palette_table[temp_tilecfg.palette_id].max_names-1:

          if temp_tilecfg.t[n].rows !=0 and temp_tilecfg.t[n].colsb != 0:
                temp_tilecfg.t[n].valid := 1

          elif temp_tilecfg.t[n].rows == 0 and temp_tilecfg.t[n].colsb == 0:
                temp_tilecfg.t[n].valid := 0

          else:
                error := True// one of rows or colsbwas 0 but not both.

if error:
    #GP

elif temp_tilecfg.palette_id == 0:
    TILES_CONFIGURED := 0// init state
    tilecfg := 0// equivalent to 64B of zeros
    zero_all_tile_data()

else:
    tilecfg := temp_tilecfg
    zero_all_tile_data()
    TILES_CONFIGURED := 1
```

## Intel C/C++ compilador intrínseco

```c
LDTILECFG void _tile_loadconfig(const void *);
```

## Banderas afectadas

None.

Excepciones AMX-E1; ver Sección 2.10, "Intel(R) AMX Clases de Excepción de Instrucción", para detalles.
