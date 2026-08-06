---
summary: AND lógico y juego de máscara
---

## Descripción

Realiza una operación lógica poco a poco AND en el primer operando de origen (el segundo operando) y segundo operando de origen (el tercer operando) y almacena el resultado en el operando de destino (el primer operando) bajo la máscara de escritura. Cada bit del resultado se establece a 1 si el bitwise AND de los elementos correspondientes del primer y segundo src operandos no es cero; de lo contrario se establece a 0.

VPTESTMD/VPTESTMQ: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32/64-bit. El operando de destino es un registro de máscaras actualizado bajo la máscara de escritura.

VPTESTMB/VPTESTMW: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM o un 512/256/128-bit ubicación de memoria. El operando de destino es un registro de máscaras actualizado bajo la máscara de escritura.

## Operación

```text
VPTESTMB (EVEX encoded versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[j] := (SRC1[i+7:i] BITWISE AND SRC2[i+7:i] != 0)? 1 : 0;

     ELSE DEST[j] = 0                       ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0

VPTESTMW (EVEX encoded versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[j] := (SRC1[i+15:i] BITWISE AND SRC2[i+15:i] != 0)? 1 : 0;

     ELSE DEST[j] = 0                       ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0


VPTESTMD (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[j] := (SRC1[i+31:i] BITWISE AND SRC2[31:0] != 0)? 1 : 0;

                  ELSE DEST[j] := (SRC1[i+31:i] BITWISE AND SRC2[i+31:i] != 0)? 1 : 0;

             FI;

     ELSE DEST[j] := 0                    ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0

VPTESTMQ (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[j] := (SRC1[i+63:i] BITWISE AND SRC2[63:0] != 0)? 1 : 0;

                  ELSE DEST[j] := (SRC1[i+63:i] BITWISE AND SRC2[i+63:i] != 0)? 1 : 0;

             FI;

     ELSE DEST[j] := 0                    ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPTESTMB __mmask64 _mm512_test_epi8_mask( __m512i a, __m512i b);
VPTESTMB __mmask64 _mm512_mask_test_epi8_mask(__mmask64, __m512i a, __m512i b);
VPTESTMW __mmask32 _mm512_test_epi16_mask( __m512i a, __m512i b);
VPTESTMW __mmask32 _mm512_mask_test_epi16_mask(__mmask32, __m512i a, __m512i b);
VPTESTMD __mmask16 _mm512_test_epi32_mask( __m512i a, __m512i b);
VPTESTMD __mmask16 _mm512_mask_test_epi32_mask(__mmask16, __m512i a, __m512i b);
VPTESTMQ __mmask8 _mm512_test_epi64_mask(__m512i a, __m512i b);
VPTESTMQ __mmask8 _mm512_mask_test_epi64_mask(__mmask8, __m512i a, __m512i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

VPTESTMD/Q: Ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción." VPTESTMB/W: Ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."
