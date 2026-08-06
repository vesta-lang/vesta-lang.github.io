---
summary: 从指定位位置开始的零高位数
---

## 说明

BZHI将第一源歌词(第二源歌词)的比特复制到目的地歌词(第一源歌词)中,并根据第二源歌词(第三源歌词)指定的INDEX值清除目的地较高的比特. INDEX由第二源操作数中的7:0位指定. INDEX值在操作Size -1值下饱和. CF是设定的,如果第三个操作数的8个低位中包含的数字大于操作Size -1.

此指令不支持真实模式和 虚拟 8086 模式 。 操作数大小如果不是64位模式,总是32位. 在64位模式操作数大小 64中需要VEX.W1. VEX.W1在非64位模式中被忽略. 试图用不等于0的 VEX.L 执行此指令将导致 #UD.

## 行动

```text
N := SRC2[7:0]
DEST := SRC1
IF (N < OperandSize)

    DEST[OperandSize-1:N] := 0
FI
IF (N > OperandSize - 1)

    CF := 1
ELSE

    CF := 0
FI
```

## 受影响的旗帜

ZF和SF旗根据结果更新. CF旗按照行动部分的规定设置. 旗帜被清除。 AF和PF旗没有定义.

## Intel C/C++ 内在编译器

```c
BZHI unsigned __int32 _bzhi_u32(unsigned __int32 src, unsigned __int32 index);
BZHI unsigned __int64 _bzhi_u64(unsigned __int64 src, unsigned __int32 index);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-29"十三类例外条件".
