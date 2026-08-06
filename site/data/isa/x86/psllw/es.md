---
summary: Cambio de datos empaquetados Izquierda lógica
---

## Descripción

Cambia los bits en los elementos de datos individuales (palabras, palabras dobles o cuádwords) en el operando de destino (primero operando) a la izquierda por el número de bits especificados en el conteo operando (segundo operando). A medida que los bits de los elementos de datos se desplazan a la izquierda, los bits vacíos de baja orden se limpian (configurados a 0). Si el valor especificado por el conteo operando es mayor de 15 (para palabras), 31 (para palabras dobles), o 63 (para un cuádpago), entonces el operando de destino se establece a todos los 0s. La Figura 4-17 da un ejemplo de cambio de palabras en un operando de 64 bits.

```text
                   Pre-Shift   X3                           X2             X1    X0
```

DEST

Cambio Izquierda con Zero Extension

```text
       Post-Shift              X3 << COUNT              X2 << COUNT   X1 << COUNT X0 << COUNT
```

DEST

Figura 4-17. PSLLW, PSLLD y PSLLQ Instrucción Operación Usando Operand de 64 bits

La instrucción (V)PSLLW cambia cada una de las palabras en el destino operand a la izquierda por el número de bits especificados en el conteo operand; la instrucción (V)PSLLD cambia cada una de las palabras dobles en el destino operand; y la instrucción (V)PSLLQ desplaza el cuadrilo (o cuadripos) en el destino operand.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE instrucciones 64-bit operando: El operando de destino es un registro de tecnología MMX; el conteo operando puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits.

128-bit Legacy SSE versión: El destino y el primer operandos de origen son los registros XMM. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican. El conteo operando puede ser un registro XMM o una ubicación de memoria de 128 bits o de 8 bits inmediatamente. Si el conteo operando es una dirección de memoria, 128 bits están cargados pero los 64 bits superiores son ignorados.

VEX.128 versión codificada: El destino y el primer operandos de origen son los registros XMM. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero. El conteo operando puede ser un registro XMM o una ubicación de memoria de 128 bits o de 8 bits inmediatamente. Si el conteo operando es una dirección de memoria, 128 bits están cargados pero los 64 bits superiores son ignorados.

VEX.256 versión codificada: El operando de destino es un registro YMM. El operando de origen es un registro YMM o una ubicación de memoria. El conteo operando puede venir ya sea de un registro XMM o una ubicación de memoria o de 8 bits inmediatamente. Bits (MAXVL-1:256) del registro ZMM correspondiente se ponen a cero.

EVEX versiones codificadas: El operando de destino es un registro ZMM actualizado según la máscara de escritura. El recuento operando es un inmediato de 8 bits (la versión de cuenta inmediata) o un valor de 8 bits de un registro XMM o una ubicación de memoria (la versión de cuenta variable). Para la versión de cuenta inmediata, el operando de origen (el segundo operando) puede ser un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 32/64 bits. Para la versión de cuenta variable, el primer operando de origen (el segundo operando) es un registro ZMM, el segundo operando de origen (el tercer operando, conteo variable de 8 bits) puede ser un registro XMM o una ubicación de memoria.

Nota: En VEX/EVEX versiones codificadas de turnos con un recuento inmediato, vvvv de VEX/EVEX codifica el registro de destino, y VEX.B/EVEX.B + ModRM.r/m codifica el registro de origen.

Nota: Para los turnos con un conteo inmediato (VEX.128.66.0F 71-73 /6, o EVEX.128.66.0F 71-73 /6), VEX.vvvv/EVEX.vvvv codifica el registro de destino.

## Operación

```text
PSLLW (With 64-bit Operand)
    IF (COUNT > 15)
    THEN
          DEST[64:0] := 0000000000000000H;
    ELSE
         DEST[15:0] := ZeroExtend(DEST[15:0] << COUNT);
          (* Repeat shift operation for 2nd and 3rd words *)
         DEST[63:48] := ZeroExtend(DEST[63:48] << COUNT);
    FI;

PSLLD (with 64-bit operand)
    IF (COUNT > 31)
    THEN
          DEST[64:0] := 0000000000000000H;
    ELSE
         DEST[31:0] := ZeroExtend(DEST[31:0] << COUNT);
         DEST[63:32] := ZeroExtend(DEST[63:32] << COUNT);
    FI;

PSLLQ (With 64-bit Operand)
    IF (COUNT > 63)
    THEN
          DEST[64:0] := 0000000000000000H;
    ELSE


         DEST := ZeroExtend(DEST << COUNT);
    FI;

LOGICAL_LEFT_SHIFT_WORDS(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 15)
THEN

    DEST[127:0] := 00000000000000000000000000000000H
ELSE

    DEST[15:0] := ZeroExtend(SRC[15:0] << COUNT);
    (* Repeat shift operation for 2nd through 7th words *)
    DEST[127:112] := ZeroExtend(SRC[127:112] << COUNT);
FI;

LOGICAL_LEFT_SHIFT_DWORDS1(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 31)
THEN

    DEST[31:0] := 0
ELSE

    DEST[31:0] := ZeroExtend(SRC[31:0] << COUNT);
FI;

LOGICAL_LEFT_SHIFT_DWORDS(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 31)
THEN

    DEST[127:0] := 00000000000000000000000000000000H
ELSE

    DEST[31:0] := ZeroExtend(SRC[31:0] << COUNT);
    (* Repeat shift operation for 2nd through 3rd words *)
    DEST[127:96] := ZeroExtend(SRC[127:96] << COUNT);
FI;

LOGICAL_LEFT_SHIFT_QWORDS1(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 63)
THEN

    DEST[63:0] := 0
ELSE

    DEST[63:0] := ZeroExtend(SRC[63:0] << COUNT);
FI;

LOGICAL_LEFT_SHIFT_QWORDS(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 63)
THEN

    DEST[127:0] := 00000000000000000000000000000000H
ELSE

    DEST[63:0] := ZeroExtend(SRC[63:0] << COUNT);
    DEST[127:64] := ZeroExtend(SRC[127:64] << COUNT);
FI;
LOGICAL_LEFT_SHIFT_WORDS_256b(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];


IF (COUNT > 15)
THEN

    DEST[127:0] := 00000000000000000000000000000000H
    DEST[255:128] := 00000000000000000000000000000000H
ELSE
    DEST[15:0] := ZeroExtend(SRC[15:0] << COUNT);
    (* Repeat shift operation for 2nd through 15th words *)
    DEST[255:240] := ZeroExtend(SRC[255:240] << COUNT);
FI;

LOGICAL_LEFT_SHIFT_DWORDS_256b(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 31)
THEN

    DEST[127:0] := 00000000000000000000000000000000H
    DEST[255:128] := 00000000000000000000000000000000H
ELSE
    DEST[31:0] := ZeroExtend(SRC[31:0] << COUNT);
    (* Repeat shift operation for 2nd through 7th words *)
    DEST[255:224] := ZeroExtend(SRC[255:224] << COUNT);
FI;

LOGICAL_LEFT_SHIFT_QWORDS_256b(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 63)
THEN

    DEST[127:0] := 00000000000000000000000000000000H
    DEST[255:128] := 00000000000000000000000000000000H
ELSE
    DEST[63:0] := ZeroExtend(SRC[63:0] << COUNT);
    DEST[127:64] := ZeroExtend(SRC[127:64] << COUNT)
    DEST[191:128] := ZeroExtend(SRC[191:128] << COUNT);
    DEST[255:192] := ZeroExtend(SRC[255:192] << COUNT);
FI;

VPSLLW (EVEX Versions, xmm/m128)
(KL, VL) = (8, 128), (16, 256), (32, 512)
IF VL = 128

    TMP_DEST[127:0] := LOGICAL_LEFT_SHIFT_WORDS_128b(SRC1[127:0], SRC2)
FI;
IF VL = 256

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_WORDS_256b(SRC1[255:0], SRC2)
FI;
IF VL = 512

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_WORDS_256b(SRC1[255:0], SRC2)
    TMP_DEST[511:256] := LOGICAL_LEFT_SHIFT_WORDS_256b(SRC1[511:256], SRC2)
FI;

FOR j := 0 TO KL-1                                 ; merging-masking
    i := j * 16
    IF k1[j] OR *no writemask*
          THEN DEST[i+15:i] := TMP_DEST[i+15:i]
          ELSE
                IF *merging-masking*


                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*            ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSLLW (EVEX Versions, imm8)
(KL, VL) = (8, 128), (16, 256), (32, 512)
IF VL = 128

    TMP_DEST[127:0] := LOGICAL_LEFT_SHIFT_WORDS_128b(SRC1[127:0], imm8)
FI;
IF VL = 256

    TMP_DEST[255:0] := LOGICAL_RIGHT_SHIFT_WORDS_256b(SRC1[255:0], imm8)
FI;
IF VL = 512

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_WORDS_256b(SRC1[255:0], imm8)
    TMP_DEST[511:256] := LOGICAL_LEFT_SHIFT_WORDS_256b(SRC1[511:256], imm8)
FI;

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := TMP_DEST[i+15:i]

     ELSE

             IF *merging-masking*                  ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*            ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSLLW (ymm, ymm, xmm/m128) - VEX.256 Encoding
DEST[255:0] := LOGICAL_LEFT_SHIFT_WORDS_256b(SRC1, SRC2)
DEST[MAXVL-1:256] := 0;

VPSLLW (ymm, imm8) - VEX.256 Encoding
DEST[255:0] := LOGICAL_LEFT_SHIFT_WORD_256b(SRC1, imm8)
DEST[MAXVL-1:256] := 0;

VPSLLW (xmm, xmm, xmm/m128) - VEX.128 Encoding
DEST[127:0] := LOGICAL_LEFT_SHIFT_WORDS(SRC1, SRC2)
DEST[MAXVL-1:128] := 0

VPSLLW (xmm, imm8) - VEX.128 Encoding
DEST[127:0] := LOGICAL_LEFT_SHIFT_WORDS(SRC1, imm8)
DEST[MAXVL-1:128] := 0

PSLLW (xmm, xmm, xmm/m128)
DEST[127:0] := LOGICAL_LEFT_SHIFT_WORDS(DEST, SRC)
DEST[MAXVL-1:128] (Unmodified)


PSLLW (xmm, imm8)
DEST[127:0] := LOGICAL_LEFT_SHIFT_WORDS(DEST, imm8)
DEST[MAXVL-1:128] (Unmodified)

VPSLLD (EVEX versions, imm8)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC1 *is memory*)

                  THEN DEST[i+31:i] := LOGICAL_LEFT_SHIFT_DWORDS1(SRC1[31:0], imm8)

                  ELSE DEST[i+31:i] := LOGICAL_LEFT_SHIFT_DWORDS1(SRC1[i+31:i], imm8)

             FI;

     ELSE

             IF *merging-masking*                  ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSLLD (EVEX Versions, xmm/m128)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF VL = 128

    TMP_DEST[127:0] := LOGICAL_LEFT_SHIFT_DWORDS_128b(SRC1[127:0], SRC2)
FI;
IF VL = 256

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_DWORDS_256b(SRC1[255:0], SRC2)
FI;
IF VL = 512

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_DWORDS_256b(SRC1[255:0], SRC2)
    TMP_DEST[511:256] := LOGICAL_LEFT_SHIFT_DWORDS_256b(SRC1[511:256], SRC2)
FI;

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := TMP_DEST[i+31:i]

     ELSE

             IF *merging-masking*                  ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSLLD (ymm, ymm, xmm/m128) - VEX.256 Encoding
DEST[255:0] := LOGICAL_LEFT_SHIFT_DWORDS_256b(SRC1, SRC2)
DEST[MAXVL-1:256] := 0;


VPSLLD (ymm, imm8) - VEX.256 Encoding
DEST[255:0] := LOGICAL_LEFT_SHIFT_DWORDS_256b(SRC1, imm8)
DEST[MAXVL-1:256] := 0;

VPSLLD (xmm, xmm, xmm/m128) - VEX.128 Encoding
DEST[127:0] := LOGICAL_LEFT_SHIFT_DWORDS(SRC1, SRC2)
DEST[MAXVL-1:128] := 0

VPSLLD (xmm, imm8) - VEX.128 Encoding
DEST[127:0] := LOGICAL_LEFT_SHIFT_DWORDS(SRC1, imm8)
DEST[MAXVL-1:128] := 0

PSLLD (xmm, xmm, xmm/m128)
DEST[127:0] := LOGICAL_LEFT_SHIFT_DWORDS(DEST, SRC)
DEST[MAXVL-1:128] (Unmodified)

PSLLD (xmm, imm8)
DEST[127:0] := LOGICAL_LEFT_SHIFT_DWORDS(DEST, imm8)
DEST[MAXVL-1:128] (Unmodified)

VPSLLQ (EVEX Versions, imm8)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC1 *is memory*)

                  THEN DEST[i+63:i] := LOGICAL_LEFT_SHIFT_QWORDS1(SRC1[63:0], imm8)

                  ELSE DEST[i+63:i] := LOGICAL_LEFT_SHIFT_QWORDS1(SRC1[i+63:i], imm8)

             FI;

     ELSE

             IF *merging-masking*                  ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

VPSLLQ (EVEX Versions, xmm/m128)
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF VL = 128

    TMP_DEST[127:0] := LOGICAL_LEFT_SHIFT_QWORDS_128b(SRC1[127:0], SRC2)
FI;
IF VL = 256

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_QWORDS_256b(SRC1[255:0], SRC2)
FI;
IF VL = 512

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_QWORDS_256b(SRC1[255:0], SRC2)
    TMP_DEST[511:256] := LOGICAL_LEFT_SHIFT_QWORDS_256b(SRC1[511:256], SRC2)
FI;

FOR j := 0 TO KL-1
    i := j * 64


IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

        IF *merging-masking*                       ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE *zeroing-masking*                 ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSLLQ (ymm, ymm, xmm/m128) - VEX.256 Encoding
DEST[255:0] := LOGICAL_LEFT_SHIFT_QWORDS_256b(SRC1, SRC2)
DEST[MAXVL-1:256] := 0;

VPSLLQ (ymm, imm8) - VEX.256 Encoding
DEST[255:0] := LOGICAL_LEFT_SHIFT_QWORDS_256b(SRC1, imm8)
DEST[MAXVL-1:256] := 0;

VPSLLQ (xmm, xmm, xmm/m128) - VEX.128 Encoding
DEST[127:0] := LOGICAL_LEFT_SHIFT_QWORDS(SRC1, SRC2)
DEST[MAXVL-1:128] := 0

VPSLLQ (xmm, imm8) - VEX.128 Encoding
DEST[127:0] := LOGICAL_LEFT_SHIFT_QWORDS(SRC1, imm8)
DEST[MAXVL-1:128] := 0

PSLLQ (xmm, xmm, xmm/m128)
DEST[127:0] := LOGICAL_LEFT_SHIFT_QWORDS(DEST, SRC)
DEST[MAXVL-1:128] (Unmodified)

PSLLQ (xmm, imm8)
DEST[127:0] := LOGICAL_LEFT_SHIFT_QWORDS(DEST, imm8)
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VPSLLD __m512i _mm512_slli_epi32(__m512i a, unsigned int imm);
VPSLLD __m512i _mm512_mask_slli_epi32(__m512i s, __mmask16 k, __m512i a, unsigned int imm);
VPSLLD __m512i _mm512_maskz_slli_epi32( __mmask16 k, __m512i a, unsigned int imm);
VPSLLD __m256i _mm256_mask_slli_epi32(__m256i s, __mmask8 k, __m256i a, unsigned int imm);
VPSLLD __m256i _mm256_maskz_slli_epi32( __mmask8 k, __m256i a, unsigned int imm);
VPSLLD __m128i _mm_mask_slli_epi32(__m128i s, __mmask8 k, __m128i a, unsigned int imm);
VPSLLD __m128i _mm_maskz_slli_epi32( __mmask8 k, __m128i a, unsigned int imm);
VPSLLD __m512i _mm512_sll_epi32(__m512i a, __m128i cnt);
VPSLLD __m512i _mm512_mask_sll_epi32(__m512i s, __mmask16 k, __m512i a, __m128i cnt);
VPSLLD __m512i _mm512_maskz_sll_epi32( __mmask16 k, __m512i a, __m128i cnt);
VPSLLD __m256i _mm256_mask_sll_epi32(__m256i s, __mmask8 k, __m256i a, __m128i cnt);
VPSLLD __m256i _mm256_maskz_sll_epi32( __mmask8 k, __m256i a, __m128i cnt);
VPSLLD __m128i _mm_mask_sll_epi32(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSLLD __m128i _mm_maskz_sll_epi32( __mmask8 k, __m128i a, __m128i cnt);
VPSLLQ __m512i _mm512_mask_slli_epi64(__m512i a, unsigned int imm);
VPSLLQ __m512i _mm512_mask_slli_epi64(__m512i s, __mmask8 k, __m512i a, unsigned int imm);
VPSLLQ __m512i _mm512_maskz_slli_epi64( __mmask8 k, __m512i a, unsigned int imm);
VPSLLQ __m256i _mm256_mask_slli_epi64(__m256i s, __mmask8 k, __m256i a, unsigned int imm);
VPSLLQ __m256i _mm256_maskz_slli_epi64( __mmask8 k, __m256i a, unsigned int imm);
VPSLLQ __m128i _mm_mask_slli_epi64(__m128i s, __mmask8 k, __m128i a, unsigned int imm);
VPSLLQ __m128i _mm_maskz_slli_epi64( __mmask8 k, __m128i a, unsigned int imm);
VPSLLQ __m512i _mm512_mask_sll_epi64(__m512i a, __m128i cnt);
VPSLLQ __m512i _mm512_mask_sll_epi64(__m512i s, __mmask8 k, __m512i a, __m128i cnt);
VPSLLQ __m512i _mm512_maskz_sll_epi64( __mmask8 k, __m512i a, __m128i cnt);
VPSLLQ __m256i _mm256_mask_sll_epi64(__m256i s, __mmask8 k, __m256i a, __m128i cnt);
VPSLLQ __m256i _mm256_maskz_sll_epi64( __mmask8 k, __m256i a, __m128i cnt);
VPSLLQ __m128i _mm_mask_sll_epi64(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSLLQ __m128i _mm_maskz_sll_epi64( __mmask8 k, __m128i a, __m128i cnt);
VPSLLW __m512i _mm512_slli_epi16(__m512i a, unsigned int imm);
VPSLLW __m512i _mm512_mask_slli_epi16(__m512i s, __mmask32 k, __m512i a, unsigned int imm);
VPSLLW __m512i _mm512_maskz_slli_epi16( __mmask32 k, __m512i a, unsigned int imm);
VPSLLW __m256i _mm256_mask_slli_epi16(__m256i s, __mmask16 k, __m256i a, unsigned int imm);
VPSLLW __m256i _mm256_maskz_slli_epi16( __mmask16 k, __m256i a, unsigned int imm);
VPSLLW __m128i _mm_mask_slli_epi16(__m128i s, __mmask8 k, __m128i a, unsigned int imm);
VPSLLW __m128i _mm_maskz_slli_epi16( __mmask8 k, __m128i a, unsigned int imm);
VPSLLW __m512i _mm512_sll_epi16(__m512i a, __m128i cnt);
VPSLLW __m512i _mm512_mask_sll_epi16(__m512i s, __mmask32 k, __m512i a, __m128i cnt);
VPSLLW __m512i _mm512_maskz_sll_epi16( __mmask32 k, __m512i a, __m128i cnt);
VPSLLW __m256i _mm256_mask_sll_epi16(__m256i s, __mmask16 k, __m256i a, __m128i cnt);
VPSLLW __m256i _mm256_maskz_sll_epi16( __mmask16 k, __m256i a, __m128i cnt);
VPSLLW __m128i _mm_mask_sll_epi16(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSLLW __m128i _mm_maskz_sll_epi16( __mmask8 k, __m128i a, __m128i cnt);
PSLLW __m64 _mm_slli_pi16 (__m64 m, int count) PSLLW __m64 _mm_sll_pi16(__m64 m, __m64 count) (V)PSLLW __m128i _mm_slli_epi16(__m64 m, int count) (V)PSLLW __m128i _mm_sll_epi16(__m128i m, __m128i count) VPSLLW __m256i _mm256_slli_epi16 (__m256i m, int count) VPSLLW __m256i _mm256_sll_epi16 (__m256i m, __m128i count) PSLLD __m64 _mm_slli_pi32(__m64 m, int count) PSLLD __m64 _mm_sll_pi32(__m64 m, __m64 count) (V)PSLLD __m128i _mm_slli_epi32(__m128i m, int count) (V)PSLLD __m128i _mm_sll_epi32(__m128i m, __m128i count) VPSLLD __m256i _mm256_slli_epi32 (__m256i m, int count) VPSLLD __m256i _mm256_sll_epi32 (__m256i m, __m128i count) PSLLQ __m64 _mm_slli_si64(__m64 m, int count) PSLLQ __m64 _mm_sll_si64(__m64 m, __m64 count) (V)PSLLQ __m128i _mm_slli_epi64(__m128i m, int count) (V)PSLLQ __m128i _mm_sll_epi64(__m128i m, __m128i count) VPSLLQ __m256i _mm256_slli_epi64 (__m256i m, int count) VPSLLQ __m256i _mm256_sll_epi64 (__m256i m, __m128i count);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

* Instrucciones codificadas por VEX:

-- Sintaxis con codificación RM/RVM operando (A/C en mesa de codificación el operando), véase Tabla 2-21, "Tipo 4 Condiciones de Excepción".

-- Sintaxis con la codificación MI/VMI operando (B/D en la tabla de codificación el operando), ver Tabla 2-24, "Tipo 7 Condiciones de Excepción".

* EVEX-encoded VPSLLW (E en la tabla de codificación el operando), ver Excepciones Tipo E4NF.nb en la tabla 2-52, "Tipo

Condiciones de Excepción de Clase E4NF."

* EVEX-encoded VPSLLD/Q:

-- Sintaxis con el tipo de tuple Mem128 (G en la tabla de codificación el operando), ver Excepciones Tipo E4NF.nb en la tabla 2-52, "Tipo E4NF Condiciones de Excepción".

-- Sintaxis con tipo de tuple completo (F en la tabla de codificación el operando), ver Tabla 2-51, "Tipo E4 Condiciones de Excepción Clase".
