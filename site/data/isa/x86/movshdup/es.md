---
summary: Replicar valores en coma flotante de precisión simple
---

## Descripción

Duplica valores en coma flotante de precisión simple del operando de origen (el segundo operando) al par de elementos adyacentes en el operando de destino (el primer operando). Véase la Figura 4-3. El operando de origen es un registro XMM, YMM o ZMM o 128, 256 o 512-bit ubicación de memoria y el operando de destino es un registro XMM, YMM o ZMM.

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del registro de destino correspondiente no se modifican.

VEX.128 versión codificada: Bits (MAXVL-1:128) del registro de destino se ponen a cero.

VEX.256 versión codificada: Bits (MAXVL-1:256) del registro de destino se ponen a cero.

EVEX versión codificada: El operando de destino se actualiza en granularidad de 32 bits según la máscara de escritura.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

```text
                         SRC  X7     X6                     X5        X4    X3       X2  X1             X0
```

```text
             DEST X7                 X7                     X5        X5    X3       X3  X1             X1
```

Figura 4-3. Operación MOVSHDUP

## Operación

```text
VMOVSHDUP (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

TMP_SRC[31:0] := SRC[63:32]

TMP_SRC[63:32] := SRC[63:32]

TMP_SRC[95:64] := SRC[127:96]

TMP_SRC[127:96] := SRC[127:96]

IF VL >= 256

     TMP_SRC[159:128] := SRC[191:160]

     TMP_SRC[191:160] := SRC[191:160]

     TMP_SRC[223:192] := SRC[255:224]

     TMP_SRC[255:224] := SRC[255:224]

FI;

IF VL >= 512

     TMP_SRC[287:256] := SRC[319:288]

     TMP_SRC[319:288] := SRC[319:288]

     TMP_SRC[351:320] := SRC[383:352]

     TMP_SRC[383:352] := SRC[383:352]

     TMP_SRC[415:384] := SRC[447:416]

     TMP_SRC[447:416] := SRC[447:416]

     TMP_SRC[479:448] := SRC[511:480]

     TMP_SRC[511:480] := SRC[511:480]

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_SRC[i+31:i]

          ELSE

                  IF *merging-masking*          ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                      ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VMOVSHDUP (VEX.256 Encoded Version)
DEST[31:0] := SRC[63:32]
DEST[63:32] := SRC[63:32]
DEST[95:64] := SRC[127:96]
DEST[127:96] := SRC[127:96]
DEST[159:128] := SRC[191:160]
DEST[191:160] := SRC[191:160]
DEST[223:192] := SRC[255:224]
DEST[255:224] := SRC[255:224]
DEST[MAXVL-1:256] := 0

VMOVSHDUP (VEX.128 Encoded Version)
DEST[31:0] := SRC[63:32]
DEST[63:32] := SRC[63:32]
DEST[95:64] := SRC[127:96]
DEST[127:96] := SRC[127:96]
DEST[MAXVL-1:128] := 0
MOVSHDUP (128-bit Legacy SSE Version)
DEST[31:0] := SRC[63:32]
DEST[63:32] := SRC[63:32]
DEST[95:64] := SRC[127:96]
DEST[127:96] := SRC[127:96]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VMOVSHDUP __m512 _mm512_movehdup_ps( __m512 a);
VMOVSHDUP __m512 _mm512_mask_movehdup_ps(__m512 s, __mmask16 k, __m512 a);
VMOVSHDUP __m512 _mm512_maskz_movehdup_ps( __mmask16 k, __m512 a);
VMOVSHDUP __m256 _mm256_mask_movehdup_ps(__m256 s, __mmask8 k, __m256 a);
VMOVSHDUP __m256 _mm256_maskz_movehdup_ps( __mmask8 k, __m256 a);
VMOVSHDUP __m128 _mm_mask_movehdup_ps(__m128 s, __mmask8 k, __m128 a);
VMOVSHDUP __m128 _mm_maskz_movehdup_ps( __mmask8 k, __m128 a);
VMOVSHDUP __m256 _mm256_movehdup_ps (__m256 a);
VMOVSHDUP __m128 _mm_movehdup_ps (__m128 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

EVEX-encoded instruction, ver Excepciones Tipo E4NF.nb en la tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."

Additionally:

```text
#UD               If EVEX.vvvv != 1111B or VEX.vvvv != 1111B.
```
