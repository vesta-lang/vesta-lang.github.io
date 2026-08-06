---
summary: 用缩合物保存处理器扩展状态
---

## 说明

执行完整或部分保存处理器状态组件到XSAVE位于目标操作数指定的内存地址的区域. 隐含的EDX:EAX寄存器对齐指定了64位指令掩码. 保存的特定状态组件对应了请求的-feature位图(RFBM)中设置的位点,该位点是EDX:EAX和XCR0的逻辑-AND.

XSAVE区域的格式详见第13.4节,"XSAVE区域",Intel(R)64和IA-32架构软件开发者手册第1卷. 和FXRSTOR和FXSAVE一样,x87状态使用的内存格式依赖于REX.W前缀;参见Intel(R)64和IA-32架构软件开发者手册第1卷第13.5.1节,"x87状态".

第13.10节,"XSAVEC的操作",Intel(R)64和IA-32 Architectures Software开发者手册,第一卷详细介绍了XSAVEC指令的操作. 以下项目为高级别大纲:

* XSAVEC的执行与XSAVE相似. XSAVEC 与 XSAVE 不同之处在于它使用紧凑和

它可以使用init优化。

* XSAVEC 保存状态组件 i 如果且只有在 RFBM[i] = 1 和 XINUSE[i] = 1.1 (XINUSE 是一个位图,

处理器跟踪各种状态组件的状态。 见Intel(R)64和IA-32架构软件开发者手册第1卷第13.6节"XSAVE-管理状态的处理器跟踪".

* XSAVEC不修改XSAVE地区遗留区域的字节511:464(见第13.4.1节,英特尔(R)64和IA-32架构软件开发者手册,第一卷"XSAVE地区遗留区域").

* XSAVEC将RFBM和XINUSE的逻辑AND写到XSAVE头部的XSTATE BV字段. 2,3(见Intel(R)64和IA-32架构软件开发者手册第1卷第13.4.2节"XSAVE头部"). XSAVEC将XCOMP BV字段的第63位设定为该字段的第62:0位设定为RFBM[62:0]. XSAVEC除XSTATE BV和XCOMP BV字段外,不向XSAVE头部的任意部分写入.

* XSAVEC总是使用XSAVE区域扩展区域的紧凑格式(参见第13.4.3节,Intel(R)64的"XSAVE区域扩展区域"和IA-32架构软件开发者手册第1卷).

使用不与64字节边界对齐的目标操作数(在64位或32位模式中)导致一般保护(#GP)例外. 在64位模式中,RDX和RAX的上32位被忽略.

1. 联合国 状态组件1(SSE)有例外. MXCSR是SSE状态的一部分,但XINUSE[1]即使MXCSR没有它的初始值1F80H,也可能是0. 在这种情况下,XSAVEC保存SSE状态,只要RFBM[1]=1.

2. 国家 与XSAVE和XSAVEOPT不同,XSAVEC在XSTATE BV字段中清除了对应RFBM中清晰的位.

3个 状态组件1(SSE)有例外. MXCSR是SSE状态的一部分,但XINUSE[1]即使MXCSR没有它的初始值1F80H,也可能是0. 在这种情况下,XSAVEC将XSTATE BV[1]设置到1,只要RFBM[1]=1.

## 行动

```text
/* bitwise logical AND */
                                 /* bitwise logical AND */
RFBM := XCR0 AND EDX:EAX;
TO_BE_SAVED := RFBM AND XINUSE;
If MXCSR  1F80H AND RFBM[1]

    TO_BE_SAVED[1] = 1;
FI;

IF TO_BE_SAVED[0] = 1
    THEN store x87 state into legacy region of XSAVE area;

FI;

IF TO_BE_SAVED[1] = 1
    THEN store SSE state into legacy region of XSAVE area; // this step saves the XMM registers, MXCSR, and MXCSR_MASK

FI;

NEXT_FEATURE_OFFSET = 576;       // Legacy area and XSAVE header consume 576 bytes

FOR i := 2 TO 62

IF RFBM[i] = 1

     THEN

         IF TO_BE_SAVED[i]

                  THEN save XSAVE state component i at offset NEXT_FEATURE_OFFSET from base of XSAVE area;

         FI;

NEXT_FEATURE_OFFSET = NEXT_FEATURE_OFFSET + n (n enumerated by CPUID.0DH.i:EAX);

FI;

ENDFOR;

XSTATE_BV field in XSAVE header := TO_BE_SAVED;
XCOMP_BV field in XSAVE header := RFBM OR 80000000_00000000H;
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
XSAVEC void _xsavec( void * , unsigned __int64);
XSAVEC64 void _xsavec64( void * , unsigned __int64);
```
