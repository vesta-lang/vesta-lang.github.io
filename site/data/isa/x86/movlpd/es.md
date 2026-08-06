---
summary: Move Low Packed valor en coma flotante de precisión doble
---

## Descripción

Esta instrucción no se puede utilizar para registrarse o memoria a movimientos de memoria.

Carga Legacy SSE de 128 bits:

Se mueve un valor en coma flotante de precisión doble de la fuente de 64 bits operando de memoria y lo almacena en los 64 bits bajos del registro de destino XMM. Se conservan los 64 bits superiores del registro XMM. Se conservan bits (MAXVL-1:128) del registro de destino correspondiente.

Carga codificada VEX.128 &amp; EVEX:

Carga un valor en coma flotante de precisión doble de la fuente 64-bit operando de memoria (tercer operando), lo fusiona con los 64-bits superiores de la primera fuente XMM registro (segundo operando), y lo almacena en los 128-bits bajos del destino XMM registro (primer operando). Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

128-bit store:

Almacena un valor en coma flotante de precisión doble desde los 64 bits bajos de la fuente de registro XMM (segundo operando) hasta la ubicación de memoria de 64 bits (primer operando).

Nota: VMOVLPD (store) (VEX.128.66.0F 13 /r) es legal y tiene el mismo comportamiento que la tienda existente 66 0F 13. Para VMOVLPD (store) VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucción de otra manera #UD.

Si VMOVLPD está codificado con VEX.L o EVEX.L'L= 1, un intento de ejecutar la instrucción codificada con VEX.L o EVEX.L'L= 1 causará una excepción #UD.

## Operación

```text
MOVLPD (128-bit Legacy SSE Load)
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] (Unmodified)


VMOVLPD (VEX.128 & EVEX Encoded Load)
DEST[63:0] := SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

VMOVLPD (Store)
DEST[63:0] := SRC[63:0]
```

## Intel C/C++ compilador intrínseco

```c
MOVLPD __m128d _mm_loadl_pd ( __m128d a, double *p) MOVLPD void _mm_storel_pd (double *p, __m128d a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción," adicionalmente:

```text
#UD               If VEX.L = 1.
```

Instrucciones codificadas por EVEX, ver Tabla 2-59, "Tipo E9NF Clase Condiciones de Excepción."
