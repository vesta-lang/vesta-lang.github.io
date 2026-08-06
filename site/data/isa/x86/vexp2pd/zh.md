---
summary: 近似包装 双精度浮点 的标志 2^x
---

## 说明

计算源操作数(第二个操作数)中双精度浮点值的大约基数-2指数评价,并利用写掩码 k1将结果存储到目标操作数(第一个操作数). 估计基数-2指数的相对误差小于2^-23。

异常输入值作为零处理,不信号#DE,而不论MXCSR.DAZ. 异常结果被冲成零,不信号#UE,不管MXCSR.FTZ.

源操作数是一个ZMM寄存器,512位内存位置或512位矢量从64位内存位置广播. 目标操作数是一个ZMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

VEXP2xx在数字上的具体实施可参见https://software.intel.com/en-us/articles/reference-improductions- for-IA-近似-instructions-vrcp14-vrcp28-vrsqrt28-vexp2.

## 行动

```text
VEXP2PD

(KL, VL) = (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+63:i] := EXP2_23_DP(SRC[63:0])

                  ELSE DEST[i+63:i] := EXP2_23_DP(SRC[i+63:i])

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+63:i] := 0

     FI;

FI;

ENDFOR;



Source Input                   Table 8-1. Special Values Behavior  Comments
NaN               Result                                           If (SRC = SNaN) then #I
+                 QNaN(src)
+/-0              +                                                Exact result
-                 1.0f
Integral value N  +0.0f                                            Exact result
                  2^ (N)
```

## Intel C/C++ 内在编译器

```c
VEXP2PD __m512d _mm512_exp2a23_round_pd (__m512d a, int sae);
VEXP2PD __m512d _mm512_mask_exp2a23_round_pd (__m512d a, __mmask8 m, __m512d b, int sae);
VEXP2PD __m512d _mm512_maskz_exp2a23_round_pd ( __mmask8 m, __m512d b, int sae);
```

## SIMD 浮点 例外

无效( 如果 SNaN 输入) , 重叠 。

## 其他例外

见表2-48"E2类例外条件"。
