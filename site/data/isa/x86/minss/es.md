---
summary: Retorno Mínimo valores en coma flotante de precisión simple escalares
---

## Descripción

Compara el bajo valores en coma flotante de precisión simple en el primer operando de origen y el segundo operando de origen y devuelve el valor mínimo a la palabra doble baja del operando de destino.

Si los valores que se comparan son tanto 0.0s (de cualquier signo), el valor en el segundo operando de origen es devuelto. Si un valor en el segundo operando es un SNaN, que SNaN es devuelto sin cambios al destino (es decir, una versión QNaN del SNaN no es devuelta).

Si sólo un valor es un NaN (SNaN o QNaN) para esta instrucción, el segundo operando de origen, ya sea un NaN o un valor en coma flotante válido, está escrito al resultado. Si en lugar de este comportamiento, se requiere que la NaN en operando de origen sea devuelta, la acción de MINSD se puede emular utilizando una secuencia de instrucciones, como una comparación seguida por AND, ANDN y OR.

El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 32 bits. La primera fuente y operandos de destino son registros XMM.

128-bit Legacy SSE versión: El destino y primer operando de origen son los mismos. Bits (MAXVL:32) del registro de destino correspondiente no se modifican.

VEX.128 y EVEX versión codificada: El primer operando de origen es un registro xmm codificado por (E)VEX.vvvv. Los bits (127:32) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX versión codificada: El elemento de palabra doble bajo del operando de destino se actualiza según la máscara de escritura.

El software debe asegurar que VMINSS esté codificado con VEX.L=0. Codificar VMINSS con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
MIN(SRC1, SRC2)
{

    IF ((SRC1 = 0.0) and (SRC2 = 0.0)) THEN DEST := SRC2;
          ELSE IF (SRC1 = NaN) THEN DEST := SRC2; FI;
          ELSE IF (SRC2 = NaN) THEN DEST := SRC2; FI;
          ELSE IF (SRC1 < SRC2) THEN DEST := SRC1;
          ELSE DEST := SRC2;

    FI;
}

MINSS (EVEX Encoded Version)

IF k1[0] or *no writemask*

     THEN DEST[31:0] := MIN(SRC1[31:0], SRC2[31:0])

     ELSE

     IF *merging-masking*                  ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                            ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0

VMINSS (VEX.128 Encoded Version)
DEST[31:0] := MIN(SRC1[31:0], SRC2[31:0])
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

MINSS (128-bit Legacy SSE Version)
DEST[31:0] := MIN(SRC1[31:0], SRC2[31:0])
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VMINSS __m128 _mm_min_round_ss( __m128 a, __m128 b, int);
VMINSS __m128 _mm_mask_min_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, int);
VMINSS __m128 _mm_maskz_min_round_ss( __mmask8 k, __m128 a, __m128 b, int);
MINSS __m128 _mm_min_ss(__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

Inválido (Incluyendo QNaN operando de origen), Denormal.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción Clase." Instruccion codificada por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
