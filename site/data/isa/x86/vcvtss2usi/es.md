---
summary: Convertir valores en coma flotante de precisión simple escalares en Espada doble no firmada
---

## Descripción

Convierte un valor en coma flotante de precisión simple en el operando de origen (el segundo operando) a un entero sin firma de doble palabra (o unsigned quadword integer si tamaño de operando es 64 bits) en el operando de destino (el primer operando). El operando de origen puede ser un registro XMM o una ubicación de memoria. El operando de destino es un registro para fines generales. Cuando el operando de origen es un registro XMM, el valor en coma flotante de precisión simple está contenido en la palabra doble baja del registro.

Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR o los bits de control de redondeo incrustados.

Si un resultado convertido supera los límites de rango del entero de doble palabra firmado (en modos no-64-bit o modo 64-bit con REX.W/VEX.W/EVEX.W=0), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFFFFH es devuelto.

Si un resultado convertido supera los límites de rango de integer de cuádpago firmado (en modo de 64 bits y REX.W/VEX.W/EVEX.W = 1), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFF FFFFH es devuelto.

VEX.W1 y EVEX.W1 versiones: promueve la instrucción para producir datos de 64 bits en modo de 64 bits.

Nota: EVEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
VCVTSS2USI (EVEX Encoded Version)
IF (SRC *is register*) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-bit Mode and OperandSize = 64
THEN

    DEST[63:0] := Convert_Single_Precision_Floating_Point_To_UInteger(SRC[31:0]);
ELSE

    DEST[31:0] := Convert_Single_Precision_Floating_Point_To_UInteger(SRC[31:0]);
FI;
```

## Intel C/C++ compilador intrínseco

```c
VCVTSS2USI unsigned _mm_cvtss_u32( __m128 a);
VCVTSS2USI unsigned _mm_cvt_roundss_u32( __m128 a, int r);
VCVTSS2USI unsigned __int64 _mm_cvtss_u64( __m128 a);
VCVTSS2USI unsigned __int64 _mm_cvt_roundss_u64( __m128 a, int r);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
