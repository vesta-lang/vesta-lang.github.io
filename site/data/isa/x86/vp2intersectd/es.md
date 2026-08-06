---
summary: Intersección de Computación entre DWORDS/QUADWORDS
---

## Descripción

Esta instrucción escribe un par de registros de máscaras. El destino de registro de máscaras indicado en el campo MODRM.REG se utiliza para formar la base del par de registro. La parte baja de ese campo está enmascarada (conjunto a cero) para crear el primer registro del par.

EVEX.aaa and EVEX.z must be zero.

## Operación

```text
VP2INTERSECTD destmask, src1, src2
(KL, VL) = (4, 128), (8, 256), (16, 512)

// dest_mask_reg_id is the register id specified in the instruction for destmask
dest_base := dest_mask_reg_id & ~1

// maskregs[ ] is an array representing the mask registers
maskregs[dest_base+0][MAX_KL-1:0] := 0
maskregs[dest_base+1][MAX_KL-1:0] := 0

FOR i := 0 to KL-1:
    FOR j := 0 to KL-1:
         match := (src1.dword[i] == src2.dword[j])
          maskregs[dest_base+0].bit[i] |= match
          maskregs[dest_base+1].bit[j] |= match

VP2INTERSECTQ destmask, src1, src2
(KL, VL) = (2, 128), (4, 256), (8, 512)

// dest_mask_reg_id is the register id specified in the instruction for destmask
dest_base := dest_mask_reg_id & ~1

// maskregs[ ] is an array representing the mask registers
maskregs[dest_base+0][MAX_KL-1:0] := 0
maskregs[dest_base+1][MAX_KL-1:0] := 0

FOR i = 0 to KL-1:
    FOR j = 0 to KL-1:
         match := (src1.qword[i] == src2.qword[j])
          maskregs[dest_base+0].bit[i] |= match
          maskregs[dest_base+1].bit[j] |= match
```

## Intel C/C++ compilador intrínseco

```c
VP2INTERSECTD void _mm_2intersect_epi32(__m128i, __m128i, __mmask8 *, __mmask8 *);
VP2INTERSECTD void _mm256_2intersect_epi32(__m256i, __m256i, __mmask8 *, __mmask8 *);
VP2INTERSECTD void _mm512_2intersect_epi32(__m512i, __m512i, __mmask16 *, __mmask16 *);
VP2INTERSECTQ void _mm_2intersect_epi64(__m128i, __m128i, __mmask8 *, __mmask8 *);
VP2INTERSECTQ void _mm256_2intersect_epi64(__m256i, __m256i, __mmask8 *, __mmask8 *);
VP2INTERSECTQ void _mm512_2intersect_epi64(__m512i, __m512i, __mmask8 *, __mmask8 *);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción".
