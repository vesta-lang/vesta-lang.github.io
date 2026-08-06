---
summary: 类似包装双精度的对等方形根
---

## 说明

计算源操作数(第二个操作数)中浮点64值的对等方根,并将结果存储到目标操作数(第一个操作数). 对近似对等的评价为最大相对误差小于2^-28。

如果任何源元素是NaN,则返回该元素的静态NaN源值。 负(非零)源号,以及 -,返回犬形NaN并设置无效旗帜(#I). 值为 -0 必须返回 - 并设置 DivByZero 旗 (# Z) 。 负数应返回NaN并设置无效的旗帜(# I). 但请注意, 指令将输入异常冲到相同标志的零, 因此负异常返回 - 并设置 DivByZero 旗 。

源操作数是一个ZMM寄存器,512位内存位置或512位矢量从64位内存位置广播. 目标操作数是一个ZMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

在https://software.intel.com/en-us/articles/for-IA-近似-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2上可以找到VRSQRT28xx的数值精确执行.

## 行动

```text
VRSQRT28PD (EVEX Encoded Versions)

(KL, VL) = (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+63:i] := (1.0/ SQRT(SRC[63:0]));

                  ELSE DEST[i+63:i] := (1.0/ SQRT(SRC[i+63:i]));

             FI;

ELSE

       IF *merging-masking*               ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+63:i] := 0

       FI;

FI;

ENDFOR;



                                 Table 8-7. VRSQRT28PD Special Cases

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
VRSQRT28PD __m512d _mm512_rsqrt28_round_pd(__m512d a, int sae);
VRSQRT28PD __m512d _mm512_mask_rsqrt28_round_pd(__m512d s, __mmask8 m,__m512d a, int sae);
VRSQRT28PD __m512d _mm512_maskz_rsqrt28_round_pd(__mmask8 m,__m512d a, int sae);
```

## SIMD 浮点 例外

无效( 如果 SNaN 输入), 乘以零 。

## 其他例外

见表2-48"E2类例外条件"。
