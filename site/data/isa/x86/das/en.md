---
summary: Decimal Adjust AL After Subtraction
---

## Description

Adjusts the result of the subtraction of two packed BCD values to create a packed BCD result. The AL register is the implied source and destination operand. The DAS instruction is only useful when it follows a SUB instruction that subtracts (binary subtraction) one 2-digit, packed BCD value from another and stores a byte result in the AL register. The DAS instruction then adjusts the contents of the AL register to contain the correct 2-digit, packed BCD result. If a decimal borrow is detected, the CF and AF flags are set accordingly.

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
                    AL := AL - 6;

                  CF := old_CF or (Borrow from AL := AL - 6);

                      AF := 1;
                ELSE

                      AF := 0;
          FI;
         IF ((old_AL > 99H) or (old_CF = 1))

                 THEN

                  AL := AL - 60H;

                      CF := 1;
          FI;
FI;

Example     Before: AL = 35H, BL = 47H, EFLAGS(OSZAPC) = XXXXXX
SUB AL, BL  After: AL = EEH, BL = 47H, EFLAGS(0SZAPC) = 010111
            Before: AL = EEH, BL = 47H, EFLAGS(OSZAPC) = 010111
DAA         After: AL = 88H, BL = 47H, EFLAGS(0SZAPC) = X10111
```

## Flags affected

The CF and AF flags are set if the adjustment of the value results in a decimal borrow in either digit of the result (see the "Operation" section above). The SF, ZF, and PF flags are set according to the result. The OF flag is undefined.
