---
summary: 使用 Opmask 控制器混合字节/ Word 矢量
---

## 说明

在 第一源操作数 字节矢量寄存器和来自内存或寄存器的 第二源操作数 字节矢量之间,执行逐项元素混合字节/字节元素,使用指令掩码作为选择器. 结果会被写入目的地字节矢量寄存器.

目的地和第一个源操作数是ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的登记册,512/256/128位内存位置或512/256/128位内存位置.

口罩不作为写掩码用于此指令. 相反,遮罩被用作元素选择器:目的地的每个元素都使用相关遮罩位值(第一源0,第二源1)在第一源或第二源之间有条件地选择.

## 行动

```text
VPBLENDMB (EVEX encoded versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SRC2[i+7:i]

     ELSE

             IF *merging-masking*                  ; merging-masking

                  THEN DEST[i+7:i] := SRC1[i+7:i]

                  ELSE                             ; zeroing-masking

                    DEST[i+7:i] := 0

             FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0;

VPBLENDMW (EVEX encoded versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SRC2[i+15:i]

     ELSE

             IF *merging-masking*                  ; merging-masking

                  THEN DEST[i+15:i] := SRC1[i+15:i]

                  ELSE                             ; zeroing-masking

                    DEST[i+15:i] := 0

             FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPBLENDMB __m512i _mm512_mask_blend_epi8(__mmask64 m, __m512i a, __m512i b);
VPBLENDMB __m256i _mm256_mask_blend_epi8(__mmask32 m, __m256i a, __m256i b);
VPBLENDMB __m128i _mm_mask_blend_epi8(__mmask16 m, __m128i a, __m128i b);
VPBLENDMW __m512i _mm512_mask_blend_epi16(__mmask32 m, __m512i a, __m512i b);
VPBLENDMW __m256i _mm256_mask_blend_epi16(__mmask16 m, __m256i a, __m256i b);
VPBLENDMW __m128i _mm_mask_blend_epi16(__mmask8 m, __m128i a, __m128i b);
```

## SIMD 浮点 例外

None

## 其他例外

参见表2-51"E4类例外条件".
