---
summary: 将包装的双字整数转换为包装的 双精度浮点
---

## 说明

将源操作(第二行)中的2,4或8个已打包的签名双字整数转换为2,4或8个已打包的双精度浮点值 目的地操作(第一行).

EVEX 编码版本 : 源操作数可以是YMM/XMM/XMM(低64位)寄存器,256/128/64位内存位置或256/128/64位向量从32位内存位置广播. 目标操作数是一个ZMM/YMM/XMM的登记册,有条件的更新有写掩码 k1. 试图用 EVEX 嵌入四舍五入编码此指令被忽略 。

VEX.256 编码版本 : 源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个YMM登记册.

VEX.128 编码版本 : 源操作数是一个XMM寄存器或64位内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位数(MAXVL-1:128).

128位遗产 SSE 版本 : 源操作数是一个XMM寄存器或64位内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地的上位数(MAXVL-1:128)没有修改.

VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

```text
                        SRC                                     X3              X2             X1      X0
```

```text
                        DEST             X3              X2                 X1                     X0
```

图3-6。 CVTDQ2PD(VEX.256编码版本)

## 行动

```text
VCVTDQ2PD (EVEX Encoded Versions) When SRC Operand is a Register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

k := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] :=

             Convert_Integer_To_Double_Precision_Floating_Point(SRC[k+31:k])

     ELSE

             IF *merging-masking*            ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                       ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VCVTDQ2PD (EVEX Encoded Versions) When SRC Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

k := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1)

                  THEN

                    DEST[i+63:i] :=

             Convert_Integer_To_Double_Precision_Floating_Point(SRC[31:0])

                  ELSE

                    DEST[i+63:i] :=

             Convert_Integer_To_Double_Precision_Floating_Point(SRC[k+31:k])

             FI;

     ELSE

             IF *merging-masking*            ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                       ; zeroing-masking


                            DEST[i+63:i] := 0
                FI
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VCVTDQ2PD (VEX.256 Encoded Version)
DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[31:0])
DEST[127:64] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[63:32])
DEST[191:128] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[95:64])
DEST[255:192] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[127:96)
DEST[MAXVL-1:256] := 0

VCVTDQ2PD (VEX.128 Encoded Version)
DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[31:0])
DEST[127:64] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[63:32])
DEST[MAXVL-1:128] := 0

CVTDQ2PD (128-bit Legacy SSE Version)
DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[31:0])
DEST[127:64] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[63:32])
DEST[MAXVL-1:128] (unmodified)
```

## Intel C/C++ 内在编译器

```c
VCVTDQ2PD __m512d _mm512_cvtepi32_pd( __m256i a);
VCVTDQ2PD __m512d _mm512_mask_cvtepi32_pd( __m512d s, __mmask8 k, __m256i a);
VCVTDQ2PD __m512d _mm512_maskz_cvtepi32_pd( __mmask8 k, __m256i a);
VCVTDQ2PD __m256d _mm256_cvtepi32_pd (__m128i src);
VCVTDQ2PD __m256d _mm256_mask_cvtepi32_pd( __m256d s, __mmask8 k, __m256i a);
VCVTDQ2PD __m256d _mm256_maskz_cvtepi32_pd( __mmask8 k, __m256i a);
VCVTDQ2PD __m128d _mm_mask_cvtepi32_pd( __m128d s, __mmask8 k, __m128i a);
VCVTDQ2PD __m128d _mm_maskz_cvtepi32_pd( __mmask8 k, __m128i a);
CVTDQ2PD __m128d _mm_cvtepi32_pd (__m128i src);
```

## 其他例外

VEX-encoded指令,参见表2-22,"第5类例外条件".

EVEX-encoded指令,参见表2-53,"Type E5类例外条件".

Additionally:

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```
