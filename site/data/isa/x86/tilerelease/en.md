---
summary: Release Tile  Op/ 64/32 bit CPUID Feature
---

## Description

This instruction returns TILECFG and TILEDATA to the INIT state. Any attempt to execute the TILERELEASE instruction inside an Intel TSX transaction will result in a transaction abort.

## Operation

```text
zero_all_tile_data()
tilecfg := 0// equivalent to 64B of zeros
TILES_CONFIGURED := 0
```

## Intel C/C++ compiler intrinsics

```c
TILERELEASE void _tile_release(void);
```

## Flags affected

None.

Exceptions AMX-E6; see Section 2.10, "Intel(R) AMX Instruction Exception Classes," for details.
