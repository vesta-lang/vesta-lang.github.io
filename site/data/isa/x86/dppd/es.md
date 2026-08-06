---
summary: Producto de puntos de valores en coma flotante de precisión doble empaquetados
---

## Descripción

Multiplica condicionalmente los valores en coma flotante de precisión doble empaquetados en el operando de destino (primer operando) con los valores en coma flotante de precisión doble empaquetados en la fuente (segundo operando) dependiendo de una máscara extraída de bits [5:4] del operando inmediato (tercer operando). Si un bit de la máscara de condición es cero, la multiplicación correspondiente es reemplazada por un valor de 0.0 de la manera descrita por la Sección 12.8.4 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

Los dos valores de doble precisión resultantes se resumen en un resultado intermedio. El resultado intermedio se transmite condicionalmente al destino utilizando una máscara de transmisión especificada por bits [1:0] del byte inmediato.

Si un bit de máscara de transmisión es "1", el resultado intermedio se copia al elemento qword correspondiente en el operando de destino. Si un bit de máscara de transmisión es cero, el elemento correspondiente en el destino se establece a cero.

DPPD sigue las reglas de reenvío NaN establecidas en el Manual de Desarrolladores de Software, vol. 1, cuadro 4.7. Estas reglas no cubren la priorización horizontal de las NaNs. La propagación horizontal de las NaN al destino y el posicionamiento de esas NaN en el destino depende de la implementación. Los NaN en las fuentes de entrada o los NaN generados computacionalmente tendrán al menos un NaN propagado al destino.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados.

VEX.128 versión codificada: el primer operando de origen es un registro XMM o 128-bit ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero.

Si VDPPD está codificado con VEX.L= 1, un intento de ejecutar la instrucción codificada con VEX.L= 1 causará un

```text
#UD exception.
```

## Operación

```text
DP_primitive (SRC1, SRC2)
IF (imm8[4] = 1)

    THEN Temp1[63:0] := DEST[63:0] * SRC[63:0]; // update SIMD exception flags
    ELSE Temp1[63:0] := +0.0; FI;
IF (imm8[5] = 1)
    THEN Temp1[127:64] := DEST[127:64] * SRC[127:64]; // update SIMD exception flags
    ELSE Temp1[127:64] := +0.0; FI;
/* if unmasked exception reported, execute exception handler*/

Temp2[63:0] := Temp1[63:0] + Temp1[127:64]; // update SIMD exception flags
/* if unmasked exception reported, execute exception handler*/

IF (imm8[0] = 1)
    THEN DEST[63:0] := Temp2[63:0];
    ELSE DEST[63:0] := +0.0; FI;

IF (imm8[1] = 1)
    THEN DEST[127:64] := Temp2[63:0];
    ELSE DEST[127:64] := +0.0; FI;

DPPD (128-bit Legacy SSE Version)
DEST[127:0] := DP_Primitive(SRC1[127:0], SRC2[127:0]);
DEST[MAXVL-1:128] (Unmodified)

VDPPD (VEX.128 Encoded Version)
DEST[127:0] := DP_Primitive(SRC1[127:0], SRC2[127:0]);
DEST[MAXVL-1:128] := 0
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
DPPD __m128d _mm_dp_pd ( __m128d a, __m128d b, const int mask);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

Las excepciones se determinan por separado para cada operación agregada y multiplicada. Las excepciones desenmascaradas dejarán intacto el destino.

## Otras excepciones

Ver Tabla 2-19, "Tipo 2 Condiciones de Excepción", además:

```text
#UD               If VEX.L= 1.
```
