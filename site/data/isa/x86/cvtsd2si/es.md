---
summary: Convertir valores en coma flotante de precisión doble escalares en Signed Integer
---

## Descripción

Convierte un valor en coma flotante de precisión doble en el operando de origen (el segundo operando) a un entero firmado en el operando de destino (primer operando). El operando de origen puede ser un registro XMM o una ubicación de memoria de 64 bits. El operando de destino es un registro de proposito general. Cuando el operando de origen es un registro XMM, el valor en coma flotante de precisión doble está contenido en el bajo cuadword del registro.

Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR.

Si un resultado convertido supera los límites de rango de integer de doble palabra firmado (en modos no-64-bit o modo 64-bit con REX.W/VEX.W/EVEX.W=0), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero indefinido 80000000H es devuelto.

Si un resultado convertido supera los límites de rango de integer de cuadword firmado (en modo de 64 bits y REX.W/VEX.W/EVEX.W = 1), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, se devuelve el valor entero integer indefinido 80000 00000H.

Legacy SSE instrucción: El uso del prefijo REX.W promueve la instrucción para producir datos de 64 bits en modo de 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b, de lo contrario las instrucciones #UD.

El software debe asegurar que VCVTSD2SI esté codificado con VEX.L=0. Codificar VCVTSD2SI con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VCVTSD2SI (EVEX Encoded Version)
IF SRC *is register* AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-Bit Mode and OperandSize = 64

    THEN DEST[63:0] := Convert_Double_Precision_Floating_Point_To_Integer(SRC[63:0]);
    ELSE DEST[31:0] := Convert_Double_Precision_Floating_Point_To_Integer(SRC[63:0]);
FI

(V)CVTSD2SI
IF 64-Bit Mode and OperandSize = 64
THEN

    DEST[63:0] := Convert_Double_Precision_Floating_Point_To_Integer(SRC[63:0]);
ELSE

    DEST[31:0] := Convert_Double_Precision_Floating_Point_To_Integer(SRC[63:0]);
FI;
```

## Intel C/C++ compilador intrínseco

```c
VCVTSD2SI int _mm_cvtsd_i32(__m128d);
VCVTSD2SI int _mm_cvt_roundsd_i32(__m128d, int r);
VCVTSD2SI __int64 _mm_cvtsd_i64(__m128d);
VCVTSD2SI __int64 _mm_cvt_roundsd_i64(__m128d, int r);
CVTSD2SI __int64 _mm_cvtsd_si64(__m128d);
CVTSD2SI int _mm_cvtsd_si32(__m128d a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."

Additionally:

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```
