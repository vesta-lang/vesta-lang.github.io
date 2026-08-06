---
summary: Extract Byte/Dword/Qword
---

## Description

Extract a byte/dword/qword integer value from the source XMM register at a byte/dword/qword offset determined from imm8[3:0]. The destination can be a register or byte/dword/qword memory location. If the destination is a register, the upper bits of the register are zero extended.

In legacy non-VEX encoded version and if the destination operand is a register, the default operand size in 64-bit mode for PEXTRB/PEXTRD is 64 bits, the bits above the least significant byte/dword data are filled with zeros. PEXTRQ is not encodable in non-64-bit modes and requires REX.W in 64-bit mode.

Note: In VEX.128 encoded versions, VEX.vvvv is reserved and must be 1111b, VEX.L must be 0, otherwise the instruction will #UD. In EVEX.128 encoded versions, EVEX.vvvv is reserved and must be 1111b, EVEX.L"L must be 0, otherwise the instruction will #UD. If the destination operand is a register, the default operand size in 64-bit mode for VPEXTRB/VPEXTRD is 64 bits, the bits above the least significant byte/word/dword data are filled with zeros.

## Operation

```text
CASE of
    PEXTRB: SEL := COUNT[3:0];
                TEMP := (Src >> SEL*8) AND FFH;
                IF (DEST = Mem8)
                       THEN
                       Mem8 := TEMP[7:0];
                ELSE IF (64-Bit Mode and 64-bit register selected)
                       THEN
                             R64[7:0] := TEMP[7:0];
                             r64[63:8] := ZERO_FILL; };
                ELSE
                             R32[7:0] := TEMP[7:0];
                             r32[31:8] := ZERO_FILL; };
                FI;
    PEXTRD:SEL := COUNT[1:0];
                TEMP := (Src >> SEL*32) AND FFFF_FFFFH;
                DEST := TEMP;
    PEXTRQ: SEL := COUNT[0];
                TEMP := (Src >> SEL*64);
                DEST := TEMP;

EASC:

VPEXTRTD/VPEXTRQ
IF (64-Bit Mode and 64-bit dest operand)
THEN

    Src_Offset := imm8[0]
    r64/m64 := (Src >> Src_Offset * 64)
ELSE
    Src_Offset := imm8[1:0]
    r32/m32 := ((Src >> Src_Offset *32) AND 0FFFFFFFFh);
FI

VPEXTRB ( dest=m8)
SRC_Offset := imm8[3:0]
Mem8 := (Src >> Src_Offset*8)

VPEXTRB ( dest=reg)
IF (64-Bit Mode )
THEN

    SRC_Offset := imm8[3:0]
    DEST[7:0] := ((Src >> Src_Offset*8) AND 0FFh)
    DEST[63:8] := ZERO_FILL;
ELSE
    SRC_Offset := imm8[3:0];
    DEST[7:0] := ((Src >> Src_Offset*8) AND 0FFh);
    DEST[31:8] := ZERO_FILL;
FI
```

## Intel C/C++ compiler intrinsics

```c
PEXTRB int _mm_extract_epi8 (__m128i src, const int ndx);
PEXTRD int _mm_extract_epi32 (__m128i src, const int ndx);
PEXTRQ __int64 _mm_extract_epi64 (__m128i src, const int ndx);
```

## Flags affected

None.

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

Non-EVEX-encoded instruction, see Table 2-22, "Type 5 Class Exception Conditions."

EVEX-encoded instruction, see Table 2-59, "Type E9NF Class Exception Conditions."

Additionally:

```text
#UD               If VEX.L = 1 or EVEX.L'L > 0.
```

If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
