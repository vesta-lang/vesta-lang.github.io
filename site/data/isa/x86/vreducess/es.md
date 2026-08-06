---
summary: Realizar una transformación de reducción en un valor de escalar Float32
---

## Descripción

Realizar una transformación de reducción del valor en coma flotante de precisión simple codificada binaria en el elemento bajo dword del segundo operando de origen (el tercer operando) y almacenar el resultado reducido en formato coma flotante binario al elemento bajo dword del operando de destino (el primer operando) bajo la máscara de escritura k1. Los bits 127:32 del operando de destino son copiados de los elementos dword respectivos del primer operando de origen (el segundo operando).

La transformación de la reducción resta la parte entero y los bits fraccionados M principales del valor fuente de punto flotante binario, donde M es un entero sin firmar especificado por imm8[7:4], ver Figura 5-28. Específicamente, la transformación de la reducción se puede expresar como: dest = src (ROUND(2M*src))*2-M; donde "Round()" trata "src", "2M", y su producto como números binarios coma flotante con exponentes de significado normalizado y parcial. The magnitude of the reduced result can be expressed by considering src= 2p*man2, where `man2' is the normalized significand and `p' is the unbiased exponent Then if RC = RNE: 0<=|Reduced Result|<=2p-M-1 Then if RC  RNE: 0<=|Reduced Result|<2p-M

Esta instrucción podría terminar con una excepción de precisión set. Sin embargo, en caso de SPE set (es decir, Suppress excepción de precisión, que es imm8[3]=1), no se reporta excepción de precisión.

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

VREDUCESS

IF k1[0] or *no writemask*

     THEN DEST[31:0] := ReduceArgumentSP(SRC2[31:0], imm8[7:0])

     ELSE

     IF *merging-masking*       ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                 ; zeroing-masking

           THEN DEST[31:0] = 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VREDUCESS __m128 _mm_mask_reduce_ss( __m128 a, __m128 b, int imm, int sae) VREDUCESS __m128 _mm_mask_reduce_ss(__m128 s, __mmask16 k, __m128 a, __m128 b, int imm, int sae) VREDUCESS __m128 _mm_maskz_reduce_ss(__mmask16 k, __m128 a, __m128 b, int imm, int sae);
```

## SIMD coma flotante Excepciones

Inválido, Precisión. Si SPE está habilitado, excepción de precisión no se reporta (sin importar la máscara de excepción MXCSR).

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".
