---
summary: Transformación de reducción de rendimiento en valores de Float32 empaquetados
---

## Descripción

Realizar la transformación de reducción del paquete binario codificado valores en coma flotante de precisión simple en el operando de origen (el segundo operando) y almacenar los resultados reducidos en formato binario coma flotante al operando de destino (el primer operando) bajo la máscara de escritura k1.

La transformación de la reducción resta la parte entero y los bits fraccionados M principales del valor fuente de punto flotante binario, donde M es un entero sin firmar especificado por imm8[7:4], ver Figura 5-28. Específicamente, la transformación de la reducción se puede expresar como: dest = src (ROUND(2M*src))*2-M; donde "Round()" trata "src", "2M", y su producto como números binarios coma flotante con exponentes de significado normalizado y parcial. The magnitude of the reduced result can be expressed by considering src= 2p*man2, where `man2' is the normalized significand and `p' is the unbiased exponent Then if RC = RNE: 0<=|Reduced Result|<=2p-M-1 Then if RC  RNE: 0<=|Reduced Result|<2p-M

Esta instrucción podría terminar con una excepción de precisión set. Sin embargo, en caso de SPE set (es decir, Suppress excepción de precisión, que es imm8[3]=1), no se reporta excepción de precisión.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

En el cuadro 5-27 figura el manejo de los valores de entrada especiales.

## Operación

```text
ReduceArgumentSP(SRC[31:0], imm8[7:0])
{

    // Check for NaN
    IF (SRC [31:0] = NAN) THEN

          RETURN (Convert SRC[31:0] to QNaN); FI
    M := imm8[7:4]; // Number of fraction bits of the normalized significand to be subtracted
    RC := imm8[1:0];// Round Control for ROUND() operation
    RC source := imm[2];
    SPE := imm[3];// Suppress Precision Exception
    TMP[31:0] := 2-M *{ROUND(2M*SRC[31:0], SPE, RC_source, RC)}; // ROUND() treats SRC and 2M as standard binary FP values
    TMP[31:0] := SRC[31:0]  TMP[31:0]; // subtraction under the same RC,SPE controls
RETURN TMP[31:0]; // binary encoded FP with biased exponent and normalized significand
}

VREDUCEPS

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b == 1) AND (SRC *is memory*)

                  THEN DEST[i+31:i] := ReduceArgumentSP(SRC[31:0], imm8[7:0]);

                  ELSE DEST[i+31:i] := ReduceArgumentSP(SRC[i+31:i], imm8[7:0]);

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[i+31:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+31:i] = 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VREDUCEPS __m512 _mm512_mask_reduce_ps( __m512 a, int imm, int sae) VREDUCEPS __m512 _mm512_mask_reduce_ps(__m512 s, __mmask16 k, __m512 a, int imm, int sae) VREDUCEPS __m512 _mm512_maskz_reduce_ps(__mmask16 k, __m512 a, int imm, int sae) VREDUCEPS __m256 _mm256_mask_reduce_ps( __m256 a, int imm) VREDUCEPS __m256 _mm256_mask_reduce_ps(__m256 s, __mmask8 k, __m256 a, int imm) VREDUCEPS __m256 _mm256_maskz_reduce_ps(__mmask8 k, __m256 a, int imm) VREDUCEPS __m128 _mm_mask_reduce_ps( __m128 a, int imm) VREDUCEPS __m128 _mm_mask_reduce_ps(__m128 s, __mmask8 k, __m128 a, int imm) VREDUCEPS __m128 _mm_maskz_reduce_ps(__mmask8 k, __m128 a, int imm);
```

## SIMD coma flotante Excepciones

Inválido, Precisión. Si SPE está habilitado, excepción de precisión no se reporta (sin importar la máscara de excepción MXCSR).

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción"; además:

```text
#UD                    If EVEX.vvvv != 1111B.
```
