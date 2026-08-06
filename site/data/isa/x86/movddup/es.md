---
summary: Replicar valores en coma flotante de precisión doble
---

## Descripción

Para versiones 256-bit o superior: Duplica valores en coma flotante de precisión doble incluso indexado del operando de origen (el segundo operando) y en par adyacente y almacén al operando de destino (el primer operando).

Para versiones de 128 bits: Duplica el valor en coma flotante de precisión doble bajo del operando de origen (el segundo operando) y almacenar al operando de destino (el primer operando).

128-bit Legacy SSE versión: Los bits (MAXVL-1:128) del registro de destino correspondiente son invariables. El operando de origen es el registro XMM o una ubicación de memoria de 64 bits.

VEX.128 y EVEX.128 versión codificada: Bits (MAXVL-1:128) del registro de destino se ponen a cero. El operando de origen es el registro XMM o una ubicación de memoria de 64 bits. El destino se actualiza condicionalmente bajo la máscara de escritura para la versión EVEX.

VEX.256 y EVEX.256 versión codificada: Bits (MAXVL-1:256) del registro de destino se ponen a cero. El operando de origen es el registro YMM o una ubicación de memoria de 256 bits. El destino se actualiza condicionalmente bajo la máscara de escritura para la versión EVEX.

EVEX.512 versión codificada: El destino se actualiza según la máscara de escritura. El operando de origen es ZMM registro o una ubicación de memoria de 512 bits.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

```text
                            SRC          X3                  X2    X1           X0
```

```text
                            DEST         X2                  X2    X0           X0
```

Figura 4-2. Operación VMOVDDUP

## Operación

```text
VMOVDDUP (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

TMP_SRC[63:0] := SRC[63:0]

TMP_SRC[127:64] := SRC[63:0]

IF VL >= 256

     TMP_SRC[191:128] := SRC[191:128]

     TMP_SRC[255:192] := SRC[191:128]

FI;

IF VL >= 512

     TMP_SRC[319:256] := SRC[319:256]

     TMP_SRC[383:320] := SRC[319:256]

     TMP_SRC[477:384] := SRC[477:384]

     TMP_SRC[511:484] := SRC[477:384]

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_SRC[i+63:i]

          ELSE

                  IF *merging-masking*          ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                      ; zeroing-masking

                      DEST[i+63:i] := 0         ; zeroing-masking

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVDDUP (VEX.256 Encoded Version)
DEST[63:0] := SRC[63:0]
DEST[127:64] := SRC[63:0]
DEST[191:128] := SRC[191:128]
DEST[255:192] := SRC[191:128]
DEST[MAXVL-1:256] := 0

VMOVDDUP (VEX.128 Encoded Version)
DEST[63:0] := SRC[63:0]
DEST[127:64] := SRC[63:0]
DEST[MAXVL-1:128] := 0


MOVDDUP (128-bit Legacy SSE Version)
DEST[63:0] := SRC[63:0]
DEST[127:64] := SRC[63:0]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VMOVDDUP __m512d _mm512_movedup_pd( __m512d a);
VMOVDDUP __m512d _mm512_mask_movedup_pd(__m512d s, __mmask8 k, __m512d a);
VMOVDDUP __m512d _mm512_maskz_movedup_pd( __mmask8 k, __m512d a);
VMOVDDUP __m256d _mm256_mask_movedup_pd(__m256d s, __mmask8 k, __m256d a);
VMOVDDUP __m256d _mm256_maskz_movedup_pd( __mmask8 k, __m256d a);
VMOVDDUP __m128d _mm_mask_movedup_pd(__m128d s, __mmask8 k, __m128d a);
VMOVDDUP __m128d _mm_maskz_movedup_pd( __mmask8 k, __m128d a);
MOVDDUP __m256d _mm256_movedup_pd (__m256d a);
MOVDDUP __m128d _mm_movedup_pd (__m128d a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-54, "Tipo E5NF Clase Condiciones de Excepción."

Additionally:

```text
#UD               If EVEX.vvvv != 1111B or VEX.vvvv != 1111B.
```
