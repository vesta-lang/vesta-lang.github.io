---
summary: Convertir valores en coma flotante de precisión doble escalares en escalar Precisión simple
---

## Descripción

Convierte un valor en coma flotante de precisión doble en el "convertir-de" operando de origen (el segundo operando en SSE2 versión, de lo contrario el tercero operando) a un valor en coma flotante de precisión simple en el operando de destino.

Cuando el "convertir de" operando es un registro XMM, el valor en coma flotante de precisión doble está contenido en el bajo cuadword del registro. El resultado se almacena en la palabra doble baja del operando de destino. Cuando la conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR.

128-bit Legacy SSE versión: El "converso de" operando de origen (el segundo operando) es un registro XMM o ubicación de memoria. Bits (MAXVL-1:32) del registro de destino correspondiente no se modifican. El operando de destino es un registro XMM.

VEX.128 y EVEX versiones codificadas: El "converso de" operando de origen (el tercer operando) puede ser un registro XMM o una ubicación de memoria de 64 bits. La primera fuente y operandos de destino son registros XMM. Los bits (127:32) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. Bits (MAXVL- 1:128) del registro de destino se ponen a cero.

EVEX versión codificada: el resultado convertido en escrito al elemento de doble palabra bajo del destino bajo la máscara de escritura.

El software debe asegurar que VCVTSD2SS esté codificado con VEX.L=0. Codificar VCVTSD2SS con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VCVTSD2SS (EVEX Encoded Version)

IF (SRC2 *is register*) AND (EVEX.b = 1)

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC2[63:0]);

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0

VCVTSD2SS (VEX.128 Encoded Version)
DEST[31:0] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC2[63:0]);
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

CVTSD2SS (128-bit Legacy SSE Version)
DEST[31:0] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[63:0]);
(* DEST[MAXVL-1:32] Unmodified *)
```

## Intel C/C++ compilador intrínseco

```c
VCVTSD2SS __m128 _mm_mask_cvtsd_ss(__m128 s, __mmask8 k, __m128 a, __m128d b);
VCVTSD2SS __m128 _mm_maskz_cvtsd_ss( __mmask8 k, __m128 a,__m128d b);
VCVTSD2SS __m128 _mm_cvt_roundsd_ss(__m128 a, __m128d b, int r);
VCVTSD2SS __m128 _mm_mask_cvt_roundsd_ss(__m128 s, __mmask8 k, __m128 a, __m128d b, int r);
VCVTSD2SS __m128 _mm_maskz_cvt_roundsd_ss( __mmask8 k, __m128 a,__m128d b, int r);
CVTSD2SS __m128_mm_cvtsd_ss(__m128 a, __m128d b);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción." Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Condiciones de Excepción".
