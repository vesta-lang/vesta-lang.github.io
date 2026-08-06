---
summary: Scale escalar Float64 Valores con Float64 Valores
---

## Descripción

Realiza una coma flotante escala de los valores en coma flotante de precisión doble escalares en el primer operando de origen multiplicando por 2 al poder del valor en coma flotante de precisión doble en segundo operando de origen.

La ecuación de esta operación es dada por:

```text
xmm1 := xmm2*2floor(xmm3).
```

Planta (xmm3) significa valor máximo entero xmm3.

Si el resultado no puede ser representado en doble precisión, entonces se emite la respuesta de desbordamiento adecuada (para el escalado positivo operando), o la respuesta de subida adecuada (para el escalado negativo operando). Las respuestas de desbordamiento y desbordamiento dependen del modo de redondeo (para redondeo compatible con IEEE), así como de otros ajustes en MXCSR (fotos de máscara de visualización, bit FTZ) y en el bit SAE.

EVEX versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria. El operando de destino es un registro XMM actualizado condicionalmente con máscara de escritura k1.

En el cuadro 5-37 y el cuadro 5-38 figuran valores de entrada especiales.

## Operación

```text
SCALE(SRC1, SRC2)
{

    ; Check for denormal operands
TMP_SRC2 := SRC2
TMP_SRC1 := SRC1
IF (SRC2 is denormal AND MXCSR.DAZ) THEN TMP_SRC2=0
IF (SRC1 is denormal AND MXCSR.DAZ) THEN TMP_SRC1=0
/* SRC2 is a 64 bits floating-point value */
DEST[63:0] := TMP_SRC1[63:0] * POW(2, Floor(TMP_SRC2[63:0]))
}


VSCALEFSD (EVEX encoded version)

IF (EVEX.b= 1) and SRC2 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] OR *no writemask*

     THEN DEST[63:0] := SCALE(SRC1[63:0], SRC2[63:0])

     ELSE

     IF *merging-masking*                ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                          ; zeroing-masking

           DEST[63:0] := 0

     FI

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VSCALEFSD __m128d _mm_scalef_round_sd(__m128d a, __m128d b, int);
VSCALEFSD __m128d _mm_mask_scalef_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, int);
VSCALEFSD __m128d _mm_maskz_scalef_round_sd(__mmask8 k, __m128d a, __m128d b, int);
```

## SIMD coma flotante Excepciones

Desbordamiento, Desbordamiento, Inválido, Precisión, Denormal (para Src1). Denormal no se reporta para Src2.

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".
