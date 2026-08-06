---
summary: Permute Packed Doubleword/Word Elements
---

## Descripción

Copies doublewords (o palabras) del segundo operando de origen (el tercer operando) al operando de destino (el primer operando) según los índices en el primer operando de origen (el segundo operando). Tenga en cuenta que esta instrucción permite copiar una palabra doble (palabra) en el operando de origen a más de una ubicación en el operando de destino.

VEX.256 codificado VPERMD: El primero y segundo operandos son registros YMM, el tercer operando puede ser un registro YMM o ubicación de memoria. Bits (MAXVL-1:256) del registro de destino correspondiente se ponen a cero.

EVEX codificado VPERMD: El primero y segundo operandos son los registros ZMM/YMM, el tercer operando puede ser un registro ZMM/YMM, una ubicación de memoria de 512/256 bits o un vector de 512/256 bits emitido desde una ubicación de memoria de 32 bits. Los elementos del destino se actualizan utilizando la máscara de escritura k1.

VPERMW: primero y segundo operandos son ZMM/YMM/XMM registros, el tercer operando puede ser un ZMM/YMM/XMM registro, o un 512/256/128-bit ubicación de memoria. El destino se actualiza utilizando la máscara de escritura k1.

EVEX.128 versiones codificadas: Bits (MAXVL-1:128) del registro ZMM correspondiente se ponen a cero.

## Operación

```text
VPERMD (EVEX encoded versions)

(KL, VL) = (8, 256), (16, 512)

IF VL = 256 THEN n := 2; FI;

IF VL = 512 THEN n := 3; FI;

FOR j := 0 TO KL-1

i := j * 32

id := 32*SRC1[i+n:i]

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+31:i] := SRC2[31:0];

                  ELSE DEST[i+31:i] := SRC2[id+31:id];

             FI;

     ELSE

             IF *merging-masking*          ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                     ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPERMD (VEX.256 encoded version)
DEST[31:0] := (SRC2[255:0] >> (SRC1[2:0] * 32))[31:0];
DEST[63:32] := (SRC2[255:0] >> (SRC1[34:32] * 32))[31:0];
DEST[95:64] := (SRC2[255:0] >> (SRC1[66:64] * 32))[31:0];
DEST[127:96] := (SRC2[255:0] >> (SRC1[98:96] * 32))[31:0];
DEST[159:128] := (SRC2[255:0] >> (SRC1[130:128] * 32))[31:0];
DEST[191:160] := (SRC2[255:0] >> (SRC1[162:160] * 32))[31:0];
DEST[223:192] := (SRC2[255:0] >> (SRC1[194:192] * 32))[31:0];
DEST[255:224] := (SRC2[255:0] >> (SRC1[226:224] * 32))[31:0];
DEST[MAXVL-1:256] := 0

VPERMW (EVEX encoded versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

IF VL = 128 THEN n := 2; FI;

IF VL = 256 THEN n := 3; FI;

IF VL = 512 THEN n := 4; FI;

FOR j := 0 TO KL-1

i := j * 16

id := 16*SRC1[i+n:i]

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SRC2[id+15:id]

     ELSE

             IF *merging-masking*          ; merging-masking

                  THEN *DEST[i+15:i] remains unchanged*

                  ELSE                     ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPERMD __m512i _mm512_permutexvar_epi32( __m512i idx, __m512i a);
VPERMD __m512i _mm512_mask_permutexvar_epi32(__m512i s, __mmask16 k, __m512i idx, __m512i a);
VPERMD __m512i _mm512_maskz_permutexvar_epi32( __mmask16 k, __m512i idx, __m512i a);
VPERMD __m256i _mm256_permutexvar_epi32( __m256i idx, __m256i a);
VPERMD __m256i _mm256_mask_permutexvar_epi32(__m256i s, __mmask8 k, __m256i idx, __m256i a);
VPERMD __m256i _mm256_maskz_permutexvar_epi32( __mmask8 k, __m256i idx, __m256i a);
VPERMW __m512i _mm512_permutexvar_epi16( __m512i idx, __m512i a);
VPERMW __m512i _mm512_mask_permutexvar_epi16(__m512i s, __mmask32 k, __m512i idx, __m512i a);
VPERMW __m512i _mm512_maskz_permutexvar_epi16( __mmask32 k, __m512i idx, __m512i a);
VPERMW __m256i _mm256_permutexvar_epi16( __m256i idx, __m256i a);
VPERMW __m256i _mm256_mask_permutexvar_epi16(__m256i s, __mmask16 k, __m256i idx, __m256i a);
VPERMW __m256i _mm256_maskz_permutexvar_epi16( __mmask16 k, __m256i idx, __m256i a);
VPERMW __m128i _mm_permutexvar_epi16( __m128i idx, __m128i a);
VPERMW __m128i _mm_mask_permutexvar_epi16(__m128i s, __mmask8 k, __m128i idx, __m128i a);
VPERMW __m128i _mm_maskz_permutexvar_epi16( __mmask8 k, __m128i idx, __m128i a);
```

## SIMD coma flotante Excepciones

None

## Otras excepciones

Non-EVEX- instrucción codificada, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".EVEX- codificadoVPERMD, ver Tabla 2-52, "TipoE4NFCondiciones de Excepción de Clase".EVEX- codificadoVPERMW, ver Tipo de ExcepcionesE4NF.nben la tabla 2-52, "TipoE4NFCondiciones de Excepción de Clase".

Additionally:

```text
#UD               If VEX.L = 0.
```

If EVEX.L'L = 0 for VPERMD.
