---
summary: Paquete con saturación firmada
---

## Descripción

Convierte los enteros de palabra firmados empaquetados en los enteros de byte (PACKSSWB) o convierte los enteros de doble palabra firmados empaquetados en enteros de palabras firmados empaquetados (PACKSSDW), utilizando saturación a las condiciones de desbordamiento descriptor. Vea la Figura 4-6 para un ejemplo de la operación de embalaje.

```text
                               64-Bit SRC                                 64-Bit DEST
```

```text
                                                D  C                      B      A
```

D' C' B' A' 64-Bit DEST

Figura 4-6. Funcionamiento de la Instrucción PACKSSDW Usando 64-Bit operandos

PACKSSWB convierte los enteros de palabras firmadas empaquetados en el primer y segundo operandos de origen en los enteros de byte firmados usando las condiciones de flujo firmado a descriptor más allá de la gama de enteros de byte firmados. Si el valor de palabra firmado está más allá de la gama de un valor de byte firmado (es decir, mayor que 7FH o menos que 80H), el valor integer de byte saturado de 7FH o 80H, respectivamente, se almacena en el destino. PACKSSDW convierte los enteros de doble palabra firmados en la primera y segunda operandos de origen en enteros de palabra firmados empaquetados usando saturación firmada a descriptor condiciones de desbordamiento más allá de 7FFFH y 8000H.

EVEX codificado PACKSSWB: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen es un registro ZMM/YMM/XMM o un 512/256/128-bit ubicación de memoria. El operando de destino es un registro ZMM/YMM/XMM actualizado condicional bajo la máscara de escritura k1.

EVEX codificado PACKSSDW: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde un vector de 32-

Un poco ubicación de memoria. El operando de destino es un registro ZMM/YMM/XMM actualizado condicional bajo la máscara de escritura k1.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM. Los bits superiores (MAXVL-1:256) del destino de registro ZMM correspondiente se ponen a cero.

VEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero.

128-bit Legacy SSE versión: El primer operando de origen es un registro XMM. El segundo operando puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino correspondiente del registro de destino ZMM son sin modificar.

## Operación

```text
PACKSSWB Instruction (128-bit Legacy SSE Version)
    DEST[7:0] := SaturateSignedWordToSignedByte (DEST[15:0]);
    DEST[15:8] := SaturateSignedWordToSignedByte (DEST[31:16]);
    DEST[23:16] := SaturateSignedWordToSignedByte (DEST[47:32]);
    DEST[31:24] := SaturateSignedWordToSignedByte (DEST[63:48]);
    DEST[39:32] := SaturateSignedWordToSignedByte (DEST[79:64]);
    DEST[47:40] := SaturateSignedWordToSignedByte (DEST[95:80]);
    DEST[55:48] := SaturateSignedWordToSignedByte (DEST[111:96]);
    DEST[63:56] := SaturateSignedWordToSignedByte (DEST[127:112]);
    DEST[71:64] := SaturateSignedWordToSignedByte (SRC[15:0]);
    DEST[79:72] := SaturateSignedWordToSignedByte (SRC[31:16]);
    DEST[87:80] := SaturateSignedWordToSignedByte (SRC[47:32]);
    DEST[95:88] := SaturateSignedWordToSignedByte (SRC[63:48]);
    DEST[103:96] := SaturateSignedWordToSignedByte (SRC[79:64]);
    DEST[111:104] := SaturateSignedWordToSignedByte (SRC[95:80]);
    DEST[119:112] := SaturateSignedWordToSignedByte (SRC[111:96]);
    DEST[127:120] := SaturateSignedWordToSignedByte (SRC[127:112]);
    DEST[MAXVL-1:128] (Unmodified)

PACKSSDW Instruction (128-bit Legacy SSE Version)
    DEST[15:0] := SaturateSignedDwordToSignedWord (DEST[31:0]);
    DEST[31:16] := SaturateSignedDwordToSignedWord (DEST[63:32]);
    DEST[47:32] := SaturateSignedDwordToSignedWord (DEST[95:64]);
    DEST[63:48] := SaturateSignedDwordToSignedWord (DEST[127:96]);
    DEST[79:64] := SaturateSignedDwordToSignedWord (SRC[31:0]);
    DEST[95:80] := SaturateSignedDwordToSignedWord (SRC[63:32]);
    DEST[111:96] := SaturateSignedDwordToSignedWord (SRC[95:64]);
    DEST[127:112] := SaturateSignedDwordToSignedWord (SRC[127:96]);
    DEST[MAXVL-1:128] (Unmodified)


VPACKSSWB Instruction (VEX.128 Encoded Version)
    DEST[7:0] := SaturateSignedWordToSignedByte (SRC1[15:0]);
    DEST[15:8] := SaturateSignedWordToSignedByte (SRC1[31:16]);
    DEST[23:16] := SaturateSignedWordToSignedByte (SRC1[47:32]);
    DEST[31:24] := SaturateSignedWordToSignedByte (SRC1[63:48]);
    DEST[39:32] := SaturateSignedWordToSignedByte (SRC1[79:64]);
    DEST[47:40] := SaturateSignedWordToSignedByte (SRC1[95:80]);
    DEST[55:48] := SaturateSignedWordToSignedByte (SRC1[111:96]);
    DEST[63:56] := SaturateSignedWordToSignedByte (SRC1[127:112]);
    DEST[71:64] := SaturateSignedWordToSignedByte (SRC2[15:0]);
    DEST[79:72] := SaturateSignedWordToSignedByte (SRC2[31:16]);
    DEST[87:80] := SaturateSignedWordToSignedByte (SRC2[47:32]);
    DEST[95:88] := SaturateSignedWordToSignedByte (SRC2[63:48]);
    DEST[103:96] := SaturateSignedWordToSignedByte (SRC2[79:64]);
    DEST[111:104] := SaturateSignedWordToSignedByte (SRC2[95:80]);
    DEST[119:112] := SaturateSignedWordToSignedByte (SRC2[111:96]);
    DEST[127:120] := SaturateSignedWordToSignedByte (SRC2[127:112]);
    DEST[MAXVL-1:128] := 0;

VPACKSSDW Instruction (VEX.128 Encoded Version)
    DEST[15:0] := SaturateSignedDwordToSignedWord (SRC1[31:0]);
    DEST[31:16] := SaturateSignedDwordToSignedWord (SRC1[63:32]);
    DEST[47:32] := SaturateSignedDwordToSignedWord (SRC1[95:64]);
    DEST[63:48] := SaturateSignedDwordToSignedWord (SRC1[127:96]);
    DEST[79:64] := SaturateSignedDwordToSignedWord (SRC2[31:0]);
    DEST[95:80] := SaturateSignedDwordToSignedWord (SRC2[63:32]);
    DEST[111:96] := SaturateSignedDwordToSignedWord (SRC2[95:64]);
    DEST[127:112] := SaturateSignedDwordToSignedWord (SRC2[127:96]);
    DEST[MAXVL-1:128] := 0;

VPACKSSWB Instruction (VEX.256 Encoded Version)
    DEST[7:0] := SaturateSignedWordToSignedByte (SRC1[15:0]);
    DEST[15:8] := SaturateSignedWordToSignedByte (SRC1[31:16]);
    DEST[23:16] := SaturateSignedWordToSignedByte (SRC1[47:32]);
    DEST[31:24] := SaturateSignedWordToSignedByte (SRC1[63:48]);
    DEST[39:32] := SaturateSignedWordToSignedByte (SRC1[79:64]);
    DEST[47:40] := SaturateSignedWordToSignedByte (SRC1[95:80]);
    DEST[55:48] := SaturateSignedWordToSignedByte (SRC1[111:96]);
    DEST[63:56] := SaturateSignedWordToSignedByte (SRC1[127:112]);
    DEST[71:64] := SaturateSignedWordToSignedByte (SRC2[15:0]);
    DEST[79:72] := SaturateSignedWordToSignedByte (SRC2[31:16]);
    DEST[87:80] := SaturateSignedWordToSignedByte (SRC2[47:32]);
    DEST[95:88] := SaturateSignedWordToSignedByte (SRC2[63:48]);
    DEST[103:96] := SaturateSignedWordToSignedByte (SRC2[79:64]);
    DEST[111:104] := SaturateSignedWordToSignedByte (SRC2[95:80]);
    DEST[119:112] := SaturateSignedWordToSignedByte (SRC2[111:96]);
    DEST[127:120] := SaturateSignedWordToSignedByte (SRC2[127:112]);
    DEST[135:128] := SaturateSignedWordToSignedByte (SRC1[143:128]);
    DEST[143:136] := SaturateSignedWordToSignedByte (SRC1[159:144]);
    DEST[151:144] := SaturateSignedWordToSignedByte (SRC1[175:160]);
    DEST[159:152] := SaturateSignedWordToSignedByte (SRC1[191:176]);
    DEST[167:160] := SaturateSignedWordToSignedByte (SRC1[207:192]);
    DEST[175:168] := SaturateSignedWordToSignedByte (SRC1[223:208]);
    DEST[183:176] := SaturateSignedWordToSignedByte (SRC1[239:224]);


    DEST[191:184] := SaturateSignedWordToSignedByte (SRC1[255:240]);
    DEST[199:192] := SaturateSignedWordToSignedByte (SRC2[143:128]);
    DEST[207:200] := SaturateSignedWordToSignedByte (SRC2[159:144]);
    DEST[215:208] := SaturateSignedWordToSignedByte (SRC2[175:160]);
    DEST[223:216] := SaturateSignedWordToSignedByte (SRC2[191:176]);
    DEST[231:224] := SaturateSignedWordToSignedByte (SRC2[207:192]);
    DEST[239:232] := SaturateSignedWordToSignedByte (SRC2[223:208]);
    DEST[247:240] := SaturateSignedWordToSignedByte (SRC2[239:224]);
    DEST[255:248] := SaturateSignedWordToSignedByte (SRC2[255:240]);
    DEST[MAXVL-1:256] := 0;

VPACKSSDW Instruction (VEX.256 Encoded Version)
    DEST[15:0] := SaturateSignedDwordToSignedWord (SRC1[31:0]);
    DEST[31:16] := SaturateSignedDwordToSignedWord (SRC1[63:32]);
    DEST[47:32] := SaturateSignedDwordToSignedWord (SRC1[95:64]);
    DEST[63:48] := SaturateSignedDwordToSignedWord (SRC1[127:96]);
    DEST[79:64] := SaturateSignedDwordToSignedWord (SRC2[31:0]);
    DEST[95:80] := SaturateSignedDwordToSignedWord (SRC2[63:32]);
    DEST[111:96] := SaturateSignedDwordToSignedWord (SRC2[95:64]);
    DEST[127:112] := SaturateSignedDwordToSignedWord (SRC2[127:96]);
    DEST[143:128] := SaturateSignedDwordToSignedWord (SRC1[159:128]);
    DEST[159:144] := SaturateSignedDwordToSignedWord (SRC1[191:160]);
    DEST[175:160] := SaturateSignedDwordToSignedWord (SRC1[223:192]);
    DEST[191:176] := SaturateSignedDwordToSignedWord (SRC1[255:224]);
    DEST[207:192] := SaturateSignedDwordToSignedWord (SRC2[159:128]);
    DEST[223:208] := SaturateSignedDwordToSignedWord (SRC2[191:160]);
    DEST[239:224] := SaturateSignedDwordToSignedWord (SRC2[223:192]);
    DEST[255:240] := SaturateSignedDwordToSignedWord (SRC2[255:224]);
    DEST[MAXVL-1:256] := 0;

VPACKSSWB (EVEX Encoded Versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)
TMP_DEST[7:0] := SaturateSignedWordToSignedByte (SRC1[15:0]);
TMP_DEST[15:8] := SaturateSignedWordToSignedByte (SRC1[31:16]);
TMP_DEST[23:16] := SaturateSignedWordToSignedByte (SRC1[47:32]);
TMP_DEST[31:24] := SaturateSignedWordToSignedByte (SRC1[63:48]);
TMP_DEST[39:32] := SaturateSignedWordToSignedByte (SRC1[79:64]);
TMP_DEST[47:40] := SaturateSignedWordToSignedByte (SRC1[95:80]);
TMP_DEST[55:48] := SaturateSignedWordToSignedByte (SRC1[111:96]);
TMP_DEST[63:56] := SaturateSignedWordToSignedByte (SRC1[127:112]);
TMP_DEST[71:64] := SaturateSignedWordToSignedByte (SRC2[15:0]);
TMP_DEST[79:72] := SaturateSignedWordToSignedByte (SRC2[31:16]);
TMP_DEST[87:80] := SaturateSignedWordToSignedByte (SRC2[47:32]);
TMP_DEST[95:88] := SaturateSignedWordToSignedByte (SRC2[63:48]);
TMP_DEST[103:96] := SaturateSignedWordToSignedByte (SRC2[79:64]);
TMP_DEST[111:104] := SaturateSignedWordToSignedByte (SRC2[95:80]);
TMP_DEST[119:112] := SaturateSignedWordToSignedByte (SRC2[111:96]);
TMP_DEST[127:120] := SaturateSignedWordToSignedByte (SRC2[127:112]);
IF VL >= 256

    TMP_DEST[135:128] := SaturateSignedWordToSignedByte (SRC1[143:128]);
    TMP_DEST[143:136] := SaturateSignedWordToSignedByte (SRC1[159:144]);
    TMP_DEST[151:144] := SaturateSignedWordToSignedByte (SRC1[175:160]);
    TMP_DEST[159:152] := SaturateSignedWordToSignedByte (SRC1[191:176]);
    TMP_DEST[167:160] := SaturateSignedWordToSignedByte (SRC1[207:192]);


    TMP_DEST[175:168] := SaturateSignedWordToSignedByte (SRC1[223:208]);
    TMP_DEST[183:176] := SaturateSignedWordToSignedByte (SRC1[239:224]);
    TMP_DEST[191:184] := SaturateSignedWordToSignedByte (SRC1[255:240]);
    TMP_DEST[199:192] := SaturateSignedWordToSignedByte (SRC2[143:128]);
    TMP_DEST[207:200] := SaturateSignedWordToSignedByte (SRC2[159:144]);
    TMP_DEST[215:208] := SaturateSignedWordToSignedByte (SRC2[175:160]);
    TMP_DEST[223:216] := SaturateSignedWordToSignedByte (SRC2[191:176]);
    TMP_DEST[231:224] := SaturateSignedWordToSignedByte (SRC2[207:192]);
    TMP_DEST[239:232] := SaturateSignedWordToSignedByte (SRC2[223:208]);
    TMP_DEST[247:240] := SaturateSignedWordToSignedByte (SRC2[239:224]);
    TMP_DEST[255:248] := SaturateSignedWordToSignedByte (SRC2[255:240]);
FI;
IF VL >= 512
    TMP_DEST[263:256] := SaturateSignedWordToSignedByte (SRC1[271:256]);
    TMP_DEST[271:264] := SaturateSignedWordToSignedByte (SRC1[287:272]);
    TMP_DEST[279:272] := SaturateSignedWordToSignedByte (SRC1[303:288]);
    TMP_DEST[287:280] := SaturateSignedWordToSignedByte (SRC1[319:304]);
    TMP_DEST[295:288] := SaturateSignedWordToSignedByte (SRC1[335:320]);
    TMP_DEST[303:296] := SaturateSignedWordToSignedByte (SRC1[351:336]);
    TMP_DEST[311:304] := SaturateSignedWordToSignedByte (SRC1[367:352]);
    TMP_DEST[319:312] := SaturateSignedWordToSignedByte (SRC1[383:368]);

    TMP_DEST[327:320] := SaturateSignedWordToSignedByte (SRC2[271:256]);
    TMP_DEST[335:328] := SaturateSignedWordToSignedByte (SRC2[287:272]);
    TMP_DEST[343:336] := SaturateSignedWordToSignedByte (SRC2[303:288]);
    TMP_DEST[351:344] := SaturateSignedWordToSignedByte (SRC2[319:304]);
    TMP_DEST[359:352] := SaturateSignedWordToSignedByte (SRC2[335:320]);
    TMP_DEST[367:360] := SaturateSignedWordToSignedByte (SRC2[351:336]);
    TMP_DEST[375:368] := SaturateSignedWordToSignedByte (SRC2[367:352]);
    TMP_DEST[383:376] := SaturateSignedWordToSignedByte (SRC2[383:368]);

    TMP_DEST[391:384] := SaturateSignedWordToSignedByte (SRC1[399:384]);
    TMP_DEST[399:392] := SaturateSignedWordToSignedByte (SRC1[415:400]);
    TMP_DEST[407:400] := SaturateSignedWordToSignedByte (SRC1[431:416]);
    TMP_DEST[415:408] := SaturateSignedWordToSignedByte (SRC1[447:432]);
    TMP_DEST[423:416] := SaturateSignedWordToSignedByte (SRC1[463:448]);
    TMP_DEST[431:424] := SaturateSignedWordToSignedByte (SRC1[479:464]);
    TMP_DEST[439:432] := SaturateSignedWordToSignedByte (SRC1[495:480]);
    TMP_DEST[447:440] := SaturateSignedWordToSignedByte (SRC1[511:496]);

    TMP_DEST[455:448] := SaturateSignedWordToSignedByte (SRC2[399:384]);
    TMP_DEST[463:456] := SaturateSignedWordToSignedByte (SRC2[415:400]);
    TMP_DEST[471:464] := SaturateSignedWordToSignedByte (SRC2[431:416]);
    TMP_DEST[479:472] := SaturateSignedWordToSignedByte (SRC2[447:432]);
    TMP_DEST[487:480] := SaturateSignedWordToSignedByte (SRC2[463:448]);
    TMP_DEST[495:488] := SaturateSignedWordToSignedByte (SRC2[479:464]);
    TMP_DEST[503:496] := SaturateSignedWordToSignedByte (SRC2[495:480]);
    TMP_DEST[511:504] := SaturateSignedWordToSignedByte (SRC2[511:496]);
FI;
FOR j := 0 TO KL-1
    i := j * 8
    IF k1[j] OR *no writemask*

          THEN
                DEST[i+7:i] := TMP_DEST[i+7:i]


     ELSE

         IF *merging-masking*                     ; merging-masking

             THEN *DEST[i+7:i] remains unchanged*

             ELSE *zeroing-masking*               ; zeroing-masking

             DEST[i+7:i] := 0

         FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VPACKSSDW (EVEX Encoded Versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)
FOR j := 0 TO ((KL/2) - 1)

    i := j * 32

    IF (EVEX.b == 1) AND (SRC2 *is memory*)
          THEN
                TMP_SRC2[i+31:i] := SRC2[31:0]
          ELSE
                TMP_SRC2[i+31:i] := SRC2[i+31:i]

    FI;
ENDFOR;

TMP_DEST[15:0] := SaturateSignedDwordToSignedWord (SRC1[31:0]);
TMP_DEST[31:16] := SaturateSignedDwordToSignedWord (SRC1[63:32]);
TMP_DEST[47:32] := SaturateSignedDwordToSignedWord (SRC1[95:64]);
TMP_DEST[63:48] := SaturateSignedDwordToSignedWord (SRC1[127:96]);
TMP_DEST[79:64] := SaturateSignedDwordToSignedWord (TMP_SRC2[31:0]);
TMP_DEST[95:80] := SaturateSignedDwordToSignedWord (TMP_SRC2[63:32]);
TMP_DEST[111:96] := SaturateSignedDwordToSignedWord (TMP_SRC2[95:64]);
TMP_DEST[127:112] := SaturateSignedDwordToSignedWord (TMP_SRC2[127:96]);
IF VL >= 256

    TMP_DEST[143:128] := SaturateSignedDwordToSignedWord (SRC1[159:128]);
    TMP_DEST[159:144] := SaturateSignedDwordToSignedWord (SRC1[191:160]);
    TMP_DEST[175:160] := SaturateSignedDwordToSignedWord (SRC1[223:192]);
    TMP_DEST[191:176] := SaturateSignedDwordToSignedWord (SRC1[255:224]);
    TMP_DEST[207:192] := SaturateSignedDwordToSignedWord (TMP_SRC2[159:128]);
    TMP_DEST[223:208] := SaturateSignedDwordToSignedWord (TMP_SRC2[191:160]);
    TMP_DEST[239:224] := SaturateSignedDwordToSignedWord (TMP_SRC2[223:192]);
    TMP_DEST[255:240] := SaturateSignedDwordToSignedWord (TMP_SRC2[255:224]);
FI;
IF VL >= 512
    TMP_DEST[271:256] := SaturateSignedDwordToSignedWord (SRC1[287:256]);
    TMP_DEST[287:272] := SaturateSignedDwordToSignedWord (SRC1[319:288]);
    TMP_DEST[303:288] := SaturateSignedDwordToSignedWord (SRC1[351:320]);
    TMP_DEST[319:304] := SaturateSignedDwordToSignedWord (SRC1[383:352]);
    TMP_DEST[335:320] := SaturateSignedDwordToSignedWord (TMP_SRC2[287:256]);
    TMP_DEST[351:336] := SaturateSignedDwordToSignedWord (TMP_SRC2[319:288]);
    TMP_DEST[367:352] := SaturateSignedDwordToSignedWord (TMP_SRC2[351:320]);
    TMP_DEST[383:368] := SaturateSignedDwordToSignedWord (TMP_SRC2[383:352]);

TMP_DEST[399:384] := SaturateSignedDwordToSignedWord (SRC1[415:384]);
TMP_DEST[415:400] := SaturateSignedDwordToSignedWord (SRC1[447:416]);
TMP_DEST[431:416] := SaturateSignedDwordToSignedWord (SRC1[479:448]);


     TMP_DEST[447:432] := SaturateSignedDwordToSignedWord (SRC1[511:480]);

     TMP_DEST[463:448] := SaturateSignedDwordToSignedWord (TMP_SRC2[415:384]);

     TMP_DEST[479:464] := SaturateSignedDwordToSignedWord (TMP_SRC2[447:416]);

     TMP_DEST[495:480] := SaturateSignedDwordToSignedWord (TMP_SRC2[479:448]);

     TMP_DEST[511:496] := SaturateSignedDwordToSignedWord (TMP_SRC2[511:480]);

FI;

FOR j := 0 TO KL-1

     i := j * 16

     IF k1[j] OR *no writemask*

          THEN DEST[i+15:i] := TMP_DEST[i+15:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+15:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+15:i] := 0

                  FI

     FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPACKSSDW__m512i _mm512_packs_epi32(__m512i m1, __m512i m2);
VPACKSSDW__m512i _mm512_mask_packs_epi32(__m512i s, __mmask32 k, __m512i m1, __m512i m2);
VPACKSSDW__m512i _mm512_maskz_packs_epi32( __mmask32 k, __m512i m1, __m512i m2);
VPACKSSDW__m256i _mm256_mask_packs_epi32( __m256i s, __mmask16 k, __m256i m1, __m256i m2);
VPACKSSDW__m256i _mm256_maskz_packs_epi32( __mmask16 k, __m256i m1, __m256i m2);
VPACKSSDW__m128i _mm_mask_packs_epi32( __m128i s, __mmask8 k, __m128i m1, __m128i m2);
VPACKSSDW__m128i _mm_maskz_packs_epi32( __mmask8 k, __m128i m1, __m128i m2);
VPACKSSWB__m512i _mm512_packs_epi16(__m512i m1, __m512i m2);
VPACKSSWB__m512i _mm512_mask_packs_epi16(__m512i s, __mmask32 k, __m512i m1, __m512i m2);
VPACKSSWB__m512i _mm512_maskz_packs_epi16( __mmask32 k, __m512i m1, __m512i m2);
VPACKSSWB__m256i _mm256_mask_packs_epi16( __m256i s, __mmask16 k, __m256i m1, __m256i m2);
VPACKSSWB__m256i _mm256_maskz_packs_epi16( __mmask16 k, __m256i m1, __m256i m2);
VPACKSSWB__m128i _mm_mask_packs_epi16( __m128i s, __mmask8 k, __m128i m1, __m128i m2);
VPACKSSWB__m128i _mm_maskz_packs_epi16( __mmask8 k, __m128i m1, __m128i m2);
PACKSSWB __m128i _mm_packs_epi16(__m128i m1, __m128i m2) PACKSSDW __m128i _mm_packs_epi32(__m128i m1, __m128i m2) VPACKSSWB __m256i _mm256_packs_epi16(__m256i m1, __m256i m2) VPACKSSDW __m256i _mm256_packs_epi32(__m256i m1, __m256i m2);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Non-EVEX- instrucción codificada, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".EVEX- codificadoVPACKSSDW, ver Tabla 2-52, "TipoE4NFCondiciones de Excepción de Clase".EVEX- codificadoVPACKSSWB, ver Tipo de ExcepcionesE4NF.nben la tabla 2-52, "TipoE4NFCondiciones de Excepción de Clase".
