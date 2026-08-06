---
summary: 装入核心GS基地
---

## 说明

LKGS的运行方式与MOV到GS相同,只是描述器的基址被装入IA32 KERNEL GS BASE MSR而不是GS段的描述器缓存.

LKGS取单(来源)操作数,可以是通用寄存器或内存位置. 操作数必须是有效的段选择子. 指令将段选择子引用的段描述符加载到GS描述符缓存中,但基址除外. GS描述符缓存中的基础地址不修改;段描述符中的基础地址装入IA32 KERNEL GS BASE MSR. (由于描述符中的基础地址只有32位,MSR的上32位被清除).

一个无效的段选择子(值000-0003)可以不引起例外而加载. 然而,任何后续试图在64位模式外引用GS的尝试都会导致一般保护例外(#GP),并且没有发生内存引用. LKGS 带有无段选择器的零加载到 IA32 KERNEL GS BASE.

## 行动

```text
IF CPL > 0 OR logical processor not in 64-bit mode
    THEN #UD; FI;

IF SRC is null
    THEN
          GS.selector := SRC;
          mark GS as null;
          IA32_KERNEL_GS_BASE := 0;
    ELSE
          IF SRC.index is outside descriptor table limits
                THEN #GP(selector); FI;
          read referenced descriptor for descriptor table;
          IF the descriptor is not for a data or readable code segment OR SRC.RPL > descriptor.DPL
                THEN #GP(selector); FI;
          IF the descriptor is not marked present
                THEN #NP(selector);
                ELSE
                      GS.selector := SRC;
                      GS.attributes := descriptor.attributes;
                      IA32_KERNEL_GS_BASE := descriptor.base; // bits 63:32 cleared
          FI;

FI;
```

## 受影响的旗帜

None.
