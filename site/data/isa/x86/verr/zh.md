---
summary: 校验读或写入的片段
---

## 说明

验证用 源操作数 指定的代码或数据段是否可以从当前特权级(CPL)读取(VERR)或写作(VERW). 源操作数是一个16位的寄存器或内存位置,包含段选择子,用于要验证的片段. 如果区段可访问且可读(VERR)或可写(VERW),则设置ZF旗;否则,清除ZF旗. 代码段从未被校验为可写 。 无法对系统段进行此检查 。

要设置ZF旗,必须满足以下条件: 1.

* 段选择子不是NULL,是"q". * 选择者必须在描述表(GDT或LDT)的界限内表示描述符. * 选择器必须表示一个代码或数据段(而不是系统段或闸门)的描述符. * 对于VERR指令,段必须可读. * 对于VERW指令,段必须是可写入的数据段. * 如果段段不是符合要求的代码段,则段段的DPL必须大于或等于(有)

少或与)CPL和段选择子的RPL同时享有特权.

所执行的验证与段选择子装入DS、ES、FS或GS登记册以及所指明的访问(读或写)时进行的验证相同。 段选择子的值不能导致保护例外,使得软件能够预见到可能的分段访问问题.

此指令的操作在非64位模式和64位模式中是相同的. 操作数大小固定在16位.

## 行动

```text
IF SRC(Offset) > (GDTR(Limit) or (LDTR(Limit))
    THEN ZF := 0; FI;

Read segment descriptor;

IF SegmentDescriptor(DescriptorType) = 0 (* System segment *)
or (SegmentDescriptor(Type)  conforming code segment)

and (CPL > DPL) or (RPL > DPL)
    THEN
          ZF := 0;
    ELSE

        IF ((Instruction = VERR) and (Segment readable))
        or ((Instruction = VERW) and (Segment writable))

                THEN
                      ZF := 1;

                ELSE
                      ZF := 0;


          FI;
FI;
```

## 受影响的旗帜

ZF旗设定为1,如果区段可访问且可读(VERR)或可写(VERW);否则则设定为0.
