---
summary: Realizar una Cálculo Intermedio para los siguientes cuatro palabras de mensaje SHA1
---

## Descripción

La instrucción SHA1MSG1 es una de las dos instrucciones de programación de mensajes SHA1. La instrucción realiza un cálculo intermedio para los siguientes cuatro dwords de mensaje SHA1.

## Operación

```text
SHA1MSG1
W0 := SRC1[127:96] ;
W1 := SRC1[95:64] ;
W2 := SRC1[63: 32] ;
W3 := SRC1[31: 0] ;
W4 := SRC2[127:96] ;
W5 := SRC2[95:64] ;

DEST[127:96] := W2 XOR W0;
DEST[95:64] := W3 XOR W1;
DEST[63:32] := W4 XOR W2;
DEST[31:0] := W5 XOR W3;
```

## Intel C/C++ compilador intrínseco

```c
SHA1MSG1 __m128i _mm_sha1msg1_epu32(__m128i, __m128i);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
