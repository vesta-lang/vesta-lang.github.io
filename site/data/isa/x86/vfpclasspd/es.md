---
summary: Tipos de pruebas de los valores de Float64 empaquetados
---

## Descripción

La instrucción FPCLASSPD comprueba los valores en coma flotante de precisión doble empaquetados para categorías especiales, especificadas por los bits establecidos en el byte imm8. Cada bit establecido en imm8 especifica una categoría de valores en coma flotante que el elemento de datos de entrada se clasifica en contra. Los resultados clasificados de todas las categorías especificadas de un valor de entrada se ORed juntos para formar el resultado booleano final para el elemento de entrada. El resultado de cada elemento está escrito al bit correspondiente en un registro de máscaras k2 según la máscara de escritura k1. Se eliminan los bits [MAX KL-1:8/4/2] del destino.

Las categorías de clasificación especificadas por imm8 se muestran en la Figura 5-13. La prueba de clasificación de cada categoría figura en el cuadro 5-11.

```text
                                7        6              5     4            3          2          1     0
                            SNaN   Neg. Finite    Denormal  Neg. INF    +INF       Neg. 0  +0        QNaN
```

Figura 5-13. Imm8 Byte Specifier of Special Case valores en coma flotante for VFPCLASSPD/SD/PS/SS

** Operaciones clasificatorias para VFPCLASSPD/SD/PS/SS**

| Bits | Imm8[0] | Imm8[1] | Imm8[2] | Imm8[3] | Imm8[4] | Imm8[5] | Imm8[6] | Imm8[7] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Categoría | QNAN | PosZero | NegZero | PosINF | NegINF | Denormal | Negativo | SNAN |
| Clasificación | Checks for | Checks for | Checks for - | Checks for | Checks for - | Checks for | Checks for | Checks for |
|  | QNan | +0 | 0 | +INF | INF | Denormal | Finito negativo | SNan |

## Operación

```text
CheckFPClassDP (tsrc[63:0], imm8[7:0]){

    //* Start checking the source operand for special type *//
    NegNum := tsrc[63];
    IF (tsrc[62:52]=07FFh) Then ExpAllOnes := 1; FI;
    IF (tsrc[62:52]=0h) Then ExpAllZeros := 1;
    IF (ExpAllZeros AND MXCSR.DAZ) Then

          MantAllZeros := 1;
    ELSIF (tsrc[51:0]=0h) Then

          MantAllZeros := 1;
    FI;
    ZeroNumber := ExpAllZeros AND MantAllZeros
    SignalingBit := tsrc[51];

    sNaN_res := ExpAllOnes AND NOT(MantAllZeros) AND NOT(SignalingBit); // sNaN
    qNaN_res := ExpAllOnes AND NOT(MantAllZeros) AND SignalingBit; // qNaN
    Pzero_res := NOT(NegNum) AND ExpAllZeros AND MantAllZeros; // +0
    Nzero_res := NegNum AND ExpAllZeros AND MantAllZeros; // -0
    PInf_res := NOT(NegNum) AND ExpAllOnes AND MantAllZeros; // +Inf
    NInf_res := NegNum AND ExpAllOnes AND MantAllZeros; // -Inf
    Denorm_res := ExpAllZeros AND NOT(MantAllZeros); // denorm
    FinNeg_res := NegNum AND NOT(ExpAllOnes) AND NOT(ZeroNumber); // -finite

    bResult = ( imm8[0] AND qNaN_res ) OR (imm8[1] AND Pzero_res ) OR
                ( imm8[2] AND Nzero_res ) OR ( imm8[3] AND PInf_res ) OR
                ( imm8[4] AND NInf_res ) OR ( imm8[5] AND Denorm_res ) OR
                ( imm8[6] AND FinNeg_res ) OR ( imm8[7] AND sNaN_res );

    Return bResult;
} //* end of CheckFPClassDP() *//


VFPCLASSPD (EVEX Encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

       THEN

             IF (EVEX.b == 1) AND (SRC *is memory*)

                  THEN

                    DEST[j] := CheckFPClassDP(SRC1[63:0], imm8[7:0]);

                  ELSE

                    DEST[j] := CheckFPClassDP(SRC1[i+63:i], imm8[7:0]);

             FI;

       ELSE DEST[j] := 0                 ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VFPCLASSPD __mmask8 _mm512_fpclass_pd_mask( __m512d a, int c);
VFPCLASSPD __mmask8 _mm512_mask_fpclass_pd_mask( __mmask8 m, __m512d a, int c) VFPCLASSPD __mmask8 _mm256_fpclass_pd_mask( __m256d a, int c) VFPCLASSPD __mmask8 _mm256_mask_fpclass_pd_mask( __mmask8 m, __m256d a, int c) VFPCLASSPD __mmask8 _mm_fpclass_pd_mask( __m128d a, int c) VFPCLASSPD __mmask8 _mm_mask_fpclass_pd_mask( __mmask8 m, __m128d a, int c);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".

Additionally:           If EVEX.vvvv != 1111B.

```text
#UD
```
