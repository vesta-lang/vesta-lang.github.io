---
summary: 单精度浮点 值的平方根
---

## 说明

执行 SIMD 计算 源操作数(第二个 操作数)中四,八或十六个 打包单精度浮点值 的平方根,将包装的 单精度浮点 结果存储在 目标操作数 中.

EVEX.512 编码版本 : 源操作数是一个ZMM/YMM/XMM的登记器,一个512/256/128位内存位置或512/256/128位矢量从32位内存位置广播. 目标操作数是一个按照写掩码更新的ZMM/YMM/XMM登记册.

VEX.256 编码版本 : 源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:256).

VEX.128编码版本:源操作数 第二源操作数或128位内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(ZMM注册点)没有修改.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VSQRTPS (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1) AND (SRC *is register*)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask* THEN

                  IF (EVEX.b = 1) AND (SRC *is memory*)

                       THEN DEST[i+31:i] := SQRT(SRC[31:0])

                       ELSE DEST[i+31:i] := SQRT(SRC[i+31:i])

                  FI;

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSQRTPS (VEX.256 Encoded Version)
DEST[31:0] := SQRT(SRC[31:0])
DEST[63:32] := SQRT(SRC[63:32])
DEST[95:64] := SQRT(SRC[95:64])
DEST[127:96] := SQRT(SRC[127:96])
DEST[159:128] := SQRT(SRC[159:128])
DEST[191:160] := SQRT(SRC[191:160])
DEST[223:192] := SQRT(SRC[223:192])
DEST[255:224] := SQRT(SRC[255:224])

VSQRTPS (VEX.128 Encoded Version)
DEST[31:0] := SQRT(SRC[31:0])
DEST[63:32] := SQRT(SRC[63:32])
DEST[95:64] := SQRT(SRC[95:64])
DEST[127:96] := SQRT(SRC[127:96])
DEST[MAXVL-1:128] := 0

SQRTPS (128-bit Legacy SSE Version)
DEST[31:0] := SQRT(SRC[31:0])
DEST[63:32] := SQRT(SRC[63:32])
DEST[95:64] := SQRT(SRC[95:64])
DEST[127:96] := SQRT(SRC[127:96])
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VSQRTPS __m512 _mm512_sqrt_round_ps(__m512 a, int r);
VSQRTPS __m512 _mm512_mask_sqrt_round_ps(__m512 s, __mmask16 k, __m512 a, int r);
VSQRTPS __m512 _mm512_maskz_sqrt_round_ps( __mmask16 k, __m512 a, int r);
VSQRTPS __m256 _mm256_sqrt_ps (__m256 a);
VSQRTPS __m256 _mm256_mask_sqrt_ps(__m256 s, __mmask8 k, __m256 a, int r);
VSQRTPS __m256 _mm256_maskz_sqrt_ps( __mmask8 k, __m256 a, int r);
SQRTPS __m128 _mm_sqrt_ps (__m128 a);
VSQRTPS __m128 _mm_mask_sqrt_ps(__m128 s, __mmask8 k, __m128 a, int r);
VSQRTPS __m128 _mm_maskz_sqrt_ps( __mmask8 k, __m128 a, int r);
```

## SIMD 浮点 例外

Invalid, Precision, Denormal.

## 其他例外

Non-EVEX-encoded discription,参见表2-19,"第2类例外条件",另外:

```text
#UD               If VEX.vvvv != 1111B.
```

EVEX-encoded discription,参见表2-48,"Type E2类例外条件",另外还有:

```text
#UD               If EVEX.vvvv != 1111B.
```
