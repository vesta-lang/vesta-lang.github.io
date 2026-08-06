---
summary: 装入整数和广播
---

## 说明

从源操作数(第二个操作数)装入整数数据,并广播到目标操作数(第一个操作数)的所有元素.

VEX256 - 编码为VPBROADCASTB/W/D/Q: 源操作数为8位,16位,32位,64位内存位置或低8位,16位32位,64位数据在一个XMM的寄存器中. 目标操作数是一个YMM登记册. VPBROAD-CASTI128支持128位内存位置的源操作数. VPBROADCAS-TI128的注册源编码被保留,并将#UD. 目的地的比特(MAXVL-1:256)注册被清零.

EVEX - 编码为VPBROADCASTD/Q: 源操作数是一个32位,64位的内存位置或XMM寄存器中的低32位,64位的数据. 目标操作数是一个ZMM/YMM/XMM的登记册,并根据写掩码 k1更新.

VPBROADCASTI32X4 和 VPBROADCASTI64X4 分别是: 目标操作数是一个ZMM的登记册,并根据写掩码的k1更新. 源操作数为128位或256位内存位置. VBROADCASTI32X4和VBROADCASTI64X4的注册源编码被保留,并将#UD.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

如果VPBROADCASTI128被用VEX.L=0编码,试图执行用VEX.L=0编码的指令将导致#UD例外.

```text
                                                             m32      X0
```

DEST X0                                  X0  X0  X0  X0  X0       X0  X0

图5-16. VPBROADCASTD 操作 (VEX.256 编码版本)

```text
                                                             m32      X0
```

DEST 0                                   0   0   0   X0  X0       X0  X0

图5-17. VPBROADCASTD 操作(128位版本)

```text
                                                       m64      X0
```

DEST  X0                                     X0        X0       X0

图5-18. VPBROADCASTQ 操作(256位版本)

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

## 行动

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

## Intel C/C++ 内在编译器

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

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded指令,参见表2-23"第6类例外条件".

EVEX-encoded指令,语法为reg/mem 操作数,参见表2-55"Type E6类例外条件".

Additionally:

```text
#UD               If VEX.L = 0 for VPBROADCASTQ, VPBROADCASTI128.
```

If EVEX.L'L = 0 for VBROADCASTI32X4/VBROADCASTI64X2.

If EVEX.L'L < 10b for VBROADCASTI32X8/VBROADCASTI64X4.
