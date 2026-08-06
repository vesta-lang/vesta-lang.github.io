---
summary: Palabra horizontal empacada Mínimo
---

## Descripción

Determinar el valor mínimo de palabra no firmado en el operando de origen (segundo operando) y colocar la palabra no firmada en la palabra baja (bits 0-15) del operando de destino (primer operando). El índice de palabras del valor mínimo se almacena en bits 16-18 del operando de destino. Las partes superiores restantes del destino se fijan en cero.

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del correspondiente registro de destino XMM no se modifican.

VEX.128 versión codificada: Bits (MAXVL-1:128) del destino XMM registro se ponen a cero. VEX.vvvv está reservado y debe ser 1111b, VEX.L debe ser 0, de lo contrario la instrucción será #UD.

## Operación

```text
PHMINPOSUW (128-bit Legacy SSE Version)
INDEX := 0;
MIN := SRC[15:0]
IF (SRC[31:16] < MIN)

    THEN INDEX := 1; MIN := SRC[31:16]; FI;
IF (SRC[47:32] < MIN)

    THEN INDEX := 2; MIN := SRC[47:32]; FI;
* Repeat operation for words 3 through 6
IF (SRC[127:112] < MIN)

    THEN INDEX := 7; MIN := SRC[127:112]; FI;
DEST[15:0] := MIN;
DEST[18:16] := INDEX;
DEST[127:19] := 0000000000000000000000000000H;

VPHMINPOSUW (VEX.128 Encoded Version)
INDEX := 0
MIN := SRC[15:0]
IF (SRC[31:16] < MIN) THEN INDEX := 1; MIN := SRC[31:16]
IF (SRC[47:32] < MIN) THEN INDEX := 2; MIN := SRC[47:32]
* Repeat operation for words 3 through 6
IF (SRC[127:112] < MIN) THEN INDEX := 7; MIN := SRC[127:112]
DEST[15:0] := MIN
DEST[18:16] := INDEX
DEST[127:19] := 0000000000000000000000000000H
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
PHMINPOSUW __m128i _mm_minpos_epu16( __m128i packed_words);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además:

```text
#UD               If VEX.L = 1.
```

```text
                  If VEX.vvvv  1111B.
```
