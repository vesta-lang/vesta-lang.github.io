---
summary: 对下四张 SHA512 信件进行中间计算
---

## 说明

VSHA512MSG1指令是两个SHA512消息调度指令之一. 该指令对接下来的4个SHA512消息qwords进行中间计算.

见https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf 关于SHA512标准的更多信息.

## 行动

```text
define ROR64(qword, n):

    count := n % 64
    dest := (qword >> count) | (qword << (64-count))
    return dest

define SHR64(qword, n):
    return qword >> n

define s0(qword):
    return ROR64(qword,1) ^ ROR64(qword, 8) ^ SHR64(qword, 7)

VSHA512MSG1 SRCDEST, SRC1
W[4] := SRC1.qword[0]
W[3] := SRCDEST.qword[3]
W[2] := SRCDEST.qword[2]
W[1] := SRCDEST.qword[1]
W[0] := SRCDEST.qword[0]

SRCDEST.qword[3] := W[3] + s0(W[4])
SRCDEST.qword[2] := W[2] + s0(W[3])
SRCDEST.qword[1] := W[1] + s0(W[2])
SRCDEST.qword[0] := W[0] + s0(W[1])
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VSHA512MSG1 __m256i _mm256_sha512msg1_epi64 (__m256i __A, __m128i __B);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-23"第6类例外条件".
