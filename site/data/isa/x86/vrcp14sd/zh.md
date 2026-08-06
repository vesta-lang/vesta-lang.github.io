---
summary: 计算 标量 浮点数的相对值64
---

## 说明

本指令对第二源操作数(第三个操作数)中低双精度浮点值的近似对等值进行SIMD计算,根据写掩码 k1(第一个操作数)将结果存储为目标操作数(第一个操作数)的低四字元素. XMM注册目的地的比特(127:64)从第一源操作数(第二个操作数)中的相应比特复制. 此近似的最大相对误差小于2-14. 源操作数可以是XMM的寄存器,也可以是64位的内存位置. 目标操作数是一个XMM登记册.

VRCP14SD指令不受MXCSR寄存器中四舍五入控制位的影响. 当一个源值为0.0时,返回一个带有源值符号的值. 一个异常源值只有在 DAZ 位值设置在 MXCSR 时才会作为零处理. 否则它会被正确对待(即不作为0.0). 只有当 FTZ 位值在 MXCSR 中设置时,下流结果才会被冲到零. 否则会用操作数的符号正确处理(即正确的下流结果为写). 当一个源值是SNaN或QNaN时,将SNaN转换成QNaN或返回源QNaN. 特殊情况输入值见表5-24。

MXCSR例外旗帜不受本指令影响,浮点例外不报告.

VRCP14xx在数字上的具体执行情况见:

https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2.

## 行动

```text
VRCP14SD (EVEX version)

IF k1[0] OR *no writemask*

       THEN DEST[63:0] := APPROXIMATE(1.0/SRC2[63:0]);

     ELSE

       IF *merging-masking*      ; merging-masking

            THEN *DEST[63:0] remains unchanged*

            ELSE                 ; zeroing-masking

             DEST[63:0] := 0

       FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VRCP14SD __m128d _mm_rcp14_sd( __m128d a, __m128d b);
VRCP14SD __m128d _mm_mask_rcp14_sd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VRCP14SD __m128d _mm_maskz_rcp14_sd( __mmask8 k, __m128d a, __m128d b);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-53"E5类例外条件".
