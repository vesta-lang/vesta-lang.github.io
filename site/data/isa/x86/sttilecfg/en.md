---
summary: Store Tile Configuration
---

## Description

The STTILECFG instruction takes a pointer to a 64-byte memory location (described in Table 3-56 in the "LDTI- LECFG--Load Tile Configuration" entry) that will, after successful execution of this instruction, contain the description of the tiles that were configured. In order to configure tiles, the AMX_TILE bit in CPUID must be set and the operating system has to have enabled the tiles architecture.

If the tiles are not configured, then STTILECFG stores 64B of zeros to the indicated memory location.

Any attempt to execute the STTILECFG instruction inside an Intel TSX transaction will result in a transaction abort.

## Operation

```text
STTILECFG mem
if TILES_CONFIGURED == 0:

    //write 64 bytes of zeros at mem pointer
    buf[0..63] := 0
    write_memory(mem, 64, buf)
else:
    buf.byte[0] := tilecfg.palette_id
    buf.byte[1] := tilecfg.start_row
    buf.byte[2..15] := 0

    p := 16
    for n in 0 ... palette_table[tilecfg.palette_id].max_names-1:

          buf.word[p/2] := tilecfg.t[n].colsb
          p := p + 2
    if p < 47:
          buf.byte[p..47] := 0
    p := 48
    for n in 0 ... palette_table[tilecfg.palette_id].max_names-1:
          buf.byte[p++] := tilecfg.t[n].rows
    if p < 63:
          buf.byte[p..63] := 0

    write_memory(mem, 64, buf)
```

## Intel C/C++ compiler intrinsics

```c
STTILECFGvoid _tile_storeconfig(void *);
```

## Flags affected

None.

Exceptions AMX-E2; see Section 2.10, "Intel(R) AMX Instruction Exception Classes," for details.
