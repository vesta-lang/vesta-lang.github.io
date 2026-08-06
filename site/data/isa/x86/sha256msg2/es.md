---
summary: Realizar una Cálculo Final para los próximos cuatro Dwords de Mensaje SHA256
---

## Descripción

La instrucción SHA256MSG2 es una de las dos instrucciones de programación de mensajes SHA2. La instrucción realiza el cálculo final para los siguientes cuatro dwords de mensaje SHA256.

## Operación

```text
SHA256MSG2
W14 := SRC2[95:64] ;
W15 := SRC2[127:96] ;
W16 := SRC1[31: 0] + 1( W14) ;
W17 := SRC1[63: 32] + 1( W15) ;
W18 := SRC1[95: 64] + 1( W16) ;
W19 := SRC1[127: 96] + 1( W17) ;

DEST[127:96] := W19 ;
DEST[95:64] := W18 ;
DEST[63:32] := W17 ;
DEST[31:0] := W16;
```

## Intel C/C++ compilador intrínseco

```c
SHA256MSG2 __m128i _mm_sha256msg2_epu32(__m128i, __m128i);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
