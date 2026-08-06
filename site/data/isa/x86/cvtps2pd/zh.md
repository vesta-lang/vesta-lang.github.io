---
summary: 将 打包单精度浮点值 转换为包装的双精度
---

## 说明

将 源操作数(第二个操作数)中的2,4或8个打包单精度浮点值转换为 目标操作数(第一个操作数)中的2,4或8个打包双精度浮点值.

EVEX 编码版本 : 源操作数是一个YMM/XMM/XMM(低64位)的注册,一个256/128/64位的内存位置或一个256/128/64位的向量从32位的内存位置广播. 目标操作数是一个ZMM/YMM/XMM的登记册,有条件的更新有写掩码 k1.

VEX.256 编码版本 : 源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个YMM登记册. 对应目的地ZMM的比特(MAXVL-1:256)登记被清零.

VEX.128 编码版本 : 源操作数是一个XMM寄存器或64位内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位数(MAXVL-1:128).

128位遗产 SSE 版本 : 源操作数是一个XMM寄存器或64位内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地的上位数(MAXVL-1:128)没有修改.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

```text
                 SRC                                    X3        X2   X1                     X0
```

```text
                 DEST  X3                X2                 X1                            X0
```

图3-9. CVTPS2PD(VEX.256编码版本)

## 行动

```text
VCVTPS2PD (EVEX Encoded Versions) When SRC Operand is a Register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

k := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] :=

             Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[k+31:k])

     ELSE

             IF *merging-masking*        ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                    ; zeroing-masking

                      DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VCVTPS2PD (EVEX Encoded Versions) When SRC Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1
    i := j * 64
    k := j * 32
    IF k1[j] OR *no writemask*
          THEN
                IF (EVEX.b = 1)
                      THEN
                            DEST[i+63:i] :=
                Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[31:0])
                      ELSE
                            DEST[i+63:i] :=
                Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[k+31:k])
                FI;
          ELSE


        IF *merging-masking*         ; merging-masking

               THEN *DEST[i+63:i] remains unchanged*

               ELSE                  ; zeroing-masking

                  DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VCVTPS2PD (VEX.256 Encoded Version)
DEST[63:0] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[31:0])
DEST[127:64] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[63:32])
DEST[191:128] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[95:64])
DEST[255:192] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[127:96)
DEST[MAXVL-1:256] := 0

VCVTPS2PD (VEX.128 Encoded Version)
DEST[63:0] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[31:0])
DEST[127:64] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[63:32])
DEST[MAXVL-1:128] := 0

CVTPS2PD (128-bit Legacy SSE Version)
DEST[63:0] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[31:0])
DEST[127:64] := Convert_Single_Precision_To_Double_Precision_Floating_Point(SRC[63:32])
DEST[MAXVL-1:128] (unmodified)
```

## Intel C/C++ 内在编译器

```c
VCVTPS2PD __m512d _mm512_cvtps_pd( __m256 a);
VCVTPS2PD __m512d _mm512_mask_cvtps_pd( __m512d s, __mmask8 k, __m256 a);
VCVTPS2PD __m512d _mm512_maskz_cvtps_pd( __mmask8 k, __m256 a);
VCVTPS2PD __m512d _mm512_cvt_roundps_pd( __m256 a, int sae);
VCVTPS2PD __m512d _mm512_mask_cvt_roundps_pd( __m512d s, __mmask8 k, __m256 a, int sae);
VCVTPS2PD __m512d _mm512_maskz_cvt_roundps_pd( __mmask8 k, __m256 a, int sae);
VCVTPS2PD __m256d _mm256_mask_cvtps_pd( __m256d s, __mmask8 k, __m128 a);
VCVTPS2PD __m256d _mm256_maskz_cvtps_pd( __mmask8 k, __m128a);
VCVTPS2PD __m128d _mm_mask_cvtps_pd( __m128d s, __mmask8 k, __m128 a);
VCVTPS2PD __m128d _mm_maskz_cvtps_pd( __mmask8 k, __m128 a);
VCVTPS2PD __m256d _mm256_cvtps_pd (__m128 a) CVTPS2PD __m128d _mm_cvtps_pd (__m128 a);
```

## SIMD 浮点 例外

Invalid, Denormal.

## 其他例外

VEX-encoded指令,参见表2-20"第3类例外条件".

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".

Additionally:          If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.

```text
#UD
```
