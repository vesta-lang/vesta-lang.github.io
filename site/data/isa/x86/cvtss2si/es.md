---
summary: Convertir valores en coma flotante de precisión simple escalares en Signed Integer
---

## Descripción

Convierte un valor en coma flotante de precisión simple en el operando de origen (el segundo operando) a un entero firmado en el operando de destino (el primer operando). El operando de origen puede ser un registro XMM o una ubicación de memoria. El operando de destino es un registro de proposito general. Cuando el operando de origen es un registro XMM, el valor en coma flotante de precisión simple está contenido en la palabra doble baja del registro.

Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR o los bits de control de redondeo incrustados.

Si un resultado convertido supera los límites de rango de integer de doble palabra firmado (en modos no-64-bit o modo 64-bit con REX.W/VEX.W/EVEX.W=0), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero indefinido 80000000H es devuelto.

Si un resultado convertido supera los límites de rango de integer de cuadword firmado (en modo de 64 bits y REX.W/VEX.W/EVEX.W = 1), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, se devuelve el valor entero integer indefinido 80000 00000H.

Legacy SSE instrucciones: En modo de 64 bits, el uso del prefijo REX.W promueve la instrucción para producir datos de 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

VEX.W1 y EVEX.W1 versiones: promueve la instrucción para producir datos de 64 bits en modo de 64 bits.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b, de lo contrario las instrucciones #UD.

El software debe asegurar que VCVTSS2SI esté codificado con VEX.L=0. Codificar VCVTSS2SI con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VCVTSS2SI (EVEX Encoded Version)
IF (SRC *is register*) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-bit Mode and OperandSize = 64
THEN

    DEST[63:0] := Convert_Single_Precision_Floating_Point_To_Integer(SRC[31:0]);
ELSE

    DEST[31:0] := Convert_Single_Precision_Floating_Point_To_Integer(SRC[31:0]);
FI;

(V)CVTSS2SI (Legacy and VEX.128 Encoded Version)
IF 64-bit Mode and OperandSize = 64
THEN

    DEST[63:0] := Convert_Single_Precision_Floating_Point_To_Integer(SRC[31:0]);
ELSE

    DEST[31:0] := Convert_Single_Precision_Floating_Point_To_Integer(SRC[31:0]);
FI;
```

## Intel C/C++ compilador intrínseco

```c
VCVTSS2SI int _mm_cvtss_i32( __m128 a);
VCVTSS2SI int _mm_cvt_roundss_i32( __m128 a, int r);
VCVTSS2SI __int64 _mm_cvtss_i64( __m128 a);
VCVTSS2SI __int64 _mm_cvt_roundss_i64( __m128 a, int r);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción," adicionalmente:

```text
#UD               If VEX.vvvv != 1111B.
```

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
