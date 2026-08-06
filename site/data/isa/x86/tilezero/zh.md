---
summary: 零平铺
---

## 说明

此指令为目的地牌片零 。 在 Intel TSX 交易中执行 TILEZERO 指令的任何尝试都会导致交易中止.

## 行动

```text
TILEZERO tdest

nbytes := palette_table[palette_id].bytes_per_row

for i in 0 ... palette_table[palette_id].max_rows-1:
    for j in 0 ... nbytes-1:
          tdest.row[i].byte[j] := 0

zero_tilecfg_start()
```

## Intel C/C++ 内在编译器

```c
TILEZERO void _tile_zero(__tile dst);
```

## 受影响的旗帜

None.

例外 AMX-E5;详见第2.10节,"Intel(R) AMX 指令例外类",详见.
