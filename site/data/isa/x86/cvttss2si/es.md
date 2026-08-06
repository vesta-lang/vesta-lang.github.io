---
summary: Convertir Con Truncation valores en coma flotante de precisión simple escalares en Signed
---

## Descripción

Convierte un valor en coma flotante de precisión simple en el operando de origen (el segundo operando) a un entero de doble palabra firmado (o integer de cuádword firmado si tamaño de operando es 64 bits) en el operando de destino (el primer operando). El operando de origen puede ser un registro XMM o una ubicación de memoria de 32 bits. El operando de destino es un registro de proposito general. Cuando el operando de origen es un registro XMM, el valor en coma flotante de precisión simple está contenido en la palabra doble baja del registro.

Cuando una conversión es inexacta, un resultado truncado (redondeado hacia cero) es devuelto.

Si un resultado convertido supera los límites de rango de integer de doble palabra firmado (en modos no-64-bit o modo 64-bit con REX.W/VEX.W/EVEX.W=0), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero indefinido 80000000H es devuelto.

Si un resultado convertido supera los límites de rango de integer de cuadword firmado (en modo de 64 bits y REX.W/VEX.W/EVEX.W = 1), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, se devuelve el valor entero integer indefinido 80000 00000H.

Legacy SSE instrucciones: En modo de 64 bits, el uso del prefijo REX.W promueve la instrucción a operación de 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

VEX.W1 y EVEX.W1 versiones: promueve la instrucción para producir datos de 64 bits en modo de 64 bits.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b, de lo contrario las instrucciones #UD.

El software debe asegurar que VCVTTSS2SI esté codificado con VEX.L=0. Codificar VCVTTSS2SI con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
(V)CVTTSS2SI (All Versions)
IF 64-Bit Mode and OperandSize = 64
THEN

    DEST[63:0] := Convert_Single_Precision_Floating_Point_To_Integer_Truncate(SRC[31:0]);
ELSE

    DEST[31:0] := Convert_Single_Precision_Floating_Point_To_Integer_Truncate(SRC[31:0]);
FI;
```

## Intel C/C++ compilador intrínseco

```c
VCVTTSS2SI int _mm_cvttss_i32( __m128 a);
VCVTTSS2SI int _mm_cvtt_roundss_i32( __m128 a, int sae);
VCVTTSS2SI __int64 _mm_cvttss_i64( __m128 a);
VCVTTSS2SI __int64 _mm_cvtt_roundss_i64( __m128 a, int sae);
CVTTSS2SI int _mm_cvttss_si32( __m128 a);
CVTTSS2SI __int64 _mm_cvttss_si64( __m128 a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Ver Tabla 2-20, "Tipo 3 Condiciones de Excepción", además:

```text
#UD               If VEX.vvvv != 1111B.
```

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
