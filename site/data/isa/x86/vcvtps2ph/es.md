---
summary: Convertir Valor FP de una sola precisión en valor FP de 16 bits
---

## Descripción

Convertir los valores flotantes de precisión simple en el operando de origen a media precisión (16-bit) valores en coma flotante y almacenar al operando de destino. El modo de redondeo se especifica utilizando el campo inmediato (imm8).

Los resultados de la subida (es decir, pequeños resultados) se convierten en denormales. MXCSR.FTZ es ignorado. Si un elemento fuente es denormal en relación con el formato de entrada con DM enmascarado y por lo menos uno de PM o UM desenmascarado; una excepción SIMD se elevará con conjunto DE, UE y PE.

VCVTPS2PH xmm1/mem64, xmm2, imm8

```text
             127              96 95           64 63                             32 31                          0
```

VS0

```text
                  VS3                VS2                               VS1                                           xmm2
```

convert

```text
                  convert            convert                           convert
```

```text
             127              96 95           64 63                    48 47         32 31       16 15            0
```

```text
                                                                 VH3            VH2         VH1         VH0          xmm1/mem64
```

Figure 5-7. VCVTPS2PH (128-bit Version)

El byte inmediato define varios campos de bits que controlan la operación de redondeo. El efecto y la codificación del campo RC se enumeran en el cuadro 5-3.

**Immediate Byte Encoding for 16-bit coma flotante Conversion Instructions**

| Bits | Nombre del campo/valor | Descripción | Comentario |
| --- | --- | --- | --- |
| RC=00B | Ronda a nea | descansar incluso si Imm[2] = | 0 |
| RC=01B | Regreso |  |  |
| RC=10B | Regreso |  |  |
| RC=11B | Truncate |  |  |

## Operación

```text
vCvt_s2h(SRC1[31:0])
{
IF Imm[2] = 0
THEN ; using Imm[1:0] for rounding control, see Table 5-3

    RETURN Cvt_Single_Precision_To_Half_Precision_FP_Imm(SRC1[31:0]);
ELSE ; using MXCSR.RC for rounding control

    RETURN Cvt_Single_Precision_To_Half_Precision_FP_Mxcsr(SRC1[31:0]);
FI;
}


VCVTPS2PH (EVEX Encoded Versions) When DEST is a Register

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 16

k := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] :=

             vCvt_s2h(SRC[k+31:k])

     ELSE

             IF *merging-masking*          ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE                      ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0

VCVTPS2PH (EVEX Encoded Versions) When DEST is Memory
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 16
    k := j * 32
    IF k1[j] OR *no writemask*

          THEN DEST[i+15:i] :=
                vCvt_s2h(SRC[k+31:k])

          ELSE
                *DEST[i+15:i] remains unchanged* ; merging-masking

    FI;
ENDFOR

VCVTPS2PH (VEX.256 Encoded Version)
DEST[15:0] := vCvt_s2h(SRC1[31:0]);
DEST[31:16] := vCvt_s2h(SRC1[63:32]);
DEST[47:32] := vCvt_s2h(SRC1[95:64]);
DEST[63:48] := vCvt_s2h(SRC1[127:96]);
DEST[79:64] := vCvt_s2h(SRC1[159:128]);
DEST[95:80] := vCvt_s2h(SRC1[191:160]);
DEST[111:96] := vCvt_s2h(SRC1[223:192]);
DEST[127:112] := vCvt_s2h(SRC1[255:224]);
DEST[MAXVL-1:128] := 0

VCVTPS2PH (VEX.128 Encoded Version)
DEST[15:0] := vCvt_s2h(SRC1[31:0]);
DEST[31:16] := vCvt_s2h(SRC1[63:32]);
DEST[47:32] := vCvt_s2h(SRC1[95:64]);
DEST[63:48] := vCvt_s2h(SRC1[127:96]);
DEST[MAXVL-1:64] := 0
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VCVTPS2PH __m256i _mm512_cvtps_ph(__m512 a);
VCVTPS2PH __m256i _mm512_mask_cvtps_ph(__m256i s, __mmask16 k,__m512 a);
VCVTPS2PH __m256i _mm512_maskz_cvtps_ph(__mmask16 k,__m512 a);
VCVTPS2PH __m256i _mm512_cvt_roundps_ph(__m512 a, const int imm);
VCVTPS2PH __m256i _mm512_mask_cvt_roundps_ph(__m256i s, __mmask16 k,__m512 a, const int imm);
VCVTPS2PH __m256i _mm512_maskz_cvt_roundps_ph(__mmask16 k,__m512 a, const int imm);
VCVTPS2PH __m128i _mm256_mask_cvtps_ph(__m128i s, __mmask8 k,__m256 a);
VCVTPS2PH __m128i _mm256_maskz_cvtps_ph(__mmask8 k,__m256 a);
VCVTPS2PH __m128i _mm_mask_cvtps_ph(__m128i s, __mmask8 k,__m128 a);
VCVTPS2PH __m128i _mm_maskz_cvtps_ph(__mmask8 k,__m128 a);
VCVTPS2PH __m128i _mm_cvtps_ph ( __m128 m1, const int imm);
VCVTPS2PH __m128i _mm256_cvtps_ph(__m256 m1, const int imm);
```

## SIMD coma flotante Excepciones

Invalid, Underflow, Overflow, Precision, Denormal (if MXCSR.DAZ=0).

## Otras excepciones

VEX-encoded instructions, ver Tabla 2-26, "Tipo 11 Clase Condiciones de Excepción" (no informe #AC);

Instrucciones codificadas por EVEX, ver Tabla 2-62, "Tipo E11 Clase Condiciones de Excepción."

Additionally:     If VEX.W=1.

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
#UD
```
