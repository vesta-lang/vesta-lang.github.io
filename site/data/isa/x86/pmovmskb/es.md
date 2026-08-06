---
summary: Mover Byte Mask Op/ 64/32 bit CPUID
---

## Descripción

Crea una máscara compuesta por el bit mas significativo de cada byte del operando de origen (segundo operando) y almacena el resultado en el byte bajo o palabra del operando de destino (primer operando).

La máscara de byte es de 8 bits para operando de origen de 64 bits, 16 bits para operando de origen de 128 bits y 32 bits para operando de origen de 256 bits. El operando de destino es un registro de proposito general.

En modo de 64 bits, la instrucción puede acceder a registros adicionales (XMM8-XMM15, R8-R15) cuando se utiliza con un prefijo REX.R. El tamaño de operando predeterminado es de 64 bits en modo 64-bit.

Legacy SSE versión: El operando de origen es un registro de tecnología MMX.

128-bit Legacy SSE versión: El operando de origen es un registro XMM.

VEX.128 versión codificada: El operando de origen es un registro XMM.

VEX.256 versión codificada: El operando de origen es un registro YMM.

Nota: VEX.vvvv está reservado y debe ser 1111b.

## Operación

```text
PMOVMSKB (With 64-bit Source Operand and r32)

    r32[0] := SRC[7];
    r32[1] := SRC[15];
    (* Repeat operation for bytes 2 through 6 *)
    r32[7] := SRC[63];
    r32[31:8] := ZERO_FILL;


(V)PMOVMSKB (With 128-bit Source Operand and r32)
    r32[0] := SRC[7];
    r32[1] := SRC[15];
    (* Repeat operation for bytes 2 through 14 *)
    r32[15] := SRC[127];
    r32[31:16] := ZERO_FILL;

VPMOVMSKB (With 256-bit Source Operand and r32)
r32[0] := SRC[7];
r32[1] := SRC[15];
(* Repeat operation for bytes 3rd through 31*)
r32[31] := SRC[255];

PMOVMSKB (With 64-bit Source Operand and r64)
    r64[0] := SRC[7];
    r64[1] := SRC[15];
    (* Repeat operation for bytes 2 through 6 *)
    r64[7] := SRC[63];
    r64[63:8] := ZERO_FILL;

(V)PMOVMSKB (With 128-bit Source Operand and r64)
    r64[0] := SRC[7];
    r64[1] := SRC[15];
    (* Repeat operation for bytes 2 through 14 *)
    r64[15] := SRC[127];
    r64[63:16] := ZERO_FILL;

VPMOVMSKB (With 256-bit Source Operand and r64)
r64[0] := SRC[7];
r64[1] := SRC[15];
(* Repeat operation for bytes 2 through 31*)
r64[31] := SRC[255];
r64[63:32] := ZERO_FILL;
```

## Intel C/C++ compilador intrínseco

```c
PMOVMSKB int _mm_movemask_pi8(__m64 a) (V)PMOVMSKB int _mm_movemask_epi8 ( __m128i a) VPMOVMSKB int _mm256_movemask_epi8 ( __m256i a);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

Ver Tabla 2-24, "Tipo 7 Condiciones de Excepción", además:

```text
#UD                 If VEX.vvvv  1111B.
```
