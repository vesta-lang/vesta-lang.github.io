---
summary: Convertir Valores FP16 en coma flotante de precisión simple
---

## Descripción

Esta instrucción convierte la media precisión empaquetada (16-bits) valores en coma flotante en los pedazos de orden bajo del operando de origen (el segundo operando) a valores en coma flotante de precisión simple empaquetados y escribe los valores convertidos en el operando de destino (el primer operando).

Si el caso de un operando denormal, el resultado normal correcto es devuelto. MXCSR.DAZ es ignorado y se trata como si fuera 0. No se reporta una excepción denormal en MXCSR.

VEX.128 versión: El operando de origen es un registro XMM o ubicación de memoria de 64 bits. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

VEX.256 versión: El operando de origen es un registro XMM o 128-bit ubicación de memoria. El operando de destino es un registro YMM. Bits (MAXVL-1:256) del registro de destino correspondiente se ponen a cero.

EVEX versiones codificadas: El operando de origen es un registro YMM/XMM/XMM (bajo 64-bits) o un 256/128/64-bit ubicación de memoria. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

El diagrama a continuación ilustra cómo los datos se convierten de cuatro media precisión empaquetada (en 64 bits) a cuatro sola precisión (en 128 bits) valores en coma flotante.

Nota: VEX.vvvv y EVEX.vvvv están reservados (debe ser 1111b).

VCVTPH2PS xmm1, xmm2/mem64, imm8

```text
                 127            96 95              64 63       48 47             32 31       16 15             0
```

```text
                                                          VH3               VH2         VH1         VH0           xmm2/mem64
```

```text
                                                                                 convert     convert
```

```text
                       convert            convert
```

```text
                 127            96 95              64 63                    32 31                           0
```

VS0

```text
                       VS3                VS2                  VS1                                                xmm1
```

Figure 5-6. VCVTPH2PS (128-bit Version)

La instrucción VCVTPH2PSX es una nueva forma de la instrucción de conversión de PH a PS, codificada en el mapa 6. La versión anterior de la instrucción, VCVTPH2PS, que está presente en AVX512F (codificada en el mapa 2, 0F38) no admite la transmisión incrustada. La instrucción VCVTPH2PSX tiene la opción de transmisión integrada disponible.

Las instrucciones asociadas con AVX512 FP16 siempre descriptor FP16 entradas de números denormales; los insumos denormales no se tratan como cero.

## Operación

```text
vCvt_h2s(SRC1[15:0])
{
RETURN Cvt_Half_Precision_To_Single_Precision(SRC1[15:0]);
}

VCVTPH2PS (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

k := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] :=

             vCvt_h2s(SRC[k+15:k])

     ELSE

             IF *merging-masking*              ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                          ; zeroing-masking

                      DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VCVTPH2PS (VEX.256 Encoded Version)
DEST[31:0] := vCvt_h2s(SRC1[15:0]);
DEST[63:32] := vCvt_h2s(SRC1[31:16]);
DEST[95:64] := vCvt_h2s(SRC1[47:32]);
DEST[127:96] := vCvt_h2s(SRC1[63:48]);
DEST[159:128] := vCvt_h2s(SRC1[79:64]);
DEST[191:160] := vCvt_h2s(SRC1[95:80]);
DEST[223:192] := vCvt_h2s(SRC1[111:96]);
DEST[255:224] := vCvt_h2s(SRC1[127:112]);
DEST[MAXVL-1:256] := 0

VCVTPH2PS (VEX.128 Encoded Version)
DEST[31:0] := vCvt_h2s(SRC1[15:0]);
DEST[63:32] := vCvt_h2s(SRC1[31:16]);
DEST[95:64] := vCvt_h2s(SRC1[47:32]);
DEST[127:96] := vCvt_h2s(SRC1[63:48]);
DEST[MAXVL-1:128] := 0

VCVTPH2PSX DEST, SRC
VL = 128, 256, or 512
KL := VL/32

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *SRC is memory* and EVEX.b = 1:
                tsrc := SRC.fp16[0]
          ELSE
                tsrc := SRC.fp16[j]
          DEST.fp32[j] := Convert_fp16_to_fp32(tsrc)
    ELSE IF *zeroing*:
          DEST.fp32[j] := 0
    // else dest.fp32[j] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VCVTPH2PS __m512 _mm512_cvtph_ps( __m256i a);
VCVTPH2PS __m512 _mm512_mask_cvtph_ps(__m512 s, __mmask16 k, __m256i a);
VCVTPH2PS __m512 _mm512_maskz_cvtph_ps(__mmask16 k, __m256i a);
VCVTPH2PS __m512 _mm512_cvt_roundph_ps( __m256i a, int sae);
VCVTPH2PS __m512 _mm512_mask_cvt_roundph_ps(__m512 s, __mmask16 k, __m256i a, int sae);
VCVTPH2PS __m512 _mm512_maskz_cvt_roundph_ps( __mmask16 k, __m256i a, int sae);
VCVTPH2PS __m256 _mm256_mask_cvtph_ps(__m256 s, __mmask8 k, __m128i a);
VCVTPH2PS __m256 _mm256_maskz_cvtph_ps(__mmask8 k, __m128i a);
VCVTPH2PS __m128 _mm_mask_cvtph_ps(__m128 s, __mmask8 k, __m128i a);
VCVTPH2PS __m128 _mm_maskz_cvtph_ps(__mmask8 k, __m128i a);
VCVTPH2PS __m128 _mm_cvtph_ps ( __m128i m1);
VCVTPH2PS __m256 _mm256_cvtph_ps ( __m128i m1) VCVTPH2PSX __m512 _mm512_cvtx_roundph_ps (__m256h a, int sae);
VCVTPH2PSX __m512 _mm512_mask_cvtx_roundph_ps (__m512 src, __mmask16 k, __m256h a, int sae);
VCVTPH2PSX __m512 _mm512_maskz_cvtx_roundph_ps (__mmask16 k, __m256h a, int sae);
VCVTPH2PSX __m128 _mm_cvtxph_ps (__m128h a);
VCVTPH2PSX __m128 _mm_mask_cvtxph_ps (__m128 src, __mmask8 k, __m128h a);
VCVTPH2PSX __m128 _mm_maskz_cvtxph_ps (__mmask8 k, __m128h a);
VCVTPH2PSX __m256 _mm256_cvtxph_ps (__m128h a);
VCVTPH2PSX __m256 _mm256_mask_cvtxph_ps (__m256 src, __mmask8 k, __m128h a);
VCVTPH2PSX __m256 _mm256_maskz_cvtxph_ps (__mmask8 k, __m128h a);
VCVTPH2PSX __m512 _mm512_cvtxph_ps (__m256h a);
VCVTPH2PSX __m512 _mm512_mask_cvtxph_ps (__m512 src, __mmask16 k, __m256h a);
VCVTPH2PSX __m512 _mm512_maskz_cvtxph_ps (__mmask16 k, __m256h a);
```

## SIMD coma flotante Excepciones

Instrucciones codificadas por VEX: Inválido. Instrucciones codificadas por EVEX: Inválido. EVEX-encoded instructions with broadcast (VCVTPH2PSX): Inválido, denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-26, "Tipo 11 Condiciones de Excepción" (no informe #AC).

Instrucciones codificadas por EVEX, ver Tabla 2-62, "Tipo E11 Clase Condiciones de Excepción."

EVEX-encoded instructions with broadcast (VCVTPH2PSX), see Table 2-46, "Type E2 Class Excepcionion Conditions."

Additionally:     If VEX.W=1.

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
#UD
```
