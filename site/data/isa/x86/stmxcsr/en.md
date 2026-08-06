---
summary: Store MXCSR Register State
---

## Description

Stores the contents of the MXCSR control and status register to the destination operand. The destination operand is a 32-bit memory location. The reserved bits in the MXCSR register are stored as 0s. This instruction's operation is the same in non-64-bit modes and 64-bit mode. VEX.L must be 0, otherwise instructions will #UD. Note: In VEX-encoded versions, VEX.vvvv is reserved and must be 1111b, otherwise instructions will #UD.

## Operation

```text
m32 := MXCSR;
```

## Intel C/C++ compiler intrinsics

```c
_mm_getcsr(void);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-22, "Type 5 Class Exception Conditions," additionally:

```text
#UD                  If VEX.L= 1,
```

```text
                     If VEX.vvvv  1111B.
```
