---
summary: Decimal Adjust AL After Addition
---

## Description

Adjusts the sum of two packed BCD values to create a packed BCD result. The AL register is the implied source and destination operand. The DAA instruction is only useful when it follows an ADD instruction that adds (binary addition) two 2-digit, packed BCD values and stores a byte result in the AL register. The DAA instruction then adjusts the contents of the AL register to contain the correct 2-digit, packed BCD result. If a decimal carry is detected, the CF and AF flags are set accordingly.

This instruction executes as described above in compatibility mode and legacy mode. It is not valid in 64-bit mode.

## Operation

```text
IF 64-Bit Mode
    THEN
          #UD;
    ELSE
          old_AL := AL;
          old_CF := CF;
          CF := 0;

        IF (((AL AND 0FH) > 9) or AF = 1)

                 THEN
                     AL := AL + 6;
                     CF := old_CF or (Carry from AL := AL + 6);
                       AF := 1;

                 ELSE
                       AF := 0;

          FI;
         IF ((old_AL > 99H) or (old_CF = 1))

                THEN
                     AL := AL + 60H;
                       CF := 1;

                ELSE
                       CF := 0;

          FI;
FI;

Example     Before: AL=79H BL=35H EFLAGS(OSZAPC)=XXXXXX
ADD AL, BL  After: AL=AEH BL=35H EFLAGS(0SZAPC)=110000
            Before: AL=AEH BL=35H EFLAGS(OSZAPC)=110000
DAA         After: AL=14H BL=35H EFLAGS(0SZAPC)=X00111
            Before: AL=2EH BL=35H EFLAGS(OSZAPC)=110000
DAA         After: AL=34H BL=35H EFLAGS(0SZAPC)=X00101
```

## Flags affected

The CF and AF flags are set if the adjustment of the value results in a decimal carry in either digit of the result (see the "Operation" section above). The SF, ZF, and PF flags are set according to the result. The OF flag is undefined.
