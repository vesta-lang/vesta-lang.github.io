---
summary: 标量 双精度对等方形根
---

## 说明

计算第二源操作数(第三个操作数)中低浮点64值的对等方根,并将结果存储到目标操作数(第一个操作数). 对近似对等的平方根的评价,最大相对误差小于2^-28。 根据写掩码 k1,结果写入xmm1的低浮点64元素. 目的地的比特127:64从第一源操作数(第二个操作数)的相应比特复制.

如果任何源元素是NaN,则返回该元素的静态NaN源值。 负(非零)源号,以及 -,返回犬形NaN并设置无效旗帜(#I).

值为 -0 必须返回 - 并设置 DivByZero 旗 (# Z) 。 负数应返回NaN并设置无效的旗帜(# I). 但请注意, 指令将输入异常冲到相同标志的零, 因此负异常返回 - 并设置 DivByZero 旗 。

第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或64位的内存位置. 目标操作数是一个XMM登记册.

在https://software.intel.com/en-us/articles/for-IA-近似-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2上可以找到VRSQRT28xx的数值精确执行.

## 行动

```text
VRSQRT28SD (EVEX Encoded Versions)

IF k1[0] OR *no writemask* THEN

             DEST[63: 0] := (1.0/ SQRT(SRC[63: 0]));

ELSE

     IF *merging-masking*           ; merging-masking

           THEN *DEST[63: 0] remains unchanged*

           ELSE                     ; zeroing-masking

             DEST[63: 0] := 0

     FI;

FI;

ENDFOR;

DEST[127:64] := SRC1[127: 64]

DEST[MAXVL-1:128] := 0



                                 Table 8-8. VRSQRT28SD Special Cases

Input Value                  Result Value              Comments
NAN
X = 2-2n                     QNAN(input)               If (SRC = SNaN) then #I
X<0
X = -0 or negative denormal  2n
X = +0 or positive denormal
X = +INF                     QNaN_Indefinite           Including -INF

                             -INF                      #Z

                             +INF                      #Z

                             +0
```

## Intel C/C++ 内在编译器

```c
VRSQRT28SD __m128d _mm_rsqrt28_round_sd(__m128d a, __m128d b, int rounding);
VRSQRT28SD __m128d _mm_mask_rsqrt28_round_sd(__m128d s, __mmask8 m,__m128d a, __m128d b, int rounding);
VRSQRT28SD __m128d _mm_maskz_rsqrt28_round_sd( __mmask8 m,__m128d a, __m128d b, int rounding);
```

## SIMD 浮点 例外

无效( 如果 SNaN 输入), 乘以零 。

## 其他例外

见表2-49"E3类例外条件"。
