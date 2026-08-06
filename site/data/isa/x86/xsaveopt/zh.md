---
summary: 保存处理器扩展状态优化
---

## 说明

执行完整或部分保存处理器状态组件到XSAVE位于目标操作数指定的内存地址的区域. 隐含的EDX:EAX寄存器对齐指定了64位指令掩码. 保存的特定状态组件对应了请求的-feature位图(RFBM)中设置的位点,该位点是EDX:EAX和XCR0的逻辑-AND.

XSAVE区域的格式详见第13.4节,"XSAVE区域",Intel(R)64和IA-32架构软件开发者手册第1卷. 和FXRSTOR和FXSAVE一样,x87状态使用的内存格式依赖于REX.W前缀;参见Intel(R)64和IA-32架构软件开发者手册第1卷第13.5.1节,"x87状态".

第13.9节,"XSAVEOPT的操作",Intel(R)64和IA-32 Architectures Software开发者手册,第一卷详细介绍了XSAVEOPT指令的操作. 以下项目为高级别大纲:

* XSAVEOPT的执行与XSAVE相似. XSAVEOPT与XSAVE不同,因为它可能使用init和

修改优化. XSAVEOPT的性能将等于或优于XSAVE.

* XSAVEOPT 保存状态组件 i 只当 RFBM[i] = 1 和 XINUSE[i] = 1.1 (XINUSE 是一个位图,通过它

处理器跟踪各种状态组件的状态。 见英特尔(R)64和IA-32架构软件开发者手册第1卷第13.6节"XSAVE-管理状态的处理器跟踪". ) 即使两个位是1,XSAVEOPT也可能优化而不是保存状态组件一,如果(1)自上次执行XRSTOR或XRSTORS后,状态组件一没有被修改;(2) XSAVES的这次执行与内部值XRSTOR INFO确定的XRSTOR或XRSTORS的最后一次执行对应(见下文操作部分).

* XSAVEOPT不修改XSAVE地区遗留区域的字节511:464(见第13.4.1节,英特尔(R)64和IA-32架构软件开发者手册,第一卷"XSAVE地区遗留区域").

* XSAVEOPT读取了XSAVE头部的XSTATE BV字段(参见Intel(R)第13.4.2节"XSAVE头部").

64和IA-32 Architectures Software开发者手册,第1卷),并将修改后的值写回内存如下. 如果 RFBM[i] = 1, XSAVEOPT 写作 XSTATE BV[i],值为 XINUSE[i]. 如果 RFBM[i] = 0,则 XSAVEOPT 写作 XSTATE BV[i] 的值为它从内存读取(它不修改比特). XSAVEOPT除XSTATE BV字段外,不向XSAVE头部的任何一个部分写.

* XSAVEOPT总是使用XSAVE区域的扩展区域的标准格式(参见第13.4.3节,Intel(R)64的"XSAVE区域的扩展区域"和IA-32的架构软件开发者手册第1卷).

使用不与64字节边界对齐的目标操作数(无论是64位还是32位模式)将会导致一般保护(#GP)例外. 在64位模式中,RDX和RAX的上32位被忽略.

1. 联合国 对MXCSR和MXCSR MASK都有例外,它们属于状态组件1-SSE. XSAVEOPT总是把这些保存到记忆中,如果RFBM[1]=1或RFBM[2]=1,无论XINUSE的值如何.

见Intel(R)64和IA-32架构软件开发者手册第13.6节"XSAVE-Managed State的处理器跟踪",第一卷,用于讨论位图XMODIFIED和数量XRSTOR INFO.

## 行动

```text
RFBM := XCR0 AND EDX:EAX; /* bitwise logical AND */
OLD_BV := XSTATE_BV field from XSAVE header;
TO_BE_SAVED := RFBM AND XINUSE;

IF in VMX non-root operation
    THEN VMXNR := 1;
    ELSE VMXNR := 0;

FI;
LAXA := linear address of XSAVE area;

IF XRSTOR_INFO = CPL,VMXNR,LAXA,00000000_00000000H

    THEN TO_BE_SAVED := TO_BE_SAVED AND XMODIFIED;
FI;

IF TO_BE_SAVED[0] = 1
    THEN store x87 state into legacy region of XSAVE area;

FI;

IF TO_BE_SAVED[1]
    THEN store XMM registers into legacy region of XSAVE area; // this step does not save MXCSR or MXCSR_MASK

FI;

IF RFBM[1] = 1 or RFBM[2] = 1
    THEN store MXCSR and MXCSR_MASK into legacy region of XSAVE area;

FI;

FOR i := 2 TO 62
    IF TO_BE_SAVED[i] = 1

THEN save XSAVE state component i at offset n from base of XSAVE area (n enumerated by CPUID.0DH.i:EBX);
    FI;

ENDFOR;

XSTATE_BV field in XSAVE header := (OLD_BV AND NOT RFBM) OR (XINUSE AND RFBM);
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
XSAVEOPT void _xsaveopt( void * , unsigned __int64);
XSAVEOPT void _xsaveopt64( void * , unsigned __int64);
```
