---
summary: 装入全局/ 中断描述表
---

## 说明

将 源操作数 中的值装入全局描述表寄存器(GDTR)或中断描述表寄存器(IDTR). 源操作数指定了一个6字节的内存位置,它包含了全局描述表(GDT)或中断描述表(IDT)的基准地址(线性地址)和限制(以字节表示的表格大小). 如果操作数的大小属性为32位,则一个16位限制(6位数据操作数的下2位数)和一个32位基地址(数据操作数的上4位数)被装入寄存器. 如果 操作数 大小属性为 16 位,则加载一个 16 位限制(低于 2 位数)和一个 24 位基地址(第三,第四,第五 位数). 在此,操作数的高序字节不使用,GDTR或IDTR中基址的高序字节则以零填充.

LGDT和LIDT指令只用于操作系统软件;它们不用于应用程序. 它们是唯一直接加载线性地址(即不是片段相对地址)和保护模式限制的指令. 它们通常在实地址模式中执行,以便在切换到保护模式之前允许处理器初始化.

在64位模式中,指令的操作数大小固定在8+2字节(一个8字节基和一个2字节限制). 参见本节开头的汇总图,用于编码数据和限制.

见英特尔(R)64和IA-32架构软件开发者手册第2B卷第4章中的"SGDT-Store Global Descriptor Table Register Register",关于GDTR和IDTR内容的存储信息.

## 行动

```text
IF Instruction is LIDT
    THEN

        IF OperandSize = 16

                THEN
                      IDTR(Limit) := SRC[0:15];
                      IDTR(Base) := SRC[16:47] AND 00FFFFFFH;

                ELSE IF 32-bit Operand Size
                      THEN
                            IDTR(Limit) := SRC[0:15];
                            IDTR(Base) := SRC[16:47];
                      FI;

                ELSE IF 64-bit Operand Size (* In 64-Bit Mode *)
                      THEN
                            IDTR(Limit) := SRC[0:15];
                            IDTR(Base) := SRC[16:79];
                      FI;

          FI;
    ELSE (* Instruction is LGDT *)

        IF OperandSize = 16

                THEN
                      GDTR(Limit) := SRC[0:15];
                      GDTR(Base) := SRC[16:47] AND 00FFFFFFH;

                ELSE IF 32-bit Operand Size
                      THEN
                            GDTR(Limit) := SRC[0:15];
                            GDTR(Base) := SRC[16:47];
                      FI;

                ELSE IF 64-bit Operand Size (* In 64-Bit Mode *)
                      THEN
                            GDTR(Limit) := SRC[0:15];
                            GDTR(Base) := SRC[16:79];
                      FI;

          FI;
FI;
```

## 受影响的旗帜

None.
