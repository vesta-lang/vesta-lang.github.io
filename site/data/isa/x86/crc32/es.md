---
summary: Valor acumulado CRC32
---

## Descripción

Empezando con un valor inicial en el primer operando (operando de destino), acumula un valor CRC32 (polynomial 11EDC6F41H) para el segundo operando (operando de origen) y almacena el resultado en el operando de destino. El operando de origen puede ser un registro o una ubicación de memoria. El operando de destino debe ser un registro r32 o r64. Si el destino es un registro r64, el resultado de 32 bits se almacena en la palabra doble menos significativo y 00000000H se almacena en la palabra doble mas significativo del registro r64.

El valor inicial suministrado en el operando de destino es un entero de doble palabra almacenado en el registro r32 o la palabra doble menos significativo del registro r64. Para acumular progresivamente un valor CRC32, el software conserva el resultado de la operación CRC32 anterior en el operando de destino, luego ejecuta la instrucción CRC32 de nuevo con nuevos datos de entrada en el operando de origen. Los datos contenidos en el operando de origen se procesan en orden de bits reflejados. Esto significa que el bit mas significativo del operando de origen es tratado como el bit menos significativo del cociente, y así sucesivamente, para todos los bits del operando de origen. Asimismo, el resultado de la operación CRC se almacena en el operando de destino en orden de bits reflejado. Esto significa que el bit mas significativo del CRC resultante (bit 31) se almacena en el bit menos significativo del operando de destino (bit 0), y así sucesivamente, para todos los bits del CRC.

## Operación

```text
Notes:
    BIT_REFLECT64: DST[63-0] = SRC[0-63]
    BIT_REFLECT32: DST[31-0] = SRC[0-31]
    BIT_REFLECT16: DST[15-0] = SRC[0-15]
    BIT_REFLECT8: DST[7-0] = SRC[0-7]
    MOD2: Remainder from Polynomial division modulus 2


CRC32 instruction for 64-bit source operand and 64-bit destination operand:
    TEMP1[63-0] := BIT_REFLECT64 (SRC[63-0])
    TEMP2[31-0] := BIT_REFLECT32 (DEST[31-0])
    TEMP3[95-0] := TEMP1[63-0] << 32
    TEMP4[95-0] := TEMP2[31-0] << 64
    TEMP5[95-0] := TEMP3[95-0] XOR TEMP4[95-0]
    TEMP6[31-0] := TEMP5[95-0] MOD2 11EDC6F41H
    DEST[31-0] := BIT_REFLECT (TEMP6[31-0])
    DEST[63-32] := 00000000H

CRC32 instruction for 32-bit source operand and 32-bit destination operand:
    TEMP1[31-0] := BIT_REFLECT32 (SRC[31-0])
    TEMP2[31-0] := BIT_REFLECT32 (DEST[31-0])
    TEMP3[63-0] := TEMP1[31-0] << 32
    TEMP4[63-0] := TEMP2[31-0] << 32
    TEMP5[63-0] := TEMP3[63-0] XOR TEMP4[63-0]
    TEMP6[31-0] := TEMP5[63-0] MOD2 11EDC6F41H
    DEST[31-0] := BIT_REFLECT (TEMP6[31-0])

CRC32 instruction for 16-bit source operand and 32-bit destination operand:
    TEMP1[15-0] := BIT_REFLECT16 (SRC[15-0])
    TEMP2[31-0] := BIT_REFLECT32 (DEST[31-0])
    TEMP3[47-0] := TEMP1[15-0] << 32
    TEMP4[47-0] := TEMP2[31-0] << 16
    TEMP5[47-0] := TEMP3[47-0] XOR TEMP4[47-0]
    TEMP6[31-0] := TEMP5[47-0] MOD2 11EDC6F41H
    DEST[31-0] := BIT_REFLECT (TEMP6[31-0])

CRC32 instruction for 8-bit source operand and 64-bit destination operand:
    TEMP1[7-0] := BIT_REFLECT8(SRC[7-0])
    TEMP2[31-0] := BIT_REFLECT32 (DEST[31-0])
    TEMP3[39-0] := TEMP1[7-0] << 32
    TEMP4[39-0] := TEMP2[31-0] << 8
    TEMP5[39-0] := TEMP3[39-0] XOR TEMP4[39-0]
    TEMP6[31-0] := TEMP5[39-0] MOD2 11EDC6F41H
    DEST[31-0] := BIT_REFLECT (TEMP6[31-0])
    DEST[63-32] := 00000000H

CRC32 instruction for 8-bit source operand and 32-bit destination operand:
    TEMP1[7-0] := BIT_REFLECT8(SRC[7-0])
    TEMP2[31-0] := BIT_REFLECT32 (DEST[31-0])
    TEMP3[39-0] := TEMP1[7-0] << 32
    TEMP4[39-0] := TEMP2[31-0] << 8
    TEMP5[39-0] := TEMP3[39-0] XOR TEMP4[39-0]
    TEMP6[31-0] := TEMP5[39-0] MOD2 11EDC6F41H
    DEST[31-0] := BIT_REFLECT (TEMP6[31-0])
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
unsigned int _mm_crc32_u8( unsigned int crc, unsigned char data ) unsigned int _mm_crc32_u16( unsigned int crc, unsigned short data ) unsigned int _mm_crc32_u32( unsigned int crc, unsigned int data ) unsigned __int64 _mm_crc32_u64( unsigned __int64 crc, unsigned __int64 data );
```

## SIMD coma flotante Excepciones

None.
