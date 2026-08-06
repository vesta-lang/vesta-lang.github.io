---
summary: Comparación lógica
---

## Descripción

PTEST y VPTEST establecen la bandera ZF si todos los bits en el resultado son 0 del bitwise AND del primer operando de origen (primer operando) y el segundo operando de origen (segundo operando). VPTEST establece la bandera CF si todos los bits en el resultado son 0 del bitwise AND del segundo operando de origen (segundo operando) y el lógico NOT del operando de destino.

El registro de primera fuente se especifica en el campo de regre ModR/M.

Versión 128-bit: El primer registro de origen es un registro XMM. El segundo registro de fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El registro de destino no está modificado.

VEX.256 versión codificada: El primer registro de origen es un registro YMM. El segundo registro de fuente puede ser un registro YMM o una ubicación de memoria de 256 bits. El registro de destino no está modificado.

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
(V)PTEST (128-bit Version)
IF (SRC[127:0] BITWISE AND DEST[127:0] = 0)

    THEN ZF := 1;
    ELSE ZF := 0;
IF (SRC[127:0] BITWISE AND NOT DEST[127:0] = 0)
    THEN CF := 1;
    ELSE CF := 0;
DEST (unmodified)
AF := OF := PF := SF := 0;

VPTEST (VEX.256 Encoded Version)
IF (SRC[255:0] BITWISE AND DEST[255:0] = 0) THEN ZF := 1;

    ELSE ZF := 0;
IF (SRC[255:0] BITWISE AND NOT DEST[255:0] = 0) THEN CF := 1;

    ELSE CF := 0;
DEST (unmodified)
AF := OF := PF := SF := 0;
```

## Intel C/C++ compilador intrínseco

```c
PTEST int _mm_testz_si128 (__m128i s1, __m128i s2);
PTEST int _mm_testc_si128 (__m128i s1, __m128i s2);
PTEST int _mm_testnzc_si128 (__m128i s1, __m128i s2);
VPTEST int _mm256_testz_si256 (__m256i s1, __m256i s2);
VPTEST int _mm256_testc_si256 (__m256i s1, __m256i s2);
VPTEST int _mm256_testnzc_si256 (__m256i s1, __m256i s2);
VPTEST int _mm_testz_si128 (__m128i s1, __m128i s2);
VPTEST int _mm_testc_si128 (__m128i s1, __m128i s2);
VPTEST int _mm_testnzc_si128 (__m128i s1, __m128i s2);
```

## Banderas afectadas

Las banderas OF, AF, PF, SF se limpian y las banderas ZF, CF se establecen según la operación.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además:

```text
#UD                     If VEX.vvvv  1111B.
```
