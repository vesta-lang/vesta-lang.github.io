---
summary: Compare escalar Ordenado valores en coma flotante de precisión simple y Set EFLAGS
---

## Descripción

Compara los valores en coma flotante de precisión simple en las cuádwords bajas de operando 1 (primer operando) y operando 2 (segundo operando), y establece las banderas ZF, PF y CF en el registro EFLAGS de acuerdo con el resultado (sin orden, mayor que, menos o igual). Las banderas OF, SF y AF en el registro EFLAGS se fijan en 0. El resultado no deseado es devuelto si operando de origen es un NaN (QNaN o SNaN).

Operando 1 es un registro XMM; operando 2 puede ser un registro XMM o una ubicación de memoria de 32 bits.

La instrucción COMISS difiere de la instrucción UCOMISS en que indica una excepción de operación inválida SIMD coma flotante (#I) cuando un operando de origen es un QNaN o SNaN. La instrucción UCOMISS indica una excepción de operación inválida sólo si un operando de origen es un SNaN.

El registro EFLAGS no se actualiza si se genera una excepción SIMD coma flotante sin máscara.

VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b, de lo contrario las instrucciones #UD.

El software debe asegurar que VCOMISS esté codificado con VEX.L=0. Codificar VCOMISS con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
COMISS (All Versions)
RESULT :=OrderedCompare(DEST[31:0] <> SRC[31:0]) {
(* Set EFLAGS *) CASE (RESULT) OF

    UNORDERED: ZF,PF,CF := 111;
    GREATER_THAN: ZF,PF,CF := 000;
    LESS_THAN: ZF,PF,CF := 001;
    EQUAL: ZF,PF,CF := 100;
ESAC;
OF, AF, SF := 0; }
```

## Intel C/C++ compilador intrínseco

```c
VCOMISS int _mm_comi_round_ss(__m128 a, __m128 b, int imm, int sae);
VCOMISS int _mm_comieq_ss (__m128 a, __m128 b) VCOMISS int _mm_comilt_ss (__m128 a, __m128 b) VCOMISS int _mm_comile_ss (__m128 a, __m128 b) VCOMISS int _mm_comigt_ss (__m128 a, __m128 b) VCOMISS int _mm_comige_ss (__m128 a, __m128 b) VCOMISS int _mm_comineq_ss (__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

Inválido (si SNaN o QNaN operandos), Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."

Additionally:

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```
