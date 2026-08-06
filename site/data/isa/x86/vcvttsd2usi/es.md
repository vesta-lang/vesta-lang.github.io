---
summary: Convertir Con Truncation valores en coma flotante de precisión doble escalares en
---

## Descripción

Convierte con truncation un valor en coma flotante de precisión doble en el operando de origen (el segundo operando) a un entero sin firma de doble palabra (o unsigned quadword integer si tamaño de operando es 64 bits) en el operando de destino (el primer operando). El operando de origen puede ser un registro XMM o una ubicación de memoria de 64 bits. El operando de destino es un registro de proposito general. Cuando el operando de origen es un registro XMM, el valor flotante de doble precisión está contenido en el cuaderno bajo del registro.

Cuando una conversión es inexacta, se devuelve un valor truncado (redondo hacia cero).

Si un resultado convertido supera los límites de rango del entero de doble palabra firmado (en modos no-64-bit o modo 64-bit con REX.W/VEX.W/EVEX.W=0), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFFFFH es devuelto.

Si un resultado convertido supera los límites de rango de integer de cuádpago firmado (en modo de 64 bits y REX.W/VEX.W/EVEX.W = 1), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFF FFFFH es devuelto.

Versión EVEX.W1: promueve la instrucción para producir datos de 64 bits en modo de 64 bits.

## Operación

```text
VCVTTSD2USI (EVEX Encoded Version)
IF 64-Bit Mode and OperandSize = 64

    THEN DEST[63:0] := Convert_Double_Precision_Floating_Point_To_UInteger_Truncate(SRC[63:0]);
    ELSE DEST[31:0] := Convert_Double_Precision_Floating_Point_To_UInteger_Truncate(SRC[63:0]);
FI
```

## Intel C/C++ compilador intrínseco

```c
VCVTTSD2USI unsigned int _mm_cvttsd_u32(__m128d);
VCVTTSD2USI unsigned int _mm_cvtt_roundsd_u32(__m128d, int sae);
VCVTTSD2USI unsigned __int64 _mm_cvttsd_u64(__m128d);
VCVTTSD2USI unsigned __int64 _mm_cvtt_roundsd_u64(__m128d, int sae);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
