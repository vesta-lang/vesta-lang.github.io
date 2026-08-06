---
summary: Realizar la transformación de AES InvMixColumn
---

## Descripción

Realizar la transformación InvMixColumns en el operando de origen y almacenar el resultado en el operando de destino. El operando de destino es un registro XMM. El operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits.

Nota: la instrucción AESIMC debe aplicarse a la AES ampliada claves (excepto para la primera y última ronda clave) con el fin de prepararlos para el descifrado utilizando el "Ciflo Inverso Equivalente" (definido en FIPS 197).

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
AESIMC
DEST[127:0] := InvMixColumns( SRC );
DEST[MAXVL-1:128] (Unmodified)

VAESIMC
DEST[127:0] := InvMixColumns( SRC );
DEST[MAXVL-1:128] := 0;
```

## Intel C/C++ compilador intrínseco

```c
(V)AESIMC __m128i _mm_aesimc (__m128i);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además:

```text
#UD               If VEX.vvvv  1111B.
```
