---
summary: Output String to Port
---

## Description

Copies data from the source operand (second operand) to the I/O port specified with the destination operand (first operand). The source operand is a memory location, the address of which is read from either the DS:SI, DS:ESI or the RSI registers (depending on the address-size attribute of the instruction, 16, 32 or 64, respectively). (The DS segment may be overridden with a segment override prefix.) The destination operand is an I/O port address (from 0 to 65,535) that is read from the DX register. The size of the I/O port being accessed (that is, the size of the source and destination operands) is determined by the opcode for an 8-bit I/O port or by the operand-size attribute of the instruction for a 16-or 32-bit I/O port.

At the assembly-code level, two forms of this instruction are allowed: the "explicit-operands" form and the "nooperands" form. The explicit-operands form (specified with the OUTS mnemonic) allows the source and destination operands to be specified explicitly. Here, the source operand should be a symbol that indicates the size of the I/O port and the source address, and the destination operand must be DX. This explicit-operands form is provided to allow documentation; however, note that the documentation provided by this form can be misleading. That is, the source operand symbol must specify the correct type (size) of the operand (byte, word, or doubleword), but it does not have to specify the correct location. The location is always specified by the DS:(E)SI or RSI registers, which must be loaded correctly before the OUTS instruction is executed.

The no-operands form provides "short forms" of the byte, word, and doubleword versions of the OUTS instructions. Here also DS:(E)SI is assumed to be the source operand and DX is assumed to be the destination operand. The size of the I/O port is specified with the choice of mnemonic: OUTSB (byte), OUTSW (word), or OUTSD (doubleword).

After the byte, word, or doubleword is transferred from the memory location to the I/O port, the SI/ESI/RSI register is incremented or decremented automatically according to the setting of the DF flag in the EFLAGS register. (If the DF flag is 0, the (E)SI register is incremented; if the DF flag is 1, the SI/ESI/RSI register is decremented.) The SI/ESI/RSI register is incremented or decremented by 1 for byte operations, by 2 for word operations, and by 4 for doubleword operations.

The OUTS, OUTSB, OUTSW, and OUTSD instructions can be preceded by the REP prefix for block input of ECX bytes, words, or doublewords. See "REP/REPE/REPZ /REPNE/REPNZ--Repeat String Operation Prefix" in this

chapter for a description of the REP prefix. This instruction is only useful for accessing I/O ports located in the processor's I/O address space. See Chapter 20, "Input/Output," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1, for more information on accessing I/O ports in the I/O address space.

In 64-bit mode, the default operand size is 32 bits; operand size is not promoted by the use of REX.W. In 64-bit mode, the default address size is 64 bits, and 64-bit address is specified using RSI by default. 32-bit address using ESI is support using the prefix 67H, but 16-bit address is not supported in 64-bit mode.

## IA-32 architecture compatibility

After executing an OUTS, OUTSB, OUTSW, or OUTSD instruction, the Pentium processor ensures that the EWBE# pin has been sampled active before it begins to execute the next instruction. (Note that the instruction can be prefetched if EWBE# is not active, but it will not be executed until the EWBE# pin is sampled active.) Only the Pentium processor family has the EWBE# pin.

For the Pentium 4, Intel(R) Xeon(R), and P6 processor family, upon execution of an OUTS, OUTSB, OUTSW, or OUTSD instruction, the processor will not execute the next instruction until the data phase of the transaction is complete.

## Operation

```text
IF ((PE = 1) and ((CPL > IOPL) or (VM = 1)))
    THEN (* Protected mode with CPL > IOPL or virtual-8086 mode *)
         IF (Any I/O Permission Bit for I/O port being accessed = 1)
                THEN (* I/O operation is not allowed *)
                      #GP(0);
                ELSE (* I/O operation is allowed *)
                      DEST := SRC; (* Writes to I/O port *)
          FI;
    ELSE (Real Mode or Protected Mode or 64-Bit Mode with CPL  IOPL *)
          DEST := SRC; (* Writes to I/O port *)

FI;

Byte transfer:
    IF 64-bit mode
          Then
                IF 64-Bit Address Size
                      THEN
                          IF DF = 0
                                  THEN RSI := RSI RSI + 1;
                                  ELSE RSI := RSI or  1;
                            FI;
                      ELSE (* 32-Bit Address Size *)
                          IF DF = 0
                                  THEN ESI := ESI + 1;
                                  ELSE ESI := ESI  1;
                            FI;
                FI;
          ELSE
               IF DF = 0
                      THEN (E)SI := (E)SI + 1;
                      ELSE (E)SI := (E)SI  1;
                FI;
    FI;

Word transfer:
    IF 64-bit mode
          Then
                IF 64-Bit Address Size


                      THEN
                          IF DF = 0
                                  THEN RSI := RSI RSI + 2;
                                  ELSE RSI := RSI or  2;

                            FI;

                      ELSE (* 32-Bit Address Size *)
                          IF DF = 0
                                  THEN ESI := ESI + 2;
                                  ELSE ESI := ESI  2;

                            FI;

                FI;

          ELSE
               IF DF = 0
                      THEN (E)SI := (E)SI + 2;
                      ELSE (E)SI := (E)SI  2;

                FI;

    FI;

Doubleword transfer:

    IF 64-bit mode

          Then

                IF 64-Bit Address Size

                      THEN
                          IF DF = 0
                                  THEN RSI := RSI RSI + 4;
                                  ELSE RSI := RSI or  4;

                            FI;

                      ELSE (* 32-Bit Address Size *)
                          IF DF = 0
                                  THEN ESI := ESI + 4;
                                  ELSE ESI := ESI  4;

                            FI;

                FI;

          ELSE
               IF DF = 0
                      THEN (E)SI := (E)SI + 4;
                      ELSE (E)SI := (E)SI  4;

                FI;

    FI;
```

## Flags affected

None.
