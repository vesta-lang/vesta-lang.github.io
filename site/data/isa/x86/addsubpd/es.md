---
summary: Packed coma flotante de precisión doble Add/Subtract
---

## Descripción

Añade valores en coma flotante de precisión doble del primer operando de origen (segundo operando) con los valores en coma flotante de precisión doble correspondiente del segundo operando de origen (tercer operando); almacena el resultado en los valores de número impar del operando de destino (primer operando). Sube los valores en coma flotante de precisión doble numerado del segundo operando de origen de los valores flotantes de doble precisión correspondientes en el primer operando de origen; almacena el resultado en los valores numerados del operando de destino.

En modo de 64 bits, el uso de un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados. Véase la Figura 3-3.

VEX.128 versión codificada: el primer operando de origen es un registro XMM o 128-bit ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

ADDSUBPD xmm1, xmm2/m128

[127:64]                                                       [63:0]                        xmm2/m128

xmm1[127:64] + xmm2/m128[127:64]                               xmm1[63:0] - xmm2/m128[63:0]  RESULT:

```text
                   [127:64]                                                     [63:0]       xmm1
```

Figura 3-3. ADDSUBPD--Packed coma flotante de precisión doble Add/Subtract

## Operación

```text
ADDSUBPD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] - SRC[63:0]
DEST[127:64] := DEST[127:64] + SRC[127:64]
DEST[MAXVL-1:128] (Unmodified)

VADDSUBPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC2[63:0]
DEST[127:64] := SRC1[127:64] + SRC2[127:64]
DEST[MAXVL-1:128] := 0

VADDSUBPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC2[63:0]
DEST[127:64] := SRC1[127:64] + SRC2[127:64]
DEST[191:128] := SRC1[191:128] - SRC2[191:128]
DEST[255:192] := SRC1[255:192] + SRC2[255:192]
```

## Intel C/C++ compilador intrínseco

```c
ADDSUBPD __m128d _mm_addsub_pd(__m128d a, __m128d b) VADDSUBPD __m256d _mm256_addsub_pd (__m256d a, __m256d b) Exceptions When the source operand is a memory operand, it must be aligned on a 16-byte boundary or a general-protection exception (#GP) will be generated.;
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Ver Tabla 2-19, "Tipo 2 Condiciones de Excepción de Clase".
