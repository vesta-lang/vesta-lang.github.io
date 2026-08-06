---
summary: Convertir Integer firmado en valores en coma flotante de precisión simple escalares
---

## Descripción

Convierte un integer de doble palabra o cuádword firmado en el "convertir-de" operando de origen a un valor en coma flotante de precisión simple en el operando de destino (primer operando). El "converso de" operando de origen puede ser un registro de proposito general o una ubicación de memoria. El operando de destino es un registro XMM. El resultado se almacena en la palabra doble baja del operando de destino, y las tres palabras dobles superiores se quedan sin cambios. Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR o los bits de control de redondeo incrustados.

128-bit Legacy SSE versión: En modo de 64 bits, el uso del prefijo REX.W promueve la instrucción para utilizar el valor de entrada de 64 bits. El "converso de" operando de origen (el segundo operando) es un registro de proposito general o ubicación de memoria. Bits (MAXVL-1:32) del registro de destino correspondiente no se modifican.

VEX.128 y EVEX versiones codificadas: El "converso de" operando de origen (el tercer operando) puede ser un registro de uso general o una ubicación de memoria. La primera fuente y operandos de destino son registros XMM. Los bits (127:32) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX versión codificada: el resultado convertido en escrito al elemento de doble palabra bajo del destino bajo la máscara de escritura.

El software debe asegurar que VCVTSI2SS esté codificado con VEX.L=0. Codificar VCVTSI2SS con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VCVTSI2SS (EVEX Encoded Version)
IF (SRC2 *is register*) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[63:0]);
ELSE

    DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[31:0]);
FI;
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

VCVTSI2SS (VEX.128 Encoded Version)
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[63:0]);
ELSE

    DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[31:0]);
FI;
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

CVTSI2SS (128-bit Legacy SSE Version)
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[63:0]);
ELSE

    DEST[31:0] :=Convert_Integer_To_Single_Precision_Floating_Point(SRC[31:0]);
FI;
DEST[MAXVL-1:32] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VCVTSI2SS __m128 _mm_cvti32_ss(__m128 s, int a);
VCVTSI2SS __m128 _mm_cvt_roundi32_ss(__m128 s, int a, int r);
VCVTSI2SS __m128 _mm_cvti64_ss(__m128 s, __int64 a);
VCVTSI2SS __m128 _mm_cvt_roundi64_ss(__m128 s, __int64 a, int r);
CVTSI2SS __m128 _mm_cvtsi64_ss(__m128 s, __int64 a);
CVTSI2SS __m128 _mm_cvtsi32_ss(__m128 a, int b);
```

## SIMD coma flotante Excepciones

Precision.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
