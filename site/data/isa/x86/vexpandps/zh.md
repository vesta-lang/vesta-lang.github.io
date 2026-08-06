---
summary: 从 Dense 内存装入 Sparse 打包单精度浮点值
---

## 说明

将 源操作数(第二个操作数)中输入矢量的值扩展至16/8/4,毗连,单精度浮点扩展至目标操作数(第一个操作数)的稀疏元素,由写掩码 k1选择.

目标操作数是一个ZMM/YMM/XMM登记册,源操作数可以是ZMM/YMM/XMM登记册或512/256/128-bit 内存位置.

输入矢量从 源操作数 中的最低元素开始. 写掩码 k1选择目的地元素(如果小于16个元素,则选择部分矢量或稀释元素),由输入矢量中的上升元素取代. 未被 写掩码 k1 选择的目标元素不是未修改就是零,这取决于 EVEX.z.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

注意压缩的移位假设一个预缩放(N)与单个元素的大小相对应,而不是全向量的大小.

## 行动

```text
VEXPANDPS (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

k := 0

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

        THEN

             DEST[i+31:i] := SRC[k+31:k];

             k := k + 32

        ELSE

             IF *merging-masking*          ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                      ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VEXPANDPS __m512 _mm512_mask_expand_ps( __m512 s, __mmask16 k, __m512 a);
VEXPANDPS __m512 _mm512_maskz_expand_ps( __mmask16 k, __m512 a);
VEXPANDPS __m512 _mm512_mask_expandloadu_ps( __m512 s, __mmask16 k, void * a);
VEXPANDPS __m512 _mm512_maskz_expandloadu_ps( __mmask16 k, void * a);
VEXPANDPD __m256 _mm256_mask_expand_ps( __m256 s, __mmask8 k, __m256 a);
VEXPANDPD __m256 _mm256_maskz_expand_ps( __mmask8 k, __m256 a);
VEXPANDPD __m256 _mm256_mask_expandloadu_ps( __m256 s, __mmask8 k, void * a);
VEXPANDPD __m256 _mm256_maskz_expandloadu_ps( __mmask8 k, void * a);
VEXPANDPD __m128 _mm_mask_expand_ps( __m128 s, __mmask8 k, __m128 a);
VEXPANDPD __m128 _mm_maskz_expand_ps( __mmask8 k, __m128 a);
VEXPANDPD __m128 _mm_mask_expandloadu_ps( __m128 s, __mmask8 k, void * a);
VEXPANDPD __m128 _mm_maskz_expandloadu_ps( __mmask8 k, void * a);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51中的例外类型E4.nb,"类型E4类例外条件".

Additionally:

```text
#UD                       If EVEX.vvvv != 1111B.
```

VEXTRACTF128/VEX TRACTF32x4/VEX TRACTF64x2/VEX TRACTF32x8/VEX TRACTF64x4-提取包装的浮点值

操作码/ Op/ 64/32 CPUID 特性描述指令 En Bit模式旗帜支持

VEX.256.66.0F3A.W0 19 /r ib A V/V AVX 从ymm2提取128位包装的浮点值,存储结果为xmm1/m128. VEXTRACTF128 xmm1/m128, ymm2, (中文(简体) ).

imm8

EVEX.256.66.0F3A.W0 19 /r ib C V/V (AVX512VL AND) 提取128位包装单精度

```text
                                              AVX512F) OR          floating-point values from ymm2 and store
```

VEXTRACTF32X4 xmm1/m128 {k1}{z},

```text
                                              AVX10.1              results in xmm1/m128 subject to writemask k1.
```

ymm2, imm8

EVEX.512.66.0F3A.W0 19 /r ib C V/V AVX512F 提取128位包装单精度

```text
                                              OR AVX10.1           floating-point values from zmm2 and store
```

VEXTRACTF32x4 xmm1/m128 {k1}{z},                                   results in xmm1/m128 subject to writemask k1.

zmm2, imm8

EVEX.256.66.0F3A.W1 19 /r ib B V/V (AVX512VL AND) 提取 128 位包装双精度

VEXTRACTF64X2 xmm1/m128 {k1}{z}, AVX512DQ) OR 浮点值 从ymm2并存储

```text
                                              AVX10.1              results in xmm1/m128 subject to writemask k1.
```

ymm2, imm8

EVEX.512.66.0F3A.W119(r) ib B V/VAVX512DQ提取128位包装双精度 ORAVX10.1 VEXTRACTF64X2 xmm1/m128 {k1}{z}, 浮点值从zmm2并存储结果xmm1/m128须遵守写掩码 k1. zmm2, imm8

EVEX.512.66.0F3A.W0 1B /r ib D V/V AVX512DQ 提取256位包装单精度

```text
                                              OR AVX10.1           floating-point values from zmm2 and store
```

VEXTRACTF32X8 ymm1/m256 {k1}{z}, results in ymm1/m256 subject to writemask k1. zmm2, imm8

EVEX.512.66.0F3A.W1 1B /r ib C V/V AVX512F 抽取256位包装双精度

```text
                                              OR AVX10.1           floating-point values from zmm2 and store
```

VEXTRACTF64x4 ymm1/m256 {k1}{z},                                   results in ymm1/m256 subject to writemask k1.

zmm2, imm8

## 说明

VEXTRACTF128/VEXTRACTF32x4和VEXTRACTF64x2从源操作数(第二个操作数)提取128位的单精度浮点值,存储到目标操作数(第一个操作数)的128位. 128位数据提取发生在imm8[0](256-bit)或imm8[1:0]指定的128位颗粒偏移时,作为乘数系数. 目的地可以是矢量寄存器或128位内存位置.

VEXTRACTF32x4: (英语). 目标操作数的低128位根据写掩码在32位颗粒度上更新.

VEXTRACTF32x8和VEXTRACTF64x4从源操作数(第二操作数)提取出256位双精度浮点值,并存储到目标操作数(第一操作数)的低256位. 256位数据提取发生在imm8[0](256-bit)或imm8[0]指定的256位颗粒偏移时,作为乘数因子. 目的地可以是矢量寄存器,也可以是256位内存位置.

VEXTRACTF64x4: (英语). 目标操作数的低256位根据写掩码在64位颗粒度上更新.

VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

眼前的高6位被忽略.

VEXTRACTF128/VEX TRACTF32x4/VEX TRACTF64x2/VEX TRACTF32x8/VEX TRACTF64x4-提取包装的浮点值

如果VEXTRACTF128被用VEX.L=0编码,试图执行用VEX.L=0编码的指令将导致#UD例外.

## 行动

```text
VEXTRACTF32x4 (EVEX Encoded Versions) When Destination is a Register

VL = 256, 512

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC1[127:0]

          1: TMP_DEST[127:0] := SRC1[255:128]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC1[127:0]

          01: TMP_DEST[127:0] := SRC1[255:128]

          10: TMP_DEST[127:0] := SRC1[383:256]

          11: TMP_DEST[127:0] := SRC1[511:384]

     ESAC.

FI;

FOR j := 0 TO 3

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:128] := 0

VEXTRACTF32x4 (EVEX Encoded Versions) When Destination is Memory
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.
FI;

FOR j := 0 TO 3
    i := j * 32
    IF k1[j] OR *no writemask*

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]  ; merging-masking
          ELSE *DEST[i+31:i] remains unchanged*
    FI;
ENDFOR

VEXTRACTF64x2 (EVEX Encoded Versions) When Destination is a Register
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.
FI;

FOR j := 0 TO 1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

             IF *merging-masking*                ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE *zeroing-masking*          ; zeroing-masking

                 DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:128] := 0

VEXTRACTF64x2 (EVEX Encoded Versions) When Destination is Memory
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.
FI;

FOR j := 0 TO 1

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values

    i := j * 64                                  ; merging-masking
    IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE *DEST[i+63:i] remains unchanged*
    FI;
ENDFOR

VEXTRACTF32x8 (EVEX.U1.512 Encoded Version) When Destination is a Register
VL = 512
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 7

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := TMP_DEST[i+31:i]

     ELSE

             IF *merging-masking*                ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE *zeroing-masking*          ; zeroing-masking

                 DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:256] := 0

VEXTRACTF32x8 (EVEX.U1.512 Encoded Version) When Destination is Memory
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 7                                  ; merging-masking
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN DEST[i+31:i] := TMP_DEST[i+31:i]
          ELSE *DEST[i+31:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTF64x4 (EVEX.512 Encoded Version) When Destination is a Register
VL = 512
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 3
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values

        IF *merging-masking*                      ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE *zeroing-masking*                ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:256] := 0

VEXTRACTF64x4 (EVEX.512 Encoded Version) When Destination is Memory
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 3
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE ; merging-masking
                *DEST[i+63:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTF128 (Memory Destination Form)
CASE (imm8[0]) OF

    0: DEST[127:0] := SRC1[127:0]
    1: DEST[127:0] := SRC1[255:128]
ESAC.

VEXTRACTF128 (Register Destination Form)
CASE (imm8[0]) OF

    0: DEST[127:0] := SRC1[127:0]
    1: DEST[127:0] := SRC1[255:128]
ESAC.
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VEXTRACTF32x4 __m128 _mm512_extractf32x4_ps(__m512 a, const int nidx);
VEXTRACTF32x4 __m128 _mm512_mask_extractf32x4_ps(__m128 s, __mmask8 k, __m512 a, const int nidx);
VEXTRACTF32x4 __m128 _mm512_maskz_extractf32x4_ps( __mmask8 k, __m512 a, const int nidx);
VEXTRACTF32x4 __m128 _mm256_extractf32x4_ps(__m256 a, const int nidx);
VEXTRACTF32x4 __m128 _mm256_mask_extractf32x4_ps(__m128 s, __mmask8 k, __m256 a, const int nidx);
VEXTRACTF32x4 __m128 _mm256_maskz_extractf32x4_ps( __mmask8 k, __m256 a, const int nidx);
VEXTRACTF32x8 __m256 _mm512_extractf32x8_ps(__m512 a, const int nidx);
VEXTRACTF32x8 __m256 _mm512_mask_extractf32x8_ps(__m256 s, __mmask8 k, __m512 a, const int nidx);
VEXTRACTF32x8 __m256 _mm512_maskz_extractf32x8_ps( __mmask8 k, __m512 a, const int nidx);
VEXTRACTF64x2 __m128d _mm512_extractf64x2_pd(__m512d a, const int nidx);
VEXTRACTF64x2 __m128d _mm512_mask_extractf64x2_pd(__m128d s, __mmask8 k, __m512d a, const int nidx);
VEXTRACTF64x2 __m128d _mm512_maskz_extractf64x2_pd( __mmask8 k, __m512d a, const int nidx);
VEXTRACTF64x2 __m128d _mm256_extractf64x2_pd(__m256d a, const int nidx);
VEXTRACTF64x2 __m128d _mm256_mask_extractf64x2_pd(__m128d s, __mmask8 k, __m256d a, const int nidx);
VEXTRACTF64x2 __m128d _mm256_maskz_extractf64x2_pd( __mmask8 k, __m256d a, const int nidx);
VEXTRACTF64x4 __m256d _mm512_extractf64x4_pd( __m512d a, const int nidx);
VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values VEXTRACTF64x4 __m256d _mm512_mask_extractf64x4_pd(__m256d s, __mmask8 k, __m512d a, const int nidx);
VEXTRACTF64x4 __m256d _mm512_maskz_extractf64x4_pd( __mmask8 k, __m512d a, const int nidx);
VEXTRACTF128 __m128 _mm256_extractf128_ps (__m256 a, int offset);
VEXTRACTF128 __m128d _mm256_extractf128_pd (__m256d a, int offset);
VEXTRACTF128 __m128i_mm256_extractf128_si256(__m256i a, int offset);
```

## SIMD 浮点 例外

None.

## 其他例外

VEX-encoded指令,参见表2-23"第6类例外条件".

EVEX-encoded 指令,参见表2-56,"Type E6NF Class Exception Centers".

Additionally:

```text
#UD               IF VEX.L = 0.
```

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```

VEXTRACTF128/VEX TRACTF32x4/VEX TRACTF64x2/VEX TRACTF32x8/VEX TRACTF64x4-提取包装的浮点值

VEXTRACTI128/VEX TRACTI32x4/VEX TRACTI64x2/VEX TRACTI32x8/VEX TRACTI64x4-外包装整数值

操作码/ Op/ 64/32 CPUID 特性描述指令 En Bit模式旗帜支持

VEX.256.66.0F3A.W0 39 /r ib A V/V AVX2 从ymm2提取128位整数数据,存储结果为xmm1/m128. VEXTRACTI128 xmm1/m128, ymm2, imm8

EVEX.256.66.0F3A.W0 39 /r ib C V/V (AVX512VL AND) 提取128位双字整数

```text
                                                 AVX512F) OR       from ymm2 and store results in xmm1/m128
```

VEXTRACTI32X4 xmm1/m128 {k1}{z},

```text
                                                 AVX10.1           subject to writemask k1.
```

ymm2, imm8

EVEX.512.66.0F3A.W0 39 /r ib C V/V AVX512F 提取128位双字整数

```text
                                                 OR AVX10.1        from zmm2 and store results in xmm1/m128
```

VEXTRACTI32x4 xmm1/m128 {k1}{z},                                   subject to writemask k1.

zmm2, imm8

EVEX.256.66.0F3A.W1 39 /r ib B V/V (AVX512VL AND) 提取128位四字整数

VEXTRACTI64X2 xmm1/m128 {k1}{z}, AVX512DQ) OR 来自ymm2,存储结果为xmm1/m128

```text
                                                 AVX10.1           subject to writemask k1.
```

ymm2, imm8

EVEX.512.66.0F3A.W139小时 ib B V/VAVX512DQ提取128位四字整数 ORAVX10.1 VEXTRACTI64X2 xmm1/m128 {k1从。zmm2并存储结果xmm1/m128须遵守写掩码 k1. zmm2, imm8

EVEX.512.66.0F3A.W0 3B /r ib D V/V AVX512DQ 提取256位双字整数

```text
                                                 OR AVX10.1        from zmm2 and store results in ymm1/m256
```

VEXTRACTI32X8 ymm1/m256 {k1}{z}, subject to writemask k1. zmm2, imm8

EVEX.512.66.0F3A.W1 3B /r ib C V/V AVX512F 提取256位元的四字整数

```text
                                                 OR AVX10.1        from zmm2 and store results in ymm1/m256
```

VEXTRACTI64x4 ymm1/m256 {k1}{z},                                   subject to writemask k1.

zmm2, imm8

## 说明

VEXTRACTI128/VEXTRACTI32x4和VEXTRACTI64x2从源操作数(第二个操作数)提取128位双字整数,并存储到目标操作数(第一个操作数)的低128位. 128位数据提取发生在imm8[0](256-bit)或imm8[1:0]指定的128位颗粒偏移时,作为乘数系数. 目的地可以是矢量寄存器或128位内存位置.

VEX TRACTI32x4: (英语). 目标操作数的低128位根据写掩码在32位颗粒度上更新.

VEX TRACTI64x2 (英语). 目标操作数的低128位根据写掩码在64位颗粒度上更新.

VEXTRACTI32x8和VEXTRACTI64x4从源操作数(第二个操作数)提取256位四字整数,存储到目标操作数(第一个操作数)的低256位. 256位数据提取发生在imm8[0](256-bit)或imm8[0]指定的256位颗粒偏移时,作为乘数因子. 目的地可以是矢量寄存器,也可以是256位内存位置.

VEX TRACTI32x8: (英语). 目标操作数的低256位根据写掩码在32位颗粒度上更新.

VEXTRACTI128/VEX TRACTI32x4/VEX TRACTI64x2/VEX TRACTI32x8/VEX TRACTI64x4-外包装整数值

VEX TRACTI64x4 (英语: 目标操作数的低256位根据写掩码在64位颗粒度上更新.

VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

眼前的高7位数(EVEX.512中的6位数)被忽略.

如果VEXTRACTI128被用VEX.L=0编码,试图执行用VEX.L=0编码的指令将导致#UD例外.

## 行动

```text
VEXTRACTI32x4 (EVEX encoded versions) when destination is a register

VL = 256, 512

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC1[127:0]

          1: TMP_DEST[127:0] := SRC1[255:128]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC1[127:0]

          01: TMP_DEST[127:0] := SRC1[255:128]

          10: TMP_DEST[127:0] := SRC1[383:256]

          11: TMP_DEST[127:0] := SRC1[511:384]

     ESAC.

FI;

FOR j := 0 TO 3

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:128] := 0

VEXTRACTI32x4 (EVEX encoded versions) when destination is memory
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

FI;

FOR j := 0 TO 3                                  ; merging-masking
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN DEST[i+31:i] := TMP_DEST[i+31:i]
          ELSE *DEST[i+31:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTI64x2 (EVEX encoded versions) when destination is a register
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.
FI;

FOR j := 0 TO 1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:128] := 0

VEXTRACTI64x2 (EVEX encoded versions) when destination is memory
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

          11: TMP_DEST[127:0] := SRC1[511:384]
    ESAC.
FI;

FOR j := 0 TO 1                                  ; merging-masking
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE *DEST[i+63:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTI32x8 (EVEX.U1.512 encoded version) when destination is a register
VL = 512
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 7

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := TMP_DEST[i+31:i]

     ELSE

             IF *merging-masking*                ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE *zeroing-masking*          ; zeroing-masking

                 DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:256] := 0

VEXTRACTI32x8 (EVEX.U1.512 encoded version) when destination is memory
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 7                                  ; merging-masking
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN DEST[i+31:i] := TMP_DEST[i+31:i]
          ELSE *DEST[i+31:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

VEXTRACTI64x4 (EVEX.512 encoded version) when destination is a register
VL = 512
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 3

i := j * 64

IF k1[j] OR *no writemask*

       THEN DEST[i+63:i] := TMP_DEST[i+63:i]

       ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE *zeroing-masking*       ; zeroing-masking

                   DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:256] := 0

VEXTRACTI64x4 (EVEX.512 encoded version) when destination is memory

CASE (imm8[0]) OF

0: TMP_DEST[255:0] := SRC1[255:0]

1: TMP_DEST[255:0] := SRC1[511:256]

ESAC.

FOR j := 0 TO 3

i := j * 64

IF k1[j] OR *no writemask*

       THEN DEST[i+63:i] := TMP_DEST[i+63:i]

       ELSE *DEST[i+63:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VEXTRACTI128 (memory destination form)
CASE (imm8[0]) OF

    0: DEST[127:0] := SRC1[127:0]
    1: DEST[127:0] := SRC1[255:128]
ESAC.

VEXTRACTI128 (register destination form)
CASE (imm8[0]) OF

    0: DEST[127:0] := SRC1[127:0]
    1: DEST[127:0] := SRC1[255:128]
ESAC.
DEST[MAXVL-1:128] := 0

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values
```

## Intel C/C++ 内在编译器

```c
VEXTRACTI32x4 __m128i _mm512_extracti32x4_epi32(__m512i a, const int nidx);
VEXTRACTI32x4 __m128i _mm512_mask_extracti32x4_epi32(__m128i s, __mmask8 k, __m512i a, const int nidx);
VEXTRACTI32x4 __m128i _mm512_maskz_extracti32x4_epi32( __mmask8 k, __m512i a, const int nidx);
VEXTRACTI32x4 __m128i _mm256_extracti32x4_epi32(__m256i a, const int nidx);
VEXTRACTI32x4 __m128i _mm256_mask_extracti32x4_epi32(__m128i s, __mmask8 k, __m256i a, const int nidx);
VEXTRACTI32x4 __m128i _mm256_maskz_extracti32x4_epi32( __mmask8 k, __m256i a, const int nidx);
VEXTRACTI32x8 __m256i _mm512_extracti32x8_epi32(__m512i a, const int nidx);
VEXTRACTI32x8 __m256i _mm512_mask_extracti32x8_epi32(__m256i s, __mmask8 k, __m512i a, const int nidx);
VEXTRACTI32x8 __m256i _mm512_maskz_extracti32x8_epi32( __mmask8 k, __m512i a, const int nidx);
VEXTRACTI64x2 __m128i _mm512_extracti64x2_epi64(__m512i a, const int nidx);
VEXTRACTI64x2 __m128i _mm512_mask_extracti64x2_epi64(__m128i s, __mmask8 k, __m512i a, const int nidx);
VEXTRACTI64x2 __m128i _mm512_maskz_extracti64x2_epi64( __mmask8 k, __m512i a, const int nidx);
VEXTRACTI64x2 __m128i _mm256_extracti64x2_epi64(__m256i a, const int nidx);
VEXTRACTI64x2 __m128i _mm256_mask_extracti64x2_epi64(__m128i s, __mmask8 k, __m256i a, const int nidx);
VEXTRACTI64x2 __m128i _mm256_maskz_extracti64x2_epi64( __mmask8 k, __m256i a, const int nidx);
VEXTRACTI64x4 __m256i _mm512_extracti64x4_epi64(__m512i a, const int nidx);
VEXTRACTI64x4 __m256i _mm512_mask_extracti64x4_epi64(__m256i s, __mmask8 k, __m512i a, const int nidx);
VEXTRACTI64x4 __m256i _mm512_maskz_extracti64x4_epi64( __mmask8 k, __m512i a, const int nidx);
VEXTRACTI128 __m128i _mm256_extracti128_si256(__m256i a, int offset);
```

## SIMD 浮点 例外

None

## 其他例外

VEX-encoded指令,参见表2-23"第6类例外条件".

EVEX-encoded 指令,参见表2-56,"Type E6NF Class Exception Centers".

Additionally:

```text
#UD               IF VEX.L = 0.
```

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```

VEXTRACTI128/VEX TRACTI32x4/VEX TRACTI64x2/VEX TRACTI32x8/VEX TRACTI64x4-外包装整数值
