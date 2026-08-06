---
summary: Mover valores en coma flotante de precisión simple empaquetados
---

## Descripción

Nota: VEX.vvvv y EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

EVEX.512 versión codificada:

Mueva 512 bits de valores en coma flotante de precisión simple empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro ZMM de un flotador de 512 bits32 ubicación de memoria, para almacenar el contenido de un registro ZMM en memoria. El operando de destino se actualiza según la máscara de escritura.

VEX.256 y EVEX.256 versiones codificadas:

Mueva 256 bits de valores en coma flotante de precisión simple empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro YMM de 256 bits ubicación de memoria, para almacenar el contenido de un registro YMM en una ubicación de memoria de 256 bits, o para mover datos entre dos registros YMM. Bits (MAXVL-1:256) del registro de destino se ponen a cero.

128-bit versions:

Mueva 128 bits de valores en coma flotante de precisión simple empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro XMM de 128 bits ubicación de memoria, para almacenar el contenido de un registro XMM en una ubicación de memoria de 128 bits, o para mover datos entre dos registros XMM.

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del registro de destino correspondiente no se modifican.

Cuando la fuente o operando de destino es un operando de memoria, el operando puede ser sin instrucción sin causar una excepción de protección general (#GP) para ser generado.

VEX.128 y EVEX.128 versiones codificadas: Bits (MAXVL-1:128) del registro de destino se ponen a cero.

## Operación

```text
VMOVUPS (EVEX Encoded Versions, Register-Copy Form)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[i+31:i]

     ELSE

             IF *merging-masking*         ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE DEST[i+31:i] := 0   ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVUPS (EVEX Encoded Versions, Store-Form)      ; merging-masking
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := SRC[i+31:i]
          ELSE *DEST[i+31:i] remains unchanged*
    FI;
ENDFOR;


VMOVUPS (EVEX Encoded Versions, Load-Form)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[i+31:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE DEST[i+31:i] := 0     ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVUPS (VEX.256 Encoded Version, Load - and Register Copy)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0

VMOVUPS (VEX.256 Encoded Version, Store-Form)
DEST[255:0] := SRC[255:0]

VMOVUPS (VEX.128 Encoded Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] := 0

MOVUPS (128-bit Load- and Register-Copy- Form Legacy SSE Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] (Unmodified)

(V)MOVUPS (128-bit Store-Form Version)
DEST[127:0] := SRC[127:0]
```

## Intel C/C++ compilador intrínseco

```c
VMOVUPS __m512 _mm512_loadu_ps( void * s);
VMOVUPS __m512 _mm512_mask_loadu_ps(__m512 a, __mmask16 k, void * s);
VMOVUPS __m512 _mm512_maskz_loadu_ps( __mmask16 k, void * s);
VMOVUPS void _mm512_storeu_ps( void * d, __m512 a);
VMOVUPS void _mm512_mask_storeu_ps( void * d, __mmask8 k, __m512 a);
VMOVUPS __m256 _mm256_mask_loadu_ps(__m256 a, __mmask8 k, void * s);
VMOVUPS __m256 _mm256_maskz_loadu_ps( __mmask8 k, void * s);
VMOVUPS void _mm256_mask_storeu_ps( void * d, __mmask8 k, __m256 a);
VMOVUPS __m128 _mm_mask_loadu_ps(__m128 a, __mmask8 k, void * s);
VMOVUPS __m128 _mm_maskz_loadu_ps( __mmask8 k, void * s);
VMOVUPS void _mm_mask_storeu_ps( void * d, __mmask8 k, __m128 a);
MOVUPS __m256 _mm256_loadu_ps ( float * p);
MOVUPS void _mm256 _storeu_ps( float *p, __m256 a);
MOVUPS __m128 _mm_loadu_ps ( float * p);
MOVUPS void _mm_storeu_ps( float *p, __m128 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Nota el tratamiento de #AC varía.

Instrucciones de código EVEX, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".

Additionally:

```text
#UD               If EVEX.vvvv != 1111B or VEX.vvvv != 1111B.
```
