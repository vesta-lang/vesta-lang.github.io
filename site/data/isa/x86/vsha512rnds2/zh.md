---
summary: 执行两轮 SHA512 操作
---

## 说明

VSHA512RNDS2指令使用第一个操作数的初始SHA512状态(C,D,G,H)进行两轮SHA512操作,从第二个操作数的初始SHA512状态(A,B,E,F),以及从第三个操作数(只有第三个操作数的下两个qwords)预计算出下两个圆报Q字和相应的圆常数的总和. 更新后的SHA512状态(A,B,E,F)被写入第一个操作数,第二个操作数可以在以后的回合中作为更新的状态(C,D,G,H)使用.

见https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf 关于SHA512标准的更多信息.

## 行动

```text
define ROR64(qword, n):

    count := n % 64
    dest := (qword >> count) | (qword << (64-count))
    return dest

define SHR64(qword, n):
    return qword >> n

define cap_sigma0(qword):
    return ROR64(qword,28) ^ ROR64(qword, 34) ^ ROR64(qword, 39)

define cap_sigma1(qword):
    return ROR64(qword,14) ^ ROR64(qword, 18) ^ ROR64(qword, 41)

define MAJ(a,b,c):
    return (a & b) ^ (a & c) ^ (b & c)

define CH(e,f,g):
    return (e & f) ^ (g & ~e)


VSHA512RNDS2 SRCDEST, SRC1, SRC2
A[0] := SRC1.qword[3]
B[0] := SRC1.qword[2]
C[0] := SRCDEST.qword[3]
D[0] := SRCDEST.qword[2]
E[0] := SRC1.qword[1]
F[0] := SRC1.qword[0]
G[0] := SRCDEST.qword[1]
H[0] := SRCDEST.qword[0]
WK[0]:= SRC2.qword[0]
WK[1]:= SRC2.qword[1]

FOR i in 0..1:
    A[i+1] := CH(E[i], F[i], G[i]) +
          cap_sigma1(E[i]) + WK[i] + H[i] +
          MAJ(A[i], B[i], C[i]) +
          cap_sigma0(A[i])
    B[i+1] := A[i]
    C[i+1] := B[i]
    D[i+1] := C[i]
    E[i+1] := CH(E[i], F[i], G[i]) +
          cap_sigma1(E[i]) + WK[i] + H[i] + D[i]
    F[i+1] := E[i]
    G[i+1] := F[i]
    H[i+1] := G[i]

SRCDEST.qword[3] = A[2]
SRCDEST.qword[2] = B[2]
SRCDEST.qword[1] = E[2]
SRCDEST.qword[0] = F[2]
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VSHA512RNDS2 __m256i _mm256_sha512rnds2_epi64 (__m256i __A, __m256i __B, __m128i __C);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-23"第6类例外条件".

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle 包装值为128比特颗粒度

操作码/ Op 64/32 CPUID 特性描述指令 En bit 模式旗支持

EVEX.256.66.0F3A.W0 23 /r ib A V/V(AVX512VL AND Shuffle 128位装箱的单精度浮式-)

VSHUFF32X4 ymm1{k1}{z},ymm2,AVX512F) imm8从ymm2和ymm2中选择的OR点值.

```text
                                              AVX10.1        ymm3/m256/m32bcst and place results in ymm1
```

ymm3/m256/m32bcst, imm8                                      subject to writemask k1.

EVEX.512.66.0F3A.W0 23 /r ib A V/V AVX512F Shuffle 128位包装的单精度浮点-OR AVX10.1 VSHUFF32x4 zmm1{k1}{z},zmm2,imm8从zmm2和zmm3/m512/m32bcst中选择的点值,并位于zmm1 zmm3/m512/m32bcst,imm8中服从写掩码 k1.

EVEX.256.66.0F3A.W1 23 /r ib A V/V(AVX512VL AND Shuffle 128位包装的双精度浮动-) .

VSHUFF64X2 ymm1{k1}{z},ymm2,AVX512F) imm8从ymm2和ymm2中选择的OR点值.

```text
                                              AVX10.1        ymm3/m256/m64bcst and place results in ymm1
```

ymm3/m256/m64bcst, imm8 subject to writemask k1.

EVEX.512.66.0F3A.W1 23 /r ib A V/V AVX512F Shuffle 128位包装的双精度浮动-

```text
                                              OR AVX10.1     point values selected by imm8 from zmm2 and
```

VSHUFF64x2 zmm1{k1}{z},zmm2,zmm3/m512/m64bcst 并将结果置入zmm1

zmm3/m512/m64bcst, imm8                                      subject to writemask k1.

EVEX.256.66.0F3A.W0 43 /r ib A V/V (AVX512VL AND Shuffle 128位包装的双字值)

```text
                                              AVX512F) OR    selected by imm8 from ymm2 and
```

VSHUFI32X4 ymm1{k1},ymm2,AVX10.1 ymm3/m256/m32bcst 并将结果置入ymm1

ymm3/m256/m32bcst, imm8                                      subject to writemask k1.

EVEX.512.66.0F3A.W0 43 /r ib A V/V AVX512F Shuffle 128位包装的双字值

```text
                                              OR AVX10.1     selected by imm8 from zmm2 and
```

VSHUFI32x4 zmm1{k1}{z},zmm2,zmm3/m512/m32bcst 并将结果置入zmm1

zmm3/m512/m32bcst, imm8                                      subject to writemask k1.

EVEX.256.66.0F3A.W1 43 /r ib A V/V (AVX512VL AND Shuffle 128位包装的四字值选中)

```text
                                              AVX512F) OR    by imm8 from ymm2 and ymm3/m256/m64bcst
```

VSHUFI64X2 ymm1{k1}{z},ymm2,AVX10.1 并将结果置于ymm1 objected to 写掩码 k1.

ymm3/m256/m64bcst, imm8

EVEX.512.66.0F3A.W143(r) ib A V/VAVX512F移动128位组合的四字值AVX10.1VSHUFI64x2 (英语).zmm1{k1}{z}, zmm2,通过imm8从zmm2和zmm3/m512/m64bcst和将结果放在zmm1须遵守写掩码 k1. zmm3/m512/m64bcst, (中文(简体) ).imm8

## 说明

256位版本 : 将第一源操作数(第二座操作数)的2个128位打包单精度浮点值中的1个移动到目标操作数(第一座操作数);将第二源操作数(第三座操作数)的2个包装128位浮点值中的1个移动到目标操作数的高128位. 选择器操作数(第三代操作数)确定哪些值被移动到目标操作数.

512位版本 : 将第一源操作数(第二操作数)的4个128位的打包单精度浮点值中的2个移动到目标操作数(第一操作数)的每个双字的低256位;将第二源操作数(第三操作数)的4个包装128位的浮点值中的2个移动到目标操作数的高256位. 选择器操作数(第三代操作数)确定哪些值被移动到目标操作数.

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle 包装值为128比特颗粒度

第一源操作数是一个矢量寄存器. 第二源操作数可以是ZMM寄存器,512位内存位置或512位向量从32/64位内存位置广播. 目标操作数是一个矢量寄存器.

写掩码以32/64位数据元素的颗粒性更新了目标操作数.

## 行动

```text
Select2(SRC, control) {
CASE (control[0]) OF

    0: TMP := SRC[127:0];
    1: TMP := SRC[255:128];
ESAC;
RETURN TMP
}

Select4(SRC, control) {
CASE (control[1:0]) OF

    0: TMP := SRC[127:0];
    1: TMP := SRC[255:128];
    2: TMP := SRC[383:256];
    3: TMP := SRC[511:384];
ESAC;
RETURN TMP
}

VSHUFF32x4 (EVEX versions)

(KL, VL) = (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]

          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]

     FI;

ENDFOR;

IF VL = 256

     TMP_DEST[127:0] := Select2(SRC1[255:0], imm8[0]);

     TMP_DEST[255:128] := Select2(SRC2[255:0], imm8[1]);

FI;

IF VL = 512

     TMP_DEST[127:0] := Select4(SRC1[511:0], imm8[1:0]);

     TMP_DEST[255:128] := Select4(SRC1[511:0], imm8[3:2]);

     TMP_DEST[383:256] := Select4(TMP_SRC2[511:0], imm8[5:4]);

     TMP_DEST[511:384] := Select4(TMP_SRC2[511:0], imm8[7:6]);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE *zeroing-masking*    ; zeroing-masking

                       THEN DEST[i+31:i] := 0

                  FI;

     FI;

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Packed Values at 128-Bit Granularity

ENDFOR
DEST[MAXVL-1:VL] := 0

VSHUFF64x2 (EVEX 512-bit version)

(KL, VL) = (4, 256), (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0]

          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i]

     FI;

ENDFOR;

IF VL = 256

     TMP_DEST[127:0] := Select2(SRC1[255:0], imm8[0]);

     TMP_DEST[255:128] := Select2(SRC2[255:0], imm8[1]);

FI;

IF VL = 512

     TMP_DEST[127:0] := Select4(SRC1[511:0], imm8[1:0]);

     TMP_DEST[255:128] := Select4(SRC1[511:0], imm8[3:2]);

     TMP_DEST[383:256] := Select4(TMP_SRC2[511:0], imm8[5:4]);

     TMP_DEST[511:384] := Select4(TMP_SRC2[511:0], imm8[7:6]);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      THEN DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFI32x4 (EVEX 512-bit version)
(KL, VL) = (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]
          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]
    FI;
ENDFOR;
IF VL = 256
    TMP_DEST[127:0] := Select2(SRC1[255:0], imm8[0]);
    TMP_DEST[255:128] := Select2(SRC2[255:0], imm8[1]);
FI;
IF VL = 512
    TMP_DEST[127:0] := Select4(SRC1[511:0], imm8[1:0]);
    TMP_DEST[255:128] := Select4(SRC1[511:0], imm8[3:2]);
    TMP_DEST[383:256] := Select4(TMP_SRC2[511:0], imm8[5:4]);
    TMP_DEST[511:384] := Select4(TMP_SRC2[511:0], imm8[7:6]);

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Packed Values at 128-Bit Granularity

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      THEN DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFI64x2 (EVEX 512-bit version)

(KL, VL) = (4, 256), (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0]

          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i]

     FI;

ENDFOR;

IF VL = 256

     TMP_DEST[127:0] := Select2(SRC1[255:0], imm8[0]);

     TMP_DEST[255:128] := Select2(SRC2[255:0], imm8[1]);

FI;

IF VL = 512

     TMP_DEST[127:0] := Select4(SRC1[511:0], imm8[1:0]);

     TMP_DEST[255:128] := Select4(SRC1[511:0], imm8[3:2]);

     TMP_DEST[383:256] := Select4(TMP_SRC2[511:0], imm8[5:4]);

     TMP_DEST[511:384] := Select4(TMP_SRC2[511:0], imm8[7:6]);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      THEN DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Packed Values at 128-Bit Granularity
```

## Intel C/C++ 内在编译器

```c
VSHUFI32x4 __m512i _mm512_shuffle_i32x4(__m512i a, __m512i b, int imm);
VSHUFI32x4 __m512i _mm512_mask_shuffle_i32x4(__m512i s, __mmask16 k, __m512i a, __m512i b, int imm);
VSHUFI32x4 __m512i _mm512_maskz_shuffle_i32x4( __mmask16 k, __m512i a, __m512i b, int imm);
VSHUFI32x4 __m256i _mm256_shuffle_i32x4(__m256i a, __m256i b, int imm);
VSHUFI32x4 __m256i _mm256_mask_shuffle_i32x4(__m256i s, __mmask8 k, __m256i a, __m256i b, int imm);
VSHUFI32x4 __m256i _mm256_maskz_shuffle_i32x4( __mmask8 k, __m256i a, __m256i b, int imm);
VSHUFF32x4 __m512 _mm512_shuffle_f32x4(__m512 a, __m512 b, int imm);
VSHUFF32x4 __m512 _mm512_mask_shuffle_f32x4(__m512 s, __mmask16 k, __m512 a, __m512 b, int imm);
VSHUFF32x4 __m512 _mm512_maskz_shuffle_f32x4( __mmask16 k, __m512 a, __m512 b, int imm);
VSHUFI64x2 __m512i _mm512_shuffle_i64x2(__m512i a, __m512i b, int imm);
VSHUFI64x2 __m512i _mm512_mask_shuffle_i64x2(__m512i s, __mmask8 k, __m512i b, __m512i b, int imm);
VSHUFI64x2 __m512i _mm512_maskz_shuffle_i64x2( __mmask8 k, __m512i a, __m512i b, int imm);
VSHUFF64x2 __m512d _mm512_shuffle_f64x2(__m512d a, __m512d b, int imm);
VSHUFF64x2 __m512d _mm512_mask_shuffle_f64x2(__m512d s, __mmask8 k, __m512d a, __m512d b, int imm);
VSHUFF64x2 __m512d _mm512_maskz_shuffle_f64x2( __mmask8 k, __m512d a, __m512d b, int imm);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-52"Type E4NF类例外条件".

Additionally:

```text
#UD               If EVEX.L'L = 0 for VSHUFF32x4/VSHUFF64x2.
```

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle 包装值为128比特颗粒度
