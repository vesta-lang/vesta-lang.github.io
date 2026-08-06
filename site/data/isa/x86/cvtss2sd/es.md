---
summary: Convertir valores en coma flotante de precisión simple escalares en escalar Doble Precisión
---

## Descripción

Convierte un valor en coma flotante de precisión simple en el "convert-from" operando de origen a un valor flotante de doble precisión en el operando de destino. Cuando el "converso de" operando de origen es un registro XMM, el valor en coma flotante de precisión simple está contenido en la palabra doble baja del registro. El resultado se almacena en el bajo cuádpago del operando de destino.

128-bit Legacy SSE versión: El "converso de" operando de origen (el segundo operando) es un registro XMM o ubicación de memoria. Bits (MAXVL-1:64) del registro de destino correspondiente no se modifican. El operando de destino es un registro XMM.

VEX.128 y EVEX versiones codificadas: El "converso de" operando de origen (el tercer operando) puede ser un registro XMM o una ubicación de memoria de 32 bits. La primera fuente y operandos de destino son registros XMM. Los bits (127:64) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. Bits (MAXVL- 1:128) del registro de destino se ponen a cero.

El software debe asegurar que VCVTSS2SD esté codificado con VEX.L=0. Codificar VCVTSS2SD con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VCVTSS2SD (EVEX Encoded Version)

IF k1[0] or *no writemask*

     THEN DEST[63:0] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC2[31:0]);

     ELSE

     IF *merging-masking*         ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                   ; zeroing-masking

           THEN DEST[63:0] = 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

VCVTSS2SD (VEX.128 Encoded Version)
DEST[63:0] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC2[31:0])
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

CVTSS2SD (128-bit Legacy SSE Version)
DEST[63:0] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[31:0]);
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VCVTSS2SD __m128d _mm_cvt_roundss_sd(__m128d a, __m128 b, int r);
VCVTSS2SD __m128d _mm_mask_cvt_roundss_sd(__m128d s, __mmask8 m, __m128d a,__m128 b, int r);
VCVTSS2SD __m128d _mm_maskz_cvt_roundss_sd(__mmask8 k, __m128d a, __m128 a, int r);
VCVTSS2SD __m128d _mm_mask_cvtss_sd(__m128d s, __mmask8 m, __m128d a,__m128 b);
VCVTSS2SD __m128d _mm_maskz_cvtss_sd(__mmask8 m, __m128d a,__m128 b);
CVTSS2SD __m128d_mm_cvtss_sd(__m128d a, __m128 a);
```

## SIMD coma flotante Excepciones

Invalid, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción." Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Condiciones de Excepción".
