---
summary: Empaquetado Multiply de los enteros 52-Bit no firmados y añadir los productos bajos 52-Bit
---

## Descripción

Multiplica los enteros de 52 bits empaquetados en cada elemento qword del primer operando de origen (el segundo operando) con los enteros de 52 bits empaquetados en los elementos correspondientes del segundo operando de origen (el tercer operando) para formar los resultados intermedios de 104 bits empaquetados. El número bajo de 52 bits, entero sin firmar de cada producto de 104 bits se añade al entero sin firmar correspondiente del operando de destino (el primer operando) bajo la máscara de escritura k1.

El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1 a la granularidad de 64 bits.

## Operación

```text
VPMADDLUQ srcdest, src1, src2 (VEX version)
VL = (128,256)
KL = VL/64

FOR i in 0 .. KL-1:
    temp128 := zeroextend64(src1.qword[i][51:0]) *zeroextend64(src2.qword[i][51:0])
    srcdest.qword[i] := srcdest.qword[i] +zeroextend64(temp128[51:0])

srcdest[MAXVL:VL] := 0

VPMADD52LUQ (EVEX encoded)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64;
    IF k1[j] OR *no writemask* THEN

          IF src2 is Memory AND EVEX.b=1 THEN
                tsrc2[63:0] := ZeroExtend64(src2[51:0]);

          ELSE
                tsrc2[63:0] := ZeroExtend64(src2[i+51:i];

          FI;
          Temp128[127:0] := ZeroExtend64(src1[i+51:i]) * tsrc2[63:0];
          Temp2[63:0] := DEST[i+63:i] + ZeroExtend64(temp128[51:0]) ;
          DEST[i+63:i] := Temp2[63:0];
    ELSE
          IF *zeroing-masking* THEN

                DEST[i+63:i] := 0;
          ELSE *merge-masking*

                DEST[i+63:i] is unchanged;
          FI;
    FI;
ENDFOR

DEST[MAX_VL-1:VL] := 0;
```

## Intel C/C++ compilador intrínseco

```c
VPMADD52LUQ __m128i _mm_madd52lo_avx_epu64 (__m128i __X, __m128i __Y, __m128i __Z);
VPMADD52LUQ __m128i _mm_madd52lo_epu64( __m128i a, __m128i b, __m128i c);
VPMADD52LUQ __m128i _mm_madd52lo_epu64 (__m128i __X, __m128i __Y, __m128i __Z);
VPMADD52LUQ __m128i _mm_mask_madd52lo_epu64(__m128i s, __mmask8 k, __m128i a, __m128i b, __m128i c);
VPMADD52LUQ __m128i _mm_maskz_madd52lo_epu64( __mmask8 k, __m128i a, __m128i b, __m128i c);
VPMADD52LUQ __m256i _mm256_madd52lo_avx_epu64 (__m256i __X, __m256i __Y, __m256i __Z);
VPMADD52LUQ __m256i _mm256_madd52lo_epu64( __m256i a, __m256i b, __m256i c);
VPMADD52LUQ __m256i _mm256_madd52lo_epu64 (__m256i __X, __m256i __Y, __m256i __Z);
VPMADD52LUQ __m256i _mm256_mask_madd52lo_epu64(__m256i s, __mmask8 k, __m256i a, __m256i b, __m256i c);
VPMADD52LUQ __m256i _mm256_maskz_madd52lo_epu64( __mmask8 k, __m256i a, __m256i b, __m256i c);
VPMADD52LUQ __m512i _mm512_madd52lo_epu64( __m512i a, __m512i b, __m512i c);
VPMADD52LUQ __m512i _mm512_mask_madd52lo_epu64(__m512i s, __mmask8 k, __m512i a, __m512i b, __m512i c);
VPMADD52LUQ __m512i _mm512_maskz_madd52lo_epu64( __mmask8 k, __m512i a, __m512i b, __m512i c);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción". Instrucciones codificadas por EVEX, ver Tabla 2-51, "Tipo E4 Condiciones de Excepción de Clase".
