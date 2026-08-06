---
summary: Mover los valores enteros empaquetados de los Alineados
---

## Descripción

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

EVEX versiones codificadas:

Mueva 128, 256 o 512 bits de los valores de integer de palabra doble empaquetado/cuadword del operando de origen (el segundo operando) al operando de destino (el primer operando). Esta instrucción se puede utilizar para cargar un registro vectorial de un int32/int64 ubicación de memoria, para almacenar el contenido de un registro vectorial en un int32/int64 ubicación de memoria, o para mover datos entre dos registros ZMM. Cuando la fuente o operando de destino es un operando de memoria, el operando debe estar alineado en un límite de 16 (EVEX.128)/32(EVEX.256)/64(EVEX.512)-byte o una excepción de protección general (#GP) se generará. Para mover datos enteros hacia y desde lugares de memoria no deseados, utilice la instrucción VMOVDQU.

El operando de destino se actualiza a 32-bit (VMOVDQA32) o 64-bit (VMOVDQA64) granularidad según la máscara de escritura.

VEX.256 versión codificada:

Mueva 256 bits de valores enteros empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro YMM de 256 bits ubicación de memoria, para almacenar el contenido de un registro YMM en una ubicación de memoria de 256 bits, o para mover datos entre dos registros YMM.

Cuando la fuente o operando de destino es un operando de memoria, el operando debe estar alineado en un límite de 32 bytes o una excepción de protección general (#GP) se generará. Para mover datos enteros hacia y desde lugares de memoria no deseados, utilice la instrucción VMOVDQU. Bits (MAXVL-1:256) del registro de destino se ponen a cero.

128-bit versions:

Mueva 128 bits de valores enteros empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro XMM de 128 bits ubicación de memoria, para almacenar el contenido de un registro XMM en una ubicación de memoria de 128 bits, o para mover datos entre dos registros XMM.

Cuando la fuente o operando de destino es un operando de memoria, el operando debe estar alineado en un límite de 16 bytes o una excepción de protección general (#GP) se generará. Para mover datos enteros hacia y desde lugares de memoria no deseados, utilice la instrucción VMOVDQU.

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del correspondiente registro de destino ZMM no se modifican.

VEX.128 versión codificada: Bits (MAXVL-1:128) del registro de destino se ponen a cero.

## Operación

```text
VMOVDQA32 (EVEX Encoded Versions, Register-Copy Form)

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

VMOVDQA32 (EVEX Encoded Versions, Store-Form)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[i+31:i]

     ELSE *DEST[i+31:i] remains unchanged*     ; merging-masking

FI;

ENDFOR;

VMOVDQA32 (EVEX Encoded Versions, Load-Form)

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

VMOVDQA64 (EVEX Encoded Versions, Register-Copy Form)

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

VMOVDQA64 (EVEX Encoded Versions, Store-Form)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[i+63:i]

     ELSE *DEST[i+63:i] remains unchanged*     ; merging-masking

FI;

ENDFOR;

VMOVDQA64 (EVEX Encoded Versions, Load-Form)

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

VMOVDQA (VEX.256 Encoded Version, Load - and Register Copy)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0

VMOVDQA (VEX.256 Encoded Version, Store-Form)
DEST[255:0] := SRC[255:0]

VMOVDQA (VEX.128 Encoded Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] := 0

VMOVDQA (128-bit Load- and Register-Copy- Form Legacy SSE Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] (Unmodified)

(V)MOVDQA (128-bit Store-Form Version)
DEST[127:0] := SRC[127:0]
```

## Intel C/C++ compilador intrínseco

```c
VMOVDQA32 __m512i _mm512_load_epi32( void * sa);
VMOVDQA32 __m512i _mm512_mask_load_epi32(__m512i s, __mmask16 k, void * sa);
VMOVDQA32 __m512i _mm512_maskz_load_epi32( __mmask16 k, void * sa);
VMOVDQA32 void _mm512_store_epi32(void * d, __m512i a);
VMOVDQA32 void _mm512_mask_store_epi32(void * d, __mmask16 k, __m512i a);
VMOVDQA32 __m256i _mm256_mask_load_epi32(__m256i s, __mmask8 k, void * sa);
VMOVDQA32 __m256i _mm256_maskz_load_epi32( __mmask8 k, void * sa);
VMOVDQA32 void _mm256_store_epi32(void * d, __m256i a);
VMOVDQA32 void _mm256_mask_store_epi32(void * d, __mmask8 k, __m256i a);
VMOVDQA32 __m128i _mm_mask_load_epi32(__m128i s, __mmask8 k, void * sa);
VMOVDQA32 __m128i _mm_maskz_load_epi32( __mmask8 k, void * sa);
VMOVDQA32 void _mm_store_epi32(void * d, __m128i a);
VMOVDQA32 void _mm_mask_store_epi32(void * d, __mmask8 k, __m128i a);
VMOVDQA64 __m512i _mm512_load_epi64( void * sa);
VMOVDQA64 __m512i _mm512_mask_load_epi64(__m512i s, __mmask8 k, void * sa);
VMOVDQA64 __m512i _mm512_maskz_load_epi64( __mmask8 k, void * sa);
VMOVDQA64 void _mm512_store_epi64(void * d, __m512i a);
VMOVDQA64 void _mm512_mask_store_epi64(void * d, __mmask8 k, __m512i a);
VMOVDQA64 __m256i _mm256_mask_load_epi64(__m256i s, __mmask8 k, void * sa);
VMOVDQA64 __m256i _mm256_maskz_load_epi64( __mmask8 k, void * sa);
VMOVDQA64 void _mm256_store_epi64(void * d, __m256i a);
VMOVDQA64 void _mm256_mask_store_epi64(void * d, __mmask8 k, __m256i a);
VMOVDQA64 __m128i _mm_mask_load_epi64(__m128i s, __mmask8 k, void * sa);
VMOVDQA64 __m128i _mm_maskz_load_epi64( __mmask8 k, void * sa);
VMOVDQA64 void _mm_store_epi64(void * d, __m128i a);
VMOVDQA64 void _mm_mask_store_epi64(void * d, __mmask8 k, __m128i a);
MOVDQA void __m256i _mm256_load_si256 (__m256i * p);
MOVDQA _mm256_store_si256(_m256i *p, __m256i a);
MOVDQA __m128i _mm_load_si128 (__m128i * p);
MOVDQA void _mm_store_si128(__m128i *p, __m128i a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no-EVEX-encoded, ver Excepciones Tipo1.SSE2 en la tabla 2-18, "Tipo 1 Clase Condiciones de Excepción."

Instrucciones codificadas por EVEX, ver Tabla 2-46, "Tipo E1 Clase Condiciones de Excepción."

Additionally:

```text
#UD               If EVEX.vvvv != 1111B or VEX.vvvv != 1111B.
```
