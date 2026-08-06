---
summary: 执行 AES 解密流程的一回合
---

## 说明

本指令使用等效反向塞弗进行AES解密流的单回合,使用来自第一源操作数的128位数据(状态)与来自第二源操作数的密钥(矢量长度)圆,并存储结果为目标操作数.

使用 AESDEC 指令除最后一个解密回合外的所有对象。 对于最后一个解密回合,使用AESDE-CLAST指令.

VEX和EVEX编码的指令版本允许3-操作数(无损)操作. 指令的遗留编码版本要求第一源操作数和目标操作数是相同的,必须是一个XMM的登记册.

本指令的EVEX编码形式不支持内存断层压制.

## 行动

```text
AESDEC
STATE := SRC1;
RoundKey := SRC2;
STATE := InvShiftRows( STATE );
STATE := InvSubBytes( STATE );
STATE := InvMixColumns( STATE );
DEST[127:0] := STATE XOR RoundKey;
DEST[MAXVL-1:128] (Unmodified)

VAESDEC (128b and 256b VEX Encoded Versions)
(KL,VL) = (1,128), (2,256)
FOR i = 0 to KL-1:

    STATE := SRC1.xmm[i]
    RoundKey := SRC2.xmm[i]
    STATE := InvShiftRows( STATE )
    STATE := InvSubBytes( STATE )
    STATE := InvMixColumns( STATE )
    DEST.xmm[i] := STATE XOR RoundKey
DEST[MAXVL-1:VL] := 0

VAESDEC (EVEX Encoded Version)
(KL,VL) = (1,128), (2,256), (4,512)
FOR i = 0 to KL-1:

    STATE := SRC1.xmm[i]
    RoundKey := SRC2.xmm[i]
    STATE := InvShiftRows( STATE )
    STATE := InvSubBytes( STATE )
    STATE := InvMixColumns( STATE )
    DEST.xmm[i] := STATE XOR RoundKey
DEST[MAXVL-1:VL] :=0
```

## Intel C/C++ 内在编译器

```c
(V)AESDEC __m128i _mm_aesdec (__m128i, __m128i) VAESDEC __m256i _mm256_aesdec_epi128(__m256i, __m256i);
VAESDEC __m512i _mm512_aesdec_epi128(__m512i, __m512i);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".

EVEX 编码 : 参见表2-52"Type E4NF类例外条件".
