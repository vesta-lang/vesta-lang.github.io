---
summary: 执行 AES 加密流程的一回合
---

## 说明

本指令执行 AES 加密流的单回合,使用来自第一个源操作的1/2/4(视矢量长度而定)128位数据(状态),使用来自第二个源操作的1/2/4(视矢量长度而定)圆键,并将结果存储在目的地操作中.

除最后的加密回合外, 使用 AESENC 指令 。 对于最后一个加密回合,使用AESENC-CLAST指令.

VEX和EVEX编码的指令版本允许3-操作数(无损)操作. 指令的遗留编码版本要求第一源操作数和目标操作数是相同的,必须是一个XMM的登记册.

本指令的EVEX编码形式不支持内存断层压制.

## 行动

```text
AESENC
STATE := SRC1;
RoundKey := SRC2;
STATE := ShiftRows( STATE );
STATE := SubBytes( STATE );
STATE := MixColumns( STATE );
DEST[127:0] := STATE XOR RoundKey;
DEST[MAXVL-1:128] (Unmodified)

VAESENC (128b and 256b VEX Encoded Versions)
(KL,VL) = (1,128), (2,256)
FOR I := 0 to KL-1:

    STATE := SRC1.xmm[i]
    RoundKey := SRC2.xmm[i]
    STATE := ShiftRows( STATE )
    STATE := SubBytes( STATE )
    STATE := MixColumns( STATE )
    DEST.xmm[i] := STATE XOR RoundKey
DEST[MAXVL-1:VL] := 0

VAESENC (EVEX Encoded Version)
(KL,VL) = (1,128), (2,256), (4,512)
FOR i := 0 to KL-1:

    STATE := SRC1.xmm[i] // xmm[i] is the i'th xmm word in the SIMD register
    RoundKey := SRC2.xmm[i]
    STATE := ShiftRows( STATE )
    STATE := SubBytes( STATE )
    STATE := MixColumns( STATE )
    DEST.xmm[i] := STATE XOR RoundKey
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
(V)AESENC __m128i _mm_aesenc (__m128i, __m128i) VAESENC __m256i _mm256_aesenc_epi128(__m256i, __m256i);
VAESENC __m512i _mm512_aesenc_epi128(__m512i, __m512i);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".

EVEX 编码 : 参见表2-52"Type E4NF类例外条件".
