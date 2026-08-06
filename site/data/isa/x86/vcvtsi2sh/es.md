---
summary: Convertir un Integer de doble palabra/cuadword firmado en un valor FP16
---

## Descripción

Esta instrucción convierte un entero de doble palabra firmado (o integer de cuádword firmado si tamaño de operando es 64 bits) en el segundo operando de origen a un valor FP16 en el operando de destino. El resultado se almacena en la palabra baja del operando de destino. Cuando la conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR o los controles de redondeo incrustados.

El segundo operando de origen puede ser un registro de proposito general o una ubicación de memoria de 32/64 bits. La primera fuente y operandos de destino son registros XMM. Los bits 127:16 del destino de registro XMM son copiados de los bits correspondientes en el primer operando de origen. Bits MAXVL-1:128 del registro de destino se ponen a cero.

Si el resultado de la operación de conversión es desbordamiento y MXCSR.OM=0, entonces una excepción SIMD se elevará con OE=1, PE=1.

## Operación

```text
VCVTSI2SH dest, src1, src2
IF *SRC2 is a register* and (EVEX.b = 1):

    SET_RM(EVEX.RC)
ELSE:

    SET_RM(MXCSR.RC)

IF 64-mode and OperandSize == 64:
    DEST.fp16[0] := Convert_integer64_to_fp16(SRC2.qword)

ELSE:
    DEST.fp16[0] := Convert_integer32_to_fp16(SRC2.dword)

DEST[127:16] := SRC1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCVTSI2SH __m128h _mm_cvt_roundi32_sh (__m128h a, int b, int rounding);
VCVTSI2SH __m128h _mm_cvt_roundi64_sh (__m128h a, __int64 b, int rounding);
VCVTSI2SH __m128h _mm_cvti32_sh (__m128h a, int b);
VCVTSI2SH __m128h _mm_cvti64_sh (__m128h a, __int64 b);
```

## SIMD coma flotante Excepciones

Overflow, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción."
