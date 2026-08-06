---
summary: 计算 标量 Float32 的平方根的对称性
---

## 说明

计算源操作数(第二个操作数)低双字元素中标量 单精度浮点值的平方根的近似对等值,并根据写掩码存储该结果的目标操作数(第一个操作数)低双字元素. 此近似的最大相对误差小于2-14. 源操作数可以是XMM寄存器,也可以是32位的内存位置. 目标操作数是一个XMM登记册.

XMM注册目的地的比特(127:32)从第一源操作数中的相应比特复制. 目的地的位数(MAXVL-1:128)登记被清零.

VRSQRT14SS指令不受MXCSR寄存器中四舍五入控制位的影响. 当一个源值为0.0时,返回一个带有源值符号的值. 当 源操作数 是 时,返回带有源值符号的零 。 一个异常源值只有在DAZ比特被设置在MXCSR时才作为零处理. 否则,它得到正确处理,并与规定的蒙面反应进行近似。 当一个源值为负值(除0.0)时,返回 浮点 无限期值。 当一个源值是SNaN或QNaN时,将SNaN转换成QNaN或返回源QNaN.

MXCSR例外旗帜不受本指令影响,浮点例外不报告.

在https://software.intel.com/en-us/articles/for-IA-近似-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2上可以找到VRSQRT14xx的数值精确执行.

## 行动

```text
VRSQRT14SS (EVEX version)

IF k1[0] or *no writemask*

     THEN DEST[31:0] := APPROXIMATE(1.0/ SQRT(SRC2[31:0]))

     ELSE

        IF *merging-masking*       ; merging-masking

             THEN *DEST[31:0] remains unchanged*

             ELSE                  ; zeroing-masking

             THEN DEST[31:0] := 0

        FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0


                      Table 5-35. VRSQRT14SS Special Cases

Input value   Result value     Comments
Any denormal
X = 2-2n      Normal           Cannot generate overflow
X<0           2n
X = -0
X = +0        QNaN_Indefinite  Including -INF
X = +INF
              -INF

              +INF

              +0
```

## Intel C/C++ 内在编译器

```c
VRSQRT14SS __m128 _mm_rsqrt14_ss( __m128 a, __m128 b);
VRSQRT14SS __m128 _mm_mask_rsqrt14_ss(__m128 s, __mmask8 k, __m128 a, __m128 b);
VRSQRT14SS __m128 _mm_maskz_rsqrt14_ss( __mmask8 k, __m128 a, __m128 b);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-53"E5类例外条件".
