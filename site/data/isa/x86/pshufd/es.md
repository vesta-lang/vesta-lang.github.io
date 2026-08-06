---
summary: Shuffle dobles empaquetados
---

## Descripción

Copias de palabras dobles deoperando de origen(segundooperando) y los inserta enel operando de destino(primero)operando) en los lugares seleccionados con el pedidooperando(terceroperando). La Figura 4-16 muestra el funcionamiento de la instrucción VPSHUFD de 256 bits y la codificación del orden operando. Cada campo de 2 bits en el orden operando selecciona el contenido de una ubicación de doble palabra dentro de un carril de 128 bits y copia al elemento objetivo en el operando de destino. Por ejemplo, bits 0 y 1 del orden operando apunta el primer elemento de doble palabra en el carril bajo y alto de 128 bits del operando de destino para 256-bit VPSHUFD. El valor codificado de los bits 1:0 del orden operando (ver el campo de codificación en la Figura 4-16) determina qué elemento de doble palabra (desde el carril de 128 bits) del operando de origen será copiado a la palabra doble 0 del operando de destino.

Para la operación de 128 bits, sólo el carril bajo de 128 bits está operativo. El operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. La orden operando es una inmediata de 8 bits. Tenga en cuenta que esta instrucción permite copiar una palabra doble en el operando de origen a más de una ubicación de doble palabra en el operando de destino.

SRC X7                              X6        X5     X4  X3         X2  X1                 X0

DEST Y7                             Y6        Y5     Y4  Y3         Y2  Y1                 Y0

Codificación 00B - X4 ORDER Codificación 00B - X0 de Campos en 01B - X5 de Campos en 01B - X1

```text
                                    10B - X6                        ORDER 10B - X2
```

ORDER                            11B - X7         7 65 4 3 21 0  Operand 11B - X3 Operand

Figure 4-16. 256-bit VPSHUFD Instruction Operation

El operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. La orden operando es una inmediata de 8 bits. Tenga en cuenta que esta instrucción permite copiar una palabra doble en el operando de origen a más de una ubicación de doble palabra en el operando de destino.

En modo de 64 bits y no codificado en VEX/EVEX, utilizando REX.R permite esta instrucción para acceder a XMM8-XMM15.

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: El operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. Bits (MAXVL-1:128) del registro ZMM correspondiente se ponen a cero.

VEX.256 versión codificada: El operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM. Bits (MAXVL-1:256) del registro ZMM correspondiente se ponen a cero. Bits (255- 1:128) del destino almacena los resultados de los 16 bytes superiores del operando de origen utilizando el byte inmediato como el orden operando.

EVEX versión codificada: El operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro ZMM/YMM/XMM actualizado según la máscara de escritura.

Cada carril de 128 bits del destino almacena los resultados de la carril respectiva del operando de origen utilizando el byte inmediato como el orden operando.

Nota: EVEX.vvvv y VEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
PSHUFD (128-bit Legacy SSE Version)
DEST[31:0] := (SRC >> (ORDER[1:0] * 32))[31:0];
DEST[63:32] := (SRC >> (ORDER[3:2] * 32))[31:0];
DEST[95:64] := (SRC >> (ORDER[5:4] * 32))[31:0];
DEST[127:96] := (SRC >> (ORDER[7:6] * 32))[31:0];
DEST[MAXVL-1:128] (Unmodified)

VPSHUFD (VEX.128 Encoded Version)
DEST[31:0] := (SRC >> (ORDER[1:0] * 32))[31:0];
DEST[63:32] := (SRC >> (ORDER[3:2] * 32))[31:0];
DEST[95:64] := (SRC >> (ORDER[5:4] * 32))[31:0];
DEST[127:96] := (SRC >> (ORDER[7:6] * 32))[31:0];
DEST[MAXVL-1:128] := 0


VPSHUFD (VEX.256 Encoded Version)
DEST[31:0] := (SRC[127:0] >> (ORDER[1:0] * 32))[31:0];
DEST[63:32] := (SRC[127:0] >> (ORDER[3:2] * 32))[31:0];
DEST[95:64] := (SRC[127:0] >> (ORDER[5:4] * 32))[31:0];
DEST[127:96] := (SRC[127:0] >> (ORDER[7:6] * 32))[31:0];
DEST[159:128] := (SRC[255:128] >> (ORDER[1:0] * 32))[31:0];
DEST[191:160] := (SRC[255:128] >> (ORDER[3:2] * 32))[31:0];
DEST[223:192] := (SRC[255:128] >> (ORDER[5:4] * 32))[31:0];
DEST[255:224] := (SRC[255:128] >> (ORDER[7:6] * 32))[31:0];
DEST[MAXVL-1:256] := 0

VPSHUFD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF (EVEX.b = 1) AND (SRC *is memory*)

          THEN TMP_SRC[i+31:i] := SRC[31:0]

          ELSE TMP_SRC[i+31:i] := SRC[i+31:i]

     FI;

ENDFOR;

IF VL >= 128

     TMP_DEST[31:0] := (TMP_SRC[127:0] >> (ORDER[1:0] * 32))[31:0];

     TMP_DEST[63:32] := (TMP_SRC[127:0] >> (ORDER[3:2] * 32))[31:0];

     TMP_DEST[95:64] := (TMP_SRC[127:0] >> (ORDER[5:4] * 32))[31:0];

     TMP_DEST[127:96] := (TMP_SRC[127:0] >> (ORDER[7:6] * 32))[31:0];

FI;

IF VL >= 256

     TMP_DEST[159:128] := (TMP_SRC[255:128] >> (ORDER[1:0] * 32))[31:0];

     TMP_DEST[191:160] := (TMP_SRC[255:128] >> (ORDER[3:2] * 32))[31:0];

     TMP_DEST[223:192] := (TMP_SRC[255:128] >> (ORDER[5:4] * 32))[31:0];

     TMP_DEST[255:224] := (TMP_SRC[255:128] >> (ORDER[7:6] * 32))[31:0];

FI;

IF VL >= 512

     TMP_DEST[287:256] := (TMP_SRC[383:256] >> (ORDER[1:0] * 32))[31:0];

     TMP_DEST[319:288] := (TMP_SRC[383:256] >> (ORDER[3:2] * 32))[31:0];

     TMP_DEST[351:320] := (TMP_SRC[383:256] >> (ORDER[5:4] * 32))[31:0];

     TMP_DEST[383:352] := (TMP_SRC[383:256] >> (ORDER[7:6] * 32))[31:0];

     TMP_DEST[415:384] := (TMP_SRC[511:384] >> (ORDER[1:0] * 32))[31:0];

     TMP_DEST[447:416] := (TMP_SRC[511:384] >> (ORDER[3:2] * 32))[31:0];

     TMP_DEST[479:448] := (TMP_SRC[511:384] >> (ORDER[5:4] * 32))[31:0];

     TMP_DEST[511:480] := (TMP_SRC[511:384] >> (ORDER[7:6] * 32))[31:0];

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR


DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPSHUFD __m512i _mm512_shuffle_epi32(__m512i a, int n );
VPSHUFD __m512i _mm512_mask_shuffle_epi32(__m512i s, __mmask16 k, __m512i a, int n );
VPSHUFD __m512i _mm512_maskz_shuffle_epi32( __mmask16 k, __m512i a, int n );
VPSHUFD __m256i _mm256_mask_shuffle_epi32(__m256i s, __mmask8 k, __m256i a, int n );
VPSHUFD __m256i _mm256_maskz_shuffle_epi32( __mmask8 k, __m256i a, int n );
VPSHUFD __m128i _mm_mask_shuffle_epi32(__m128i s, __mmask8 k, __m128i a, int n );
VPSHUFD __m128i _mm_maskz_shuffle_epi32( __mmask8 k, __m128i a, int n );
(V)PSHUFD __m128i _mm_shuffle_epi32(__m128i a, int n) VPSHUFD __m256i _mm256_shuffle_epi32(__m256i a, const int n);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."

Additionally:

```text
#UD                    If VEX.vvvv  1111B or EVEX.vvvv  1111B.
```
