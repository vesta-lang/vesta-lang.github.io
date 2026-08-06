---
summary: Mover valores en coma flotante de precisión simple empaquetados Bajo a Alto
---

## Descripción

Esta instrucción no se puede utilizar para la memoria para registrar movimientos.

Forma de 128 bits de dos brazos:

Mueva dos valores en coma flotante de precisión simple empaquetados del bajo cuádpo del segundo argumento XMM (segundo operando) al alto cuádpo del primer registro XMM (primer argumento). El bajo cuádpo del operando de destino se deja sin cambios. Los bits (MAXVL-1:128) del registro de destino correspondiente son sin modificar.

128-bit tres-argument forms:

Mueva dos valores en coma flotante de precisión simple empaquetados del bajo cuádpago del tercer argumento XMM (tercer operando) al alto cuádpago del destino (primer operando). Copia el bajo cuádpago del segundo argumento XMM (segundo operando) al bajo cuádpago del destino (primer operando). Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

Si VMOVLHPS está codificado con VEX.L o EVEX.L'L= 1, un intento de ejecutar la instrucción codificada con VEX.L o EVEX.L'L= 1 causará una excepción #UD.

## Operación

```text
MOVLHPS (128-bit Two-Argument Form)
DEST[63:0] (Unmodified)
DEST[127:64] := SRC[63:0]
DEST[MAXVL-1:128] (Unmodified)

VMOVLHPS (128-bit Three-Argument Form - VEX & EVEX)
DEST[63:0] := SRC1[63:0]
DEST[127:64] := SRC2[63:0]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
MOVLHPS __m128 _mm_movelh_ps(__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

None.

1. ModRM.MOD = 011B required

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-24, "Tipo 7 Condiciones de Excepción," adicionalmente:

```text
#UD               If VEX.L = 1.
```

EVEX-encoded instruction, ver Excepciones Tipo E7NM.128 en la tabla 2-57, "Tipo E7NM Clase Condiciones de Excepción."
