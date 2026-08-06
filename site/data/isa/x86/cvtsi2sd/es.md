---
summary: Convertir Integer firmado en valores en coma flotante de precisión doble escalares
---

## Descripción

Convierte un integer de palabra doble firmado o cuadword en el "convertir-de" operando de origen a un valor en coma flotante de precisión doble en el operando de destino. El resultado se almacena en el bajo cuádpago del operando de destino, y el alto cuádpago dejado sin cambios. Cuando la conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR.

El segundo operando de origen puede ser un registro de proposito general o una ubicación de memoria de 32/64 bits. La primera fuente y operandos de destino son registros XMM.

128-bit Legacy SSE versión: El uso del prefijo REX.W promueve la instrucción a operandos de 64 bits. El "converso de" operando de origen (el segundo operando) es un registro de proposito general o ubicación de memoria. El destino es un registro XMM Bits (MAXVL-1:64) del registro de destino correspondiente no se modifican.

VEX.128 y EVEX versiones codificadas: El "converso de" operando de origen (el tercer operando) puede ser un registro de uso general o una ubicación de memoria. La primera fuente y operandos de destino son registros XMM. Los bits (127:64) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. Bits (MAXVL- 1:128) del registro de destino se ponen a cero.

Versión EVEX.W0: se ignora el intento de codificar esta instrucción con redondeo integrado EVEX.

VEX.W1 y EVEX.W1 versiones: promueve la instrucción para utilizar el valor de entrada de 64 bits en modo de 64 bits.

El software debe asegurar que VCVTSI2SD esté codificado con VEX.L=0. Codificar VCVTSI2SD con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VCVTSI2SD (EVEX Encoded Version)
IF (SRC2 *is register*) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC2[63:0]);
ELSE

    DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC2[31:0]);
FI;
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

VCVTSI2SD (VEX.128 Encoded Version)
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC2[63:0]);
ELSE

    DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC2[31:0]);
FI;
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

CVTSI2SD
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[63:0]);
ELSE

    DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[31:0]);
FI;
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VCVTSI2SD __m128d _mm_cvti32_sd(__m128d s, int a);
VCVTSI2SD __m128d _mm_cvti64_sd(__m128d s, __int64 a);
VCVTSI2SD __m128d _mm_cvt_roundi64_sd(__m128d s, __int64 a, int r);
CVTSI2SD __m128d _mm_cvtsi64_sd(__m128d s, __int64 a);
CVTSI2SD __m128d_mm_cvtsi32_sd(__m128d a, int b);
```

## SIMD coma flotante Excepciones

Precision.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción", si W1; más ver Tabla 2-22, "Tipo 5 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción", si W1; más ver Tabla 2-61, "Tipo E10NF Clase Condiciones de Excepción."
