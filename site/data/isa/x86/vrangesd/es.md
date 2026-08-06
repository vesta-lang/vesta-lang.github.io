---
summary: Calculación de restricción de rango De un par de valores de flotación escalar
---

## Descripción

Esta instrucción calcula una salida de operación de rango de dos entradas valores en coma flotante de precisión doble en el elemento de baja palabra del primer operando de origen (el segundo operando) y segundo operando de origen (el tercer operando). La salida de rango está escrita al elemento de qword bajo del operando de destino (el primer operando) bajo la máscara de escritura k1.

Bits7:4 de imm8 byte debe ser cero. La salida de operación de rango se realiza en dos partes, cada una configurada por un campo de control de dos bits dentro de imm8[3:0]:

* Imm8[1:0] especifica que la operación de comparación inicial es de un valor máximo, min, máximo absoluto o min

valor absoluto del par de valor de entrada. Cada comparación de dos valores de entrada produce un resultado intermedio que combina con el control de selección de signos (imm8[3:2]) para determinar la salida de operación de rango final.

* Imm8[3:2] especifica el signo de la salida de operación de rango para ser uno de los siguientes:

valor, desde el resultado de comparación, fijado o claro.

The encodings of imm8[1:0] and imm8[3:2] are shown in Figure 5-27.

Los bits 128:63 del operando de destino son copiados del elemento respectivo del primer operando de origen.

Cuando uno o más del valor de entrada es un NAN, la operación de comparación puede indicar excepción de operación no válida (IE). Los detalles con uno de más valor de entrada son NAN se enumeran en el cuadro 5-21. Si la comparación eleva un IE, el control selecto del signo (imm8[3:2]) no tiene ningún efecto en la salida de operación de rango; esto se indica también en la tabla 5-21.

Cuando ambos valores de entrada son ceros de signos opuestos, la operación de comparación de MIN/MAX en la operación de comparación de rango es ligeramente diferente de la operación de comparación conceptualmente similar coma flotante MIN/MAX que se encuentran en las instrucciones VMAXPD/VMINPD. Los detalles de la operación MIN/MAX/MIN ABS/MAX ABS para VRANGEPD/PS/SD/SS para la magnitud-0, se enumeran en el cuadro 5-22.

Además, no cero, igualdad de imagen con valores de entrada opuestas realizan operaciones de comparación MIN ABS o MAX ABS con el resultado listado en el cuadro 5-23.

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


VRANGESD

IF k1[0] OR *no writemask*

     THEN DEST[63:0] := RangeDP (SRC1[63:0], SRC2[63:0], CmpOpCtl[1:0], SignSelCtl[1:0]);

     ELSE

     IF *merging-masking*     ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE               ; zeroing-masking

           DEST[63:0] = 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

The following example describes a common usage of this instruction for checking that the input operand is
bounded between +/-1023.

VRANGESD xmm_dst, xmm_src, xmm_1023, 02h;

Where:
xmm_dst is the destination operand.
xmm_src is the input operand to compare against +/-1023.
xmm_1023 is the reference operand, contains the value of 1023.
IMM=02(imm8[1:0]='10) selects the Min Absolute value operation with selection of src1.sign.

In case |xmm_src| < 1023, then its value will be written into xmm_dst. Otherwise, the value stored in xmm_dst
will get the value of 1023 (received on xmm_1023).
However, the sign control (imm8[3:2]='00) instructs to select the sign of SRC1 received from xmm_src. So, even
in the case of |xmm_src|  1023, the selected sign of SRC1 is kept.
Thus, if xmm_src < -1023, the result of VRANGEPD will be the minimal value of -1023while if xmm_src > +1023,
the result of VRANGE will be the maximal value of +1023.
```

## Intel C/C++ compilador intrínseco

```c
VRANGESD __m128d _mm_range_sd ( __m128d a, __m128d b, int imm);
VRANGESD __m128d _mm_range_round_sd ( __m128d a, __m128d b, int imm, int sae);
VRANGESD __m128d _mm_mask_range_sd (__m128d s, __mmask8 k, __m128d a, __m128d b, int imm);
VRANGESD __m128d _mm_mask_range_round_sd (__m128d s, __mmask8 k, __m128d a, __m128d b, int imm, int sae);
VRANGESD __m128d _mm_maskz_range_sd ( __mmask8 k, __m128d a, __m128d b, int imm);
VRANGESD __m128d _mm_maskz_range_round_sd ( __mmask8 k, __m128d a, __m128d b, int imm, int sae);
```

## SIMD coma flotante Excepciones

Invalid, Denormal.

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".
