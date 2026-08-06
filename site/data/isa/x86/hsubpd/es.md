---
summary: Subtracto horizontal de coma flotante de precisión doble
---

## Descripción

La instrucción HSUBPD resta horizontalmente los números coma flotante de precisión doble empaquetados de ambos operandos.

Subtracts el valor en coma flotante de precisión doble en el cuadword alto del operando de destino del cuadword bajo del operando de destino y almacena el resultado en el cuadword bajo del operando de destino.

Subtracts el valor en coma flotante de precisión doble en el cuadword alto del operando de origen del cuadword bajo del operando de origen y almacena el resultado en el cuadword alto del operando de destino.

En modo de 64 bits, el uso del prefijo REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

See Figure 3-16 for HSUBPD; see Figure 3-17 for VHSUBPD.

HSUBPD xmm1, xmm2/m128

```text
                               [127:64]                             [63:0]                     xmm2
```

/m128

```text
                               [127:64]                             [63:0]                     xmm1
```

```text
                               xmm2/m128[63:0] -                    xmm1[63:0] - xmm1[127:64]  Result:
                               xmm2/m128[127:64]                                    [63:0]     xmm1
```

[127:64]

OM15995

Figura 3-16. HSUBPD--Packed coma flotante de precisión doble Horizontal Subtract

SRC1  X3           X2                                                   X1       X0

```text
                   Y2                                                   Y1       Y0
```

SRC2  Y3       X2 - X3                                              Y0 - Y1  X0 - X1

DEST  Y2 - Y3

Figura 3-17. Operación VHSUBPD

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados.

VEX.128 versión codificada: el primer operando de origen es un registro XMM o 128-bit ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

## Operación

```text
HSUBPD (128-bit Legacy SSE Version)
DEST[63:0] := SRC1[63:0] - SRC1[127:64]
DEST[127:64] := SRC2[63:0] - SRC2[127:64]
DEST[MAXVL-1:128] (Unmodified)

VHSUBPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC1[127:64]
DEST[127:64] := SRC2[63:0] - SRC2[127:64]
DEST[MAXVL-1:128] := 0

VHSUBPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC1[127:64]
DEST[127:64] := SRC2[63:0] - SRC2[127:64]
DEST[191:128] := SRC1[191:128] - SRC1[255:192]
DEST[255:192] := SRC2[191:128] - SRC2[255:192]
```

## Intel C/C++ compilador intrínseco

```c
HSUBPD __m128d _mm_hsub_pd(__m128d a, __m128d b) VHSUBPD __m256d _mm256_hsub_pd (__m256d a, __m256d b);
Exceptions When the source operand is a memory operand, the operand must be aligned on a 16-byte boundary or a general- protection exception (#GP) will be generated.;
```

## Excepciones numéricas

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Ver Tabla 2-19, "Tipo 2 Condiciones de Excepción de Clase".
