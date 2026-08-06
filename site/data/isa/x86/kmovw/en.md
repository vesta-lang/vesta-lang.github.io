---
summary: Move From and to Mask Registers
---

## Description

Copies values from the source operand (second operand) to the destination operand (first operand). The source and destination operands can be mask registers, memory location or general purpose. The instruction cannot be used to transfer data between general purpose registers and or memory locations.

When moving to a mask register, the result is zero extended to MAX_KL size (i.e., 64 bits currently). When moving to a general-purpose register (GPR), the result is zero-extended to the size of the destination. In 32-bit mode, the default GPR destination's size is 32 bits. In 64-bit mode, the default GPR destination's size is 64 bits. Note that VEX.W can only be used to modify the size of the GPR operand in 64b mode.

## Operation

```text
KMOVW
IF *destination is a memory location*

    DEST[15:0] := SRC[15:0]
IF *destination is a mask register or a GPR *

    DEST := ZeroExtension(SRC[15:0])

KMOVB
IF *destination is a memory location*

    DEST[7:0] := SRC[7:0]
IF *destination is a mask register or a GPR *

    DEST := ZeroExtension(SRC[7:0])

KMOVQ
IF *destination is a memory location or a GPR*

    DEST[63:0] := SRC[63:0]
IF *destination is a mask register*

    DEST := ZeroExtension(SRC[63:0])

KMOVD
IF *destination is a memory location*

    DEST[31:0] := SRC[31:0]
IF *destination is a mask register or a GPR *

    DEST := ZeroExtension(SRC[31:0])
```

## Intel C/C++ compiler intrinsics

```c
KMOVW __mmask16 _mm512_kmov(__mmask16 a);
```

## Flags affected

None.

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

Instructions with RR operand encoding, see Table 2-65, "TYPE K20 Exception Definition (VEX-Encoded OpMask Instructions w/o Memory Arg)." Instructions with RM or MR operand encoding, see Table 2-66, "TYPE K21 Exception Definition (VEX-Encoded OpMask Instructions Addressing Memory)."
