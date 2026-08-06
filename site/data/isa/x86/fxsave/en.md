---
summary: Save x87 FPU, MMX Technology, and SSE State
---

## Description

Saves the current state of the x87 FPU, MMX technology, XMM, and MXCSR registers to a 512-byte memory location specified in the destination operand. The content layout of the 512 byte region depends on whether the processor is operating in non-64-bit operating modes or 64-bit sub-mode of IA-32e mode.

Bytes 464:511 are available to software use. The processor does not write to bytes 464:511 of an FXSAVE area.

The operation of FXSAVE in non-64-bit modes is described first.

Non-64-Bit Mode Operation

Table 3-45 shows the layout of the state information in memory when the processor is operating in legacy modes.

**Non-64-Bit-Mode Layout of FXSAVE and FXRSTOR Memory Region**

| 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rsvd |  | FCS |  |  | FIP[31:0] |  |  | FOP | Rsvd | FTW |  | FSW |  |  | FCW           0 |

**Non-64-Bit-Mode Layout of FXSAVE and FXRSTOR Memory Region (Contd.)**

| 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rsvd |  | FCS |  |  | FIP[31:0] |  |  | FOP | Rsvd | FTW |  | FSW |  |  | FCW           0 |

**Recreating FSAVE Format**

| Exponent | Exponent | Fraction | J and M | FTW | valid | bit |
| --- | --- | --- | --- | --- | --- | --- |
| all 1's | all 0's | all 0's | bits |  |  | x87 FTW |
| 0 | 0 | 0 | 0x |  | 1 | Special                  10 |
| 0 | 0 | 0 | 1x |  | 1 | Valid                    00 |
| 0 | 0 | 1 | 00 |  | 1 | Special                  10 |
| 0 | 0 | 1 | 10 |  | 1 | Valid                    00 |
| 0 | 1 | 0 | 0x |  | 1 | Special                  10 |
| 0 | 1 | 0 | 1x |  | 1 | Special                  10 |
| 0 | 1 | 1 | 00 |  | 1 | Zero                     01 |
| 0 | 1 | 1 | 10 |  | 1 | Special                  10 |
| 1 | 0 | 0 | 1x |  | 1 | Special                  10 |
| 1 | 0 | 0 | 1x |  | 1 | Special                  10 |
| 1 | 0 | 1 | 00 |  | 1 | Special                  10 |
| 1 | 0 | 1 | 10 |  | 1 | Special                  10 |

**Layout of the 64-Bit Mode FXSAVE64 Map (Requires REX.W = 1)**

| 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  | FIP |  |  |  |  | FOP |  | Reserved  FT | W | FSW |  | FCW | 0 |

**Layout of the 64-Bit Mode FXSAVE Map (REX.W = 0)**

| 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rese | rved | FCS |  |  | FIP[31: | 0] |  | FOP |  | Reserved | FTW | FSW |  | FCW | 0 |
|  | MXCSR_ | MASK |  |  | MXCSR |  |  | Reserved |  | FDS |  |  | FDP[31:0] |  | 16 |

## Operation

```text
IF 64-Bit Mode
    THEN
          IF REX.W = 1
                THEN
                      DEST := Save64BitPromotedFxsave(x87 FPU, MMX, XMM15-XMM0,
                      MXCSR);
                ELSE
                      DEST := Save64BitDefaultFxsave(x87 FPU, MMX, XMM15-XMM0, MXCSR);
          FI;
    ELSE
          DEST := SaveLegacyFxsave(x87 FPU, MMX, XMM7-XMM0, MXCSR);

FI;
```
