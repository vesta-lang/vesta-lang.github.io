---
summary: 复制 双精度浮点 值
---

## 说明

对于256位或更高版本: 复制从源操作(第二操作)到相邻对并存储到目的地操作(第一操作)的偶数索引双精度浮点值.

对于128位版本: 复制源操作数(第二个操作数)的低值双精度浮点,存储到目标操作数(第一个操作数).

128位遗产 SSE 版本 : 相应的目的地登记册中的位数(MAXVL-1:128)不变. 源操作数是XMM的寄存器或64位的内存位置.

VEX.128和EVEX.128编码版本: 目的地的位数(MAXVL-1:128)登记被清零. 源操作数是XMM的寄存器或64位的内存位置. 目的地在写掩码为EVEX版本下有条件更新.

VEX.256和EVEX.256编码版本: 目的地的比特(MAXVL-1:256)注册被清零. 源操作数是YMM的寄存器或256位的内存位置. 目的地在写掩码为EVEX版本下有条件更新.

EVEX.512 编码版本 : 目的地根据写掩码更新. 源操作数是ZMM的寄存器或512位内存位置.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

```text
                            SRC          X3                  X2    X1           X0
```

```text
                            DEST         X2                  X2    X0           X0
```

图4-2. VMOVDDUP 操作

## 行动

```text
VMOVDDUP (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

TMP_SRC[63:0] := SRC[63:0]

TMP_SRC[127:64] := SRC[63:0]

IF VL >= 256

     TMP_SRC[191:128] := SRC[191:128]

     TMP_SRC[255:192] := SRC[191:128]

FI;

IF VL >= 512

     TMP_SRC[319:256] := SRC[319:256]

     TMP_SRC[383:320] := SRC[319:256]

     TMP_SRC[477:384] := SRC[477:384]

     TMP_SRC[511:484] := SRC[477:384]

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_SRC[i+63:i]

          ELSE

                  IF *merging-masking*          ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                      ; zeroing-masking

                      DEST[i+63:i] := 0         ; zeroing-masking

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVDDUP (VEX.256 Encoded Version)
DEST[63:0] := SRC[63:0]
DEST[127:64] := SRC[63:0]
DEST[191:128] := SRC[191:128]
DEST[255:192] := SRC[191:128]
DEST[MAXVL-1:256] := 0

VMOVDDUP (VEX.128 Encoded Version)
DEST[63:0] := SRC[63:0]
DEST[127:64] := SRC[63:0]
DEST[MAXVL-1:128] := 0


MOVDDUP (128-bit Legacy SSE Version)
DEST[63:0] := SRC[63:0]
DEST[127:64] := SRC[63:0]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VMOVDDUP __m512d _mm512_movedup_pd( __m512d a);
VMOVDDUP __m512d _mm512_mask_movedup_pd(__m512d s, __mmask8 k, __m512d a);
VMOVDDUP __m512d _mm512_maskz_movedup_pd( __mmask8 k, __m512d a);
VMOVDDUP __m256d _mm256_mask_movedup_pd(__m256d s, __mmask8 k, __m256d a);
VMOVDDUP __m256d _mm256_maskz_movedup_pd( __mmask8 k, __m256d a);
VMOVDDUP __m128d _mm_mask_movedup_pd(__m128d s, __mmask8 k, __m128d a);
VMOVDDUP __m128d _mm_maskz_movedup_pd( __mmask8 k, __m128d a);
MOVDDUP __m256d _mm256_movedup_pd (__m256d a);
MOVDDUP __m128d _mm_movedup_pd (__m128d a);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-22,"第5类例外条件".

EVEX-encoded discription,参见表2-54"Type E5NF类例外条件".

Additionally:

```text
#UD               If EVEX.vvvv != 1111B or VEX.vvvv != 1111B.
```
