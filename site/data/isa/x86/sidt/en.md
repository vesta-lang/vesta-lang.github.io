---
summary: Store Interrupt Descriptor Table Register
---

## Description

Stores the content the interrupt descriptor table register (IDTR) in the destination operand. The destination operand specifies a 6-byte memory location.

In non-64-bit modes, the 16-bit limit field of the register is stored in the low 2 bytes of the memory location and the 32-bit base address is stored in the high 4 bytes.

In 64-bit mode, the operand size fixed at 8+2 bytes. The instruction stores 8-byte base and 2-byte limit values.

SIDT is only useful in operating-system software; however, it can be used in application programs without causing an exception to be generated if CR4.UMIP = 0. See "LGDT/LIDT--Load Global/Interrupt Descriptor Table Register" in Chapter 3, Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 2A, for information on loading the GDTR and IDTR.

## IA-32 architecture compatibility

The 16-bit form of SIDT is compatible with the Intel 286 processor if the upper 8 bits are not referenced. The Intel 286 processor fills these bits with 1s; processor generations later than the Intel 286 processor fill these bits with 0s.

## Operation

```text
IF instruction is SIDT
    THEN
          IF OperandSize =16 or OperandSize = 32 (* Legacy or Compatibility Mode *)
                THEN
                      DEST[0:15] := IDTR(Limit);
                      DEST[16:47] := IDTR(Base); FI; (* Full 32-bit base address stored *)
                ELSE (* 64-bit Mode *)
                      DEST[0:15] := IDTR(Limit);
                      DEST[16:79] := IDTR(Base); (* Full 64-bit base address stored *)
          FI;

FI;
```

## Flags affected

None.
