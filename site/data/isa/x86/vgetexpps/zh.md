---
summary: 将 打包单精度浮点值 的指数转换为单一
---

## 说明

从源操作数(第二个操作数)中每个字词元素的规范化的单精度浮点表示值中提取偏差的表示值,作为无偏差的签名整数值,或者将输入数据的非正常表示值转换为无偏差的负整数值. 无偏差代词的每个整数值被转换成单精度浮点值,并将目标操作数(第一个操作数)的相应dword元素写成单精度浮点数字.

目标操作数是一个ZMM/YMM/XMM登记册,并在写掩码下更新. 源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位的内存位置,也可以是512/256/128位的向量,通过32位的内存位置广播.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

每个 GETEXP 操作将表示值转换为 浮点 数字(在非正常表示中允许输入值). 表5-15列出了输入值的特殊情况。

The formula is:

GETEXP(x) = 地板(log2(Xx|)) 标记地板(x) 代表最大整数不超过实际数字x.

VGETEXPxx和VGETMANTxxx指令的软件使用一般涉及GETEXP操作和GETMANT操作的组合(参见VGETMANTPD). 因此,VGETEXPxx指令对句柄 SIMD 浮点的例外不需要软件.

** VGETEXPPS/SS 特殊情况**

| 输入 操作数 | 结果 | 评论 |
| --- | --- | --- |
| src1=纳恩 | QNaN( 弧1) |  |
| 0 < \|src1\| < INF | 楼层(log2(\|src1\|)) | 如果( SRC = SNaN),则 #IE |
| \| src1\| = +INF | +INF | 如果( SRC = 不正常),则 #DE |
| \| src1\| = 0 | -INF |  |
| ure 5-14 演示 VGETEXPPS 功能 | 的输入值。 |  |
| 31 | 30  29  28  27 26   25  24  23  22  21  20  19  18  17  16  15  14 | 13  12 11 10  9  8  7  6  5  4  3  2  1  0 |
| s | 执行 | 分数 |
| 弧 = 2^1 0 | 1   0   0   0    0  0   0   0   0   0   0   0   0   0   0   0   0 | 0   0  0  0   0  0  0  0  0  0  0  0  0  0 |
| SAR Src, 23 = 080小时 0 | 0   0   0   0    0  0   0   0   0   0   0   0   0   0   0   0   0 | 0   0  0  0   0  0  1  0  0  0  0  0  0  0 |
| -1号线 | 1   1   1   1    1  1   1   1   1   1   1   1   1   1   1   1   1 | 1   1  1  1   1  1  1  0  0  0  0  0  0  1 |
| Tmp - Bias = 10 (韩语) | 0   0   0   0    0  0   0   0   0   0   0   0   0   0   0   0   0 | 0   0  0  0   0  0  0  0  0  0  0  0  0  1 |
| Cvt_PI2PS(01h) = 2^0     0 | 0   1   1   1    1  1   1   1   0   0   0   0   0   0   0   0   0 | 0   0  0  0   0  0  0  0  0  0  0  0  0  0 |

图5-14. VGETEXPPS 正常输入值的功能性

## 行动

```text
NormalizeExpTinySPFP(SRC[31:0])

{

   // Jbit is the hidden integral bit of a floating-point number. In case of denormal number it has the value of ZERO.

   Src.Jbit := 0;

   Dst.exp := 1;

   Dst.fraction := SRC[22:0];

   WHILE(Src.Jbit = 0)

   {

      Src.Jbit := Dst.fraction[22];           // Get the fraction MSB

      Dst.fraction := Dst.fraction << 1 ; // One bit shift left

      Dst.exp-- ;                    // Decrement the exponent

   }

   Dst.fraction := 0;                // zero out fraction bits

   Dst.sign := 1;                    // Return negative sign

   TMP[31:0] := MXCSR.DAZ? 0 : (Dst.sign << 31) OR (Dst.exp << 23) OR (Dst.fraction) ;

   Return (TMP[31:0]);

}

ConvertExpSPFP(SRC[31:0])

{

   Src.sign := 0;                    // Zero out sign bit

   Src.exp := SRC[30:23];

   Src.fraction := SRC[22:0];

   // Check for NaN

   IF (SRC = NaN)

   {

      IF ( SRC = SNAN ) SET IE;


         Return QNAN(SRC);
   }
   // Check for +INF
   IF (Src = +INF) RETURN (Src);

   // check if zero operand

   IF ((Src.exp = 0) AND ((Src.fraction = 0) OR (MXCSR.DAZ = 1))) Return (-INF);

   }

   ELSE              // check if denormal operand (notice that MXCSR.DAZ = 0)

   {

        IF ((Src.exp = 0) AND (Src.fraction != 0))

        {

                TMP[31:0] := NormalizeExpTinySPFP(SRC[31:0]) ;            // Get Normalized Exponent

                Set #DE

        }

        ELSE             // exponent value is correct

        {

                TMP[31:0] := (Src.sign << 31) OR (Src.exp << 23) OR (Src.fraction) ;

        }

        TMP := SAR(TMP, 23) ;               // Shift Arithmetic Right

        TMP := TMP  127;                   // Subtract Bias

        Return CvtI2S(TMP);                 // Convert INT to single precision floating-point number

   }

}

VGETEXPPS (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

   i := j * 32

   IF k1[j] OR *no writemask*

        THEN

                IF (EVEX.b = 1) AND (SRC *is memory*)

                     THEN

                         DEST[i+31:i] :=

                ConvertExpSPFP(SRC[31:0])

                     ELSE

                         DEST[i+31:i] :=

                ConvertExpSPFP(SRC[i+31:i])

                FI;

        ELSE

                IF *merging-masking*                   ; merging-masking

                     THEN *DEST[i+31:i] remains unchanged*

                     ELSE                              ; zeroing-masking

                         DEST[i+31:i] := 0

                FI

   FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VGETEXPPS __m512 _mm512_getexp_ps( __m512 a);
VGETEXPPS __m512 _mm512_mask_getexp_ps(__m512 s, __mmask16 k, __m512 a);
VGETEXPPS __m512 _mm512_maskz_getexp_ps( __mmask16 k, __m512 a);
VGETEXPPS __m512 _mm512_getexp_round_ps( __m512 a, int sae);
VGETEXPPS __m512 _mm512_mask_getexp_round_ps(__m512 s, __mmask16 k, __m512 a, int sae);
VGETEXPPS __m512 _mm512_maskz_getexp_round_ps( __mmask16 k, __m512 a, int sae);
VGETEXPPS __m256 _mm256_getexp_ps(__m256 a);
VGETEXPPS __m256 _mm256_mask_getexp_ps(__m256 s, __mmask8 k, __m256 a);
VGETEXPPS __m256 _mm256_maskz_getexp_ps( __mmask8 k, __m256 a);
VGETEXPPS __m128 _mm_getexp_ps(__m128 a);
VGETEXPPS __m128 _mm_mask_getexp_ps(__m128 s, __mmask8 k, __m128 a);
VGETEXPPS __m128 _mm_maskz_getexp_ps( __mmask8 k, __m128 a);
```

## SIMD 浮点 例外

Invalid, Denormal.

## 其他例外

见表2-48"E2类例外条件"。

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
