---
summary: 移动未对齐的组合整数
---

## 说明

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD. EVEX 编码版本 :

将128,256或512位的打包字节/字节/双字节/四字整数值从源操作数(第二个操作数)移动到目标操作数(第一个操作数). 此指令可用于从 内存位置 中加载矢量寄存器,将矢量寄存器的内容存储到 内存位置 中,或者在两个矢量寄存器之间移动数据.

目标操作数在8位(VMOVDQU8),16位(VMOVDQU16),32位(VMOVDQU32),或64位(VMOVDQU64)颗粒度上根据写掩码进行更新.

VEX.256 编码版本 :

从 源操作数(第二个 操作数) 移动256 位组合整数值到 目标操作数(第一个 操作数) . 本指令可用于从256位的内存位置加载一个YMM寄存器,将一个YMM寄存器的内容存储到256位的内存位置寄存器中,或者在两个YMM寄存器之间移动数据.

目的地的比特(MAXVL-1:256)注册被清零.

128-bit versions:

从 源操作数(第二个 操作数) 移动128 位块整数到 目标操作数(第一个 操作数) . 本指令可用于从128位的内存位置装入XMM寄存器,将XMM寄存器的内容存储到128位的内存位置寄存器中,或者在两个XMM寄存器之间移动数据.

128位遗产 SSE 版本 : 对应目的地的比特(MAXVL-1:128)注册保持不变.

当来源或目标操作数为内存操作数时,操作数可能不与任何对齐,而不会生成一般保护例外(#GP)

VEX.128 编码版本 : 目的地的位数(MAXVL-1:128)登记被清零.

## 行动

```text
VMOVDQU8 (EVEX Encoded Versions, Register-Copy Form)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SRC[i+7:i]

     ELSE

            IF *merging-masking*            ; merging-masking

                THEN *DEST[i+7:i] remains unchanged*

                ELSE DEST[i+7:i] := 0       ; zeroing-masking

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VMOVDQU8 (EVEX Encoded Versions, Store-Form)    ; merging-masking
(KL, VL) = (16, 128), (32, 256), (64, 512)
FOR j := 0 TO KL-1

    i := j * 8
    IF k1[j] OR *no writemask*

          THEN DEST[i+7:i] :=
                SRC[i+7:i]

          ELSE *DEST[i+7:i] remains unchanged*
    FI;
ENDFOR;

VMOVDQU8 (EVEX Encoded Versions, Load-Form)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SRC[i+7:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+7:i] remains unchanged*

                 ELSE DEST[i+7:i] := 0      ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVDQU16 (EVEX Encoded Versions, Register-Copy Form)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SRC[i+15:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE DEST[i+15:i] := 0     ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVDQU16 (EVEX Encoded Versions, Store-Form)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] :=

             SRC[i+15:i]

     ELSE *DEST[i+15:i] remains unchanged*      ; merging-masking

FI;

ENDFOR;


VMOVDQU16 (EVEX Encoded Versions, Load-Form)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SRC[i+15:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE DEST[i+15:i] := 0     ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVDQU32 (EVEX Encoded Versions, Register-Copy Form)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[i+31:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE DEST[i+31:i] := 0     ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVDQU32 (EVEX Encoded Versions, Store-Form)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] :=

             SRC[i+31:i]

     ELSE *DEST[i+31:i] remains unchanged*     ; merging-masking

FI;

ENDFOR;

VMOVDQU32 (EVEX Encoded Versions, Load-Form)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[i+31:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE DEST[i+31:i] := 0     ; zeroing-masking

             FI

FI;

ENDFOR


DEST[MAXVL-1:VL] := 0

VMOVDQU64 (EVEX Encoded Versions, Register-Copy Form)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[i+63:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE DEST[i+63:i] := 0     ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVDQU64 (EVEX Encoded Versions, Store-Form)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[i+63:i]

     ELSE *DEST[i+63:i] remains unchanged*     ; merging-masking

    FI;
ENDFOR;

VMOVDQU64 (EVEX Encoded Versions, Load-Form)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[i+63:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE DEST[i+63:i] := 0     ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVDQU (VEX.256 Encoded Version, Load - and Register Copy)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0

VMOVDQU (VEX.256 Encoded Version, Store-Form)
DEST[255:0] := SRC[255:0]

VMOVDQU (VEX.128 encoded version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] := 0


VMOVDQU (128-bit Load- and Register-Copy- Form Legacy SSE Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] (Unmodified)

(V)MOVDQU (128-bit Store-Form Version)
DEST[127:0] := SRC[127:0]
```

## Intel C/C++ 内在编译器

```c
VMOVDQU16 __m512i _mm512_mask_loadu_epi16(__m512i s, __mmask32 k, void * sa);
VMOVDQU16 __m512i _mm512_maskz_loadu_epi16( __mmask32 k, void * sa);
VMOVDQU16 void _mm512_mask_storeu_epi16(void * d, __mmask32 k, __m512i a);
VMOVDQU16 __m256i _mm256_mask_loadu_epi16(__m256i s, __mmask16 k, void * sa);
VMOVDQU16 __m256i _mm256_maskz_loadu_epi16( __mmask16 k, void * sa);
VMOVDQU16 void _mm256_mask_storeu_epi16(void * d, __mmask16 k, __m256i a);
VMOVDQU16 __m128i _mm_mask_loadu_epi16(__m128i s, __mmask8 k, void * sa);
VMOVDQU16 __m128i _mm_maskz_loadu_epi16( __mmask8 k, void * sa);
VMOVDQU16 void _mm_mask_storeu_epi16(void * d, __mmask8 k, __m128i a);
VMOVDQU32 __m512i _mm512_loadu_epi32( void * sa);
VMOVDQU32 __m512i _mm512_mask_loadu_epi32(__m512i s, __mmask16 k, void * sa);
VMOVDQU32 __m512i _mm512_maskz_loadu_epi32( __mmask16 k, void * sa);
VMOVDQU32 void _mm512_storeu_epi32(void * d, __m512i a);
VMOVDQU32 void _mm512_mask_storeu_epi32(void * d, __mmask16 k, __m512i a);
VMOVDQU32 __m256i _mm256_mask_loadu_epi32(__m256i s, __mmask8 k, void * sa);
VMOVDQU32 __m256i _mm256_maskz_loadu_epi32( __mmask8 k, void * sa);
VMOVDQU32 void _mm256_storeu_epi32(void * d, __m256i a);
VMOVDQU32 void _mm256_mask_storeu_epi32(void * d, __mmask8 k, __m256i a);
VMOVDQU32 __m128i _mm_mask_loadu_epi32(__m128i s, __mmask8 k, void * sa);
VMOVDQU32 __m128i _mm_maskz_loadu_epi32( __mmask8 k, void * sa);
VMOVDQU32 void _mm_storeu_epi32(void * d, __m128i a);
VMOVDQU32 void _mm_mask_storeu_epi32(void * d, __mmask8 k, __m128i a);
VMOVDQU64 __m512i _mm512_loadu_epi64( void * sa);
VMOVDQU64 __m512i _mm512_mask_loadu_epi64(__m512i s, __mmask8 k, void * sa);
VMOVDQU64 __m512i _mm512_maskz_loadu_epi64( __mmask8 k, void * sa);
VMOVDQU64 void _mm512_storeu_epi64(void * d, __m512i a);
VMOVDQU64 void _mm512_mask_storeu_epi64(void * d, __mmask8 k, __m512i a);
VMOVDQU64 __m256i _mm256_mask_loadu_epi64(__m256i s, __mmask8 k, void * sa);
VMOVDQU64 __m256i _mm256_maskz_loadu_epi64( __mmask8 k, void * sa);
VMOVDQU64 void _mm256_storeu_epi64(void * d, __m256i a);
VMOVDQU64 void _mm256_mask_storeu_epi64(void * d, __mmask8 k, __m256i a);
VMOVDQU64 __m128i _mm_mask_loadu_epi64(__m128i s, __mmask8 k, void * sa);
VMOVDQU64 __m128i _mm_maskz_loadu_epi64( __mmask8 k, void * sa);
VMOVDQU64 void _mm_storeu_epi64(void * d, __m128i a);
VMOVDQU64 void _mm_mask_storeu_epi64(void * d, __mmask8 k, __m128i a);
VMOVDQU8 __m512i _mm512_mask_loadu_epi8(__m512i s, __mmask64 k, void * sa);
VMOVDQU8 __m512i _mm512_maskz_loadu_epi8( __mmask64 k, void * sa);
VMOVDQU8 void _mm512_mask_storeu_epi8(void * d, __mmask64 k, __m512i a);
VMOVDQU8 __m256i _mm256_mask_loadu_epi8(__m256i s, __mmask32 k, void * sa);
VMOVDQU8 __m256i _mm256_maskz_loadu_epi8( __mmask32 k, void * sa);
VMOVDQU8 void _mm256_mask_storeu_epi8(void * d, __mmask32 k, __m256i a);
VMOVDQU8 __m128i _mm_mask_loadu_epi8(__m128i s, __mmask16 k, void * sa);
VMOVDQU8 __m128i _mm_maskz_loadu_epi8( __mmask16 k, void * sa);
VMOVDQU8 void _mm_mask_storeu_epi8(void * d, __mmask16 k, __m128i a);
MOVDQU __m256i _mm256_loadu_si256 (__m256i * p);
MOVDQU _mm256_storeu_si256(_m256i *p, __m256i a);
MOVDQU __m128i _mm_loadu_si128 (__m128i * p);
MOVDQU _mm_storeu_si128(__m128i *p, __m128i a);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded 指令,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".

Additionally:

```text
#UD               If EVEX.vvvv != 1111B or VEX.vvvv != 1111B.
```
