---
summary: 装入任务注册
---

## 说明

将 源操作数 装入任务寄存器的 段选择子 字段。 源操作数(一个通用寄存器或内存位置)包含一个段选择子,指向任务状态段(TSS). 段选择子在任务寄存器中加载后,处理器使用段选择子在全域描述表(GDT)中定位TSS的片段描述符. 然后将TSS的片段限制和基址从片段描述器加载到任务记录器中. 任务登记册指出的任务很繁忙,但没有切换任务。

LTR指令用于操作系统软件;不应用于应用程序. 它只能当CPL是0. 在初始化代码中通常用于确定第一个要执行的任务.

操作数 大小属性对该指令没有影响.

在64位模式下,操作数大小仍然固定在16位. 指令引用一个16字节描述符来加载64位基.

## 行动

```text
IF SRC is a NULL selector

    THEN #GP(0);

IF SRC(Offset) > descriptor table limit OR IF SRC(type)  global

    THEN #GP(segment selector); FI;
Read segment descriptor;

IF segment descriptor is not for an available TSS
    THEN #GP(segment selector); FI;

IF segment descriptor is not present
    THEN #NP(segment selector); FI;

TSSsegmentDescriptor(busy) := 1;
(* Locked read-modify-write operation on the entire descriptor when setting busy flag *)
TaskRegister(SegmentSelector) := SRC;
TaskRegister(SegmentDescriptor) := TSSSegmentDescriptor;
```

## 受影响的旗帜

None.
