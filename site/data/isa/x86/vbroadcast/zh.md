---
summary: 装入广播 浮点 数据
---

## 说明

VBROADCASTSD/VBROADCASTSS/VBROADCASTF128从源操作数(第二架操作数)装入浮点值,作为一款Truple,用于内存并向目标操作数(第一架操作数)的所有元素广播.

VEX256-编码版本 : 目标操作数是一个YMM登记册. 源操作数要么是32位,64位,要么是128位的内存位置. 注册源编码被保留,并将#UD. 目的地的比特(MAXVL-1:256)注册被清零.

EVEX-编码版本 : 目标操作数是一个ZMM/YMM/XMM的登记册,并根据写掩码 k1更新. 源操作数要么是一个32位,64位的内存位置,要么是一个XMM寄存器的低双字/四字元素.

VBROADCASTF32X2/VBROADCASTF32X4/VBROADCASTF64X2/VBROADCASTF32X8/VBROADCASTF64X4从源操作数(第二个操作数)装入浮点值,作为Tuple,在内存或注册并广播到目标操作数(第一个操作数)的所有元素. 目标操作数是一个按照写掩码 k1更新的YMM/ZMM登记册. 源操作数要么是一个寄存器,要么是64位/128位/256位/内存位置.

VBROADCASTSD和VBROADCASTF128,F32x4和F64x2只支持为256位和512位宽版本及上. VBROADCASTSS支持128位,256位和512位宽版本. F32x8和F64x4仅作为512位宽版本支持.

VBROADCASTF32X2/VBROADCASTF32X4/VBROADCASTF32X8 have 32-bit granularity. VBROADCASTF64X2 and VBROADCASTF64X4 have 64-bit granularity.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

如果VBROADCASTSD或VBROADCASTF128被编码为VEX.L=0,试图执行以VEX.L=0编码的指令将导致#UD例外.

```text
                                                                            m32          X0
```

DEST X0      X0     X0                                   X0    X0       X0       X0      X0

图5-1。 VBROADCASTSS 操作 (VEX.256 编码版本)

```text
                                                                            m32          X0
```

DEST 0       0      0                                    0     X0       X0       X0      X0

图5-2. VBROADCASTSS 操作(VEX.128-bit版本)

```text
                                                                   m64               X0
```

DEST     X0                                          X0            X0                X0

图5-3。 VBROADCASTSD 操作(VEX.256-bit版本)

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

图5-5。 VBROADCASTF64X4 操作( 512- bit 版本, 所有 1s)

## 行动

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

## Intel C/C++ 内在编译器

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
