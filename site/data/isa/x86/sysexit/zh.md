---
summary: 从快速系统调用返回
---

## 说明

执行快速返回特权等级3的用户代码. SYSEXIT是SYSENTER指令的伴奏指令. 该指示得到优化,以提供从保护级别0执行的系统程序到保护级别3执行的用户程序的回报最大性能. 它必须从代码执行 在特权级别0。

使用64位的操作数大小,SYSEXIT仍然处于64位模式;否则,它要么进入兼容模式(如果逻辑处理器处于IA-32e模式),要么留在保护模式(如果不是).

在执行 SYSEXIT 之前,软件必须指定特权级别3的代码段和代码入口,并通过将特权级别3的堆栈段和 栈指针 写入以下 MSR 和 通用寄存器 的值来指定:

* IA32 SYSENTER CS (MSR 地址 174H) - 包含一个32位的值,用于确定片段

特权级别 3 代码和堆栈片段的选择器(见操作部分)

* RDX - 此寄存器中的条形地址装入 RIP( 因此, 此值引用第一个指令)

)),将在用户代码中执行. 如果返回不为64位模式,则只装入比特31:0.

* RCX - 此寄存器中的条形地址装入RSP( 因此, 此值包含 栈指针 for

特权级别 3 堆栈 。 如果返回不为64位模式,则只装入比特31:0.

IA32 SYSENTEER CS MSR可以使用RDMSR和WRMSR读写.

SYSEXIT用IA32 SYSENTER CS MSR的数值加载CS和SS选择器,而CS和SS描述器缓存则不从这些选择器引用的描述器(在GDT或LDT)中加载. 相反,描述符缓存被装入固定值. 详情见行动科。 OS软件有责任确保这些选择器值引用的描述符(在GDT或LDT中)与装入描述符缓存的固定值相对应;SYSEXIT指令不保证这种对应.

SYSEXIT指令可以从除实地址模式和虚拟 8086 模式之外的所有操作模式中引用.

SYSENTER和SYSEXIT指令在Pentium II处理器中被引入IA-32架构. 处理器上这些指令的可用性以SYSENTER/SYSEXIT 现时(SEP)特征旗表示,由CPUID 指令返回EDX 注册. 一个符合SEP旗条件的操作系统也必须符合处理器家族和模型,以确保SYSENTER/SYSEXIT指令实际存在. 例如:

```text
IF CPUID SEP bit is set
    THEN IF (Family = 6) and (Model < 3) and (Stepping < 3)
          THEN
```

SYSENTER/SYSEXIT_Not_Supported; FI;

```text
          ELSE
```

SYSENTER/SYSEXIT_Supported; FI;

FI;

当在Pentium Pro处理器(型号1)上执行 CPUID 指令时,处理器会按设置返回 SEP 旗,但不支持 SYSENTER/SYSEXIT 指令.

当在特权级别3启用阴影堆栈时,指令加载SSP,其值来自IA32 PL3 SSP MSR. 参考英特尔(R)64和IA-32架构软件开发者手册第1卷第7章"干扰和例外处理"和第18章"控制流执行技术(CET)",以获得额外的CET细节.

启用 FRED 转换时无法执行指令 。 一个已经允许FRED过渡的操作系统应该使用ERETU代替.

指令令. 遵循一个SYSEXIT的指令,可以在早期指令完成执行之前从内存中获取,但是在SYSEXIT之前的所有指令完成执行之前,它们不会执行(甚至推测)(在早期指令存储的数据变得全球可见之前,后期指令可能执行).

## 行动

```text
IF CR4.FRED = 1
    THEN #UD; FI;

IF IA32_SYSENTER_CS[15:2] = 0 OR CR0.PE = 0 OR CPL  0 THEN #GP(0); FI;

IF operand size is 64-bit
    THEN (* Return to 64-bit mode *)
          RSP := RCX;
          RIP := RDX;
    ELSE (* Return to protected mode or compatibility mode *)
          RSP := ECX;
          RIP := EDX;

FI;

IF operand size is 64-bit                   (* Operating system provides CS; RPL forced to 3 *)

     THEN CS.Selector := IA32_SYSENTER_CS[15:0] + 32;

     ELSE CS.Selector := IA32_SYSENTER_CS[15:0] + 16;

FI;

CS.Selector := CS.Selector OR 3;            (* RPL forced to 3 *)

(* Set rest of CS to a fixed value *)

CS.Base := 0;                               (* Flat segment *)

CS.Limit := FFFFFH;                         (* With 4-KByte granularity, implies a 4-GByte limit *)

CS.Type := 11;                              (* Execute/read code, accessed *)

CS.S := 1;

CS.DPL := 3;

CS.P := 1;

IF operand size is 64-bit

     THEN (* return to 64-bit mode *)

     CS.L := 1;                             (* 64-bit code segment *)

     CS.D := 0;                             (* Required if CS.L = 1 *)

     ELSE (* return to protected mode or compatibility mode *)

     CS.L := 0;

     CS.D := 1;                             (* 32-bit code segment*)

FI;

CS.G := 1;                                  (* 4-KByte granularity *)

CPL := 3;

IF ShadowStackEnabled(CPL)                  (* SS just above CS *)
    THEN SSP := IA32_PL3_SSP;
                                            (* Flat segment *)
FI;                                         (* With 4-KByte granularity, implies a 4-GByte limit *)

SS.Selector := CS.Selector + 8;
(* Set rest of SS to a fixed value *)
SS.Base := 0;
SS.Limit := FFFFFH;


SS.Type := 3;                               (* Read/write data, accessed *)
SS.S := 1;
SS.DPL := 3;                                (* 32-bit stack segment*)
SS.P := 1;                                  (* 4-KByte granularity *)
SS.B := 1;
SS.G := 1;
```

## 受影响的旗帜

None.
