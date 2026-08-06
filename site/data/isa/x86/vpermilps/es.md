---
summary: Permute In-Lane of Quadruples of valores en coma flotante de precisión simple
---

## Descripción

Versión de control variable:

Cuádruples Permute de valores en coma flotante de precisión simple en el primer operando de origen (segundo operando), cada cuádruple utilizando un campo de control de 2 bits en el elemento dword correspondiente del segundo operando de origen. Los resultados permutados se almacenan en el operando de destino (primer operando).

Los campos de control de 2 bits están ubicados en los dos pedazos bajos de cada elemento dword (ver Figura 5-26). Cada control determina cuál del elemento fuente en un cuádruplo de entrada es seleccionado para el elemento de destino. Cada cuádruple de elementos fuente debe estar en la misma región de 128 bits que el destino.

EVEX versión: El segundo operando de origen (tercer operando) es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits. Los resultados permutados se escriben en el destino bajo la máscara de escritura.

SRC1 X7       X6  X5           X4      X3       X2                                  X1           X0

DEST X7 .. X4 X7 .. X4 X7 .. X4 X7 .. X4 X3 ..X0 X3 ..X0 X3 .. X0 X3 .. X0

Figura 5-25. Operación VPERMILPS

255               226 225 224      63                                               34 33 32 31             Bit

```text
     ignored      sel . . .            ignored                                            sel    ignored  10
```

sel

```text
         Control Field 7                   Control Field 2                                           Control Field 1
```

Figura 5-26. Control de Shuffle VPERMILPS

(versión de control inmediata)

Cuádruples Permute de valores en coma flotante de precisión simple en el primer operando de origen (segundo operando), cada cuádruple utilizando un campo de control de 2 bits en el byte imm8. Cada carril de 128 bits en el operando de destino (primer operando) utiliza los cuatro campos de control del mismo byte imm8.

VEX versión: El operando de origen es un registro YMM/XMM o un 256/128-bit ubicación de memoria y el operando de destino es un registro YMM/XMM.

EVEX versión: El operando de origen (segundo operando) es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits. Los resultados permutados se escriben en el destino bajo la máscara de escritura.

Nota: Para la versión imm8, VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b de otra manera la instrucción será

```text
#UD.
```

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

VPERMILPS (EVEX immediate versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF (EVEX.b = 1) AND (SRC1 *is memory*)

          THEN TMP_SRC1[i+31:i] := SRC1[31:0];
          ELSE TMP_SRC1[i+31:i] := SRC1[i+31:i];
    FI;
ENDFOR;

TMP_DEST[31:0] := Select4(TMP_SRC1[127:0], imm8[1:0]);

TMP_DEST[63:32] := Select4(TMP_SRC1[127:0], imm8[3:2]);

TMP_DEST[95:64] := Select4(TMP_SRC1[127:0], imm8[5:4]);

TMP_DEST[127:96] := Select4(TMP_SRC1[127:0], imm8[7:6]); FI;

IF VL >= 256

     TMP_DEST[159:128] := Select4(TMP_SRC1[255:128], imm8[1:0]); FI;

     TMP_DEST[191:160] := Select4(TMP_SRC1[255:128], imm8[3:2]); FI;

     TMP_DEST[223:192] := Select4(TMP_SRC1[255:128], imm8[5:4]); FI;

     TMP_DEST[255:224] := Select4(TMP_SRC1[255:128], imm8[7:6]); FI;

FI;

IF VL >= 512

     TMP_DEST[287:256] := Select4(TMP_SRC1[383:256], imm8[1:0]); FI;

     TMP_DEST[319:288] := Select4(TMP_SRC1[383:256], imm8[3:2]); FI;

     TMP_DEST[351:320] := Select4(TMP_SRC1[383:256], imm8[5:4]); FI;

     TMP_DEST[383:352] := Select4(TMP_SRC1[383:256], imm8[7:6]); FI;

     TMP_DEST[415:384] := Select4(TMP_SRC1[511:384], imm8[1:0]); FI;

     TMP_DEST[447:416] := Select4(TMP_SRC1[511:384], imm8[3:2]); FI;

     TMP_DEST[479:448] := Select4(TMP_SRC1[511:384], imm8[5:4]); FI;

     TMP_DEST[511:480] := Select4(TMP_SRC1[511:384], imm8[7:6]); FI;

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE DEST[i+31:i] := 0     ;zeroing-masking

                  FI;

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VPERMILPS (256-bit immediate version)
DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);
DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);
DEST[95:64] := Select4(SRC1[127:0], imm8[5:4]);
DEST[127:96] := Select4(SRC1[127:0], imm8[7:6]);
DEST[159:128] := Select4(SRC1[255:128], imm8[1:0]);
DEST[191:160] := Select4(SRC1[255:128], imm8[3:2]);
DEST[223:192] := Select4(SRC1[255:128], imm8[5:4]);
DEST[255:224] := Select4(SRC1[255:128], imm8[7:6]);

VPERMILPS (128-bit immediate version)
DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);
DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);
DEST[95:64] := Select4(SRC1[127:0], imm8[5:4]);
DEST[127:96] := Select4(SRC1[127:0], imm8[7:6]);
DEST[MAXVL-1:128] := 0

VPERMILPS (EVEX variable versions)

(KL, VL) = (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0];

          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i];

     FI;

ENDFOR;

TMP_DEST[31:0] := Select4(SRC1[127:0], TMP_SRC2[1:0]);

TMP_DEST[63:32] := Select4(SRC1[127:0], TMP_SRC2[33:32]);

TMP_DEST[95:64] := Select4(SRC1[127:0], TMP_SRC2[65:64]);

TMP_DEST[127:96] := Select4(SRC1[127:0], TMP_SRC2[97:96]);

IF VL >= 256

     TMP_DEST[159:128] := Select4(SRC1[255:128], TMP_SRC2[129:128]);

     TMP_DEST[191:160] := Select4(SRC1[255:128], TMP_SRC2[161:160]);

     TMP_DEST[223:192] := Select4(SRC1[255:128], TMP_SRC2[193:192]);

     TMP_DEST[255:224] := Select4(SRC1[255:128], TMP_SRC2[225:224]);

FI;

IF VL >= 512

     TMP_DEST[287:256] := Select4(SRC1[383:256], TMP_SRC2[257:256]);

     TMP_DEST[319:288] := Select4(SRC1[383:256], TMP_SRC2[289:288]);

     TMP_DEST[351:320] := Select4(SRC1[383:256], TMP_SRC2[321:320]);

     TMP_DEST[383:352] := Select4(SRC1[383:256], TMP_SRC2[353:352]);

     TMP_DEST[415:384] := Select4(SRC1[511:384], TMP_SRC2[385:384]);

     TMP_DEST[447:416] := Select4(SRC1[511:384], TMP_SRC2[417:416]);

     TMP_DEST[479:448] := Select4(SRC1[511:384], TMP_SRC2[449:448]);

     TMP_DEST[511:480] := Select4(SRC1[511:384], TMP_SRC2[481:480]);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE DEST[i+31:i] := 0             ;zeroing-masking


                FI;
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VPERMILPS (256-bit variable version)
DEST[31:0] := Select4(SRC1[127:0], SRC2[1:0]);
DEST[63:32] := Select4(SRC1[127:0], SRC2[33:32]);
DEST[95:64] := Select4(SRC1[127:0], SRC2[65:64]);
DEST[127:96] := Select4(SRC1[127:0], SRC2[97:96]);
DEST[159:128] := Select4(SRC1[255:128], SRC2[129:128]);
DEST[191:160] := Select4(SRC1[255:128], SRC2[161:160]);
DEST[223:192] := Select4(SRC1[255:128], SRC2[193:192]);
DEST[255:224] := Select4(SRC1[255:128], SRC2[225:224]);
DEST[MAXVL-1:256] := 0

VPERMILPS (128-bit variable version)
DEST[31:0] := Select4(SRC1[127:0], SRC2[1:0]);
DEST[63:32] := Select4(SRC1[127:0], SRC2[33:32]);
DEST[95:64] :=Select4(SRC1[127:0], SRC2[65:64]);
DEST[127:96] := Select4(SRC1[127:0], SRC2[97:96]);
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPERMILPS __m512 _mm512_permute_ps( __m512 a, int imm);
VPERMILPS __m512 _mm512_mask_permute_ps(__m512 s, __mmask16 k, __m512 a, int imm);
VPERMILPS __m512 _mm512_maskz_permute_ps( __mmask16 k, __m512 a, int imm);
VPERMILPS __m256 _mm256_mask_permute_ps(__m256 s, __mmask8 k, __m256 a, int imm);
VPERMILPS __m256 _mm256_maskz_permute_ps( __mmask8 k, __m256 a, int imm);
VPERMILPS __m128 _mm_mask_permute_ps(__m128 s, __mmask8 k, __m128 a, int imm);
VPERMILPS __m128 _mm_maskz_permute_ps( __mmask8 k, __m128 a, int imm);
VPERMILPS __m512 _mm512_permutevar_ps( __m512i i, __m512 a);
VPERMILPS __m512 _mm512_mask_permutevar_ps(__m512 s, __mmask16 k, __m512i i, __m512 a);
VPERMILPS __m512 _mm512_maskz_permutevar_ps( __mmask16 k, __m512i i, __m512 a);
VPERMILPS __m256 _mm256_mask_permutevar_ps(__m256 s, __mmask8 k, __m256 i, __m256 a);
VPERMILPS __m256 _mm256_maskz_permutevar_ps( __mmask8 k, __m256 i, __m256 a);
VPERMILPS __m128 _mm_mask_permutevar_ps(__m128 s, __mmask8 k, __m128 i, __m128 a);
VPERMILPS __m128 _mm_maskz_permutevar_ps( __mmask8 k, __m128 i, __m128 a);
VPERMILPS __m128 _mm_permute_ps (__m128 a, int control);
VPERMILPS __m256 _mm256_permute_ps (__m256 a, int control);
VPERMILPS __m128 _mm_permutevar_ps (__m128 a, __m128i control);
VPERMILPS __m256 _mm256_permutevar_ps (__m256 a, __m256i control);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Additionally:

```text
#UD                    If VEX.W = 1.
```

Instrucciones codificadas por EVEX, ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."

Additionally:

```text
#UD                    If either (E)VEX.vvvv != 1111B and with imm8.
```
