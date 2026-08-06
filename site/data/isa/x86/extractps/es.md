---
summary: Extracto Embalado valores en coma flotante
---

## Descripción

Extrae un valor en coma flotante de precisión simple del operando de origen (segundo operando) en el offset de 32 bits especificado de imm8. Se ignoran bits inmediatos superiores a la mas significativo offset para la longitud del vector.

El valor en coma flotante de precisión simple extraído se almacena en los bajos 32 bits del operando de destino

En modo de 64 bits, el registro de destino operando tiene tamaño de operando predeterminado de 64 bits. Los 32 bits superiores del registro están llenos de cero. REX.W es ignorado.

VEX.128 y EVEX versión codificada: Cuando VEX.W1 o EVEX.W1 se utiliza en modo de 64 bits con un registro de proposito general (GPR) como un operando de destino, la cantidad única empacada es cero extendida a 64 bits.

VEX.vvvv/EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

128-bit Legacy SSE versión: Cuando un prefijo REX.W se utiliza en modo de 64 bits con un registro de proposito general (GPR) como un operando de destino, la cantidad única embalada es cero extendida a 64 bits.

El registro de origen es un registro XMM. Imm8[1:0] determina la compensación inicial DWORD de la cual extraer el valor en coma flotante de 32 bits.

Si VEXTRACTPS está codificado con VEX.L= 1, un intento de ejecutar la instrucción codificada con VEX.L= 1 causará una excepción #UD.

## Operación

```text
VEXTRACTPS (EVEX and VEX.128 Encoded Version)
SRC_OFFSET := IMM8[1:0]
IF (64-Bit Mode and DEST is register)

    DEST[31:0] := (SRC[127:0] >> (SRC_OFFSET*32)) AND 0FFFFFFFFh
    DEST[63:32] := 0
ELSE
    DEST[31:0] := (SRC[127:0] >> (SRC_OFFSET*32)) AND 0FFFFFFFFh
FI

EXTRACTPS (128-bit Legacy SSE Version)
SRC_OFFSET := IMM8[1:0]
IF (64-Bit Mode and DEST is register)

    DEST[31:0] := (SRC[127:0] >> (SRC_OFFSET*32)) AND 0FFFFFFFFh
    DEST[63:32] := 0
ELSE
    DEST[31:0] := (SRC[127:0] >> (SRC_OFFSET*32)) AND 0FFFFFFFFh
FI
```

## Intel C/C++ compilador intrínseco

```c
EXTRACTPS int _mm_extract_ps (__m128 a, const int nidx);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-59, "Tipo E9NF Clase Condiciones de Excepción."

Additionally:

```text
#UD               IF VEX.L = 0.
```

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```
