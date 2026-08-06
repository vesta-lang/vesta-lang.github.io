---
summary: Calcular SHA1 Estado Variable E Después de cuatro rondas
---

## Descripción

El SHA1NEXTE calcula la variable E del estado SHA1 después de cuatro rondas de operación de la actual variable de estado SHA1 A en el operando de destino. El valor calculado de la variable E del estado SHA1 se añade al operando de origen, que contiene los dwords programados.

## Operación

```text
SHA1NEXTE
TMP := (SRC1[127:96] ROL 30);

DEST[127:96] := SRC2[127:96] + TMP;
DEST[95:64] := SRC2[95:64];
DEST[63:32] := SRC2[63:32];
DEST[31:0] := SRC2[31:0];
```

## Intel C/C++ compilador intrínseco

```c
SHA1NEXTE __m128i _mm_sha1nexte_epu32(__m128i, __m128i);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
