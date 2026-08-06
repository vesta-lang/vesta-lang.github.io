---
summary: Round escalar Float64 Valor para Incluir un número dado de errores de fracción
---

## Descripción

Rondas un valor en coma flotante de precisión doble en el cuadword bajo (ver Figura 5-29) elemento del segundo operando de origen (el tercer operando) por el modo de redondeo especificado en el operando inmediato y coloca el resultado en el elemento correspondiente del operando de destino (el primer operando) según la máscara de escritura. El elemento quadword en bits 127:64 del destino es copiado del primer operando de origen (el segundo operando).

El destino y el primer operandos de origen son los registros XMM, el segundo operando de origen puede ser un registro XMM o ubicación de memoria. Los bits MAXVL-1:128 del registro de destino se limpian.

El proceso de redondeo redondea la entrada a un valor integral, además de los bits número de fracción especificados por imm8[7:4] (para ser incluido en el resultado) y devuelve el resultado como un valor en coma flotante de precisión doble.

Debe notarse que no se induce el desbordamiento mientras se ejecuta esta instrucción (aunque la fuente es escalada por el valor imm8[7:4]).

El operando inmediato también especifica campos de control para la operación de redondeo, tres campos de bits se definen y se muestran en la figura de "Inmediato Control Descripción" a continuación. Bit 3 del byte inmediato controla el comportamiento del procesador para una excepción de precisión, bit 2 selecciona la fuente del control del modo de redondeo. Bits 1:0 especificar un valor de redondeo no pegajoso (mesa de control inmediata a continuación lista los valores codificados para el campo de redondeo).

La Precisión coma flotante Excepción se señaliza según el operando inmediato. Si cualquier operando de origen es un SNaN entonces será convertido a un QNaN. Si DAZ se establece a `1 entonces los denormales se convertirán a cero antes de redondear.

El signo del resultado de esta instrucción se conserva, incluyendo el signo de cero.

La fórmula de la operación para VRNDSCALESD es ROUND(x) = 2-M*Round to INT(x*2M, round ctrl), round ctrl = imm[3:0]; M=imm[7:4];

El funcionamiento de x*2M se calcula como si el rango de exponentes fuera ilimitado (es decir, no se haya producido ningún desbordamiento). VRNDSCALESD es una forma más general de la instrucción VEX codificada por VROUNDSD. En VROUNDSD, la fórmula de la operación es

ROUND(x) = Round_to_INT(x, round_ctrl), round_ctrl = imm[3:0];

EVEX versión codificada: El operando de origen es un registro XMM o una ubicación de memoria de 64 bits. El operando de destino es un registro XMM. En el cuadro 5-29 figura el manejo de los valores de entrada especiales.

## Operación

```text
RoundToIntegerDP(SRC[63:0], imm8[7:0]) {


     if (imm8[2] = 1)

           rounding_direction := MXCSR:RC   ; get round control from MXCSR

     else

           rounding_direction := imm8[1:0]  ; get round control from imm8[1:0]

     FI

     M := imm8[7:4]         ; get the scaling factor

     case (rounding_direction)
     00: TMP[63:0] := round_to_nearest_even_integer(2M*SRC[63:0])
     01: TMP[63:0] := round_to_equal_or_smaller_integer(2M*SRC[63:0])
     10: TMP[63:0] := round_to_equal_or_larger_integer(2M*SRC[63:0])
     11: TMP[63:0] := round_to_nearest_smallest_magnitude_integer(2M*SRC[63:0])
     ESAC

     Dest[63:0] := 2-M* TMP[63:0]           ; scale down back to 2-M

     if (imm8[3] = 0) Then ; check SPE

           if (SRC[63:0] != Dest[63:0]) Then ; check precision lost

                set_precision()             ; set #PE

           FI;

     FI;

     return(Dest[63:0])

}

VRNDSCALESD (EVEX encoded version)

IF k1[0] or *no writemask*

     THEN DEST[63:0] := RoundToIntegerDP(SRC2[63:0], Zero_upper_imm[7:0])

     ELSE

           IF *merging-masking*             ; merging-masking

                THEN *DEST[63:0] remains unchanged*

                ELSE                        ; zeroing-masking

                THEN DEST[63:0] := 0

           FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VRNDSCALESD __m128d _mm_roundscale_sd ( __m128d a, __m128d b, int imm);
VRNDSCALESD __m128d _mm_roundscale_round_sd ( __m128d a, __m128d b, int imm, int sae);
VRNDSCALESD __m128d _mm_mask_roundscale_sd (__m128d s, __mmask8 k, __m128d a, __m128d b, int imm);
VRNDSCALESD __m128d _mm_mask_roundscale_round_sd (__m128d s, __mmask8 k, __m128d a, __m128d b, int imm, int sae);
VRNDSCALESD __m128d _mm_maskz_roundscale_sd ( __mmask8 k, __m128d a, __m128d b, int imm);
VRNDSCALESD __m128d _mm_maskz_roundscale_round_sd ( __mmask8 k, __m128d a, __m128d b, int imm, int sae);
```

## SIMD coma flotante Excepciones

Inválido, Precisión. Si SPE está habilitado, excepción de precisión no se reporta (sin importar la máscara de excepción MXCSR).

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".
