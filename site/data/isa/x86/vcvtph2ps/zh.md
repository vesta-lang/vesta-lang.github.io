---
summary: 将包装的 FP16 值转换为 单精度浮点
---

## 说明

本指令在源操作数(第二个操作数)的低序位中将打包的半精度(16位)浮点值转换为打包单精度浮点值,并将转换后的值写入目标操作数(第一个操作数).

如果出现异常操作数的情况,则返回正确的正常结果。 MXCSR.DAZ被忽略,被当成0对待. MXCSR没有异常例外报告。

VEX.128 版本 : 源操作数是一个XMM寄存器或64位内存位置. 目标操作数是一个XMM登记册. 对应目的地的上位(MAXVL-1:128)注册被清零.

VEX.256 版本 : 源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个YMM登记册. 对应目的地的比特(MAXVL-1:256)注册被清零.

EVEX 编码版本 : 源操作数是一个YMM/XMM/XMM(低64位)注册号,或256/128/64-bit 内存位置. 目标操作数是一个ZMM/YMM/XMM的登记册,有条件的更新有写掩码 k1.

下图说明数据如何从四个包装的半精度(以64位计)转换为四个单精度(以128位计)浮点值.

说明: VEX.vvvv和EVEX.vvvv是保留的(必须是1111b).

VCVTPH2PS xmm1, xmm2/mem64, imm8

```text
                 127            96 95              64 63       48 47             32 31       16 15             0
```

```text
                                                          VH3               VH2         VH1         VH0           xmm2/mem64
```

```text
                                                                                 convert     convert
```

```text
                       convert            convert
```

```text
                 127            96 95              64 63                    32 31                           0
```

VS0

```text
                       VS3                VS2                  VS1                                                xmm1
```

Figure 5-6. VCVTPH2PS (128-bit Version)

VCVTPH2PSX指令是PH到PS转换指令的一种新形式,在地图6中编码. 上一个版本的指令VCVTPH2PS,即AVX512F(在地图2,0F38中编码)不支持嵌入式广播. VCVTPH2PSX指令有嵌入式广播选项可用.

AVX512 FP16相关的指令总是句柄 FP16异常数输入;非正常输入不作为零处理.

## 行动

```text
vCvt_h2s(SRC1[15:0])
{
RETURN Cvt_Half_Precision_To_Single_Precision(SRC1[15:0]);
}

VCVTPH2PS (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

k := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] :=

             vCvt_h2s(SRC[k+15:k])

     ELSE

             IF *merging-masking*              ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                          ; zeroing-masking

                      DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VCVTPH2PS (VEX.256 Encoded Version)
DEST[31:0] := vCvt_h2s(SRC1[15:0]);
DEST[63:32] := vCvt_h2s(SRC1[31:16]);
DEST[95:64] := vCvt_h2s(SRC1[47:32]);
DEST[127:96] := vCvt_h2s(SRC1[63:48]);
DEST[159:128] := vCvt_h2s(SRC1[79:64]);
DEST[191:160] := vCvt_h2s(SRC1[95:80]);
DEST[223:192] := vCvt_h2s(SRC1[111:96]);
DEST[255:224] := vCvt_h2s(SRC1[127:112]);
DEST[MAXVL-1:256] := 0

VCVTPH2PS (VEX.128 Encoded Version)
DEST[31:0] := vCvt_h2s(SRC1[15:0]);
DEST[63:32] := vCvt_h2s(SRC1[31:16]);
DEST[95:64] := vCvt_h2s(SRC1[47:32]);
DEST[127:96] := vCvt_h2s(SRC1[63:48]);
DEST[MAXVL-1:128] := 0

VCVTPH2PSX DEST, SRC
VL = 128, 256, or 512
KL := VL/32

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *SRC is memory* and EVEX.b = 1:
                tsrc := SRC.fp16[0]
          ELSE
                tsrc := SRC.fp16[j]
          DEST.fp32[j] := Convert_fp16_to_fp32(tsrc)
    ELSE IF *zeroing*:
          DEST.fp32[j] := 0
    // else dest.fp32[j] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VCVTPH2PS __m512 _mm512_cvtph_ps( __m256i a);
VCVTPH2PS __m512 _mm512_mask_cvtph_ps(__m512 s, __mmask16 k, __m256i a);
VCVTPH2PS __m512 _mm512_maskz_cvtph_ps(__mmask16 k, __m256i a);
VCVTPH2PS __m512 _mm512_cvt_roundph_ps( __m256i a, int sae);
VCVTPH2PS __m512 _mm512_mask_cvt_roundph_ps(__m512 s, __mmask16 k, __m256i a, int sae);
VCVTPH2PS __m512 _mm512_maskz_cvt_roundph_ps( __mmask16 k, __m256i a, int sae);
VCVTPH2PS __m256 _mm256_mask_cvtph_ps(__m256 s, __mmask8 k, __m128i a);
VCVTPH2PS __m256 _mm256_maskz_cvtph_ps(__mmask8 k, __m128i a);
VCVTPH2PS __m128 _mm_mask_cvtph_ps(__m128 s, __mmask8 k, __m128i a);
VCVTPH2PS __m128 _mm_maskz_cvtph_ps(__mmask8 k, __m128i a);
VCVTPH2PS __m128 _mm_cvtph_ps ( __m128i m1);
VCVTPH2PS __m256 _mm256_cvtph_ps ( __m128i m1) VCVTPH2PSX __m512 _mm512_cvtx_roundph_ps (__m256h a, int sae);
VCVTPH2PSX __m512 _mm512_mask_cvtx_roundph_ps (__m512 src, __mmask16 k, __m256h a, int sae);
VCVTPH2PSX __m512 _mm512_maskz_cvtx_roundph_ps (__mmask16 k, __m256h a, int sae);
VCVTPH2PSX __m128 _mm_cvtxph_ps (__m128h a);
VCVTPH2PSX __m128 _mm_mask_cvtxph_ps (__m128 src, __mmask8 k, __m128h a);
VCVTPH2PSX __m128 _mm_maskz_cvtxph_ps (__mmask8 k, __m128h a);
VCVTPH2PSX __m256 _mm256_cvtxph_ps (__m128h a);
VCVTPH2PSX __m256 _mm256_mask_cvtxph_ps (__m256 src, __mmask8 k, __m128h a);
VCVTPH2PSX __m256 _mm256_maskz_cvtxph_ps (__mmask8 k, __m128h a);
VCVTPH2PSX __m512 _mm512_cvtxph_ps (__m256h a);
VCVTPH2PSX __m512 _mm512_mask_cvtxph_ps (__m512 src, __mmask16 k, __m256h a);
VCVTPH2PSX __m512 _mm512_maskz_cvtxph_ps (__mmask16 k, __m256h a);
```

## SIMD 浮点 例外

VEX 编码指令 : 无效。 EVEX 编码指令 : 无效。 EVEX-encoded 指令有广播(VCVTPH2PSX): 无效 异常

## 其他例外

VEX-encoded 指令,参见表2-26"11类例外条件"(不报告#AC).

EVEX-encoded 指令,参见表2-62,"Type E11 class Exception Centers".

EVEX-encoded discription with accessed (VCVTPH2PSX),参见表2-46,"Type E2 Class Exception Centers".

Additionally:     If VEX.W=1.

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
#UD
```
