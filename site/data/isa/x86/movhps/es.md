---
summary: Mover alta valores en coma flotante de precisión simple empaquetados
---

## Descripción

Esta instrucción no se puede utilizar para registrarse o memoria a movimientos de memoria.

Carga Legacy SSE de 128 bits:

Mueva dos valores en coma flotante de precisión simple empaquetados de la fuente de 64 bits operando de memoria y los almacena en los 64 bits altos del registro de destino XMM. Se conservan los 64 bits inferiores del registro XMM. Se conservan bits (MAXVL-1:128) del registro de destino correspondiente.

Carga codificada VEX.128 &amp; EVEX:

Carga dos valores en coma flotante de precisión simple de la fuente 64-bit operando de memoria (el tercer operando) y lo almacena en los 64-bits superiores del destino XMM registro (primero operando). Los bajos 64 bits del primer operando de origen (el segundo operando) se copian a los 64 bits inferiores del destino. Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

128-bit store:

Almacena dos valores en coma flotante de precisión simple empaquetados desde los 64 bits altos de la fuente de registro XMM (segundo operando) hasta la ubicación de memoria de 64 bits (primer operando).

Nota: VMOVHPS (store) (VEX.128.0F 17 /r) es legal y tiene el mismo comportamiento que la tienda 0F 17 existente. Para VMOVHPS (store) VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucción de otra manera #UD.

Si VMOVHPS está codificado con VEX.L o EVEX.L'L= 1, un intento de ejecutar la instrucción codificada con VEX.L o EVEX.L'L= 1 causará una excepción #UD.

## Operación

```text
MOVHPS (128-bit Legacy SSE Load)
DEST[63:0] (Unmodified)
DEST[127:64] := SRC[63:0]
DEST[MAXVL-1:128] (Unmodified)

VMOVHPS (VEX.128 and EVEX Encoded Load)
DEST[63:0] := SRC1[63:0]
DEST[127:64] := SRC2[63:0]
DEST[MAXVL-1:128] := 0

VMOVHPS (Store)
DEST[63:0] := SRC[127:64]
```

## Intel C/C++ compilador intrínseco

```c
MOVHPS __m128 _mm_loadh_pi ( __m128 a, __m64 *p) MOVHPS void _mm_storeh_pi (__m64 *p, __m128 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción," adicionalmente:

```text
#UD               If VEX.L = 1.
```

Instrucciones codificadas por EVEX, ver Tabla 2-59, "Tipo E9NF Clase Condiciones de Excepción."
