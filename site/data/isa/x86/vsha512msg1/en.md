---
summary: Perform an Intermediate Calculation for the Next Four SHA512 Message
---

## Description

The VSHA512MSG1 instruction is one of the two SHA512 message scheduling instructions. The instruction performs an intermediate calculation for the next four SHA512 message qwords.

See https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf for more information on the SHA512 standard.

## Operation

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

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
VSHA512MSG1 __m256i _mm256_sha512msg1_epi64 (__m256i __A, __m128i __B);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-23, "Type 6 Class Exception Conditions."
