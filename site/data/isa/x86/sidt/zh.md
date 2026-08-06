---
summary: 存储中断描述表
---

## 说明

存储 目标操作数中中断描述表寄存器(IDTR)的内容。 目标操作数指定了一个6字节的内存位置.

在非64位模式中,寄存器的16位限制字段存储在内存位置的低2位元中,32位基址存储在高4位元中.

在64位模式中,操作数大小固定在8+2字节. 指令存储8字节基和2字节限值.

SIDT只在操作系统软件中有用;然而,它可以在应用程序中使用,而不会造成如果CR4.UMIP=0. 见"LGDT/LIDT-Load Global/Interrupt描述器表注册"第3章,Intel(R)64和IA-32架构软件开发者手册第2A卷,关于加载GDTR和IDTR的信息.

## IA-32 架构兼容性

SIDT的16位形式与英特尔286处理器兼容,如果上部8位没有被引用. Intel 286处理器以1s填充这些比特;处理器世代比Intel 286处理器更晚以0s填充这些比特.

## 行动

```text
IF instruction is SIDT
    THEN
          IF OperandSize =16 or OperandSize = 32 (* Legacy or Compatibility Mode *)
                THEN
                      DEST[0:15] := IDTR(Limit);
                      DEST[16:47] := IDTR(Base); FI; (* Full 32-bit base address stored *)
                ELSE (* 64-bit Mode *)
                      DEST[0:15] := IDTR(Limit);
                      DEST[16:79] := IDTR(Base); (* Full 64-bit base address stored *)
          FI;

FI;
```

## 受影响的旗帜

None.
