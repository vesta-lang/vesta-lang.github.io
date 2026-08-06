---
summary: Escalar coma flotante de precisión simple Fused Multiply-Add
---

## Descripción

Esta instrucción compute 4 secuencial escalar fusionado coma flotante de precisión simple multiplica-add instrucciones con un operando de memoria seleccionado secuencialmente en cada uno de los cuatro pasos.

En el cuadro anterior, la notación de "+3" se utiliza para denotar que la instrucción accede a 4 registros de fuentes basados en que operando; las fuentes son consecutivas, comienzan en un múltiplo de 4 límites, y contienen el registro codificado operando.

Esta instrucción admite la supresión de la falla de memoria. Todo el operando de memoria está cargado si el bit de máscara menos significativo se fija a 1 o si se utiliza una codificación "sin máscaras".

El tipo tuple Tuple1 4X implica que cuatro elementos de 32 bits (16 bytes) se refieren a la parte de operación de memoria de esta instrucción.

El redondeo se realiza en cada límite FMA. Las excepciones también se toman secuencialmente. Preand post-computational exceptions of the first FMA take priority over the preand post-computational exceptions of the second FMA, etc.

## Operación

```text
src_reg_id is the 5 bit index of the vector register specified in the instruction as the src1 register.

define NFMA_SS(vl, dest, k1, msrc, regs_loaded, src_base, posneg):
    tmpdest := dest

    // reg[] is an array representing the SIMD register file.

    IF k1[0] or *no writemask*:
         FOR j := 0 to regs_loaded - 1:

                IF posneg = 0:
                    tmpdest.single[0] := RoundFPControl_MXCSR(tmpdest.single[0] - reg[src_base + j ].single[0] * msrc.single[j])

                ELSE:
                    tmpdest.single[0] := RoundFPControl_MXCSR(tmpdest.single[0] + reg[src_base + j ].single[0] * msrc.single[j])

    ELSE IF *zeroing*:
         tmpdest.single[0] := 0

    dest := tmpdst
    dest[MAX_VL-1:VL] := 0



V4FMADDSS and V4FNMADDSS dest{k1}, src1, msrc (AVX512)
VL = 128

regs_loaded := 4
src_base := src_reg_id & ~3 // for src1 operand
posneg := 0 if negative form, 1 otherwise
NFMA_SS(vl, dest, k1, msrc, regs_loaded, src_base, posneg)
```

## Intel C/C++ compilador intrínseco

```c
V4FMADDSS __m128 _mm_4fmadd_ss(__m128, __m128x4, __m128 *);
V4FMADDSS __m128 _mm_mask_4fmadd_ss(__m128, __mmask8, __m128x4, __m128 *);
V4FMADDSS __m128 _mm_maskz_4fmadd_ss(__mmask8, __m128, __m128x4, __m128 *);
V4FNMADDSS __m128 _mm_4fnmadd_ss(__m128, __m128x4, __m128 *);
V4FNMADDSS __m128 _mm_mask_4fnmadd_ss(__m128, __mmask8, __m128x4, __m128 *);
V4FNMADDSS __m128 _mm_maskz_4fnmadd_ss(__mmask8, __m128, __m128x4, __m128 *);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

See Type E2; additionally:

```text
#UD               If the EVEX broadcast bit is set to 1.
```

```text
#UD               If the MODRM.mod = 0b11.
```
