---
summary: 从 Float32 标量 提取正常化曼提萨的矢量
---

## 说明

将第二源操作数(第三代操作数)低双字元中的单精度浮动值转换为单精度浮点值,使用imm8字节指定的mantissa正常化和符号控制,见图5-15. 转换的结果是用写掩码 k1写成目标操作数(第一个操作数)的低双字元素. XMM注册目的地的比特(127:32)从第一源操作数中的相应比特复制. 普通的mantissa由interv(imm8[1:0])指定,标志控制(sc)由直接字节的3:2位指定.

转换操作为:

GetMant(x) = +/-2k|x.significand| where:

1 <= |x.significand| < 2

无偏倚的表示k可以是0,也可以是-1,这取决于interv定义的间隔范围,符号的表示范围以及来源的表示是偶数还是奇数. 最终结果的标志由sc和源标志确定. Imm8[1:0]的编码值和签名控制值如图5-15所示.

转换后的单精度浮点结果按照符号控件编码,无偏见的exporent k(添加偏差)和与interv指定的范围正常化的mantissa.

GetMant () 函数在处理 浮点 特殊编号时遵循表 5-16 。

如果使用书写方式,则根据写掩码注册k1的值,对目标操作数的低双字元素进行有条件更新. 如果不使用写作,则目标操作数的低双字元素将无条件更新.

## 行动

```text
// getmant_fp32(src, sign_control, normalization_interval) is defined in the operation section of VGETMANTPS

VGETMANTSS (EVEX encoded version)

SignCtrl[1:0] := IMM8[3:2];

Interv[1:0] := IMM8[1:0];

IF k1[0] OR *no writemask*

     THEN DEST[31:0] :=

           getmant_fp32(src, sign_control, normalization_interval)

     ELSE

     IF *merging-masking*          ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                    ; zeroing-masking

           DEST[31:0] := 0

     FI

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VGETMANTSS __m128 _mm_getmant_ss( __m128 a, __m128 b, enum intv, enum sgn);
VGETMANTSS __m128 _mm_mask_getmant_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, enum intv, enum sgn);
VGETMANTSS __m128 _mm_maskz_getmant_ss( __mmask8 k, __m128 a, __m128 b, enum intv, enum sgn);
VGETMANTSS __m128 _mm_getmant_round_ss( __m128 a, __m128 b, enum intv, enum sgn, int r);
VGETMANTSS __m128 _mm_mask_getmant_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, enum intv, enum sgn, int r);
VGETMANTSS __m128 _mm_maskz_getmant_round_ss( __mmask8 k, __m128 a, __m128 b, enum intv, enum sgn, int r);
```

## SIMD 浮点 例外

Denormal, Invalid

## 其他例外

见表2-49"E3类例外条件"。

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4-插入包装的浮点值

操作码/ Op/ 64/32 CPUID 特性描述指令 En Bit模式旗帜支持

VEX.256.66.0F3A.W0 18 /r ib A V/V AVX 插入128位已包装的 浮点值

VINSERTF128 ymm1,ymm2,来自xmm3/m128,其余值为xmm3/m128,imm8从ymm2进入ymm1.

EVEX.256.66.0F3A.W0 18 /r ib C V/V (AVX512VL AND) 插入128位包装单精度

```text
                                                      AVX512F) OR    floating-point values from xmm3/m128 and the
```

VINSERTF32X4 ymm1 {k1}{z}, ymm2,

```text
                                                      AVX10.1        remaining values from ymm2 into ymm1 under
```

xmm3/m128, imm8                                                      writemask k1.

EVEX.512.66.0F3A.W0 18 /r ib C V/V AVX512F 插入128位包装单精度

```text
                                                      OR AVX10.1     floating-point values from xmm3/m128 and the
```

VINSERTF32X4 zmm1 {k1}{z},zmm2, zmm2的剩余值在xmm3/m128, imm8, 写掩码, k1下从zmm2变为zmm1.

EVEX.256.66.0F3A.W1 18 /r ib B V/V (AVX512VL AND) 插入128位包装双精度

VINSERTF64X2 ymm1 {k1}{z}, ymm2, AVX512DQ) OR 浮点值 从 xmm3/m128 和 the.

```text
                                                      AVX10.1        remaining values from ymm2 into ymm1 under
```

xmm3/m128, imm8                                                      writemask k1.

EVEX.512.66.0F3A.W1 18 /r ib B V/V AVX512DQ 在 xmm3/m128, imm8 writemask k1 下插入128位包装双精度OR AVX10.1 VINSERTF64X2 zmm1 {k1}{z}, zmm2, xmm3/m128的浮点值和 zmm2的剩余值为 zmm1.

EVEX.512.66.0F3A.W0 1A /r ib D V/V AVX512DQ 在 ymm3/m256, imm8 writemask k1 下,插入256位包装单精度或 AVX10.1 VINSERTF32X8 zmm1 {k1}{z}, zmm2, ymm3/m256的浮点值和 zmm2的剩余值为 zmm1.

EVEX.512.66.0F3A.W1 1A /r ib C V/V AVX512F 在 ymm3/m256, imm8 writemask k1 下插入256位包装双精度OR AVX10.1 VINSERTF64X4 zmm1 {k1}{z}, zmm2, ymm3/m256的浮点值和 zmm2的剩余值为 zmm1.

## 说明

VINSERTF128/VINSERTF32x4和VINSERTF64x2从第二源运行符(第三源运行符)将128位的包装浮点值插入目的地运行符(第一源运行符),以128位颗粒值抵消乘以imm8[0](256-bit)或imm8[1:0]. 目标操作数的剩余部分从第一源操作数(第二个操作数)的相应字段复制. 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目的地和第一个源操作数是矢量登记册.

VINSERTF32x4 (英语): 目标操作数是一个ZMM/YMM的寄存器,根据写掩码以32位颗粒性更新. 高的6/7比特 直接的被忽略。

VINSERTF64x2 (英语). 目标操作数是一个ZMM/YMM的寄存器,根据写掩码以64位颗粒性更新. 高的6/7比特 直接的被忽略。

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4-插入包装的浮点值

VINSERTF32x8和VINSERTF64x4从第二源操作数(第三代操作数)中将256位已包装的浮点值插入到目标操作数(第一代操作数)中,以256位的颗粒抵消乘以imm8[0]. 目的地的剩余部分从第一源操作数(第二个操作数)的相应字段复制. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 眼前的高7位被忽略. 目标操作数是一个ZMM的寄存器,根据写掩码以32/64位颗粒性更新.

## 行动

```text
VINSERTF32x4 (EVEX encoded versions)

(KL, VL) = (8, 256), (16, 512)

TEMP_DEST[VL-1:0] := SRC1[VL-1:0]

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC2[127:0]

          1: TMP_DEST[255:128] := SRC2[127:0]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC2[127:0]

          01: TMP_DEST[255:128] := SRC2[127:0]

          10: TMP_DEST[383:256] := SRC2[127:0]

          11: TMP_DEST[511:384] := SRC2[127:0]

     ESAC.

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4--Insert Packed Floating-Point Values

VINSERTF64x2 (EVEX encoded versions)

(KL, VL) = (4, 256), (8, 512)

TEMP_DEST[VL-1:0] := SRC1[VL-1:0]

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC2[127:0]

          1: TMP_DEST[255:128] := SRC2[127:0]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC2[127:0]

          01: TMP_DEST[255:128] := SRC2[127:0]

          10: TMP_DEST[383:256] := SRC2[127:0]

          11: TMP_DEST[511:384] := SRC2[127:0]

     ESAC.

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTF32x8 (EVEX.U1.512 encoded version)
TEMP_DEST[VL-1:0] := SRC1[VL-1:0]
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC2[255:0]
    1: TMP_DEST[511:256] := SRC2[255:0]
ESAC.

FOR j := 0 TO 15

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4--Insert Packed Floating-Point Values

VINSERTF64x4 (EVEX.512 encoded version)
VL = 512
TEMP_DEST[VL-1:0] := SRC1[VL-1:0]
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC2[255:0]
    1: TMP_DEST[511:256] := SRC2[255:0]
ESAC.

FOR j := 0 TO 7

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                       ; zeroing-masking

                 DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTF128 (VEX encoded version)
TEMP[255:0] := SRC1[255:0]
CASE (imm8[0]) OF

    0: TEMP[127:0] := SRC2[127:0]
    1: TEMP[255:128] := SRC2[127:0]
ESAC
DEST := TEMP
```

## Intel C/C++ 内在编译器

```c
VINSERTF32x4 __m512 _mm512_insertf32x4( __m512 a, __m128 b, int imm);
VINSERTF32x4 __m512 _mm512_mask_insertf32x4(__m512 s, __mmask16 k, __m512 a, __m128 b, int imm);
VINSERTF32x4 __m512 _mm512_maskz_insertf32x4( __mmask16 k, __m512 a, __m128 b, int imm);
VINSERTF32x4 __m256 _mm256_insertf32x4( __m256 a, __m128 b, int imm);
VINSERTF32x4 __m256 _mm256_mask_insertf32x4(__m256 s, __mmask8 k, __m256 a, __m128 b, int imm);
VINSERTF32x4 __m256 _mm256_maskz_insertf32x4( __mmask8 k, __m256 a, __m128 b, int imm);
VINSERTF32x8 __m512 _mm512_insertf32x8( __m512 a, __m256 b, int imm);
VINSERTF32x8 __m512 _mm512_mask_insertf32x8(__m512 s, __mmask16 k, __m512 a, __m256 b, int imm);
VINSERTF32x8 __m512 _mm512_maskz_insertf32x8( __mmask16 k, __m512 a, __m256 b, int imm);
VINSERTF64x2 __m512d _mm512_insertf64x2( __m512d a, __m128d b, int imm);
VINSERTF64x2 __m512d _mm512_mask_insertf64x2(__m512d s, __mmask8 k, __m512d a, __m128d b, int imm);
VINSERTF64x2 __m512d _mm512_maskz_insertf64x2( __mmask8 k, __m512d a, __m128d b, int imm);
VINSERTF64x2 __m256d _mm256_insertf64x2( __m256d a, __m128d b, int imm);
VINSERTF64x2 __m256d _mm256_mask_insertf64x2(__m256d s, __mmask8 k, __m256d a, __m128d b, int imm);
VINSERTF64x2 __m256d _mm256_maskz_insertf64x2( __mmask8 k, __m256d a, __m128d b, int imm);
VINSERTF64x4 __m512d _mm512_insertf64x4( __m512d a, __m256d b, int imm);
VINSERTF64x4 __m512d _mm512_mask_insertf64x4(__m512d s, __mmask8 k, __m512d a, __m256d b, int imm);
VINSERTF64x4 __m512d _mm512_maskz_insertf64x4( __mmask8 k, __m512d a, __m256d b, int imm);
VINSERTF128 __m256 _mm256_insertf128_ps (__m256 a, __m128 b, int offset);
VINSERTF128 __m256d _mm256_insertf128_pd (__m256d a, __m128d b, int offset);
VINSERTF128 __m256i _mm256_insertf128_si256 (__m256i a, __m128i b, int offset);
```

## SIMD 浮点 例外

None

## 其他例外

VEX-encoded 指令,参见表2-23"第6类例外条件".

Additionally:

```text
#UD               If VEX.L = 0.
```

EVEX-encoded discription,参见表2-56"Type E6NF类例外条件".

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4-插入包装的浮点值

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4-插入式整数

操作码/ Op/ 64/32 CPUID 特性描述指令 En Bit模式旗帜支持

VEX.256.66.0F3A.W0 38 /r ib A V/V AVX2 将 xmm3/m128 的128位整数数据以及 ymm2 的剩余值插入 ymm1. VINSERTI128 ymm1, ymm2, xmm3/m128, imm8

EVEX.256.66.0F3A.W0 38 /r ib C V/V (AVX512VL AND) 插入128位已包装的双字整数

```text
                                                 AVX512F) OR    values from xmm3/m128 and the remaining
```

VINSERTI32X4 ymm1 {k1}{z}, ymm2,

```text
                                                 AVX10.1        values from ymm2 into ymm1 under writemask
```

xmm3/m128, imm8                                                 k1.

EVEX.512.66.0F3A.W0 38 /r ib C V/V AVX512F 插入128位已包装的双字整数

```text
                                                 OR AVX10.1     values from xmm3/m128 and the remaining
```

VINSERTI32X4 zmm1 {k1}{z},zmm2,在写作程序xmm3/m128,imm8 k1下从zmm2到zmm1的值.

EVEX.256.66.0F3A.W1 38 /r ib B V/V (AVX512VL AND) 插入128位已包装的四字整数

VINSERTI64X2 ymm1 {k1}{z}, ymm2, AVX512DQ) OR值来自xmm3/m128和其余的

```text
                                                 AVX10.1        values from ymm2 into ymm1 under writemask
```

xmm3/m128, imm8                                                 k1.

EVEX.512.66.0F3A.W1 38 /r ib B V/V AVX512DQ OR 插入128位已包装的四字整数 AVX10.1 VINSERTI64X2 zmm1 {k1}{z}, zmm2,来自xmm3/m128的值和来自zmm2的剩余值在写掩码 xmm3/m128,imm8 k1下输入zmm1.

EVEX.512.66.0F3A.W03A/r ib D V/V 数据AVX512DQ插入256位组合双字整数AVX10.1 VINSERTI32X8 zmm1 {k1}{z}, zmm2,数值来自ymm3/m256和剩余数值zmm2输入zmm1下级写掩码 ymm3/m256, imm8 k1.

EVEX.512.66.0F3A.W13A/r ib CV/VAVX512F插入256位组合四字整数 ORAVX10.1 VINSERTI64X4 zmm1 {k1}{z}, zmm2,数值来自ymm3/m256和剩余数值zmm2输入zmm1下级写掩码 ymm3/m256, imm8 k1.

## 说明

VINSERTI32x4和VINSERTI64x2从第二源操作数(第三代操作数)将128位的包装整数值插入目标操作数(第一代操作数),在128位的颗粒偏移乘以imm8[0](256-bit)或imm8[1:0]. 目的地的剩余部分从第一源操作数(第二个操作数)的相应字段复制. 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 眼前的高6/7比特被忽略. 目标操作数是一个ZMM/YMM的寄存器,并按写掩码更新为32位和64位颗粒.

VINSERTI32x8和VINSERTI64x4从第二源操作数(第三代操作数)的256位整数值插入目标操作数(第一代操作数),在一个256位的颗粒偏移乘以imm8[0]. 目的地的剩余部分从第一源操作数(第二个操作数)的相应字段复制. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 该

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4-插入式整数

直接的上位被忽略。 目标操作数是一个ZMM寄存器,根据写掩码以32位和64位颗粒性更新.

VINSERTI128将来自第二源操作数(第三代操作数)的128位块整数数据插入到目标操作数(第一代操作数)中,以128位颗粒偏移乘以imm8[0]. 目的地的剩余部分从第一源操作数(第二个操作数)的相应字段复制. 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 眼前的高7位被忽略. VEX.L必须是1,否则试图用VEX.L=0执行此指令将导致#UD.

## 行动

```text
VINSERTI32x4 (EVEX encoded versions)

(KL, VL) = (8, 256), (16, 512)

TEMP_DEST[VL-1:0] := SRC1[VL-1:0]

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC2[127:0]

          1: TMP_DEST[255:128] := SRC2[127:0]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC2[127:0]

          01: TMP_DEST[255:128] := SRC2[127:0]

          10: TMP_DEST[383:256] := SRC2[127:0]

          11: TMP_DEST[511:384] := SRC2[127:0]

     ESAC.

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values

VINSERTI64x2 (EVEX encoded versions)

(KL, VL) = (4, 256), (8, 512)

TEMP_DEST[VL-1:0] := SRC1[VL-1:0]

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC2[127:0]

          1: TMP_DEST[255:128] := SRC2[127:0]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC2[127:0]

          01: TMP_DEST[255:128] := SRC2[127:0]

          10: TMP_DEST[383:256] := SRC2[127:0]

          11: TMP_DEST[511:384] := SRC2[127:0]

     ESAC.

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTI32x8 (EVEX.U1.512 encoded version)
TEMP_DEST[VL-1:0] := SRC1[VL-1:0]
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC2[255:0]
    1: TMP_DEST[511:256] := SRC2[255:0]
ESAC.

FOR j := 0 TO 15

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values

VINSERTI64x4 (EVEX.512 encoded version)
VL = 512
TEMP_DEST[VL-1:0] := SRC1[VL-1:0]
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC2[255:0]
    1: TMP_DEST[511:256] := SRC2[255:0]
ESAC.

FOR j := 0 TO 7

i := j * 64

IF k1[j] OR *no writemask*

      THEN DEST[i+63:i] := TMP_DEST[i+63:i]

      ELSE

             IF *merging-masking*            ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                        ; zeroing-masking

                   DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTI128

TEMP[255:0] := SRC1[255:0]

CASE (imm8[0]) OF

0: TEMP[127:0] := SRC2[127:0]

1: TEMP[255:128] := SRC2[127:0]

ESAC

DEST := TEMP
```

## Intel C/C++ 内在编译器

```c
VINSERTI32x4 _mm512i _inserti32x4( __m512i a, __m128i b, int imm);
VINSERTI32x4 _mm512i _mask_inserti32x4(__m512i s, __mmask16 k, __m512i a, __m128i b, int imm);
VINSERTI32x4 _mm512i _maskz_inserti32x4( __mmask16 k, __m512i a, __m128i b, int imm);
VINSERTI32x4 __m256i _mm256_inserti32x4( __m256i a, __m128i b, int imm);
VINSERTI32x4 __m256i _mm256_mask_inserti32x4(__m256i s, __mmask8 k, __m256i a, __m128i b, int imm);
VINSERTI32x4 __m256i _mm256_maskz_inserti32x4( __mmask8 k, __m256i a, __m128i b, int imm);
VINSERTI32x8 __m512i _mm512_inserti32x8( __m512i a, __m256i b, int imm);
VINSERTI32x8 __m512i _mm512_mask_inserti32x8(__m512i s, __mmask16 k, __m512i a, __m256i b, int imm);
VINSERTI32x8 __m512i _mm512_maskz_inserti32x8( __mmask16 k, __m512i a, __m256i b, int imm);
VINSERTI64x2 __m512i _mm512_inserti64x2( __m512i a, __m128i b, int imm);
VINSERTI64x2 __m512i _mm512_mask_inserti64x2(__m512i s, __mmask8 k, __m512i a, __m128i b, int imm);
VINSERTI64x2 __m512i _mm512_maskz_inserti64x2( __mmask8 k, __m512i a, __m128i b, int imm);
VINSERTI64x2 __m256i _mm256_inserti64x2( __m256i a, __m128i b, int imm);
VINSERTI64x2 __m256i _mm256_mask_inserti64x2(__m256i s, __mmask8 k, __m256i a, __m128i b, int imm);
VINSERTI64x2 __m256i _mm256_maskz_inserti64x2( __mmask8 k, __m256i a, __m128i b, int imm);
VINSERTI64x4 _mm512_inserti64x4( __m512i a, __m256i b, int imm);
VINSERTI64x4 _mm512_mask_inserti64x4(__m512i s, __mmask8 k, __m512i a, __m256i b, int imm);
VINSERTI64x4 _mm512_maskz_inserti64x4( __mmask m, __m512i a, __m256i b, int imm);
VINSERTI128 __m256i _mm256_insertf128_si256 (__m256i a, __m128i b, int offset);
```

## SIMD 浮点 例外

None.

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4-插入式整数

## 其他例外

VEX-encoded 指令,参见表2-23"第6类例外条件".

Additionally:

```text
#UD               If VEX.L = 0.
```

EVEX-encoded discription,参见表2-56"Type E6NF类例外条件".

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4-插入式整数
