---
summary: Blend Float64/Float32 Vectores Usando un Control OpMask
---

## Descripción

Realiza una mezcla de elementos por elemento entre elementos flotantes64/float32 en el primer operando de origen (el segundo operando) con los elementos en el segundo operando de origen (el tercer operando) utilizando un registro de opmasco como control selecto. El resultado mezclado se escribe en el registro de destino.

El destino y el primer operandos de origen son los registros ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits.

El registro de opmasco no se utiliza como una máscara de escritura para esta instrucción. En cambio, la máscara se utiliza como selector de elementos: cada elemento del destino se selecciona condicionalmente entre primera fuente o segunda fuente utilizando el valor del bit de máscara relacionado (0 para primer operando de origen, 1 para segundo operando de origen).

Si se establece EVEX.z, los elementos con el valor de bit de máscara correspondiente de 0 en el operando de destino se ponen a cero.

## Operación

```text
VBLENDMPD (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no controlmask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    DEST[i+63:i] := SRC2[63:0]

                  ELSE

                    DEST[i+63:i] := SRC2[i+63:i]

             FI;

     ELSE

             IF *merging-masking*                 ; merging-masking

                  THEN DEST[i+63:i] := SRC1[i+63:i]

                  ELSE                            ; zeroing-masking

                    DEST[i+63:i] := 0

             FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VBLENDMPS (EVEX Encoded Versions)

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
VBLENDMPD __m512d _mm512_mask_blend_pd(__mmask8 k, __m512d a, __m512d b);
VBLENDMPD __m256d _mm256_mask_blend_pd(__mmask8 k, __m256d a, __m256d b);
VBLENDMPD __m128d _mm_mask_blend_pd(__mmask8 k, __m128d a, __m128d b);
VBLENDMPS __m512 _mm512_mask_blend_ps(__mmask16 k, __m512 a, __m512 b);
VBLENDMPS __m256 _mm256_mask_blend_ps(__mmask8 k, __m256 a, __m256 b);
VBLENDMPS __m128 _mm_mask_blend_ps(__mmask8 k, __m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
