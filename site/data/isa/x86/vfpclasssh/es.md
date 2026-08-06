---
summary: Tipos de prueba de los valores escalar FP16
---

## Descripción

Esta instrucción comprueba el bajo valor FP16 en el operando de origen para categorías especiales, especificado por los bits de conjunto en el byte imm8. Cada bit establecido en imm8 especifica una categoría de valores en coma flotante que el elemento de datos de entrada se clasifica en contra; véase Tabla 5-12 para las categorías. Los resultados clasificados de todas las categorías especificadas de un valor de entrada se ORed juntos para formar el resultado booleano final para el elemento de entrada. El resultado está escrito a la parte baja del registro de máscaras de destino según la máscara de escritura. Los otros bits en la máscara de destino registran se ponen a cero.

## Operación

```text
// see VFPCLASSPH

VFPCLASSSH dest{k2}, src, imm8
IF k2[0] or *no writemask*:

    DEST.bit[0] := check_fp_class_fp16(src.fp16[0], imm8)
ELSE:

    DEST.bit[0] := 0

DEST[MAXKL-1:1] := 0
```

## Intel C/C++ compilador intrínseco

```c
VFPCLASSSH __mmask8 _mm_fpclass_sh_mask (__m128h a, int imm8);
VFPCLASSSH __mmask8 _mm_mask_fpclass_sh_mask (__mmask8 k1, __m128h a, int imm8);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-60, "Tipo E10 Clase Condiciones de Excepción."
