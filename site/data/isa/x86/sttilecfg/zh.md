---
summary: 存储图纸配置
---

## 说明

STTILECFG指令将指向一个64字节的内存位置(在"LDTI-LECFG--Load Tile配置"条目中的表3-56中描述),在成功执行本指令后,将包含所配置的瓷砖的描述. 为了配置瓷砖,必须设置 CPUID 中的 AMQTILE 位,操作系统必须启用瓷砖架构 。

如果瓷砖没有配置,那么STTILECFG将64B的零存储到指定的内存位置.

在 Intel TSX 交易中执行 STTILECFG 指令的任何尝试都会导致交易中止.

## 行动

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

## Intel C/C++ 内在编译器

```c
STTILECFGvoid _tile_storeconfig(void *);
```

## 受影响的旗帜

None.

例外 AMX-E2;详见第2.10节,"Intel(R) AMX 指令例外类".
