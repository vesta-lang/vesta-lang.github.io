---
summary: Perform a Final Calculation for the Next Four SHA256 Message Dwords
---

## Description

The SHA256MSG2 instruction is one of two SHA2 message scheduling instructions. The instruction performs the final calculation for the next four SHA256 message dwords.

## Operation

```text
SHA256MSG2
W14 := SRC2[95:64] ;
W15 := SRC2[127:96] ;
W16 := SRC1[31: 0] + 1( W14) ;
W17 := SRC1[63: 32] + 1( W15) ;
W18 := SRC1[95: 64] + 1( W16) ;
W19 := SRC1[127: 96] + 1( W17) ;

DEST[127:96] := W19 ;
DEST[95:64] := W18 ;
DEST[63:32] := W17 ;
DEST[31:0] := W16;
```

## Intel C/C++ compiler intrinsics

```c
SHA256MSG2 __m128i _mm_sha256msg2_epu32(__m128i, __m128i);
```

## Flags affected

None.

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-21, "Type 4 Class Exception Conditions."
