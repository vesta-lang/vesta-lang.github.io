---
summary: 在交易执行中测试
---

## 说明

XTEST 指令询问交易执行状态 。 如果指令在交易中执行 RTM 区域或交易中执行 HLE 区域,则ZF 旗被清除,否则被设定.

## 行动

```text
XTEST
IF (RTM_ACTIVE = 1 OR HLE_ACTIVE = 1)

    THEN
          ZF := 0

    ELSE
          ZF := 1

FI;
```

## 受影响的旗帜

如果指令以交易方式执行, ZF 旗将被清除; 否则它被设定为 1 。 CF, OF, SF, PF,和AF, 旗帜被清除.

## Intel C/C++ 内在编译器

```c
XTEST int _xtest( void );
```

## SIMD 浮点 例外

None.

## 其他例外

```text
#UDCPUID.07H.00H:EBX.HLE[4] = 0 and CPUID.07H.00H:EBX.RTM[11] = 0.
```

如果使用 LOCK 前缀 。

CHAPTER 7

7.1 OVERVIEW

本章描述了Intel 64和IA-32架构的更安全模式扩展(SMX). 更安全模式扩展(SMX)为系统软件提供了一个编程接口,以便在平台内建立被测量的环境,支持终端用户的信任决定. 所测量的环境包括:

* 测量系统执行官的发射,称为测量发射环境(MLE)1. 系统执行器可能基于虚拟机监视器(VMM),一个测量的VMM被称为MVMM2.

* 确保上述测量的机制受到保护并储存在平台的安全位置。 * 保护机制允许VMM控制修改VMM的尝试.

测量环境使用的测量和保护机制得到Intel(R)受托执行技术(Intel(R) TXT)平台能力的支持:

* SMX是一个Intel TXT平台中的处理器编程接口. * 一个Intel TXT平台中的芯片提供了保护机制的强制执行. * 平台中信任的平台模块(TPM)1.2提供平台配置注册(PCR)存储

软件测量值。

7.2 SMX FUNCTIONALITY

SMX功能通过GETSEC指令通过叶功能在Intel 64处理器中提供. GETSEC指令支持多个叶函数. 叶函数按EAX当时GETSEC执行。 每个GETSEC 叶函数在参考页中单独记录,具有独特的元音(尽管这些元音相同操作码,0F 37).

7.2.1 探测和促成SMX

软件可以使用CPUID指令检测SMX操作的支持. 如果软件在EAX中执行带有1的CPUID,则ECX中1位6的值表示对SMX操作的支持(GETSEC可用),参见CPUID关于CPUID.01H:ECX上报的特征旗帜布局的指示.

系统软件通过在尝试执行GETSEC前设置CR4.SMXE[Bit 14] = 1,实现了SMX操作. 否则,执行GETSEC会导致处理器信号无效的操作码例外(#UD).

如果CPUID SMX的特征旗帜是清晰的(CPUID.01H:ECX[6]=0),试图设置CR4.SMXE[Bit 14]的结果是一般的保护例外.

IA32 FEATURE CONTROL MSR(地址为03AH)提供特性控制位,配置VMX和SMX的操作. 表7-1记录了这些位点。

位位置表 7 - 1 。 IA32 FEATURE CONTROL 0 描述 1 锁位(0=解锁,1=锁)的布局. 当设定为" 1" 时, MSR 会被封杀。 2 在 SMX 操作中启用 VMX 。 在 SMX 操作之外启用 VMX 。

1. 联合国 见英特尔(R)受托执行技术计量启动环境编程指南.

2. 国家 一个MVMM有时被称为一个测量的发射环境(MLE). 见英特尔(R)受托执行技术计量启动环境编程指南.

7:3 表7-1. 互联网档案馆的存檔,存档日期2013-07-02. IA32 FEATURE CONTROL 14:8 保留 SENTER 本地函数的布局启用 : 设定时,字段中的每个位代表对应的15 SENTER函数的启用控制. 16 SENTER Global Election: 必须设置为" 1 " , 才能运行 GETSEC [SENTER] 。 17 保留 SGX 发射控制 启用 : 必须设定为" 1 " , 以便通过 18 IA32  SGXLEPKEYHASHn MSR. 19 SGX Global Election 实现运行时间重配置 SGX 发射控制 : 必须设置为" 1 " , 以便启用 Intel SGX 叶 函数。 20 Reserved LMCE On : 设定时,系统软件可以编程与LMCE相关的MSR,以配置向单一逻辑处理器发送约63:21的机器检查例外. 准备金

* 0位是一个锁位。 如果锁位清晰, 执行 VMXON 的尝试将导致一般保护

除外。 试图在锁位清晰时执行 GETSEC [SENTER] 也会引起一般-

保护例外。 如果锁定位被设定, WRMSR 到 IA32 FEATURE CONTROL MSR 将会导致一个常规 -

保护例外。 一旦锁定位被设定,MSR在重设功率之前无法修改. 系统 BIOS

可以使用此位来提供BIOS的设置选项来禁用VMX,SMX或VMX和SMX两种支持.

* Bit 1 可以在 SMX 操作中实现 VMX(介于执行 SENTER 和 SEXIT 和 GETSEC 的 叶). 如果这个位

已明确, 执行 VMXON 在 SMX 中的尝试, 如果执行 SMX , 将会导致一般保护例外

操作。 试图将此位设置于不支持 VMX 操作的逻辑处理器( 第 7 章)

"safer Mode扩展引用")和SMX操作导致一般保护例外.

* Bit 2 可以在 SMX 操作之外实现 VMX. 如果这个位点是清晰的, 执行 VMXON 的尝试将会导致一个将军...

SMX操作外执行的保护例外 。 尝试将此位设置在逻辑处理器上

不支持 VMX 操作导致一般保护例外 。

* 比特8至14指定了SENTER 叶函数的启用功能. 球场中的每一个位代表

启用对相应的 SENTER 函数的控制。 只有启用的 SENTER 叶 功能在

执行 SENTER 。

* 比特 15 指定所有 SENTER 函数的全局启用 。

7.2.2 SMX 指令摘要

系统软件必须首先通过执行GETSEC[CAPABILITIES]来查询可用的GETSEC 叶函数. CAPABILITIES 叶函数返回可用的GETSEC 叶的位图. 试图执行一个不支持的叶指数,导致一个未定义的操作码(#UD)例外.

7.2.2.1 GETSEC[CAPABILITIES]

SMX功能为更新的处理器世代提供了建筑界面,以扩展SMX的能力. 具体而言,GETSEC指令为系统软件提供了一种能力叶函数,用于发现在处理器中支持的现有GETSEC 叶函数. 表7-2列出了目前可用的GETSEC 叶函数.

。 。 。 。             叶 函数表 7-2. GETSEC 叶 函数

```text
              CAPABILITIES          Description
```

索引 (EAX) 未定义返回 GETSEC 指令中可用的叶片功能. 0 ENTERACCS 保留 1 EXITAC 输入 2 SENTER 退出 3 SEXIT 推出 MLE. 4 PARAMETERS 退出 MLE. 5 SMCTRL 返回 SMX 相关参数信息. 6 WAKEUP SMX 模式控制 7 未定义在更安全模式中醒睡处理器. 8 保留 9 - (4G-1)

7.2.2.2 GETSEC[ENTERACCS]

GETSEC[ENTERACCS]叶启用认证的代码执行模式. ENTERACCS 叶 函数以芯片公用密钥作为签名验证来进行认证的代码模块负载. ENTERACCS需要存在一个Intel(R) Trusted Europed Technology 有能力的芯片,因为它在成功认证加载模块后解锁了芯片私人配置注册空间. 经认证的代码模块的物理基址和大小分别被指定为EBX和ECX的输入注册值.

在认证的代码执行模式中,某些处理器的状态属性会发生变化. 因此,处理器在认证代码执行模式下运行的时间应当受到限制,以尽量减少对外部系统事件的影响.

进入时,之前的呼动上下文被禁用(因为认证的代码模块图像是用物理地址指定的,不再可以依赖基于外部内存的页面表结构).

在执行GETSEC[ENTERACCS]叶之前,系统软件必须确保发布GETSEC[ENTERACCS]的逻辑处理器是靴子处理器(BSP),如IA32_APIC_BASE.BSP=1. 系统软件必须确保其他逻辑处理器处于合适的闲置状态,不标记为BSP.

GETSEC[ENTERACCS]叶可能被不同的代理机用于加载不同的认证代码模块,以履行与被测量环境不同方面相关的功能,例如系统软件和Intel(R)TXT启用的BIOS可能使用不止一个认证代码模块.

7.2.2.3 GETSEC[EXITAC]

GETSEC[EXITAC]将处理器从认证的代码执行模式中取出. 当执行此指令 叶时,被认证的代码执行区域的内容被擦除,控件被转移至一个与GETSEC[EXITAC]指令相接的近指针定义的非认证上下文.

经认证的代码执行区在GETSEC[EXITAC]完成后不再可访问. RBX(或EBX)持有要拍摄的近乎绝对间接目标的地址.

7.2.2.4 GETSEC[SENTER]

GETSEC[SENTER]叶函数被启动逻辑处理器(ILP)用于发射MLE. GETSEC[SENTER]可以被认为是ENTERACCS 叶的超级集,因为它作为测量环境发射的一部分进入. 测量环境启动包括以下步骤:

* ILP 将平台中的响应逻辑处理器(RLPs)汇合到一个可控状态(在

除ILP启动测量环境发射外,所有RLPs均置于新定义的SENTER睡眠状态。

* 装入和认证测量环境所需的认证代码模块,并输入

认证代码执行模式 。

* 校验并锁定某些系统配置参数 。 * 测量信任的动态根并存储到 TPM 中的PCR 。 * 向 MLE 传输控制, 中断已禁用 。

在执行GETSEC[SENTER]叶之前,系统软件必须确保平台的TPM可以访问,ILP是靴子处理器(BSP),如IA32_APIC_BASE.BSP所示. 系统软件必须确保其他逻辑处理器(RLPs)处于合适的闲置状态,不标记为BSP. 系统软件启动一个测量环境,负责在执行GETSEC[SENTER]时提供合适的认证码模块地址. 负责发射一个测量环境并由GETSEC[SENTER]装载的AC模块称为SINIT. 在执行GETSEC[SENTER]前,关于系统软件要求的更多信息,见Intel(R)受托执行技术测量启动环境编程指南.

7.2.2.5 GETSEC[SEXIT]

系统软件通过执行GETSEC[SEXIT]在ILP上的指示而退出测量环境. 本指令在平台上与响应逻辑处理器汇合,以退出所测量的环境. 外部事件(如果左面蒙面)被解密,Intel(R)TXT-capable芯片的私人配置空间被重新锁定.

7.2.2.6 GETSEC[PARAMETERS]

GETSEC[PARAMETERS]叶函数用于报告SMX操作的属性,选项和局限性. 软件使用这个叶来识别操作限制或附加选项. GETSEC[PARAMETERS]报告的信息可能需要使用EBX作为索引多次执行叶. 如果 GETSEC [PARAMETERS] 指令 叶 或者没有特定的参数字段,那么 SMX 操作应该被解释为使用相应的 GETSEC 叶 或 GETSEC [PARAMETERS] 叶 定义的参数字段的默认值.

7.2.2.7 GETSEC[SMCTRL]

GETSEC[SMCTRL]叶函数用于对与SMX架构相关的特定条件提供额外控制. 用于选择要执行的控制操作的输入登记册得到支持。 请参看叶关于所提供控制类型的具体描述。

7.2.2.8 GETSEC[WAKEUP]

响应逻辑处理器(RLPs)在启动逻辑处理器执行GETSEC[SENTER]后,放置在SENTER睡眠状态中. ILP可以通过使用GETSEC[WAKEUP]来唤醒RLPs加入测量环境. 当SENTER睡眠状态中的RLPs醒悟后,这些逻辑处理器开始在TXT配置空间中由系统内存(由芯片寄存器LT.MLE.JOIN指向)所持有的数据结构所定义的切入点执行.

7.2.3 测量环境与SMX

本节对由系统执行官使用SMX 叶函数启动的测量环境的代表性生命周期进行了简化视图. 英特尔(R)受托执行技术测量发射环境编程指南提供了使用SMX和芯片资源(包括芯片登记册,受托平台模块)推出MVMM的更详细实例.

生命周期始于系统执行器(一个OS,一个OS加载器,等等)将MLE和SINIT AC模块装入可用的系统内存. 系统执行官必须验证并准备所计量的发射平台. 当平台被正确配置时,系统执行官在启动逻辑处理器(ILP)上执行GETSEC[SENTER],将响应逻辑处理器汇合到SENTER睡眠状态,ILP然后使用SINIT AC模块进入. 在多线程或多处理环境中,系统执行官必须确保其他逻辑处理器在执行GETSEC[SENTER]前已经处于闲置循环状态,或睡眠(如执行HLT后).

GETSEC[SENTER]在平台上的所有逻辑处理器之间进行握手后,ILP加载了芯片认证的代码模块(SINIT)并进行认证检查. 如果检查通过,处理器将SINIT AC模块进行散列,并将结果存储到TPM PCR 17. 然后将执行上下文切换到SINIT AC模块. 该SINITAC模块将进行一些平台操作,包括: 验证系统配置,保护系统使用的系统内存MLE能够DMA产生散列MLE,将散列值存储在TPM PCR18,以及各种其他行动. SINIT完成执行后,在指定的入口处执行GETSEC[EXITAC]指令和转移控制MLE.

在从SINIT AC模块获得控制后,MLE必须在启用DMA之前建立其保护和隔离控制,并中断控制并将其转移到其他软件模块. 它还必须利用GETSEC[WAKEUP]指令,将RLPs从他们的SENTER睡眠状态中唤醒,并带入它的保护和隔离环境.

在测量环境中执行时,MVMM可以在2号地点访问信任平台模块(TPM). MVMM完全可以访问所有TPM命令,并可能使用TPM来报告当前测量值或使用测量值来保护信息,这样只有当平台配置注册(PCR)包含相同值时,才会使用TPM发布的信息. 这种保护机制被称为封印.

通过执行GETSEC[SEXIT],最终完成了测量环境关闭. 在这个步骤系统软件之前,负责清除处理器缓存中留下的敏感信息,系统内存.

7.3 GETSEC 叶 FUNCTIONS

本节详细描述GETSEC指令的每个叶函数. GETSEC只有在CPUID.01H:ECX[6]=1. 这表明SMX和GETSEC指令的可用性. 在 GETSEC 执行前, SMX 必须设置 CR4.SMXE[Bit 14] = 1.

A GETSEC 叶只有在显示可用时,才能使用GETSEC[CAPABILITIES]函数报告. 尝试访问一个没有处理器支持的GETSEC 叶索引,或者如果CR4.SMXE为0,则导致未定义的操作码例外的信号.

所有GETSEC 叶的功能都可用保护模式,包括IA-32e模式的兼容子mode和IA-32e模式的64位子mode. 除非另有说明,所有GETSEC函数的行为以及与被测量环境相关的相互作用都独立于IA-32e模式. 这也适用于对作为输入参数传递到GETSEC函数的寄存器宽度1的解释,以及作为输出参数返还的结果的寄存器.

1. 联合国 本章使用64位符号RAX,RIP,RSP,RFLAGS等处理器注册,因为支持SMX的处理器也支持Intel 64 Architecture. MVMM可以以IA-32e模式或IA-32e模式外推出. 处理器登记册的64位符号如果在32位环境中使用SMX,也指其32位形式. 在一些地方,EAX等注音专门用来指代所标注的寄存器的下32位.

GETSEC功能为ENTERACCS,SENTER,SEXIT,以及WAKEUP,需要在平台上存在一个Intel(R)TXT能力芯片集. GETSEC[CAPABILITIES]在0号位置返回的位向量表示一个Intel(R) TXTcapable 芯片已被处理器采样了1号. 处理器的操作模式也影响了以下GETSEC 叶功能的执行: 处理器的操作模式也影响了GETSEC的功能. SMCTRL,ENTER-ACCS,EXITAC,SENTER,SEXIT,以及WAKEUP. 这些功能只在CPL=0时允许在保护模式下使用. 在SMM期间,为了防止可能发生的模式内冲突,不允许这样做。 还存在进一步的执行资格,以防止潜在的建筑冲突(例如:嵌入测量环境或经认证的代码执行模式)。 参见GETSEC 叶函数对特定要求的定义. 为了进行性能显示器计数,GETSEC功能的执行被算作对已退休指令的单一指令. 一个响应的逻辑处理器(RLP)对与GETSEC[SENTER]或GTSEC[SEXIT]相关的消息的反应,对于ILP上的已退休指令计数是透明的.

1. 联合国 抽样现成意味着处理器向芯片发送了信息,芯片回复称(a)知道消息,(b)能够执行SENTER. 这意味着芯片CAN支持Intel(R)TXT,并被配置和WILLING支持.
