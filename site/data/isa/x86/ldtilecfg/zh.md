---
summary: 装入图纸配置
---

## 说明

LDTILECFG指令取一个包含指针的操作数到一个64字节的内存位置,包含要支持的瓷砖的描述. 为了配置瓷砖,必须设置 CPUID 中的 AMQTILE 位,操作系统必须启用瓷砖架构 。

内存区域包含调色板,并描述使用多少瓷砖,并用行和列字节定义每个瓷砖. 请求必须符合CPUID提供的限制;见下文表3-56。

字节名称表 3-56. 内存区域布局 0 调色板 描述 1 start row 调色板选择将使用的瓦片所支持的配置 。 2-15 保留, 必须是 0 start row 用于存储中断操作的重启值 。 16-17 tyle0. colsb 18-19 tyle1. colsb 拖动 0 字节/ 行. 20-21 tyle2. colsb Tile 1 字节/行.          (顺序继续)每行2号平面图 30-31号平面图 32-47 保留,每行必须0号平面图 7号平面图 48号平面图 48号平面图 49号平面图 1号平面图 50号平面图 2号平面图...          (顺序继续) 平面2排55瓦7. 平面56-63排预留,必须是零平面7排.

如果不使用瓦片行和列对来指定瓦片参数,它们必须具有数值0. 所有已启用的瓦片( 基于调色板) 必须配置 。 指定比执行限制或调色板限制多的瓦片参数导致#GP断层。

如果调色板 id为零,则表示INIT状态,既表示TILECFG,也表示TILEDATA. INIT州境内的提列斯被清零. 调色板 id的唯一合法非INIT值为1.

在 Intel TSX 交易中执行 LDTILECFG 指令的任何尝试都会导致交易中止.

## 行动

```text
LDTILECFG mem
error := False
buf := read_memory(mem, 64)
temp_tilecfg.palette_id := buf.byte[0]
if temp_tilecfg.palette_id > max_palette:

    error := True
if not xcr0_supports_palette(temp_tilecfg.palette_id):

    error := True
if temp_tilecfg.palette_id !=0:

    temp_tilecfg.start_row := buf.byte[1]
    if buf.byte[2..15] is nonzero:

          error := True
    p := 16
    # configure columns
    for n in 0 ... palette_table[temp_tilecfg.palette_id].max_names-1:

          temp_tilecfg.t[n].colsb:= buf.word[p/2]
          p := p + 2
          if temp_tilecfg.t[n].colsb > palette_table[temp_tilecfg.palette_id].bytes_per_row:

                error := True
    if nonzero(buf[p...47]):

          error := True

    # configure rows
    p := 48
    for n in 0 ... palette_table[temp_tilecfg.palette_id].max_names-1:

          temp_tilecfg.t[n].rows:= buf.byte[p]
          if temp_tilecfg.t[n].rows > palette_table[temp_tilecfg.palette_id].max_rows:

                error := True
          p := p + 1

    if nonzero(buf[p...63]):
          error := True

    # validate each tile's row & col configs are reasonable and enable the valid tiles
    for n in 0 ... palette_table[temp_tilecfg.palette_id].max_names-1:

          if temp_tilecfg.t[n].rows !=0 and temp_tilecfg.t[n].colsb != 0:
                temp_tilecfg.t[n].valid := 1

          elif temp_tilecfg.t[n].rows == 0 and temp_tilecfg.t[n].colsb == 0:
                temp_tilecfg.t[n].valid := 0

          else:
                error := True// one of rows or colsbwas 0 but not both.

if error:
    #GP

elif temp_tilecfg.palette_id == 0:
    TILES_CONFIGURED := 0// init state
    tilecfg := 0// equivalent to 64B of zeros
    zero_all_tile_data()

else:
    tilecfg := temp_tilecfg
    zero_all_tile_data()
    TILES_CONFIGURED := 1
```

## Intel C/C++ 内在编译器

```c
LDTILECFG void _tile_loadconfig(const void *);
```

## 受影响的旗帜

None.

例外 AMX-E1;详见第2.10节,"Intel(R) AMX 指令例外类",详见.
