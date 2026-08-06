---
summary: 使用 Opmask 控制器的混合浮控64/浮控32矢量
---

## 说明

执行第一源操作数(第二个操作数)中Flom64/float32元素与第二源操作数(第三个操作数)中元素的组合,使用opmask寄存器作为选择控制. 混合结果写入目的地登记册。

目的地和第一个源操作数是ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位向量从64位内存位置广播.

Opmask 寄存器不作为 写掩码 用于此指令 。 相反,遮罩被用作元素选择器:目的地的每个元素都使用相关的遮罩位值(第一源操作数为0,第二源操作数为1)在第一源或第二源之间有条件地选择.

如果 EVEX.z 设定,则在 目标操作数 被清零 中对应的遮罩比特值为0的元素.

## 行动

```text
VBLENDMPD (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no controlmask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    DEST[i+63:i] := SRC2[63:0]

                  ELSE

                    DEST[i+63:i] := SRC2[i+63:i]

             FI;

     ELSE

             IF *merging-masking*                 ; merging-masking

                  THEN DEST[i+63:i] := SRC1[i+63:i]

                  ELSE                            ; zeroing-masking

                    DEST[i+63:i] := 0

             FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VBLENDMPS (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no controlmask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    DEST[i+31:i] := SRC2[31:0]

                  ELSE

                    DEST[i+31:i] := SRC2[i+31:i]

             FI;

     ELSE

             IF *merging-masking*                 ; merging-masking

                  THEN DEST[i+31:i] := SRC1[i+31:i]

                  ELSE                            ; zeroing-masking

                    DEST[i+31:i] := 0

             FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VBLENDMPD __m512d _mm512_mask_blend_pd(__mmask8 k, __m512d a, __m512d b);
VBLENDMPD __m256d _mm256_mask_blend_pd(__mmask8 k, __m256d a, __m256d b);
VBLENDMPD __m128d _mm_mask_blend_pd(__mmask8 k, __m128d a, __m128d b);
VBLENDMPS __m512 _mm512_mask_blend_ps(__mmask16 k, __m512 a, __m512 b);
VBLENDMPS __m256 _mm256_mask_blend_ps(__mmask8 k, __m256 a, __m256 b);
VBLENDMPS __m128 _mm_mask_blend_ps(__mmask8 k, __m128 a, __m128 b);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51"E4类例外条件".
