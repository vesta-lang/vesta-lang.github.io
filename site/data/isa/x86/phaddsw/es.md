---
summary: Empaquetado Horizontal Add y Saturate
---

## Descripción

(V)PHADDSWañade dos enteros firmados adyacentes de 16 bits horizontalmente de la fuente yoperandos de destinoy satura los resultados firmados; empaqueta los resultados firmados, saturados de 16 bits ael operando de destino(primero)operandoCuándoel operando de origenes un 128-bitoperando de memoria, el operandodebe alinearse en un límite de 16 bytes ouna excepción de protección general (#GP) se generará.

Legacy SSE versión: Ambos operandos pueden ser registros MMX. El segundo operando de origen puede ser un registro MMX o una ubicación de memoria de 64 bits.

128-bit Legacy SSE versión: La primera fuente y operandos de destino son registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

En modo de 64 bits, utilice el prefijo REX para acceder a registros adicionales.

VEX.128 versión codificada: La primera fuente y operandos de destino son registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

VEX.256 versión codificada: La primera fuente y operandos de destino son registros YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits.

## Operación

```text
PHADDSW (With 64-bit Operands)
    mm1[15-0] = SaturateToSignedWord((mm1[31-16] + mm1[15-0]);
    mm1[31-16] = SaturateToSignedWord(mm1[63-48] + mm1[47-32]);
    mm1[47-32] = SaturateToSignedWord(mm2/m64[31-16] + mm2/m64[15-0]);
    mm1[63-48] = SaturateToSignedWord(mm2/m64[63-48] + mm2/m64[47-32]);


PHADDSW (With 128-bit Operands)

    xmm1[15-0]= SaturateToSignedWord(xmm1[31-16] + xmm1[15-0]);
    xmm1[31-16] = SaturateToSignedWord(xmm1[63-48] + xmm1[47-32]);
    xmm1[47-32] = SaturateToSignedWord(xmm1[95-80] + xmm1[79-64]);
    xmm1[63-48] = SaturateToSignedWord(xmm1[127-112] + xmm1[111-96]);
    xmm1[79-64] = SaturateToSignedWord(xmm2/m128[31-16] + xmm2/m128[15-0]);
    xmm1[95-80] = SaturateToSignedWord(xmm2/m128[63-48] + xmm2/m128[47-32]);
    xmm1[111-96] = SaturateToSignedWord(xmm2/m128[95-80] + xmm2/m128[79-64]);
    xmm1[127-112] = SaturateToSignedWord(xmm2/m128[127-112] + xmm2/m128[111-96]);

VPHADDSW (VEX.128 Encoded Version)
DEST[15:0]= SaturateToSignedWord(SRC1[31:16] + SRC1[15:0])
DEST[31:16] = SaturateToSignedWord(SRC1[63:48] + SRC1[47:32])
DEST[47:32] = SaturateToSignedWord(SRC1[95:80] + SRC1[79:64])
DEST[63:48] = SaturateToSignedWord(SRC1[127:112] + SRC1[111:96])
DEST[79:64] = SaturateToSignedWord(SRC2[31:16] + SRC2[15:0])
DEST[95:80] = SaturateToSignedWord(SRC2[63:48] + SRC2[47:32])
DEST[111:96] = SaturateToSignedWord(SRC2[95:80] + SRC2[79:64])
DEST[127:112] = SaturateToSignedWord(SRC2[127:112] + SRC2[111:96])
DEST[MAXVL-1:128] := 0

VPHADDSW (VEX.256 Encoded Version)
DEST[15:0]= SaturateToSignedWord(SRC1[31:16] + SRC1[15:0])
DEST[31:16] = SaturateToSignedWord(SRC1[63:48] + SRC1[47:32])
DEST[47:32] = SaturateToSignedWord(SRC1[95:80] + SRC1[79:64])
DEST[63:48] = SaturateToSignedWord(SRC1[127:112] + SRC1[111:96])
DEST[79:64] = SaturateToSignedWord(SRC2[31:16] + SRC2[15:0])
DEST[95:80] = SaturateToSignedWord(SRC2[63:48] + SRC2[47:32])
DEST[111:96] = SaturateToSignedWord(SRC2[95:80] + SRC2[79:64])
DEST[127:112] = SaturateToSignedWord(SRC2[127:112] + SRC2[111:96])
DEST[143:128]= SaturateToSignedWord(SRC1[159:144] + SRC1[143:128])
DEST[159:144] = SaturateToSignedWord(SRC1[191:176] + SRC1[175:160])
DEST[175:160] = SaturateToSignedWord( SRC1[223:208] + SRC1[207:192])
DEST[191:176] = SaturateToSignedWord(SRC1[255:240] + SRC1[239:224])
DEST[207:192] = SaturateToSignedWord(SRC2[127:112] + SRC2[143:128])
DEST[223:208] = SaturateToSignedWord(SRC2[159:144] + SRC2[175:160])
DEST[239:224] = SaturateToSignedWord(SRC2[191-160] + SRC2[159-128])
DEST[255:240] = SaturateToSignedWord(SRC2[255:240] + SRC2[239:224])
```

## Intel C/C++ compilador intrínseco

```c
PHADDSW __m64 _mm_hadds_pi16 (__m64 a, __m64 b) (V)PHADDSW __m128i _mm_hadds_epi16 (__m128i a, __m128i b) VPHADDSW __m256i _mm256_hadds_epi16 (__m256i a, __m256i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además:

```text
#UD               If VEX.L = 1.
```
