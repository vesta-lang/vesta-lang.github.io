---
summary: Convertir dos datos únicos empaquetados en uno de los datos BF16 empaquetados
---

## Descripción

Convierte dos registros SIMD de datos individuales empaquetados en un solo registro de datos BF16 empaquetados.

Esta instrucción no apoya la supresión de la falla de memoria.

Esta instrucción utiliza el modo de redondeo "Round to nearby (even)". Los denormales de salida son siempre a cero y los denormales de entrada siempre se tratan como cero. MXCSR no es consultado ni actualizado. No se generan excepciones coma flotante.

## Operación

```text
VCVTNE2PS2BF16 dest, src1, src2
VL = (128, 256, 512)
KL = VL/16

origdest := dest
FOR i := 0 to KL-1:

    IF k1[ i ] or *no writemask*:
          IF i < KL/2:
                IF src2 is memory and evex.b == 1:
                    t := src2.fp32[0]
                ELSE:
                    t := src2.fp32[ i ]
          ELSE:
               t := src1.fp32[ i-KL/2]

// See VCVTNEPS2BF16 for definition of convert helper function
dest.word[i] := convert_fp32_to_bfloat16(t)

    ELSE IF *zeroing*:
         dest.word[ i ] := 0

    ELSE: // Merge masking, dest element unchanged
         dest.word[ i ] := origdest.word[ i ]

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCVTNE2PS2BF16 __m128bh _mm_cvtne2ps_pbh (__m128, __m128);
VCVTNE2PS2BF16 __m128bh _mm_mask_cvtne2ps_pbh (__m128bh, __mmask8, __m128, __m128);
VCVTNE2PS2BF16 __m128bh _mm_maskz_cvtne2ps_pbh (__mmask8, __m128, __m128);
VCVTNE2PS2BF16 __m256bh _mm256_cvtne2ps_pbh (__m256, __m256);
VCVTNE2PS2BF16 __m256bh _mm256_mask_cvtne2ps_pbh (__m256bh, __mmask16, __m256, __m256);
VCVTNE2PS2BF16 __m256bh _mm256_maskz_cvtne2ps_ pbh (__mmask16, __m256, __m256);
VCVTNE2PS2BF16 __m512bh _mm512_cvtne2ps_pbh (__m512, __m512);
VCVTNE2PS2BF16 __m512bh _mm512_mask_cvtne2ps_pbh (__m512bh, __mmask32, __m512, __m512);
VCVTNE2PS2BF16 __m512bh _mm512_maskz_cvtne2ps_pbh (__mmask32, __m512, __m512);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción".
