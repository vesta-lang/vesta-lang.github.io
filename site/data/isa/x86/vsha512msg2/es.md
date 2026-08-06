---
summary: Realizar una cálculo final para los siguientes cuatro Qwords de Mensaje SHA512
---

## Descripción

La instrucción VSHA512MSG2 es una de las dos instrucciones de programación del mensaje SHA512. La instrucción realiza el cálculo final para los siguientes cuatro qwords de mensaje SHA512.

See https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf for more information on the SHA512 standard.

## Operación

```text
define ROR64(qword, n):

    count := n % 64
    dest := (qword >> count) | (qword << (64-count))
    return dest

define SHR64(qword, n):
    return qword >> n

define s1(qword):
    return ROR64(qword,19) ^ ROR64(qword, 61) ^ SHR64(qword, 6)

VSHA512MSG2 SRCDEST, SRC1
W[14] := SRC1.qword[2]
W[15] := SRC1.qword[3]
W[16] := SRCDEST.qword[0] + s1(W[14])
W[17] := SRCDEST.qword[1] + s1(W[15])
W[18] := SRCDEST.qword[2] + s1(W[16])
W[19] := SRCDEST.qword[3] + s1(W[17])

SRCDEST.qword[3] := W[19]
SRCDEST.qword[2] := W[18]
SRCDEST.qword[1] := W[17]
SRCDEST.qword[0] := W[16]
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VSHA512MSG2 __m256i _mm256_sha512msg2_epi64 (__m256i __A, __m256i __B);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-23, "Tipo 6 Condiciones de Excepción de Clase".
