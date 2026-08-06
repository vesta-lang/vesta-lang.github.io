---
summary: Realizar la última ronda de un flujo de cifrado AES
---

## Descripción

Esta instrucción realiza la última ronda de un flujo de encriptación AES utilizando uno/dos/cuatro (dependiendo de la longitud vectorial) datos de 128 bits (estado) del primer operando de origen con uno/dos/cuatro (dependiendo de la longitud vectorial) redondo clave(s) del segundo operando de origen, y almacena el resultado en el operando de destino.

VEX y EVEX versiones codificadas de la instrucción permite 3-operando (no destructivo) operación. El legado versiones codificadas de la instrucción requiere que el primer operando de origen y el operando de destino sean los mismos y deben ser un registro XMM.

La forma codificada EVEX de esta instrucción no soporta la supresión de falla de memoria.

## Operación

```text
AESENCLAST
STATE := SRC1;
RoundKey := SRC2;
STATE := ShiftRows( STATE );
STATE := SubBytes( STATE );
DEST[127:0] := STATE XOR RoundKey;
DEST[MAXVL-1:128] (Unmodified)

VAESENCLAST (128b and 256b VEX Encoded Versions)
(KL, VL) = (1,128), (2,256)
FOR I=0 to KL-1:

    STATE := SRC1.xmm[i]
    RoundKey := SRC2.xmm[i]
    STATE := ShiftRows( STATE )
    STATE := SubBytes( STATE )
    DEST.xmm[i] := STATE XOR RoundKey
DEST[MAXVL-1:VL] := 0

VAESENCLAST (EVEX Encoded Version)
(KL,VL) = (1,128), (2,256), (4,512)
FOR i = 0 to KL-1:

    STATE := SRC1.xmm[i]
    RoundKey := SRC2.xmm[i]
    STATE := ShiftRows( STATE )
    STATE := SubBytes( STATE )
    DEST.xmm[i] := STATE XOR RoundKey
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
(V)AESENCLAST __m128i _mm_aesenclast (__m128i, __m128i) VAESENCLAST __m256i _mm256_aesenclast_epi128(__m256i, __m256i);
VAESENCLAST __m512i _mm512_aesenclast_epi128(__m512i, __m512i);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".

EVEX-encoded: Ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción".
