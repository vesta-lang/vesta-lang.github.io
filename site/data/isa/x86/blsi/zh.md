---
summary: 提取最低的集隔离位
---

## 说明

从 源操作数 中提取最小的设置位,并在目标寄存器中设置相应的位. 目标操作数 被清零中的所有其他位点. 如果源操作数中没有设置位点,则BLSI将目的地的所有位点设置为0,并设置ZF和CF.

此指令不支持真实模式和 虚拟 8086 模式 。 操作数大小如果不是64位模式,总是32位. 在64位模式操作数大小 64中需要VEX.W1. VEX.W1在非64位模式中被忽略. 试图用不等于0的 VEX.L 执行此指令将导致 #UD.

## 行动

```text
temp := (-SRC) bitwiseAND (SRC);
SF := temp[OperandSize -1];
ZF := (temp = 0);
IF SRC = 0

    CF := 0;
ELSE

    CF := 1;
FI
DEST := temp;
```

## 受影响的旗帜

ZF和SF根据结果更新. 如果来源不是零,则设定了CF. 旗帜被清除。 AF和PF旗没有定义.

## Intel C/C++ 内在编译器

```c
BLSI unsigned __int32 _blsi_u32(unsigned __int32 src);
BLSI unsigned __int64 _blsi_u64(unsigned __int64 src);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-29"十三类例外条件".
