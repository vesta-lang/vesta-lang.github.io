---
summary: Unordered Compare valores en coma flotante de precisión simple escalares y Set EFLAGS
---

## Descripción

Compara los valores en coma flotante de precisión simple en las palabras dobles bajas de operando 1 (primer operando) y operando 2 (segundo operando), y establece las banderas ZF, PF y CF en el registro EFLAGS de acuerdo con el resultado (sin orden, mayor que, menos o igual). Las banderas OF, SF y AF en el registro EFLAGS se fijan en 0. El resultado no deseado es devuelto si operando de origen es un NaN (QNaN o SNaN).

Operando 1 es un registro XMM; operando 2 puede ser un registro XMM o una ubicación de memoria de 32 bits.

La instrucción UCOMISS difiere de la instrucción COMISS en que indica una excepción de operación inválida SIMD coma flotante (#I) sólo si un operando de origen es un SNaN. La instrucción COMISS indica una excepción de operación inválida cuando un operando de origen es un QNaN o SNaN.

El registro EFLAGS no se actualiza si se genera una excepción SIMD coma flotante sin máscara.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b, de lo contrario las instrucciones #UD.

El software debe asegurar que VCOMISS esté codificado con VEX.L=0. Codificar VCOMISS con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
(V)UCOMISS (All Versions)
RESULT := UnorderedCompare(DEST[31:0] <> SRC[31:0]) {
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
VUCOMISS     int _mm_comi_round_ss(__m128 a, __m128 b, int imm, int sae);
UCOMISS      int _mm_ucomieq_ss(__m128 a, __m128 b);
UCOMISS      int _mm_ucomilt_ss(__m128 a, __m128 b);
UCOMISS      int _mm_ucomile_ss(__m128 a, __m128 b);
UCOMISS  int _mm_ucomigt_ss(__m128 a, __m128 b);
UCOMISS  int _mm_ucomige_ss(__m128 a, __m128 b);
UCOMISS  int _mm_ucomineq_ss(__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

Inválido (si SNaN operandos), Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción," adicionalmente:

```text
#UD               If VEX.vvvv != 1111B.
```

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
