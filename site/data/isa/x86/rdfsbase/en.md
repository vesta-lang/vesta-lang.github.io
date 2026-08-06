---
summary: Read FS/GS Segment Base
---

## Description

Loads the general-purpose register indicated by the ModR/M:r/m field with the FS or GS segment base address.

The destination operand may be either a 32-bit or a 64-bit general-purpose register. The REX.W prefix indicates the operand size is 64 bits. If no REX.W prefix is used, the operand size is 32 bits; the upper 32 bits of the source base address (for FS or GS) are ignored and upper 32 bits of the destination register are cleared. This instruction is supported only in 64-bit mode.

## Operation

```text
DEST := FS/GS segment base address;
```

## Flags affected

None.

C/C++ Compiler Intrinsic Equivalent

RDFSBASE unsigned int _readfsbase_u32(void ); RDFSBASE unsigned __int64 _readfsbase_u64(void ); RDGSBASE unsigned int _readgsbase_u32(void ); RDGSBASE unsigned __int64 _readgsbase_u64(void );
