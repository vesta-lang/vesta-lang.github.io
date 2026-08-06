---
summary: Calculación de restricción de rango para pares empaquetados de valores de Float32
---

## Descripción

Esta instrucción calcula 4/8/16 salidas de operación de rango de dos conjuntos de valores de entrada empaquetado de un solo punto de precisión flotante en el primer operando de origen (el segundo operando) y el segundo operando de origen (el tercer operando). Las salidas de rango están escritas al operando de destino (el primer operando) bajo la máscara de escritura k1.

Bits7:4 de imm8 byte debe ser cero. La salida de operación de rango se realiza en dos partes, cada una configurada por un campo de control de dos bits dentro de imm8[3:0]:

* Imm8[1:0] especifica que la operación de comparación inicial es de un valor máximo, min, máximo absoluto o min

valor absoluto del par de valor de entrada. Cada comparación de dos valores de entrada produce un resultado intermedio que combina con el control de selección de signos (imm8[3:2]) para determinar la salida de operación de rango final.

* Imm8[3:2] especifica el signo de la salida de operación de rango para ser uno de los siguientes:

valor, desde el resultado de comparación, fijado o claro.

The encodings of imm8[1:0] and imm8[3:2] are shown in Figure 5-27.

Cuando uno o más del valor de entrada es un NAN, la operación de comparación puede indicar excepción de operación no válida (IE). Los detalles con uno de más valor de entrada son NAN se enumeran en el cuadro 5-21. Si la comparación eleva un IE, el control selecto del signo (imm8[3:2]) no tiene ningún efecto en la salida de operación de rango; esto se indica también en la tabla 5-21.

Cuando ambos valores de entrada son ceros de signos opuestos, la operación de comparación de MIN/MAX en la operación de comparación de rango es ligeramente diferente de la operación de comparación conceptualmente similar coma flotante MIN/MAX que se encuentran en las instrucciones VMAXPD/VMINPD. Los detalles de la operación MIN/MAX/MIN ABS/MAX ABS para VRANGEPD/PS/SD/SS para la magnitud-0, se enumeran en el cuadro 5-22.

Además, no cero, igualdad de imagen con valores de entrada opuestas realizan operaciones de comparación MIN ABS o MAX ABS con el resultado listado en el cuadro 5-23.

## Operación

```text
RangeSP(SRC1[31:0], SRC2[31:0], CmpOpCtl[1:0], SignSelCtl[1:0])
{

    // Check if SNAN and report IE, see also Table 5-21
    IF (SRC1=SNAN) THEN RETURN (QNAN(SRC1), set IE);
    IF (SRC2=SNAN) THEN RETURN (QNAN(SRC2), set IE);

    Src1.exp := SRC1[30:23];
    Src1.fraction := SRC1[22:0];
    IF ((Src1.exp = 0 ) and (Src1.fraction != 0 )) THEN// Src1 is a denormal number

          IF DAZ THEN Src1.fraction := 0;
          ELSE IF (SRC2 <> QNAN) Set DE; FI;
    FI;
    Src2.exp := SRC2[30:23];
    Src2.fraction := SRC2[22:0];
    IF ((Src2.exp = 0 ) and (Src2.fraction != 0 )) THEN// Src2 is a denormal number
          IF DAZ THEN Src2.fraction := 0;
          ELSE IF (SRC1 <> QNAN) Set DE; FI;
    FI;

    IF (SRC2 = QNAN) THEN{TMP[31:0] := SRC1[31:0]}
    ELSE IF(SRC1 = QNAN) THEN{TMP[31:0] := SRC2[31:0]}
    ELSE IF (Both SRC1, SRC2 are magnitude-0 and opposite-signed) TMP[31:0] := from Table 5-22
    ELSE IF (Both SRC1, SRC2 are magnitude-equal and opposite-signed and CmpOpCtl[1:0] > 01) TMP[31:0] := from Table 5-23
    ELSE

          Case(CmpOpCtl[1:0])
          00: TMP[31:0] := (SRC1[31:0]  SRC2[31:0]) ? SRC1[31:0] : SRC2[31:0];
          01: TMP[31:0] := (SRC1[31:0]  SRC2[31:0]) ? SRC2[31:0] : SRC1[31:0];
          10: TMP[31:0] := (ABS(SRC1[31:0])  ABS(SRC2[31:0])) ? SRC1[31:0] : SRC2[31:0];
          11: TMP[31:0] := (ABS(SRC1[31:0])  ABS(SRC2[31:0])) ? SRC2[31:0] : SRC1[31:0];
          ESAC;
    FI;
    Case(SignSelCtl[1:0])
    00: dest := (SRC1[31] << 31) OR (TMP[30:0]);// Preserve Src1 sign bit
    01: dest := TMP[31:0];// Preserve sign of compare result
    10: dest := (0 << 31) OR (TMP[30:0]);// Zero out sign bit
    11: dest := (1 << 31) OR (TMP[30:0]);// Set the sign bit
    ESAC;
    RETURN dest[31:0];
}

CmpOpCtl[1:0]= imm8[1:0];

SignSelCtl[1:0]=imm8[3:2];

VRANGEPS
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask* THEN

                IF (EVEX.b == 1) AND (SRC2 *is memory*)
                      THEN DEST[i+31:i] := RangeSP (SRC1[i+31:i], SRC2[31:0], CmpOpCtl[1:0], SignSelCtl[1:0]);
                      ELSE DEST[i+31:i] := RangeSP (SRC1[i+31:i], SRC2[i+31:i], CmpOpCtl[1:0], SignSelCtl[1:0]);

                FI;


ELSE

     IF *merging-masking*   ; merging-masking

          THEN *DEST[i+31:i] remains unchanged*

          ELSE              ; zeroing-masking

          DEST[i+31:i] = 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

The following example describes a common usage of this instruction for checking that the input operand is
bounded between +/-150.

VRANGEPS zmm_dst, zmm_src, zmm_150, 02h;

Where:
zmm_dst is the destination operand.
zmm_src is the input operand to compare against +/-150.
zmm_150 is the reference operand, contains the value of 150.
IMM=02(imm8[1:0]='10) selects the Min Absolute value operation with selection of src1.sign.

In case |zmm_src| < 150, then its value will be written into zmm_dst. Otherwise, the value stored in zmm_dst
will get the value of 150 (received on zmm_150).

However, the sign control (imm8[3:2]='00) instructs to select the sign of SRC1 received from zmm_src. So, even
in the case of |zmm_src|  150, the selected sign of SRC1 is kept.

Thus, if zmm_src < -150, the result of VRANGEPS will be the minimal value of -150 while if zmm_src > +150,
the result of VRANGE will be the maximal value of +150.
```

## Intel C/C++ compilador intrínseco

```c
VRANGEPS __m512 _mm512_range_ps ( __m512 a, __m512 b, int imm);
VRANGEPS __m512 _mm512_range_round_ps ( __m512 a, __m512 b, int imm, int sae);
VRANGEPS __m512 _mm512_mask_range_ps (__m512 s, __mmask16 k, __m512 a, __m512 b, int imm);
VRANGEPS __m512 _mm512_mask_range_round_ps (__m512 s, __mmask16 k, __m512 a, __m512 b, int imm, int sae);
VRANGEPS __m512 _mm512_maskz_range_ps ( __mmask16 k, __m512 a, __m512 b, int imm);
VRANGEPS __m512 _mm512_maskz_range_round_ps ( __mmask16 k, __m512 a, __m512 b, int imm, int sae);
VRANGEPS __m256 _mm256_range_ps ( __m256 a, __m256 b, int imm);
VRANGEPS __m256 _mm256_mask_range_ps (__m256 s, __mmask8 k, __m256 a, __m256 b, int imm);
VRANGEPS __m256 _mm256_maskz_range_ps ( __mmask8 k, __m256 a, __m256 b, int imm);
VRANGEPS __m128 _mm_range_ps ( __m128 a, __m128 b, int imm);
VRANGEPS __m128 _mm_mask_range_ps (__m128 s, __mmask8 k, __m128 a, __m128 b, int imm);
VRANGEPS __m128 _mm_maskz_range_ps ( __mmask8 k, __m128 a, __m128 b, int imm);
```

## SIMD coma flotante Excepciones

Invalid, Denormal.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".
