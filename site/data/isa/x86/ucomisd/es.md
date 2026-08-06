---
summary: Unordered Compare valores en coma flotante de precisión doble escalares y Set EFLAGS
---

## Descripción

Realiza una comparación sin orden de los valores en coma flotante de precisión doble en los cuádpagos bajos de operando 1 (primer operando) y operando 2 (segundo operando), y establece las banderas ZF, PF y CF en el registro EFLAGS de acuerdo con el resultado (noordenado, mayor que, menor o igual). Las banderas OF, SF y AF en el registro EFLAGS se fijan en 0. El resultado no deseado es devuelto si operando de origen es un NaN (QNaN o SNaN).

Operand 1 is an XMM register; operand 2 can be an XMM register or a 64 bit memory

location.

La instrucción UCOMISD difiere de la instrucción COMISD en que indica una excepción de operación inválida SIMD coma flotante (#I) sólo cuando un operando de origen es un SNaN. La instrucción COMISD indica una excepción de operación inválida sólo si un operando de origen es un SNaN o un QNaN.

El registro EFLAGS no se actualiza si se genera una excepción SIMD coma flotante sin máscara.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b, de lo contrario las instrucciones #UD.

El software debe asegurar que VCOMISD esté codificado con VEX.L=0. Codificar VCOMISD con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
(V)UCOMISD (All Versions)
RESULT := UnorderedCompare(DEST[63:0] <> SRC[63:0]) {
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
VUCOMISD int _mm_comi_round_sd(__m128d a, __m128d b, int imm, int sae);
UCOMISD int _mm_ucomieq_sd(__m128d a, __m128d b) UCOMISD int _mm_ucomilt_sd(__m128d a, __m128d b) UCOMISD int _mm_ucomile_sd(__m128d a, __m128d b) UCOMISD int _mm_ucomigt_sd(__m128d a, __m128d b) UCOMISD int _mm_ucomige_sd(__m128d a, __m128d b) UCOMISD int _mm_ucomineq_sd(__m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

Inválido (si SNaN operandos), Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción," adicionalmente:

```text
#UD               If VEX.vvvv != 1111B.
```

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
