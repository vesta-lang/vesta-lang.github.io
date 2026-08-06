---
summary: 计算包装浮点32平方根的近似对称值
---

## 说明

本指令对源操作数(第二个操作数)中16个打包单精度浮点值的方根的近似对等值进行SIMD计算,并根据写掩码将包装好的单精度浮点结果存储在目标操作数(第一个操作数)中. 此近似的最大相对误差小于2-14.

EVEX.512 编码版本 : 源操作数可以是ZMM寄存器,512位内存位置或512位向量从32位内存位置广播. 目标操作数是一个ZMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.256 编码版本 : 源操作数是一个YMM寄存器,一个256位的内存位置,或者从32位的内存位置广播的256位矢量. 目标操作数是一个YMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.128 编码版本 : 源操作数是一个XMM寄存器,一个128位的内存位置,或者从32位的内存位置广播128位的矢量. 目标操作数是一个XMM的寄存器,有条件的更新使用写掩码 k1.

VRSQRT14PS指令不受MXCSR寄存器中四舍五入控制位的影响. 当一个源值为0.0时,返回一个带有源值符号的值. 当 源操作数 是 +时,返回 +ZERO 值。 一个异常源值只有在DAZ比特被设置在MXCSR时才作为零处理. 否则,它得到正确处理,并与规定的蒙面反应进行近似。 当一个源值为负值(除0.0外)时,返回 浮点 QNaN indeminite。 当一个源值是SNaN或QNaN时,将SNaN转换成QNaN或返回源QNaN.

MXCSR例外旗帜不受本指令影响,浮点例外不报告.

说明: EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

在https://software.intel.com/en-us/articles/for-IA-近似-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2上可以找到VRSQRT14xx的数值精确执行.

## 行动

```text
VRSQRT14PS (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+31:i] := APPROXIMATE(1.0/ SQRT(SRC[31:0]));

                  ELSE DEST[i+31:i] := APPROXIMATE(1.0/ SQRT(SRC[i+31:i]));

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[i+31:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+31:i] := 0

     FI;

FI;

ENDFOR;
DEST[MAXVL-1:VL] := 0

                                          Table 5-33. VRSQRT14PS Special Cases

Input value                Result value             Comments
Any denormal
X = 2-2n                   Normal                   Cannot generate overflow
X<0
X = -0                     2n
X = +0
X = +INF                   QNaN_Indefinite          Including -INF

                           -INF

                           +INF

                           +0
```

## Intel C/C++ 内在编译器

```c
VRSQRT14PS __m512 _mm512_rsqrt14_ps( __m512 a);
VRSQRT14PS __m512 _mm512_mask_rsqrt14_ps(__m512 s, __mmask16 k, __m512 a);
VRSQRT14PS __m512 _mm512_maskz_rsqrt14_ps( __mmask16 k, __m512 a);
VRSQRT14PS __m256 _mm256_rsqrt14_ps( __m256 a);
VRSQRT14PS __m256 _mm256_mask_rsqrt14_ps(__m256 s, __mmask8 k, __m256 a);
VRSQRT14PS __m256 _mm256_maskz_rsqrt14_ps( __mmask8 k, __m256 a);
VRSQRT14PS __m128 _mm_rsqrt14_ps( __m128 a);
VRSQRT14PS __m128 _mm_mask_rsqrt14_ps(__m128 s, __mmask8 k, __m128 a);
VRSQRT14PS __m128 _mm_maskz_rsqrt14_ps( __mmask8 k, __m128 a);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".
