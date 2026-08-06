---
summary: Convertir bajo valor FP16 en entero no firmado
---

## Descripción

Esta instrucción convierte el elemento FP16 bajo en el operando de origen a un entero sin firmar en el destino registro de proposito general.

Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR o los bits de control de redondeo incrustados.

Si un resultado convertido supera los límites de rango del entero de doble palabra firmado (en modos no-64-bit o modo 64-bit con REX.W/VEX.W/EVEX.W=0), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFFFFH es devuelto.

Si un resultado convertido supera los límites de rango de integer de cuádpago firmado (en modo de 64 bits y REX.W/VEX.W/EVEX.W = 1), la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFF FFFFH es devuelto.

## Operación

```text
VCVTSH2USI dest, src
// SET_RM() sets the rounding mode used for this instruction.
IF *SRC is a register* and (EVEX.b = 1):

    SET_RM(EVEX.RC)
ELSE:

    SET_RM(MXCSR.RC)

IF 64-mode and OperandSize == 64:
    DEST.qword := Convert_fp16_to_unsigned_integer64(SRC.fp16[0])

ELSE:
    DEST.dword := Convert_fp16_to_unsigned_integer32(SRC.fp16[0])
```

## Intel C/C++ compilador intrínseco

```c
VCVTSH2USI unsigned int _mm_cvt_roundsh_u32 (__m128h a, int sae);
VCVTSH2USI unsigned __int64 _mm_cvt_roundsh_u64 (__m128h a, int rounding);
VCVTSH2USI unsigned int _mm_cvtsh_u32 (__m128h a);
VCVTSH2USI unsigned __int64 _mm_cvtsh_u64 (__m128h a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
