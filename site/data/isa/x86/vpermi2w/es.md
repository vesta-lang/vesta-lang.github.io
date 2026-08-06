---
summary: Permiso completo de dos tablas Sobreescribir el índice
---

## Descripción

Permutes 16-bit/32-bit/64-bit valores en el segundo operando (el primer operando de origen) y el tercer operando (el segundo operando de origen) utilizando índices en el primer operando para seleccionar elementos del segundo y tercer operandos. Los elementos seleccionados se escriben al operando de destino (el primer operando) según la máscara de escritura k1.

El primero y segundo operandos son los registros ZMM/YMM/XMM. El primer operando contiene índices de entrada para seleccionar elementos de las dos tablas de entrada en el segundo y tercer operandos. El primer operando es también el destino del resultado.

D/Q/PS/PD versiones de elementos: El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32/64-bit. La radiodifusión de la baja ubicación de memoria de 32/64-bit se realiza si EVEX.b y el bit id para la selección de tablas se establecen (selecting table 2).

Dword/PS versiones: El bit id para la selección de mesa es bit 4/3/2, dependiendo de VL=512, 256, 128. Bits [3:0]/[2:0]/[1:0] de cada elemento en el vector índice de entrada selecciona un elemento dentro de los dos operandos de origen, Si el bit id es 0, table 1 (la primera fuente) se selecciona; de lo contrario se selecciona el segundo operando de origen.

Qword/PD versiones: El bit id para la selección de tablas es bit 3/2/1, y bits [2:0]/[1:0] /bit 0 selecciona elemento dentro de cada tabla de entrada.

Versiones de elementos de palabras: El segundo operando de origen puede ser un registro ZMM/YMM/XMM, o un 512/256/128-bit ubicación de memoria. El bit id para la selección de tablas es bit 5/4/3, y bits [4:0]/[3:0]/[2:0] selecciona el elemento dentro de cada tabla de entrada.

Tenga en cuenta que estas instrucciones permiten copiar un valor de 16-bit/32-bit/64-bit en los operandos de origen a más de un lugar en el operando de destino. Tenga en cuenta también que en este caso, la misma tabla se puede reutilizar por ejemplo para una segunda iteración, mientras que los elementos índice son sobrescritos.

Bits (MAXVL-1:256/128) del destino se ponen a cero para VL=256,128.

## Operación

```text
VPERMI2W (EVEX encoded versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

IF VL = 128

     id := 2

FI;

IF VL = 256

     id := 3

FI;

IF VL = 512

     id := 4

FI;

TMP_DEST := DEST

FOR j := 0 TO KL-1

     i := j * 16

     off := 16*TMP_DEST[i+id:i]

     IF k1[j] OR *no writemask*

          THEN

                  DEST[i+15:i]=TMP_DEST[i+id+1] ? SRC2[off+15:off]

                      : SRC1[off+15:off]

          ELSE

                  IF *merging-masking*     ; merging-masking

                      THEN *DEST[i+15:i] remains unchanged*

                      ELSE                 ; zeroing-masking

                      DEST[i+15:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPERMI2D/VPERMI2PS (EVEX encoded versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF VL = 128

    id := 1
FI;
IF VL = 256

    id := 2
FI;
IF VL = 512

    id := 3
FI;
TMP_DEST := DEST
FOR j := 0 TO KL-1

    i := j * 32
    off := 32*TMP_DEST[i+id:i]
    IF k1[j] OR *no writemask*

          THEN
                IF (EVEX.b = 1) AND (SRC2 *is memory*)
                      THEN
                            DEST[i+31:i] := TMP_DEST[i+id+1] ? SRC2[31:0]
                           : SRC1[off+31:off]
                ELSE
                      DEST[i+31:i] := TMP_DEST[i+id+1] ? SRC2[off+31:off]
                           : SRC1[off+31:off]


                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPERMI2Q/VPERMI2PD (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8 512)

IF VL = 128

     id := 0

FI;

IF VL = 256

     id := 1

FI;

IF VL = 512

     id := 2

FI;

TMP_DEST:= DEST

FOR j := 0 TO KL-1

     i := j * 64

     off := 64*TMP_DEST[i+id:i]

     IF k1[j] OR *no writemask*

          THEN

                  IF (EVEX.b = 1) AND (SRC2 *is memory*)

                      THEN

                        DEST[i+63:i] := TMP_DEST[i+id+1] ? SRC2[63:0]

                        : SRC1[off+63:off]

                  ELSE

                      DEST[i+63:i] := TMP_DEST[i+id+1] ? SRC2[off+63:off]

                        : SRC1[off+63:off]

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                        DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPERMI2D __m512i _mm512_permutex2var_epi32(__m512i a, __m512i idx, __m512i b);
VPERMI2D __m512i _mm512_mask_permutex2var_epi32(__m512i a, __mmask16 k, __m512i idx, __m512i b);
VPERMI2D __m512i _mm512_mask2_permutex2var_epi32(__m512i a, __m512i idx, __mmask16 k, __m512i b);
VPERMI2D __m512i _mm512_maskz_permutex2var_epi32(__mmask16 k, __m512i a, __m512i idx, __m512i b);
VPERMI __m256i _mm256_permutex2var_epi32(__m256i a, __m256i idx, __m256i b);
VPERMI2D __m256i _mm256_mask_permutex2var_epi32(__m256i a, __mmask8 k, __m256i idx, __m256i b);
VPERMI2D __m256i _mm256_mask2_permutex2var_epi32(__m256i a, __m256i idx, __mmask8 k, __m256i b);
VPERMI2D __m256i _mm256_maskz_permutex2var_epi32(__mmask8 k, __m256i a, __m256i idx, __m256i b);
VPERMI2D __m128i _mm_permutex2var_epi32(__m128i a, __m128i idx, __m128i b);
VPERMI2D __m128i _mm_mask_permutex2var_epi32(__m128i a, __mmask8 k, __m128i idx, __m128i b);
VPERMI2D __m128i _mm_mask2_permutex2var_epi32(__m128i a, __m128i idx, __mmask8 k, __m128i b);
VPERMI2D __m128i _mm_maskz_permutex2var_epi32(__mmask8 k, __m128i a, __m128i idx, __m128i b);
VPERMI2PD __m512d _mm512_permutex2var_pd(__m512d a, __m512i idx, __m512d b);
VPERMI2PD __m512d _mm512_mask_permutex2var_pd(__m512d a, __mmask8 k, __m512i idx, __m512d b);
VPERMI2PD __m512d _mm512_mask2_permutex2var_pd(__m512d a, __m512i idx, __mmask8 k, __m512d b);
VPERMI2PD __m512d _mm512_maskz_permutex2var_pd(__mmask8 k, __m512d a, __m512i idx, __m512d b);
VPERMI2PD __m256d _mm256_permutex2var_pd(__m256d a, __m256i idx, __m256d b);
VPERMI2PD __m256d _mm256_mask_permutex2var_pd(__m256d a, __mmask8 k, __m256i idx, __m256d b);
VPERMI2PD __m256d _mm256_mask2_permutex2var_pd(__m256d a, __m256i idx, __mmask8 k, __m256d b);
VPERMI2PD __m256d _mm256_maskz_permutex2var_pd(__mmask8 k, __m256d a, __m256i idx, __m256d b);
VPERMI2PD __m128d _mm_permutex2var_pd(__m128d a, __m128i idx, __m128d b);
VPERMI2PD __m128d _mm_mask_permutex2var_pd(__m128d a, __mmask8 k, __m128i idx, __m128d b);
VPERMI2PD __m128d _mm_mask2_permutex2var_pd(__m128d a, __m128i idx, __mmask8 k, __m128d b);
VPERMI2PD __m128d _mm_maskz_permutex2var_pd(__mmask8 k, __m128d a, __m128i idx, __m128d b);
VPERMI2PS __m512 _mm512_permutex2var_ps(__m512 a, __m512i idx, __m512 b);
VPERMI2PS __m512 _mm512_mask_permutex2var_ps(__m512 a, __mmask16 k, __m512i idx, __m512 b);
VPERMI2PS __m512 _mm512_mask2_permutex2var_ps(__m512 a, __m512i idx, __mmask16 k, __m512 b);
VPERMI2PS __m512 _mm512_maskz_permutex2var_ps(__mmask16 k, __m512 a, __m512i idx, __m512 b);
VPERMI2PS __m256 _mm256_permutex2var_ps(__m256 a, __m256i idx, __m256 b);
VPERMI2PS __m256 _mm256_mask_permutex2var_ps(__m256 a, __mmask8 k, __m256i idx, __m256 b);
VPERMI2PS __m256 _mm256_mask2_permutex2var_ps(__m256 a, __m256i idx, __mmask8 k, __m256 b);
VPERMI2PS __m256 _mm256_maskz_permutex2var_ps(__mmask8 k, __m256 a, __m256i idx, __m256 b);
VPERMI2PS __m128 _mm_permutex2var_ps(__m128 a, __m128i idx, __m128 b);
VPERMI2PS __m128 _mm_mask_permutex2var_ps(__m128 a, __mmask8 k, __m128i idx, __m128 b);
VPERMI2PS __m128 _mm_mask2_permutex2var_ps(__m128 a, __m128i idx, __mmask8 k, __m128 b);
VPERMI2PS __m128 _mm_maskz_permutex2var_ps(__mmask8 k, __m128 a, __m128i idx, __m128 b);
VPERMI2Q __m512i _mm512_permutex2var_epi64(__m512i a, __m512i idx, __m512i b);
VPERMI2Q __m512i _mm512_mask_permutex2var_epi64(__m512i a, __mmask8 k, __m512i idx, __m512i b);
VPERMI2Q __m512i _mm512_mask2_permutex2var_epi64(__m512i a, __m512i idx, __mmask8 k, __m512i b);
VPERMI2Q __m512i _mm512_maskz_permutex2var_epi64(__mmask8 k, __m512i a, __m512i idx, __m512i b);
VPERMI2Q __m256i _mm256_permutex2var_epi64(__m256i a, __m256i idx, __m256i b);
VPERMI2Q __m256i _mm256_mask_permutex2var_epi64(__m256i a, __mmask8 k, __m256i idx, __m256i b);
VPERMI2Q __m256i _mm256_mask2_permutex2var_epi64(__m256i a, __m256i idx, __mmask8 k, __m256i b);
VPERMI2Q __m256i _mm256_maskz_permutex2var_epi64(__mmask8 k, __m256i a, __m256i idx, __m256i b);
VPERMI2Q __m128i _mm_permutex2var_epi64(__m128i a, __m128i idx, __m128i b);
VPERMI2Q __m128i _mm_mask_permutex2var_epi64(__m128i a, __mmask8 k, __m128i idx, __m128i b);
VPERMI2Q __m128i _mm_mask2_permutex2var_epi64(__m128i a, __m128i idx, __mmask8 k, __m128i b);
VPERMI2Q __m128i _mm_maskz_permutex2var_epi64(__mmask8 k, __m128i a, __m128i idx, __m128i b);
VPERMI2W __m512i _mm512_permutex2var_epi16(__m512i a, __m512i idx, __m512i b);
VPERMI2W __m512i _mm512_mask_permutex2var_epi16(__m512i a, __mmask32 k, __m512i idx, __m512i b);
VPERMI2W __m512i _mm512_mask2_permutex2var_epi16(__m512i a, __m512i idx, __mmask32 k, __m512i b);
VPERMI2W __m512i _mm512_maskz_permutex2var_epi16(__mmask32 k, __m512i a, __m512i idx, __m512i b);
VPERMI2W __m256i _mm256_permutex2var_epi16(__m256i a, __m256i idx, __m256i b);
VPERMI2W __m256i _mm256_mask_permutex2var_epi16(__m256i a, __mmask16 k, __m256i idx, __m256i b);
VPERMI2W __m256i _mm256_mask2_permutex2var_epi16(__m256i a, __m256i idx, __mmask16 k, __m256i b);
VPERMI2W __m256i _mm256_maskz_permutex2var_epi16(__mmask16 k, __m256i a, __m256i idx, __m256i b);
VPERMI2W __m128i _mm_permutex2var_epi16(__m128i a, __m128i idx, __m128i b);
VPERMI2W __m128i _mm_mask_permutex2var_epi16(__m128i a, __mmask8 k, __m128i idx, __m128i b);
VPERMI2W __m128i _mm_mask2_permutex2var_epi16(__m128i a, __m128i idx, __mmask8 k, __m128i b);
VPERMI2W __m128i _mm_maskz_permutex2var_epi16(__mmask8 k, __m128i a, __m128i idx, __m128i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

VPERMI2D/Q/PS/PD: Ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción." VPERMI2W: Ver Excepciones Tipo E4NF.nb en la tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."
