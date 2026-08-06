---
summary: Broadcast Mask to Vector Register
---

## Descripción

Transmite el valor de 64/32 bits de cero del byte/palabra bajo del operando de origen (el segundo operando) a cada elemento de 64/32 bits del operando de destino (el primer operando). El operando de origen es un registro de opmasco. El operando de destino es un registro ZMM (EVEX.512), registro YMM (EVEX.256), o registro XMM (EVEX.128).

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VPBROADCASTMB2Q
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j*64
    DEST[i+63:i] := ZeroExtend(SRC[7:0])
ENDFOR
DEST[MAXVL-1:VL] := 0


VPBROADCASTMW2D
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j*32
    DEST[i+31:i] := ZeroExtend(SRC[15:0])
ENDFOR
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPBROADCASTMB2Q __m512i _mm512_broadcastmb_epi64( __mmask8);
VPBROADCASTMW2D __m512i _mm512_broadcastmw_epi32( __mmask16);
VPBROADCASTMB2Q __m256i _mm256_broadcastmb_epi64( __mmask8);
VPBROADCASTMW2D __m256i _mm256_broadcastmw_epi32( __mmask8);
VPBROADCASTMB2Q __m128i _mm_broadcastmb_epi64( __mmask8);
VPBROADCASTMW2D __m128i _mm_broadcastmw_epi32( __mmask8);
```

## SIMD coma flotante Excepciones

None

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-56, "Tipo E6NF Clase Condiciones de Excepción."
