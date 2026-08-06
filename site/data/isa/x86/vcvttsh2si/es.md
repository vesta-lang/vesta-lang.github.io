---
summary: Convertir con Truncation Low FP16 Valor en un entero firmado
---

## Descripción

Esta instrucción convierte el elemento FP16 bajo en el operando de origen a un entero firmado en el destino registro de proposito general.

Cuando una conversión es inexacta, se devuelve un valor truncado (redondo hacia cero).

Si un resultado convertido supera los límites de rango de integer de doble palabra firmado (en modos no-64-bit o modo 64-bit con REX.W/VEX.W/EVEX.W=0), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero indefinido 80000000H es devuelto.

Si un resultado convertido supera los límites de rango de integer de cuadword firmado (en modo de 64 bits y REX.W/VEX.W/EVEX.W = 1), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, se devuelve el valor entero integer indefinido 80000 00000H.

## Operación

```text
VCVTTSH2SI dest, src
IF 64-mode and OperandSize == 64:

    DEST.qword := Convert_fp16_to_integer64_truncate(SRC.fp16[0])
ELSE:

    DEST.dword := Convert_fp16_to_integer32_truncate(SRC.fp16[0])
```

## Intel C/C++ compilador intrínseco

```c
VCVTTSH2SI int _mm_cvtt_roundsh_i32 (__m128h a, int sae);
VCVTTSH2SI __int64 _mm_cvtt_roundsh_i64 (__m128h a, int sae);
VCVTTSH2SI int _mm_cvttsh_i32 (__m128h a);
VCVTTSH2SI __int64 _mm_cvttsh_i64 (__m128h a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
