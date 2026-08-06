---
summary: 无签名的52比特 无符号整数和添加高52比特的倍数
---

## 说明

在第一源操作数(第二个操作数)的每个qword元素中,用第二源操作数(第三个操作数)的相应元素中被打包的52位整数乘以未打包的52位整数,形成打包的104位中间结果. 每个104位产品的高52位,无符号的整数被添加到写入mask k1下对应的目的地歌词(第一部歌词)无符号的整数中.

第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位向量从64位内存位置广播. 目的地操作器是一个ZMM/YMM/XMM的寄存器,在64位颗粒度时以写mask k1有条件更新.

## 行动

```text
VPMADDHUQ srcdest, src1, src2 (VEX version)
VL = (128,256)
KL = VL/64

FOR i in 0 .. KL-1:
    temp128 := zeroextend64(src1.qword[i][51:0]) *zeroextend64(src2.qword[i][51:0])
    srcdest.qword[i] := srcdest.qword[i] +zeroextend64(temp128[103:52])

srcdest[MAXVL:VL] := 0

VPMADD52HUQ (EVEX encoded)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64;
    IF k1[j] OR *no writemask* THEN

          IF src2 is Memory AND EVEX.b=1 THEN
                tsrc2[63:0] := ZeroExtend64(src2[51:0]);

          ELSE
                tsrc2[63:0] := ZeroExtend64(src2[i+51:i];

          FI;
          Temp128[127:0] := ZeroExtend64(src1[i+51:i]) * tsrc2[63:0];
          Temp2[63:0] := DEST[i+63:i] + ZeroExtend64(temp128[103:52]) ;
          DEST[i+63:i] := Temp2[63:0];
    ELSE
          IF *zeroing-masking* THEN

                DEST[i+63:i] := 0;
          ELSE *merge-masking*

                DEST[i+63:i] is unchanged;
          FI;
    FI;
ENDFOR
DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPMADD52HUQ __m128i _mm_madd52hi_avx_epu64 (__m128i __X, __m128i __Y, __m128i __Z);
VPMADD52HUQ __m128i _mm_maskz_madd52hi_epu64( __mmask8 k, __m128i a, __m128i b, __m128i c);
VPMADD52HUQ __m128i _mm_madd52hi_epu64 (__m128i __X, __m128i __Y, __m128i __Z);
VPMADD52HUQ __m128i _mm_madd52hi_epu64( __m128i a, __m128i b, __m128i c);
VPMADD52HUQ __m128i _mm_mask_madd52hi_epu64(__m128i s, __mmask8 k, __m128i a, __m128i b, __m128i c);
VPMADD52HUQ __m256i _mm256_madd52hi_avx_epu64 (__m256i __X, __m256i __Y, __m256i __Z);
VPMADD52HUQ __m256i _mm256_madd52hi_epu64( __m256i a, __m256i b, __m256i c);
VPMADD52HUQ __m256i _mm256_madd52hi_epu64 (__m256i __X, __m256i __Y, __m256i __Z);
VPMADD52HUQ __m256i _mm256_mask_madd52hi_epu64(__m256i s, __mmask8 k, __m256i a, __m256i b, __m256i c);
VPMADD52HUQ __m256i _mm256_maskz_madd52hi_epu64( __mmask8 k, __m256i a, __m256i b, __m256i c);
VPMADD52HUQ __m512i _mm512_madd52hi_epu64( __m512i a, __m512i b, __m512i c);
VPMADD52HUQ __m512i _mm512_mask_madd52hi_epu64(__m512i s, __mmask8 k, __m512i a, __m512i b, __m512i c);
VPMADD52HUQ __m512i _mm512_maskz_madd52hi_epu64( __mmask8 k, __m512i a, __m512i b, __m512i c);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

VEX-encoded 指令,参见表2-21,"第4类例外条件". EVEX-encoded 指令,参见表2-51,"第E4类例外条件".
