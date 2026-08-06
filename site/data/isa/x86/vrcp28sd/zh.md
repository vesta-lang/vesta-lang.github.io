---
summary: 标量 双精度浮点 对等值
---

## 说明

计算第二源操作数(第三个操作数)中低浮64值的对等近似值,并将结果存储到目标操作数(第一个操作数). 对近似对等的评价为最大相对误差小于2^-28。 其结果根据写掩码 k1写成目标操作数低浮64元素. 目的地的比特127:64从第一源操作数(第二个操作数)的相应比特复制.

一个非正常输入值被作为零处理,不信号#DE,不管MXCSR.DAZ. 一个异常结果被冲到零,不信号#UE,不管MXCSR.FTZ.

如果任何源元素是NaN,则返回该元素的静态NaN源值。 如果任何源元素是+/-,则为该元素返回+/-0.0。 此外,如果任何源元素是+/-0.0,则为该元素返回+/-。

第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或64位的内存位置. 目标操作数是一个XMM的寄存器,有条件的更新使用写掩码 k1.

VRCP28xx的数值精确实施可在https://software.intel.com/en-us/articles/reference-improductions- for-IA-近似-instructions-vrcp14-vrcp28-vrsqrt28-vexp2.

## 行动

```text
VRCP28SD ((EVEX Encoded Versions)

IF k1[0] OR *no writemask* THEN

           DEST[63: 0] := RCP_28_DP(1.0/SRC2[63: 0]);

ELSE

      IF *merging-masking*                  ; merging-masking

           THEN *DEST[63: 0] remains unchanged*

           ELSE                             ; zeroing-masking

             DEST[63: 0] := 0

      FI;

FI;

ENDFOR;

DEST[127:64] := SRC1[127: 64]

DEST[MAXVL-1:128] := 0



                              Table 8-4. VRCP28SD Special Cases

Input Value      Result Value  Comments

NAN              QNAN(input)   If (SRC = SNaN) then #I
0  X < 2-1022
-2-1022 < X  -0  INF           Positive input denormal or zero; #Z
X > 21022
X < -21022       -INF          Negative input denormal or zero; #Z

X = +            +0.0f

X = -            -0.0f
X = 2-n
X = -2-n         +0.0f

                 -0.0f

                 2n            Exact result (unless input/output is a denormal)

                 -2n           Exact result (unless input/output is a denormal)
```

## Intel C/C++ 内在编译器

```c
VRCP28SD __m128d _mm_rcp28_round_sd ( __m128d a, __m128d b, int sae);
VRCP28SD __m128d _mm_mask_rcp28_round_sd(__m128d s, __mmask8 m, __m128d a, __m128d b, int sae);
VRCP28SD __m128d _mm_maskz_rcp28_round_sd(__mmask8 m, __m128d a, __m128d b, int sae);
```

## SIMD 浮点 例外

无效( 如果 SNaN 输入), 乘以零 。

## 其他例外

见表2-49"E3类例外条件"。
