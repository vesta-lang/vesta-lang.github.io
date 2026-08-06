---
summary: Insertar Byte/Dword/Qword
---

## Descripción

Copia un byte/dword/qword del operando de origen (segundo operando) e inserta en el operando de destino (primer operando) en la ubicación especificada con el conteo operando (tercer operando). (Los otros elementos del registro de destino se quedan sin tocar.) el operando de origen puede ser un registro de proposito general o una ubicación de memoria. (Cuando el operando de origen es un registro de proposito general, PINSRB copia el byte bajo del registro.) el operando de destino es un registro XMM. El conteo operando es un inmediato de 8 bits. Al especificar una ubicación qword[dword, byte] en un registro XMM, el [2, 4] bit(s) menos significativo del conteo operando especificar la ubicación.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15, R8-15). El uso de REX.W permite el uso de 64 bits de registro de propósito general.

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: Bits (MAXVL-1:128) del registro de destino se ponen a cero. VEX.L debe ser 0, de lo contrario la instrucción será #UD. El intento de ejecutar VPINSRQ en modo no-64-bit causará #UD.

EVEX.128 versión codificada: Bits (MAXVL-1:128) del registro de destino se ponen a cero. EVEX.L'L debe ser 0, de lo contrario la instrucción será #UD.

## Operación

```text
CASE OF

    PINSRB: SEL := COUNT[3:0];
                MASK := (0FFH << (SEL * 8));
                TEMP := (((SRC[7:0] << (SEL *8)) AND MASK);

    PINSRD: SEL := COUNT[1:0];
                MASK := (0FFFFFFFFH << (SEL * 32));
                TEMP := (((SRC << (SEL *32)) AND MASK) ;

    PINSRQ: SEL := COUNT[0]
                MASK := (0FFFFFFFFFFFFFFFFH << (SEL * 64));
                TEMP := (((SRC << (SEL *64)) AND MASK) ;

ESAC;
          DEST := ((DEST AND NOT MASK) OR TEMP);

VPINSRB (VEX/EVEX Encoded Version)
SEL := imm8[3:0]
DEST[127:0] := write_b_element(SEL, SRC2, SRC1)
DEST[MAXVL-1:128] := 0

VPINSRD (VEX/EVEX Encoded Version)
SEL := imm8[1:0]
DEST[127:0] := write_d_element(SEL, SRC2, SRC1)
DEST[MAXVL-1:128] := 0

VPINSRQ (VEX/EVEX Encoded Version)
SEL := imm8[0]
DEST[127:0] := write_q_element(SEL, SRC2, SRC1)
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
PINSRB __m128i _mm_insert_epi8 (__m128i s1, int s2, const int ndx);
PINSRD __m128i _mm_insert_epi32 (__m128i s2, int s, const int ndx);
PINSRQ __m128i _mm_insert_epi64(__m128i s2, __int64 s, const int ndx);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-59, "Tipo E9NF Clase Condiciones de Excepción."

Additionally:

```text
#UD               If VEX.L = 1 or EVEX.L'L > 0.
```
