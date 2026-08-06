---
summary: 保存处理器扩展状态监督
---

## 说明

执行完整或部分保存处理器状态组件到XSAVE位于目标操作数指定的内存地址的区域. 隐含的EDX:EAX寄存器对齐指定了64位指令掩码. 保存的特定状态组件对应了请求的位图(RFBM)中设置的位元,逻辑-AND的EDX:EAX和逻辑-OR的XCR0与IA32 XSS MSR. XSAVES只有在CPL=0.

XSAVE区域的格式详见Intel(R)64和IA-32架构软件开发者手册第1卷第13.4节"XSAVE区域". 和FXRSTOR和FXSAVE一样,x87状态使用的内存格式依赖于REX.W前缀;参见Intel(R)64和IA-32架构软件开发者手册第1卷第13.5.1节,"x87状态".

第13.11节,"XSAVES的操作",Intel(R)64和IA-32架构软件开发者手册,第一卷详细介绍了XSAVES指令的操作. 以下项目为高级别大纲:

* XSAVES的执行与XSAVEC相似. XSAVES与XSAVEC不同,因为它可以保存状态

与IA32 XSS MSR中设置的比特相对应的组件,并且它可能使用修改后的优化.

* XSAVES 保存状态组件 i 只当 RFBM[i] = 1 和 XINUSE[i] = 1.1 (XINUSE 是一个位图,通过它

处理器跟踪各种状态组件的状态。 见英特尔(R)64和IA-32架构软件开发者手册第1卷第13.6节"XSAVE-管理状态的处理器跟踪". ) 即使两个比特都是1,XSAVES也可以优化而不是保存状态组件一,如果(1)自上次执行XRSTOR或XRSTORS后,状态组件一没有被修改;(2) XSAVES的这次执行与XRSTOR INFO确定的XRSTOR或XRSTORS的最后一次执行对应(见下文操作部分).

* XSAVES不修改XSAVE地区遗留区域的字节511:464(参见第13.4.1节,"XSAVE地区的遗留区域",Intel(R)64和IA-32架构软件开发者手册,第一卷).

* XSAVES将RFBM和XINUSE的逻辑AND写到XSAVE头部2的XSTATE BV字段(见Intel(R)64和IA-32架构软件开发者手册第1卷第13.4.2节"XSAVE头部"). XSAVES将XCOMP BV字段第63位,将该字段第62:0位设定为RFBM[62:0]. XSAVES除XSTATE BV和XCOMP BV字段外,不向XSAVE头部的任意部分写入.

* XSAVES总是使用XSAVE区域扩展区域的紧凑格式(参见第13.4.3节,"XSAVE区域扩展区域",Intel(R)64和IA-32架构软件开发者手册第1卷).

使用不与64字节边界对齐的目标操作数(在64位或32位模式中)导致一般保护(#GP)例外. 在64位模式中,RDX和RAX的上32位被忽略.

1. 联合国 状态组件1(SSE)有例外. MXCSR是SSE状态的一部分,但XINUSE[1]即使MXCSR没有它的初始值1F80H,也可能是0. 在这种情况下,init优化不适用,只要RFBM[1]=1,XSAVEC将保存SSE状态,修改后的优化不应用.

2. 国家 状态组件1(SSE)有例外. MXCSR是SSE状态的一部分,但XINUSE[1]即使MXCSR没有它的初始值1F80H,也可能是0. 在这种情况下,XSAVES将XSTATE BV[1]设置到1,只要RFBM[1]=1.

见Intel(R)64和IA-32架构软件开发者手册第13.6节"XSAVE-Managed State的处理器跟踪",第一卷,用于讨论位图XMODIFIED和数量XRSTOR INFO.

## 行动

```text
RFBM := (XCR0 OR IA32_XSS) AND EDX:EAX;            /* bitwise logical OR and AND */

IF in VMX non-root operation

     THEN VMXNR := 1;

     ELSE VMXNR := 0;

FI;

LAXA := linear address of XSAVE area;

COMPMASK := RFBM OR 80000000_00000000H;

TO_BE_SAVED := RFBM AND XINUSE;

IF XRSTOR_INFO = CPL,VMXNR,LAXA,COMPMASK

     THEN TO_BE_SAVED := TO_BE_SAVED AND XMODIFIED;

FI;

IF MXCSR  1F80H AND RFBM[1]

     THEN TO_BE_SAVED[1] = 1;

FI;

IF TO_BE_SAVED[0] = 1
    THEN store x87 state into legacy region of XSAVE area;

FI;

IF TO_BE_SAVED[1] = 1
    THEN store SSE state into legacy region of XSAVE area; // this step saves the XMM registers, MXCSR, and MXCSR_MASK

FI;

NEXT_FEATURE_OFFSET = 576;             // Legacy area and XSAVE header consume 576 bytes

FOR i := 2 TO 62

     IF RFBM[i] = 1

          THEN

           IF TO_BE_SAVED[i]

                     THEN

                       save XSAVE state component i at offset NEXT_FEATURE_OFFSET from base of XSAVE area;

                       IF i = 8  // state component 8 is for PT state

                            THEN IA32_RTIT_CTL.TraceEn[bit 0] := 0;

                       FI;

           FI;

NEXT_FEATURE_OFFSET = NEXT_FEATURE_OFFSET + n (n enumerated by CPUID.0DH.i:EAX);

     FI;

ENDFOR;

NEW_HEADER := RFBM AND XINUSE;
IF MXCSR  1F80H AND RFBM[1]

    THEN NEW_HEADER[1] = 1;
FI;
XSTATE_BV field in XSAVE header := NEW_HEADER;
XCOMP_BV field in XSAVE header := COMPMASK;
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
XSAVES void _xsaves( void * , unsigned __int64);
XSAVES64 void _xsaves64( void * , unsigned __int64);
```
