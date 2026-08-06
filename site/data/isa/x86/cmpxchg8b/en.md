---
summary: Compare and Exchange Bytes
---

## Description

Compares the 64-bit value in EDX:EAX (or 128-bit value in RDX:RAX if operand size is 128 bits) with the operand (destination operand). If the values are equal, the 64-bit value in ECX:EBX (or 128-bit value in RCX:RBX) is stored in the destination operand. Otherwise, the value in the destination operand is loaded into EDX:EAX (or RDX:RAX). The destination operand is an 8-byte memory location (or 16-byte memory location if operand size is 128 bits). For the EDX:EAX and ECX:EBX register pairs, EDX and ECX contain the high-order 32 bits and EAX and EBX contain the low-order 32 bits of a 64-bit value. For the RDX:RAX and RCX:RBX register pairs, RDX and RCX contain the highorder 64 bits and RAX and RBX contain the low-order 64bits of a 128-bit value.

This instruction can be used with a LOCK prefix to allow the instruction to be executed atomically. To simplify the interface to the processor's bus, the destination operand receives a write cycle without regard to the result of the comparison. The destination operand is written back if the comparison fails; otherwise, the source operand is written into the destination. (The processor never produces a locked read without also producing a locked write.)

In 64-bit mode, default operation size is 64 bits. Use of the REX.W prefix promotes operation to 128 bits. Note that CMPXCHG16B requires that the destination (memory) operand be 16-byte aligned. See the summary chart at the beginning of this section for encoding data and limits. For information on the CPUID flag that indicates CMPX- CHG16B, see Chapter 21 in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1.

## IA-32 architecture compatibility

This instruction encoding is not supported on Intel processors earlier than the Pentium processors.

## Operation

```text
IF (64-Bit Mode and OperandSize = 64)
    THEN
          TEMP128 := DEST

        IF (RDX:RAX = TEMP128)

                THEN
                      ZF := 1;
                      DEST := RCX:RBX;

                ELSE
                      ZF := 0;
                      RDX:RAX := TEMP128;
                      DEST := TEMP128;
                      FI;

          FI
    ELSE

          TEMP64 := DEST;

        IF (EDX:EAX = TEMP64)

                THEN
                      ZF := 1;
                      DEST := ECX:EBX;

                ELSE
                      ZF := 0;
                      EDX:EAX := TEMP64;
                      DEST := TEMP64;
                      FI;

          FI;
FI;
```

## Flags affected

The ZF flag is set if the destination operand and EDX:EAX are equal; otherwise it is cleared. The CF, PF, AF, SF, and OF flags are unaffected.
