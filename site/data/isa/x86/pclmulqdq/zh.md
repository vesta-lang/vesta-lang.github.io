---
summary: 承载-减乘法四进制
---

## 说明

进行四字组的无载式乘法。 XMM 版本执行一对单倍数

四义字. YMM版本执行两组装填成倍的四字形. ZMM版本执行4个包装成倍的四字组合. 4位和0位用于选择每个操作数的64位半,按照表4-14使用,其他直接字节的位被忽略.

本指令的EVEX编码形式不支持内存断层压制.

** PCLMULQDQ 直接字节的四字节选择**

| [4] | [0] | PCLMULQDQ 操作 |
| --- | --- | --- |
| 0 | CL_MUL( SRC21[ | 63:0], SRC1[63:0] ) |

** Pseudo-Op 和 PCLMULQDQ 执行 Imm8 编码**

| 修道会 | Imm8 编码 |
| --- | --- |
| PCLMULLQLQDQ xmm1, xmm2 | 0000_0000B |
| PCLMULHQLQDQ xmm1, xmm2 | 0000_0001B |
| PCLMULLQHQDQ xmm1, xmm2 | 0001_0000B |
| PCLMULHQHQDQ xmm1, xmm2 | 0001_0001B |

## 行动

```text
define PCLMUL128(X,Y):             // helper function

   FOR i := 0 to 63:

   TMP [ i ] := X[ 0 ] and Y[ i ]

   FOR j := 1 to i:

           TMP [ i ] := TMP [ i ] xor (X[ j ] and Y[ i - j ])

   DEST[ i ] := TMP[ i ]

   FOR i := 64 to 126:

   TMP [ i ] := 0

   FOR j := i - 63 to 63:

           TMP [ i ] := TMP [ i ] xor (X[ j ] and Y[ i - j ])

   DEST[ i ] := TMP[ i ]

   DEST[127] := 0;

   RETURN DEST                     // 128b vector


PCLMULQDQ (SSE Version)
IF imm8[0] = 0:

    TEMP1 := SRC1.qword[0]
ELSE:

    TEMP1 := SRC1.qword[1]
IF imm8[4] = 0:

    TEMP2 := SRC2.qword[0]
ELSE:

    TEMP2 := SRC2.qword[1]
DEST[127:0] := PCLMUL128(TEMP1, TEMP2)
DEST[MAXVL-1:128] (Unmodified)

VPCLMULQDQ (128b and 256b VEX Encoded Versions)
(KL,VL) = (1,128), (2,256)
FOR i= 0 to KL-1:

    IF imm8[0] = 0:
          TEMP1 := SRC1.xmm[i].qword[0]

    ELSE:
          TEMP1 := SRC1.xmm[i].qword[1]

    IF imm8[4] = 0:
          TEMP2 := SRC2.xmm[i].qword[0]

    ELSE:
          TEMP2 := SRC2.xmm[i].qword[1]

    DEST.xmm[i] := PCLMUL128(TEMP1, TEMP2)
DEST[MAXVL-1:VL] := 0

VPCLMULQDQ (EVEX Encoded Version)
(KL,VL) = (1,128), (2,256), (4,512)
FOR i = 0 to KL-1:

    IF imm8[0] = 0:
          TEMP1 := SRC1.xmm[i].qword[0]

    ELSE:
          TEMP1 := SRC1.xmm[i].qword[1]

    IF imm8[4] = 0:
          TEMP2 := SRC2.xmm[i].qword[0]

    ELSE:
          TEMP2 := SRC2.xmm[i].qword[1]

    DEST.xmm[i] := PCLMUL128(TEMP1, TEMP2)
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
(V)PCLMULQDQ __m128i _mm_clmulepi64_si128 (__m128i, __m128i, const int) VPCLMULQDQ __m256i _mm256_clmulepi64_epi128(__m256i, __m256i, const int);
VPCLMULQDQ __m512i _mm512_clmulepi64_epi128(__m512i, __m512i, const int);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",另外:

```text
#UD               If VEX.L = 1.
```

EVEX 编码 : 参见表2-52"Type E4NF类例外条件".
