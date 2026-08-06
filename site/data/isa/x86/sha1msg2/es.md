---
summary: Realizar una Cálculo Final para los próximos cuatro Dwords de Mensaje SHA1
---

## Descripción

La instrucción SHA1MSG2 es una de las dos instrucciones de programación de mensajes SHA1. La instrucción realiza el cálculo final para derivar los siguientes cuatro dwords de mensaje SHA1.

## Operación

```text
SHA1MSG2
W13 := SRC2[95:64] ;
W14 := SRC2[63: 32] ;
W15 := SRC2[31: 0] ;
W16 := (SRC1[127:96] XOR W13 ) ROL 1;
W17 := (SRC1[95:64] XOR W14) ROL 1;
W18 := (SRC1[63: 32] XOR W15) ROL 1;
W19 := (SRC1[31: 0] XOR W16) ROL 1;

DEST[127:96] := W16;
DEST[95:64] := W17;
DEST[63:32] := W18;
DEST[31:0] := W19;
```

## Intel C/C++ compilador intrínseco

```c
SHA1MSG2 __m128i _mm_sha1msg2_epu32(__m128i, __m128i);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
