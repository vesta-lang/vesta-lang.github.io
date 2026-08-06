---
summary: 移动
---

## 说明

复制第二个操作数(源操作数)到第一个操作数(目标操作数). 源操作数可以是即时值,通用寄存器,区段注册,或内存位置;目的地注册可以是通用寄存器,区段注册,或内存位置. 操作数两个字必须大小相同,可以是字节,单词,双词,也可以是四词.

MOV 指令不能用于装入 CS 寄存器 。 试图这样做会导致操作码的无效例外(#UD). 要装入 CS 寄存器,请使用 JMP, CALL,或 RET 指令.

如果目标操作数是一个分段寄存器(DS,ES,FS,GS,或SS),则源操作数必须是有效的段选择子. 在 保护模式 中,将一个 段选择子 移动到一个片段寄存器中,会自动将与该 段选择子 相关的片段描述符信息加载到片段寄存器的隐藏部分(阴影)中. 在加载此信息时,段选择子和段描述符信息被验证(见下文"操作"算法). 片段描述器数据来自指定的片段选择器的GDT或LDT条目.

一个NULL 段选择子(值000-0003)可以装入DS,ES,FS和GS注册,而不会造成保护例外. 然而,任何后续试图引用其对应的片段寄存器被装入NULL值的片段,都会导致一般保护例外(#GP),并且没有发生内存引用.

用 MOV 指令装入 SS 注册 抑制或抑制一些调试例外,并抑制下列指令边界上的中断. (抑制在发送例外或执行下一个指令后结束. ) 这种行为允许将一个栈指针与下一个指令(MOV ESP,堆点值)一起加载到ESP的寄存器中,然后可以发送一个事件. 见7.8.3节,"交换堆栈时的异常和中断",载于Intel(R)64和IA-32架构软件开发者手册,第3A卷. Intel建议软件使用LSS指令将SS寄存器和ESP加载在一起.

当执行MOV Reg,Sreg时,处理器将Sreg的内容复制到通用寄存器最不重要的16位. 目的地寄存器的上位是大多数IA-32处理器(Pentium Pro处理器及后来的处理器)和所有Intel 64处理器的零,但对于Intel Quark X1000处理器,Pentium和早期处理器的比特31:16是未定义的除外.

在64位模式下,指令的默认操作大小为32位. 使用REX.R前缀可以访问额外的登记册(R8-R15). 使用REX.W前缀将操作提升到64位. 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
DEST := SRC;

Loading a segment register while in protected mode results in special checks and actions, as described in the following listing. These
checks are performed on the segment selector and the segment descriptor to which it points.

IF SS is loaded
    THEN
          IF segment selector is NULL
                THEN #GP(0); FI;
          IF segment selector index is outside descriptor table limits

        OR segment selector's RPL  CPL


          OR segment is not a writable data segment

        OR DPL  CPL

                THEN #GP(selector); FI;
          IF segment not marked present

                THEN #SS(selector);
                ELSE

                      SS := segment selector;
                      SS := segment descriptor; FI;
FI;

IF DS, ES, FS, or GS is loaded with non-NULL selector
THEN

    IF segment selector index is outside descriptor table limits
    OR segment is not a data or readable code segment
    OR ((segment is a data or nonconforming code segment) AND ((RPL > DPL) or (CPL > DPL)))

          THEN #GP(selector); FI;
    IF segment not marked present

          THEN #NP(selector);
          ELSE

                SegmentRegister := segment selector;
                SegmentRegister := segment descriptor; FI;
FI;

IF DS, ES, FS, or GS is loaded with NULL selector
    THEN
          SegmentRegister := segment selector;
          SegmentRegister := segment descriptor;

FI;
```

## 受影响的旗帜

None.
