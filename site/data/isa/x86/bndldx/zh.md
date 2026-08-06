---
summary: 使用地址翻译装入扩展边界
---

## 说明

BNDLDX使用从基寄存器和SIB-addressing形式的内存操作数(mib)中构建的线性地址来进行地址翻译,以访问绑定表条目,有条件地将BTE中的边界加载到目的地. 如果 mib 的索引寄存器的内容与 BTE 中存储的指针值相匹配,则目标寄存器会与 BTE 中的边框一起更新.

如果指针值比较失败,则以 INIT 边框(lb = 0x0,ub = 0x0)更新目的地(注意:如前所述,上方边框使用1's suppl表示,因此,上方边框的0x0值允许访问完整的内存).

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
A_BT[31:0] := LoadFrom(A_BDE );
IF A_BT[0] equal 0 Then

    BNDSTATUS := A_BDE | 02H;
    #BR;
FI;
A_BTE[31:0] := (Zero_extend32(base[11:2] << 4) + (A_BT[31:2] << 2 );
Temp_lb[31:0] := LoadFrom(A_BTE);
Temp_ub[31:0] := LoadFrom(A_BTE + 4);
Temp_ptr[31:0] := LoadFrom(A_BTE + 8);
IF Temp_ptr equal ptr_value Then
    BND.LB := Temp_lb;
    BND.UB := Temp_ub;


ELSE
    BND.LB := 0;
    BND.UB := 0;

FI;

In 64-bit Mode
A_BDE[63:0] := (Zero_extend64(base[47+MAWA:20] << 3) + (BNDCFG[63:12] <<12 );1
A_BT[63:0] := LoadFrom(A_BDE);
IF A_BT[0] equal 0 Then

    BNDSTATUS := A_BDE | 02H;
    #BR;
FI;
A_BTE[63:0] := (Zero_extend64(base[19:3] << 5) + (A_BT[63:3] << 3 );
Temp_lb[63:0] := LoadFrom(A_BTE);
Temp_ub[63:0] := LoadFrom(A_BTE + 8);
Temp_ptr[63:0] := LoadFrom(A_BTE + 16);
IF Temp_ptr equal ptr_value Then
    BND.LB := Temp_lb;
    BND.UB := Temp_ub;
ELSE
    BND.LB := 0;
    BND.UB := 0;
FI;
```

## 受影响的旗帜

None.
