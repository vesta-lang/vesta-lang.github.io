---
summary: 移动组合整数
---

## 说明

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

EVEX 编码版本 :

将128,256或512位包装的双字/四字整数值从源操作数(第二个操作数)移动到目标操作数(第一个操作数). 本规范可用于从int32/int64 内存位置装入矢量寄存器,将矢量寄存器的内容存储到int32/int64 内存位置,或者将数据移动到两个ZMM寄存器之间. 当来源或目标操作数为内存操作数时,操作数必须被对齐于16(EVEX.128)/32(EVEX.256)/64(EVEX.512)字节边界或一般保护例外(#GP). 要将整数数据移动到不匹配的内存位置,请使用 VMOVDQU 指令.

目标操作数根据写掩码更新为32位(VMOVDQA32)或64位(VMOVDQA64)颗粒.

VEX.256 编码版本 :

从 源操作数(第二个 操作数) 移动256 位组合整数值到 目标操作数(第一个 操作数) . 本指令可用于从256位的内存位置加载一个YMM寄存器,将一个YMM寄存器的内容存储到256位的内存位置寄存器中,或者在两个YMM寄存器之间移动数据.

当来源或目标操作数是内存操作数时,操作数必须在32字节边界或一般保护例外(#GP)上对齐. 要将整数数据移动到不匹配的内存位置,请使用 VMOVDQU 指令. 目的地的比特(MAXVL-1:256)注册被清零.

128-bit versions:

从 源操作数(第二个 操作数) 移动128 位块整数到 目标操作数(第一个 操作数) . 本指令可用于从128位的内存位置装入XMM寄存器,将XMM寄存器的内容存储到128位的内存位置寄存器中,或者在两个XMM寄存器之间移动数据.

当来源或目标操作数是内存操作数时,操作数必须在16字节边界或一般保护例外(#GP)上对齐. 要将整数数据移动到不匹配的内存位置,请使用 VMOVDQU 指令.

128位遗产 SSE 版本 : 相应的ZMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 目的地的位数(MAXVL-1:128)登记被清零.

## 行动

```text
VMOVDQA32 (EVEX Encoded Versions, Register-Copy Form)

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

VMOVDQA32 (EVEX Encoded Versions, Store-Form)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[i+31:i]

     ELSE *DEST[i+31:i] remains unchanged*     ; merging-masking

FI;

ENDFOR;

VMOVDQA32 (EVEX Encoded Versions, Load-Form)

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

VMOVDQA64 (EVEX Encoded Versions, Register-Copy Form)

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

VMOVDQA64 (EVEX Encoded Versions, Store-Form)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[i+63:i]

     ELSE *DEST[i+63:i] remains unchanged*     ; merging-masking

FI;

ENDFOR;

VMOVDQA64 (EVEX Encoded Versions, Load-Form)

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

VMOVDQA (VEX.256 Encoded Version, Load - and Register Copy)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0

VMOVDQA (VEX.256 Encoded Version, Store-Form)
DEST[255:0] := SRC[255:0]

VMOVDQA (VEX.128 Encoded Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] := 0

VMOVDQA (128-bit Load- and Register-Copy- Form Legacy SSE Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] (Unmodified)

(V)MOVDQA (128-bit Store-Form Version)
DEST[127:0] := SRC[127:0]
```

## Intel C/C++ 内在编译器

```c
VMOVDQA32 __m512i _mm512_load_epi32( void * sa);
VMOVDQA32 __m512i _mm512_mask_load_epi32(__m512i s, __mmask16 k, void * sa);
VMOVDQA32 __m512i _mm512_maskz_load_epi32( __mmask16 k, void * sa);
VMOVDQA32 void _mm512_store_epi32(void * d, __m512i a);
VMOVDQA32 void _mm512_mask_store_epi32(void * d, __mmask16 k, __m512i a);
VMOVDQA32 __m256i _mm256_mask_load_epi32(__m256i s, __mmask8 k, void * sa);
VMOVDQA32 __m256i _mm256_maskz_load_epi32( __mmask8 k, void * sa);
VMOVDQA32 void _mm256_store_epi32(void * d, __m256i a);
VMOVDQA32 void _mm256_mask_store_epi32(void * d, __mmask8 k, __m256i a);
VMOVDQA32 __m128i _mm_mask_load_epi32(__m128i s, __mmask8 k, void * sa);
VMOVDQA32 __m128i _mm_maskz_load_epi32( __mmask8 k, void * sa);
VMOVDQA32 void _mm_store_epi32(void * d, __m128i a);
VMOVDQA32 void _mm_mask_store_epi32(void * d, __mmask8 k, __m128i a);
VMOVDQA64 __m512i _mm512_load_epi64( void * sa);
VMOVDQA64 __m512i _mm512_mask_load_epi64(__m512i s, __mmask8 k, void * sa);
VMOVDQA64 __m512i _mm512_maskz_load_epi64( __mmask8 k, void * sa);
VMOVDQA64 void _mm512_store_epi64(void * d, __m512i a);
VMOVDQA64 void _mm512_mask_store_epi64(void * d, __mmask8 k, __m512i a);
VMOVDQA64 __m256i _mm256_mask_load_epi64(__m256i s, __mmask8 k, void * sa);
VMOVDQA64 __m256i _mm256_maskz_load_epi64( __mmask8 k, void * sa);
VMOVDQA64 void _mm256_store_epi64(void * d, __m256i a);
VMOVDQA64 void _mm256_mask_store_epi64(void * d, __mmask8 k, __m256i a);
VMOVDQA64 __m128i _mm_mask_load_epi64(__m128i s, __mmask8 k, void * sa);
VMOVDQA64 __m128i _mm_maskz_load_epi64( __mmask8 k, void * sa);
VMOVDQA64 void _mm_store_epi64(void * d, __m128i a);
VMOVDQA64 void _mm_mask_store_epi64(void * d, __mmask8 k, __m128i a);
MOVDQA void __m256i _mm256_load_si256 (__m256i * p);
MOVDQA _mm256_store_si256(_m256i *p, __m256i a);
MOVDQA __m128i _mm_load_si128 (__m128i * p);
MOVDQA void _mm_store_si128(__m128i *p, __m128i a);
```

## SIMD 浮点 例外

None.

## 其他例外

非EVEX-encoded 指令,参见表2-18中的例外类型1. SSE2,"第1类例外条件".

EVEX-encoded 指令,参见表2-46,"Type E1类例外条件".

Additionally:

```text
#UD               If EVEX.vvvv != 1111B or VEX.vvvv != 1111B.
```
