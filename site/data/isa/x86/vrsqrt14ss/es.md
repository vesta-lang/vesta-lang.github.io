---
summary: Computación aproximada de la raíz cuadrada de escalar Float32 Valor
---

## Descripción

Computes of the approximate reciprocal of the square root of the scalar single precision floating-point value in the low doubleword element of the source operand (the second operand) and stores the result in the low doubleword element of the destination operand (the first operand) according to the writemask. El error relativo máximo para esta aproximación es inferior a 2-14. El operando de origen puede ser un registro XMM o una ubicación de memoria de 32 bits. El operando de destino es un registro XMM.

Los bits (127:32) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

La instrucción VRSQRT14SS no se ve afectada por los bits de control de redondeo en el registro MXCSR. Cuando un valor fuente es un 0.0, se devuelve un signo del valor fuente. Cuando el operando de origen es un , cero con el signo del valor fuente se devuelve. Un valor de fuente denormal se trata como cero sólo si el bit DAZ se establece en MXCSR. De lo contrario se trata correctamente y realiza la aproximación con la respuesta enmascarada especificada. Cuando un valor fuente es un valor negativo (excepto 0,0) una coma flotante indefinida es devuelto. Cuando un valor fuente es un SNaN o QNaN, el SNaN se convierte en un QNaN o la fuente QNaN es devuelta.

Las banderas de excepción MXCSR no se ven afectadas por esta instrucción y las excepciones coma flotante no se reportan.

En https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrcp28-vrsqrt28-vrsqrt28-vexp2.

## Operación

```text
VRSQRT14SS (EVEX version)

IF k1[0] or *no writemask*

     THEN DEST[31:0] := APPROXIMATE(1.0/ SQRT(SRC2[31:0]))

     ELSE

        IF *merging-masking*       ; merging-masking

             THEN *DEST[31:0] remains unchanged*

             ELSE                  ; zeroing-masking

             THEN DEST[31:0] := 0

        FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0


                      Table 5-35. VRSQRT14SS Special Cases

Input value   Result value     Comments
Any denormal
X = 2-2n      Normal           Cannot generate overflow
X<0           2n
X = -0
X = +0        QNaN_Indefinite  Including -INF
X = +INF
              -INF

              +INF

              +0
```

## Intel C/C++ compilador intrínseco

```c
VRSQRT14SS __m128 _mm_rsqrt14_ss( __m128 a, __m128 b);
VRSQRT14SS __m128 _mm_mask_rsqrt14_ss(__m128 s, __mmask8 k, __m128 a, __m128 b);
VRSQRT14SS __m128 _mm_maskz_rsqrt14_ss( __mmask8 k, __m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-53, "Tipo E5 Condiciones de Excepción Clase".
