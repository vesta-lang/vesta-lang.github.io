---
summary: Convertir Unsigned Doubleword Integer en un valor FP16
---

## Descripción

Esta instrucción convierte un entero sin firma de doble palabra (o unsigned quadword integer si tamaño de operando es 64 bits) en el segundo operando de origen a un valor FP16 en el operando de destino. El resultado se almacena en la palabra baja del operando de destino. Cuando la conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR o los controles de redondeo incrustados.

El segundo operando de origen puede ser un registro de proposito general o una ubicación de memoria de 32/64 bits. La primera fuente y operandos de destino son registros XMM. Los bits 127:16 del destino de registro XMM son copiados de los bits correspondientes en el primer operando de origen. Bits MAXVL-1:128 del registro de destino se ponen a cero.

Si el resultado de la operación de conversión es desbordamiento y MXCSR.OM=0, entonces una excepción SIMD se elevará con OE=1, PE=1.

## Operación

```text
VCVTUSI2SH dest, src1, src2
IF *SRC2 is a register* and (EVEX.b = 1):

    SET_RM(EVEX.RC)
ELSE:

    SET_RM(MXCSR.RC)

IF 64-mode and OperandSize == 64:
    DEST.fp16[0] := Convert_unsigned_integer64_to_fp16(SRC2.qword)

ELSE:
    DEST.fp16[0] := Convert_unsigned_integer32_to_fp16(SRC2.dword)

DEST[127:16] := SRC1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCVTUSI2SH __m128h _mm_cvt_roundu32_sh (__m128h a, unsigned int b, int rounding);
VCVTUSI2SH __m128h _mm_cvt_roundu64_sh (__m128h a, unsigned __int64 b, int rounding);
VCVTUSI2SH __m128h _mm_cvtu32_sh (__m128h a, unsigned int b);
VCVTUSI2SH __m128h _mm_cvtu64_sh (__m128h a, unsigned __int64 b);
```

## SIMD coma flotante Excepciones

Overflow, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
