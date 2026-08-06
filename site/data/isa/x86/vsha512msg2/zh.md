---
summary: 执行下四个 SHA512 信件词的最后计算
---

## 说明

VSHA512MSG2指令是两个SHA512消息调度指令之一. 该指令为下四个 SHA512 信件 qwords 进行最终计算.

见https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf 关于SHA512标准的更多信息.

## 行动

```text
define ROR64(qword, n):

    count := n % 64
    dest := (qword >> count) | (qword << (64-count))
    return dest

define SHR64(qword, n):
    return qword >> n

define s1(qword):
    return ROR64(qword,19) ^ ROR64(qword, 61) ^ SHR64(qword, 6)

VSHA512MSG2 SRCDEST, SRC1
W[14] := SRC1.qword[2]
W[15] := SRC1.qword[3]
W[16] := SRCDEST.qword[0] + s1(W[14])
W[17] := SRCDEST.qword[1] + s1(W[15])
W[18] := SRCDEST.qword[2] + s1(W[16])
W[19] := SRCDEST.qword[3] + s1(W[17])

SRCDEST.qword[3] := W[19]
SRCDEST.qword[2] := W[18]
SRCDEST.qword[1] := W[17]
SRCDEST.qword[0] := W[16]
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VSHA512MSG2 __m256i _mm256_sha512msg2_epi64 (__m256i __A, __m256i __B);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-23"第6类例外条件".
