---
summary: 将遮罩移到最低设置位
---

## 说明

将 目标操作数 的所有下位设置为 " 1 " , 并包含 源操作数 中的最低设置位( = 1) 。 如果源操作数为零,则BLSMSK将目标操作数的所有位元设置为1,同时将CF设置为1.

此指令不支持真实模式和 虚拟 8086 模式 。 操作数大小如果不是64位模式,总是32位. 在64位模式操作数大小 64中需要VEX.W1. VEX.W1在非64位模式中被忽略. 试图用不等于0的 VEX.L 执行此指令将导致 #UD.

## 行动

```text
temp := (SRC-1) XOR (SRC) ;
SF := temp[OperandSize -1];
ZF := 0;
IF SRC = 0

    CF := 1;
ELSE

    CF := 0;
FI
DEST := temp;
```

## 受影响的旗帜

SF根据结果更新. 如果来源为零,则设置CF。 ZF和旗帜被清除。 AF和PF旗没有定义.

## Intel C/C++ 内在编译器

```c
BLSMSK unsigned __int32 _blsmsk_u32(unsigned __int32 src);
BLSMSK unsigned __int64 _blsmsk_u64(unsigned __int64 src);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-29"十三类例外条件".
