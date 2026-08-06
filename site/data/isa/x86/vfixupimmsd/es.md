---
summary: Fijar el valor especial escalar Float64
---

## Descripción

Realice una fijación del elemento de palabra baja codificado en formato coma flotante de precisión doble en el primer operando de origen (el segundo operando) utilizando una tabla de búsqueda de 32 bits de dos niveles especificada en el elemento de cuádpo bajo del segundo operando de origen (el tercer operando) con el especificador de presentación de informes de excepción imm8. El elemento que se fija se selecciona por mascarilla bit de 1 especificado en el omask k1. Máscara de 0 en la acción de respuesta de 0000b de opmask k1 o tabla preserva el elemento correspondiente del primer operando. El elemento fijo del primer operando de origen o el elemento preservado en el primer operando se convierte en el elemento de cuádpago bajo del operando de destino (el primer operando). Bits 127:64 del operando de destino es copiado de los bits correspondientes del primer operando de origen. El destino y el primer operandos de origen son los registros XMM. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 64 bits.

La tabla de seguimiento de dos niveles realiza una fijación de cada uno de los datos de entrada coma flotante de precisión doble en el primer operando de origen decodificando los datos de entrada codificando en 8 tipos de fichas. Una tabla de respuesta se define para cada tipo de token que convierte la codificación de entrada en el primer operando de origen con una de las 16 acciones de respuesta.

Esta instrucción está destinada específicamente para su uso en la fijación de los resultados de cálculos aritméticos que implican una fuente para que coincidan con la especificaciones, aunque generalmente es útil para fijar los resultados de secuencias de instrucciones múltiples para reflejar entradas especiales-número. Por ejemplo, considere rcp(0). Entrada 0 a rcp, y usted debe conseguir INF de acuerdo a la especificaciones DX10. Sin embargo, evaluar el rcp a través de Newton-Raphson, donde x=approx(1/0), produce un resultado incorrecto. Para hacer frente a esto, VFIXUPIMMPD se puede utilizar después de la secuencia recíproca N-R para establecer el resultado al valor correcto (es decir, INF cuando la entrada es 0).

Si MXCSR.DAZ no está establecido, los elementos de entrada denormales en el primer operando de origen son considerados como insumos normales y no activan ninguna fijación ni notificación de fallos.

El Imm8 se utiliza para establecer los informes de las banderas requeridas. Soporta la notificación de fallos #ZE y #IE (ver detalles a continuación).

MXCSR.DAZ se utiliza y se refiere a zmm2 solamente (es decir, zmm1 no se considera como cero en caso de MXCSR.DAZ se establece).

Los bits de máscara MXCSR son ignorados y se tratan como si todos los bits de máscara están listos para la respuesta enmascarada). Si se establece alguno de los bits imm8 y se cumple la condición para la presentación de fallos, MXCSR.IE o MXCSR.ZE podrían actualizarse.

## Operación

```text
enum TOKEN_TYPE
{

    QNAN_TOKEN := 0,
    SNAN_TOKEN := 1,
    ZERO_VALUE_TOKEN := 2,
    POS_ONE_VALUE_TOKEN := 3,
    NEG_INF_TOKEN := 4,
    POS_INF_TOKEN := 5,
    NEG_VALUE_TOKEN := 6,
    POS_VALUE_TOKEN := 7
}

FIXUPIMM_DP (dest[63:0], src1[63:0],tbl3[63:0], imm8 [7:0]){

tsrc[63:0] := ((src1[62:52] = 0) AND (MXCSR.DAZ =1)) ? 0.0 : src1[63:0]

CASE(tsrc[63:0] of TOKEN_TYPE) {

   QNAN_TOKEN: j := 0;

   SNAN_TOKEN: j := 1;

   ZERO_VALUE_TOKEN: j := 2;

   POS_ONE_VALUE_TOKEN: j := 3;

   NEG_INF_TOKEN: j := 4;

   POS_INF_TOKEN: j := 5;

   NEG_VALUE_TOKEN: j := 6;

   POS_VALUE_TOKEN: j := 7;

}  ; end source special CASE(tsrc...)

; The required response from src3 table is extracted
token_response[3:0] = tbl3[3+4*j:4*j];

CASE(token_response[3:0]) {

   0000: dest[63:0] := dest[63:0]                 ; preserve content of DEST

   0001: dest[63:0] := tsrc[63:0];                ; pass through src1 normal input value, denormal as zero

   0010: dest[63:0] := QNaN(tsrc[63:0]);

   0011: dest[63:0] := QNAN_Indefinite;

   0100:dest[63:0] := -INF;

   0101: dest[63:0] := +INF;

   0110: dest[63:0] := tsrc.sign? INF : +INF;

   0111: dest[63:0] := -0;

   1000: dest[63:0] := +0;

   1001: dest[63:0] := -1;

   1010: dest[63:0] := +1;

   1011: dest[63:0] := 1/2;

   1100: dest[63:0] := 90.0;

   1101: dest[63:0] := PI/2;

   1110: dest[63:0] := MAX_FLOAT;

   1111: dest[63:0] := -MAX_FLOAT;

}  ; end of token_response CASE

; The required fault reporting from imm8 is extracted
; TOKENs are mutually exclusive and TOKENs priority defines the order.

; Multiple faults related to a single token can occur simultaneously.

IF (tsrc[63:0] of TOKEN_TYPE: ZERO_VALUE_TOKEN) AND imm8[0] then set #ZE;
IF (tsrc[63:0] of TOKEN_TYPE: ZERO_VALUE_TOKEN) AND imm8[1] then set #IE;
IF (tsrc[63:0] of TOKEN_TYPE: ONE_VALUE_TOKEN) AND imm8[2] then set #ZE;


     IF (tsrc[63:0] of TOKEN_TYPE: ONE_VALUE_TOKEN) AND imm8[3] then set #IE;

     IF (tsrc[63:0] of TOKEN_TYPE: SNAN_TOKEN) AND imm8[4] then set #IE;

     IF (tsrc[63:0] of TOKEN_TYPE: NEG_INF_TOKEN) AND imm8[5] then set #IE;

     IF (tsrc[63:0] of TOKEN_TYPE: NEG_VALUE_TOKEN) AND imm8[6] then set #IE;

     IF (tsrc[63:0] of TOKEN_TYPE: POS_INF_TOKEN) AND imm8[7] then set #IE;

     ; end fault reporting

     return dest[63:0];

}    ; end of FIXUPIMM_DP()

VFIXUPIMMSD (EVEX encoded version)

IF k1[0] OR *no writemask*

     THEN DEST[63:0] := FIXUPIMM_DP(DEST[63:0], SRC1[63:0], SRC2[63:0], imm8 [7:0])

     ELSE

     IF *merging-masking*                         ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE DEST[63:0] := 0                   ; zeroing-masking

     FI

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

Immediate Control Description:

                                                                      76543210

                         + INF  #IE
                         - VE  #IE
                         - INF  #IE
                          SNaN  #IE

                           ONE  #IE
                           ONE  #ZE
                          ZERO  #IE
                          ZERO  #ZE

                               Figure 5-11. VFIXUPIMMSD Immediate Control Description
```

## Intel C/C++ compilador intrínseco

```c
VFIXUPIMMSD __m128d _mm_fixupimm_sd( __m128d a, __m128d b, __m128i c, int imm8);
VFIXUPIMMSD __m128d _mm_mask_fixupimm_sd(__m128d a, __mmask8 k, __m128d b, __m128i c, int imm8);
VFIXUPIMMSD __m128d _mm_maskz_fixupimm_sd( __mmask8 k, __m128d a, __m128d b, __m128i c, int imm8);
VFIXUPIMMSD __m128d _mm_fixupimm_round_sd( __m128d a, __m128d b, __m128i c, int imm8, int sae);
VFIXUPIMMSD __m128d _mm_mask_fixupimm_round_sd(__m128d a, __mmask8 k, __m128d b, __m128i c, int imm8, int sae);
VFIXUPIMMSD __m128d _mm_maskz_fixupimm_round_sd( __mmask8 k, __m128d a, __m128d b, __m128i c, int imm8, int sae);
```

## SIMD coma flotante Excepciones

Zero, Invalid

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".
