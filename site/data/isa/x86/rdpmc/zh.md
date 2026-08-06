---
summary: 读取性能监测计数器
---

## 说明

在EDX:EAX登记册中读取ECX指定的性能监测计数器(PMC)的内容. (关于支持英特尔64架构的处理器,RCX的高阶32位被忽略. ) EDX寄存器装入了PMC的高阶32位,EAX寄存器装入了低阶32位. (关于支持Intel 64架构的处理器,RAX和RDX的每个高序32位被清除. )如果在正在读取的PMC中执行的比特不到64位,未执行的比特返回到EDX:EAX的值将为零.

支持建筑性能监测的处理器上的PMC的宽度(CPUID.0AH:EAX[7:0] 0)是

由CPUID.0AH:EAX[23:16]报告. 在不支持建筑性能监测的处理器(CPUID.0AH:EAX[7:0]=0)上,通用性能PMC的宽度为40比特,而特殊性能PMC的宽度则是具体的执行.

使用 ECX 指定 PMC 取决于处理器是否支持建筑性能监测 :

* 如果处理器不支持建筑性能监测(CPUID.0AH:EAX[7:0]=0),ECX[30:0]

指定要读取的 PMC 索引。 设置 ECX[31] 如果支持,则选择" 快速" 读取模式 。 在此模式下,RDPMC在EAX中返回31:0的PMC,同时将EDX清除为零.

* 如果处理器确实支持建筑性能监测(CPUID.0AH:EAX[7:0]0),ECX[31:16]

指定 PMC 的类型,而 ECX [15:0] 指定该类型内要读取的 PMC 索引。 目前定义的PMC类型如下:

--通用计数器使用0型. 要读取 IA32 PMCx, 索引 x 必须持有以下之一 :

* 它小于CPUID.0AH:EAX[15:8]所列举的值;或 * 它最多为31,CPUID.23H.01H:EAX[x]所列举的值为1.

--固定功能计数器使用4000H型. 要读取 IA32 FIXED CTRx,以下之一必须持有索引 x :

* 它小于CPUID.0AH:EDX[4:0]所列举的值; * A. 最多为31,CPUID.0AH:ECX[x]所列值为1;或 * 它最多为31,CPUID.23H.01H:EBX[x]所列举的值为1.

-- 性能衡量标准使用2000H类型. 只有当 IA32_PERF_CAPABILITIES.PERF_MET- RICS AVAILALAL[bit 15]=1时,该类型才能使用. 对于这种类型,ECX[15:0]中的指数是具体的执行.

指定一个不支持的 PMC 编码将会导致一般保护例外 #GP(0) 。 关于PMC的细节,参见第21章,"最后一分支记录",见Intel(R)64和IA-32 Architectures Software Developers's Handory,Volume 3B.

当在受保护或虚拟8086模式下时,注册号CR4中的性能监测计数器(PCE)旗限制使用RDPMC指令. PCE旗设定后,RDPMC指令可以在任何特权级别执行;当旗帜清晰时,指令只能在特权级别0执行. (当在真地址模式下, RDPMC 指令总是启用. ) PMC 也可以与 RDMSR 指令一起读取, 当执行特权级别 0 时.

如果 IA32_PERF_CAPABILITIES.RDPMC_METRICS_CLEAR[bit 19] 设定,支持性能度量的处理器也可以支持在读时清除它们。 自IA32 PERF CAPABILIES MSR以来

列举非结构化的 PMU 特性,软件应该检查显示家庭和显示模式,以确认处理器支持下一段中描述的功能.

IA32_FIXED_CTR_CTRL.METRICS_CLEAR_EN[bit 14]设定后,一个用于PERF METRICS的RDPMC指令(即ECX=0x2000'000)清除了与PERF METRICS相关的资源以及完成读取后的固定功能性能监测计数器3. 当METRICS CLEAR EN清晰时,RDPMC指令只读作PERF METRICS.

RDPMC指令不是一个序列化指令;也就是说,它并不意味着前述指令导致的所有事件都已完成,或者后续指令导致的事件尚未开始. 如果需要精确的事件计数,软件必须在RDPMC指令之前和/或之后插入序列化指令(如CPUID指令).

进行背对背快速读取不能保证单调. 为了保证背对背读上的单调性,必须在两个RDPMC指令之间放置一个序列化指令.

RDPMC指令可以在16位地址模式或虚拟 8086 模式中执行;然而,ECX寄存器的全部内容被用于选择PMC,事件计数存储在完整的EAX和EDX寄存器中. RDPMC指令在Pentium Pro处理器和Pentium处理器中被引入IA-32架构,并带有MMX技术. 早期的Pentium处理器有PMC,但必须随RDMSR指令阅读.

## 行动

```text
MSCB = Most Significant Counter Bit (* Model-specific *)
IF (((CR4.PCE = 1) or (CPL = 0) or (CR0.PE = 0)) and (ECX indicates a supported counter))

    THEN
          EAX := counter[31:0];
          EDX := ZeroExtend(counter[MSCB:32]);

    ELSE (* ECX is not valid or CR4.PCE is 0 and CPL is 1, 2, or 3 and CR0.PE is 1 *)
          #GP(0);

FI;
```

## 受影响的旗帜

None.
