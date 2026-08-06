---
summary: 复制 单精度浮点 值
---

## 说明

从 源操作数 (第二个 操作数) 复制到偶数索引的 单精度浮点 值 。 见图4-4。 源操作数是一个XMM,YMM或ZMM的登记册或128,256或512位内存位置,目标操作数是一个XMM,YMM或ZMM的登记册. 128位的Legacy SSE版本: 对应目的地的比特(MAXVL-1:128)注册保持不变. VEX.128 编码版本 : 目的地的位数(MAXVL-1:128)登记被清零. VEX.256 编码版本 : 目的地的比特(MAXVL-1:256)注册被清零. EVEX 编码版本 : 目标操作数根据写掩码以32位颗粒性进行更新. 说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

```text
                         SRC  X7     X6                     X5        X4    X3   X2  X1                 X0
```

```text
             DEST X6                 X6                     X4        X4    X2   X2  X0                 X0
```

图4-4 MOVSLDUP 操作

## 行动

```text
VMOVSLDUP (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

TMP_SRC[31:0] := SRC[31:0]

TMP_SRC[63:32] := SRC[31:0]

TMP_SRC[95:64] := SRC[95:64]

TMP_SRC[127:96] := SRC[95:64]

IF VL >= 256

     TMP_SRC[159:128] := SRC[159:128]

     TMP_SRC[191:160] := SRC[159:128]

     TMP_SRC[223:192] := SRC[223:192]

     TMP_SRC[255:224] := SRC[223:192]

FI;

IF VL >= 512

     TMP_SRC[287:256] := SRC[287:256]

     TMP_SRC[319:288] := SRC[287:256]

     TMP_SRC[351:320] := SRC[351:320]

     TMP_SRC[383:352] := SRC[351:320]

     TMP_SRC[415:384] := SRC[415:384]

     TMP_SRC[447:416] := SRC[415:384]

     TMP_SRC[479:448] := SRC[479:448]

     TMP_SRC[511:480] := SRC[479:448]

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


VMOVSLDUP (VEX.256 Encoded Version)
DEST[31:0] := SRC[31:0]
DEST[63:32] := SRC[31:0]
DEST[95:64] := SRC[95:64]
DEST[127:96] := SRC[95:64]
DEST[159:128] := SRC[159:128]
DEST[191:160] := SRC[159:128]
DEST[223:192] := SRC[223:192]
DEST[255:224] := SRC[223:192]
DEST[MAXVL-1:256] := 0

VMOVSLDUP (VEX.128 Encoded Version)
DEST[31:0] := SRC[31:0]
DEST[63:32] := SRC[31:0]
DEST[95:64] := SRC[95:64]
DEST[127:96] := SRC[95:64]
DEST[MAXVL-1:128] := 0
MOVSLDUP (128-bit Legacy SSE Version)
DEST[31:0] := SRC[31:0]
DEST[63:32] := SRC[31:0]
DEST[95:64] := SRC[95:64]
DEST[127:96] := SRC[95:64]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VMOVSLDUP __m512 _mm512_moveldup_ps( __m512 a);
VMOVSLDUP __m512 _mm512_mask_moveldup_ps(__m512 s, __mmask16 k, __m512 a);
VMOVSLDUP __m512 _mm512_maskz_moveldup_ps( __mmask16 k, __m512 a);
VMOVSLDUP __m256 _mm256_mask_moveldup_ps(__m256 s, __mmask8 k, __m256 a);
VMOVSLDUP __m256 _mm256_maskz_moveldup_ps( __mmask8 k, __m256 a);
VMOVSLDUP __m128 _mm_mask_moveldup_ps(__m128 s, __mmask8 k, __m128 a);
VMOVSLDUP __m128 _mm_maskz_moveldup_ps( __mmask8 k, __m128 a);
VMOVSLDUP __m256 _mm256_moveldup_ps (__m256 a);
VMOVSLDUP __m128 _mm_moveldup_ps (__m128 a);
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
