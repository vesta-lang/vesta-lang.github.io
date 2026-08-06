---
summary: 快速系统调用
---

## 说明

SYSENTER在特权级0引用OS系统调用处理器. 它的运行取决于FRED过渡是否被启用.

FRED 过渡未启用时操作

当FRED的过渡没有启用时,SYSENTER是SYSEXIT的伴奏指令. SYSENTER被优化,以提供系统调用的最大性能,从在特权级别3运行的用户代码到在特权级别0运行的操作系统或执行程序.

当执行IA-32e模式时,SYSENTER指令将逻辑处理器转换为64位模式;否则,逻辑处理器仍保留在保护模式中.

在执行 SYSENTER 指令之前,软件必须指定特权级别 0 代码段和代码入口,并通过将特权级别 0 堆栈段和 栈指针 写入以下 MSR 的值来指定:

* IA32 SYSENTEER CS(MSR 地址:174H)--此MSR的下16位是段选择子,用于:

特权等级 0 代码段 。 此值也用于确定特权级0堆积段的段选择子(参见操作段). 此值不能表示无效选择器 。

* IA32 SYSENTER EIP (MSR 地址 176H) - 此 MSR 的值加载到 RIP (因此, 此值)

引用选定操作程序或程序的第一个指令。 在保护模式中,只有位数31:0被加载.

* IA32 SYSENTER ESP (MSR 地址: 175H) - 此 MSR 的值被加载到 RSP (因此, 此值)

包含特权级别 0 堆栈的 栈指针 。 此值不能代表非名称地址 。 在保护模式中,只有位数31:0被加载.

MSR写作确保IA32 SYSENTER EIP和IA32 SYSENTER ESP MSR总是包含犬科地址.

SYSENTER用IA32 SYSENTER CS MSR的数值加载CS和SS选择器,而CS和SS描述器缓存则不从这些选择器引用的描述器(在GDT或LDT)中加载. 相反,描述符缓存被装入固定值. 详情见行动科。 OS软件有责任确保这些选择器值引用的描述符(在GDT或LDT中)与装入描述符缓存的固定值相对应;SYSENTER指令不保证这种对应.

SYSENTER指令不能从实地址模式引用.

SYSENTER和SYSEXIT指令是伴奏指令,但它们不构成呼叫/返回对. 当执行 SYSENTER 指令时,处理器不会为用户代码保存状态信息(例如 指令指针),SYSENTER 和 SYSEXIT 指令都不支持在堆栈上传递参数.

要使用 SYSENTER 和 SYSEXIT 指令作为特权级别3 代码和特权级别0 操作系统程序之间的过渡的配套指令,必须遵循以下惯例: 使用权限级别3 代码和特权级别0 操作系统程序.

* 特权级 0 代码和堆栈代码以及特权级 3 代码和

堆栈片段必须在描述表格中毗连。 此惯例允许处理器从SYSENTEER CS MSR MSR输入的值中计算段选择器.

* 用用户代码执行的快速系统调用" stub" 常规( 通常在共享库或 DLLs) 必须保存

如果需要返回调用程序,则需要返回IP和处理器说明信息。 同样,

使用 SYSENTER 指令的操作系统或执行程序必须能够访问和使用此保存的返回,并在返回用户代码时说明信息。

SYSENTER和SYSEXIT指令在Pentium II处理器中被引入IA-32架构. 处理器上这些指令的可用性以SYSENTER/SYSEXIT 现时(SEP)特征旗表示,由CPUID 指令返回EDX 注册. 一个符合SEP旗条件的操作系统也必须符合处理器家族和模型,以确保SYSENTER/SYSEXIT指令实际存在. 例如:

```text
IF CPUID SEP bit is set
```

```text
   THEN IF (Family = 6) and (Model < 3) and (Stepping < 3)
```

```text
          THEN
```

SYSENTER/SYSEXIT_Not_Supported; FI;

```text
          ELSE
```

SYSENTER/SYSEXIT_Supported; FI;

FI;

当在Pentium Pro处理器(型号1)上执行 CPUID 指令时,处理器会按设置返回 SEP 旗,但不支持 SYSENTER/SYSEXIT 指令.

当在引用 SYSENTER 指令的特权级别启用阴影堆栈时, SSP 会被保存到 IA32 PL3 SSP MSR. 如果在特权级别 0 启用阴影堆栈, SSP 则加载 0 。 参考英特尔(R)64和IA-32架构软件开发者手册第1卷第6章"程序调用,中断,和例外"和第18章"控制流执行技术(CET)",以获得额外的CET细节.

FRED 过渡启用时

当FRED过渡被启用时,SYSENTER通过执行FRED事件交付来引用OS处理器. 见8.3节,"FRED事件交付",Intel(R)64和IA-32架构软件开发者手册,第3卷. 该事件使用事件类型7和矢量2来交付. 随着FRED的过渡,OS处理器使用ERETU指令返回到运行于CPL 3的调用代码.

指令令. 遵循一个SYSENTER的指令,可以在早期指令完成执行之前从内存中获取,但是在SYSENTER之前的所有指令完成执行之前,它们不会执行(甚至推测)(在早期指令存储的数据变得全球可见之前,后期指令可能执行).

## 行动

```text
IF CR0.PE = 0 OR (CR4.FRED = 0 AND IA32_SYSENTER_CS[15:2] = 0)

    THEN #GP(0); FI;

IF CR4.FRED = 0                                        (* Ensures protected mode execution *)
    THEN                                               (* Mask interrupts *)
          RFLAGS.VM := 0;
          RFLAGS.IF := 0;
          IF in IA-32e mode
                THEN
                      RSP := IA32_SYSENTER_ESP;
                      RIP := IA32_SYSENTER_EIP;
          ELSE
                      ESP := IA32_SYSENTER_ESP[31:0];
                      EIP := IA32_SYSENTER_EIP[31:0];
          FI;

CS.Selector := IA32_SYSENTER_CS[15:0] AND FFFCH;

                                       (* Operating system provides CS; RPL forced to 0 *)

(* Set rest of CS to a fixed value *)

CS.Base := 0;                                          (* Flat segment *)

CS.Limit := FFFFFH;                                    (* With 4-KByte granularity, implies a 4-GByte limit *)

CS.Type := 11;                                         (* Execute/read code, accessed *)


     CS.S := 1;                                  (* Entry is to 64-bit mode *)
     CS.DPL := 0;                                (* Required if CS.L = 1 *)
     CS.P := 1;
     IF in IA-32e mode                           (* 32-bit code segment*)
                                                 (* 4-KByte granularity *)
           THEN
                 CS.L := 1;
                 CS.D := 0;

           ELSE
                 CS.L := 0;
                 CS.D := 1;

     FI;
     CS.G := 1;

     IF ShadowStackEnabled(CPL)
           THEN
                 IF IA32_EFER.LMA = 0
                       THEN IA32_PL3_SSP := SSP;
                       ELSE (* adjust so bits 63:N get the value of bit N1, where N is the CPU's maximum linear-address width *)
                             IA32_PL3_SSP := LA_adjust(SSP);
                 FI;

     FI;

     CPL := 0;

     IF ShadowStackEnabled(CPL)
           SSP := 0;

     FI;
     IF EndbranchEnabled(CPL)

           IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
           IA32_S_CET.SUPPRESS = 0
     FI;

          SS.Selector := CS.Selector + 8;        (* SS just above CS *)
          (* Set rest of SS to a fixed value *)  (* Flat segment *)
          SS.Base := 0;                          (* With 4-KByte granularity, implies a 4-GByte limit *)
          SS.Limit := FFFFFH;                    (* Read/write data, accessed *)
          SS.Type := 3;
          SS.S := 1;                             (* 32-bit stack segment*)
          SS.DPL := 0;                           (* 4-KByte granularity *)
          SS.P := 1;                             (* save instruction length on stack *)
          SS.B := 1;
          SS.G := 1;
    ELSE (* CR4.FRED = 1 *)
          FRED event delivery of SYSENTER;
FI;
```

## 受影响的旗帜

VM,IF(见上文行动)。
