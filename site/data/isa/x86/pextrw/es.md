---
summary: Extract Word
---

## Descripción

Copia la palabra en el operando de origen (segundo operando) especificada por el conteo operando (tercer operando) al operando de destino (primer operando). El operando de origen puede ser un registro de tecnología MMX o un registro XMM. El operando de destino puede ser la palabra baja de un registro de proposito general o una dirección de memoria de 16 bits. El conteo operando es un inmediato de 8 bits. Al especificar una ubicación de palabras en un registro de tecnología MMX, los 2 bits menos significativos del recuento operando especifican la ubicación; para un registro XMM, los 3 bits menos significativos especifican la ubicación. El contenido del registro de destino arriba bit 16 se pone a cero (configurado a todos los 0s).

En modo de 64 bits, usando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15, R8-15). Si el operando de destino es un registro de proposito general, el tamaño de operando predeterminado es de 64 bits en modo de 64 bits.

Nota: En VEX.128 versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, VEX.L debe ser 0, de lo contrario la instrucción será #UD. En EVEX.128 versiones codificadas, EVEX.vvvv está reservado y debe ser 1111b, EVEX.L debe ser 0,

de lo contrario la instrucción será #UD. Si el operando de destino es un registro, el tamaño de operando predeterminado en modo de 64 bits para VPEXTRW es de 64 bits, los bits por encima de los datos menos significativo byte/word/dword se llenan con ceros.

## Operación

```text
IF (DEST = Mem16)
THEN

    SEL := COUNT[2:0];
    TEMP := (Src >> SEL*16) AND FFFFH;
    Mem16 := TEMP[15:0];
ELSE IF (64-Bit Mode and destination is a general-purpose register)
    THEN

          FOR (PEXTRW instruction with 64-bit source operand)
             { SEL := COUNT[1:0];
               TEMP := (SRC >> (SEL  16)) AND FFFFH;
                r64[15:0] := TEMP[15:0];
                r64[63:16] := ZERO_FILL; };

          FOR (PEXTRW instruction with 128-bit source operand)
             { SEL := COUNT[2:0];
               TEMP := (SRC >> (SEL  16)) AND FFFFH;
                r64[15:0] := TEMP[15:0];
                r64[63:16] := ZERO_FILL; }

    ELSE
          FOR (PEXTRW instruction with 64-bit source operand)
            { SEL := COUNT[1:0];
               TEMP := (SRC >> (SEL  16)) AND FFFFH;
                r32[15:0] := TEMP[15:0];
                r32[31:16] := ZERO_FILL; };
          FOR (PEXTRW instruction with 128-bit source operand)
            { SEL := COUNT[2:0];
               TEMP := (SRC >> (SEL  16)) AND FFFFH;
                r32[15:0] := TEMP[15:0];
                r32[31:16] := ZERO_FILL; };

    FI;
FI;

VPEXTRW ( dest=m16)
SRC_Offset := imm8[2:0]
Mem16 := (Src >> Src_Offset*16)

VPEXTRW ( dest=reg)
IF (64-Bit Mode )
THEN

    SRC_Offset := imm8[2:0]
    DEST[15:0] := ((Src >> Src_Offset*16) AND 0FFFFh)
    DEST[63:16] := ZERO_FILL;
ELSE
    SRC_Offset := imm8[2:0]
    DEST[15:0] := ((Src >> Src_Offset*16) AND 0FFFFh)
    DEST[31:16] := ZERO_FILL;
FI
```

## Intel C/C++ compilador intrínseco

```c
PEXTRW int _mm_extract_pi16 (__m64 a, int n) PEXTRW int _mm_extract_epi16 ( __m128i a, int imm);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-59, "Tipo E9NF Clase Condiciones de Excepción."

Additionally:

```text
#UD                   If VEX.L = 1 or EVEX.L'L > 0.
```

If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
