---
summary: Compare escalar Ordenado FP16 Valores y Conjunto EFLAGS
---

## Descripción

Esta instrucción compara los valores FP16 en la palabra baja de operando 1 (primer operando) y operando 2 (segundo operando), y establece las banderas ZF, PF y CF en el registro EFLAGS de acuerdo con el resultado (sin orden, mayor que, menos o igual). Las banderas OF, SF y AF en el registro EFLAGS se fijan en 0. El resultado no deseado es devuelto si operando de origen es un NaN (QNaN o SNaN).

Operando 1 es un registro XMM; operando 2 puede ser un registro XMM o una ubicación de memoria de 16 bits.

La instrucción VCOMISH difiere de la instrucción VUCOMISH en que indica una excepción de operación inválida SIMD coma flotante (#I) cuando un operando de origen es un QNaN o SNaN. La instrucción VUCOMISH indica una excepción numérica inválida sólo si un operando de origen es un SNaN.

El registro EFLAGS no se actualiza si se genera una excepción SIMD coma flotante sin máscara. EVEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
VCOMISH SRC1, SRC2
RESULT := OrderedCompare(SRC1.fp16[0],SRC2.fp16[0])
IF RESULT is UNORDERED:

    ZF, PF, CF := 1, 1, 1
ELSE IF RESULT is GREATER_THAN:

    ZF, PF, CF := 0, 0, 0
ELSE IF RESULT is LESS_THAN:

    ZF, PF, CF := 0, 0, 1
ELSE: // RESULT is EQUALS

    ZF, PF, CF := 1, 0, 0

OF, AF, SF := 0, 0, 0
```

## Intel C/C++ compilador intrínseco

```c
VCOMISH int _mm_comi_round_sh (__m128h a, __m128h b, const int imm8, const int sae);
VCOMISH int _mm_comi_sh (__m128h a, __m128h b, const int imm8);
VCOMISH int _mm_comieq_sh (__m128h a, __m128h b);
VCOMISH int _mm_comige_sh (__m128h a, __m128h b);
VCOMISH int _mm_comigt_sh (__m128h a, __m128h b);
VCOMISH int _mm_comile_sh (__m128h a, __m128h b);
VCOMISH int _mm_comilt_sh (__m128h a, __m128h b);
VCOMISH int _mm_comineq_sh (__m128h a, __m128h b);
```

## SIMD coma flotante Excepciones

Invalid, Denormal.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
