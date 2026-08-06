---
summary: Multiply Packed enteros sin signo y Store de alto resultado
---

## Descripción

Realiza un SIMD multiplicado sin firmar de los enteros de palabras empaquetados en el operando de destino (primer operando) y el operando de origen (segundo operando), y almacena los 16 pedazos altos de cada resultado intermedio de 32 bits en el operando de destino. (Figura 4-12 muestra esta operación al usar operandos de 64 bits.)

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE versión 64-bit operando: El operando de origen puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits. El operando de destino es un registro de tecnología MMX.

128-bit Legacy SSE versión: La primera fuente y operandos de destino son registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: La primera fuente y operandos de destino son registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero. VEX.L debe ser 0, de lo contrario la instrucción será #UD.

VEX.256 versión codificada: El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. La primera fuente y operandos de destino son registros YMM.

EVEX versiones codificadas: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

SRC               X3                                              X2     X1  X0 DEST

```text
                  Y3                                              Y2     Y1  Y0
```

TEMP Z3 = X3  Y3  Z2 = X2  Y2                                            Z1 = X1  Y1  Z0 = X0  Y0

DEST              Z3[31:16] Z2[31:16] Z1[31:16] Z0[31:16]

Figura 4-12. PMULHUW y PMULHW Operación de Instrucción Usando operandos de 64 bits

## Operación

```text
PMULHUW (With 64-bit Operands)
    TEMP0[31:0] := DEST[15:0]  SRC[15:0]; (* Unsigned multiplication *)
    TEMP1[31:0] := DEST[31:16]  SRC[31:16];
    TEMP2[31:0] := DEST[47:32]  SRC[47:32];
    TEMP3[31:0] := DEST[63:48]  SRC[63:48];
    DEST[15:0] := TEMP0[31:16];
    DEST[31:16] := TEMP1[31:16];
    DEST[47:32] := TEMP2[31:16];
    DEST[63:48] := TEMP3[31:16];

PMULHUW (With 128-bit Operands)
    TEMP0[31:0] := DEST[15:0]  SRC[15:0]; (* Unsigned multiplication *)
    TEMP1[31:0] := DEST[31:16]  SRC[31:16];
    TEMP2[31:0] := DEST[47:32]  SRC[47:32];
    TEMP3[31:0] := DEST[63:48]  SRC[63:48];
    TEMP4[31:0] := DEST[79:64]  SRC[79:64];
    TEMP5[31:0] := DEST[95:80]  SRC[95:80];
    TEMP6[31:0] := DEST[111:96]  SRC[111:96];
    TEMP7[31:0] := DEST[127:112]  SRC[127:112];
    DEST[15:0] := TEMP0[31:16];
    DEST[31:16] := TEMP1[31:16];
    DEST[47:32] := TEMP2[31:16];
    DEST[63:48] := TEMP3[31:16];
    DEST[79:64] := TEMP4[31:16];
    DEST[95:80] := TEMP5[31:16];
    DEST[111:96] := TEMP6[31:16];
    DEST[127:112] := TEMP7[31:16];

VPMULHUW (VEX.128 Encoded Version)


TEMP0[31:0] := SRC1[15:0] * SRC2[15:0]
TEMP1[31:0] := SRC1[31:16] * SRC2[31:16]
TEMP2[31:0] := SRC1[47:32] * SRC2[47:32]
TEMP3[31:0] := SRC1[63:48] * SRC2[63:48]
TEMP4[31:0] := SRC1[79:64] * SRC2[79:64]
TEMP5[31:0] := SRC1[95:80] * SRC2[95:80]
TEMP6[31:0] := SRC1[111:96] * SRC2[111:96]
TEMP7[31:0] := SRC1[127:112] * SRC2[127:112]
DEST[15:0] := TEMP0[31:16]
DEST[31:16] := TEMP1[31:16]
DEST[47:32] := TEMP2[31:16]
DEST[63:48] := TEMP3[31:16]
DEST[79:64] := TEMP4[31:16]
DEST[95:80] := TEMP5[31:16]
DEST[111:96] := TEMP6[31:16]
DEST[127:112] := TEMP7[31:16]
DEST[MAXVL-1:128] := 0

PMULHUW (VEX.256 Encoded Version)
TEMP0[31:0] := SRC1[15:0] * SRC2[15:0]
TEMP1[31:0] := SRC1[31:16] * SRC2[31:16]
TEMP2[31:0] := SRC1[47:32] * SRC2[47:32]
TEMP3[31:0] := SRC1[63:48] * SRC2[63:48]
TEMP4[31:0] := SRC1[79:64] * SRC2[79:64]
TEMP5[31:0] := SRC1[95:80] * SRC2[95:80]
TEMP6[31:0] := SRC1[111:96] * SRC2[111:96]
TEMP7[31:0] := SRC1[127:112] * SRC2[127:112]
TEMP8[31:0] := SRC1[143:128] * SRC2[143:128]
TEMP9[31:0] := SRC1[159:144] * SRC2[159:144]
TEMP10[31:0] := SRC1[175:160] * SRC2[175:160]
TEMP11[31:0] := SRC1[191:176] * SRC2[191:176]
TEMP12[31:0] := SRC1[207:192] * SRC2[207:192]
TEMP13[31:0] := SRC1[223:208] * SRC2[223:208]
TEMP14[31:0] := SRC1[239:224] * SRC2[239:224]
TEMP15[31:0] := SRC1[255:240] * SRC2[255:240]
DEST[15:0] := TEMP0[31:16]
DEST[31:16] := TEMP1[31:16]
DEST[47:32] := TEMP2[31:16]
DEST[63:48] := TEMP3[31:16]
DEST[79:64] := TEMP4[31:16]
DEST[95:80] := TEMP5[31:16]
DEST[111:96] := TEMP6[31:16]
DEST[127:112] := TEMP7[31:16]
DEST[143:128] := TEMP8[31:16]
DEST[159:144] := TEMP9[31:16]
DEST[175:160] := TEMP10[31:16]
DEST[191:176] := TEMP11[31:16]
DEST[207:192] := TEMP12[31:16]
DEST[223:208] := TEMP13[31:16]
DEST[239:224] := TEMP14[31:16]
DEST[255:240] := TEMP15[31:16]
DEST[MAXVL-1:256] := 0

PMULHUW (EVEX Encoded Versions)


(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN

             temp[31:0] := SRC1[i+15:i] * SRC2[i+15:i]

             DEST[i+15:i] := tmp[31:16]

     ELSE

             IF *merging-masking*          ; merging-masking

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
VPMULHUW __m512i _mm512_mulhi_epu16(__m512i a, __m512i b);
VPMULHUW __m512i _mm512_mask_mulhi_epu16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPMULHUW __m512i _mm512_maskz_mulhi_epu16( __mmask32 k, __m512i a, __m512i b);
VPMULHUW __m256i _mm256_mask_mulhi_epu16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMULHUW __m256i _mm256_maskz_mulhi_epu16( __mmask16 k, __m256i a, __m256i b);
VPMULHUW __m128i _mm_mask_mulhi_epu16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMULHUW __m128i _mm_maskz_mulhi_epu16( __mmask8 k, __m128i a, __m128i b);
PMULHUW __m64 _mm_mulhi_pu16(__m64 a, __m64 b) (V)PMULHUW __m128i _mm_mulhi_epu16 ( __m128i a, __m128i b) VPMULHUW __m256i _mm256_mulhi_epu16 ( __m256i a, __m256i b);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase." Instruccion codificada por EVEX, ver Excepciones Tipo E4.nb en Tabla 2-51, "Tipo E4 Condiciones de Excepción de Clase".
