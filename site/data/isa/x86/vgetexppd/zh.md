---
summary: 将 打包双精度浮点值 的指数转换为双倍
---

## 说明

从 源操作数 (第二个 操作数) 中每个qword 数据元素的正态化 双精度浮点 表示法中提取偏差的参数为无偏差的签名整数,或者将输入数据的非正常表示法转换为无偏差的负整数值. 无偏差的表示器的每个整数值被转换成双精度浮点值,并将目标操作数(第一个操作数)对应的qword元素写成双精度浮点数字.

目标操作数是一个ZMM/YMM/XMM登记册,并在写掩码下更新. 源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位的内存位置,也可以是512/256/128位的向量,从64位的内存位置广播.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

每个 GETEXP 操作将表示值转换为 浮点 数字(在非正常表示中允许输入值). 表5-13列出了输入值的特殊情况。

The formula is:

GETEXP(x) = 地板(log2(XxXXX)) 标记地板(x) 代表最大整数不超过实际数字x.

** VGETEXPPD/SD特殊情况**

| 输入 操作数 | 结果 | 评论 |
| --- | --- | --- |
| src1=纳恩 | QNaN( 弧1) |  |
| 0 < \|src1\| < INF | 楼层(log2(\|src1\|)) | 如果( SRC = SNaN),则 #IE |
| \| src1\| = +INF | +INF | 如果( SRC = 不正常),则 #DE |
| \| src1\| = 0 | -INF |  |

## 行动

```text
NormalizeExpTinyDPFP(SRC[63:0])
{


   // Jbit is the hidden integral bit of a floating-point number. In case of denormal number it has the value of ZERO.

   Src.Jbit := 0;

   Dst.exp := 1;

   Dst.fraction := SRC[51:0];

   WHILE(Src.Jbit = 0)

   {

      Src.Jbit := Dst.fraction[51];        // Get the fraction MSB

      Dst.fraction := Dst.fraction << 1 ;             // One bit shift left

      Dst.exp-- ;              // Decrement the exponent

   }

   Dst.fraction := 0;          // zero out fraction bits

   Dst.sign := 1;              // Return negative sign

   TMP[63:0] := MXCSR.DAZ? 0 : (Dst.sign << 63) OR (Dst.exp << 52) OR (Dst.fraction) ;

   Return (TMP[63:0]);

}

ConvertExpDPFP(SRC[63:0])

{

   Src.sign := 0;              // Zero out sign bit

   Src.exp := SRC[62:52];

   Src.fraction := SRC[51:0];

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

   ELSE            // check if denormal operand (notice that MXCSR.DAZ = 0)

   {

      IF ((Src.exp = 0) AND (Src.fraction != 0))

      {

         TMP[63:0] := NormalizeExpTinyDPFP(SRC[63:0]) ;               // Get Normalized Exponent

         Set #DE

      }

      ELSE              // exponent value is correct

      {

         TMP[63:0] := (Src.sign << 63) OR (Src.exp << 52) OR (Src.fraction) ;

      }

      TMP := SAR(TMP, 52) ;                // Shift Arithmetic Right

      TMP := TMP  1023;                   // Subtract Bias

      Return CvtI2D(TMP);                  // Convert INT to double precision floating-point number

   }

}

VGETEXPPD (EVEX encoded versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64


IF k1[j] OR *no writemask*

     THEN

        IF (EVEX.b = 1) AND (SRC *is memory*)

             THEN

             DEST[i+63:i] :=

        ConvertExpDPFP(SRC[63:0])

             ELSE

             DEST[i+63:i] :=

        ConvertExpDPFP(SRC[i+63:i])

        FI;

     ELSE

        IF *merging-masking*         ; merging-masking

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
VGETEXPPD __m512d _mm512_getexp_pd(__m512d a);
VGETEXPPD __m512d _mm512_mask_getexp_pd(__m512d s, __mmask8 k, __m512d a);
VGETEXPPD __m512d _mm512_maskz_getexp_pd( __mmask8 k, __m512d a);
VGETEXPPD __m512d _mm512_getexp_round_pd(__m512d a, int sae);
VGETEXPPD __m512d _mm512_mask_getexp_round_pd(__m512d s, __mmask8 k, __m512d a, int sae);
VGETEXPPD __m512d _mm512_maskz_getexp_round_pd( __mmask8 k, __m512d a, int sae);
VGETEXPPD __m256d _mm256_getexp_pd(__m256d a);
VGETEXPPD __m256d _mm256_mask_getexp_pd(__m256d s, __mmask8 k, __m256d a);
VGETEXPPD __m256d _mm256_maskz_getexp_pd( __mmask8 k, __m256d a);
VGETEXPPD __m128d _mm_getexp_pd(__m128d a);
VGETEXPPD __m128d _mm_mask_getexp_pd(__m128d s, __mmask8 k, __m128d a);
VGETEXPPD __m128d _mm_maskz_getexp_pd( __mmask8 k, __m128d a);
```

## SIMD 浮点 例外

Invalid, Denormal.

## 其他例外

见表2-48"E2类例外条件"。

Additionally:

```text
#UD               If EVEX.vvvv != 1111B.
```
