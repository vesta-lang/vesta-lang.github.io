---
summary: Calculación de restricción de rango para pares empaquetados de valores de Float64
---

## Descripción

Esta instrucción calcula 2/4/8 salidas de operación de rango de dos conjuntos de valores de doble precisión de entrada empaquetados en el primer operando de origen (el segundo operando) y el segundo operando de origen (el tercer operando). Las salidas de rango están escritas al operando de destino (el primer operando) bajo la máscara de escritura k1.

Bits7:4 de imm8 byte debe ser cero. La salida de operación de rango se realiza en dos partes, cada una configurada por un campo de control de dos bits dentro de imm8[3:0]:

* Imm8[1:0] especifica que la operación de comparación inicial es de un valor máximo, min, máximo absoluto o min

valor absoluto del par de valor de entrada. Cada comparación de dos valores de entrada produce un resultado intermedio que combina con el control de selección de signos (imm8[3:2]) para determinar la salida de operación de rango final.

* Imm8[3:2] especifica el signo de la salida de operación de rango para ser uno de los siguientes:

valor, desde el resultado de comparación, fijado o claro.

The encodings of imm8[1:0] and imm8[3:2] are shown in Figure 5-27.

```text
                           7  6             5        4                       3                     2  1              0
```

imm8

```text
                              Must Be Zero                                      Sign Control (SC)     Compare Operation Select
```

```text
                              Imm8[3:2] = 00b : Select sign(SRC1)                                     Imm8[1:0] = 00b : Select Min value
```

Imm8[1:0] = 01b : Seleccione el valor Max

```text
                              Imm8[3:2] = 01b : Select sign(Compare_Result)                           Imm8[1:0] = 10b : Select Min-Abs value
```

Imm8[1:0] = 11b : Seleccione el valor Max-Abs Imm8[3:2] = 10b : Establecer el signo a 0 Imm8[3:2] = 11b : Establecer el signo a 1

Figura 5-27. Controles Imm8 para VRANGEPD/SD/PS/SS

Cuando uno o más del valor de entrada es un NAN, la operación de comparación puede indicar excepción de operación no válida (IE). Los detalles con uno de más valor de entrada son NAN se enumeran en el cuadro 5-21. Si la comparación eleva un IE, el control selecto del signo (imm8[3:2]) no tiene ningún efecto en la salida de operación de rango; esto se indica también en la tabla 5-21.

Cuando ambos valores de entrada son ceros de signos opuestos, la operación de comparación de MIN/MAX en la operación de comparación de rango es ligeramente diferente de la operación de comparación conceptualmente similar coma flotante MIN/MAX que se encuentran en las instrucciones VMAXPD/VMINPD. Los detalles de la operación MIN/MAX/MIN ABS/MAX ABS para VRANGEPD/PS/SD/SS para la magnitud-0, se enumeran en el cuadro 5-22.

Además, no cero, igualdad de imagen con valores de entrada opuestas realizan operaciones de comparación MIN ABS o MAX ABS con el resultado listado en el cuadro 5-23.

**Signaling of Comparison Operation of One or More NaN Input Values and Effect of Imm8[3:2]**

| Src1 | Src2 | Resultado | IE Signaling Due to Comparison | Imm8[3:2] | Alcance |
| --- | --- | --- | --- | --- | --- |
| sNaN1 | sNaN2 | Quiet(sNaN1) | Sí. | Ignorado |  |
| sNaN1 | qNaN2 | Quiet(sNaN1) | Sí. | Ignorado |  |
| sNaN1 | Norm2 | Quiet(sNaN1) | Sí. | Ignorado |  |
| qNaN1 | sNaN2 | Quieto(sNaN2) | Sí. | Ignorado |  |
| qNaN1 | qNaN2 | qNaN1 | No | Aplicable |  |
| qNaN1 | Norm2 | Norm2 | No | Aplicable |  |
| Norm1 | sNaN2 | Quieto(sNaN2) | Sí. | Ignorado |  |
| Norm1 | qNaN2 | Norm1 | No | Aplicable |  |

** Resultado de comparación para Casos Cero opuestos para MIN, MIN ABS y MAX, MAX ABS**

| Src1 | Src2 | Resultado | Src1 | Src2 | Resultado |
| --- | --- | --- | --- | --- | --- |
| +0 | -0 | -0 | +0 | -0 | +0 |
| -0 | +0 | -0 | -0 | +0 | +0 |

**Comparison Result of Equal-Magnitude Input Cases for MIN_ABS and MAX_ABS, (|a| = |b|, a>0, b<0)**

| Src1 | Src2 | Resultado | Src1 | Src2 | Resultado |
| --- | --- | --- | --- | --- | --- |
| a | b | b | a | b | a |
| b | a | b | b | a | a |

## Operación

```text
RangeDP(SRC1[63:0], SRC2[63:0], CmpOpCtl[1:0], SignSelCtl[1:0])
{

    // Check if SNAN and report IE, see also Table 5-21
    IF (SRC1 = SNAN) THEN RETURN (QNAN(SRC1), set IE);
    IF (SRC2 = SNAN) THEN RETURN (QNAN(SRC2), set IE);

   Src1.exp := SRC1[62:52];
   Src1.fraction := SRC1[51:0];
   IF ((Src1.exp = 0 ) and (Src1.fraction != 0)) THEN// Src1 is a denormal number

         IF DAZ THEN Src1.fraction := 0;
         ELSE IF (SRC2 <> QNAN) Set DE; FI;
   FI;


    Src2.exp := SRC2[62:52];
    Src2.fraction := SRC2[51:0];
    IF ((Src2.exp = 0) and (Src2.fraction !=0 )) THEN// Src2 is a denormal number

          IF DAZ THEN Src2.fraction := 0;
          ELSE IF (SRC1 <> QNAN) Set DE; FI;
    FI;

    IF (SRC2 = QNAN) THEN{TMP[63:0] := SRC1[63:0]}
    ELSE IF(SRC1 = QNAN) THEN{TMP[63:0] := SRC2[63:0]}
    ELSE IF (Both SRC1, SRC2 are magnitude-0 and opposite-signed) TMP[63:0] := from Table 5-22
    ELSE IF (Both SRC1, SRC2 are magnitude-equal and opposite-signed and CmpOpCtl[1:0] > 01) TMP[63:0] := from Table 5-23
    ELSE

          Case(CmpOpCtl[1:0])
          00: TMP[63:0] := (SRC1[63:0]  SRC2[63:0]) ? SRC1[63:0] : SRC2[63:0];
          01: TMP[63:0] := (SRC1[63:0]  SRC2[63:0]) ? SRC2[63:0] : SRC1[63:0];
          10: TMP[63:0] := (ABS(SRC1[63:0])  ABS(SRC2[63:0])) ? SRC1[63:0] : SRC2[63:0];
          11: TMP[63:0] := (ABS(SRC1[63:0])  ABS(SRC2[63:0])) ? SRC2[63:0] : SRC1[63:0];
          ESAC;
    FI;

    Case(SignSelCtl[1:0])
    00: dest := (SRC1[63] << 63) OR (TMP[62:0]);// Preserve Src1 sign bit
    01: dest := TMP[63:0];// Preserve sign of compare result
    10: dest := (0 << 63) OR (TMP[62:0]);// Zero out sign bit
    11: dest := (1 << 63) OR (TMP[62:0]);// Set the sign bit
    ESAC;
    RETURN dest[63:0];
}

CmpOpCtl[1:0]= imm8[1:0];
SignSelCtl[1:0]=imm8[3:2];

VRANGEPD (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b == 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := RangeDP (SRC1[i+63:i], SRC2[63:0], CmpOpCtl[1:0], SignSelCtl[1:0]);

                  ELSE DEST[i+63:i] := RangeDP (SRC1[i+63:i], SRC2[i+63:i], CmpOpCtl[1:0], SignSelCtl[1:0]);

             FI;

ELSE

     IF *merging-masking*                ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                        ; zeroing-masking

                  DEST[i+63:i] = 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

The following example describes a common usage of this instruction for checking that the input operand is
bounded between +/-1023.


VRANGEPD zmm_dst, zmm_src, zmm_1023, 02h;

Where:
            zmm_dst is the destination operand.
            zmm_src is the input operand to compare against +/-1023 (this is SRC1).
            zmm_1023 is the reference operand, contains the value of 1023 (and this is SRC2).
            IMM=02(imm8[1:0]='10) selects the Min Absolute value operation with selection of SRC1.sign.

In case |zmm_src| < 1023 (i.e., SRC1 is smaller than 1023 in magnitude), then its value will be written into
zmm_dst. Otherwise, the value stored in zmm_dst will get the value of 1023 (received on zmm_1023, which is
SRC2).
However, the sign control (imm8[3:2]='00) instructs to select the sign of SRC1 received from zmm_src. So, even
in the case of |zmm_src|  1023, the selected sign of SRC1 is kept.
Thus, if zmm_src < -1023, the result of VRANGEPD will be the minimal value of -1023 while if zmm_src > +1023,
the result of VRANGE will be the maximal value of +1023.
```

## Intel C/C++ compilador intrínseco

```c
VRANGEPD __m512d _mm512_range_pd ( __m512d a, __m512d b, int imm);
VRANGEPD __m512d _mm512_range_round_pd ( __m512d a, __m512d b, int imm, int sae);
VRANGEPD __m512d _mm512_mask_range_pd (__m512 ds, __mmask8 k, __m512d a, __m512d b, int imm);
VRANGEPD __m512d _mm512_mask_range_round_pd (__m512d s, __mmask8 k, __m512d a, __m512d b, int imm, int sae);
VRANGEPD __m512d _mm512_maskz_range_pd ( __mmask8 k, __m512d a, __m512d b, int imm);
VRANGEPD __m512d _mm512_maskz_range_round_pd ( __mmask8 k, __m512d a, __m512d b, int imm, int sae);
VRANGEPD __m256d _mm256_range_pd ( __m256d a, __m256d b, int imm);
VRANGEPD __m256d _mm256_mask_range_pd (__m256d s, __mmask8 k, __m256d a, __m256d b, int imm);
VRANGEPD __m256d _mm256_maskz_range_pd ( __mmask8 k, __m256d a, __m256d b, int imm);
VRANGEPD __m128d _mm_range_pd ( __m128 a, __m128d b, int imm);
VRANGEPD __m128d _mm_mask_range_pd (__m128 s, __mmask8 k, __m128d a, __m128d b, int imm);
VRANGEPD __m128d _mm_maskz_range_pd ( __mmask8 k, __m128d a, __m128d b, int imm);
```

## SIMD coma flotante Excepciones

Invalid, Denormal.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".
