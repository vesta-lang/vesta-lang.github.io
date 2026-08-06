---
summary: Bitwise Logical XOR de valores en coma flotante de precisión doble empaquetados
---

## Descripción

Realiza un bitwise lógico XOR de los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados del primer operando de origen y el segundo operando de origen, y almacena el resultado en el operando de destino.

EVEX.512 versión codificada: El primer operando de origen es un registro ZMM. El segundo operando de origen puede ser un registro ZMM o un vector ubicación de memoria. El operando de destino es un registro ZMM actualizado condicionalmente con máscara de escritura k1.

VEX.256 y EVEX.256 versiones codificadas: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM (actualmente actualizado con máscara de escritura k1 en caso de EVEX). Los bits superiores (MAXVL-1:256) del destino de registro ZMM correspondiente se ponen a cero.

VEX.128 y EVEX.128 versiones codificadas: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM (actualmente actualizado con máscara de escritura k1 en caso de EVEX). Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro correspondiente son sin modificar.

## Operación

```text
VXORPD (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b == 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := SRC1[i+63:i] BITWISE XOR SRC2[63:0];

                  ELSE DEST[i+63:i] := SRC1[i+63:i] BITWISE XOR SRC2[i+63:i];

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*              ; zeroing-masking

                    DEST[i+63:i] = 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VXORPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0] BITWISE XOR SRC2[63:0]
DEST[127:64] := SRC1[127:64] BITWISE XOR SRC2[127:64]
DEST[191:128] := SRC1[191:128] BITWISE XOR SRC2[191:128]
DEST[255:192] := SRC1[255:192] BITWISE XOR SRC2[255:192]
DEST[MAXVL-1:256] := 0

VXORPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] BITWISE XOR SRC2[63:0]
DEST[127:64] := SRC1[127:64] BITWISE XOR SRC2[127:64]
DEST[MAXVL-1:128] := 0

XORPD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] BITWISE XOR SRC[63:0]
DEST[127:64] := DEST[127:64] BITWISE XOR SRC[127:64]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VXORPD __m512d _mm512_xor_pd (__m512d a, __m512d b);
VXORPD __m512d _mm512_mask_xor_pd (__m512d a, __mmask8 m, __m512d b);
VXORPD __m512d _mm512_maskz_xor_pd (__mmask8 m, __m512d a);
VXORPD __m256d _mm256_xor_pd (__m256d a, __m256d b);
VXORPD __m256d _mm256_mask_xor_pd (__m256d a, __mmask8 m, __m256d b);
VXORPD __m256d _mm256_maskz_xor_pd (__mmask8 m, __m256d a);
XORPD __m128d _mm_xor_pd (__m128d a, __m128d b);
VXORPD __m128d _mm_mask_xor_pd (__m128d a, __mmask8 m, __m128d b);
VXORPD __m128d _mm_maskz_xor_pd (__mmask8 m, __m128d a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, véase Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase." Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E4 Condiciones de Excepción de Clase".
