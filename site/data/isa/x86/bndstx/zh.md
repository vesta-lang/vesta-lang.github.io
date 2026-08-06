---
summary: 使用地址翻译存储扩展框
---

## 说明

BNDSTX使用SIB-地址表的移动和基登记册中构建的内存操作数(mib)的线性地址来进行地址翻译以存储到绑定表条目. 源操作数 bnd中的界限写到BTE的下界和上界. Mib的索引寄存器的内容写入BTE的指针值字段.

此指令不导致内存访问 mib 的线性地址, 也不导致基准引用的有效地址, 也不读写任何旗帜 。

分块覆盖适用于线性地址计算与 mib 基数,并在地址翻译时用于生成绑定表条目的地址. 默认情况下,BTE的地址被假定为线性地址. 在MIB的基座上没有进行分区检查.

MIB的底部不会被检查为犬类地址违规,因为它不能访问内存.

本指令的任何编码如果不指定基数或索引登记册,这些登记册将被视作零(恒定). 本指令的reg-reg形式仍为NOP.

SIB字节的缩放字段对这些指令没有影响,因此被忽略.

绑定寄存器可能在内存断层上部分更新. 内存操作数的加载顺序是具体的执行顺序.

## 行动

```text
base := mib.SIB.base ? mib.SIB.base + Disp: 0;
ptr_value := mib.SIB.index ? mib.SIB.index : 0;

Outside 64-bit Mode
A_BDE[31:0] := (Zero_extend32(base[31:12] << 2) + (BNDCFG[31:12] <<12 );
A_BT[31:0] := LoadFrom(A_BDE);
IF A_BT[0] equal 0 Then

    BNDSTATUS := A_BDE | 02H;
    #BR;
FI;
A_DEST[31:0] := (Zero_extend32(base[11:2] << 4) + (A_BT[31:2] << 2 ); // address of Bound table entry
A_DEST[8][31:0] := ptr_value;
A_DEST[0][31:0] := BND.LB;
A_DEST[4][31:0] := BND.UB;


In 64-bit Mode
A_BDE[63:0] := (Zero_extend64(base[47+MAWA:20] << 3) + (BNDCFG[63:12] <<12 );1
A_BT[63:0] := LoadFrom(A_BDE);
IF A_BT[0] equal 0 Then

    BNDSTATUS := A_BDE | 02H;
    #BR;
FI;
A_DEST[63:0] := (Zero_extend64(base[19:3] << 5) + (A_BT[63:3] << 3 ); // address of Bound table entry
A_DEST[16][63:0] := ptr_value;
A_DEST[0][63:0] := BND.LB;
A_DEST[8][63:0] := BND.UB;
```

## Intel C/C++ 内在编译器

```c
BNDSTX: _bnd_store_ptr_bounds(const void **ptr_addr, const void *ptr_val);
```

## 受影响的旗帜

None.
