---
summary: 执行下四个 SM3 信件单词的初始计算
---

## 说明

VSM3MSG1指令是两个SM3消息调度指令之一. 该指令对接下来的四个 SM3 消息单词进行初始计算.

## 行动

```text
define ROL32(dword, n):

    count := n % 32
    dest := (dword << count) | (dword >> (32-count))
    return dest

define P1(x):
    return x ^ ROL32(x, 15) ^ ROL32(x, 23)

VSM3MSG1 SRCDEST, SRC1, SRC2
W[0] := SRC2.dword[0]
W[1] := SRC2.dword[1]
W[2] := SRC2.dword[2]
W[3] := SRC2.dword[3]

W[7] := SRCDEST.dword[0]
W[8] := SRCDEST.dword[1]
W[9] := SRCDEST.dword[2]
W[10] := SRCDEST.dword[3]

W[13] := SRC1.dword[0]
W[14] := SRC1.dword[1]
W[15] := SRC1.dword[2]

TMP0 := W[7] ^ W[0] ^ ROL32(W[13], 15)
TMP1 := W[8] ^ W[1] ^ ROL32(W[14], 15)
TMP2 := W[9] ^ W[2] ^ ROL32(W[15], 15)
TMP3 := W[10] ^ W[3]

SRCDEST.dword[0] := P1(TMP0)
SRCDEST.dword[1] := P1(TMP1)
SRCDEST.dword[2] := P1(TMP2)
SRCDEST.dword[3] := P1(TMP3)
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VSM3MSG1 __m128i _mm_sm3msg1_epi32 (__m128i __A, __m128i __B, __m128i __C);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".
