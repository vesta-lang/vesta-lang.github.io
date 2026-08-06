---
summary: Multiplicación de la matriz de los azulejos complejos
---

## Descripción

Estas instrucciones realizan la multiplicación de la matriz de dos baldosas que contienen elementos complejos y acumulan los resultados en una sola ficha de precisión empaquetada. Cada elemento dword en las baldosas de entrada tmm2 y tmm3 se interpreta como un número complejo con FP16 parte real y FP16 parte imaginaria.

TCMMRLFP16PS calcula la parte real del resultado. Para cada posible combinación de (row of tmm2, columna de tmm3), la instrucción realiza un conjunto de multiplicación y acumulaciones en todos los números complejos correspondientes (uno de tmm2 y uno de tmm3). La parte real del elemento tmm2 se multiplica con la parte real del elemento tmm3 correspondiente, y la parte imaginaria negada del elemento tmm2 se multiplica con la parte imaginaria de los elementos tmm3 correspondientes. Los dos resultados acumulados se agregan, y luego se acumulan en la fila y columna correspondiente de tmm1.

TCMMIMFP16PS calcula la parte imaginaria del resultado. Para cada posible combinación de (row of tmm2, columna de tmm3), la instrucción realiza un conjunto de multiplicación y acumulaciones en todos los números complejos correspondientes (uno de tmm2 y uno de tmm3). La parte imaginaria del elemento tmm2 se multiplica con la parte real del elemento tmm3 correspondiente, y la parte real del elemento tmm2 se multiplica con la parte imaginaria de los elementos tmm3 correspondientes. Los dos resultados acumulados se agregan, y luego se acumulan en la fila y columna correspondiente de tmm1.

El modo de redondeo "Round to nearby even" se utiliza cuando se hace cada acumulación del FMA. Los denormales de salida son siempre a cero pero los denormales de entrada FP16 no se tratan como cero.

MXCSR no es consultado ni actualizado.

Cualquier intento de ejecutar estas instrucciones dentro de una transacción Intel TSX resultará en un aborto de transacción.

## Operación

```text
TCMMIMFP16PS tsrcdest, tsrc1, tsrc2
// C = m x n (tsrcdest), A = m x k (tsrc1), B = k x n (tsrc2)

# src1 and src2 elements are pairs of fp16
elements_src1 := tsrc1.colsb / 4
elements_dest := tsrcdest.colsb / 4
elements_temp := tsrcdest.colsb / 2 // Count is in fp16 prior to horizontal

for m in 0 ... tsrcdest.rows-1:
    temp1[ 0 ... elements_temp-1] := 0
    for k in 0 ... elements_src1-1:
          for n in 0 ... elements_dest-1:


s1e = cvt_fp16_to_fp32(tsrc1.row[m].fp16[2*k+0])                 // real
s2e = cvt_fp16_to_fp32(tsrc2.row[k].fp16[2*n+0])                 // real
s1o = cvt_fp16_to_fp32(tsrc1.row[m].fp16[2*k+1])                 // imaginary
s2o = cvt_fp16_to_fp32(tsrc2.row[k].fp16[2*n+1])                 // imaginary

// FP32 FMA with DAZ=FTZ=1, RNE rounding.
// MXCSR is neither consulted nor updated.
// No exceptions raised or denoted.

temp1.fp32[2*n+0] = fma32(temp1.fp32[2*n+0], s1o, s2e, daz=1, ftz=1, sae=1, rc=RNE)
temp1.fp32[2*n+1] = fma32(temp1.fp32[2*n+1], s1e, s2o, daz=1, ftz=1, sae=1, rc=RNE)

for n in 0 ... elements_dest-1:
      // DAZ=FTZ=1, RNE rounding.
      // MXCSR is neither consulted nor updated.
      // No exceptions raised or denoted.
      tmpf32 := temp1.fp32[2*n] + temp1.fp32[2*n+1]
      srcdest.row[m].fp32[n] := srcdest.row[m].fp32[n] + tmpf32

write_row_and_zero(tsrcdest, m, tmp, tsrcdest.colsb)

zero_upper_rows(tsrcdest, tsrcdest.rows)
zero_tileconfig_start()

TCMMRLFP16PS tsrcdest, tsrc1, tsrc2
// C = m x n (tsrcdest), A = m x k (tsrc1), B = k x n (tsrc2)

# src1 and src2 elements are pairs of fp16
elements_src1 := tsrc1.colsb / 4
elements_dest := tsrcdest.colsb / 4
elements_temp := tsrcdest.colsb / 2 // Count is in fp16 prior to horizontal

for m in 0 ... tsrcdest.rows-1:
    temp1[ 0 ... elements_temp-1 ] := 0
    for k in 0 ... elements_src1-1:
          for n in 0 ... elements_dest-1:

s1e = cvt_fp16_to_fp32(tsrc1.row[m].fp16[2*k+0])                 // real
s2e = cvt_fp16_to_fp32(tsrc2.row[k].fp16[2*n+0])                 // real
s1o = cvt_fp16_to_fp32(-tsrc1.row[m].fp16[2*k+1])                // imaginary: "-" is for imaginary*imaginary
s2o = cvt_fp16_to_fp32(tsrc2.row[k].fp16[2*n+1])                 // imaginary

// FP32 FMA with DAZ=FTZ=1, RNE rounding.
// MXCSR is neither consulted nor updated.
// No exceptions raised or denoted.

temp1.fp32[2*n+0] = fma32(temp1.fp32[2*n+0], s1e, s2e, daz=1, ftz=1, sae=1, rc=RNE) // real
temp1.fp32[2*n+1] = fma32(temp1.fp32[2*n+1], s1o, s2o, daz=1, ftz=1, sae=1, rc=RNE) // imaginary

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

Excepciones AMX-E4; ver Sección 2.10, "Intel(R) AMX Clases de Excepción de Instrucción", para detalles.
