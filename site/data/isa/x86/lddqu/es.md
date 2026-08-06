---
summary: Carga de carga no religiosa 128 bits
---

## Descripción

La instrucción es funcionalmente similar a (V)MOVDQU ymm/xmm, m256/m128 para cargar de memoria. Es decir: 32/16 bytes de datos que comienzan en una dirección especificada por la fuente operando de memoria (segundo operando) se obtienen de la memoria y se colocan en un registro de destino (primer operando). El operando de origen no necesita alinearse en un límite de 32/16 bytes. Se pueden cargar hasta 64/32 bytes de memoria; esto depende de la implementación.

Esta instrucción puede mejorar el rendimiento en relación con (V)MOVDQU si el operando de origen cruza un límite de línea de caché. En situaciones que requieren que los datos cargados por (V)LDDQU sean modificados y almacenados en la misma ubicación, use (V)MOVDQU o (V)MOVDQA en lugar de (V)LDDQU. Para mover un cuadword doble a o desde lugares de memoria que se sabe que están alineados en límites de 16 bytes, utilice la instrucción (V)MOVDQA.

Notas de aplicación

* Si la fuente está alineada con un límite de 32/16 bytes, sobre la base de la aplicación, los bytes 32/16 pueden ser

cargado más de una vez. Por esa razón, el uso de (V)LDDQU debe evitarse al utilizar regiones de memoria no grabadas o de combinación de escritura (WC). Para las regiones de memoria no cubiertas o WC, siga utilizando (V)MOVDQU.

* Esta instrucción es un reemplazo para (V)MOVDQU (carga) en situaciones en las que las divisiones de la línea de caché afectan significativamente

rendimiento. No se debe utilizar en situaciones en las que el reenvío de carga de la tienda es crítico de rendimiento. Si el rendimiento del reenvío de la carga de la tienda es crítico para la aplicación, use (V)MOVDQA pares de carga de la tienda cuando los datos son 256/128-bit alineados o (V)MOVDQU pares de carga de la tienda cuando los datos son 256/128-bit no deseados.

* Si la dirección de memoria no está alineada en el límite de 32/16 bytes, algunas implementaciones pueden cargar hasta 64/32

bytes y retorno 32/16 bytes en el destino. Algunas implementaciones de procesadores pueden emitir múltiples cargas para acceder a los bytes 32/16 apropiados. Los desarrolladores de software multi-treaded o multi-procesador deben ser conscientes de que en estos procesadores las cargas se realizarán de forma no atómica.

* Si la comprobación de alineación está habilitada (CR0.AM = 1, RFLAGS.AC = 1, y CPL = 3), una excepción de comprobación de alineación

(#AC) puede o no ser generado (dependiendo de la implementación del procesador) cuando la dirección de memoria no está alineada en un límite de 8 bytes.

En modo de 64 bits, el uso del prefijo REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
LDDQU (128-bit Legacy SSE Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] (Unmodified)


VLDDQU (VEX.128 Encoded Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] := 0

VLDDQU (VEX.256 Encoded Version)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0
```

## Intel C/C++ compilador intrínseco

```c
LDDQU __m128i _mm_lddqu_si128 (__m128i * p);
VLDDQU __m256i _mm256_lddqu_si256 (__m256i * p);
```

## Excepciones numéricas

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción". Nota Tratamiento de #AC varía.
