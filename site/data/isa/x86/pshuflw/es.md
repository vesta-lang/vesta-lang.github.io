---
summary: Shuffle Packed Low Words
---

## Descripción

Copia las palabras del cuádpago bajo de un carril de 128 bits del operando de origen y las inserta en el cuádpalo bajo del operando de destino en las ubicaciones de palabras (del carril respectivo) seleccionadas con el operando inmediato. La operación de 256 bits es similar a la operación en línea utilizada por la instrucción VPSHUFD de 256 bits, que se ilustra en la Figura 4-16. Para la operación de 128 bits, sólo el carril bajo de 128 bits está operativo. Cada campo de 2 bits en el operando inmediato selecciona el contenido de una palabra ubicación en el cuádpago bajo del operando de destino. Los encodings binarios de los campos el operando inmediato seleccionan palabras (0, 1, 2 o 3) de la palabra baja del operando de origen para ser copiados al operando de destino. El cuádpago alto del operando de origen es copiado al cuádpo alto del operando de destino, por cada carril de 128 bits.

Tenga en cuenta que esta instrucción permite que una palabra en el cuadpacio bajo del operando de origen sea copiada a más de una palabra localización en el cuaderno bajo del operando de destino.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

128-bit Legacy SSE versión: El operando de destino es un registro XMM. El operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: El operando de destino es un registro XMM. El operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

VEX.256 versión codificada: El operando de destino es un registro YMM. El operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits.

EVEX versión codificada: El operando de destino es un registro ZMM/YMM/XMM. El operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria. El destino se actualiza según la máscara de escritura.

Nota: En VEX versiones codificadas, VEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
PSHUFLW (128-bit Legacy SSE Version)
DEST[15:0] := (SRC >> (imm[1:0] *16))[15:0]
DEST[31:16] := (SRC >> (imm[3:2] * 16))[15:0]
DEST[47:32] := (SRC >> (imm[5:4] * 16))[15:0]
DEST[63:48] := (SRC >> (imm[7:6] * 16))[15:0]
DEST[127:64] := SRC[127:64]
DEST[MAXVL-1:128] (Unmodified)

VPSHUFLW (VEX.128 Encoded Version)
DEST[15:0] := (SRC1 >> (imm[1:0] *16))[15:0]
DEST[31:16] := (SRC1 >> (imm[3:2] * 16))[15:0]
DEST[47:32] := (SRC1 >> (imm[5:4] * 16))[15:0]
DEST[63:48] := (SRC1 >> (imm[7:6] * 16))[15:0]
DEST[127:64] := SRC[127:64]
DEST[MAXVL-1:128] := 0

VPSHUFLW (VEX.256 Encoded Version)
DEST[15:0] := (SRC1 >> (imm[1:0] *16))[15:0]
DEST[31:16] := (SRC1 >> (imm[3:2] * 16))[15:0]
DEST[47:32] := (SRC1 >> (imm[5:4] * 16))[15:0]
DEST[63:48] := (SRC1 >> (imm[7:6] * 16))[15:0]
DEST[127:64] := SRC1[127:64]
DEST[143:128] := (SRC1 >> (imm[1:0] *16))[143:128]
DEST[159:144] := (SRC1 >> (imm[3:2] * 16))[143:128]
DEST[175:160] := (SRC1 >> (imm[5:4] * 16))[143:128]
DEST[191:176] := (SRC1 >> (imm[7:6] * 16))[143:128]
DEST[255:192] := SRC1[255:192]
DEST[MAXVL-1:256] := 0

VPSHUFLW (EVEX.U1.512 Encoded Version)
(KL, VL) = (8, 128), (16, 256), (32, 512)
IF VL >= 128

    TMP_DEST[15:0] := (SRC1 >> (imm[1:0] *16))[15:0]
    TMP_DEST[31:16] := (SRC1 >> (imm[3:2] * 16))[15:0]
    TMP_DEST[47:32] := (SRC1 >> (imm[5:4] * 16))[15:0]
    TMP_DEST[63:48] := (SRC1 >> (imm[7:6] * 16))[15:0]
    TMP_DEST[127:64] := SRC1[127:64]
FI;
IF VL >= 256
    TMP_DEST[143:128] := (SRC1 >> (imm[1:0] *16))[143:128]
    TMP_DEST[159:144] := (SRC1 >> (imm[3:2] * 16))[143:128]
    TMP_DEST[175:160] := (SRC1 >> (imm[5:4] * 16))[143:128]
    TMP_DEST[191:176] := (SRC1 >> (imm[7:6] * 16))[143:128]
    TMP_DEST[255:192] := SRC1[255:192]
FI;
IF VL >= 512
    TMP_DEST[271:256] := (SRC1 >> (imm[1:0] *16))[271:256]
    TMP_DEST[287:272] := (SRC1 >> (imm[3:2] * 16))[271:256]
    TMP_DEST[303:288] := (SRC1 >> (imm[5:4] * 16))[271:256]
    TMP_DEST[319:304] := (SRC1 >> (imm[7:6] * 16))[271:256]
    TMP_DEST[383:320] := SRC1[383:320]


    TMP_DEST[399:384] := (SRC1 >> (imm[1:0] *16))[399:384]
    TMP_DEST[415:400] := (SRC1 >> (imm[3:2] * 16))[399:384]
    TMP_DEST[431:416] := (SRC1 >> (imm[5:4] * 16))[399:384]
    TMP_DEST[447:432] := (SRC1 >> (imm[7:6] * 16))[399:384]
    TMP_DEST[511:448] := SRC1[511:448]
FI;

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := TMP_DEST[i+15:i];

     ELSE

             IF *merging-masking*            ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*      ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPSHUFLW __m512i _mm512_shufflelo_epi16(__m512i a, int n);
VPSHUFLW __m512i _mm512_mask_shufflelo_epi16(__m512i s, __mmask16 k, __m512i a, int n );
VPSHUFLW __m512i _mm512_maskz_shufflelo_epi16( __mmask16 k, __m512i a, int n );
VPSHUFLW __m256i _mm256_mask_shufflelo_epi16(__m256i s, __mmask8 k, __m256i a, int n );
VPSHUFLW __m256i _mm256_maskz_shufflelo_epi16( __mmask8 k, __m256i a, int n );
VPSHUFLW __m128i _mm_mask_shufflelo_epi16(__m128i s, __mmask8 k, __m128i a, int n );
VPSHUFLW __m128i _mm_maskz_shufflelo_epi16( __mmask8 k, __m128i a, int n );
(V)PSHUFLW:__m128i _mm_shufflelo_epi16(__m128i a, int n) VPSHUFLW:__m256i _mm256_shufflelo_epi16(__m256i a, const int n);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

EVEX-encoded instruction, ver Excepciones Tipo E4NF.nb en la tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."

Additionally:

```text
#UD                    If VEX.vvvv != 1111B, or EVEX.vvvv != 1111B.
```
