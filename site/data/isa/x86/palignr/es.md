---
summary: Packing Align Right
---

## Descripción

(V)PALIGNR concatena el operando de destino (el primer operando) y el operando de origen (el segundo operando) en un compuesto intermedio, cambia el composite en la granularidad byte a la derecha por una constante inmediata, y extrae el resultado alineado derecho en el destino. El primero y el segundo operandos puede ser un MMX, XMM o un registro YMM. El valor inmediato se considera no firmado. El cambio inmediato cuenta más grande que el 2L (es decir, 32 para 128-bit operandos, o 16 para 64-bit operandos) producen un resultado cero. Ambos operandos pueden ser registros MMX, registros XMM o registros YMM. Cuando el operando de origen es un operando de memoria de 128 bits, el operando debe estar alineado en un límite de 16 bytes o una excepción de protección general (#GP) se generará.

En modo de 64 bits y no codificado por VEX/EVEX prefijo, utilice el prefijo REX para acceder a registros adicionales.

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

EVEX.512 versión codificada: El primer operando de origen es un registro ZMM y contiene cuatro bloques de 16 bytes. El segundo operando de origen es un registro ZMM o una ubicación de memoria de 512 bits que contiene cuatro bloques de 16 bytes. El operando de destino es un registro ZMM y contiene cuatro resultados de 16 bytes. El imm8[7:0] es el recuento de cambio común

utilizado para cada una de las cuatro sucesivas fuentes de bloques de 16 bytes. El bloque de 16 bytes bajo de los dos operandos de origen produce el resultado de 16 bytes bajo del operando de destino, el bloque de 16 bytes alto de los dos operandos de origen produce el alto resultado de 16 bytes del operando de destino y así sucesivamente para los bloques en el centro.

VEX.256 y EVEX.256 versiones codificadas: El primer operando de origen es un registro YMM y contiene dos bloques de 16 bytes. El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits que contiene dos bloques de 16 bytes. El operando de destino es un registro YMM y contiene dos resultados de 16 bytes. El imm8[7:0] es el recuento de cambio común utilizado para las dos fuentes de bloques inferiores de 16 bytes y las dos fuentes superiores de bloques de 16 bytes. El bloque de 16 bytes bajo de los dos operandos de origen produce el resultado de 16 bytes bajo del operando de destino, el bloque de 16 bytes alto de los dos operandos de origen produce el alto resultado de 16 bytes del operando de destino. Los bits superiores (MAXVL- 1:256) del destino de registro ZMM correspondiente se ponen a cero.

VEX.128 y EVEX.128 versiones codificadas: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL- 1:128) del destino de registro ZMM correspondiente se ponen a cero.

La concatenación se realiza con datos de 128 bits en la primera y segundo operando de origen para instrucciones de 128 bits y 256 bits. Los 128 bits altos del resultado de 256 bits compuesto intermedio procedían de los datos de 128 bits del primer operando de origen; los 128 bits bajos del resultado intermedio procedían de los datos de 128 bits del segundo operando de origen.

```text
                             127                      0 127                  0
                   SRC1           128 255                                       SRC2
```

```text
         255                                                          Imm8[7:0]*8
```

SRC1                                                         128

SRC2

Imm8[7:0]*8

```text
         255                      128 127                                       0
```

DEST DEST

Figure 4-7. 256-bit VPALIGN Instruction Operation

## Operación

```text
PALIGNR (With 64-bit Operands)

    temp1[127:0] = CONCATENATE(DEST,SRC)>>(imm8*8)
    DEST[63:0] = temp1[63:0]

PALIGNR (With 128-bit Operands)
temp1[255:0] := ((DEST[127:0] << 128) OR SRC[127:0])>>(imm8*8);
DEST[127:0] := temp1[127:0]
DEST[MAXVL-1:128] (Unmodified)

VPALIGNR (VEX.128 Encoded Version)
temp1[255:0] := ((SRC1[127:0] << 128) OR SRC2[127:0])>>(imm8*8);
DEST[127:0] := temp1[127:0]
DEST[MAXVL-1:128] := 0

VPALIGNR (VEX.256 Encoded Version)
temp1[255:0] := ((SRC1[127:0] << 128) OR SRC2[127:0])>>(imm8[7:0]*8);
DEST[127:0] := temp1[127:0]
temp1[255:0] := ((SRC1[255:128] << 128) OR SRC2[255:128])>>(imm8[7:0]*8);
DEST[MAXVL-1:128] := temp1[127:0]

VPALIGNR (EVEX Encoded Versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR l := 0 TO VL-1 with increments of 128
    temp1[255:0] := ((SRC1[l+127:l] << 128) OR SRC2[l+127:l])>>(imm8[7:0]*8);
    TMP_DEST[l+127:l] := temp1[127:0]

ENDFOR;

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := TMP_DEST[i+7:i]

     ELSE

            IF *merging-masking*            ; merging-masking

                THEN *DEST[i+7:i] remains unchanged*

                ELSE *zeroing-masking*      ; zeroing-masking

                    DEST[i+7:i] = 0

            FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
PALIGNR __m64 _mm_alignr_pi8 (__m64 a, __m64 b, int n) (V)PALIGNR __m128i _mm_alignr_epi8 (__m128i a, __m128i b, int n) VPALIGNR __m256i _mm256_alignr_epi8 (__m256i a, __m256i b, const int n) VPALIGNR __m512i _mm512_alignr_epi8 (__m512i a, __m512i b, const int n) VPALIGNR __m512i _mm512_mask_alignr_epi8 (__m512i s, __mmask64 m, __m512i a, __m512i b, const int n) VPALIGNR __m512i _mm512_maskz_alignr_epi8 ( __mmask64 m, __m512i a, __m512i b, const int n) VPALIGNR __m256i _mm256_mask_alignr_epi8 (__m256i s, __mmask32 m, __m256i a, __m256i b, const int n) VPALIGNR __m256i _mm256_maskz_alignr_epi8 (__mmask32 m, __m256i a, __m256i b, const int n) VPALIGNR __m128i _mm_mask_alignr_epi8 (__m128i s, __mmask16 m, __m128i a, __m128i b, const int n) VPALIGNR __m128i _mm_maskz_alignr_epi8 (__mmask16 m, __m128i a, __m128i b, const int n);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

EVEX-encoded instruction, ver Excepciones Tipo E4NF.nb en la tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."
