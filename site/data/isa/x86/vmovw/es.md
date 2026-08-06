---
summary: Mover palabra
---

## Descripción

Esta instrucción, bien (a) copia un elemento palabra de un registro XMM a un registro de proposito general o ubicación de memoria o (b) copia un elemento palabra de un registro de proposito general o ubicación de memoria a un registro XMM. Al escribir un registro de proposito general, los 16 bits inferiores del registro contendrán el valor de palabra. Las partes superiores del registro de proposito general están escritas con ceros.

## Operación

```text
VMOVW dest, src (two operand load)
DEST.word[0] := SRC.word[0]
DEST[MAXVL:16] := 0

VMOVW dest, src (two operand store)
DEST.word[0] := SRC.word[0]
// upper bits of GPR DEST are zeroed
```

## Intel C/C++ compilador intrínseco

```c
VMOVW short _mm_cvtsi128_si16 (__m128i a);
VMOVW __m128i _mm_cvtsi16_si128 (short a);
```

## SIMD coma flotante Excepciones

None

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-59, "Tipo E9NF Clase Condiciones de Excepción."
