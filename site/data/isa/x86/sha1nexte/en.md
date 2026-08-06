---
summary: Calculate SHA1 State Variable E After Four Rounds
---

## Description

The SHA1NEXTE calculates the SHA1 state variable E after four rounds of operation from the current SHA1 state variable A in the destination operand. The calculated value of the SHA1 state variable E is added to the source operand, which contains the scheduled dwords.

## Operation

```text
SHA1NEXTE
TMP := (SRC1[127:96] ROL 30);

DEST[127:96] := SRC2[127:96] + TMP;
DEST[95:64] := SRC2[95:64];
DEST[63:32] := SRC2[63:32];
DEST[31:0] := SRC2[31:0];
```

## Intel C/C++ compiler intrinsics

```c
SHA1NEXTE __m128i _mm_sha1nexte_epu32(__m128i, __m128i);
```

## Flags affected

None.

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-21, "Type 4 Class Exception Conditions."
