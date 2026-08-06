---
summary: 从堆栈中弹出一个值
---

## 说明

将值从堆栈顶部加载到指定位置的目标操作数(或明确操作码),然后加增栈指针. 目标操作数可以是通用寄存器,内存位置,也可以是片段寄存器.

地址和操作数大小的确定和使用如下:

* 地址大小 。 当前代码框描述符中的 D 旗决定默认地址大小; 可能是

被指令前缀( 67H) 覆盖 。

地址大小仅在写入内存中的 目标操作数 时使用.

* 操作数大小 (英语). 当前代码框描述符中的 D 旗决定默认 操作数大小; 它可能

被指令前缀(66H或REX.W)所覆盖.

操作数大小(16,32或64位)决定栈指针递增的金额(2,4或8).

* 堆叠地址大小 。 除64位模式外,当前堆栈框描述符中的B旗决定

栈指针的大小(16或32位);在64位模式中,栈指针的大小总是64位.

堆栈地址大小决定了栈指针在内存中从堆栈读取以及栈指针增量时的宽度. (如上所述,栈指针增量的金额由操作数大小确定. )

如果目标操作数是某一段注册DS,ES,FS,GS,或SS,则装入注册的值必须是有效的段选择子. 在 保护模式 中,将一个 段选择子 弹出到一个分区自动寄存器 -

从逻辑上将与该段选择子相关的描述信息加载到片段的隐藏(阴影)部分,并导致选择者和描述信息被验证(见下文"操作"部分).

NULL值(000-0003)可跳入DS,ES,FS或GS注册,而不会引起一般的保护故障. 然而,任何后续试图引用一个其对应的片段寄存器被装入NULL值的片段,都会引起一般保护例外(#GP). 在这种情况下,没有发生内存引用,区段寄存器的保存值是NULL.

POP 指令无法将一个值弹出到 CS 寄存器中 。 要从堆栈装入 CS 寄存器,请使用 RET 指令 。

如果 ESP 寄存器用作在内存中处理 目标操作数 的基数寄存器,则 POP 指令在递增 操作数 寄存器后计算 ESP 的有效地址. 对于ESP通过POP指令将0H包裹到0H的16位堆栈的情况,由此产生的内存书写位置是处理器家庭特异性的.

POP ESP指令在旧堆栈顶部的数据写入目的地之前,会增加栈指针(ESP).

用 POP 指令装入 SS 注册 抑制或抑制一些调试例外,并抑制下列指令边界上的中断. (抑制在发送例外或执行下一个指令后结束. ) 这种行为允许一个栈指针与下一个指令(POP ESP)一起加载到ESP的寄存器中,然后一个事件才能交付. 见7.8.3节,"交换堆栈时的异常和中断",载于Intel(R)64和IA-32架构软件开发者手册,第3A卷. Intel建议软件使用LSS指令将SS寄存器和ESP加载在一起.

在64位模式中,使用REX前缀的形式为REX.R允许访问额外的注册(R8-R15). 当在64位模式下,使用32位的操作数的持久性有机污染物不能编码,持久性有机污染物到DS,ES,SS无效. 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
IF StackAddrSize = 32
    THEN
          IF OperandSize = 32
                THEN
                      DEST := SS:ESP; (* Copy a doubleword *)
                      ESP := ESP + 4;
               ELSE (* OperandSize = 16*)
                      DEST := SS:ESP; (* Copy a word *)
                      ESP := ESP + 2;
          FI;
    ELSE IF StackAddrSize = 64
          THEN
                IF OperandSize = 64
                      THEN
                            DEST := SS:RSP; (* Copy quadword *)
                            RSP := RSP + 8;
                      ELSE (* OperandSize = 16*)
                            DEST := SS:RSP; (* Copy a word *)
                            RSP := RSP + 2;
                FI;
          FI;
    ELSE StackAddrSize = 16
          THEN
                IF OperandSize = 16
                      THEN
                            DEST := SS:SP; (* Copy a word *)
                            SP := SP + 2;


                      ELSE (* OperandSize = 32 *)
                            DEST := SS:SP; (* Copy a doubleword *)
                            SP := SP + 4;

                FI;

FI;

Loading a segment register while in protected mode results in special actions, as described in the following listing.
These checks are performed on the segment selector and the segment descriptor it points to.

64-BIT_MODE
IF FS, or GS is loaded with non-NULL selector;

    THEN
          IF segment selector index is outside descriptor table limits
                OR segment is not a data or readable code segment
                OR ((segment is a data or nonconforming code segment)
                      AND ((RPL > DPL) or (CPL > DPL))
                            THEN #GP(selector);
                IF segment not marked present
                      THEN #NP(selector);
          ELSE
                SegmentRegister := segment selector;
                SegmentRegister := segment descriptor;
          FI;

FI;
IF FS, or GS is loaded with a NULL selector;

          THEN
                SegmentRegister := segment selector;
                SegmentRegister := segment descriptor;

FI;

PREOTECTED MODE OR COMPATIBILITY MODE;

IF SS is loaded;
    THEN
          IF segment selector is NULL
                THEN #GP(0);
          FI;
          IF segment selector index is outside descriptor table limits
               or segment selector's RPL  CPL
                or segment is not a writable data segment
               or DPL  CPL
                      THEN #GP(selector);
          FI;
          IF segment not marked present
                THEN #SS(selector);
                ELSE
                      SS := segment selector;
                      SS := segment descriptor;
          FI;

FI;

IF DS, ES, FS, or GS is loaded with non-NULL selector;
    THEN


          IF segment selector index is outside descriptor table limits
                or segment is not a data or readable code segment
                or ((segment is a data or nonconforming code segment)
                and ((RPL > DPL) or (CPL > DPL))
                      THEN #GP(selector);

          FI;
          IF segment not marked present

                THEN #NP(selector);
                ELSE

                      SegmentRegister := segment selector;
                      SegmentRegister := segment descriptor;
           FI;
FI;

IF DS, ES, FS, or GS is loaded with a NULL selector
    THEN
          SegmentRegister := segment selector;
          SegmentRegister := segment descriptor;

FI;
```

## 受影响的旗帜

None.
