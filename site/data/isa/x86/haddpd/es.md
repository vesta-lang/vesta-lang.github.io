---
summary: Empaquetado coma flotante de precisión doble Horizontal Añadir
---

## Descripción

Agrega los valores en coma flotante de precisión doble en las cuádwords altas y bajas del operando de destino y almacena el resultado en el bajo quadword del operando de destino.

Agrega los valores en coma flotante de precisión doble en las cuádwords altas y bajas del operando de origen y almacena el resultado en el cuádpo alto del operando de destino.

En modo de 64 bits, el uso del prefijo REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

See Figure 3-12 for HADDPD; see Figure 3-13 for VHADDPD.

HADDPD xmm1, xmm2/m128

```text
                               [127:64]                              [63:0]               xmm2
```

/m128

```text
                               [127:64]                              [63:0]
```

xmm1

```text
                               xmm2/m128[63:0] +               xmm1[63:0] + xmm1[127:64]  Result:
                               xmm2/m128[127:64]                                [63:0]    xmm1
```

[127:64]

OM15993

Figura 3-12. HADDPD--Packed coma flotante de precisión doble Horizontal Add

SRC1  X3           X2                                              X1       X0

```text
                   Y2                                              Y1       Y0
```

SRC2  Y3       X2 + X3                                         Y0 + Y1  X0 + X1

DEST  Y2 + Y3

Figura 3-13. Operación VHADDPD

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados.

VEX.128 versión codificada: el primer operando de origen es un registro XMM o 128-bit ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

## Operación

```text
HADDPD (128-bit Legacy SSE Version)
DEST[63:0] := SRC1[127:64] + SRC1[63:0]
DEST[127:64] := SRC2[127:64] + SRC2[63:0]
DEST[MAXVL-1:128] (Unmodified)

VHADDPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[127:64] + SRC1[63:0]
DEST[127:64] := SRC2[127:64] + SRC2[63:0]
DEST[MAXVL-1:128] := 0

VHADDPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[127:64] + SRC1[63:0]
DEST[127:64] := SRC2[127:64] + SRC2[63:0]
DEST[191:128] := SRC1[255:192] + SRC1[191:128]
DEST[255:192] := SRC2[255:192] + SRC2[191:128]
```

## Intel C/C++ compilador intrínseco

```c
VHADDPD __m256d _mm256_hadd_pd (__m256d a, __m256d b);
HADDPD __m128d _mm_hadd_pd (__m128d a, __m128d b);
Exceptions When the source operand is a memory operand, the operand must be aligned on a 16-byte boundary or a general- protection exception (#GP) will be generated.;
```

## Excepciones numéricas

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Ver Tabla 2-19, "Tipo 2 Condiciones de Excepción de Clase".
