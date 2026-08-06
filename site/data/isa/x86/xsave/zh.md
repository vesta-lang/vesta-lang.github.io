---
summary: 保存处理器扩展状态
---

## 说明

执行完整或部分保存处理器状态组件到XSAVE位于目标操作数指定的内存地址的区域. 隐含的EDX:EAX寄存器对齐指定了64位指令掩码. 保存的特定状态组件对应了请求的-feature位图(RFBM)中设置的位点,该位点是EDX:EAX和XCR0的逻辑-AND.

XSAVE区域的格式详见第13.4节,"XSAVE区域",Intel(R)64和IA-32架构软件开发者手册第1卷. 和FXRSTOR和FXSAVE一样,x87状态使用的内存格式依赖于REX.W前缀;参见Intel(R)64和IA-32架构软件开发者手册第1卷第13.5.1节,"x87状态".

第13.7节,"XSAVE的操作",Intel(R)64和IA-32 Architectures Software开发者手册,第一卷详细介绍了XSAVE指令的操作. 以下项目为高级别大纲:

* XSAVE 保存状态组件 i 如果且仅当 RFBM [i] = 1.1 * XSAVE不修改XSAVE地区遗存区域的字节511:464(见第13.4.1节,"Legacy").

XSAVE区域的区域"Intel(R)64和IA-32架构软件开发者手册,第一卷.

* XSAVE读取了XSAVE头部的XSTATE BV字段(参见Intel(R)64和13.4.2节"XSAVE头部").

IA-32 Architectures Software开发者手册第1卷,并将修改后的值写回内存如下. 如果 RFBM[i] = 1, XSAVE 写作 XSTATE BV[i],值为 XINUSE[i]. (XINUSE是一个位图,处理器通过它跟踪各种状态组件的状态. 见Intel(R)64和IA-32架构软件开发者手册第1卷第13.6节"XSAVE-管理状态的处理器跟踪". 若RFBM[i]=0,XSAVE写作XSTATE BV[i],其数值为从内存读取(不修改比特). XSAVE除XSTATE BV字段外,不向XSAVE头部的任何一个部分写.

* XSAVE总是使用XSAVE区域的扩展区域的标准格式(参见第13.4.3节,Intel(R)64的"XSAVE区域的扩展区域"和IA-32的架构软件开发者手册第1卷).

使用不与64字节边界对齐的目标操作数(在64位或32位模式中)导致一般保护(#GP)例外. 在64位模式中,RDX和RAX的上32位被忽略.

1. 联合国 MXCSR和MXCSR MASK都有例外,它们属于状态组件1-SSE. XSAVE如果RFBM[1]或RFBM[2]是1.

## 行动

```text
RFBM := XCR0 AND EDX:EAX; /* bitwise logical AND */
OLD_BV := XSTATE_BV field from XSAVE header;

IF RFBM[0] = 1
    THEN store x87 state into legacy region of XSAVE area;

FI;

IF RFBM[1] = 1
    THEN store XMM registers into legacy region of XSAVE area; // this step does not save MXCSR or MXCSR_MASK

FI;

IF RFBM[1] = 1 OR RFBM[2] = 1
    THEN store MXCSR and MXCSR_MASK into legacy region of XSAVE area;

FI;

FOR i := 2 TO 62
    IF RFBM[i] = 1

THEN save XSAVE state component i at offset n from base of XSAVE area (n enumerated by CPUID.0DH.i:EBX);
    FI;

ENDFOR;

XSTATE_BV field in XSAVE header := (OLD_BV AND NOT RFBM) OR (XINUSE AND RFBM);
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
XSAVE void _xsave( void * , unsigned __int64);
XSAVE void _xsave64( void * , unsigned __int64);
```
