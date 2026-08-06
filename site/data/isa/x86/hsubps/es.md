---
summary: Subtracto horizontal de coma flotante de precisión simple
---

## Descripción

Subtracts el valor en coma flotante de precisión simple en el segundo dword del operando de destino del primer dword del operando de destino y almacena el resultado en el primer dword del operando de destino.

Subtracts el valor en coma flotante de precisión simple en el cuarto dword del operando de destino del tercer dword del operando de destino y almacena el resultado en el segundo dword del operando de destino.

Subtracts el valor en coma flotante de precisión simple en el segundo dword del operando de origen del primer dword del operando de origen y almacena el resultado en el tercer dword del operando de destino.

Subtracts el valor en coma flotante de precisión simple en el cuarto dword del operando de origen del tercer dword del operando de origen y almacena el resultado en el cuarto dword del operando de destino.

En modo de 64 bits, el uso del prefijo REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

See Figure 3-18 for HSUBPS; see Figure 3-19 for VHSUBPS.

HSUBPS xmm1, xmm2/m128

[127:96]             [95:64]                                            [63:32]        [31:0]      xmm2/ m128

[127:96]             [95:64]                                            [63:32]        [31:0]      xmm1

xmm2/m128            xmm2/m128                                     xmm1[95:64] -  xmm1[31:0] -    RESULT: [95:64] - xmm2/      [31:0] - xmm2/                                 xmm1[127:96]   xmm1[63:32]     xmm1 m128[127:96]         m128[63:32]

```text
                                                                      [63:32]          [31:0]
    [127:96]            [95:64]
```

OM15996

Figura 3-18. HSUBPS--Packed coma flotante de precisión simple Horizontal Subtract

SRC1 X7          X6  X5                                             X4  X3         X2          X1  X0

SRC2 Y7          Y6  Y5                                             Y4  Y3         Y2          Y1  Y0

DEST Y6-Y7 Y4-Y5     X6-X7 X4-X5 Y2-Y3 Y0-Y1 X2-X3 X0-X1

Figura 3-19. Operación VHSUBPS

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados. VEX.128 versión codificada: el primer operando de origen es un registro XMM o 128-bit ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero. VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

## Operación

```text
HSUBPS (128-bit Legacy SSE Version)
DEST[31:0] := SRC1[31:0] - SRC1[63:32]
DEST[63:32] := SRC1[95:64] - SRC1[127:96]
DEST[95:64] := SRC2[31:0] - SRC2[63:32]
DEST[127:96] := SRC2[95:64] - SRC2[127:96]
DEST[MAXVL-1:128] (Unmodified)

VHSUBPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC1[63:32]
DEST[63:32] := SRC1[95:64] - SRC1[127:96]
DEST[95:64] := SRC2[31:0] - SRC2[63:32]
DEST[127:96] := SRC2[95:64] - SRC2[127:96]
DEST[MAXVL-1:128] := 0

VHSUBPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC1[63:32]
DEST[63:32] := SRC1[95:64] - SRC1[127:96]
DEST[95:64] := SRC2[31:0] - SRC2[63:32]
DEST[127:96] := SRC2[95:64] - SRC2[127:96]
DEST[159:128] := SRC1[159:128] - SRC1[191:160]
DEST[191:160] := SRC1[223:192] - SRC1[255:224]
DEST[223:192] := SRC2[159:128] - SRC2[191:160]
DEST[255:224] := SRC2[223:192] - SRC2[255:224]
```

## Intel C/C++ compilador intrínseco

```c
HSUBPS __m128 _mm_hsub_ps(__m128 a, __m128 b);
VHSUBPS __m256 _mm256_hsub_ps (__m256 a, __m256 b);
Exceptions When the source operand is a memory operand, the operand must be aligned on a 16-byte boundary or a general- protection exception (#GP) will be generated.;
```

## Excepciones numéricas

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Ver Tabla 2-19, "Tipo 2 Condiciones de Excepción de Clase".
