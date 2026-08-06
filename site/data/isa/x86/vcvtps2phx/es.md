---
summary: Convertir valores en coma flotante de precisión simple empaquetados en Valores de FP16 empaquetados
---

## Descripción

Esta instrucción convierte los valores flotantes de precisión individual en el operando de origen a FP16 y almacena al operando de destino.

La instrucción VCVTPS2PHX admite la transmisión.

Esta instrucción utiliza MXCSR.DAZ para el manejo de entradas FP32. Las salidas de FP16 pueden ser números normales o denormales, y no se desbordan condicionalmente basados en la configuración de MXCSR.

## Operación

```text
VCVTPS2PHX DEST, SRC (AVX512_FP16 Load Version With Broadcast Support)
VL = 128, 256, or 512
KL := VL / 32

IF *SRC is a register* and (VL == 512) and (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE:
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *SRC is memory* and EVEX.b = 1:
                tsrc := SRC.fp32[0]
          ELSE
                tsrc := SRC.fp32[j]
          DEST.fp16[j] := Convert_fp32_to_fp16(tsrc)
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL/2] := 0
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VCVTPS2PHX __m256h _mm512_cvtx_roundps_ph (__m512 a, int rounding);
VCVTPS2PHX __m256h _mm512_mask_cvtx_roundps_ph (__m256h src, __mmask16 k, __m512 a, int rounding);
VCVTPS2PHX __m256h _mm512_maskz_cvtx_roundps_ph (__mmask16 k, __m512 a, int rounding);
VCVTPS2PHX __m128h _mm_cvtxps_ph (__m128 a);
VCVTPS2PHX __m128h _mm_mask_cvtxps_ph (__m128h src, __mmask8 k, __m128 a);
VCVTPS2PHX __m128h _mm_maskz_cvtxps_ph (__mmask8 k, __m128 a);
VCVTPS2PHX __m128h _mm256_cvtxps_ph (__m256 a);
VCVTPS2PHX __m128h _mm256_mask_cvtxps_ph (__m128h src, __mmask8 k, __m256 a);
VCVTPS2PHX __m128h _mm256_maskz_cvtxps_ph (__mmask8 k, __m256 a);
VCVTPS2PHX __m256h _mm512_cvtxps_ph (__m512 a);
VCVTPS2PHX __m256h _mm512_mask_cvtxps_ph (__m256h src, __mmask16 k, __m512 a);
VCVTPS2PHX __m256h _mm512_maskz_cvtxps_ph (__mmask16 k, __m512 a);
```

## SIMD coma flotante Excepciones

Invalid, Underflow, Overflow, Precision, Denormal (if MXCSR.DAZ=0).

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-46, "Tipo E2 Clase Condiciones de Excepción."

Additionally:     If VEX.W=1.

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
#UD
```
