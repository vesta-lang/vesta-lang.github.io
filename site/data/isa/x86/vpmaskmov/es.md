---
summary: Acondicionado SIMD Integer Empaquetado cargas y tiendas
---

## Descripción

Condicionalmente mueve elementos de datos empaquetados del segundo operando de origen al elemento de datos correspondiente del operando de destino, dependiendo de los bits de máscara asociados con cada elemento de datos. Los bits de máscara se especifican en el primer operando de origen.

El bit de máscara para cada elemento de datos es el bit mas significativo de ese elemento en el primer operando de origen. Si una máscara es 1, el elemento de datos correspondiente se copia del segundo operando de origen al operando de destino. Si la máscara es 0, el elemento de datos correspondiente se establece a cero en la forma de carga de estas instrucciones, y sin modificar en el formulario de la tienda.

El segundo operando de origen es una dirección de memoria para la forma de carga de estas instrucciones. El operando de destino es una dirección de memoria para el formulario de la tienda de estas instrucciones. Los otros operandos son los registros XMM (para la versión VEX.128) o los registros YMM (para la versión VEX.256).

Las fallas ocurren sólo debido a los accesos de memoria requeridos de máscara-bit que causaron las fallas. Las fallas no se producirán debido a la referencia de cualquier ubicación de memoria si el bit de máscara correspondiente para que ubicación de memoria es 0. Por ejemplo, no se detectarán fallos si los bits de máscara son cero.

A diferencia de las instrucciones anteriores de MASKMOV (MASKMOVQ y MASKMOVDQU), una insinuación no temporal no se aplica a estas instrucciones.

Comportamiento de instrucciones sobre control de alineación reportando con bits de máscara de menos de los 1s son los mismos que con bits de máscara de los 1s.

VMASKMOV no debe ser utilizado para acceder a la memoria mapeado I/O como el orden de las cargas individuales o las tiendas que hace es la implementación específica.

En los casos en que bits de máscara indican que los datos no deben ser cargados o almacenados paging A y D bits se establecerán de forma dependiente de la implementación. Sin embargo, los bits A y D siempre se establecen para páginas donde los datos se cargan o almacenan.

Nota: para los formularios de carga, la primera fuente (la máscara) está codificada en VEX.vvvv; la segunda fuente está codificada en rm field, y el registro de destino está codificado en reg field.

Nota: para los formularios de almacenamiento, la primera fuente (la máscara) está codificada en VEX.vvvv; el segundo registro de fuente está codificado en reg field, y el destino ubicación de memoria está codificado en rm field.

## Operación

```text
VPMASKMOVD - 256-bit load
DEST[31:0] := IF (SRC1[31]) Load_32(mem) ELSE 0
DEST[63:32] := IF (SRC1[63]) Load_32(mem + 4) ELSE 0
DEST[95:64] := IF (SRC1[95]) Load_32(mem + 8) ELSE 0
DEST[127:96] := IF (SRC1[127]) Load_32(mem + 12) ELSE 0
DEST[159:128] := IF (SRC1[159]) Load_32(mem + 16) ELSE 0
DEST[191:160] := IF (SRC1[191]) Load_32(mem + 20) ELSE 0
DEST[223:192] := IF (SRC1[223]) Load_32(mem + 24) ELSE 0
DEST[255:224] := IF (SRC1[255]) Load_32(mem + 28) ELSE 0

VPMASKMOVD -128-bit load
DEST[31:0] := IF (SRC1[31]) Load_32(mem) ELSE 0
DEST[63:32] := IF (SRC1[63]) Load_32(mem + 4) ELSE 0
DEST[95:64] := IF (SRC1[95]) Load_32(mem + 8) ELSE 0
DEST[127:97] := IF (SRC1[127]) Load_32(mem + 12) ELSE 0
DEST[MAXVL-1:128] := 0

VPMASKMOVQ - 256-bit load
DEST[63:0] := IF (SRC1[63]) Load_64(mem) ELSE 0
DEST[127:64] := IF (SRC1[127]) Load_64(mem + 8) ELSE 0
DEST[195:128] := IF (SRC1[191]) Load_64(mem + 16) ELSE 0
DEST[255:196] := IF (SRC1[255]) Load_64(mem + 24) ELSE 0

VPMASKMOVQ - 128-bit load
DEST[63:0] := IF (SRC1[63]) Load_64(mem) ELSE 0
DEST[127:64] := IF (SRC1[127]) Load_64(mem + 16) ELSE 0
DEST[MAXVL-1:128] := 0

VPMASKMOVD - 256-bit store
IF (SRC1[31]) DEST[31:0] := SRC2[31:0]
IF (SRC1[63]) DEST[63:32] := SRC2[63:32]
IF (SRC1[95]) DEST[95:64] := SRC2[95:64]
IF (SRC1[127]) DEST[127:96] := SRC2[127:96]
IF (SRC1[159]) DEST[159:128] :=SRC2[159:128]
IF (SRC1[191]) DEST[191:160] := SRC2[191:160]
IF (SRC1[223]) DEST[223:192] := SRC2[223:192]
IF (SRC1[255]) DEST[255:224] := SRC2[255:224]


VPMASKMOVD - 128-bit store
IF (SRC1[31]) DEST[31:0] := SRC2[31:0]
IF (SRC1[63]) DEST[63:32] := SRC2[63:32]
IF (SRC1[95]) DEST[95:64] := SRC2[95:64]
IF (SRC1[127]) DEST[127:96] := SRC2[127:96]

VPMASKMOVQ - 256-bit store
IF (SRC1[63]) DEST[63:0] := SRC2[63:0]
IF (SRC1[127]) DEST[127:64] :=SRC2[127:64]
IF (SRC1[191]) DEST[191:128] := SRC2[191:128]
IF (SRC1[255]) DEST[255:192] := SRC2[255:192]

VPMASKMOVQ - 128-bit store
IF (SRC1[63]) DEST[63:0] := SRC2[63:0]
IF (SRC1[127]) DEST[127:64] :=SRC2[127:64]
```

## Intel C/C++ compilador intrínseco

```c
VPMASKMOVD: __m256i _mm256_maskload_epi32(int const *a, __m256i mask) VPMASKMOVD: void _mm256_maskstore_epi32(int *a, __m256i mask, __m256i b) VPMASKMOVQ: __m256i _mm256_maskload_epi64(__int64 const *a, __m256i mask);
VPMASKMOVQ: void _mm256_maskstore_epi64(__int64 *a, __m256i mask, __m256d b);
VPMASKMOVD: __m128i _mm_maskload_epi32(int const *a, __m128i mask) VPMASKMOVD: void _mm_maskstore_epi32(int *a, __m128i mask, __m128 b) VPMASKMOVQ: __m128i _mm_maskload_epi64(__int cont *a, __m128i mask);
VPMASKMOVQ: void _mm_maskstore_epi64(__int64 *a, __m128i mask, __m128i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-23, "Tipo 6 Condiciones de Excepción" (No se informó AC# para ninguna combinación de bits de máscara).
