---
summary: 打包单精度浮点值 对等
---

## 说明

计算源操作中浮点32值的对等近似值(第二行),并使用写入mask k1将结果存储到目的地操作(第一行). 在进行最后四舍五入前,对大约对等的误差进行不超过2^-28的最大相对误差评价。 最终结果在写入目的地前四舍五入为< 2^-23相对错误.

异常输入值作为零处理,不信号#DE,而不论MXCSR.DAZ. 异常结果被冲成零,不信号#UE,不管MXCSR.FTZ.

如果任何源元素是NaN,则返回该元素的静态NaN源值。 如果任何源元素是+/-,则为该元素返回+/-0.0。 此外,如果任何源元素是+/-0.0,则为该元素返回+/-。

源操作数是一个ZMM寄存器,512位内存位置,或512位矢量从32位内存位置广播. 目标操作数是一个ZMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

VRCP28xx的数值精确实施可在https://software.intel.com/en-us/articles/reference-improductions- for-IA-近似-instructions-vrcp14-vrcp28-vrsqrt28-vexp2.

## 行动

```text
VRCP28PS (EVEX Encoded Versions)
(KL, VL) = (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+31:i] := RCP_28_SP(1.0/SRC[31:0]);

                  ELSE DEST[i+31:i] := RCP_28_SP(1.0/SRC[i+31:i]);

             FI;

ELSE

     IF *merging-masking*               ; merging-masking

             THEN *DEST[i+31:i] remains unchanged*

             ELSE                       ; zeroing-masking

                  DEST[i+31:i] := 0

     FI;

FI;

ENDFOR;



                             Table 8-5. VRCP28PS Special Cases

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
VRCP28PS _mm512_rcp28_round_ps ( __m512 a, int sae);
VRCP28PS __m512 _mm512_mask_rcp28_round_ps(__m512 s, __mmask16 m, __m512 a, int sae);
VRCP28PS __m512 _mm512_maskz_rcp28_round_ps( __mmask16 m, __m512 a, int sae);
```

## SIMD 浮点 例外

无效( 如果 SNaN 输入), 乘以零 。

## 其他例外

见表2-48"E2类例外条件"。
