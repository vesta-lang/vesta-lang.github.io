---
summary: Extracto Byte/Dword/Qword
---

## Descripción

Extraiga un valor entero byte/dword/qword de la fuente XMM registro en un offset byte/dword/qword determinado de imm8[3:0]. El destino puede ser un registro o byte/dword/qword ubicación de memoria. Si el destino es un registro, los bits superiores del registro son cero extendidos.

En el legado no-VEX versión codificada y si el operando de destino es un registro, el tamaño de operando predeterminado en modo de 64 bits para PEXTRB/PEXTRD es de 64 bits, los bits por encima de los datos de byte/dword menos significativo están llenos de ceros. PEXTRQ no es encodable en modos no-64-bit y requiere REX.W en modo de 64-bit.

Nota: En VEX.128 versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, VEX.L debe ser 0, de lo contrario la instrucción será #UD. En EVEX.128 versiones codificadas, EVEX.vvvv está reservado y debe ser 1111b, EVEX.L"L debe ser 0, de lo contrario la instrucción será #UD. Si el operando de destino es un registro, el tamaño de operando predeterminado en modo de 64 bits para VPEXTRB/VPEXTRD es de 64 bits, los bits por encima de los datos menos significativo byte/word/dword se llenan con ceros.

## Operación

```text
CASE of
    PEXTRB: SEL := COUNT[3:0];
                TEMP := (Src >> SEL*8) AND FFH;
                IF (DEST = Mem8)
                       THEN
                       Mem8 := TEMP[7:0];
                ELSE IF (64-Bit Mode and 64-bit register selected)
                       THEN
                             R64[7:0] := TEMP[7:0];
                             r64[63:8] := ZERO_FILL; };
                ELSE
                             R32[7:0] := TEMP[7:0];
                             r32[31:8] := ZERO_FILL; };
                FI;
    PEXTRD:SEL := COUNT[1:0];
                TEMP := (Src >> SEL*32) AND FFFF_FFFFH;
                DEST := TEMP;
    PEXTRQ: SEL := COUNT[0];
                TEMP := (Src >> SEL*64);
                DEST := TEMP;

EASC:

VPEXTRTD/VPEXTRQ
IF (64-Bit Mode and 64-bit dest operand)
THEN

    Src_Offset := imm8[0]
    r64/m64 := (Src >> Src_Offset * 64)
ELSE
    Src_Offset := imm8[1:0]
    r32/m32 := ((Src >> Src_Offset *32) AND 0FFFFFFFFh);
FI

VPEXTRB ( dest=m8)
SRC_Offset := imm8[3:0]
Mem8 := (Src >> Src_Offset*8)

VPEXTRB ( dest=reg)
IF (64-Bit Mode )
THEN

    SRC_Offset := imm8[3:0]
    DEST[7:0] := ((Src >> Src_Offset*8) AND 0FFh)
    DEST[63:8] := ZERO_FILL;
ELSE
    SRC_Offset := imm8[3:0];
    DEST[7:0] := ((Src >> Src_Offset*8) AND 0FFh);
    DEST[31:8] := ZERO_FILL;
FI
```

## Intel C/C++ compilador intrínseco

```c
PEXTRB int _mm_extract_epi8 (__m128i src, const int ndx);
PEXTRD int _mm_extract_epi32 (__m128i src, const int ndx);
PEXTRQ __int64 _mm_extract_epi64 (__m128i src, const int ndx);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-59, "Tipo E9NF Clase Condiciones de Excepción."

Additionally:

```text
#UD               If VEX.L = 1 or EVEX.L'L > 0.
```

If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
