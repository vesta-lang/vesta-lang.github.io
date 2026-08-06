---
summary: 装入访问权限
---

## 说明

从第二个 操作数 (源操作数) 指定的区段描述器上装入访问权限到第一个 操作数 (目标操作数) ,并在 EFLAGS 登记册中设置 ZF 旗. 源操作数(可以是寄存器,也可以是内存位置)包含用于访问的片段描述符的段选择子. 如果源操作数是一个内存地址,则只能访问16位数据. 目标操作数是一个通用注册.

作为加载过程的一部分,处理器执行访问检查. 一旦装入目的地登记册,软件可以对访问权信息进行额外检查.

片段描述符的访问权限包括位于片段描述符第二个双词(字节47)中的字段. 下列字段由 LAR 指令加载:

* 位数 7: 0 返回为 0 * 位数 11: 8 返回段类型 。 * Bit 12 返回 S 旗 。 * 位数 14: 13 返回 DPL. * Bit 15 返回 P 旗 。 * 只有当 操作数大小 大于 16 位时才会返回以下字段:

-- Bits 19:16 are undefined.

-- Bit 20 返回描述符中可用的软件位。

-- Bit 21 返回 L 旗 。

-- Bit 22 返回 D/B 旗 。

-- Bit 23 返回 G 旗 。

-- Bits 31:24 are returned as 0.

当操作数大小为16位时,只返回上面确认的低16位;目的地的上位没有修改. 当操作数大小是32位时,上面确定的32位值会被装入目标操作数;目的地的上位被清除. 当操作数为64位时,32位值为零延伸至64位,并装入目标操作数. (32位和64位操作数大小的行为是相同的.

本指令在加载目的地注册簿的访问权限前进行以下检查:

* 检查 段选择子 不是 NULL 。 * 检查 段选择子 指在 GDT 或 LDT 范围内的描述符

accessed

* 检查描述符类型是否对本指令有效。 所有代码和数据段描述符对

(可访问) LAR 指令 。 有效的系统段和闸门描述符类型以下列方式给出:

| * | 如果段段不是符合要求的代码段,则检查指定的段段描述符是否可见于 |
| --- | --- |
|  | CPL(即如果CPL和段选择子的RPL小于或等于该段的DPL) |
|  | 选择器)。 |

** 区和门类型**

| * | 如果段段不是符合要求的代码段,则检查指定的段段描述符是否可见于 |
| --- | --- |
|  | CPL(即如果CPL和段选择子的RPL小于或等于该段的DPL) |
|  | 选择器)。 |

## 行动

```text
IF Offset(SRC) > descriptor table limit
    THEN
          ZF := 0;
    ELSE
          SegmentDescriptor := descriptor referenced by SRC;

        IF SegmentDescriptor(Type)  conforming code segment

          and (CPL > DPL) or (RPL > DPL)
          or SegmentDescriptor(Type) is not valid for instruction

                THEN
                      ZF := 0;

                ELSE
                      DEST := access rights from SegmentDescriptor as given in Description section;
                      ZF := 1;

          FI;
FI;
```

## 受影响的旗帜

如果访问权限被成功加载, ZF 旗被设定为 1; 否则, 它将被清除为 0 。
