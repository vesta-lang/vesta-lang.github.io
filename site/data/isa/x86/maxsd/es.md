---
summary: Regreso Máximo valores en coma flotante de precisión doble escalares
---

## Descripción

Compara el bajo valores en coma flotante de precisión doble en el primer operando de origen y el segundo operando de origen, y devuelve el valor máximo al bajo quadword del operando de destino. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 64 bits. La primera fuente y operandos de destino son registros XMM. Cuando el segundo operando de origen es un operando de memoria, sólo se accede a 64 bits.

Si los valores que se comparan son tanto 0.0s (de cualquier signo), el valor en el segundo operando de origen es devuelto. Si un valor en el segundo operando de origen es un SNaN, que SNaN es devuelto sin cambios al destino (es decir, una versión QNaN del SNaN no es devuelta).

Si sólo un valor es un NaN (SNaN o QNaN) para esta instrucción, el segundo operando de origen, ya sea un NaN o un valor en coma flotante válido, está escrito al resultado. Si en lugar de este comportamiento, se requiere que la NaN de operando de origen sea devuelta, la acción de MAXSD se puede emular utilizando una secuencia de instrucciones, como una comparación seguida por AND, ANDN y OR.

128-bit Legacy SSE versión: El destino y primer operando de origen son los mismos. Bits (MAXVL-1:64) del registro de destino correspondiente no se modifican.

VEX.128 y EVEX versión codificada: Los bits (127:64) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX versión codificada: El elemento de cuádpo bajo del operando de destino se actualiza según la máscara de escritura.

El software debe asegurar que VMAXSD esté codificado con VEX.L=0. Codificar VMAXSD con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
MAX(SRC1, SRC2)
{

    IF ((SRC1 = 0.0) and (SRC2 = 0.0)) THEN DEST := SRC2;
          ELSE IF (SRC1 = NaN) THEN DEST := SRC2; FI;
          ELSE IF (SRC2 = NaN) THEN DEST := SRC2; FI;
          ELSE IF (SRC1 > SRC2) THEN DEST := SRC1;
          ELSE DEST := SRC2;

    FI;
}

VMAXSD (EVEX Encoded Version)

IF k1[0] or *no writemask*

     THEN DEST[63:0] := MAX(SRC1[63:0], SRC2[63:0])

     ELSE

     IF *merging-masking*                  ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                            ; zeroing-masking

           DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

VMAXSD (VEX.128 Encoded Version)
DEST[63:0] := MAX(SRC1[63:0], SRC2[63:0])
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

MAXSD (128-bit Legacy SSE Version)
DEST[63:0] := MAX(DEST[63:0], SRC[63:0])
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VMAXSD __m128d _mm_max_round_sd( __m128d a, __m128d b, int);
VMAXSD __m128d _mm_mask_max_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, int);
VMAXSD __m128d _mm_maskz_max_round_sd( __mmask8 k, __m128d a, __m128d b, int);
MAXSD __m128d _mm_max_sd(__m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

Inválido (Incluyendo QNaN operando de origen), Denormal.

## Otras excepciones

Instrucción no-EVEX-encoded, ver Tabla 2-20, "Tipo 3 Clase Condiciones de Excepción." Instrucción codificada por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."
