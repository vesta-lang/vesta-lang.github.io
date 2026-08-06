---
summary: Realizar dos rondas de operación SHA256
---

## Descripción

ElSHA256RNDS2instrucción realiza 2 rondas deSHA256operación utilizando una operación inicialSHA256estado (C,D,G,H) del primeroperando, una inicialSHA256estado (A,B,E,F) del segundooperando, y una suma pre-computada de los siguientes 2 dwords de mensajes redondos y las constantes redondas correspondientes de los implícitosoperando xmm0. Tenga en cuenta que sólo los dos dwords inferiores de XMM0 son utilizados por la instrucción.

El estado SHA256 actualizado (A,B,E,F) está escrito al primer operando, y el segundo operando se puede utilizar como el estado actualizado (C,D,G,H) en rondas posteriores.

## Operación

```text
SHA256RNDS2
A_0 := SRC2[127:96];
B_0 := SRC2[95:64];
C_0 := SRC1[127:96];
D_0 := SRC1[95:64];
E_0 := SRC2[63:32];
F_0 := SRC2[31:0];
G_0 := SRC1[63:32];
H_0 := SRC1[31:0];
WK0 := XMM0[31: 0];
WK1 := XMM0[63: 32];

FOR i = 0 to 1
    A_(i +1) := Ch (E_i, F_i, G_i) +1( E_i) +WKi+ H_i + Maj(A_i , B_i, C_i) +0( A_i);
    B_(i +1) := A_i;
    C_(i +1) := B_i ;
    D_(i +1) := C_i;
    E_(i +1) := Ch (E_i, F_i, G_i) +1( E_i) +WKi+ H_i + D_i;
    F_(i +1) := E_i ;
    G_(i +1) := F_i;
    H_(i +1) := G_i;

ENDFOR

DEST[127:96] := A_2;
DEST[95:64] := B_2;
DEST[63:32] := E_2;
DEST[31:0] := F_2;
```

## Intel C/C++ compilador intrínseco

```c
SHA256RNDS2 __m128i _mm_sha256rnds2_epu32(__m128i, __m128i, __m128i);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
