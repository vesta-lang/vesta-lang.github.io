---
summary: Move Bounds
---

## Description

BNDMOV moves a pair of lower and upper bound values from the source operand (the second operand) to the destination (the first operand). Each operation is 128-bit move. The exceptions are same as the MOV instruction. The memory format for loading/store bounds in 64-bit mode is shown in Figure 3-5.

```text
                     Upper Bound (UB)             Lower Bound (LB)                     BNDMOV to memory in 64-bit mode
                     16                                             8                                           0 Byte offset
```

```text
             Upper Bound (UB)                     Lower Bound (LB)                     BNDMOV to memory in 32-bit mode
             16                                                     8
                                                                                    4      0 Byte offset
```

Figure 3-5. Memory Layout of BNDMOV to/from Memory

This instruction does not change flags.

## Operation

```text
BNDMOV register to register
DEST.LB := SRC.LB;
DEST.UB := SRC.UB;


BNDMOV from memory
IF 64-bit mode THEN

          DEST.LB := LOAD_QWORD(SRC);
          DEST.UB := LOAD_QWORD(SRC+8);
    ELSE
          DEST.LB := LOAD_DWORD_ZERO_EXT(SRC);
          DEST.UB := LOAD_DWORD_ZERO_EXT(SRC+4);
FI;

BNDMOV to memory
IF 64-bit mode THEN

          DEST[63:0] := SRC.LB;
          DEST[127:64] := SRC.UB;
    ELSE
          DEST[31:0] := SRC.LB;
          DEST[63:32] := SRC.UB;
FI;
```

## Intel C/C++ compiler intrinsics

```c
BNDMOV void * _bnd_copy_ptr_bounds(const void *q, const void *r);
```

## Flags affected

None.
