---
summary: Tipos de pruebas de los valores de Float32 empaquetados
---

## Descripción

La instrucción FPCLASSPS comprueba los valores en coma flotante de precisión simple empaquetados para categorías especiales, especificadas por los bits establecidos en el byte imm8. Cada bit establecido en imm8 especifica una categoría de valores en coma flotante que el elemento de datos de entrada se clasifica en contra. Los resultados clasificados de todas las categorías especificadas de un valor de entrada se ORed juntos para formar el resultado booleano final para el elemento de entrada. El resultado de cada elemento está escrito al bit correspondiente en un registro de máscaras k2 según la máscara de escritura k1. Se eliminan los bits [MAX KL-1:16/8/4] del destino.

Las categorías de clasificación especificadas por imm8 se muestran en la Figura 5-13. La prueba de clasificación de cada categoría figura en el cuadro 5-11.

El operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
CheckFPClassSP (tsrc[31:0], imm8[7:0]){

//* Start checking the source operand for special type *//
NegNum := tsrc[31];
IF (tsrc[30:23]=0FFh) Then ExpAllOnes := 1; FI;
IF (tsrc[30:23]=0h) Then ExpAllZeros := 1;

IF (ExpAllZeros AND MXCSR.DAZ) Then

      MantAllZeros := 1;
ELSIF (tsrc[22:0]=0h) Then

      MantAllZeros := 1;

FI;

ZeroNumber= ExpAllZeros AND MantAllZeros
SignalingBit= tsrc[22];


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
} //* end of CheckSPClassSP() *//

VFPCLASSPS (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

       THEN

             IF (EVEX.b == 1) AND (SRC *is memory*)

                  THEN

                    DEST[j] := CheckFPClassDP(SRC1[31:0], imm8[7:0]);

                  ELSE

                    DEST[j] := CheckFPClassDP(SRC1[i+31:i], imm8[7:0]);

             FI;

       ELSE DEST[j] := 0                  ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VFPCLASSPS __mmask16 _mm512_fpclass_ps_mask( __m512 a, int c);
VFPCLASSPS __mmask16 _mm512_mask_fpclass_ps_mask( __mmask16 m, __m512 a, int c) VFPCLASSPS __mmask8 _mm256_fpclass_ps_mask( __m256 a, int c) VFPCLASSPS __mmask8 _mm256_mask_fpclass_ps_mask( __mmask8 m, __m256 a, int c) VFPCLASSPS __mmask8 _mm_fpclass_ps_mask( __m128 a, int c) VFPCLASSPS __mmask8 _mm_mask_fpclass_ps_mask( __mmask8 m, __m128 a, int c);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".

Additionally:           If EVEX.vvvv != 1111B.

```text
#UD
```
