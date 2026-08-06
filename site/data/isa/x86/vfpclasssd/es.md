---
summary: Tests Tipo de un valor escalar Float64
---

## Descripción

La instrucción FPCLASSSD comprueba el valor en coma flotante de precisión doble bajo en el operando de origen para categorías especiales, especificadas por los bits establecidos en el byte imm8. Cada bit establecido en imm8 especifica una categoría de valores en coma flotante que el elemento de datos de entrada se clasifica en contra. Los resultados clasificados de todas las categorías especificadas de un valor de entrada se ORed juntos para formar el resultado booleano final para el elemento de entrada. El resultado está escrito a la parte baja en un registro de máscaras k2 según la máscara de escritura k1. Bits MAX KL-1: 1 del destino está despejado.

Las categorías de clasificación especificadas por imm8 se muestran en la Figura 5-13. La prueba de clasificación de cada categoría figura en el cuadro 5-11.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
CheckFPClassDP (tsrc[63:0], imm8[7:0]){

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

VFPCLASSSD (EVEX encoded version)

IF k1[0] OR *no writemask*

     THEN DEST[0] :=

       CheckFPClassDP(SRC1[63:0], imm8[7:0])

     ELSE DEST[0] := 0             ; zeroing-masking only

FI;

DEST[MAX_KL-1:1] := 0
```

## Intel C/C++ compilador intrínseco

```c
VFPCLASSSD __mmask8 _mm_fpclass_sd_mask( __m128d a, int c) VFPCLASSSD __mmask8 _mm_mask_fpclass_sd_mask( __mmask8 m, __m128d a, int c);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-55, "Tipo E6 Condiciones de Excepción Clase".

Additionally:           If EVEX.vvvv != 1111B.

```text
#UD
```
