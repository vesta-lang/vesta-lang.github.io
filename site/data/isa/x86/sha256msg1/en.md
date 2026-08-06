---
summary: Perform an Intermediate Calculation for the Next Four SHA256 Message
---

## Description

The SHA256MSG1 instruction is one of two SHA256 message scheduling instructions. The instruction performs an intermediate calculation for the next four SHA256 message dwords.

## Operation

```text
SHA256MSG1
W4 := SRC2[31: 0] ;
W3 := SRC1[127:96] ;
W2 := SRC1[95:64] ;
W1 := SRC1[63: 32] ;
W0 := SRC1[31: 0] ;

DEST[127:96] := W3 + 0( W4);
DEST[95:64] := W2 + 0( W3);
DEST[63:32] := W1 + 0( W2);
DEST[31:0] := W0 + 0( W1);
```

## Intel C/C++ compiler intrinsics

```c
SHA256MSG1 __m128i _mm_sha256msg1_epu32(__m128i, __m128i);
```

## Flags affected

None.

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-21, "Type 4 Class Exception Conditions."
