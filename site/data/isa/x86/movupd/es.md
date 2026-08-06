---
summary: Mover valores en coma flotante de precisión doble empaquetados
---

## Descripción

Nota: VEX.vvvv y EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

EVEX.512 versión codificada:

Mueva 512 bits de valores en coma flotante de precisión doble empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro ZMM de un flotador64 ubicación de memoria, para almacenar el contenido de un registro ZMM en una memoria. El operando de destino se actualiza según la máscara de escritura.

VEX.256 versión codificada:

Mueva 256 bits de valores en coma flotante de precisión doble empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro YMM de 256 bits ubicación de memoria, para almacenar el contenido de un registro YMM en una ubicación de memoria de 256 bits, o para mover datos entre dos registros YMM. Bits (MAXVL-1:256) del registro de destino se ponen a cero.

128-bit versions:

Mueva 128 bits de valores en coma flotante de precisión doble empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro XMM de 128 bits ubicación de memoria, para almacenar el contenido de un registro XMM en una ubicación de memoria de 128 bits, o para mover datos entre dos registros XMM.

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del registro de destino correspondiente no se modifican.

Cuando la fuente o operando de destino es un operando de memoria, el operando puede ser sin instrucción en un límite de 16 bytes sin causar que una excepción de protección general (#GP) se genere

VEX.128 y EVEX.128 versiones codificadas: Bits (MAXVL-1:128) del registro de destino se ponen a cero.

## Operación

```text
VMOVUPD (EVEX Encoded Versions, Register-Copy Form)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[i+63:i]

     ELSE

             IF *merging-masking*        ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE DEST[i+63:i] := 0  ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVUPD (EVEX Encoded Versions, Store-Form)      ; merging-masking
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := SRC[i+63:i]
          ELSE *DEST[i+63:i] remains unchanged*

    FI;
ENDFOR;


VMOVUPD (EVEX Encoded Versions, Load-Form)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[i+63:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE DEST[i+63:i] := 0     ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVUPD (VEX.256 Encoded Version, Load - and Register Copy)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0

VMOVUPD (VEX.256 Encoded Version, Store-Form)
DEST[255:0] := SRC[255:0]

VMOVUPD (VEX.128 Encoded Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] := 0

MOVUPD (128-bit Load- and Register-Copy- Form Legacy SSE Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] (Unmodified)

(V)MOVUPD (128-bit Store-Form Version)
DEST[127:0] := SRC[127:0]
```

## Intel C/C++ compilador intrínseco

```c
VMOVUPD __m512d _mm512_loadu_pd( void * s);
VMOVUPD __m512d _mm512_mask_loadu_pd(__m512d a, __mmask8 k, void * s);
VMOVUPD __m512d _mm512_maskz_loadu_pd( __mmask8 k, void * s);
VMOVUPD void _mm512_storeu_pd( void * d, __m512d a);
VMOVUPD void _mm512_mask_storeu_pd( void * d, __mmask8 k, __m512d a);
VMOVUPD __m256d _mm256_mask_loadu_pd(__m256d s, __mmask8 k, void * m);
VMOVUPD __m256d _mm256_maskz_loadu_pd( __mmask8 k, void * m);
VMOVUPD void _mm256_mask_storeu_pd( void * d, __mmask8 k, __m256d a);
VMOVUPD __m128d _mm_mask_loadu_pd(__m128d s, __mmask8 k, void * m);
VMOVUPD __m128d _mm_maskz_loadu_pd( __mmask8 k, void * m);
VMOVUPD void _mm_mask_storeu_pd( void * d, __mmask8 k, __m128d a);
MOVUPD __m256d _mm256_loadu_pd (double * p);
MOVUPD void _mm256_storeu_pd( double *p, __m256d a);
MOVUPD __m128d _mm_loadu_pd (double * p);
MOVUPD void _mm_storeu_pd( double *p, __m128d a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Nota de tratamiento de #AC varía; además:

```text
#UD               If VEX.vvvv != 1111B.
```

Instrucciones de código EVEX, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
