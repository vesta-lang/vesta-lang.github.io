---
summary: Empaquetado Interleave Shuffle de Quadruplets de valores en coma flotante de precisión simple
---

## Descripción

Selecciona un valor en coma flotante de precisión simple de un cuádruplo de entrada utilizando un control de dos bits y pasar a un elemento designado del operando de destino. Cada elemento-pair de 64 bits de un carril de 128 bits del operando de destino está entrelazado entre el carril correspondiente del primer operando de origen y el segundo operando de origen en la granularidad 128 bits. Cada dos bits en el byte imm8, a partir del bit 0, es el control selecto del elemento correspondiente de un carril de 128 bits del destino para recibir el resultado de un cuádruplo de entrada. Los dos elementos inferiores de un carril de 128 bits en el destino reciben los resultados de la cuádruple del primer operando de origen. Los próximos dos elementos del destino reciben resultados de la cuádruple del segundo operando de origen.

EVEX versiones codificadas: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro ZMM/YMM/XMM actualizado según la máscara de escritura. imm8[7:0] proporciona 4 controles selectos para cada carril de 128 bits aplicable del destino.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM. Imm8[7:0] ofrece 4 controles selectos para el alto y bajo 128 bits del destino.

VEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero. Imm8[7:0] proporciona 4 controles selectos para cada elemento del destino.

128-bit Legacy SSE versión: La fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente no son modificados. Imm8[7:0] proporciona 4 controles selectos para cada elemento del destino.

SRC1 X7  X6  X5  X4  X3  X2                                                                 X1  X0

SRC2 Y7  Y6  Y5  Y4  Y3  Y2                                                                 Y1  Y0

DEST Y7 .. Y4 Y7 .. Y4 X7 .. X4 X7 .. X4 Y3 ..Y0 Y3 ..Y0 X3 .. X0 X3 .. X0

Figura 4-26. 256-bit VSHUFPS Funcionamiento de Selección en Quadruplet Input y Resultado Interleavado Par-wise

## Operación

```text
Select4(SRC, control) {
CASE (control[1:0]) OF

    0: TMP := SRC[31:0];
    1: TMP := SRC[63:32];
    2: TMP := SRC[95:64];
    3: TMP := SRC[127:96];
ESAC;
RETURN TMP
}

VPSHUFPS (EVEX Encoded Versions When SRC2 is a Vector Register)
(KL, VL) = (4, 128), (8, 256), (16, 512)

TMP_DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);
TMP_DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);
TMP_DEST[95:64] := Select4(SRC2[127:0], imm8[5:4]);
TMP_DEST[127:96] := Select4(SRC2[127:0], imm8[7:6]);
IF VL >= 256

    TMP_DEST[159:128] := Select4(SRC1[255:128], imm8[1:0]);
    TMP_DEST[191:160] := Select4(SRC1[255:128], imm8[3:2]);
    TMP_DEST[223:192] := Select4(SRC2[255:128], imm8[5:4]);
    TMP_DEST[255:224] := Select4(SRC2[255:128], imm8[7:6]);
FI;
IF VL >= 512
    TMP_DEST[287:256] := Select4(SRC1[383:256], imm8[1:0]);
    TMP_DEST[319:288] := Select4(SRC1[383:256], imm8[3:2]);
    TMP_DEST[351:320] := Select4(SRC2[383:256], imm8[5:4]);
    TMP_DEST[383:352] := Select4(SRC2[383:256], imm8[7:6]);
    TMP_DEST[415:384] := Select4(SRC1[511:384], imm8[1:0]);
    TMP_DEST[447:416] := Select4(SRC1[511:384], imm8[3:2]);
    TMP_DEST[479:448] := Select4(SRC2[511:384], imm8[5:4]);
    TMP_DEST[511:480] := Select4(SRC2[511:384], imm8[7:6]);
FI;
FOR j := 0 TO KL-1
    i := j * 32
    IF k1[j] OR *no writemask*


          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*         ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSHUFPS (EVEX Encoded Versions When SRC2 is Memory)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF (EVEX.b = 1)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]

          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]

     FI;

ENDFOR;

TMP_DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);

TMP_DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);

TMP_DEST[95:64] := Select4(TMP_SRC2[127:0], imm8[5:4]);

TMP_DEST[127:96] := Select4(TMP_SRC2[127:0], imm8[7:6]);

IF VL >= 256

     TMP_DEST[159:128] := Select4(SRC1[255:128], imm8[1:0]);

     TMP_DEST[191:160] := Select4(SRC1[255:128], imm8[3:2]);

     TMP_DEST[223:192] := Select4(TMP_SRC2[255:128], imm8[5:4]);

     TMP_DEST[255:224] := Select4(TMP_SRC2[255:128], imm8[7:6]);

FI;

IF VL >= 512

     TMP_DEST[287:256] := Select4(SRC1[383:256], imm8[1:0]);

     TMP_DEST[319:288] := Select4(SRC1[383:256], imm8[3:2]);

     TMP_DEST[351:320] := Select4(TMP_SRC2[383:256], imm8[5:4]);

     TMP_DEST[383:352] := Select4(TMP_SRC2[383:256], imm8[7:6]);

     TMP_DEST[415:384] := Select4(SRC1[511:384], imm8[1:0]);

     TMP_DEST[447:416] := Select4(SRC1[511:384], imm8[3:2]);

     TMP_DEST[479:448] := Select4(TMP_SRC2[511:384], imm8[5:4]);

     TMP_DEST[511:480] := Select4(TMP_SRC2[511:384], imm8[7:6]);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*         ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VSHUFPS (VEX.256 Encoded Version)
DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);
DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);
DEST[95:64] := Select4(SRC2[127:0], imm8[5:4]);
DEST[127:96] := Select4(SRC2[127:0], imm8[7:6]);
DEST[159:128] := Select4(SRC1[255:128], imm8[1:0]);
DEST[191:160] := Select4(SRC1[255:128], imm8[3:2]);
DEST[223:192] := Select4(SRC2[255:128], imm8[5:4]);
DEST[255:224] := Select4(SRC2[255:128], imm8[7:6]);
DEST[MAXVL-1:256] := 0

VSHUFPS (VEX.128 Encoded Version)
DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);
DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);
DEST[95:64] := Select4(SRC2[127:0], imm8[5:4]);
DEST[127:96] := Select4(SRC2[127:0], imm8[7:6]);
DEST[MAXVL-1:128] := 0

SHUFPS (128-bit Legacy SSE Version)
DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);
DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);
DEST[95:64] := Select4(SRC2[127:0], imm8[5:4]);
DEST[127:96] := Select4(SRC2[127:0], imm8[7:6]);
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VSHUFPS __m512 _mm512_shuffle_ps(__m512 a, __m512 b, int imm);
VSHUFPS __m512 _mm512_mask_shuffle_ps(__m512 s, __mmask16 k, __m512 a, __m512 b, int imm);
VSHUFPS __m512 _mm512_maskz_shuffle_ps(__mmask16 k, __m512 a, __m512 b, int imm);
VSHUFPS __m256 _mm256_shuffle_ps (__m256 a, __m256 b, const int select);
VSHUFPS __m256 _mm256_mask_shuffle_ps(__m256 s, __mmask8 k, __m256 a, __m256 b, int imm);
VSHUFPS __m256 _mm256_maskz_shuffle_ps(__mmask8 k, __m256 a, __m256 b, int imm);
SHUFPS __m128 _mm_shuffle_ps (__m128 a, __m128 b, const int select);
VSHUFPS __m128 _mm_mask_shuffle_ps(__m128 s, __mmask8 k, __m128 a, __m128 b, int imm);
VSHUFPS __m128 _mm_maskz_shuffle_ps(__mmask8 k, __m128 a, __m128 b, int imm);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."
