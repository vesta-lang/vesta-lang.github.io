---
summary: 计算包装浮点32值的对称性
---

## 说明

本指令对源操作数(第二个操作数)中打包单精度浮点值的近似对等值进行SIMD计算,并将包装的单精度浮点结果存储在目标操作数(第一个操作数)中. 此近似的最大相对误差小于2-14.

源操作数可以是ZMM寄存器,512位内存位置或512位向量从32位内存位置广播. 目标操作数是一个根据写掩码有条件更新的ZMM登记册.

VRCP14PS指令不受MXCSR寄存器中四舍五入控制位的影响. 当一个源值为0.0时,返回一个带有源值符号的值. 一个异常源值只有在 DAZ 位值设置在 MXCSR 时才会作为零处理. 否则它会被正确对待(即不作为0.0). 只有当 FTZ 位值在 MXCSR 中设置时,下流结果才会被冲到零. 否则会用操作数的符号正确处理(即正确的下流结果为写). 当一个源值是SNaN或QNaN时,将SNaN转换成QNaN或返回源QNaN.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

MXCSR例外旗帜不受本指令影响,浮点例外不报告.

** VRCP14PS/VRCP14SS 特殊情况**

| 0 | X | 2-128 | INF | 非常小的异常 |
| --- | --- | --- | --- | --- |
| -2- | 128 | X  -0 | -INF | 非常小的异常 |

## 行动

```text
VRCP14PS (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+31:i] := APPROXIMATE(1.0/SRC[31:0]);

                  ELSE DEST[i+31:i] := APPROXIMATE(1.0/SRC[i+31:i]);

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
```

## Intel C/C++ 内在编译器

```c
VRCP14PS __m512 _mm512_rcp14_ps( __m512 a);
VRCP14PS __m512 _mm512_mask_rcp14_ps(__m512 s, __mmask16 k, __m512 a);
VRCP14PS __m512 _mm512_maskz_rcp14_ps( __mmask16 k, __m512 a);
VRCP14PS __m256 _mm256_rcp14_ps( __m256 a);
VRCP14PS __m256 _mm512_mask_rcp14_ps(__m256 s, __mmask8 k, __m256 a);
VRCP14PS __m256 _mm512_maskz_rcp14_ps( __mmask8 k, __m256 a);
VRCP14PS __m128 _mm_rcp14_ps( __m128 a);
VRCP14PS __m128 _mm_mask_rcp14_ps(__m128 s, __mmask8 k, __m128 a);
VRCP14PS __m128 _mm_maskz_rcp14_ps( __mmask8 k, __m128 a);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51"E4类例外条件".
