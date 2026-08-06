---
summary: Cambio de doble cuádword derecho lógica
---

## Descripción

Shifts el operando de destino (primer operando) a la derecha por el número de bytes especificados en el conteo operando (segundo operando). Los bytes vacíos de alto orden se limpian (configurados a todos los 0s). Si el valor especificado por el conteo operando es mayor de 15, el operando de destino se establece a todos los 0s. El conteo operando es un inmediato de 8 bits.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

128-bit Legacy SSE versión: La fuente y operandos de destino son los mismos. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: La fuente y operandos de destino son registros XMM. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

VEX.256 versión codificada: El operando de origen es un registro YMM. El operando de destino es un registro YMM. Bits (MAXVL-1:256) del registro ZMM correspondiente se ponen a cero. El conteo operando se aplica tanto a las líneas bajas como a las altas de 128 bits.

EVEX versiones codificadas: El operando de origen es un registro ZMM/YMM/XMM o un 512/256/128-bit ubicación de memoria. El operando de destino es un registro ZMM/YMM/XMM. El conteo operando se aplica a cada vía de 128 bits.

Nota: VEX.vvvv/EVEX.vvvv codifica el registro de destino.

## Operación

```text
VPSRLDQ (EVEX.512 Encoded Version)
TEMP := COUNT
IF (TEMP > 15) THEN TEMP := 16; FI
DEST[127:0] := SRC[127:0] >> (TEMP * 8)
DEST[255:128] := SRC[255:128] >> (TEMP * 8)
DEST[383:256] := SRC[383:256] >> (TEMP * 8)
DEST[511:384] := SRC[511:384] >> (TEMP * 8)
DEST[MAXVL-1:512] := 0;

VPSRLDQ (VEX.256 and EVEX.256 Encoded Version)
TEMP := COUNT
IF (TEMP > 15) THEN TEMP := 16; FI
DEST[127:0] := SRC[127:0] >> (TEMP * 8)
DEST[255:128] := SRC[255:128] >> (TEMP * 8)
DEST[MAXVL-1:256] := 0;

VPSRLDQ (VEX.128 and EVEX.128 Encoded Version)
TEMP := COUNT
IF (TEMP > 15) THEN TEMP := 16; FI
DEST := SRC >> (TEMP * 8)
DEST[MAXVL-1:128] := 0;

PSRLDQ (128-bit Legacy SSE Version)
TEMP := COUNT
IF (TEMP > 15) THEN TEMP := 16; FI
DEST := DEST >> (TEMP * 8)
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
(V)PSRLDQ __m128i _mm_srli_si128 ( __m128i a, int imm) VPSRLDQ __m256i _mm256_bsrli_epi128 ( __m256i, const int) VPSRLDQ __m512i _mm512_bsrli_epi128 ( __m512i, int);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-24, "Tipo 7 Condiciones de Excepción de Clase." Instruccion codificada por EVEX, ver Excepciones Tipo E4NF.nb en Tabla 2-52, "Tipo E4NF Condiciones de Excepción de Clase".
