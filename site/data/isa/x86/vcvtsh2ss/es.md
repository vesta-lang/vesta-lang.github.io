---
summary: Convertir Valor bajo FP16 en Valor FP32
---

## Descripción

Esta instrucción convierte el elemento FP16 bajo en el segundo operando de origen al elemento FP32 bajo del operando de destino.

Los bits 127:32 del operando de destino son copiados de los bits correspondientes del primer operando de origen. Bits MAXVL-1:128 del operando de destino se ponen a cero. El elemento FP16 bajo del destino se actualiza según la máscara de escritura.

## Operación

```text
VCVTSH2SS dest, src1, src2
IF k1[0] OR *no writemask*:

    DEST.fp32[0] := Convert_fp16_to_fp32(SRC2.fp16[0])
ELSE IF *zeroing*:

    DEST.fp32[0] := 0
// else dest.fp32[0] remains unchanged

DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCVTSH2SS __m128 _mm_cvt_roundsh_ss (__m128 a, __m128h b, const int sae);
VCVTSH2SS __m128 _mm_mask_cvt_roundsh_ss (__m128 src, __mmask8 k, __m128 a, __m128h b, const int sae);
VCVTSH2SS __m128 _mm_maskz_cvt_roundsh_ss (__mmask8 k, __m128 a, __m128h b, const int sae);
VCVTSH2SS __m128 _mm_cvtsh_ss (__m128 a, __m128h b);
VCVTSH2SS __m128 _mm_mask_cvtsh_ss (__m128 src, __mmask8 k, __m128 a, __m128h b);
VCVTSH2SS __m128 _mm_maskz_cvtsh_ss (__mmask8 k, __m128 a, __m128h b);
```

## SIMD coma flotante Excepciones

Invalid, Denormal.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."
