---
summary: 释放 Tile Op/ 64/ 32 位 CPUID 特性
---

## 说明

本指令将 TILECFG 和 TILEDATA 返回到 INIT 状态. 在 Intel TSX 交易中执行 TILERELEASE 指令的任何尝试都会导致交易中止.

## 行动

```text
zero_all_tile_data()
tilecfg := 0// equivalent to 64B of zeros
TILES_CONFIGURED := 0
```

## Intel C/C++ 内在编译器

```c
TILERELEASE void _tile_release(void);
```

## 受影响的旗帜

None.

例外 AMX-E6;详见第2.10节,"Intel(R) AMX 指令例外类".
