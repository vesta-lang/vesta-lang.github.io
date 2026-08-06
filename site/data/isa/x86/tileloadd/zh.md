---
summary: 装入图纸
---

## 说明

此指令需要使用 SIB 地址 。 指数登记表是一个前进指标。 如果 SIB 编码省略了索引寄存器,则假定指数寄存器的内容值为零.

本指令加载一个有瓦片配置指定的行和列的瓦片目的地。 "T1"版本为执行提供了一个提示,即数据将被重用,但不需要居住在最近的缓存级别.

TILECFG数据中的TILECFG.start_row应初始化为"0",以便加载整个瓦片,并在成功完成TILELOADD指令时设定为零. TILELOADD是一个可重启指令,当指令执行期间发生可重启事件时,TILECFG.start_row将是非零.

只支持内存操作数,只能使用SIB地址模式访问,类似于V[P]GATHER*/V[P]SCATTER*指令.

任何试图在一次Intel TSX交易中执行TILELOADD/TILELOADDT1指令的尝试都会导致交易中止.

## 行动

```text
TILELOADD[,T1] tdest, tsib

start := tilecfg.start_row

zero_upper_rows(tdest,start)

membegin := tsib.base + displacement
// if no index register in the SIB encoding, the value zero is used.
stride := tsib.index << tsib.scale
nbytes := tdest.colsb
while start < tdest.rows:

    memptr := membegin + start * stride
    write_row_and_zero(tdest, start, read_memory(memptr, nbytes), nbytes)
    start := start + 1
zero_tilecfg_start()
// In the case of a memory fault in the middle of an instruction, the tilecfg.start_row := start
```

## Intel C/C++ 内在编译器

```c
TILELOADD void _tile_loadd(__tile dst, const void *base, int stride);
TILELOADDT1 void _tile_stream_loadd(__tile dst, const void *base, int stride);
```

## 受影响的旗帜

None.

例外 AMX-E3;详见第2.10节,"Intel(R) AMX 指令例外类",详见.
