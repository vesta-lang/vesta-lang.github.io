---
summary: Zero Tile
---

## Description

This instruction zeroes the destination tile. Any attempt to execute the TILEZERO instruction inside an Intel TSX transaction will result in a transaction abort.

## Operation

```text
TILEZERO tdest

nbytes := palette_table[palette_id].bytes_per_row

for i in 0 ... palette_table[palette_id].max_rows-1:
    for j in 0 ... nbytes-1:
          tdest.row[i].byte[j] := 0

zero_tilecfg_start()
```

## Intel C/C++ compiler intrinsics

```c
TILEZERO void _tile_zero(__tile dst);
```

## Flags affected

None.

Exceptions AMX-E5; see Section 2.10, "Intel(R) AMX Instruction Exception Classes," for details.
