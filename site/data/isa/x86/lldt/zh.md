---
summary: 装入本地描述器表格注册
---

## 说明

将 源操作数 装入本地描述表寄存器(LDTR)的 段选择子 字段. 源操作数(a 通用寄存器或a 内存位置)包含一个段选择子,指向一个本地描述表(LDT). 在段选择子装入LDTR后,处理器使用段选择子在全域描述器表(GDT)中定位LDT的片段描述器. 然后将LDT的片段限制和基址从片段描述器加载到LDTR. 该段注册DS,ES,SS,FS,GS,和CS不受本指令影响,任务状态段(TSS)中的LDTR字段也不受当前任务的影响.

如果源操作数的位数2-15为0,则LDTR的标记无效,LLDT的指令静态完成. 然而,所有后来在LDT(除LAR,VERR,VERW或LSL指令外)中对描述符的引用都造成了一般的保护例外(#GP).

操作数 大小属性对该指令没有影响.

LLDT指令用于操作系统软件;不应用于应用程序. 此指令只能以保护模式或64位模式执行.

在64位模式中,操作数大小固定在16位.

## 行动

```text
IF SRC(Offset) > descriptor table limit

    THEN #GP(segment selector); FI;

IF segment selector is valid

    Read segment descriptor;

   IF SegmentDescriptor(Type)  LDT

          THEN #GP(segment selector); FI;
    IF segment descriptor is not present

          THEN #NP(segment selector); FI;

    LDTR(SegmentSelector) := SRC;
    LDTR(SegmentDescriptor) := GDTSegmentDescriptor;
ELSE LDTR := INVALID
FI;
```

## 受影响的旗帜

None.
