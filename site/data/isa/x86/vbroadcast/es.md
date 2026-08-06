---
summary: Carga con datos coma flotante de radiodifusión
---

## Descripción

VBROADCASTSD/VBROADCASTSS/VBROADCASTF128 carga valores en coma flotante como un tuple del operando de origen (segundo operando) en memoria y transmitido a todos los elementos del operando de destino (primer operando).

VEX256-versiones codificadas: El operando de destino es un registro YMM. El operando de origen es una ubicación de memoria de 32 bits, 64 bits o 128 bits. Las codificación de fuentes registradas están reservadas y #UD. Bits (MAXVL-1:256) del registro de destino se ponen a cero.

EVEX-versiones codificadas: El operando de destino es un registro ZMM/YMM/XMM actualizado según la máscara de escritura k1. El operando de origen es una ubicación de memoria de 32 bits, de 64 bits o el elemento de palabra doble/cuadword baja de un registro XMM.

VBROADCASTF32X2/VBROADCASTF32X4/VBROADCASTF64X2/VBROADCASTF32X8/VBROADCASTF64X4 carga valores en coma flotante como tuples del operando de origen (el segundo operando) en memoria o registro y transmisión a todos los elementos del operando de destino (el primer operando). El operando de destino es un registro YMM/ZMM actualizado según la máscara de escritura k1. El operando de origen es un registro o 64-bit/128-bit/256-bit ubicación de memoria.

VBROADCASTSD y VBROADCASTF128,F32x4 y F64x2 solo están soportados como versiones de 256 bits y 512 bits de ancho y arriba. VBROADCASTSS es compatible con versiones de 128 bits, 256 bits y 512 bits de ancho. F32x8 y F64x4 solo son compatibles con versiones de 512 bits de ancho.

VBROADCASTF32X2/VBROADCASTF32X4/VBROADCASTF32X8 have 32-bit granularity. VBROADCASTF64X2 and VBROADCASTF64X4 have 64-bit granularity.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

Si VBROADCASTSD o VBROADCASTF128 está codificado con VEX.L= 0, un intento de ejecutar la instrucción codificada con VEX.L= 0 causará una excepción #UD.

```text
                                                                            m32          X0
```

DEST X0      X0     X0                                   X0    X0       X0       X0      X0

Figura 5-1. VBROADCASTSS Operación (VEX.256 versión codificada)

```text
                                                                            m32          X0
```

DEST 0       0      0                                    0     X0       X0       X0      X0

Figura 5-2. Operación VBROADCASTSS (versión VEX.128-bit)

```text
                                                                   m64               X0
```

DEST     X0                                          X0            X0                X0

Figura 5-3. Operación VBROADCASTSD (versión VEX.256-bit)

```text
                                                         m128           X0
```

DEST            X0                                                      X0

Figure 5-4. VBROADCASTF128 Operation (VEX.256-bit version)

```text
                                                        m256            X0
```

```text
                    DEST                 X0                             X0
```

Figura 5-5. VBROADCASTF64X4 Operación (512-bit versión con máscara de escritura todos 1s)

## Operación

```text
VBROADCASTSS (128-bit Version VEX and Legacy)
temp := SRC[31:0]
DEST[31:0] := temp
DEST[63:32] := temp
DEST[95:64] := temp
DEST[127:96] := temp
DEST[MAXVL-1:128] := 0

VBROADCASTSS (VEX.256 Encoded Version)
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

VBROADCASTSS (EVEX Encoded Versions)

(KL, VL) (4, 128), (8, 256),= (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[31:0]

     ELSE

             IF *merging-masking*                    ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                                ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VBROADCASTSD (VEX.256 Encoded Version)
temp := SRC[63:0]
DEST[63:0] := temp
DEST[127:64] := temp
DEST[191:128] := temp
DEST[255:192] := temp
DEST[MAXVL-1:256] := 0

VBROADCASTSD (EVEX Encoded Versions)

(KL, VL) = (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[63:0]

     ELSE

             IF *merging-masking*                    ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                                ; zeroing-masking

                     DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VBROADCASTF32x2 (EVEX Encoded Versions)

(KL, VL) = (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

n := (j mod 2) * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[n+31:n]

     ELSE

             IF *merging-masking*                    ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                                ; zeroing-masking

                     DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VBROADCASTF128 (VEX.256 Encoded Version)
temp := SRC[127:0]
DEST[127:0] := temp
DEST[255:128] := temp
DEST[MAXVL-1:256] := 0


VBROADCASTF32X4 (EVEX Encoded Versions)

(KL, VL) = (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j* 32

n := (j modulo 4) * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[n+31:n]

     ELSE

             IF *merging-masking*                    ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                               ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VBROADCASTF64X2 (EVEX Encoded Versions)

(KL, VL) = (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

n := (j modulo 2) * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[n+63:n]

     ELSE

             IF *merging-masking*                    ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                               ; zeroing-masking

                    DEST[i+63:i] = 0

             FI

FI;

ENDFOR;

VBROADCASTF32X8 (EVEX.U1.512 Encoded Version)

FOR j := 0 TO 15

i := j * 32

n := (j modulo 8) * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[n+31:n]

     ELSE

             IF *merging-masking*                    ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                               ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VBROADCASTF64X4 (EVEX.512 Encoded Version)

FOR j := 0 TO 7

i := j * 64

n := (j modulo 4) * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[n+63:n]

     ELSE

             IF *merging-masking*                    ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                                ; zeroing-masking

                 DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VBROADCASTF32x2 __m512 _mm512_broadcast_f32x2( __m128 a);
VBROADCASTF32x2 __m512 _mm512_mask_broadcast_f32x2(__m512 s, __mmask16 k, __m128 a);
VBROADCASTF32x2 __m512 _mm512_maskz_broadcast_f32x2( __mmask16 k, __m128 a);
VBROADCASTF32x2 __m256 _mm256_broadcast_f32x2( __m128 a);
VBROADCASTF32x2 __m256 _mm256_mask_broadcast_f32x2(__m256 s, __mmask8 k, __m128 a);
VBROADCASTF32x2 __m256 _mm256_maskz_broadcast_f32x2( __mmask8 k, __m128 a);
VBROADCASTF32x4 __m512 _mm512_broadcast_f32x4( __m128 a);
VBROADCASTF32x4 __m512 _mm512_mask_broadcast_f32x4(__m512 s, __mmask16 k, __m128 a);
VBROADCASTF32x4 __m512 _mm512_maskz_broadcast_f32x4( __mmask16 k, __m128 a);
VBROADCASTF32x4 __m256 _mm256_broadcast_f32x4( __m128 a);
VBROADCASTF32x4 __m256 _mm256_mask_broadcast_f32x4(__m256 s, __mmask8 k, __m128 a);
VBROADCASTF32x4 __m256 _mm256_maskz_broadcast_f32x4( __mmask8 k, __m128 a);
VBROADCASTF32x8 __m512 _mm512_broadcast_f32x8( __m256 a);
VBROADCASTF32x8 __m512 _mm512_mask_broadcast_f32x8(__m512 s, __mmask16 k, __m256 a);
VBROADCASTF32x8 __m512 _mm512_maskz_broadcast_f32x8( __mmask16 k, __m256 a);
VBROADCASTF64x2 __m512d _mm512_broadcast_f64x2( __m128d a);
VBROADCASTF64x2 __m512d _mm512_mask_broadcast_f64x2(__m512d s, __mmask8 k, __m128d a);
VBROADCASTF64x2 __m512d _mm512_maskz_broadcast_f64x2( __mmask8 k, __m128d a);
VBROADCASTF64x2 __m256d _mm256_broadcast_f64x2( __m128d a);
VBROADCASTF64x2 __m256d _mm256_mask_broadcast_f64x2(__m256d s, __mmask8 k, __m128d a);
VBROADCASTF64x2 __m256d _mm256_maskz_broadcast_f64x2( __mmask8 k, __m128d a);
VBROADCASTF64x4 __m512d _mm512_broadcast_f64x4( __m256d a);
VBROADCASTF64x4 __m512d _mm512_mask_broadcast_f64x4(__m512d s, __mmask8 k, __m256d a);
VBROADCASTF64x4 __m512d _mm512_maskz_broadcast_f64x4( __mmask8 k, __m256d a);
VBROADCASTSD __m512d _mm512_broadcastsd_pd( __m128d a);
VBROADCASTSD __m512d _mm512_mask_broadcastsd_pd(__m512d s, __mmask8 k, __m128d a);
VBROADCASTSD __m512d _mm512_maskz_broadcastsd_pd(__mmask8 k, __m128d a);
VBROADCASTSD __m256d _mm256_broadcastsd_pd(__m128d a);
VBROADCASTSD __m256d _mm256_mask_broadcastsd_pd(__m256d s, __mmask8 k, __m128d a);
VBROADCASTSD __m256d _mm256_maskz_broadcastsd_pd( __mmask8 k, __m128d a);
VBROADCASTSD __m256d _mm256_broadcast_sd(double *a);
VBROADCASTSS __m512 _mm512_broadcastss_ps( __m128 a);
VBROADCASTSS __m512 _mm512_mask_broadcastss_ps(__m512 s, __mmask16 k, __m128 a);
VBROADCASTSS __m512 _mm512_maskz_broadcastss_ps( __mmask16 k, __m128 a);
VBROADCASTSS __m256 _mm256_broadcastss_ps(__m128 a);
VBROADCASTSS __m256 _mm256_mask_broadcastss_ps(__m256 s, __mmask8 k, __m128 a);
VBROADCASTSS __m256 _mm256_maskz_broadcastss_ps( __mmask8 k, __m128 a);
VBROADCASTSS __m128 _mm_broadcastss_ps(__m128 a);
VBROADCASTSS __m128 _mm_mask_broadcastss_ps(__m128 s, __mmask8 k, __m128 a);
VBROADCASTSS __m128 _mm_maskz_broadcastss_ps( __mmask8 k, __m128 a);
VBROADCASTSS __m128 _mm_broadcast_ss(float *a);
VBROADCASTSS __m256 _mm256_broadcast_ss(float *a);
VBROADCASTF128 __m256 _mm256_broadcast_ps(__m128 * a);
VBROADCASTF128 __m256d _mm256_broadcast_pd(__m128d * a);
```
