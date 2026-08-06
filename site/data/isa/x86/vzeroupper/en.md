---
summary: Zero Upper Bits of YMM and ZMM Registers
---

## Description

In 64-bit mode, the instruction zeroes the bits in positions 128 and higher in YMM0-YMM15 and ZMM0-ZMM15. Outside 64-bit mode, it zeroes those bits only in YMM0-YMM7 and ZMM0-ZMM7. VZEROUPPER does not modify the lower 128 bits of these registers and it does not modify ZMM16-ZMM31.

This instruction is recommended when transitioning between AVX and legacy SSE code; it will eliminate performance penalties caused by false dependencies.

Note: VEX.vvvv is reserved and must be 1111b otherwise instructions will #UD. In Compatibility and legacy 32-bit mode only the lower 8 registers are modified.

## Operation

```text
simd_reg_file[][] is a two dimensional array representing the SIMD register file containing all the overlapping xmm, ymm, and zmm
registers present in that implementation. The major dimension is the register number: 0 for xmm0, ymm0, and zmm0; 1 for xmm1,
ymm1, and zmm1; etc. The minor dimension size is the width of the implemented SIMD state measured in bits.

VZEROUPPER
IF (64-bit mode)

    limit :=15
ELSE

    limit := 7
FOR i in 0 .. limit:

    simd_reg_file[i][MAXVL-1:128] := 0
```

## Intel C/C++ compiler intrinsics

```c
VZEROUPPER: _mm256_zeroupper();
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-25, "Type 8 Class Exception Conditions."

CHAPTER 6

6.1 INSTRUCTIONS (W-Z)

Chapter 6 continues an alphabetical discussion of Intel(R) 64 and IA-32 instructions (W-Z). See also: Chapter 3, "Instruction Set Reference, A-L," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 2A; Chapter 4, "Instruction Set Reference, M-U," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 2B; and Chapter 5, "Instruction Set Reference, V," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 2D.
