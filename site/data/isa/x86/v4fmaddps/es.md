---
summary: Paquete coma flotante de precisión simple Fused Multiply-Add
---

## Descripción

Esta instrucción compute 4 secuencial empaquetado coma flotante de precisión simple multi-add instrucciones con un operando de memoria seleccionado secuencialmente en cada uno de los cuatro pasos.

En el cuadro anterior, la notación de "+3" se utiliza para denotar que la instrucción accede a 4 registros de fuentes basados en ese operando; las fuentes son consecutivas, comienzan en un múltiplo de 4 límites, y contienen el registro codificado operando.

Esta instrucción admite la supresión de la falla de memoria. El operando de memoria entero está cargado si cualquiera de los 16 bits de máscaras significativas más bajos se establece a 1 o si se utiliza una codificación "sin máscaras".

El tipo tuple Tuple1 4X implica que cuatro elementos de 32 bits (16 bytes) se refieren a la parte de operación de memoria de esta instrucción.

El redondeo se realiza en cada límite FMA (que se fusiona y multiplica). Las excepciones también se toman secuencialmente. Preand post-computational exceptions of the first FMA take priority over the preand post-computational exceptions of the second FMA, etc.

## Operación

```text
src_reg_id is the 5 bit index of the vector register specified in the instruction as the src1 register.

define NFMA_PS(kl, vl, dest, k1, msrc, regs_loaded, src_base, posneg):
    tmpdest := dest

// reg[] is an array representing the SIMD register file.
FOR j := 0 to regs_loaded-1:

     FOR i := 0 to kl-1:

            IF k1[i] or *no writemask*:

                  IF posneg = 0:
                     tmpdest.single[i] := RoundFPControl_MXCSR(tmpdest.single[i] - reg[src_base + j ].single[i] * msrc.single[j])

                  ELSE:
                     tmpdest.single[i] := RoundFPControl_MXCSR(tmpdest.single[i] + reg[src_base + j ].single[i] * msrc.single[j])

            ELSE IF *zeroing*:
                tmpdest.single[i] := 0

dest := tmpdst
dest[MAX_VL-1:VL] := 0

V4FMADDPS and V4FNMADDPS dest{k1}, src1, msrc (AVX512)
KL, VL = (16,512)

regs_loaded := 4
src_base := src_reg_id & ~3 // for src1 operand
posneg := 0 if negative form, 1 otherwise
NFMA_PS(kl, vl, dest, k1, msrc, regs_loaded, src_base, posneg)
```

## Intel C/C++ compilador intrínseco

```c
V4FMADDPS __m512 _mm512_4fmadd_ps( __m512, __m512x4, __m128 *);
V4FMADDPS __m512 _mm512_mask_4fmadd_ps(__m512, __mmask16, __m512x4, __m128 *);
V4FMADDPS __m512 _mm512_maskz_4fmadd_ps(__mmask16, __m512, __m512x4, __m128 *);
V4FNMADDPS __m512 _mm512_4fnmadd_ps(__m512, __m512x4, __m128 *);
V4FNMADDPS __m512 _mm512_mask_4fnmadd_ps(__m512, __mmask16, __m512x4, __m128 *);
V4FNMADDPS __m512 _mm512_maskz_4fnmadd_ps(__mmask16, __m512, __m512x4, __m128 *);
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
