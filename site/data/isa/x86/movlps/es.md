---
summary: Mover bajo valores en coma flotante de precisión simple empaquetados
---

## Descripción

Esta instrucción no se puede utilizar para registrarse o memoria a movimientos de memoria.

Carga Legacy SSE de 128 bits:

Mueva dos valores en coma flotante de precisión simple empaquetados de la fuente de 64 bits operando de memoria y los almacena en los 64 bits bajos del registro de destino XMM. Se conservan los 64 bits superiores del registro XMM. Se conservan bits (MAXVL-1:128) del registro de destino correspondiente.

Carga codificada VEX.128 &amp; EVEX:

Carga dos valores en coma flotante de precisión simple empaquetados de la fuente 64-bit operando de memoria (el tercer operando), los fusiona con los 64-bits superiores del primer operando de origen (el segundo operando), y los almacena en los 128-bits bajos del registro de destino (el primer operando). Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

128-bit store:

Carga dos valores en coma flotante de precisión simple empaquetados de los bajos 64 bits de la fuente de registro XMM (segundo operando) a los 64 bits ubicación de memoria (primer operando).

Nota: VMOVLPS (store) (VEX.128.0F 13 /r) es legal y tiene el mismo comportamiento que la tienda 0F 13 existente. Para VMOVLPS (store) VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucción de otra manera #UD.

Si VMOVLPS está codificado con VEX.L o EVEX.L'L= 1, un intento de ejecutar la instrucción codificada con VEX.L o EVEX.L'L= 1 causará una excepción #UD.

## Operación

```text
MOVLPS (128-bit Legacy SSE Load)
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] (Unmodified)


VMOVLPS (VEX.128 & EVEX Encoded Load)
DEST[63:0] := SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

VMOVLPS (Store)
DEST[63:0] := SRC[63:0]
```

## Intel C/C++ compilador intrínseco

```c
MOVLPS __m128 _mm_loadl_pi ( __m128 a, __m64 *p) MOVLPS void _mm_storel_pi (__m64 *p, __m128 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción," adicionalmente:

```text
#UD               If VEX.L = 1.
```

Instrucciones codificadas por EVEX, ver Tabla 2-59, "Tipo E9NF Clase Condiciones de Excepción."
