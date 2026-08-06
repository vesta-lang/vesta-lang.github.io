---
summary: Realizar una ronda de un flujo de descifrado AES
---

## Descripción

Esta instrucción realiza una sola ronda del flujo de descifrado AES utilizando el Cipher Inverso Equivalente, utilizando uno/dos/cuatro (dependiendo de la longitud vectorial) datos de 128 bits (estado) del primer operando de origen con uno/dos/cuatro (dependiendo de la longitud vectorial) ronda clave(s) del segundo operando de origen, y almacena el resultado en el operando de destino.

Utilice la instrucción AESDEC para todos menos la última ronda de desciframiento. Para la última ronda de descifrado, utilice la instrucción AESDE- CLAST.

VEX y EVEX versiones codificadas de la instrucción permiten la operación 3-operando (no destructiva). El legado versiones codificadas de la instrucción requiere que el primer operando de origen y el operando de destino sean los mismos y deben ser un registro XMM.

La forma codificada EVEX de esta instrucción no soporta la supresión de falla de memoria.

## Operación

```text
AESDEC
STATE := SRC1;
RoundKey := SRC2;
STATE := InvShiftRows( STATE );
STATE := InvSubBytes( STATE );
STATE := InvMixColumns( STATE );
DEST[127:0] := STATE XOR RoundKey;
DEST[MAXVL-1:128] (Unmodified)

VAESDEC (128b and 256b VEX Encoded Versions)
(KL,VL) = (1,128), (2,256)
FOR i = 0 to KL-1:

    STATE := SRC1.xmm[i]
    RoundKey := SRC2.xmm[i]
    STATE := InvShiftRows( STATE )
    STATE := InvSubBytes( STATE )
    STATE := InvMixColumns( STATE )
    DEST.xmm[i] := STATE XOR RoundKey
DEST[MAXVL-1:VL] := 0

VAESDEC (EVEX Encoded Version)
(KL,VL) = (1,128), (2,256), (4,512)
FOR i = 0 to KL-1:

    STATE := SRC1.xmm[i]
    RoundKey := SRC2.xmm[i]
    STATE := InvShiftRows( STATE )
    STATE := InvSubBytes( STATE )
    STATE := InvMixColumns( STATE )
    DEST.xmm[i] := STATE XOR RoundKey
DEST[MAXVL-1:VL] :=0
```

## Intel C/C++ compilador intrínseco

```c
(V)AESDEC __m128i _mm_aesdec (__m128i, __m128i) VAESDEC __m256i _mm256_aesdec_epi128(__m256i, __m256i);
VAESDEC __m512i _mm512_aesdec_epi128(__m512i, __m512i);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".

EVEX-encoded: Ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción".
