---
summary: Mover valores en coma flotante de precisión simple empaquetados Alto a Bajo
---

## Descripción

Esta instrucción no se puede utilizar para la memoria para registrar movimientos.

Forma de 128 bits de dos brazos:

Mueva dos valores en coma flotante de precisión simple empaquetados del alto cuádpago del segundo argumento XMM (segundo operando) al bajo cuádpago del primer registro XMM (primer argumento). El quadword en bits 127:64 del operando de destino se deja sin cambios. Bits (MAXVL-1:128) del registro de destino correspondiente no se modifican.

128-bit y EVEX forma de tres brazos:

Mueva dos valores en coma flotante de precisión simple empaquetados del alto cuádpago del tercer argumento XMM (tercer operando) al bajo cuádpago del destino (primer operando). Copie el alto cuadword del segundo argumento XMM (segundo operando) al alto cuadword del destino (primer operando). Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

Si VMOVHLPS está codificado con VEX.L o EVEX.L'L= 1, un intento de ejecutar la instrucción codificada con VEX.L o EVEX.L'L= 1 causará una excepción #UD.

## Operación

```text
MOVHLPS (128-bit Two-Argument Form)
DEST[63:0] := SRC[127:64]
DEST[MAXVL-1:64] (Unmodified)

VMOVHLPS (128-bit Three-Argument Form - VEX & EVEX)
DEST[63:0] := SRC2[127:64]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
MOVHLPS __m128 _mm_movehl_ps(__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

None.

1. ModRM.MOD = 011B required.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-24, "Tipo 7 Condiciones de Excepción," adicionalmente:

```text
#UD               If VEX.L = 1.
```

EVEX-encoded instruction, ver Excepciones Tipo E7NM.128 en la tabla 2-57, "Tipo E7NM Clase Condiciones de Excepción."
