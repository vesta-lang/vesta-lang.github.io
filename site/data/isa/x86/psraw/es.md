---
summary: Cambio de datos empaquetados derecha Arithmetic
---

## Descripción

Cambia los bits en los elementos de datos individuales (palabras, palabras dobles o cuádwords) en el operando de destino (primero operando) a la derecha por el número de bits especificados en el conteo operando (segundo operando). A medida que los bits de los elementos de datos se desplazan a la derecha, los bits vacíos de alto orden se llenan con el valor inicial del bit de signo del elemento de datos. Si el valor especificado por el conteo operando es mayor de 15 (para palabras), 31 (para palabras dobles), o 63 (para cuádpagos), cada elemento de datos de destino se llena con el valor inicial del bit de signo del elemento. (Figura 4-18 da un ejemplo de cambio de palabras en un operando de 64 bits.)

```text
                   Pre-Shift    X3                     X2             X1  X0
```

DEST

Cambio derecho con la extensión de signo

```text
                   Post-Shift   X3 >> COUNT            X2 >> COUNT  X1 >> COUNT X0 >> COUNT
```

DEST

Figura 4-18. PSRAW y PSRAD Operación de Instrucción Usando un operando de 64 bits

Tenga en cuenta que sólo los primeros 64 bits de un conteo de 128 bits operando se verifican para calcular el conteo. Si el segundo operando de origen es una dirección de memoria, se cargan 128 bits.

La instrucción (V)PSRAW cambia cada una de las palabras en el operando de destino a la derecha por el número de bits especificados en el conteo operando, y la instrucción (V)PSRAD cambia cada una de las palabras dobles en el operando de destino.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE instrucciones 64-bit operando: El operando de destino es un registro de tecnología MMX; el conteo operando puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits.

128-bit Legacy SSE versión: El destino y el primer operandos de origen son los registros XMM. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican. El conteo operando puede ser un registro XMM o una ubicación de memoria de 128 bits o de 8 bits inmediatamente. Si el conteo operando es una dirección de memoria, 128 bits están cargados pero los 64 bits superiores son ignorados.

VEX.128 versión codificada: El destino y el primer operandos de origen son los registros XMM. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero. El conteo operando puede ser un registro XMM o una ubicación de memoria de 128 bits o de 8 bits inmediatamente. Si el conteo operando es una dirección de memoria, 128 bits están cargados pero los 64 bits superiores son ignorados.

VEX.256 versión codificada: El operando de destino es un registro YMM. El operando de origen es un registro YMM o una ubicación de memoria. El conteo operando puede venir ya sea de un registro XMM o una ubicación de memoria o de 8 bits inmediatamente. Bits (MAXVL-1:256) del registro ZMM correspondiente se ponen a cero.

EVEX versiones codificadas: El operando de destino es un registro ZMM actualizado según la máscara de escritura. El recuento operando es un inmediato de 8 bits (la versión de cuenta inmediata) o un valor de 8 bits de un registro XMM o una ubicación de memoria (la versión de cuenta variable). Para la versión de cuenta inmediata, el operando de origen (el segundo operando) puede ser un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 32/64 bits. Para la versión de cuenta variable, el primer operando de origen (el segundo operando) es un registro ZMM, el segundo operando de origen (el tercer operando, conteo variable de 8 bits) puede ser un registro XMM o una ubicación de memoria.

Nota: En VEX/EVEX versiones codificadas de turnos con un recuento inmediato, vvvv de VEX/EVEX codifica el registro de destino, y VEX.B/EVEX.B + ModRM.r/m codifica el registro de origen.

Nota: Para los turnos con un conteo inmediato (VEX.128.66.0F 71-73 /4, EVEX.128.66.0F 71-73 /4), VEX.vvvv/EVEX.vvvv codifica el registro de destino.

## Operación

```text
PSRAW (With 64-bit Operand)
    IF (COUNT > 15)
          THEN COUNT := 16;
    FI;
    DEST[15:0] := SignExtend(DEST[15:0] >> COUNT);
    (* Repeat shift operation for 2nd and 3rd words *)
    DEST[63:48] := SignExtend(DEST[63:48] >> COUNT);

PSRAD (with 64-bit operand)
    IF (COUNT > 31)
          THEN COUNT := 32;
    FI;
    DEST[31:0] := SignExtend(DEST[31:0] >> COUNT);
    DEST[63:32] := SignExtend(DEST[63:32] >> COUNT);

ARITHMETIC_RIGHT_SHIFT_DWORDS1(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 31)
THEN

    DEST[31:0] := SignBit
ELSE

    DEST[31:0] := SignExtend(SRC[31:0] >> COUNT);
FI;

ARITHMETIC_RIGHT_SHIFT_QWORDS1(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 63)
THEN

    DEST[63:0] := SignBit
ELSE

    DEST[63:0] := SignExtend(SRC[63:0] >> COUNT);
FI;

ARITHMETIC_RIGHT_SHIFT_WORDS_256b(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 15)

    THEN COUNT := 16;
FI;
DEST[15:0] := SignExtend(SRC[15:0] >> COUNT);

    (* Repeat shift operation for 2nd through 15th words *)
DEST[255:240] := SignExtend(SRC[255:240] >> COUNT);


ARITHMETIC_RIGHT_SHIFT_DWORDS_256b(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 31)

    THEN COUNT := 32;
FI;
DEST[31:0] := SignExtend(SRC[31:0] >> COUNT);

    (* Repeat shift operation for 2nd through 7th words *)
DEST[255:224] := SignExtend(SRC[255:224] >> COUNT);

ARITHMETIC_RIGHT_SHIFT_QWORDS(SRC, COUNT_SRC, VL) ; VL: 128b, 256b or 512b
COUNT := COUNT_SRC[63:0];
IF (COUNT > 63)

    THEN COUNT := 64;
FI;
DEST[63:0] := SignExtend(SRC[63:0] >> COUNT);

    (* Repeat shift operation for 2nd through 7th words *)
DEST[VL-1:VL-64] := SignExtend(SRC[VL-1:VL-64] >> COUNT);

ARITHMETIC_RIGHT_SHIFT_WORDS(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 15)

    THEN COUNT := 16;
FI;
DEST[15:0] := SignExtend(SRC[15:0] >> COUNT);

    (* Repeat shift operation for 2nd through 7th words *)
DEST[127:112] := SignExtend(SRC[127:112] >> COUNT);

ARITHMETIC_RIGHT_SHIFT_DWORDS(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 31)

    THEN COUNT := 32;
FI;
DEST[31:0] := SignExtend(SRC[31:0] >> COUNT);

    (* Repeat shift operation for 2nd through 3rd words *)
DEST[127:96] := SignExtend(SRC[127:96] >> COUNT);

VPSRAW (EVEX versions, xmm/m128)
(KL, VL) = (8, 128), (16, 256), (32, 512)
IF VL = 128

    TMP_DEST[127:0] := ARITHMETIC_RIGHT_SHIFT_WORDS_128b(SRC1[127:0], SRC2)
FI;
IF VL = 256

    TMP_DEST[255:0] := ARITHMETIC_RIGHT_SHIFT_WORDS_256b(SRC1[255:0], SRC2)
FI;
IF VL = 512

    TMP_DEST[255:0] := ARITHMETIC_RIGHT_SHIFT_WORDS_256b(SRC1[255:0], SRC2)
    TMP_DEST[511:256] := ARITHMETIC_RIGHT_SHIFT_WORDS_256b(SRC1[511:256], SRC2)
FI;

FOR j := 0 TO KL-1
    i := j * 16
    IF k1[j] OR *no writemask*
          THEN DEST[i+15:i] := TMP_DEST[i+15:i]


     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*                ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSRAW (EVEX Versions, imm8)
(KL, VL) = (8, 128), (16, 256), (32, 512)
IF VL = 128

    TMP_DEST[127:0] := ARITHMETIC_RIGHT_SHIFT_WORDS_128b(SRC1[127:0], imm8)
FI;
IF VL = 256

    TMP_DEST[255:0] := ARITHMETIC_RIGHT_SHIFT_WORDS_256b(SRC1[255:0], imm8)
FI;
IF VL = 512

    TMP_DEST[255:0] := ARITHMETIC_RIGHT_SHIFT_WORDS_256b(SRC1[255:0], imm8)
    TMP_DEST[511:256] := ARITHMETIC_RIGHT_SHIFT_WORDS_256b(SRC1[511:256], imm8)
FI;

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := TMP_DEST[i+15:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*                ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSRAW (ymm, ymm, xmm/m128) - VEX
DEST[255:0] := ARITHMETIC_RIGHT_SHIFT_WORDS_256b(SRC1, SRC2)
DEST[MAXVL-1:256] := 0

VPSRAW (ymm, imm8) - VEX
DEST[255:0] := ARITHMETIC_RIGHT_SHIFT_WORDS_256b(SRC1, imm8)
DEST[MAXVL-1:256] := 0

VPSRAW (xmm, xmm, xmm/m128) - VEX
DEST[127:0] := ARITHMETIC_RIGHT_SHIFT_WORDS(SRC1, SRC2)
DEST[MAXVL-1:128] := 0

VPSRAW (xmm, imm8) - VEX
DEST[127:0] := ARITHMETIC_RIGHT_SHIFT_WORDS(SRC1, imm8)
DEST[MAXVL-1:128] := 0

PSRAW (xmm, xmm, xmm/m128)


DEST[127:0] := ARITHMETIC_RIGHT_SHIFT_WORDS(DEST, SRC)
DEST[MAXVL-1:128] (Unmodified)

PSRAW (xmm, imm8)
DEST[127:0] := ARITHMETIC_RIGHT_SHIFT_WORDS(DEST, imm8)
DEST[MAXVL-1:128] (Unmodified)

VPSRAD (EVEX Versions, imm8)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC1 *is memory*)

                  THEN DEST[i+31:i] := ARITHMETIC_RIGHT_SHIFT_DWORDS1(SRC1[31:0], imm8)

                  ELSE DEST[i+31:i] := ARITHMETIC_RIGHT_SHIFT_DWORDS1(SRC1[i+31:i], imm8)

             FI;

     ELSE

             IF *merging-masking*           ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*               ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSRAD (EVEX Versions, xmm/m128)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF VL = 128

    TMP_DEST[127:0] := ARITHMETIC_RIGHT_SHIFT_DWORDS_128b(SRC1[127:0], SRC2)
FI;
IF VL = 256

    TMP_DEST[255:0] := ARITHMETIC_RIGHT_SHIFT_DWORDS_256b(SRC1[255:0], SRC2)
FI;
IF VL = 512

    TMP_DEST[255:0] := ARITHMETIC_RIGHT_SHIFT_DWORDS_256b(SRC1[255:0], SRC2)
    TMP_DEST[511:256] := ARITHMETIC_RIGHT_SHIFT_DWORDS_256b(SRC1[511:256], SRC2)
FI;

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := TMP_DEST[i+31:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*               ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSRAD (ymm, ymm, xmm/m128) - VEX


DEST[255:0] := ARITHMETIC_RIGHT_SHIFT_DWORDS_256b(SRC1, SRC2)
DEST[MAXVL-1:256] := 0

VPSRAD (ymm, imm8) - VEX
DEST[255:0] := ARITHMETIC_RIGHT_SHIFT_DWORDS_256b(SRC1, imm8)
DEST[MAXVL-1:256] := 0

VPSRAD (xmm, xmm, xmm/m128) - VEX
DEST[127:0] := ARITHMETIC_RIGHT_SHIFT_DWORDS(SRC1, SRC2)
DEST[MAXVL-1:128] := 0

VPSRAD (xmm, imm8) - VEX
DEST[127:0] := ARITHMETIC_RIGHT_SHIFT_DWORDS(SRC1, imm8)
DEST[MAXVL-1:128] := 0

PSRAD (xmm, xmm, xmm/m128)
DEST[127:0] := ARITHMETIC_RIGHT_SHIFT_DWORDS(DEST, SRC)
DEST[MAXVL-1:128] (Unmodified)

PSRAD (xmm, imm8)
DEST[127:0] := ARITHMETIC_RIGHT_SHIFT_DWORDS(DEST, imm8)
DEST[MAXVL-1:128] (Unmodified)

VPSRAQ (EVEX Versions, imm8)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC1 *is memory*)

                  THEN DEST[i+63:i] := ARITHMETIC_RIGHT_SHIFT_QWORDS1(SRC1[63:0], imm8)

                  ELSE DEST[i+63:i] := ARITHMETIC_RIGHT_SHIFT_QWORDS1(SRC1[i+63:i], imm8)

             FI;

     ELSE

             IF *merging-masking*           ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*               ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSRAQ (EVEX Versions, xmm/m128)
(KL, VL) = (2, 128), (4, 256), (8, 512)
TMP_DEST[VL-1:0] := ARITHMETIC_RIGHT_SHIFT_QWORDS(SRC1[VL-1:0], SRC2, VL)

FOR j := 0 TO 7

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*               ; zeroing-masking


                             DEST[i+63:i] := 0
                FI
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPSRAD __m512i _mm512_srai_epi32(__m512i a, unsigned int imm);
VPSRAD __m512i _mm512_mask_srai_epi32(__m512i s, __mmask16 k, __m512i a, unsigned int imm);
VPSRAD __m512i _mm512_maskz_srai_epi32( __mmask16 k, __m512i a, unsigned int imm);
VPSRAD __m256i _mm256_mask_srai_epi32(__m256i s, __mmask8 k, __m256i a, unsigned int imm);
VPSRAD __m256i _mm256_maskz_srai_epi32( __mmask8 k, __m256i a, unsigned int imm);
VPSRAD __m128i _mm_mask_srai_epi32(__m128i s, __mmask8 k, __m128i a, unsigned int imm);
VPSRAD __m128i _mm_maskz_srai_epi32( __mmask8 k, __m128i a, unsigned int imm);
VPSRAD __m512i _mm512_sra_epi32(__m512i a, __m128i cnt);
VPSRAD __m512i _mm512_mask_sra_epi32(__m512i s, __mmask16 k, __m512i a, __m128i cnt);
VPSRAD __m512i _mm512_maskz_sra_epi32( __mmask16 k, __m512i a, __m128i cnt);
VPSRAD __m256i _mm256_mask_sra_epi32(__m256i s, __mmask8 k, __m256i a, __m128i cnt);
VPSRAD __m256i _mm256_maskz_sra_epi32( __mmask8 k, __m256i a, __m128i cnt);
VPSRAD __m128i _mm_mask_sra_epi32(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSRAD __m128i _mm_maskz_sra_epi32( __mmask8 k, __m128i a, __m128i cnt);
VPSRAQ __m512i _mm512_srai_epi64(__m512i a, unsigned int imm);
VPSRAQ __m512i _mm512_mask_srai_epi64(__m512i s, __mmask8 k, __m512i a, unsigned int imm) VPSRAQ __m512i _mm512_maskz_srai_epi64( __mmask8 k, __m512i a, unsigned int imm) VPSRAQ __m256i _mm256_mask_srai_epi64(__m256i s, __mmask8 k, __m256i a, unsigned int imm);
VPSRAQ __m256i _mm256_maskz_srai_epi64( __mmask8 k, __m256i a, unsigned int imm);
VPSRAQ __m128i _mm_mask_srai_epi64(__m128i s, __mmask8 k, __m128i a, unsigned int imm);
VPSRAQ __m128i _mm_maskz_srai_epi64( __mmask8 k, __m128i a, unsigned int imm);
VPSRAQ __m512i _mm512_sra_epi64(__m512i a, __m128i cnt);
VPSRAQ __m512i _mm512_mask_sra_epi64(__m512i s, __mmask8 k, __m512i a, __m128i cnt) VPSRAQ __m512i _mm512_maskz_sra_epi64( __mmask8 k, __m512i a, __m128i cnt) VPSRAQ __m256i _mm256_mask_sra_epi64(__m256i s, __mmask8 k, __m256i a, __m128i cnt);
VPSRAQ __m256i _mm256_maskz_sra_epi64( __mmask8 k, __m256i a, __m128i cnt);
VPSRAQ __m128i _mm_mask_sra_epi64(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSRAQ __m128i _mm_maskz_sra_epi64( __mmask8 k, __m128i a, __m128i cnt);
VPSRAW __m512i _mm512_srai_epi16(__m512i a, unsigned int imm);
VPSRAW __m512i _mm512_mask_srai_epi16(__m512i s, __mmask32 k, __m512i a, unsigned int imm);
VPSRAW __m512i _mm512_maskz_srai_epi16( __mmask32 k, __m512i a, unsigned int imm);
VPSRAW __m256i _mm256_mask_srai_epi16(__m256i s, __mmask16 k, __m256i a, unsigned int imm);
VPSRAW __m256i _mm256_maskz_srai_epi16( __mmask16 k, __m256i a, unsigned int imm);
VPSRAW __m128i _mm_mask_srai_epi16(__m128i s, __mmask8 k, __m128i a, unsigned int imm);
VPSRAW __m128i _mm_maskz_srai_epi16( __mmask8 k, __m128i a, unsigned int imm);
VPSRAW __m512i _mm512_sra_epi16(__m512i a, __m128i cnt);
VPSRAW __m512i _mm512_mask_sra_epi16(__m512i s, __mmask16 k, __m512i a, __m128i cnt);
VPSRAW __m512i _mm512_maskz_sra_epi16( __mmask16 k, __m512i a, __m128i cnt);
VPSRAW __m256i _mm256_mask_sra_epi16(__m256i s, __mmask8 k, __m256i a, __m128i cnt);
VPSRAW __m256i _mm256_maskz_sra_epi16( __mmask8 k, __m256i a, __m128i cnt);
VPSRAW __m128i _mm_mask_sra_epi16(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSRAW __m128i _mm_maskz_sra_epi16( __mmask8 k, __m128i a, __m128i cnt);
PSRAW __m64 _mm_srai_pi16 (__m64 m, int count) PSRAW __m64 _mm_sra_pi16 (__m64 m, __m64 count) (V)PSRAW __m128i _mm_srai_epi16(__m128i m, int count) (V)PSRAW __m128i _mm_sra_epi16(__m128i m, __m128i count) VPSRAW __m256i _mm256_srai_epi16 (__m256i m, int count) VPSRAW __m256i _mm256_sra_epi16 (__m256i m, __m128i count) PSRAD __m64 _mm_srai_pi32 (__m64 m, int count) PSRAD __m64 _mm_sra_pi32 (__m64 m, __m64 count) (V)PSRAD __m128i _mm_srai_epi32 (__m128i m, int count) (V)PSRAD __m128i _mm_sra_epi32 (__m128i m, __m128i count) VPSRAD __m256i _mm256_srai_epi32 (__m256i m, int count) VPSRAD __m256i _mm256_sra_epi32 (__m256i m, __m128i count);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

* Instrucciones codificadas por VEX:

-- Sintaxis con codificación RM/RVM operando (A/C en mesa de codificación el operando), véase Tabla 2-21, "Tipo 4 Condiciones de Excepción".

-- Sintaxis con la codificación MI/VMI operando (B/D en la tabla de codificación el operando), ver Tabla 2-24, "Tipo 7 Condiciones de Excepción".

* EVEX-encoded VPSRAW (E en la tabla de codificación el operando), ver Excepciones Tipo E4NF.nb en la tabla 2-52, "Tipo

Condiciones de Excepción de Clase E4NF."

* EVEX-encoded VPSRAD/Q:

-- Sintaxis con el tipo de tuple Mem128 (G en la tabla de codificación el operando), ver Excepciones Tipo E4NF.nb en la tabla 2-52, "Tipo E4NF Condiciones de Excepción".

-- Sintaxis con tipo de tuple completo (F en la tabla de codificación el operando), ver Tabla 2-51, "Tipo E4 Condiciones de Excepción Clase".
