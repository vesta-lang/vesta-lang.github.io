---
summary: Move Doubleword/Move Quadword
---

## Description

Copies a doubleword from the source operand (second operand) to the destination operand (first operand). The source and destination operands can be general-purpose registers, MMX technology registers, XMM registers, or 32-bit memory locations. This instruction can be used to move a doubleword to and from the low doubleword of an MMX technology register and a general-purpose register or a 32-bit memory location, or to and from the low doubleword of an XMM register and a general-purpose register or a 32-bit memory location. The instruction cannot be used to transfer data between MMX technology registers, between XMM registers, between general-purpose registers, or between memory locations.

When the destination operand is an MMX technology register, the source operand is written to the low doubleword of the register, and the register is zero-extended to 64 bits. When the destination operand is an XMM register, the source operand is written to the low doubleword of the register, and the register is zero-extended to 128 bits.

In 64-bit mode, the instruction's default operation size is 32 bits. Use of the REX.B prefix permits access to additional registers (R8-R15). Use of the REX.W prefix promotes operation to 64 bits. See the summary chart at the beginning of this section for encoding data and limits.

MOVD/Q with XMM destination:

Moves a dword/qword integer from the source operand and stores it in the low 32/64-bits of the destination XMM register. The upper bits of the destination are zeroed. The source operand can be a 32/64-bit register or 32/64-bit memory location.

128-bit Legacy SSE version: Bits (MAXVL-1:128) of the corresponding YMM destination register remain unchanged. Qword operation requires the use of REX.W=1.

VEX.128 encoded version: Bits (MAXVL-1:128) of the destination register are zeroed. Qword operation requires the use of VEX.W=1.

EVEX.128 encoded version: Bits (MAXVL-1:128) of the destination register are zeroed. Qword operation requires the use of EVEX.W=1.

MOVD/Q with 32/64 reg/mem destination:

Stores the low dword/qword of the source XMM register to 32/64-bit memory location or general-purpose register. Qword operation requires the use of REX.W=1, VEX.W=1, or EVEX.W=1.

Note: VEX.vvvv and EVEX.vvvv are reserved and must be 1111b otherwise instructions will #UD.

If VMOVD or VMOVQ is encoded with VEX.L= 1, an attempt to execute the instruction encoded with VEX.L= 1 will cause an #UD exception.

## Operation

```text
MOVD (When Destination Operand is an MMX Technology Register)

    DEST[31:0] := SRC;
    DEST[63:32] := 00000000H;

MOVD (When Destination Operand is an XMM Register)
    DEST[31:0] := SRC;
    DEST[127:32] := 000000000000000000000000H;
    DEST[MAXVL-1:128] (Unmodified)

MOVD (When Source Operand is an MMX Technology or XMM Register)
    DEST := SRC[31:0];


VMOVD (VEX-Encoded Version when Destination is an XMM Register)
    DEST[31:0] := SRC[31:0]
    DEST[MAXVL-1:32] := 0

MOVQ (When Destination Operand is an XMM Register)
    DEST[63:0] := SRC[63:0];
    DEST[127:64] := 0000000000000000H;
    DEST[MAXVL-1:128] (Unmodified)

MOVQ (When Destination Operand is r/m64)
    DEST[63:0] := SRC[63:0];

MOVQ (When Source Operand is an XMM Register or r/m64)
    DEST := SRC[63:0];

VMOVQ (VEX-Encoded Version When Destination is an XMM Register)
    DEST[63:0] := SRC[63:0]
    DEST[MAXVL-1:64] := 0

VMOVD (EVEX-Encoded Version When Destination is an XMM Register)
DEST[31:0] := SRC[31:0]
DEST[MAXVL-1:32] := 0

VMOVQ (EVEX-Encoded Version When Destination is an XMM Register)
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0
```

## Intel C/C++ compiler intrinsics

```c
MOVD __m64 _mm_cvtsi32_si64 (int i ) MOVD int _mm_cvtsi64_si32 ( __m64m ) MOVD __m128i _mm_cvtsi32_si128 (int a) MOVD int _mm_cvtsi128_si32 ( __m128i a) MOVQ __int64 _mm_cvtsi128_si64(__m128i);
MOVQ __m128i _mm_cvtsi64_si128(__int64);
VMOVD __m128i _mm_cvtsi32_si128( int);
VMOVD int _mm_cvtsi128_si32( __m128i );
VMOVQ __m128i _mm_cvtsi64_si128 (__int64);
VMOVQ __int64 _mm_cvtsi128_si64(__m128i );
VMOVQ __m128i _mm_loadl_epi64( __m128i * s);
VMOVQ void _mm_storel_epi64( __m128i * d, __m128i s);
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
#UD               If VEX.L = 1.
```

If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
