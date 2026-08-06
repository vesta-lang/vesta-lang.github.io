---
summary: Realizar dos rondas de operación SM3
---

## Descripción

La instrucción VSM3RNDS2 realiza dos rondas de operación SM3 utilizando el estado SM3 inicial (C, D, G, H) de los primeros estados operando, un SM3 inicial (A, B, E, F) del segundo operando y unas palabras pre-computadas del tercer operando. El primer operando con el estado inicial SM3 de (C, D, G, H) asume la entrada de variables izquierda no rotas de estado anterior. El estado SM3 actualizado (A, B, E, F) está escrito al primer operando.

El imm8 debe contener el número incluso redondo para la primera de las dos rondas calculadas por esta instrucción. El cálculo enmascara el valor imm8 por AND'ing con 0x3E para que sólo los números redondos de 0 a 62 se utilizan para esta operación.

## Operación

```text
//see the VSM3MSG1 instruction for definition of ROL32()

define P0(dword):
    return dword ^ ROL32(dword, 9) ^ ROL32(dword, 17)

define FF(x,y,z, round):
    if round < 16:
          return (x ^ y ^ z)
    else:
          return (x & y) | (x & z) | (y & z)

define GG(x,y,z, round):
    if round < 16:
          return (x ^ y ^ z)
    else:
          return (x & y) | (~x & z)

VSM3RNDS2 SRCDEST, SRC1, SRC2, IMM8
A[0] := SRC1.dword[3]
B[0] := SRC1.dword[2]
C[0] := SRCDEST.dword[3]
D[0] := SRCDEST.dword[2]
E[0] := SRC1.dword[1]
F[0] := SRC1.dword[0]
G[0] := SRCDEST.dword[1]
H[0] := SRCDEST.dword[0]
W[0] := SRC2.dword[0]
W[1] := SRC2.dword[1]
W[4] := SRC2.dword[2]


W[5] := SRC2.dword[3]

C[0] := ROL32(C[0], 9)
D[0] := ROL32(D[0], 9)
G[0] := ROL32(G[0], 19)
H[0] := ROL32(H[0], 19)

ROUND := IMM8 & 0x3E // even numbers 0...62
IF ROUND < 16:

    CONST := 0x79cc4519
ELSE:

    CONST := 0x7a879d8a
CONST := ROL32(CONST,ROUND)

FOR i in 0..1:
    S1 := ROL32((ROL32(A[i], 12) + E[i] + CONST), 7)
    S2 := S1 ^ ROL32(A[i],12)
    T1 := FF(A[i], B[i], C[i], ROUND) + D[i] + S2 + (W[i]^W[i+4])
    T2 := GG(E[i], F[i], G[i], ROUND) + H[i] + S1 + W[i]
    D[i+1] := C[i]
    C[i+1] := ROL32(B[i],9)
    B[i+1] := A[i]
    A[i+1] := T1
    H[i+1] := G[i]
    G[i+1] := ROL32(F[i], 19)
    F[i+1] := E[i]
    E[i+1] := P0(T2)
    CONST := ROL32(CONST, 1)

SRCDEST.dword[3] := A[2]
SRCDEST.dword[2] := B[2]
SRCDEST.dword[1] := E[2]
SRCDEST.dword[0] := F[2]
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VSM3RNDS2 __m128i _mm_sm3rnds2_epi32 (__m128i __A, __m128i __B, __m128i __C, const int imm8);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
