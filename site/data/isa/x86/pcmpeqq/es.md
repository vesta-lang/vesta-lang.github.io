---
summary: Comparar Datos de Qword empaquetados para igual
---

## Descripción

Realiza una comparación de SIMD para la igualdad de los cuadwords empaquetados en el operando de destino (primer operando) y el operando de origen (segundo operando). Si un par de elementos de datos es igual, el elemento de datos correspondiente en el destino se establece en los 1s; de lo contrario, se establece en 0s.

128-bit Legacy SSE versión: El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. La primera fuente y operandos de destino son registros XMM. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. La primera fuente y operandos de destino son registros XMM. Bits (MAXVL-1:128) del registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

EVEX codificado VPCMPEQQ: El primer operando de origen (segundo operando) es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino (primer operando) es un registro de máscaras actualizado según la máscara de escritura k2.

## Operación

```text
PCMPEQQ (With 128-bit Operands)
IF (DEST[63:0] = SRC[63:0])

    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;


    ELSE DEST[63:0] := 0; FI;
IF (DEST[127:64] = SRC[127:64])

    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0; FI;
DEST[MAXVL-1:128] (Unmodified)

COMPARE_QWORDS_EQUAL (SRC1, SRC2)
    IF SRC1[63:0] = SRC2[63:0]
    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[63:0] := 0; FI;
    IF SRC1[127:64] = SRC2[127:64]
    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0; FI;

VPCMPEQQ (VEX.128 Encoded Version)
DEST[127:0] := COMPARE_QWORDS_EQUAL(SRC1,SRC2)
DEST[MAXVL-1:128] := 0

VPCMPEQQ (VEX.256 Encoded Version)
DEST[127:0] := COMPARE_QWORDS_EQUAL(SRC1[127:0],SRC2[127:0])
DEST[255:128] := COMPARE_QWORDS_EQUAL(SRC1[255:128],SRC2[255:128])
DEST[MAXVL-1:256] := 0

VPCMPEQQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k2[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN CMP := SRC1[i+63:i] = SRC2[63:0];

                  ELSE CMP := SRC1[i+63:i] = SRC2[i+63:i];

             FI;

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                        ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPCMPEQQ __mmask8 _mm512_cmpeq_epi64_mask( __m512i a, __m512i b);
VPCMPEQQ __mmask8 _mm512_mask_cmpeq_epi64_mask(__mmask8 k, __m512i a, __m512i b);
VPCMPEQQ __mmask8 _mm256_cmpeq_epi64_mask( __m256i a, __m256i b);
VPCMPEQQ __mmask8 _mm256_mask_cmpeq_epi64_mask(__mmask8 k, __m256i a, __m256i b);
VPCMPEQQ __mmask8 _mm_cmpeq_epi64_mask( __m128i a, __m128i b);
VPCMPEQQ __mmask8 _mm_mask_cmpeq_epi64_mask(__mmask8 k, __m128i a, __m128i b);
(V)PCMPEQQ __m128i _mm_cmpeq_epi64(__m128i a, __m128i b);
VPCMPEQQ __m256i _mm256_cmpeq_epi64( __m256i a, __m256i b);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Non-EVEX- instrucción codificada, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".EVEX- codificadoVPCMPEQQ, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."
