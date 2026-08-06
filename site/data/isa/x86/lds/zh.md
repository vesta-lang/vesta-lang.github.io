---
summary: 装入远指针
---

## 说明

从第二行(source opeond)装入一个分块寄存器和第一行(destination opeond)中装入一个远指针(分区选择器和偏移器). 源操作数根据当前设置的操作数大小属性(分别为32位或16位),在内存中指定一个48位或32位指针. 指令 操作码 和 目标操作数 指定一个分段寄存器/ 通用寄存器 配对. 源操作数的16位段选择子被装入与操作码(DS,SS,ES,FS,或GS)指定的区段寄存器. 32位或16位偏移被加载到目标操作数指定的寄存器中.

如果这些指令之一在 保护模式 中执行,则来自 段选择子 在 源操作数 中指向的段描述符的额外信息会被装入所选段寄存器的隐藏部分.

同样在保护模式中,一个NULL选择器(值000至0003)可以装入DS,ES,FS或GS注册,而不会造成保护例外. (以后任何提及其对应的片段寄存器被装入NULL选择器的片段,都会引起一般保护例外(#GP),并且不会发生对片段的内存引用. )

在64位模式下,指令的默认操作大小为32位. 使用REX前缀的形式为REX.W促进操作,以指定源操作数在内存中引用一个80位指针(16位选择器,64位偏移). 使用REX的前缀形式为REX.R,允许访问额外的注册(R8-R15). 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
64-BIT_MODE
    IF SS is loaded
          THEN

             IF SegmentSelector = NULL and ( (RPL = 3) or
                       (RPL  3 and RPL  CPL) )

                      THEN #GP(0);
                ELSE IF descriptor is in non-canonical space


                       THEN #GP(selector); FI;
                ELSE IF Segment selector index is not within descriptor table limits

                       or segment selector RPL  CPL

                             or access rights indicate nonwritable data segment

                       or DPL  CPL

                       THEN #GP(selector); FI;
                ELSE IF Segment marked not present

                       THEN #SS(selector); FI;
                FI;
                SS := SegmentSelector(SRC);
                SS := SegmentDescriptor([SRC]);
    ELSE IF attempt to load DS, or ES
          THEN #UD;
    ELSE IF FS, or GS is loaded with non-NULL segment selector
          THEN IF Segment selector index is not within descriptor table limits
                or access rights indicate segment neither data nor readable code segment
                or segment is data or nonconforming-code segment
                and ( RPL > DPL or CPL > DPL)

                       THEN #GP(selector); FI;
                ELSE IF Segment marked not present

                       THEN #NP(selector); FI;
                FI;
                SegmentRegister := SegmentSelector(SRC) ;
                SegmentRegister := SegmentDescriptor([SRC]);
          FI;
    ELSE IF FS, or GS is loaded with a NULL selector:
          THEN
                SegmentRegister := NULLSelector;
                SegmentRegister(DescriptorValidBit) := 0; FI; (* Hidden flag;

                       not accessible by software *)
    FI;
    DEST := Offset(SRC);

PREOTECTED MODE OR COMPATIBILITY MODE;
    IF SS is loaded
          THEN

             IF SegementSelector = NULL

                       THEN #GP(0);
                ELSE IF Segment selector index is not within descriptor table limits

                       or segment selector RPL  CPL

                             or access rights indicate nonwritable data segment

                       or DPL  CPL

                       THEN #GP(selector); FI;
                ELSE IF Segment marked not present

                       THEN #SS(selector); FI;
                FI;
                SS := SegmentSelector(SRC);
                SS := SegmentDescriptor([SRC]);
    ELSE IF DS, ES, FS, or GS is loaded with non-NULL segment selector
          THEN IF Segment selector index is not within descriptor table limits
                or access rights indicate segment neither data nor readable code segment
                or segment is data or nonconforming-code segment
                and (RPL > DPL or CPL > DPL)

                       THEN #GP(selector); FI;
                ELSE IF Segment marked not present


                      THEN #NP(selector); FI;
                FI;
                SegmentRegister := SegmentSelector(SRC) AND RPL;
                SegmentRegister := SegmentDescriptor([SRC]);
          FI;
    ELSE IF DS, ES, FS, or GS is loaded with a NULL selector:
          THEN
                SegmentRegister := NULLSelector;
                SegmentRegister(DescriptorValidBit) := 0; FI; (* Hidden flag;

                      not accessible by software *)
    FI;
    DEST := Offset(SRC);

Real-Address or Virtual-8086 Mode
    SegmentRegister := SegmentSelector(SRC); FI;
    DEST := Offset(SRC);
```

## 受影响的旗帜

None.
