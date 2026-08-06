---
summary: Realizar un cálculo intermedio para el siguiente mensaje de cuatro SHA256
---

## Descripción

La instrucción SHA256MSG1 es una de las dos instrucciones de programación de mensajes SHA256. La instrucción realiza un cálculo intermedio para los siguientes cuatro dwords de mensaje SHA256.

## Operación

```text
SHA256MSG1
W4 := SRC2[31: 0] ;
W3 := SRC1[127:96] ;
W2 := SRC1[95:64] ;
W1 := SRC1[63: 32] ;
W0 := SRC1[31: 0] ;

DEST[127:96] := W3 + 0( W4);
DEST[95:64] := W2 + 0( W3);
DEST[63:32] := W1 + 0( W2);
DEST[31:0] := W0 + 0( W1);
```

## Intel C/C++ compilador intrínseco

```c
SHA256MSG1 __m128i _mm_sha256msg1_epu32(__m128i, __m128i);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
