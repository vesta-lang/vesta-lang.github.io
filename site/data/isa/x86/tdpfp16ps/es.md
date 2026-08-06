---
summary: Dot Product of FP16 Azulejos Acumulado en Empaquetado Azulejo de Precisión
---

## Descripción

Esta instrucción realiza un conjunto de productos de puntos SIMD de dos elementos FP16 y acumula los resultados en una sola ficha de precisión. Cada elemento dword en las fichas de entrada tmm2 y tmm3 se interpreta como un par FP16. Para cada posible combinación de (row of tmm2, columna de tmm3), la instrucción realiza un conjunto de SIMD dot-products en todos los pares FP16 correspondientes (un par de tmm2 y un par de tmm3), añade los resultados de esos dot-products, y luego acumula el resultado en la fila y columna correspondiente de tmm1.

El modo de redondeo "Round to nearby even" se utiliza cuando se hace cada acumulación del Multiply-Add (FMA). Los denormales FP32 de salida siempre se desbordan a cero. La entrada FP16 denormales siempre se manejan y no se tratan como cero.

MXCSR no es consultado ni actualizado.

Cualquier intento de ejecutar la instrucción TDPFP16PS dentro de una transacción Intel TSX resultará en un aborto de transacción.

## Operación

```text
TDPFP16PS tsrcdest, tsrc1, tsrc2
// C = m x n (tsrcdest), A = m x k (tsrc1), B = k x n (tsrc2)

# src1 and src2 elements are pairs of fp16
elements_src1 := tsrc1.colsb / 4
elements_src2 := tsrc2.colsb / 4
elements_dest := tsrcdest.colsb / 4
elements_temp := tsrcdest.colsb / 2 // Count is in fp16 prior to horizontal

for m in 0 ... tsrcdest.rows-1:
    temp1[ 0 ... elements_temp-1 ] := 0
    for k in 0 ... elements_src1-1:
          for n in 0 ... elements_dest-1:

// For this operation:
// Handle FP16 denorms. Not forcing input FP16 denorms to 0.
// FP32 FMA with DAZ=FTZ=1, RNE rounding.
// MXCSR is neither consulted nor updated.
// No exceptions raised or denoted.

      temp1.fp32[2*n+0] += cvt_fp16_to_fp32(tsrc1.row[m].fp16[2*k+0]) *cvt_fp16_to_fp32(tsrc2.row[k].fp16[2*n+0])
      temp1.fp32[2*n+1] += cvt_fp16_to_fp32(tsrc1.row[m].fp16[2*k+1]) *cvt_fp16_to_fp32(tsrc2.row[k].fp16[2*n+1])

for n in 0 ... elements_dest-1:
      // DAZ=FTZ=1, RNE rounding.
      // MXCSR is neither consulted nor updated.


          // No exceptions raised or denoted.
          tmpf32 := temp1.fp32[2*n] + temp1.fp32[2*n+1]
          srcdest.row[m].fp32[n] := srcdest.row[m].fp32[n] + tmpf32
    write_row_and_zero(tsrcdest, m, tmp, tsrcdest.colsb)
zero_upper_rows(tsrcdest, tsrcdest.rows)
zero_tileconfig_start()
```

## Banderas afectadas

None.

Exceptions

AMX-E4; ver Sección 2.10, "Intel(R) AMX Clases de Excepción de Instrucción", para más detalles.
