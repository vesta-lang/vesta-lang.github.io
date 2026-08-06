---
summary: Elementos Permute coma flotante de precisión doble
---

## Descripción

La versión imm8: Copia elementos de cuaderno de valores de doble precisión flotante-punto del operado fuente (el segundo operando) al operado de destino (el primer operando) de acuerdo con los índices especificados por el operado inmediato (el tercer operando). Cada valor de dos bits en el byte inmediato selecciona un elemento qword en el operando de origen.

VEX versión: El operando de origen puede ser un registro YMM o una ubicación de memoria. Bits (MAXVL-1:256) del registro de destino correspondiente se ponen a cero.

En EVEX.512 versión codificada, los elementos del destino se actualizan utilizando la máscara de escritura k1 y los bits imm8 se reutilizan como bits de control para la mitad superior de 256 bits cuando los bits de control vienen de inmediato. El operando de origen puede ser un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 64 bits.

Las versiones imm8: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

La versión de control vectorial: Copia elementos de cuadrilátero de valores de doble precisión flotante-punto de la segunda fuente operand (el tercer operand) al destino operand (el primer operand) de acuerdo con los índices de la primera fuente operand (el segundo operand). Los primeros 3 bits de cada elemento de 64 bits en el índice operando selecciona qué cuadword en el segundo operando de origen para copiar. El primero y segundo operandos son los registros ZMM, el tercer operando puede ser un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 64 bits. Los elementos del destino se actualizan utilizando la máscara de escritura k1.

Tenga en cuenta que esta instrucción permite que un qword en el operando de origen sea copiado a múltiples ubicaciones en el operando de destino.

Si VPERMPD está codificado con VEX.L= 0, un intento de ejecutar la instrucción codificada con VEX.L= 0 causará un

```text
#UD exception.
```

## Operación

```text
VPERMPD (EVEX - imm8 control forms)
(KL, VL) = (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF (EVEX.b = 1) AND (SRC *is memory*)

          THEN TMP_SRC[i+63:i] := SRC[63:0];
          ELSE TMP_SRC[i+63:i] := SRC[i+63:i];
    FI;
ENDFOR;

TMP_DEST[63:0] := (TMP_SRC[256:0] >> (IMM8[1:0] * 64))[63:0];

TMP_DEST[127:64] := (TMP_SRC[256:0] >> (IMM8[3:2] * 64))[63:0];

TMP_DEST[191:128] := (TMP_SRC[256:0] >> (IMM8[5:4] * 64))[63:0];

TMP_DEST[255:192] := (TMP_SRC[256:0] >> (IMM8[7:6] * 64))[63:0];

IF VL >= 512

     TMP_DEST[319:256] := (TMP_SRC[511:256] >> (IMM8[1:0] * 64))[63:0];

     TMP_DEST[383:320] := (TMP_SRC[511:256] >> (IMM8[3:2] * 64))[63:0];

     TMP_DEST[447:384] := (TMP_SRC[511:256] >> (IMM8[5:4] * 64))[63:0];

     TMP_DEST[511:448] := (TMP_SRC[511:256] >> (IMM8[7:6] * 64))[63:0];

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE                      ; zeroing-masking

                       DEST[i+63:i] := 0                      ;zeroing-masking

                  FI;

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VPERMPD (EVEX - vector control forms)
(KL, VL) = (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0];
          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i];
    FI;
ENDFOR;

IF VL = 256

     TMP_DEST[63:0] := (TMP_SRC2[255:0] >> (SRC1[1:0] * 64))[63:0];

     TMP_DEST[127:64] := (TMP_SRC2[255:0] >> (SRC1[65:64] * 64))[63:0];

     TMP_DEST[191:128] := (TMP_SRC2[255:0] >> (SRC1[129:128] * 64))[63:0];

     TMP_DEST[255:192] := (TMP_SRC2[255:0] >> (SRC1[193:192] * 64))[63:0];

FI;

IF VL = 512

     TMP_DEST[63:0] := (TMP_SRC2[511:0] >> (SRC1[2:0] * 64))[63:0];

     TMP_DEST[127:64] := (TMP_SRC2[511:0] >> (SRC1[66:64] * 64))[63:0];

     TMP_DEST[191:128] := (TMP_SRC2[511:0] >> (SRC1[130:128] * 64))[63:0];

     TMP_DEST[255:192] := (TMP_SRC2[511:0] >> (SRC1[194:192] * 64))[63:0];

     TMP_DEST[319:256] := (TMP_SRC2[511:0] >> (SRC1[258:256] * 64))[63:0];

     TMP_DEST[383:320] := (TMP_SRC2[511:0] >> (SRC1[322:320] * 64))[63:0];

     TMP_DEST[447:384] := (TMP_SRC2[511:0] >> (SRC1[386:384] * 64))[63:0];

     TMP_DEST[511:448] := (TMP_SRC2[511:0] >> (SRC1[450:448] * 64))[63:0];

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*            ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE                       ; zeroing-masking

                       DEST[i+63:i] := 0                      ;zeroing-masking

                  FI;

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPERMPD (VEX.256 encoded version)
DEST[63:0] := (SRC[255:0] >> (IMM8[1:0] * 64))[63:0];
DEST[127:64] := (SRC[255:0] >> (IMM8[3:2] * 64))[63:0];
DEST[191:128] := (SRC[255:0] >> (IMM8[5:4] * 64))[63:0];
DEST[255:192] := (SRC[255:0] >> (IMM8[7:6] * 64))[63:0];
DEST[MAXVL-1:256] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPERMPD __m512d _mm512_permutex_pd( __m512d a, int imm);
VPERMPD __m512d _mm512_mask_permutex_pd(__m512d s, __mmask16 k, __m512d a, int imm);
VPERMPD __m512d _mm512_maskz_permutex_pd( __mmask16 k, __m512d a, int imm);
VPERMPD __m512d _mm512_permutexvar_pd( __m512i i, __m512d a);
VPERMPD __m512d _mm512_mask_permutexvar_pd(__m512d s, __mmask16 k, __m512i i, __m512d a);
VPERMPD __m512d _mm512_maskz_permutexvar_pd( __mmask16 k, __m512i i, __m512d a);
VPERMPD __m256d _mm256_permutex_epi64( __m256d a, int imm);
VPERMPD __m256d _mm256_mask_permutex_epi64(__m256i s, __mmask8 k, __m256d a, int imm);
VPERMPD __m256d _mm256_maskz_permutex_epi64( __mmask8 k, __m256d a, int imm);
VPERMPD __m256d _mm256_permutexvar_epi64( __m256i i, __m256d a);
VPERMPD __m256d _mm256_mask_permutexvar_epi64(__m256i s, __mmask8 k, __m256i i, __m256d a);
VPERMPD __m256d _mm256_maskz_permutexvar_epi64( __mmask8 k, __m256i i, __m256d a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción"; adicionalmente:

```text
#UD               If VEX.L = 0.
```

If VEX.vvvv != 1111B.

Instrucciones codificadas por EVEX, ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción"; adicionalmente:

```text
#UD               If encoded with EVEX.128.
```

Si EVEX.vvvv != 1111B y con imm8.
