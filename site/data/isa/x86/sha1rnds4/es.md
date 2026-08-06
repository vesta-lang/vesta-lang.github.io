---
summary: Realizar cuatro rondas de operación SHA1
---

## Descripción

La instrucción SHA1RNDS4 realiza cuatro rondas de operación SHA1 utilizando un estado SHA1 inicial (A,B,C,D) del primer operado (que es un operado fuente y el operado de destino) y una cierta suma pre-computada de los próximos 4 dwords de mensajes redondos, y la variable estatal E del segundo operand (un operado fuente). El estado SHA1 actualizado (A,B,C,D) después de cuatro rondas de procesamiento se almacena en el operando de destino.

## Operación

```text
SHA1RNDS4
The function f() and Constant K are dependent on the value of the immediate.

IF ( imm8[1:0] = 0 )
    THEN f() := f0(), K := K0;

ELSE IF ( imm8[1:0] = 1 )
    THEN f() := f1(), K := K1;

ELSE IF ( imm8[1:0] = 2 )
    THEN f() := f2(), K := K2;

ELSE IF ( imm8[1:0] = 3 )
    THEN f() := f3(), K := K3;

FI;

A := SRC1[127:96];
B := SRC1[95:64];
C := SRC1[63:32];
D := SRC1[31:0];
W0E := SRC2[127:96];
W1 := SRC2[95:64];
W2 := SRC2[63:32];
W3 := SRC2[31:0];

Round i = 0 operation:
A_1 := f (B, C, D) + (A ROL 5) +W0E +K;
B_1 := A;
C_1 := B ROL 30;
D_1 := C;
E_1 := D;

FOR i = 1 to 3
    A_(i +1) := f (B_i, C_i, D_i) + (A_i ROL 5) +Wi+ E_i +K;


    B_(i +1) := A_i;
    C_(i +1) := B_i ROL 30;
    D_(i +1) := C_i;
    E_(i +1) := D_i;
ENDFOR

DEST[127:96] := A_4;
DEST[95:64] := B_4;
DEST[63:32] := C_4;
DEST[31:0] := D_4;
```

## Intel C/C++ compilador intrínseco

```c
SHA1RNDS4 __m128i _mm_sha1rnds4_epu32(__m128i, __m128i, const int);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
