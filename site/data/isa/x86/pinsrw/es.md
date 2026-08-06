---
summary: Insertar Word
---

## Descripción

Tres instrucciones operando MMX y SSE:

Copia una palabra del operando de origen e inserta en el operando de destino en el lugar especificado con el conteo operando. (Las otras palabras en el registro de destino se quedan sin tocar.) el operando de origen puede ser un registro de proposito general o una ubicación de memoria de 16 bits. (Cuando el operando de origen es un registro de proposito general, se copia la palabra baja del registro.) el operando de destino puede ser un registro de tecnología MMX o un registro XMM. El conteo operando es un inmediato de 8 bits. Al especificar una ubicación de palabras en un registro de tecnología MMX, los 2 bits menos significativos del recuento operando especifican la ubicación; para un registro XMM, los 3 bits menos significativos especifican la ubicación.

Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

Cuatro instrucciones operando AVX y AVX-512:

Combina una palabra del primer operando de origen con el segundo operando de origen, e inserta en el operando de destino en la ubicación especificada con el conteo operando. El segundo operando de origen puede ser un registro de proposito general o una ubicación de memoria de 16 bits. (Cuando el operando de origen es un registro de proposito general, se copia la palabra baja del registro.) La primera fuente y operandos de destino son los registros XMM. El conteo operando es un inmediato de 8 bits. Al especificar una ubicación de la palabra, los 3 bits menos significativos especifican la ubicación.

Bits (MAXVL-1:128) del destino YMM registro se ponen a cero. VEX.L/EVEX.L'L debe ser 0, de lo contrario la instrucción será #UD.

## Operación

```text
PINSRW dest, src, imm8 (MMX)
    SEL := imm8[1:0]
    DEST.word[SEL] := src.word[0]

PINSRW dest, src, imm8 (SSE)
    SEL := imm8[2:0]
    DEST.word[SEL] := src.word[0]

VPINSRW dest, src1, src2, imm8 (AVX/AVX512)
    SEL := imm8[2:0]
    DEST := src1
    DEST.word[SEL] := src2.word[0]
    DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
PINSRW __m64 _mm_insert_pi16 (__m64 a, int d, int n) PINSRW __m128i _mm_insert_epi16 ( __m128i a, int b, int imm);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-59, "Tipo E9NF Clase Condiciones de Excepción."

Additionally:

```text
#UD                  If VEX.L = 1 or EVEX.L'L > 0.
```
