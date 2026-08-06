---
summary: Blend Int32/Int64 Vectores Usando un Control OpMask
---

## Descripción

Realiza una mezcla elemento por elemento de elementos dword/qword entre el primer operando de origen (el segundo operando) y los elementos del segundo operando de origen (el tercer operando) utilizando un registro de opmasco como control selecto. El resultado mezclado está escrito en el destino.

El destino y el primer operandos de origen son los registros ZMM. El segundo operando de origen puede ser un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 32 bits.

El registro de opmasco no se utiliza como una máscara de escritura para esta instrucción. En cambio, la máscara se utiliza como selector de elementos: cada elemento del destino se selecciona condicionalmente entre primera fuente o segunda fuente utilizando el valor del bit de máscara relacionado (0 para el primer operando de origen, 1 para el segundo operando de origen).

Si se establece EVEX.z, los elementos con el valor de bit de máscara correspondiente de 0 en el operando de destino se ponen a cero.

## Operación

```text
VPBLENDMD (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no controlmask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    DEST[i+31:i] := SRC2[31:0]

                  ELSE

                    DEST[i+31:i] := SRC2[i+31:i]

             FI;

     ELSE

             IF *merging-masking*                 ; merging-masking

                  THEN DEST[i+31:i] := SRC1[i+31:i]

                  ELSE                            ; zeroing-masking

                    DEST[i+31:i] := 0

             FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0;

VPBLENDMD (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no controlmask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    DEST[i+31:i] := SRC2[31:0]

                  ELSE

                    DEST[i+31:i] := SRC2[i+31:i]

             FI;

     ELSE

             IF *merging-masking*                 ; merging-masking

                  THEN DEST[i+31:i] := SRC1[i+31:i]

                  ELSE                            ; zeroing-masking

                    DEST[i+31:i] := 0

             FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPBLENDMD __m512i _mm512_mask_blend_epi32(__mmask16 k, __m512i a, __m512i b);
VPBLENDMD __m256i _mm256_mask_blend_epi32(__mmask8 m, __m256i a, __m256i b);
VPBLENDMD __m128i _mm_mask_blend_epi32(__mmask8 m, __m128i a, __m128i b);
VPBLENDMQ __m512i _mm512_mask_blend_epi64(__mmask8 k, __m512i a, __m512i b);
VPBLENDMQ __m256i _mm256_mask_blend_epi64(__mmask8 m, __m256i a, __m256i b);
VPBLENDMQ __m128i _mm_mask_blend_epi64(__mmask8 m, __m128i a, __m128i b);
```

## SIMD coma flotante Excepciones

None

## Otras excepciones

Ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
