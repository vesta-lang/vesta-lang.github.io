---
summary: 复制 单精度浮点 值
---

## 说明

复制奇异索引的单精度浮点值,从源操作符(第二个操作符)复制到目的地操作符(第一个操作符)中的相邻元素对. 见图4-3。 源操作数是一个XMM,YMM或ZMM的登记册或128,256或512位内存位置,目标操作数是一个XMM,YMM或ZMM的登记册.

128位遗产 SSE 版本 : 对应目的地的比特(MAXVL-1:128)注册保持不变.

VEX.128 编码版本 : 目的地的位数(MAXVL-1:128)登记被清零.

VEX.256 编码版本 : 目的地的比特(MAXVL-1:256)注册被清零.

EVEX 编码版本 : 目标操作数根据写掩码以32位颗粒性进行更新.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

```text
                         SRC  X7     X6                     X5        X4    X3       X2  X1             X0
```

```text
             DEST X7                 X7                     X5        X5    X3       X3  X1             X1
```

图4-3。 MOVSHDUP 操作

## 行动

```text
VMOVSHDUP (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

TMP_SRC[31:0] := SRC[63:32]

TMP_SRC[63:32] := SRC[63:32]

TMP_SRC[95:64] := SRC[127:96]

TMP_SRC[127:96] := SRC[127:96]

IF VL >= 256

     TMP_SRC[159:128] := SRC[191:160]

     TMP_SRC[191:160] := SRC[191:160]

     TMP_SRC[223:192] := SRC[255:224]

     TMP_SRC[255:224] := SRC[255:224]

FI;

IF VL >= 512

     TMP_SRC[287:256] := SRC[319:288]

     TMP_SRC[319:288] := SRC[319:288]

     TMP_SRC[351:320] := SRC[383:352]

     TMP_SRC[383:352] := SRC[383:352]

     TMP_SRC[415:384] := SRC[447:416]

     TMP_SRC[447:416] := SRC[447:416]

     TMP_SRC[479:448] := SRC[511:480]

     TMP_SRC[511:480] := SRC[511:480]

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_SRC[i+31:i]

          ELSE

                  IF *merging-masking*          ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                      ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VMOVSHDUP (VEX.256 Encoded Version)
DEST[31:0] := SRC[63:32]
DEST[63:32] := SRC[63:32]
DEST[95:64] := SRC[127:96]
DEST[127:96] := SRC[127:96]
DEST[159:128] := SRC[191:160]
DEST[191:160] := SRC[191:160]
DEST[223:192] := SRC[255:224]
DEST[255:224] := SRC[255:224]
DEST[MAXVL-1:256] := 0

VMOVSHDUP (VEX.128 Encoded Version)
DEST[31:0] := SRC[63:32]
DEST[63:32] := SRC[63:32]
DEST[95:64] := SRC[127:96]
DEST[127:96] := SRC[127:96]
DEST[MAXVL-1:128] := 0
MOVSHDUP (128-bit Legacy SSE Version)
DEST[31:0] := SRC[63:32]
DEST[63:32] := SRC[63:32]
DEST[95:64] := SRC[127:96]
DEST[127:96] := SRC[127:96]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VMOVSHDUP __m512 _mm512_movehdup_ps( __m512 a);
VMOVSHDUP __m512 _mm512_mask_movehdup_ps(__m512 s, __mmask16 k, __m512 a);
VMOVSHDUP __m512 _mm512_maskz_movehdup_ps( __mmask16 k, __m512 a);
VMOVSHDUP __m256 _mm256_mask_movehdup_ps(__m256 s, __mmask8 k, __m256 a);
VMOVSHDUP __m256 _mm256_maskz_movehdup_ps( __mmask8 k, __m256 a);
VMOVSHDUP __m128 _mm_mask_movehdup_ps(__m128 s, __mmask8 k, __m128 a);
VMOVSHDUP __m128 _mm_maskz_movehdup_ps( __mmask8 k, __m128 a);
VMOVSHDUP __m256 _mm256_movehdup_ps (__m256 a);
VMOVSHDUP __m128 _mm_movehdup_ps (__m128 a);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-编码指令,参见表2-52中的例外类型E4NF.nb,"Type E4NF类例外条件".

Additionally:

```text
#UD               If EVEX.vvvv != 1111B or VEX.vvvv != 1111B.
```
