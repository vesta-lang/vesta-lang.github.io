---
summary: 标量 单精度浮点 对等值
---

## 说明

计算第二源操作数(第三个操作数)中低浮32值的对等近似值,并将结果存储到目标操作数(第一个操作数). 在进行最后四舍五入前,对大约对等的误差进行不超过2^-28的最大相对误差评价。 最终结果在按照写掩码 k1写入目的地低浮32元素之前,四舍五入为< 2^-23相对错误. 目的地的比特127:32从第一源操作数(第二个操作数)的相应比特复制.

一个非正常输入值被作为零处理,不信号#DE,不管MXCSR.DAZ. 一个异常结果被冲到零,不信号#UE,不管MXCSR.FTZ.

如果任何源元素是NaN,则返回该元素的静态NaN源值。 如果任何源元素是+/-,则为该元素返回+/-0.0。 此外,如果任何源元素是+/-0.0,则为该元素返回+/-。

第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或32位的内存位置. 目标操作数是一个XMM的寄存器,有条件的更新使用写掩码 k1.

VRCP28xx的数值精确实施可在https://software.intel.com/en-us/articles/reference-improductions- for-IA-近似-instructions-vrcp14-vrcp28-vrsqrt28-vexp2.

## 行动

```text
VRCP28SS ((EVEX Encoded Versions)

IF k1[0] OR *no writemask* THEN

           DEST[31: 0] := RCP_28_SP(1.0/SRC2[31: 0]);

ELSE

      IF *merging-masking*          ; merging-masking

           THEN *DEST[31: 0] remains unchanged*

           ELSE                     ; zeroing-masking

             DEST[31: 0] := 0

      FI;

FI;

ENDFOR;

DEST[127:32] := SRC1[127: 32]

DEST[MAXVL-1:128] := 0



                              Table 8-6. VRCP28SS Special Cases

Input Value     Result Value  Comments

NAN             QNAN(input)   If (SRC = SNaN) then #I
0  X < 2-126
-2-126 < X  -0  INF           Positive input denormal or zero; #Z
X > 2126
X < -2126       -INF          Negative input denormal or zero; #Z

X = +           +0.0f

X = -           -0.0f
X = 2-n
X = -2-n        +0.0f

                -0.0f

                2n            Exact result (unless input/output is a denormal)

                -2n           Exact result (unless input/output is a denormal)
```

## Intel C/C++ 内在编译器

```c
VRCP28SS __m128 _mm_rcp28_round_ss ( __m128 a, __m128 b, int sae);
VRCP28SS __m128 _mm_mask_rcp28_round_ss(__m128 s, __mmask8 m, __m128 a, __m128 b, int sae);
VRCP28SS __m128 _mm_maskz_rcp28_round_ss(__mmask8 m, __m128 a, __m128 b, int sae);
```

## SIMD 浮点 例外

无效( 如果 SNaN 输入), 乘以零 。

## 其他例外

见表2-49"E3类例外条件"。
