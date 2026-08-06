---
summary: Convertir con Truncation Low FP16 Valor a un entero sin firma
---

## Descripción

Esta instrucción convierte el elemento FP16 bajo en el operando de origen a un entero sin firmar en el destino registro de proposito general.

Cuando una conversión es inexacta, se devuelve un valor truncado (redondo hacia cero).

Si un resultado convertido supera los límites de rango del entero de doble palabra firmado (en modos no-64-bit o modo 64-bit con REX.W/VEX.W/EVEX.W=0), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFFFFH es devuelto.

Si un resultado convertido supera los límites de rango de integer de cuádpago firmado (en modo de 64 bits y REX.W/VEX.W/EVEX.W = 1), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFF FFFFH es devuelto.

## Operación

```text
VCVTTSH2USI dest, src
IF 64-mode and OperandSize == 64:

    DEST.qword := Convert_fp16_to_unsigned_integer64_truncate(SRC.fp16[0])
ELSE:

    DEST.dword := Convert_fp16_to_unsigned_integer32_truncate(SRC.fp16[0])
```

## Intel C/C++ compilador intrínseco

```c
VCVTTSH2USI unsigned int _mm_cvtt_roundsh_u32 (__m128h a, int sae);
VCVTTSH2USI unsigned __int64 _mm_cvtt_roundsh_u64 (__m128h a, int sae);
VCVTTSH2USI unsigned int _mm_cvttsh_u32 (__m128h a);
VCVTTSH2USI unsigned __int64 _mm_cvttsh_u64 (__m128h a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
