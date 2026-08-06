---
summary: Convertir Unsigned Integer en valores en coma flotante de precisión simple escalares
---

## Descripción

Convierte un entero sin firma de doble palabra (o unsigned quadword integer si tamaño de operando es 64 bits) en el operando de origen (segundo operando) a un valor en coma flotante de precisión simple en el operando de destino (primer operando). El operando de origen puede ser un registro de proposito general o una ubicación de memoria. El operando de destino es un registro XMM. El resultado se almacena en la palabra doble baja del operando de destino. Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR o los bits de control de redondeo incrustados.

El segundo operando de origen puede ser un registro de proposito general o una ubicación de memoria de 32/64 bits. La primera fuente y operandos de destino son registros XMM. Los bits (127:32) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

Versión EVEX.W1: promueve la instrucción para utilizar el valor de entrada de 64 bits en modo de 64 bits.

## Operación

```text
VCVTUSI2SS (EVEX Encoded Version)
IF (SRC2 *is register*) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[31:0] := Convert_UInteger_To_Single_Precision_Floating_Point(SRC[63:0]);
ELSE

    DEST[31:0] := Convert_UInteger_To_Single_Precision_Floating_Point(SRC[31:0]);
FI;
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCVTUSI2SS __m128 _mm_cvtu32_ss( __m128 s, unsigned a);
VCVTUSI2SS __m128 _mm_cvt_roundu32_ss( __m128 s, unsigned a, int r);
VCVTUSI2SS __m128 _mm_cvtu64_ss( __m128 s, unsigned __int64 a);
VCVTUSI2SS __m128 _mm_cvt_roundu64_ss( __m128 s, unsigned __int64 a, int r);
```

## SIMD coma flotante Excepciones

Precision.

## Otras excepciones

Ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción".
