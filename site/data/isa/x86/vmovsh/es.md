---
summary: Mover escalar FP16 Valor
---

## Descripción

Esta instrucción mueve un valor FP16 a un registro o ubicación de memoria.

Las dos formas únicas de registro son alias y difieren sólo en donde se codifican sus operandos; esto es un efecto secundario de las codificaciones seleccionadas.

## Operación

```text
VMOVSH dest, src (two operand load)
IF k1[0] or no writemask:

    DEST.fp16[0] := SRC.fp16[0]
ELSE IF *zeroing*:

    DEST.fp16[0] := 0
// ELSE DEST.fp16[0] remains unchanged

DEST[MAXVL:16] := 0

VMOVSH dest, src (two operand store)
IF k1[0] or no writemask:

    DEST.fp16[0] := SRC.fp16[0]
// ELSE DEST.fp16[0] remains unchanged


VMOVSH dest, src1, src2 (three operand copy)
IF k1[0] or no writemask:

    DEST.fp16[0] := SRC2.fp16[0]
ELSE IF *zeroing*:

    DEST.fp16[0] := 0
// ELSE DEST.fp16[0] remains unchanged

DEST[127:16] := SRC1[127:16]
DEST[MAXVL:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VMOVSH __m128h _mm_load_sh (void const* mem_addr);
VMOVSH __m128h _mm_mask_load_sh (__m128h src, __mmask8 k, void const* mem_addr);
VMOVSH __m128h _mm_maskz_load_sh (__mmask8 k, void const* mem_addr);
VMOVSH __m128h _mm_mask_move_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VMOVSH __m128h _mm_maskz_move_sh (__mmask8 k, __m128h a, __m128h b);
VMOVSH __m128h _mm_move_sh (__m128h a, __m128h b);
VMOVSH void _mm_mask_store_sh (void * mem_addr, __mmask8 k, __m128h a);
VMOVSH void _mm_store_sh (void * mem_addr, __m128h a);
```

## SIMD coma flotante Excepciones

None

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-53, "Tipo E5 Clase Condiciones de Excepción."
