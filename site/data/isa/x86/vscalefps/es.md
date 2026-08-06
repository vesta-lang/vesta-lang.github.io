---
summary: Scale Packed Float32 Valores con los valores de Float32
---

## Descripción

Realiza una coma flotante escala de los valores en coma flotante de precisión simple empaquetados en el primer operando de origen multiplicando por 2 al poder de los valores flotantes32 en segundo operando de origen.

La ecuación de esta operación es dada por:

```text
zmm1 := zmm2*2floor(zmm3).
```

Planta (zmm3) significa valor máximo entero zmm3.

Si el resultado no puede ser representado en una sola precisión, entonces se emite la respuesta de desbordamiento adecuada (para el escalado positivo operando), o la respuesta de subida adecuada (para el escalado negativo operando). Las respuestas de desbordamiento y desbordamiento dependen del modo de redondeo (para redondeo compatible con IEEE), así como de otros ajustes en MXCSR (fotos de máscara de visualización, bit FTZ) y en el bit SAE.

EVEX.512 versión codificada: El primer operando de origen es un registro ZMM. El segundo operando de origen es un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro ZMM actualizado condicionalmente con máscara de escritura k1.

EVEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM, una ubicación de memoria de 256 bits, o un vector de 256 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro YMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM, una ubicación de memoria de 128 bits, o un vector de 128 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro XMM, actualizado condicionalmente utilizando máscara de escritura k1.

En el cuadro 5-37 y el cuadro 5-41 figuran valores de entrada especiales.

Cuadro especial 5-41. AdicionalVSCALEFPS/SS Casos especiales fallas<2-149 Valor devolutivo Subflujo Silencioresultontes 2128 +/-0 o +/-Min-Denormal (Src1 sign) Desbordamiento +/-INF(Src1 sign) o +/-Max-normal (Src1 sign)

## Operación

```text
SCALE(SRC1, SRC2)

{                 ; Check for denormal operands

TMP_SRC2 := SRC2

TMP_SRC1 := SRC1

IF (SRC2 is denormal AND MXCSR.DAZ) THEN TMP_SRC2=0

IF (SRC1 is denormal AND MXCSR.DAZ) THEN TMP_SRC1=0

/* SRC2 is a 32 bits floating-point value */

DEST[31:0] := TMP_SRC1[31:0] * POW(2, Floor(TMP_SRC2[31:0]))

}

VSCALEFPS (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1) AND (SRC2 *is register*)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask* THEN

                  IF (EVEX.b = 1) AND (SRC2 *is memory*)

                       THEN DEST[i+31:i] := SCALE(SRC1[i+31:i], SRC2[31:0]);

                       ELSE DEST[i+31:i] := SCALE(SRC1[i+31:i], SRC2[i+31:i]);

                  FI;

          ELSE

                  IF *merging-masking*           ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE                      ; zeroing-masking

                       DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR
DEST[MAXVL-1:VL] := 0;
```

## Intel C/C++ compilador intrínseco

```c
VSCALEFPS __m512 _mm512_scalef_round_ps(__m512 a, __m512 b, int rounding);
VSCALEFPS __m512 _mm512_mask_scalef_round_ps(__m512 s, __mmask16 k, __m512 a, __m512 b, int rounding);
VSCALEFPS __m512 _mm512_maskz_scalef_round_ps(__mmask16 k, __m512 a, __m512 b, int rounding);
VSCALEFPS __m512 _mm512_scalef_ps(__m512 a, __m512 b);
VSCALEFPS __m512 _mm512_mask_scalef_ps(__m512 s, __mmask16 k, __m512 a, __m512 b);
VSCALEFPS __m512 _mm512_maskz_scalef_ps(__mmask16 k, __m512 a, __m512 b);
VSCALEFPS __m256 _mm256_scalef_ps(__m256 a, __m256 b);
VSCALEFPS __m256 _mm256_mask_scalef_ps(__m256 s, __mmask8 k, __m256 a, __m256 b);
VSCALEFPS __m256 _mm256_maskz_scalef_ps(__mmask8 k, __m256 a, __m256 b);
VSCALEFPS __m128 _mm_scalef_ps(__m128 a, __m128 b);
VSCALEFPS __m128 _mm_mask_scalef_ps(__m128 s, __mmask8 k, __m128 a, __m128 b);
VSCALEFPS __m128 _mm_maskz_scalef_ps(__mmask8 k, __m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

Desbordamiento, Desbordamiento, Inválido, Precisión, Denormal (para Src1). Denormal no se reporta para Src2.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".
