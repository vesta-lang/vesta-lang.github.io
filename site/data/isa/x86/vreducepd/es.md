---
summary: Transformación de reducción de rendimiento en valores de Float64 empaquetados
---

## Descripción

Realizar la transformación de reducción del paquete binario codificado valores en coma flotante de precisión doble en el operando de origen (el segundo operando) y almacenar los resultados reducidos en formato binario coma flotante al operando de destino (el primer operando) bajo la máscara de escritura k1.

La transformación de la reducción resta la parte entero y los bits fraccionados M principales del valor fuente de punto flotante binario, donde M es un entero sin firmar especificado por imm8[7:4], ver Figura 5-28. Específicamente, la transformación de la reducción se puede expresar como: dest = src (ROUND(2M*src))*2-M; donde "Round()" trata "src", "2M", y su producto como números binarios coma flotante con exponentes de significado normalizado y parcial. The magnitude of the reduced result can be expressed by considering src= 2p*man2, where `man2' is the normalized significand and `p' is the unbiased exponent Then if RC = RNE: 0<=|Reduced Result|<=2p-M-1 Then if RC  RNE: 0<=|Reduced Result|<2p-M

Esta instrucción podría terminar con una excepción de precisión set. Sin embargo, en caso de SPE set (es decir, Suppress excepción de precisión, que es imm8[3]=1), no se reporta excepción de precisión.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

```text
                           7  6                 5       4             3                     2         1                   0
```

imm8

```text
                              Fixed point length                  SPE                       RS        Round Control Override
```

Imm8[7:4] : Número de puntos fijos para restar Suppress excepción de precisión: Imm8[3] Round Select: Imm8[2] Imm8[1:0] = 00b : Ronda más cercana

```text
                                                   Imm8[3] = 0b : Use MXCSR exception mask  Imm8[2] = 0b : Use Imm8[1:0]  Imm8[1:0] = 01b : Round down
                                                   Imm8[3] = 1b : Suppress                  Imm8[2] = 1b : Use MXCSR      Imm8[1:0] = 10b : Round up
```

Imm8[1:0] = 11b : Truncate

Figura 5-28. Controles Imm8 para VREDUCEPD/SD/PS/SS

En el cuadro 5-27 figura el manejo de los valores de entrada especiales.

** Casos especiales de VREDUCEPD/SD/PS/SS**

| \|Src1\| < 2-M-1 | RNE | Src1 |
| --- | --- | --- |
|  | RPI, Src1 > 0 | Ronda (Src1-2-M) * |
|  | RPI, Src1  0 | Src1 |
|  | RNI, Src1  0 | Src1 |
| \|Src1\| < 2-M | RNI, Src1 < 0 | Ronda (Src1+2-M) * |
| Src1 = +/-0, or | NOT RNI | +0.0 |
| Dest = +/-0 (Src1!=INF) | RNI | -0.0 |
| Src1 = +/-INF | cualquiera | +0.0 |
| Src1= +/-NAN | n/a | QNaN(Src1) |
| * Control redondo = (imm8.MS1)? MXCSR.RC: imm8.RC |  |  |

## Operación

```text
ReduceArgumentDP(SRC[63:0], imm8[7:0])
{

    // Check for NaN
    IF (SRC [63:0] = NAN) THEN

          RETURN (Convert SRC[63:0] to QNaN); FI;
    M := imm8[7:4]; // Number of fraction bits of the normalized significand to be subtracted
    RC := imm8[1:0];// Round Control for ROUND() operation
    RC source := imm[2];
    SPE := imm[3];// Suppress Precision Exception
    TMP[63:0] := 2-M *{ROUND(2M*SRC[63:0], SPE, RC_source, RC)}; // ROUND() treats SRC and 2M as standard binary FP values
    TMP[63:0] := SRC[63:0]  TMP[63:0]; // subtraction under the same RC,SPE controls
    RETURN TMP[63:0]; // binary encoded FP with biased exponent and normalized significand
}


VREDUCEPD

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b == 1) AND (SRC *is memory*)

                  THEN DEST[i+63:i] := ReduceArgumentDP(SRC[63:0], imm8[7:0]);

                  ELSE DEST[i+63:i] := ReduceArgumentDP(SRC[i+63:i], imm8[7:0]);

             FI;

ELSE

     IF *merging-masking*                ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                        ; zeroing-masking

                  DEST[i+63:i] = 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VREDUCEPD __m512d _mm512_mask_reduce_pd( __m512d a, int imm, int sae) VREDUCEPD __m512d _mm512_mask_reduce_pd(__m512d s, __mmask8 k, __m512d a, int imm, int sae) VREDUCEPD __m512d _mm512_maskz_reduce_pd(__mmask8 k, __m512d a, int imm, int sae) VREDUCEPD __m256d _mm256_mask_reduce_pd( __m256d a, int imm) VREDUCEPD __m256d _mm256_mask_reduce_pd(__m256d s, __mmask8 k, __m256d a, int imm) VREDUCEPD __m256d _mm256_maskz_reduce_pd(__mmask8 k, __m256d a, int imm) VREDUCEPD __m128d _mm_mask_reduce_pd( __m128d a, int imm) VREDUCEPD __m128d _mm_mask_reduce_pd(__m128d s, __mmask8 k, __m128d a, int imm) VREDUCEPD __m128d _mm_maskz_reduce_pd(__mmask8 k, __m128d a, int imm);
```

## SIMD coma flotante Excepciones

Inválido, Precisión. Si SPE está habilitado, excepción de precisión no se reporta (sin importar la máscara de excepción MXCSR).

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

```text
#UD                    If EVEX.vvvv != 1111B.
```
