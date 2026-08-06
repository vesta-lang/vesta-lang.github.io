---
summary: 比较平等包装的词组数据
---

## 说明

执行 SIMD 比较 目标操作数 (第一个 操作数) 和 源操作数 (第二个 操作数) 中包装的四字的等值. 如果一对数据元素相等,则目的地中相应的数据元素设定为所有1s;否则,设定为0s.

128位遗产 SSE 版本 : 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 第一个来源和目标操作数是XMM登记册. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 第一个来源和目标操作数是XMM登记册. 对应的YMM注册被清零的位数(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册.

EVEX 编码为 VPCMPEQQ : 第一源操作数(第二个操作数)是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位向量从64位内存位置广播. 目标操作数(第一个操作数)是一个根据写掩码 k2更新的面具寄存器.

## 行动

```text
PCMPEQQ (With 128-bit Operands)
IF (DEST[63:0] = SRC[63:0])

    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;


    ELSE DEST[63:0] := 0; FI;
IF (DEST[127:64] = SRC[127:64])

    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0; FI;
DEST[MAXVL-1:128] (Unmodified)

COMPARE_QWORDS_EQUAL (SRC1, SRC2)
    IF SRC1[63:0] = SRC2[63:0]
    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[63:0] := 0; FI;
    IF SRC1[127:64] = SRC2[127:64]
    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0; FI;

VPCMPEQQ (VEX.128 Encoded Version)
DEST[127:0] := COMPARE_QWORDS_EQUAL(SRC1,SRC2)
DEST[MAXVL-1:128] := 0

VPCMPEQQ (VEX.256 Encoded Version)
DEST[127:0] := COMPARE_QWORDS_EQUAL(SRC1[127:0],SRC2[127:0])
DEST[255:128] := COMPARE_QWORDS_EQUAL(SRC1[255:128],SRC2[255:128])
DEST[MAXVL-1:256] := 0

VPCMPEQQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k2[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN CMP := SRC1[i+63:i] = SRC2[63:0];

                  ELSE CMP := SRC1[i+63:i] = SRC2[i+63:i];

             FI;

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                        ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ 内在编译器

```c
VPCMPEQQ __mmask8 _mm512_cmpeq_epi64_mask( __m512i a, __m512i b);
VPCMPEQQ __mmask8 _mm512_mask_cmpeq_epi64_mask(__mmask8 k, __m512i a, __m512i b);
VPCMPEQQ __mmask8 _mm256_cmpeq_epi64_mask( __m256i a, __m256i b);
VPCMPEQQ __mmask8 _mm256_mask_cmpeq_epi64_mask(__mmask8 k, __m256i a, __m256i b);
VPCMPEQQ __mmask8 _mm_cmpeq_epi64_mask( __m128i a, __m128i b);
VPCMPEQQ __mmask8 _mm_mask_cmpeq_epi64_mask(__mmask8 k, __m128i a, __m128i b);
(V)PCMPEQQ __m128i _mm_cmpeq_epi64(__m128i a, __m128i b);
VPCMPEQQ __m256i _mm256_cmpeq_epi64( __m256i a, __m256i b);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21,"第4类例外条件". EVEX-encoded VPCMPEQQ,参见表2-51,"第E4类例外条件".
