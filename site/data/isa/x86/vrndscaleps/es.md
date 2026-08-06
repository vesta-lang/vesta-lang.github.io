---
summary: Round Packed Float32 Valores para Incluir un número dado de bits de fracción
---

## Descripción

Round los valores en coma flotante de precisión simple en el operando de origen por el modo de redondeo especificado en el operando inmediato (ver Figura 5-29) y coloca el resultado en el operando de destino.

El operando de destino (el primer operando) es un registro ZMM actualizado condicionalmente según la máscara de escritura. El operando de origen (el segundo operando) puede ser un registro ZMM, una ubicación de memoria de 512 bits, o un vector de 512 bits transmitido desde una ubicación de memoria de 32 bits.

El proceso de redondeo redondea la entrada a un valor integral, además de los bits número de fracción especificados por imm8[7:4] (para ser incluido en el resultado) y devuelve el resultado como un valor en coma flotante de precisión simple.

Debe notarse que no se induce el desbordamiento mientras se ejecuta esta instrucción (aunque la fuente es escalada por el valor imm8[7:4]).

El operando inmediato también especifica campos de control para la operación de redondeo, tres campos de bits se definen y se muestran en la figura de "Inmediato Control Descripción" a continuación. Bit 3 del byte inmediato controla el comportamiento del procesador para una excepción de precisión, bit 2 selecciona la fuente del control del modo de redondeo. Bits 1:0 especificar un valor de redondeo no pegajoso (mesa de control inmediata a continuación lista los valores codificados para el campo de redondeo).

La Precisión coma flotante Excepción se señaliza según el operando inmediato. Si cualquier operando de origen es un SNaN entonces será convertido a un QNaN. Si DAZ se establece a `1 entonces los denormales se convertirán a cero antes de redondear.

El signo del resultado de esta instrucción se conserva, incluyendo el signo de cero.

La fórmula de la operación en cada elemento de datos para VRNDSCALEPS es ROUND(x) = 2-M*Round to INT(x*2M, round ctrl), round ctrl = imm[3:0]; M=imm[7:4];

El funcionamiento de x*2M se calcula como si el rango de exponentes fuera ilimitado (es decir, no se haya producido ningún desbordamiento). VRNDSCALEPS es una forma más general de la instrucción VEX codificada por VROUNDPS. En VROUNDPS, la fórmula de la operación en cada elemento es

ROUND(x) = Round_to_INT(x, round_ctrl), round_ctrl = imm[3:0];

Nota: EVEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD. En el cuadro 5-29 figura el manejo de los valores de entrada especiales.

## Operación

```text
RoundToIntegerSP(SRC[31:0], imm8[7:0]) {

   if (imm8[2] = 1)

         rounding_direction := MXCSR:RC       ; get round control from MXCSR

   else

         rounding_direction := imm8[1:0]      ; get round control from imm8[1:0]

   FI

   M := imm8[7:4]         ; get the scaling factor

   case (rounding_direction)
   00: TMP[31:0] := round_to_nearest_even_integer(2M*SRC[31:0])
   01: TMP[31:0] := round_to_equal_or_smaller_integer(2M*SRC[31:0])
   10: TMP[31:0] := round_to_equal_or_larger_integer(2M*SRC[31:0])
   11: TMP[31:0] := round_to_nearest_smallest_magnitude_integer(2M*SRC[31:0])
   ESAC;

   Dest[31:0] := 2-M* TMP[31:0]           ; scale down back to 2-M

   if (imm8[3] = 0) Then         ; check SPE

         if (SRC[31:0] != Dest[31:0]) Then ; check precision lost

                set_precision()    ; set #PE

         FI;

   FI;

   return(Dest[31:0])

}

VRNDSCALEPS (EVEX encoded versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF *src is a memory operand*

    THEN TMP_SRC := BROADCAST32(SRC, VL, k1)
    ELSE TMP_SRC := SRC
FI;

FOR j := 0 TO KL-1

   i := j * 32

   IF k1[j] OR *no writemask*

         THEN DEST[i+31:i] := RoundToIntegerSP(TMP_SRC[i+31:i]), imm8[7:0])

   ELSE

         IF *merging-masking*                 ; merging-masking

                THEN *DEST[i+31:i] remains unchanged*

                ELSE                          ; zeroing-masking

                DEST[i+31:i] := 0

         FI;

   FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VRNDSCALEPS __m512 _mm512_roundscale_ps( __m512 a, int imm);
VRNDSCALEPS __m512 _mm512_roundscale_round_ps( __m512 a, int imm, int sae);
VRNDSCALEPS __m512 _mm512_mask_roundscale_ps(__m512 s, __mmask16 k, __m512 a, int imm);
VRNDSCALEPS __m512 _mm512_mask_roundscale_round_ps(__m512 s, __mmask16 k, __m512 a, int imm, int sae);
VRNDSCALEPS __m512 _mm512_maskz_roundscale_ps( __mmask16 k, __m512 a, int imm);
VRNDSCALEPS __m512 _mm512_maskz_roundscale_round_ps( __mmask16 k, __m512 a, int imm, int sae);
VRNDSCALEPS __m256 _mm256_roundscale_ps( __m256 a, int imm);
VRNDSCALEPS __m256 _mm256_mask_roundscale_ps(__m256 s, __mmask8 k, __m256 a, int imm);
VRNDSCALEPS __m256 _mm256_maskz_roundscale_ps( __mmask8 k, __m256 a, int imm);
VRNDSCALEPS __m128 _mm_roundscale_ps( __m256 a, int imm);
VRNDSCALEPS __m128 _mm_mask_roundscale_ps(__m128 s, __mmask8 k, __m128 a, int imm);
VRNDSCALEPS __m128 _mm_maskz_roundscale_ps( __mmask8 k, __m128 a, int imm);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

Si SPE está habilitado, excepción de precisión no se reporta (sin importar la máscara de excepción MXCSR).

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".
