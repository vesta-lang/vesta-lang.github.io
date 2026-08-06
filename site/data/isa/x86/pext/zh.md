---
summary: 平行位提取
---

## 说明

PEXT使用第二源操作数(第三个操作数)中的面具将第一源操作数(第二个操作数)中的毗连或非毗连位移到目的地的毗连低序位(第一个操作数). 对于MASK中的每个位点,PEXT从第一源操作数中提取相应的位点,并将其写入目标操作数的毗连下位点. 目的地被清零的剩余上位.

```text
             SRC1 S31 S30 S29 S28 S27                 S7 S6 S5 S4 S3 S2 S1 S0
```

```text
             SRC2            0  0 01 0                10 1 0 0 1 0 0
```

(mask)

```text
             DEST 0 0 0 0 0                           00               0 0 S28 S7 S5 S2
                     bit 31                                                                         bit 0
```

图4-9. PEXT 示例

此指令不支持真实模式和 虚拟 8086 模式 。 操作数大小如果不是64位模式,总是32位. 在64位模式操作数大小 64中需要VEX.W1. VEX.W1在非64位模式中被忽略. 试图用不等于0的 VEX.L 执行此指令将导致 #UD.

## 行动

```text
TEMP := SRC1;
MASK := SRC2;
DEST := 0 ;
m := 0, k := 0;
DO WHILE m < OperandSize

          IF MASK[ m] = 1 THEN
                DEST[ k] := TEMP[ m];
                k := k+ 1;

          FI
          m := m+ 1;

OD
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
PEXT unsigned __int32 _pext_u32(unsigned __int32 src, unsigned __int32 mask);
PEXT unsigned __int64 _pext_u64(unsigned __int64 src, unsigned __int32 mask);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-29"十三类例外条件".
