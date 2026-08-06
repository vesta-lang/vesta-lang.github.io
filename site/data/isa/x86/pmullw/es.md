---
summary: Multiply Packed enteros con signo y Store Baja Resultado
---

## Descripción

Realiza un SIMD firmado multiplicar de los enteros de palabras firmados empaquetados en el operando de destino (primer operando) y el operando de origen (segundo operando), y almacena los 16 bits bajos de cada resultado intermedio de 32 bits en el operando de destino. (Figura 4-12 muestra esta operación al usar operandos de 64 bits.)

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE versión 64-bit operando: El operando de origen puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits. El operando de destino es un registro de tecnología MMX.

128-bit Legacy SSE versión: La primera fuente y operandos de destino son registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: La primera fuente y operandos de destino son registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero. VEX.L debe ser 0, de lo contrario la instrucción será #UD.

VEX.256 versión codificada: El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. La primera fuente y operandos de destino son registros YMM.

EVEX versiones codificadas: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria. El operando de destino es actualizado condicionalmente basado en máscara de escritura k1.

SRC               X3                                          X2       X1  X0 DEST

```text
                  Y3                                          Y2       Y1  Y0
```

TEMP Z3 = X3  Y3  Z2 = X2  Y2                                          Z1 = X1  Y1  Z0 = X0  Y0

DEST              Z3[15:0] Z2[15:0] Z1[15:0] Z0[15:0]

Figura 4-13. PMULLU Instruction Operation Using 64-bit operandos

## Operación

```text
PMULLW (With 64-bit Operands)
    TEMP0[31:0] := DEST[15:0]  SRC[15:0]; (* Signed multiplication *)
    TEMP1[31:0] := DEST[31:16]  SRC[31:16];
    TEMP2[31:0] := DEST[47:32]  SRC[47:32];
    TEMP3[31:0] := DEST[63:48]  SRC[63:48];
    DEST[15:0] := TEMP0[15:0];
    DEST[31:16] := TEMP1[15:0];
    DEST[47:32] := TEMP2[15:0];
    DEST[63:48] := TEMP3[15:0];

PMULLW (With 128-bit Operands)
    TEMP0[31:0] := DEST[15:0]  SRC[15:0]; (* Signed multiplication *)
    TEMP1[31:0] := DEST[31:16]  SRC[31:16];
    TEMP2[31:0] := DEST[47:32]  SRC[47:32];
    TEMP3[31:0] := DEST[63:48]  SRC[63:48];
    TEMP4[31:0] := DEST[79:64]  SRC[79:64];
    TEMP5[31:0] := DEST[95:80]  SRC[95:80];
    TEMP6[31:0] := DEST[111:96]  SRC[111:96];
    TEMP7[31:0] := DEST[127:112]  SRC[127:112];
    DEST[15:0] := TEMP0[15:0];
    DEST[31:16] := TEMP1[15:0];
    DEST[47:32] := TEMP2[15:0];
    DEST[63:48] := TEMP3[15:0];
    DEST[79:64] := TEMP4[15:0];
    DEST[95:80] := TEMP5[15:0];
    DEST[111:96] := TEMP6[15:0];
    DEST[127:112] := TEMP7[15:0];

DEST[MAXVL-1:256] := 0


VPMULLW (VEX.128 Encoded Version)
Temp0[31:0] := SRC1[15:0] * SRC2[15:0]
Temp1[31:0] := SRC1[31:16] * SRC2[31:16]
Temp2[31:0] := SRC1[47:32] * SRC2[47:32]
Temp3[31:0] := SRC1[63:48] * SRC2[63:48]
Temp4[31:0] := SRC1[79:64] * SRC2[79:64]
Temp5[31:0] := SRC1[95:80] * SRC2[95:80]
Temp6[31:0] := SRC1[111:96] * SRC2[111:96]
Temp7[31:0] := SRC1[127:112] * SRC2[127:112]
DEST[15:0] := Temp0[15:0]
DEST[31:16] := Temp1[15:0]
DEST[47:32] := Temp2[15:0]
DEST[63:48] := Temp3[15:0]
DEST[79:64] := Temp4[15:0]
DEST[95:80] := Temp5[15:0]
DEST[111:96] := Temp6[15:0]
DEST[127:112] := Temp7[15:0]
DEST[MAXVL-1:128] := 0

PMULLW (EVEX Encoded Versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN

             temp[31:0] := SRC1[i+15:i] * SRC2[i+15:i]

             DEST[i+15:i] := temp[15:0]

     ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*                 ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPMULLW __m512i _mm512_mullo_epi16(__m512i a, __m512i b);
VPMULLW __m512i _mm512_mask_mullo_epi16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPMULLW __m512i _mm512_maskz_mullo_epi16( __mmask32 k, __m512i a, __m512i b);
VPMULLW __m256i _mm256_mask_mullo_epi16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMULLW __m256i _mm256_maskz_mullo_epi16( __mmask16 k, __m256i a, __m256i b);
VPMULLW __m128i _mm_mask_mullo_epi16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMULLW __m128i _mm_maskz_mullo_epi16( __mmask8 k, __m128i a, __m128i b);
PMULLW __m64 _mm_mullo_pi16(__m64 m1, __m64 m2) (V)PMULLW __m128i _mm_mullo_epi16 ( __m128i a, __m128i b) VPMULLW __m256i _mm256_mullo_epi16 ( __m256i a, __m256i b);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase." Instruccion codificada por EVEX, ver Excepciones Tipo E4.nb en Tabla 2-51, "Tipo E4 Condiciones de Excepción de Clase".
