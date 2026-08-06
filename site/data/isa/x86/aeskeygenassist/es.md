---
summary: AES Ronda clave Asistencia de generación
---

## Descripción

Ayuda en la ampliación del Cifra AES clave, mediante pasos de cálculo hacia la generación de una ronda clave para el cifrado, utilizando datos de 128 bits especificados en el operando de origen y una constante de 8 bits redonda especificada como un inmediato, almacenar el resultado en el operando de destino.

El operando de destino es un registro XMM. El operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits.

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
AESKEYGENASSIST
X3[31:0] := SRC [127: 96];
X2[31:0] := SRC [95: 64];
X1[31:0] := SRC [63: 32];
X0[31:0] := SRC [31: 0];
RCON[31:0] := ZeroExtend(imm8[7:0]);
DEST[31:0] := SubWord(X1);
DEST[63:32 ] := RotWord( SubWord(X1) ) XOR RCON;
DEST[95:64] := SubWord(X3);
DEST[127:96] := RotWord( SubWord(X3) ) XOR RCON;
DEST[MAXVL-1:128] (Unmodified)


VAESKEYGENASSIST
X3[31:0] := SRC [127: 96];
X2[31:0] := SRC [95: 64];
X1[31:0] := SRC [63: 32];
X0[31:0] := SRC [31: 0];
RCON[31:0] := ZeroExtend(imm8[7:0]);
DEST[31:0] := SubWord(X1);
DEST[63:32 ] := RotWord( SubWord(X1) ) XOR RCON;
DEST[95:64] := SubWord(X3);
DEST[127:96] := RotWord( SubWord(X3) ) XOR RCON;
DEST[MAXVL-1:128] := 0;
```

## Intel C/C++ compilador intrínseco

```c
(V)AESKEYGENASSIST __m128i _mm_aeskeygenassist (__m128i, const int);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además:

```text
#UD               If VEX.vvvv  1111B.
```
