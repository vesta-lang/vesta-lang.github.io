---
summary: Producto de puntos de los bytes firmados/Unsigned con Dword
---

## Descripción

Para cada posible combinación de (row of tmm2, columna de tmm3), la instrucción realiza un conjunto de productos de puntos SIMD en los cuatro elementos de byte correspondientes, uno de tmm2 y uno de tmm3, agrega los resultados de esos dotproducts, y luego acumula el resultado en la fila y columna correspondiente de tmm1. Cada dword en las fichas de entrada tmm2 y tmm3 se interpreta como cuatro elementos byte. Estos pueden ser firmados o no firmados. Cada carta en el patrón de dos letras SU, EE.UU., SS, UU indica la naturaleza firmada / no firmada de los valores en tmm2 y tmm3, respectivamente.

Cualquier intento de ejecutar las instrucciones TDPBSSD/TDPBSUD/TDPBUSD/TDPBUUD dentro de una transacción Intel TSX dará lugar a un aborto de transacción.

## Operación

```text
define DPBD(c,x,y):// arguments are dwords

    if *x operand is signed*:
          extend_src1 := SIGN_EXTEND

    else:
          extend_src1 := ZERO_EXTEND

    if *y operand is signed*:
          extend_src2 := SIGN_EXTEND

    else:
          extend_src2 := ZERO_EXTEND

    p0dword := extend_src1(x.byte[0]) * extend_src2(y.byte[0])
    p1dword := extend_src1(x.byte[1]) * extend_src2(y.byte[1])
    p2dword := extend_src1(x.byte[2]) * extend_src2(y.byte[2])
    p3dword := extend_src1(x.byte[3]) * extend_src2(y.byte[3])

    c := c + p0dword + p1dword + p2dword + p3dword


TDPBSSD, TDPBSUD, TDPBUSD, TDPBUUD tsrcdest, tsrc1, tsrc2 (Register Only Version)
// C = m x n (tsrcdest), A = m x k (tsrc1), B = k x n (tsrc2)

tsrc1_elements_per_row := tsrc1.colsb / 4
tsrc2_elements_per_row := tsrc2.colsb / 4
tsrcdest_elements_per_row := tsrcdest.colsb / 4

for m in 0 ... tsrcdest.rows-1:
    tmp := tsrcdest.row[m]
    for k in 0 ... tsrc1_elements_per_row-1:
          for n in 0 ... tsrcdest_elements_per_row-1:
                DPBD( tmp.dword[n], tsrc1.row[m].dword[k], tsrc2.row[k].dword[n] )
    write_row_and_zero(tsrcdest, m, tmp, tsrcdest.colsb)

zero_upper_rows(tsrcdest, tsrcdest.rows)
zero_tilecfg_start()
```

## Intel C/C++ compilador intrínseco

```c
TDPBSSD void _tile_dpbssd(__tile dst, __tile src1, __tile src2);
TDPBSUD void _tile_dpbsud(__tile dst, __tile src1, __tile src2);
TDPBUSD void _tile_dpbusd(__tile dst, __tile src1, __tile src2);
TDPBUUD void _tile_dpbuud(__tile dst, __tile src1, __tile src2);
```

## Banderas afectadas

None.

Excepciones AMX-E4; ver Sección 2.10, "Intel(R) AMX Clases de Excepción de Instrucción", para detalles.
