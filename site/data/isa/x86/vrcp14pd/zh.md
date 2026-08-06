---
summary: 计算包装浮点64的相对数值
---

## 说明

本指令对源操作数(第二个操作数)中大约8/4/2的打包双精度浮点值进行SIMD计算,并将包装的双精度浮点结果存储在目标操作数中. 此近似值的最大相对误差小于2-14.

源操作数可以是ZMM寄存器,512位内存位置,也可以是从64位内存位置广播的512位矢量. 目标操作数是一个根据写掩码有条件更新的ZMM登记册.

VRCP14PD指令不受MXCSR寄存器中四舍五入控制位的影响. 当一个源值为0.0时,返回一个带有源值符号的值. 一个异常源值只有在 DAZ 位值设置在 MXCSR 时才会作为零处理. 否则它会被正确对待(即不作为0.0). 只有当 FTZ 位值在 MXCSR 中设置时,下流结果才会被冲到零. 否则会用操作数的符号正确处理(即正确的下流结果为写). 当一个源值是SNaN或QNaN时,将SNaN转换成QNaN或返回源QNaN.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

MXCSR例外旗帜不受本指令影响,浮点例外不报告.

** VRCP14PD/VRCP14SD 特殊情况**

| 0 | X | 2-1024 | INF | 非常小的异常 |
| --- | --- | --- | --- | --- |
| -2- | 102 | 4  X  -0 | -INF | 非常小的异常 |

## 行动

```text
VRCP14PD ((EVEX encoded versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+63:i] := APPROXIMATE(1.0/SRC[63:0]);

                  ELSE DEST[i+63:i] := APPROXIMATE(1.0/SRC[i+63:i]);

             FI;

ELSE

     IF *merging-masking*                ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                        ; zeroing-masking

                  DEST[i+63:i] := 0

     FI;

FI;

ENDFOR;
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VRCP14PD __m512d _mm512_rcp14_pd( __m512d a);
VRCP14PD __m512d _mm512_mask_rcp14_pd(__m512d s, __mmask8 k, __m512d a);
VRCP14PD __m512d _mm512_maskz_rcp14_pd( __mmask8 k, __m512d a);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51"E4类例外条件".
