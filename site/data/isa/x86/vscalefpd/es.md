---
summary: Scale Packed Float64 Valores Con Float64 Valores
---

## Descripción

Realiza una coma flotante escala de los valores en coma flotante de precisión doble empaquetados en el primer operando de origen multiplicando por 2 al poder de los valores en coma flotante de precisión doble en segundo operando de origen.

La ecuación de esta operación es dada por:

```text
zmm1 := zmm2*2floor(zmm3).
```

Planta (zmm3) significa valor máximo entero zmm3.

Si el resultado no puede ser representado en doble precisión, entonces se emite la respuesta de desbordamiento adecuada (para el escalado positivo operando), o la respuesta de subida adecuada (para el escalado negativo operando). Las respuestas de desbordamiento y desbordamiento dependen del modo de redondeo (para redondeo compatible con IEEE), así como de otros ajustes en MXCSR (fotos de máscara de visualización, bit FTZ) y en el bit SAE.

El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

En el cuadro 5-37 y el cuadro 5-38 figuran valores de entrada especiales.

** Casos especiales de VSCALEFPD/SD/PS/SS**

| Src1 | +/-QNaN | QNaN(Src1) | +INF | +0 | QNaN(Src1) | IF o fuente es SNAN |
| --- | --- | --- | --- | --- | --- | --- |
|  | +/-SNaN | QNaN(Src1) | QNaN(Src1) | QNaN(Src1) | QNaN(Src1) | YES |
|  | +/-Inf | QNaN(Src2) | Src1 | QNaN_Indefinite | Src1 | IF Src2 is SNAN or -INF |
|  | +/-0 | QNaN(Src2) | QNaN_Indefinite | Src1 | Src1 | IF Src2 is SNAN or +INF |

## Operación

```text
SCALE(SRC1, SRC2)

{

TMP_SRC2 := SRC2

TMP_SRC1 := SRC1

IF (SRC2 is denormal AND MXCSR.DAZ) THEN TMP_SRC2=0

IF (SRC1 is denormal AND MXCSR.DAZ) THEN TMP_SRC1=0

/* SRC2 is a 64 bits floating-point value */

DEST[63:0] := TMP_SRC1[63:0] * POW(2, Floor(TMP_SRC2[63:0]))

}

VSCALEFPD (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

IF (VL = 512) AND (EVEX.b = 1) AND (SRC2 *is register*)

     THEN

           SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

           SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask* THEN

                  IF (EVEX.b = 1) AND (SRC2 *is memory*)

                       THEN DEST[i+63:i] := SCALE(SRC1[i+63:i], SRC2[63:0]);

                       ELSE DEST[i+63:i] := SCALE(SRC1[i+63:i], SRC2[i+63:i]);

                  FI;

           ELSE

                  IF *merging-masking*        ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE                   ; zeroing-masking

                       DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VSCALEFPD __m512d _mm512_scalef_round_pd(__m512d a, __m512d b, int rounding);
VSCALEFPD __m512d _mm512_mask_scalef_round_pd(__m512d s, __mmask8 k, __m512d a, __m512d b, int rounding);
VSCALEFPD __m512d _mm512_maskz_scalef_round_pd(__mmask8 k, __m512d a, __m512d b, int rounding);
VSCALEFPD __m512d _mm512_scalef_pd(__m512d a, __m512d b);
VSCALEFPD __m512d _mm512_mask_scalef_pd(__m512d s, __mmask8 k, __m512d a, __m512d b);
VSCALEFPD __m512d _mm512_maskz_scalef_pd(__mmask8 k, __m512d a, __m512d b);
VSCALEFPD __m256d _mm256_scalef_pd(__m256d a, __m256d b);
VSCALEFPD __m256d _mm256_mask_scalef_pd(__m256d s, __mmask8 k, __m256d a, __m256d b);
VSCALEFPD __m256d _mm256_maskz_scalef_pd(__mmask8 k, __m256d a, __m256d b);
VSCALEFPD __m128d _mm_scalef_pd(__m128d a, __m128d b);
VSCALEFPD __m128d _mm_mask_scalef_pd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VSCALEFPD __m128d _mm_maskz_scalef_pd(__mmask8 k, __m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal (for Src1).

Denormal no se reporta para Src2.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".
