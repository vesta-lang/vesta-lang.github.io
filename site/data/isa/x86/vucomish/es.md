---
summary: Noordenado Compare escalar FP16 Valores y conjunto EFLAGS
---

## Descripción

Esta instrucción compara los valores FP16 en la palabra baja de operando 1 (primer operando) y operando 2 (segundo operando), y establece las banderas ZF, PF y CF en el registro EFLAGS de acuerdo con el resultado (sin orden, mayor que, menos o igual). Las banderas OF, SF y AF en el registro EFLAGS se fijan en 0. El resultado no deseado es devuelto si operando de origen es un NaN (QNaN o SNaN).

Operando 1 es un registro XMM; operando 2 puede ser un registro XMM o una ubicación de memoria de 16 bits.

La instrucción VUCOMISH difiere de la instrucción VCOMISH en que indica una excepción de operación inválida SIMD coma flotante (#I) sólo si un operando de origen es un SNaN. La instrucción COMISS indica una excepción numérica inválida cuando un operando de origen es un QNaN o SNaN.

El registro EFLAGS no se actualiza si se genera una excepción SIMD coma flotante sin máscara. EVEX.vvvv están reservados y deben ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
VUCOMISH
RESULT := UnorderedCompare(SRC1.fp16[0],SRC2.fp16[0])
if RESULT is UNORDERED:

    ZF, PF, CF := 1, 1, 1
else if RESULT is GREATER_THAN:

    ZF, PF, CF := 0, 0, 0
else if RESULT is LESS_THAN:

    ZF, PF, CF := 0, 0, 1
else: // RESULT is EQUALS

    ZF, PF, CF := 1, 0, 0

OF, AF, SF := 0, 0, 0
```

## Intel C/C++ compilador intrínseco

```c
VUCOMISH int _mm_ucomieq_sh (__m128h a, __m128h b);
VUCOMISH int _mm_ucomige_sh (__m128h a, __m128h b);
VUCOMISH int _mm_ucomigt_sh (__m128h a, __m128h b);
VUCOMISH int _mm_ucomile_sh (__m128h a, __m128h b);
VUCOMISH int _mm_ucomilt_sh (__m128h a, __m128h b);
VUCOMISH int _mm_ucomineq_sh (__m128h a, __m128h b);
```

## SIMD coma flotante Excepciones

Invalid, Denormal.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
