---
summary: Producto de puntos de valores en coma flotante de precisión simple empaquetados
---

## Descripción

Multiplica condicionalmente los valores en coma flotante de precisión simple empaquetados en el operando de destino (primer operando) con los flotadores de precisión simples empaquetados en la fuente (segundo operando) dependiendo de una máscara extraída de los 4 pedazos altos del byte inmediato (tercer operando). Si una máscara de condición bit en imm8[7:4] es cero, la multiplicación correspondiente es reemplazada por un valor de 0.0 de la manera descrita por la Sección 12.8.4 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

Los cuatro valores de precisión únicos resultantes se resumen en un resultado intermedio. El resultado intermedio se transmite condicionalmente al destino utilizando una máscara de transmisión especificada por bits [3:0] del byte inmediato.

Si un bit de máscara de transmisión es "1", el resultado intermedio es copiado al elemento dword correspondiente en el operando de destino. Si un bit de máscara de transmisión es cero, el elemento correspondiente en el destino se establece a cero.

DPPS sigue las reglas de reenvío NaN establecidas en el Manual de Desarrolladores de Software, vol. 1, cuadro 4.7. Estas reglas no cubren la priorización horizontal de las NaNs. La propagación horizontal de las NaN al destino y el posicionamiento de esas NaN en el destino depende de la implementación. Los NaN en las fuentes de entrada o los NaN generados computacionalmente tendrán al menos un NaN propagado al destino.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados.

VEX.128 versión codificada: el primer operando de origen es un registro XMM o 128-bit ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

## Operación

```text
DP_primitive (SRC1, SRC2)
IF (imm8[4] = 1)

    THEN Temp1[31:0] := DEST[31:0] * SRC[31:0]; // update SIMD exception flags
    ELSE Temp1[31:0] := +0.0; FI;
IF (imm8[5] = 1)
    THEN Temp1[63:32] := DEST[63:32] * SRC[63:32]; // update SIMD exception flags
    ELSE Temp1[63:32] := +0.0; FI;
IF (imm8[6] = 1)
    THEN Temp1[95:64] := DEST[95:64] * SRC[95:64]; // update SIMD exception flags
    ELSE Temp1[95:64] := +0.0; FI;
IF (imm8[7] = 1)
    THEN Temp1[127:96] := DEST[127:96] * SRC[127:96]; // update SIMD exception flags
    ELSE Temp1[127:96] := +0.0; FI;

Temp2[31:0] := Temp1[31:0] + Temp1[63:32]; // update SIMD exception flags
/* if unmasked exception reported, execute exception handler*/
Temp3[31:0] := Temp1[95:64] + Temp1[127:96]; // update SIMD exception flags
/* if unmasked exception reported, execute exception handler*/
Temp4[31:0] := Temp2[31:0] + Temp3[31:0]; // update SIMD exception flags
/* if unmasked exception reported, execute exception handler*/

IF (imm8[0] = 1)
    THEN DEST[31:0] := Temp4[31:0];
    ELSE DEST[31:0] := +0.0; FI;

IF (imm8[1] = 1)
    THEN DEST[63:32] := Temp4[31:0];
    ELSE DEST[63:32] := +0.0; FI;

IF (imm8[2] = 1)
    THEN DEST[95:64] := Temp4[31:0];
    ELSE DEST[95:64] := +0.0; FI;

IF (imm8[3] = 1)
    THEN DEST[127:96] := Temp4[31:0];
    ELSE DEST[127:96] := +0.0; FI;

DPPS (128-bit Legacy SSE Version)
DEST[127:0] := DP_Primitive(SRC1[127:0], SRC2[127:0]);
DEST[MAXVL-1:128] (Unmodified)

VDPPS (VEX.128 Encoded Version)
DEST[127:0] := DP_Primitive(SRC1[127:0], SRC2[127:0]);
DEST[MAXVL-1:128] := 0

VDPPS (VEX.256 Encoded Version)
DEST[127:0] := DP_Primitive(SRC1[127:0], SRC2[127:0]);
DEST[255:128] := DP_Primitive(SRC1[255:128], SRC2[255:128]);
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
(V)DPPS __m128 _mm_dp_ps ( __m128 a, __m128 b, const int mask);
VDPPS __m256 _mm256_dp_ps ( __m256 a, __m256 b, const int mask);
```

## SIMD coma flotante Excepciones

Desbordamiento, Desbordamiento, Inválido, Precisión, Denormal. Las excepciones se determinan por separado para cada operación agregada y multiplicada, en el orden de su ejecución. Las excepciones desenmascaradas dejarán los operandos de destino sin cambios.

## Otras excepciones

Ver Tabla 2-19, "Tipo 2 Condiciones de Excepción de Clase".
