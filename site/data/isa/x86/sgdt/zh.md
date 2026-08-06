---
summary: 存储全局描述表注册
---

## 说明

在 目标操作数 中存储全局描述表寄存器(GDTR)的内容. 目标操作数指定了一个内存位置.

在遗产或兼容模式中,目标操作数是一个6字节的内存位置. 如果 操作数 大小属性为 16 或 32 位,则寄存器的 16 位限制字段存储在 内存位置 的 低 2 字节中,32 位基址存储在高 4 位中.

在64位模式中,操作数大小被固定为8+2字节. 指令存储一个8字节基和2字节限制.

SGDT只能通过操作系统软件使用. 然而,它可以在应用程序中使用,而不会导致如果CR4.UMIP=0. 见"LGDT/LIDT-Load Global/Interrupt描述器表注册"第3章,Intel(R)64和IA-32架构软件开发者手册第2A卷,关于加载GDTR和IDTR的信息.

## IA-32 架构兼容性

SGDT的16位形式与英特尔286处理器兼容,如果上部8位没有被引用. Intel 286处理器以1s填充这些比特;处理器世代比Intel 286处理器更晚以0s填充这些比特.

## 行动

```text
IF instruction is SGDT
          IF OperandSize =16 or OperandSize = 32 (* Legacy or Compatibility Mode *)
                THEN
                      DEST[0:15] := GDTR(Limit);
                      DEST[16:47] := GDTR(Base); (* Full 32-bit base address stored *)
                      FI;
                ELSE (* 64-bit Mode *)
                      DEST[0:15] := GDTR(Limit);
                      DEST[16:79] := GDTR(Base); (* Full 64-bit base address stored *)
          FI;

FI;
```

## 受影响的旗帜

None.
