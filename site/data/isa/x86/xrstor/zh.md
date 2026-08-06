---
summary: 恢复处理器扩展国家
---

## 说明

从 XSAVE 指定内存地址的 源操作数 区域实现处理器状态组件的全部或部分恢复. 隐含的EDX:EAX寄存器对齐指定了64位指令掩码. 恢复的特定状态组件对应了请求的-feature位图(RFBM)中设置的位元,这是EDX:EAX和XCR0的逻辑-AND.

XSAVE区域的格式详见第13.4节,"XSAVE区域",Intel(R)64和IA-32架构软件开发者手册第1卷. 和FXRSTOR和FXSAVE一样,x87状态使用的内存格式依赖于REX.W前缀;参见Intel(R)64和IA-32架构软件开发者手册第1卷第13.5.1节,"x87状态".

第13.8节,"XRSTOR的操作",Intel(R)64和IA-32 Architectures Software开发者手册,第一卷详细介绍了XRSTOR指令的操作. 以下项目为高级别大纲:

* XRSTOR的执行可以采取两种形式之一:标准式和紧凑式. XCOMP BV 字段的位数 63

XSAVE头决定使用哪种形式:值0指定了标准形式,值1指定了压缩形式.

* 如果 RFBM[i] = 0, XRSTOR 不更新状态组件 i.1 * 如果 RFBM[i] = 1 和 bit I 在 XSAVE 头部的 XSTATE BV 字段中是清晰的, XRSTOR 初始化状态

component i.

* 若RFBM[i]=1,且XSTATE BV[i]=1,XRSTOR从XSAVE区域负载状态组件i. * XRSTOR的标准形式对MXCSR(属于状态组件1-SSE的一部分)的处理不同于

XMM登记。 如果其中任一形式试图将 MXCSR 装入非法值,则会出现一般保护例外(#GP).

* XRSTOR 装入内部值 XRSTOR INFO,可用于优化后续执行

XSAVEOPT or XSAVES.

* 执行 XRSTOR 后,处理器轨迹立即作为内用(不是初始配置) 任何

状态组件 i, RFBM[i] = 1, XSTATE BV[i] = 1; 它跟踪任何状态组件 i, RFBM[i] = 0。

使用不与64字节边界对齐的源操作数(对于64位和32位模式),导致一般保护(#GP)例外. 在64位模式中,RDX和RAX的上32位被忽略.

见Intel(R)64和IA-32架构软件开发者手册第13.6节"XSAVE-Managed State的处理器跟踪",第一卷,用于讨论位图XINUSE和XMODIFIED以及数量XRSTOR INFO.

1. 联合国 若RFBM[1]=0,RFBM[2]=1. 在这种情况下,XRSTOR的标准形式会从内存中加载MXCSR,尽管MXCSR是状态组件1-SSE的一部分. XRSTOR的紧凑形式不作此例外.

## 行动

```text
RFBM := XCR0 AND EDX:EAX; /* bitwise logical AND */
COMPMASK := XCOMP_BV field from XSAVE header;
RSTORMASK := XSTATE_BV field from XSAVE header;

IF COMPMASK[63] = 0
    THEN
          /* Standard form of XRSTOR */
          TO_BE_RESTORED := RFBM AND RSTORMASK;
          TO_BE_INITIALIZED := RFBM AND NOT RSTORMASK;

          IF TO_BE_RESTORED[0] = 1
                THEN
                       XINUSE[0] := 1;
                       load x87 state from legacy region of XSAVE area;

          ELSIF TO_BE_INITIALIZED[0] = 1
                THEN
                       XINUSE[0] := 0;
                       initialize x87 state;

          FI;

          IF RFBM[1] = 1 OR RFBM[2] = 1
                THEN load MXCSR from legacy region of XSAVE area;

          FI;

          IF TO_BE_RESTORED[1] = 1
                THEN
                       XINUSE[1] := 1;
                       load XMM registers from legacy region of XSAVE area; // this step does not load MXCSR

          ELSIF TO_BE_INITIALIZED[1] = 1
                THEN
                       XINUSE[1] := 0;
                       set all XMM registers to 0; // this step does not initialize MXCSR

          FI;

          FOR i := 2 TO 62
                IF TO_BE_RESTORED[i] = 1
                       THEN
                             XINUSE[i] := 1;
                             load XSAVE state component i at offset n from base of XSAVE area;
                                   // n enumerated by CPUID.0DH.i:EBX)
                ELSIF TO_BE_INITIALIZED[i] = 1
                       THEN
                             XINUSE[i] := 0;
                             initialize XSAVE state component i;
                FI;

          ENDFOR;

    ELSE
          /* Compacted form of XRSTOR */
          IF CPUID.0DH.01H:EAX.XSAVEC[1] = 0
                THEN /* compacted form not supported */
                       #GP(0);
          FI;


     FORMAT = COMPMASK AND 7FFFFFFF_FFFFFFFFH;
     RESTORE_FEATURES = FORMAT AND RFBM;
     TO_BE_RESTORED := RESTORE_FEATURES AND RSTORMASK;
     FORCE_INIT := RFBM AND NOT FORMAT;
     TO_BE_INITIALIZED = (RFBM AND NOT RSTORMASK) OR FORCE_INIT;

     IF TO_BE_RESTORED[0] = 1
           THEN
                 XINUSE[0] := 1;
                 load x87 state from legacy region of XSAVE area;

     ELSIF TO_BE_INITIALIZED[0] = 1
           THEN
                 XINUSE[0] := 0;
                 initialize x87 state;

     FI;

     IF TO_BE_RESTORED[1] = 1
           THEN
                 XINUSE[1] := 1;
                 load SSE state from legacy region of XSAVE area; // this step loads the XMM registers and MXCSR

     ELSIF TO_BE_INITIALIZED[1] = 1
           THEN
                 set all XMM registers to 0;
                 XINUSE[1] := 0;
                 MXCSR := 1F80H;

     FI;

     NEXT_FEATURE_OFFSET = 576;            // Legacy area and XSAVE header consume 576 bytes

     FOR i := 2 TO 62

     IF FORMAT[i] = 1

              THEN

              IF TO_BE_RESTORED[i] = 1

                        THEN

                        XINUSE[i] := 1;

                        load XSAVE state component i at offset NEXT_FEATURE_OFFSET from base of XSAVE area;

              FI;

NEXT_FEATURE_OFFSET = NEXT_FEATURE_OFFSET + n (n enumerated by CPUID.0DH.i:EAX);

     FI;

     IF TO_BE_INITIALIZED[i] = 1

              THEN

              XINUSE[i] := 0;

              initialize XSAVE state component i;

     FI;

     ENDFOR;

FI;

XMODIFIED := NOT RFBM;

IF in VMX non-root operation
    THEN VMXNR := 1;
    ELSE VMXNR := 0;

FI;
LAXA := linear address of XSAVE area;


XRSTOR_INFO := CPL,VMXNR,LAXA,COMPMASK;
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
XRSTOR void _xrstor( void * , unsigned __int64);
XRSTOR void _xrstor64( void * , unsigned __int64);
```
