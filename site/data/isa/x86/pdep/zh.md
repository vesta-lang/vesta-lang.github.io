---
summary: 平行位保存
---

## 说明

PDEP使用第二源操作数(第三个操作数)中的面具将第一源操作数(第二个操作数)中毗连的低序位移入目的地(第一个操作数). PDEP取自第一源操作数的低位,将其存放在目标操作数中,放在第二源操作数(mask)中设置的相应位位置. 目的地中所有其他位(未设置在面具中的位)被设定为零.

```text
             SRC1 S31 S30 S29 S28 S27                   S7 S6 S5 S4 S3 S2 S1 S0
```

```text
             SRC2 0              0 01 0                 10 1 0 0 1 0 0
```

(mask)

```text
             DEST 0 0 0 S3 0                            S2 0 S1 0       0 S0 0 0
                      bit 31                                                             bit 0
```

图4-8. PDEP 示例

此指令不支持真实模式和 虚拟 8086 模式 。 操作数大小如果不是64位模式,总是32位. 在64位模式操作数大小 64中需要VEX.W1. VEX.W1在非64位模式中被忽略. 试图用不等于0的 VEX.L 执行此指令将导致 #UD.

## 行动

```text
TEMP := SRC1;
MASK := SRC2;
DEST := 0 ;
m := 0, k := 0;
DO WHILE m < OperandSize

          IF MASK[ m] = 1 THEN
                DEST[ m] := TEMP[ k];
                k := k+ 1;

          FI
          m := m+ 1;
OD
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
PDEP unsigned __int32 _pdep_u32(unsigned __int32 src, unsigned __int32 mask);
PDEP unsigned __int64 _pdep_u64(unsigned __int64 src, unsigned __int32 mask);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-29"十三类例外条件".
