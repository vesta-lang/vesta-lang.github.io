---
summary: Round Packed Float64 Valores para Incluir un número dado de bits de fracción
---

## Descripción

Round los valores en coma flotante de precisión doble en el operando de origen por el modo de redondeo especificado en el operando inmediato (ver Figura 5-29) y coloca el resultado en el operando de destino.

El operando de destino (el primer operando) es un ZMM/YMM/XMM registro actualizado condicionalmente según la máscara de escritura. El operando de origen (el segundo operando) puede ser un ZMM/YMM/XMM registrado, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits.

El proceso de redondeo redondea la entrada a un valor integral, además de los bits número de fracción especificados por imm8[7:4] (para ser incluido en el resultado) y devuelve el resultado como un valor en coma flotante de precisión doble.

Debe notarse que no se induce el desbordamiento mientras se ejecuta esta instrucción (aunque la fuente es escalada por el valor imm8[7:4]).

El operando inmediato también especifica campos de control para la operación de redondeo, tres campos de bits se definen y se muestran en la figura de "Inmediato Control Descripción" a continuación. Bit 3 del byte inmediato controla el comportamiento del procesador para una excepción de precisión, bit 2 selecciona la fuente del control del modo de redondeo. Bits 1:0 especificar un valor de redondeo no pegajoso (mesa de control inmediata a continuación lista los valores codificados para el campo de redondeo).

La Precisión coma flotante Excepción se señaliza según el operando inmediato. Si cualquier operando de origen es un SNaN entonces será convertido a un QNaN. Si DAZ se establece a `1 entonces los denormales se convertirán a cero antes de redondear.

El signo del resultado de esta instrucción se conserva, incluyendo el signo de cero.

La fórmula de la operación en cada elemento de datos para VRNDSCALEPD es ROUND(x) = 2-M*Round to INT(x*2M, round ctrl),

round_ctrl = imm[3:0];

M=imm[7:4]; El funcionamiento de x*2M se calcula como si el rango de exponentes fuera ilimitado (es decir, no se haya producido ningún desbordamiento).

VRNDSCALEPD es una forma más general de la instrucción VEX codificada por VROUNDPD. En VROUNDPD, la fórmula de la operación en cada elemento es

ROUND(x) = Round_to_INT(x, round_ctrl), round_ctrl = imm[3:0];

Nota: EVEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

```text
                           7  6                       5          4              3                 2   1                         0
```

imm8

```text
                              Fixed point length                                SPE               RS  Round Control Override
```

```text
      Imm8[7:4] : Number of fixed points to preserve     Suppress Precision Exception: Imm8[3]    Round Select: Imm8[2]         Imm8[1:0] = 00b : Round nearest even
                                                         Imm8[3] = 0b : Use MXCSR exception mask  Imm8[2] = 0b : Use Imm8[1:0]  Imm8[1:0] = 01b : Round down
                                                         Imm8[3] = 1b : Suppress                  Imm8[2] = 1b : Use MXCSR      Imm8[1:0] = 10b : Round up
```

Imm8[1:0] = 11b : Truncate

Figura 5-29. Controles Imm8 para VRNDSCALEPD/SD/PS/SS

En el cuadro 5-29 figura el manejo de los valores de entrada especiales.

Src1=+/-inf Tabla 5-29. VRNDSCALEPD/SD/PS/SS Casos especiales Src1=+/-NAN Valor devuelto Src1=+/-0 Src1 Src1 convertido a QNAN Src1

## Operación

```text
RoundToIntegerDP(SRC[63:0], imm8[7:0]) {

if (imm8[2] = 1)

      rounding_direction := MXCSR:RC                     ; get round control from MXCSR

else

      rounding_direction := imm8[1:0]                    ; get round control from imm8[1:0]

FI

M := imm8[7:4]                ; get the scaling factor

case (rounding_direction)
00: TMP[63:0] := round_to_nearest_even_integer(2M*SRC[63:0])
01: TMP[63:0] := round_to_equal_or_smaller_integer(2M*SRC[63:0])
10: TMP[63:0] := round_to_equal_or_larger_integer(2M*SRC[63:0])
11: TMP[63:0] := round_to_nearest_smallest_magnitude_integer(2M*SRC[63:0])
ESAC

Dest[63:0] := 2-M* TMP[63:0]                          ; scale down back to 2-M

if (imm8[3] = 0) Then ; check SPE

      if (SRC[63:0] != Dest[63:0]) Then ; check precision lost

           set_precision()                            ; set #PE

      FI;

FI;


    return(Dest[63:0])
}

VRNDSCALEPD (EVEX encoded versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF *src is a memory operand*

    THEN TMP_SRC := BROADCAST64(SRC, VL, k1)
    ELSE TMP_SRC := SRC
FI;

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := RoundToIntegerDP((TMP_SRC[i+63:i], imm8[7:0])

ELSE

     IF *merging-masking*       ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE               ; zeroing-masking

             DEST[i+63:i] := 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VRNDSCALEPD __m512d _mm512_roundscale_pd( __m512d a, int imm);
VRNDSCALEPD __m512d _mm512_roundscale_round_pd( __m512d a, int imm, int sae);
VRNDSCALEPD __m512d _mm512_mask_roundscale_pd(__m512d s, __mmask8 k, __m512d a, int imm);
VRNDSCALEPD __m512d _mm512_mask_roundscale_round_pd(__m512d s, __mmask8 k, __m512d a, int imm, int sae);
VRNDSCALEPD __m512d _mm512_maskz_roundscale_pd( __mmask8 k, __m512d a, int imm);
VRNDSCALEPD __m512d _mm512_maskz_roundscale_round_pd( __mmask8 k, __m512d a, int imm, int sae);
VRNDSCALEPD __m256d _mm256_roundscale_pd( __m256d a, int imm);
VRNDSCALEPD __m256d _mm256_mask_roundscale_pd(__m256d s, __mmask8 k, __m256d a, int imm);
VRNDSCALEPD __m256d _mm256_maskz_roundscale_pd( __mmask8 k, __m256d a, int imm);
VRNDSCALEPD __m128d _mm_roundscale_pd( __m128d a, int imm);
VRNDSCALEPD __m128d _mm_mask_roundscale_pd(__m128d s, __mmask8 k, __m128d a, int imm);
VRNDSCALEPD __m128d _mm_maskz_roundscale_pd( __mmask8 k, __m128d a, int imm);
```

## SIMD coma flotante Excepciones

Inválido, Precisión. Si SPE está habilitado, excepción de precisión no se reporta (sin importar la máscara de excepción MXCSR).

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".
