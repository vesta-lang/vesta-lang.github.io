---
summary: Carga Integer y Radiodifusión
---

## Descripción

Cargar datos enteros del operando de origen (el segundo operando) y transmitir a todos los elementos del operando de destino (el primer operando).

VEX256 codificado VPBROADCASTB/W/D/Q: El operando de origen es 8-bit, 16-bit, 32-bit, 64-bit ubicación de memoria o los datos bajos de 8-bit, 16-bit 32-bit, 64-bit en un registro XMM. El operando de destino es un registro YMM. VPBROAD- CASTI128 soporte el operando de origen de 128-bit ubicación de memoria. Registro código fuente para VPBROADCAS- TI128 está reservado y #UD. Bits (MAXVL-1:256) del registro de destino se ponen a cero.

EVEX-encoded VPBROADCASTD/Q: El operando de origen es una ubicación de memoria de 32 bits de 64 bits o los datos bajos de 32 bits de 64 bits en un registro XMM. El operando de destino es un registro ZMM/YMM/XMM actualizado según la máscara de escritura k1.

VPBROADCASTI32X4 y VPBROADCASTI64X4: El operando de destino es un registro ZMM y actualizado según la máscara de escritura k1. El operando de origen es 128-bit o 256-bit ubicación de memoria. Se reservan códigos fuente para VBROADCASTI32X4 y VBROADCASTI64X4 y #UD.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

Si VPBROADCASTI128 está codificado con VEX.L= 0, un intento de ejecutar la instrucción codificada con VEX.L= 0 causará una excepción #UD.

```text
                                                             m32      X0
```

DEST X0                                  X0  X0  X0  X0  X0       X0  X0

Figura 5-16. VPBROADCASTD Operación (VEX.256 versión codificada)

```text
                                                             m32      X0
```

DEST 0                                   0   0   0   X0  X0       X0  X0

Figura 5-17. VPBROADCASTD Operación (128-bit versión)

```text
                                                       m64      X0
```

DEST  X0                                     X0        X0       X0

Figura 5-18. VPBROADCASTQ Operación (256-bit versión)

```text
                                                 m128       X0
```

DEST                                     X0                 X0

Figure 5-19. VBROADCASTI128 Operation (256-bit version)

```text
                                                 m256       X0
```

DEST                                     X0                 X0

Figure 5-20. VBROADCASTI256 Operation (512-bit version)

## Operación

```text
VPBROADCASTB (EVEX encoded versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SRC[7:0]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+7:i] remains unchanged*

                 ELSE                       ; zeroing-masking

                    DEST[i+7:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPBROADCASTW (EVEX encoded versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SRC[15:0]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE                       ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPBROADCASTD (128 bit version)
temp := SRC[31:0]
DEST[31:0] := temp
DEST[63:32] := temp
DEST[95:64] := temp
DEST[127:96] := temp
DEST[MAXVL-1:128] := 0

VPBROADCASTD (VEX.256 encoded version)
temp := SRC[31:0]
DEST[31:0] := temp
DEST[63:32] := temp
DEST[95:64] := temp
DEST[127:96] := temp
DEST[159:128] := temp
DEST[191:160] := temp
DEST[223:192] := temp
DEST[255:224] := temp
DEST[MAXVL-1:256] := 0


VPBROADCASTD (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[31:0]

     ELSE

             IF *merging-masking*         ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                     ; zeroing-masking

                     DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPBROADCASTQ (VEX.256 encoded version)
temp := SRC[63:0]
DEST[63:0] := temp
DEST[127:64] := temp
DEST[191:128] := temp
DEST[255:192] := temp
DEST[MAXVL-1:256] := 0

VPBROADCASTQ (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[63:0]

     ELSE

             IF *merging-masking*         ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                     ; zeroing-masking

                     DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VBROADCASTI32x2 (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

n := (j mod 2) * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[n+31:n]

     ELSE

             IF *merging-masking*         ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                     ; zeroing-masking

                     DEST[i+31:i] := 0

             FI

FI;

ENDFOR


DEST[MAXVL-1:VL] := 0

VBROADCASTI128 (VEX.256 encoded version)
temp := SRC[127:0]
DEST[127:0] := temp
DEST[255:128] := temp
DEST[MAXVL-1:256] := 0

VBROADCASTI32X4 (EVEX encoded versions)

(KL, VL) = (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j* 32

n := (j modulo 4) * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[n+31:n]

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                    ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VBROADCASTI64X2 (EVEX encoded versions)

(KL, VL) = (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 64

n := (j modulo 2) * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[n+63:n]

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                    ; zeroing-masking

                    DEST[i+63:i] = 0

             FI

FI;

ENDFOR;

VBROADCASTI32X8 (EVEX.U1.512 encoded version)

FOR j := 0 TO 15

i := j * 32

n := (j modulo 8) * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[n+31:n]

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                    ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;


ENDFOR
DEST[MAXVL-1:VL] := 0

VBROADCASTI64X4 (EVEX.512 encoded version)

FOR j := 0 TO 7

i := j * 64

n := (j modulo 4) * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[n+63:n]

     ELSE

             IF *merging-masking*        ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                    ; zeroing-masking

                 DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPBROADCASTB __m512i _mm512_broadcastb_epi8( __m128i a);
VPBROADCASTB __m512i _mm512_mask_broadcastb_epi8(__m512i s, __mmask64 k, __m128i a);
VPBROADCASTB __m512i _mm512_maskz_broadcastb_epi8( __mmask64 k, __m128i a);
VPBROADCASTB __m256i _mm256_broadcastb_epi8(__m128i a);
VPBROADCASTB __m256i _mm256_mask_broadcastb_epi8(__m256i s, __mmask32 k, __m128i a);
VPBROADCASTB __m256i _mm256_maskz_broadcastb_epi8( __mmask32 k, __m128i a);
VPBROADCASTB __m128i _mm_mask_broadcastb_epi8(__m128i s, __mmask16 k, __m128i a);
VPBROADCASTB __m128i _mm_maskz_broadcastb_epi8( __mmask16 k, __m128i a);
VPBROADCASTB __m128i _mm_broadcastb_epi8(__m128i a);
VPBROADCASTD __m512i _mm512_broadcastd_epi32( __m128i a);
VPBROADCASTD __m512i _mm512_mask_broadcastd_epi32(__m512i s, __mmask16 k, __m128i a);
VPBROADCASTD __m512i _mm512_maskz_broadcastd_epi32( __mmask16 k, __m128i a);
VPBROADCASTD __m256i _mm256_broadcastd_epi32( __m128i a);
VPBROADCASTD __m256i _mm256_mask_broadcastd_epi32(__m256i s, __mmask8 k, __m128i a);
VPBROADCASTD __m256i _mm256_maskz_broadcastd_epi32( __mmask8 k, __m128i a);
VPBROADCASTD __m128i _mm_broadcastd_epi32(__m128i a);
VPBROADCASTD __m128i _mm_mask_broadcastd_epi32(__m128i s, __mmask8 k, __m128i a);
VPBROADCASTD __m128i _mm_maskz_broadcastd_epi32( __mmask8 k, __m128i a);
VPBROADCASTQ __m512i _mm512_broadcastq_epi64( __m128i a);
VPBROADCASTQ __m512i _mm512_mask_broadcastq_epi64(__m512i s, __mmask8 k, __m128i a);
VPBROADCASTQ __m512i _mm512_maskz_broadcastq_epi64( __mmask8 k, __m128i a);
VPBROADCASTQ __m256i _mm256_broadcastq_epi64(__m128i a);
VPBROADCASTQ __m256i _mm256_mask_broadcastq_epi64(__m256i s, __mmask8 k, __m128i a);
VPBROADCASTQ __m256i _mm256_maskz_broadcastq_epi64( __mmask8 k, __m128i a);
VPBROADCASTQ __m128i _mm_broadcastq_epi64(__m128i a);
VPBROADCASTQ __m128i _mm_mask_broadcastq_epi64(__m128i s, __mmask8 k, __m128i a);
VPBROADCASTQ __m128i _mm_maskz_broadcastq_epi64( __mmask8 k, __m128i a);
VPBROADCASTW __m512i _mm512_broadcastw_epi16(__m128i a);
VPBROADCASTW __m512i _mm512_mask_broadcastw_epi16(__m512i s, __mmask32 k, __m128i a);
VPBROADCASTW __m512i _mm512_maskz_broadcastw_epi16( __mmask32 k, __m128i a);
VPBROADCASTW __m256i _mm256_broadcastw_epi16(__m128i a);
VPBROADCASTW __m256i _mm256_mask_broadcastw_epi16(__m256i s, __mmask16 k, __m128i a);
VPBROADCASTW __m256i _mm256_maskz_broadcastw_epi16( __mmask16 k, __m128i a);
VPBROADCASTW __m128i _mm_broadcastw_epi16(__m128i a);
VPBROADCASTW __m128i _mm_mask_broadcastw_epi16(__m128i s, __mmask8 k, __m128i a);
VPBROADCASTW __m128i _mm_maskz_broadcastw_epi16( __mmask8 k, __m128i a);
VBROADCASTI32x2 __m512i _mm512_broadcast_i32x2( __m128i a);
VBROADCASTI32x2 __m512i _mm512_mask_broadcast_i32x2(__m512i s, __mmask16 k, __m128i a);
VBROADCASTI32x2 __m512i _mm512_maskz_broadcast_i32x2( __mmask16 k, __m128i a);
VBROADCASTI32x2 __m256i _mm256_broadcast_i32x2( __m128i a);
VBROADCASTI32x2 __m256i _mm256_mask_broadcast_i32x2(__m256i s, __mmask8 k, __m128i a);
VBROADCASTI32x2 __m256i _mm256_maskz_broadcast_i32x2( __mmask8 k, __m128i a);
VBROADCASTI32x2 __m128i _mm_broadcast_i32x2(__m128i a);
VBROADCASTI32x2 __m128i _mm_mask_broadcast_i32x2(__m128i s, __mmask8 k, __m128i a);
VBROADCASTI32x2 __m128i _mm_maskz_broadcast_i32x2( __mmask8 k, __m128i a);
VBROADCASTI32x4 __m512i _mm512_broadcast_i32x4( __m128i a);
VBROADCASTI32x4 __m512i _mm512_mask_broadcast_i32x4(__m512i s, __mmask16 k, __m128i a);
VBROADCASTI32x4 __m512i _mm512_maskz_broadcast_i32x4( __mmask16 k, __m128i a);
VBROADCASTI32x4 __m256i _mm256_broadcast_i32x4( __m128i a);
VBROADCASTI32x4 __m256i _mm256_mask_broadcast_i32x4(__m256i s, __mmask8 k, __m128i a);
VBROADCASTI32x4 __m256i _mm256_maskz_broadcast_i32x4( __mmask8 k, __m128i a);
VBROADCASTI32x8 __m512i _mm512_broadcast_i32x8( __m256i a);
VBROADCASTI32x8 __m512i _mm512_mask_broadcast_i32x8(__m512i s, __mmask16 k, __m256i a);
VBROADCASTI32x8 __m512i _mm512_maskz_broadcast_i32x8( __mmask16 k, __m256i a);
VBROADCASTI64x2 __m512i _mm512_broadcast_i64x2( __m128i a);
VBROADCASTI64x2 __m512i _mm512_mask_broadcast_i64x2(__m512i s, __mmask8 k, __m128i a);
VBROADCASTI64x2 __m512i _mm512_maskz_broadcast_i64x2( __mmask8 k, __m128i a);
VBROADCASTI64x2 __m256i _mm256_broadcast_i64x2( __m128i a);
VBROADCASTI64x2 __m256i _mm256_mask_broadcast_i64x2(__m256i s, __mmask8 k, __m128i a);
VBROADCASTI64x2 __m256i _mm256_maskz_broadcast_i64x2( __mmask8 k, __m128i a);
VBROADCASTI64x4 __m512i _mm512_broadcast_i64x4( __m256i a);
VBROADCASTI64x4 __m512i _mm512_mask_broadcast_i64x4(__m512i s, __mmask8 k, __m256i a);
VBROADCASTI64x4 __m512i _mm512_maskz_broadcast_i64x4( __mmask8 k, __m256i a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-23, "Tipo 6 Condiciones de Excepción".

Instrucciones codificadas por EVEX, sintaxis con reg/mem operando, ver Tabla 2-55, "Tipo E6 Condiciones de Excepción Clase".

Additionally:

```text
#UD               If VEX.L = 0 for VPBROADCASTQ, VPBROADCASTI128.
```

If EVEX.L'L = 0 for VBROADCASTI32X4/VBROADCASTI64X2.

If EVEX.L'L < 10b for VBROADCASTI32X8/VBROADCASTI64X4.
