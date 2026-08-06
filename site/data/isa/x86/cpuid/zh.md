---
summary: CPU 标识
---

## 说明

EFLAGS登记册中的ID旗(bit 21)表示对CPUID指令的支持. 如果软件程序可以设置和清除此旗帜,执行该程序的处理器支持CPUID指令. 本指令在非64位模式和64位模式下运行相同.

CPUID返回处理器的识别和特征信息在EAX,EBX,ECX,以及EDX的登记册中. 1 指令的输出取决于执行时EAX登记册的内容,在某些情况下还取决于ECX.

第21章,"处理器识别和特性测定",在Intel(R)64和IA-32架构软件开发者手册第1卷中提供CPUID 叶信息并显示返回的信息,这取决于装入EAX和ECX登记册的初始值.

CPUID可以在任何特权级别执行,以序列化指令执行. 序列化指令执行保证在获取和执行下一个指令之前,完成对旗帜、注册簿和以往指令的内存的任何修改。 虽然CPUID指令提供序列化,但支持SERIALIZE指令的较新处理器上并非首选方法. 详见Intel(R)64和IA-32架构软件开发者手册第3A卷第11章中的"序列化指令".

CPUID的执行在VMX非根线操作中执行时会导致VM退出. 详见英特尔(R)64和IA-32架构软件开发者手册第27章"虚拟机器控制结构"第3C卷.

## IA-32 架构兼容性

CPUID在Intel486处理器的早期模型中或任何IA-32处理器中都不支持比Intel486处理器更早.

## 行动

```text
IA32_BIOS_SIGN_ID MSR := Update with installed microcode revision number;
(* Note that for some leaf values in EAX, the subleaf value in ECX is ignored. *)
(* Note that for invalid CPUID leaves and subleaves, the output values returned in EAX, EBX, ECX, and EDX are "Reserved" *)
(* Refer to Volume 1, Chapter 21 for details surrounding CPUID_INFO() *)
(EAX, EBX, ECX, EDX) := CPUID_INFO(EAX, ECX)
```

## 受影响的旗帜

None.

## CPUID 叶 维基语录链接:名人名言 - 文学作品 - 谚语 - 谚语

CHAPTER 21

在写入打算在英特尔处理器上运行的软件时,必须识别一个系统中的处理器类型和应用程序可用的处理器特性. CPUID指令被称为CPU识别,是使用Intel(R)Pentium处理器引入的,用于查询处理器的信息名称空间,以获取其身份和支持的特性. 从逻辑上讲,CPUID名称空间包含一系列由叶索引的节点(使用EAX的输入值),在某些情况下由子叶进一步索引(使用ECX的输入值). 被询问节点的值以 EAX , EBX , ECX 和 EDX 返回 。 注意并非所有的叶都有子叶索引,输入的ECX值在这些案例中会被忽略. CPUID的完整描述见Intel(R)64和IA-32架构软件开发者手册第2A卷第3章. 本章中所有提及"MAQQLEAF"之处均作为"CPUID.00H:EAX.MAX_LEAF"的缩写.

### 21.1 IMPORTANT CONSIDERATIONS WHEN USING THE CPUID INSTRUCTION

本节概述了在使用CPUID指令时需要考虑的其他因素.

#### 21.1.1 使用 CPUID 指令的准则

使用CPUID指令在Pentium M处理器家族,Pentium 4处理器家族,Intel Xeon处理器家族,P6家族,Pentium处理器,以及后来的Intel486处理器中进行处理器识别. 此指令返回执行指令的处理器的家族,模型,以及(对于一些处理器)品牌字符串. 它还表示处理器中存在的特性,并给出处理器缓存和TLB的信息. EFLAGS登记册中的ID旗(bit 21)表示对CPUID指令的支持. 如果软件程序可以设置和清除此旗帜,执行该程序的处理器支持CPUID指令. CPUID指令如果在不支持它的处理器上执行,将会导致无效的操作码例外(#UD). 为了获得处理器识别信息,源操作数值被放置在EAX登记册中,以选择要返回的信息类型. 当执行 CPUID 指令时,在 EAX, EBX, ECX 和 EDX 登记册中返回选中的信息. 下列准则是最重要的准则之一,在使用CPUID指示确定可用特性时,应始终遵循这些准则:

* 总是从测试" GenuineIntel" 开始, EBX 、 EDX 和 ECX 在 CPUID 注册时发文

指令以 EAX 等于 0 执行。 如果处理器不是真英特尔,特征识别旗可能与英特尔文档中描述的含义不同.

* 测试特性识别标记是单个的,不会对未定义的位进行假设.

#### 21.1.2 确定较早的处理者

CPUID指令在早期的英特尔处理器中无法通过早期的英特尔486处理器获取. 对于这些处理器,还可以利用其他几个建筑特征来识别处理器. EFLAGS寄存器中12位和13位(IOPL),14位(NT)和15位(保留)的设置对于英特尔的32位处理器来说,不同于英特尔8086和英特尔286处理器. 通过检查这些比特的设置(带有PUSHF/PUSHFD和POPF/POPFD指令),应用程序可以确定处理器是8086,Intel 286还是Intel 32位处理器之一:

* 8086处理器--EFLAGS寄存器的12到15位总是设置的. * 英特尔286处理器 - Bits 12至15在实地址模式中总是清晰的.

* 32位处理器 - 在 实地址模式 中, 比特 15 总是清晰的, 比特 12 到 14 有最后一个值

装满了 在保护模式中,bit 15总是清晰的,bit 14有最后一个加载值,IOPL比特依赖于当前特权级别(CPL). IOPL字段只有在CPL为0. 可用于区分32位处理器的其他 EFLAGS 寄存位 :

* Bit 18 (AC) - 仅在Pentium 4,Intel Xeon,P6家族,Pentium,以及Intel486处理器上执行.

无法设置或清除此比特,可以区分一个Intel386处理器和后来的IA-32处理器.

* 比特 21 (ID) - 确定处理器是否能够执行 CPUID 指令. 设置和清除的能力

此位表示它是一个Pentium 4,Intel Xeon,P6家族,Pentium,或后版Intel486处理器. 为了确定一个系统中是否存在一个x87 FPU或数字处理器扩展(NPX),应用程序可以使用FNINIT指令写入x87 FPU状态和控制登记册,然后用FNSTENV指令验证正确的值被读回. 在确定存在 x87 FPU 或 NPX 后,可以确定其类型. 在大多数情况下,处理器类型会决定FPU或NPX的类型;然而,Intel386处理器与Intel 287或Intel 387数学共处理器兼容. 协处理器用来表示的方法(在FINIT,FNINIT,或RESET指令执行后)表示哪个协处理器存在. Intel 287 数学共处理器对 +和 -使用相同的比特表示;而Intel 387 数学共处理器对 +和 -使用不同的表示.

#### 21.1.3 CPUID 基本和扩展范围

CPUID基本范围起于CPUID.00H,止于CPUID.00H:EAX.MAX_LEAF[31:0]所列举的最大叶. CPUID 叶的遗存集被定义为叶 00H,01H,以及02H,它们代表了高达和包括Pentium II的建筑. 处理器通过设置 IA32 MISC ENABLE[22](Limit CPUID Maxval),将 叶 的曝光数限制在这些遗留的 叶 上,提供了遗留的兼容性. 这在将 CPUID.07H.01H:EBX.CPUIDMAXVAL_LIM_RMV[3] 报告为 1 的处理器上不再支持;对于这样的处理器,IA32 MIS-C ENABLE[22] 无法设定为 1 以限制 CPUID.00H:EAX.MAX_LEAF 返回的值. 扩展的CPUID范围开始于叶 80000000H,结束于CPUID.80000000H:EAX.MAX_EXTENDED_LEAF[31:0]所列举的最大叶. Pentium 4 之前的旧处理器不支持扩展CPUID范围并处理位元 31 ofCPUID输入EAX值为零。 如果输入的CPUID.EAX值高于该处理器基本或扩展函数的最大输入值,则返回最高基本信息叶的数据。 软件不应依赖处理器在上述范围之外返回的数值。 CPUID.40000000H到CPUID.4FFFFFFFH的范围不返回处理器的特征信息. 分配给软件模拟。

#### 21.1.4 CPUID 域数

每个CPUID节点的字段被分类为几个CPUID域之一. 字段可以在特定的节点内单独分类,也可以在叶或子叶中对所有节点进行汇总. 在适当配置的平台上,CPUID域内的所有逻辑处理器返回属于该域域的一致输出值. 例如,在CPUID.1FH.00H:EDX[31:0]中返回的初始X2APIC ID值被归类为属于逻辑处理器域,因为该值对平台中的每个逻辑处理器都是独一无二的. 而CLFLUSH线大小在CPUID.00H:EBX[15:8]中返回,则被归类为平台域名,因为它对于整个平台内的所有逻辑处理器必须一致.

* 平台域-A 正确配置的平台将为这些 CPUID 字段提供一致的值

平台中的每个逻辑处理器。

* 软件包域- A 正确配置的平台为这些 CPUID 字段提供了一致的值

同一处理器包内的逻辑处理器。 然而,在比较不同软件包上的逻辑处理器的值时,这些数值可能有所不同。

* 逻辑处理器域- A 配置得当的平台可以为这些 CPUID 提供不同的值

字段,用于平台中每个逻辑处理器。 其中包含的值可能按照特定的共享资源(即缓存,混合等)有自己的范围;在这种情况下,可能需要询问每个逻辑处理器,以获得特定特性的全部平台视图.

#### 21.1.5 CPUID 运行时可变场

一个 CPUID 字段,如果在运行时间可以改变,则据说是可变的. 这类字段受到可影响处理器模式、状态位或特权登记册的监督-模式操作的影响。 表21-1列出了预计作为正常操作的一部分而发生动态变化的可变字段。 表21-2列示了应保持不变的可变字段。 注意所有英特尔处理器上可能没有列出的所有控制。

** 运行时间可变 CPUID 字段预期在正常运行期间改变**

| 叶子 | 次叶 | 登记册 | 字段名称 | 描述和变异性控制 |
| --- | --- | --- | --- | --- |
| 01H | 已忽略 | ECX[27] | OSXSAVE | 如果1,OS设置了CR4.OSXSAVE[bit 18],使XSETBV/XGETBV指令能够访问XCR0,并使用XSAVE/XRSTOR支持处理器扩展状态管理. |
| 07H | 00H | ECX[4] | OSPKE | 如果 1, OS 设置了 CR4.PKE 以启用保护 密钥 (和 RDPKRU/WRPKRU 指令). |
| 0DH | 00H | EBX[31:0] | XSAVE_BYTES_ ENABLED_FEATURE | XSAVE/XRSTOR的状态位点在XCR0启用时所需的大小. |
| 0DH | 01H | EBX[31:0] | XSAVE_BYTES_ ENABLED_FEATURE | XSAVES/XRSTORS 区域大小,用于 XCR0 和 IA32 XSS 启用的状态比特. |
| 19H | 00H | EBX[0] | AESKLE | 如果1,如果AES Key Locker指令已被系统固件激活,OS设置了CR4.KL[bit 19]=1. |
| 80000001H | 已忽略 | EDX[20] | SYSCALL_SYSRET_64 | Intel处理器只在64位模式下支持SYSCALL和SYSRET. 此特性旗总是被列举为64位模式外的0. |

** Runtime 可变 CPUID 字段应保持一致**

| 叶子 | 次叶 | 登记册 | 字段名称 | 描述和变异性控制 |
| --- | --- | --- | --- | --- |
| 00H | 已忽略 | EAX[31:0] | MAX_LEAF | 支持遗留软件,将CPUID的叶数量限制为最多2个. 此设定使用 IA32 MISC ENABLE[22] Limited CPUID Maxval. |
| 01H | 已忽略 | ECX[3] | MONITOR | 此特性旗反映了IA32 MISC ENABLE[18] 启用Monitor FSM中的设置. |
| 01H | 已忽略 | ECX[7] | EIST | 此特性旗反映了IA32 MISC ENABLE[16]增强的英特尔速度步技术启用中的设置. |
| 01H | 已忽略 | EDX[9] | APIC | 这个功能旗反映了IA32 APIC BASE[11],APIC Global Election. |
| 05H | 已忽略 | ECX[0] | MONITOR_MWAIT_ EXTENSIONS | 当 CPUID.01H:ECX.MONITOR[3] = 0时此字段不可用. |

** Runtime Multable CPUID 字段应保持不变(Contd.)**

| 叶子 | 次叶 | 登记册 | 字段名称 | 描述和变异性控制 |
| --- | --- | --- | --- | --- |
| 00H | 已忽略 | EAX[31:0] | MAX_LEAF | 支持遗留软件,将CPUID的叶数量限制为最多2个. 此设定使用 IA32 MISC ENABLE[22] Limited CPUID Maxval. |
| 01H | 已忽略 | ECX[3] | MONITOR | 此特性旗反映了IA32 MISC ENABLE[18] 启用Monitor FSM中的设置. |
| 01H | 已忽略 | ECX[7] | EIST | 此特性旗反映了IA32 MISC ENABLE[16]增强的英特尔速度步技术启用中的设置. |
| 01H | 已忽略 | EDX[9] | APIC | 这个功能旗反映了IA32 APIC BASE[11],APIC Global Election. |
| 05H | 已忽略 | ECX[0] | MONITOR_MWAIT_ EXTENSIONS | 当 CPUID.01H:ECX.MONITOR[3] = 0时此字段不可用. |

#### 21.1.6 CPUID 保留字段

软件必须忽略和不依赖CPUID 叶或子叶保留字段返回的值,因为它们可能对未来处理器有意义. 一旦界定了以前保留的一个字段,将更新这一规格以反映这一点。

#### 21.1.7 CPUID 序列化指令

虽然CPUID指令提供序列化,但支持SERIALIZE指令的较新处理器上并非首选方法,通过CPUID.07H.00H:EDX[14]=1. 如果需要向后兼容到较老的处理器,则使用叶 00H [CPUID.00H]进行序列化,因为它在执行时的潜伏度最低. 详见Intel(R)64和IA-32架构软件开发者手册第3A卷第11章中的"序列化指令".

#### 21.1.8 IA32 BIOS SIGN ID 返回微码更新签名

对于支持微码更新设施的处理器,每当CPUID执行时,IA32 BIOS SIGN ID MSR都会加载更新签名. 签名在上 DWORD 中返回 。 详见英特尔(R)64和IA-32架构软件开发者手册第3A卷第11章.

### 21.2 METHODS FOR RETURNING BRANDING INFORMATION USING CPUID

使用下列技术获取品牌信息: 1. 处理器品牌字符串方法 2. 处理器品牌索引;这种方法使用提供品牌字符串表的软件. 以下各节讨论这两种方法。 关于早期处理器中可用的方法,见Intel(R)64和IA-32架构软件开发者手册第1卷第21.1.2节"早期处理器的识别".

#### 21.2.1 处理器品牌字符串方法

图21-1介绍了用于检测品牌字符串的算法. 处理器品牌识别软件应该在所有Intel 64和IA-32处理器上执行这个算法. 这种方法(引入了Pentium 4处理器)将一个ASCII品牌识别字符串和处理器的处理器基频率返回到EAX,EBX,ECX,以及EDX的登记册.

Input: EAX= 0x80000000

CPUID

```text
             IF (EAX & 0x80000000)                   False  Processor Brand
```

字符串不支持

```text
                 CPUID   True
               Function  Extended
```

Supported

EAX 返回值=最大值. 扩展 CPUID

函数索引

```text
             IF (EAX Return Value                    True   Processor Brand
                 0x80000004)                                String Supported
```

OM15194

图21-1. 确定对处理器品牌字符串的支持

#### 21.2.2 处理器品牌索引方法

品牌指数法(引入Pentium(R) III Xeon(R)处理器)为品牌识别表提供了一个切入点,由软件在内存中维护. 在本表中,每个品牌指数都与ASCII品牌识别字符串相关联,识别一个处理器的官方Intel家族和型号.

CPUID执行时将EAX设定为1,处理器将一个品牌指数返回EBX的低字节. 然后软件可以使用这个索引在品牌识别表中定位处理器的品牌识别字符串. 本表中的第一个条目(品牌索引0)被保留,允许与不支持品牌识别功能的处理器进行后向兼容. 从处理器签名家族ID=0FH开始,型号=03H,品牌索引方法不再支持. 代之以使用品牌字符串方法.

表21-3显示了与之相关的识别字符串品牌指数.

** 绘制品牌索引;和英特尔64和IA-32处理器品牌字符串**

| 品牌索引 | 品牌字符串 |
| --- | --- |
| 00H 此处理器不支持品牌标识 | 特性 |
| 01H 英特尔( R) Celeron( R) 处理器 1 |  |
| 02H 英特尔( R) Pentium( R) III 处理器 1 |  |

** 绘制品牌索引;和英特尔64和IA-32处理器品牌字符串**

| 品牌索引 | 品牌字符串 |
| --- | --- |
| 00H 此处理器不支持品牌标识 | 特性 |
| 01H 英特尔( R) Celeron( R) 处理器 1 |  |
| 02H 英特尔( R) Pentium( R) III 处理器 1 |  |

### 21.3 CPUID 叶 维基语录链接:名人名言 - 文学作品 - 谚语 - 谚语

本章其余部分为Intel(R)64和IA-32架构提供了CPUID的计数信息.

CPUID.00H - 基本 CPUID 和供应商ID的最大输入

CPUID.00H返回返回基本处理器信息时CPUID识别的最高值. 该值在 EAX 寄存器中返回,并具有处理器特定性. * 此 叶 总是有效的 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 00H 基本 CPUID和供应商ID的最大输入量**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_LEAF | 基本 CPUID 信息的最大输入值 。 | 平台 |
| EBX[31:0] | VENDOR_ID_1 | "盖努" | 平台 |
| ECX[31:0] | VENDOR_ID_2 | 内特尔 | 平台 |
| EDX[31:0] | VENDOR_ID_3 | "内" | 平台 |

CPUID.01H - 版本和特性

CPUID.01H返回类型,家庭,模型,脚步,和特征信息. * 此 叶 如果 MAQQLEAF 01H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 01H产出登记册**

| CPUID 输出 | 说明 |
| --- | --- |
| 登记册 |  |
| EAX[31:0] | 版本信息 : 类型, 家庭, 模型, 以及步进 ID (参见"CPUID.01H: EAX- Version Information: 类型, |
|  | (原始内容存档于2018-09-29). Family, Model and Steping ID". |
| EBX[31:0] | 特征信息(参见"CPUID.01H:EBX--feature Information"). |
| ECX[31:0] | 特征信息(参见"CPUID.01H:ECX--feature Information"). |
| EDX[31:0] | 特征信息(参见"CPUID.01H:EDX--feature Information"). |

** 叶 01H 版本和特性以 EAX 返回**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[3:0] | STEPPING_ID | 确定特定处理器家族和模型的修订. 台阶信息被指定为遗留处理器的每包基础. 较近期的处理器不允许混合阶梯. | 软件包 |
| EAX[7:4] | MODEL_ID | 在一个家庭内部确定一组处理器. Pentium(R)4处理器的某些型号允许混合型号ID,并会将此识别为包域. | 平台 |
| EAX[11:8] | FAMILY_ID | 确定一组具有一般建筑相似性的处理器. | 平台 |
| EAX[13:12] | PROCESSOR_TYPE | 识别特定类型的处理器。 | 平台 |
| EAX[15:14] | 准备金 | 预留. |  |
| EAX[19:16] | EXTENDED_MODEL_ID | 当家庭ID是06H或0FH时,这个字段准备为模型ID提供8位模型识别. | 平台 |
| EAX[27:20] | EXTENDED_FAMILY_ID | 当家庭身份证是0FH时,这个字段会加入家庭身份证,以提供8位家庭身份证. | 平台 |
| EAX[31:28] | 准备金 | 预留. |  |

** 处理器类型**

| 类型 | 编码 |
| --- | --- |
| 原始 OEM 处理器 | 00B |
| Intel OverDrive( R) 处理器 | 01B |
| 双处理器(不适用于Intel486处理器) | 10B |
| 保留英特尔 | 11B |

** 叶 01H 版本和特性以 EBX 返回**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EBX[7:0] | BRAND_INDEX | 这个数字提供了一个包含IA-32处理器品牌字符串的品牌字符串表的条目. 第21.2.2节 " 处理器品牌指数法 " 提供了有关这一领域的更多信息。 | 平台 |
| EBX[15:8] | CLFLUSH_LINE_SIZE | 数值 * 8 = 字节中的缓存行大小. 这个数字表示由CLFLUSH和CLFLUSHOPT指令在8字节递增中冲出的缓存行的大小. 这个字段是在Pentium 4处理器中引入的. | 平台 |
| EBX[23:16] | APIC_ID_SPACE | 此物理包中逻辑处理器的最大可地址ID数 。 最接近不小于EBX[23:16]的2型整数是专为物理包中处理不同逻辑处理器而保留的独特初始APIC ID的数量. 此字段只有在 CPUID.01H.EDX.HTT[28] = 1. 有关该领域使用情况的详情见下文。 | 平台 |

EBX [31: 24] INITIAL APIC ID 这是分配给逻辑的8位ID

```text
                                                    the local APIC on the processor during power     Processor
```

起来 这个字段是在Penium 4处理器中引入的. EBX中的8位初始 APIC ID [31:24] 是

replaced by the 32-bit x2APIC ID, available in Leaf 0BH and Leaf 1FH.

此软件包中逻辑处理器的最大可处理ID不应用于支持CPUID 叶 0BH或CPUID 叶 1FH的平台,因为它可以是饱和和不正确的. 现代平台可以拥有比可以列举的更多的处理器,或者拥有不连续APIC ID保留的地形域. 要正确列举现代平台上的APICID信息,请使用CPUID.0BH或CPUID.1FH.

CPUID.01H: ECX 特性信息

CPUID.01H的ECX登记册返回以下信息. 对于所有特性标记,一个1表示该特性被支持. 软件应确定英特尔为供应商,以正确解释特征旗帜. 软件必须确认使用CPUID在使用该特性前返回的特性旗存在处理器特性. 软件不应依赖保留所有特性的未来报价。

** 叶 01H 版本和特性以 ECX 返回**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| ECX[0] | SSE3 | 如果 1, 支持流速 SIMD 扩展 3 。 | 平台 |
| ECX[1] | PCLMULQDQ | 如果 1, 支持 PCLMULQDQ 指令 。 | 平台 |
| ECX[2] | DTES64 | 64位DS区域. 如果1,则支持DS区域使用64位布局. | 平台 |
| ECX[3] | MONITOR | 如果1,则支持MONITOR/MWAIT和CPUID.05H. | 平台 |
| ECX[4] | DS_CPL | 如果 1, 支持调试 Store 特性的扩展, 以允许 CPL 合格的分支消息存储 。 | 平台 |
| ECX[5] | VMX | 如果 1,支持虚拟机扩展. | 平台 |
| ECX[6] | SMX | 如果 1, 支持更安全模式扩展 。 参见第七章"安全模式扩展参考". | 平台 |
| ECX[7] | EIST | 如果1,则支持增强的Intel速度(R)技术. | 平台 |
| ECX[8] | TM2 | 如果 1, 支持热监测器 2 。 | 平台 |
| ECX[9] | SSSE3 | 如果 1, 支持补充流 SIMD 扩展 3 。 | 平台 |
| ECX[10] | L1_CONTEXT_ID | 如果 1, L1 数据缓存模式可以设置为适应模式或共享模式. 详见IA32 MISC ENABLE MSR Bit 24(L1数据缓存上下文模式)的定义. | 平台 |
| ECX[11] | DEBUG_INTERFACE | 如果1,支持IA32 DEBUG INTERFACE MSR进行硅调试. | 平台 |
| ECX[12] | FMA | 如果1,则支持使用YMM状态的FMA扩展. | 平台 |
| 21-10卷 第1册. |  |  |  |

ECX[13] CMPXCHG16B If 1,支持此指示. 参见本章中用于平台的"CMPXCHG8B/CMPXCHG16B-Compare和ECX[14] XTPR UPDATE CONTROL 交换字节"部分.

```text
                               description.                                        Platform
```

ECX[15]   PERF_CAPABILITIES

```text
                               If 1, supports changing IA32_MISC_ENABLE[bit        Platform
```

ECX[16] 预留23]. ECX[17] PCID 平台

```text
                               If 1, supports the performance and debug            Platform
```

ECX[18] DCA 特征表示 MSR 平台

```text
                               IA32_PERF_CAPABILITIES.                             Platform
```

ECX[19] SSE4 1 平台ECX[20] SSE4 2 保留.                                           ECX平台 [21] X2APIC平台 ECX [22] MOVBE If 1,支持进程-文本标识符和平台 ECX[23] POPCNT软件设置 CR4.PCIDE至1.Process-平台 ECX[24] TSC DEADLINE上下文标识符. 逻辑 ECX[25] AESNI If 1,支持从一个处理器ECX[26] XSAVE内存映射设备预选数据的能力. 见CPUID.09H. ECX平台[27] OSXSAVE If 1,支持SSE4.1.                              平台ECX[28] AVX If 1,支持SSE4.2.                              ECX平台[29] F16C If 1,支持x2APIC特性. ECX[30] RDRAND ECX[31] 未使用 If 1,支持MOVBE指令.

如果 1, 支持 POPCNT 指令 。

如果 1, 处理器的本地 APIC 计时器支持使用 TSC 截止值进行一发操作.

如果 1, 支持 AESNI 指令扩展 。

如果1,支持XSAVE/XRSTOR处理器扩展态特性,则XSETBV/XGETBV指令,以及XCR0.

如果1,OS设置了CR4.OSXSAVE[bit 18],使XSETBV/XGETBV指令能够访问XCR0,并使用XSAVE/XRSTOR支持处理器扩展状态管理.

如果 1, 支持 AVX 指令扩展 。

如果1,支持16位的浮点转换指令.

如果 1, 支持 RDRAND 指令 。

英特尔处理器总是返回0. 分配给软件模拟使用。

CPUID.01H: EDX 特性信息

CPUID.01H的EDX登记册返回以下信息. 对于所有特性标记,一个1表示该特性被支持. 软件应确定英特尔为供应商,以正确解释特征旗帜. 软件必须确认使用CPUID在使用该特性前返回的特性旗存在处理器特性. 软件不应依赖保留所有特性的未来报价。

** 叶 01H 版本和特性以 EDX 返回**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EDX[0] | FPU | 浮点 单位上芯片. 处理器包含一个x87 FPU. | 平台 |

EDX [1] VME If 1,支持Virtual 8086模式平台增强功能,包括CR4.VME用于EDX[2]DE控制特性; 4. CR4.PVI 保护平台

```text
                                                    mode virtual interrupts; software interrupt        Platform
```

EDX [3] PSE 间接; TSS 与平台的扩展

```text
                                                    software indirection bitmap; and EFLAGS.VIF        Platform
```

EDX[4] TSC和EFLAGS.VIP旗.                              平台 EDX [5] MSR 如果 1, 支持 I/O 断点调试

```text
                                                    extensions, including CR4.DE for controlling the   Platform
```

EDX[6] PAE特性,以及可选的对访问平台DR4和DR5的陷阱. EDX [7] MCE 平台 P If 1,支持大小为4 MByte的EDX[8] CMPXCHG8B页的页面扩展,包括: CR4.PSE for EDX[9] APIC 控制特性; PDE中定义的脏位(页目录条目);可选保留 EDX[10] 保留在 CR3中的位陷阱; PDEs;和PTEs. 互联网档案馆的存檔,存档日期2013-12-02.. EDX[11] SEP If 1,支持时间印记计数器,RDTSC指令,包括CR4.TSD控制特权.

如果 1 ,则支持模式特定注册RDMSR和WRMSR指令. 某些管理责任取决于执行。

如果 1 , 支持物理地址扩展, 物理地址大于 32 位, 包括: 扩展页表条目格式; 页面翻译表格中的额外级别; 以及 2- MByte 页面而不是 4 Mbyte 页面 。

如果 1, 支持机器检查的例外 18, 包括用于控制特性的 CR4.MCE. 这个特性没有定义机器检查错误记录,报告和处理器关闭的模型特定执行. 机器检查例外处理器可能不得不依赖处理器版本来进行例外的模型特定处理,或者测试机器检查特性的存在.

如果1,支持CMPXCHG8B(64位)指令,暗中锁定和原子.

如果 1, 处理器包含一个高级可编程中断控制器( APIC), 在物理地址范围 FEE00000H 到 FEE00FFFH 的内存映射命令中响应( 默认 - 一些处理器允许将 APIC 迁移) 。

Reserved.

如果1支持SYSENTER和SYSEXIT指令以及相关的MSR.

EDX[12] MTRR If 1,支持内存类型范围平台注册. (MTURRcap MSR包含特性)

描述所支持的内存类型、所支持的可变的 中期审查报告数量以及是否为固定的中期审查报告数量

supported.)

EDX [13] PGE If 1, 在 page-结构平台中支持全局位元

条目,用于映射一个页面,表示不同进程常见且不需要冲洗的TLB条目。 CR4.PGE 位控件

这个功能。

EDX[14] MCA 如果 1,支持机器检查架构平台

特性。 MCG CAP MSR 包含特征比特,描述有多少个错误银行报告MSR得到支持.

EDX[15] CMOV If 1,支持有条件移动指令.   平台

如果CPUID.01H:EDX.FPU[0](x87 FPU 存在)也是1,则支持FCOMI和FCMOV指令.

EDX[16] PAT If 1,支持页面属性表特性.    平台( 此功能可增强内存类型)

Range Registers(MTRRs),允许操作系统通过4KB上的线性地址指定访问内存的属性

granularity.)

EDX [17] PSE 36 如果 1, 支持36 Bit 页面大小扩展平台

它可以使 4-MByte 页面在 4 GBytes 以外的物理内存中以 32 位呼号地址地址。 此特性表示上位

4-MByte页的物理地址以页目录条目的位码20:13编码。 这种实际地址受到下列因素的限制:

MAXPHYADDR和大小可达40位.

EDX[18] PSN 如果 1,支持96位处理器串行平台

数字识别号码特性, 此特性被启用 。 仅在Pentium III中可用,参见CPUID.03H.

EDX[19] CLFLUSH If 1,支持CLFLUSH指令.             平台EDX[20] 预留EDX[21] DS预留.

```text
                   If 1, supports the Debug Store feature which        Platform
```

提供了将调试信息写入内存驻地缓冲器的能力。 分支微量商店(BTS)和

处理器基于事件的采样(PEBS)设施(见第19章,"调试,分支配置,TSC,和Intel(R)资源主任)

Technology (Intel(R) RDT) Features,"Intel(R)64和IA-32架构软件开发者手册第3B卷"中.

EDX[22] ACPI If 1,支持热监测器和平台软件控制时钟设施. 这些是EDX[23]MMX内部MSR,允许处理器温度平台EDX[24]FXSR在EDX[25]SSE软件控制下,在预定义的职责周期中调节处理器性能.                                 EDX平台 [26] SSE2平台 EDX [27] SELF SNOOP If 1,支持Intel MMX技术.          平台 EDX [28] HTT 如果 1, 支持 FXSAVE 和 FXRSTOR

```text
                                                    Instructions, which are fast save and restore of  Platform
```

EDX[29] TM 浮点上下文,以及可用性

```text
                                                    of CR4.OSFXSR for an operating system to          Platform
```

EDX[30] 保留表示同样支持. EDX[31] PBE If 1,支持SSE.

如果1,则支持SSE2.

如果 1 , 支持 Self Snoop , 即管理相互冲突的内存类型, 方法是对发往总线的交易进行自身缓存结构的监视 。

如果 1, CPUID.1.EBX[23:16] 中的值(本包中逻辑处理器的最大可地址ID数)对包有效. 如果 0,则包中只有一个逻辑处理器,软件只应假设一个APIC ID被保留.

如果 1,支持处理器执行热监测器自动热控制电路(TCC)的热监测器功能. 热监测器.

Reserved.

如果 1, 支持待决中断启用功能, 即当处理器处于停止时态时使用 FERR#/PBE# pin( 主张为 STPCLK#), 向处理器发出中断待决信号, 处理器应该恢复正常运行到 句柄 中断 。

CPUID.02H - TLB/缓存/预览信息

CPUID.02H 返回 TLB,缓存,以及预切信息. 此 叶 已被 CPUID.04H 取代用于缓存计数, CPUID.18H 用于 TLB 计数. 这些处理器也会报告0FEh或0FFh类型的新的描述值,以将计数参考CPUID.04H和CPUID.18H. * 此 叶 如果 MAQQLEAF 02H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 02H TLB/Cache/Prefetch信息**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[7:0] | 准备金 | 价值为1的准备金 |  |
| EAX[15:8] | DESCRIPTOR_1 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| EAX[23:16] | DESCRIPTOR_2 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| EAX[31:24] | DESCRIPTOR_3 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| EBX[7:0] | DESCRIPTOR_4 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| EBX[15:8] | DESCRIPTOR_5 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| EBX[23:16] | DESCRIPTOR_6 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| EBX[31:24] | DESCRIPTOR_7 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| ECX[7:0] | DESCRIPTOR_8 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| ECX[15:8] | DESCRIPTOR_9 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| ECX[23:16] | DESCRIPTOR_10 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| ECX[31:24] | DESCRIPTOR_11 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| EDX[7:0] | DESCRIPTOR_12 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| EDX[15:8] | DESCRIPTOR_13 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| EDX[23:16] | DESCRIPTOR_14 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |
| EDX[31:24] | DESCRIPTOR_15 | 参见表"CPUID 叶 2的编码" | 逻辑 |
|  |  | 本表下方为说明词". | 处理器 |

见下文。 注意EAX,EBX,ECX,和EDX登记册中的描述符顺序没有定义;也就是说,特定的字节没有指定包含特定缓存,前缀,或TLB类型的描述符. 描述符可以按任何顺序出现. 请注意,处理器可能报告FFH和FEH的普通描述符,而不报告任何通过CPUID.02H的"cache type"或"*TLB type"的字节描述符.

说明表21-12. 编码CPUID 叶2 描述值00H一般缓存或TLB说明01H TLB 02H TLBNull 描述符, 此字节包含没有信息 。03H TLB指令TLB: 4 KByte页,4路集联行,32条条目.04H TLB指令TLB: 4 MByte页,完全关联,2个条目.05H TLB数据TLB: 4 KByte页,4路集联,64条条目.06H缓存数据TLB: 4 MByte页,4路集联,8个条目.08H缓存数据TLB1:4 MByte页,4路集联行,32条条目.09H缓存 1 级指令缓存: 8 KBytes, 4 条路集关联, 32 字节行大小.0AH缓存 1 级指令缓存: 16 KBytes, 4 条路集关联, 32 字节行大小.0BH TLB1级指令缓存:32KBytes,4路集关联,64字节行大小.0CH缓存 1 级数据缓存: 8 KBytes, 2 条路集关联, 32 字节行大小.0DH缓存指令TLB: 4 MByte页,4路集联,4个条目.0EH缓存 1 级数据缓存: 16 KBytes, 4 条路集关联, 32 字节行大小.1DH缓存 1 级数据缓存: 16 KBytes, 4 条路集关联, 64 字节行大小.21H缓存 1 级数据缓存: 24 KBytes, 6 条路集关联, 64 字节行大小.22H快取第2级缓存:128 KBytes,2条路集关联,64字节行大小.23H快取第2级缓存:256 KBytes,8路集的关联,64字节行大小.24H缓存3级缓存:512 KBytes,4条路集的关联,64字节线大小,每区段2条线.25H快取3级缓存:1MBytes,8路集联动,64字节行大小,每区段2行.29H快取第2级缓存: 1 MBytes, 16路集的关联, 64字节行大小.2CH缓存 3 第一级缓存: 2 MBytes, 8 道集 关联, 64 字节行大小, 每个扇区有 2 条行.30H缓存 3 第一级缓存:4 MBytes,8路集 关联,64字节行大小,每区段2行.40H缓存 1 级数据缓存: 32 KBytes, 8 条路集关联, 64 字节行大小.41H缓存 1 级指令缓存: 32 KBytes, 8 条路集关联, 64 字节行大小.42H无第2级缓存缓存,或者,如果处理器包含有效的第2级缓存,则没有第3级缓存.43H缓存第2级缓存:128 KBytes,4条路集关联,32字节行大小.44H快取第2级缓存:256 KBytes,4条路集关联,32字节行大小.45H缓存第2级缓存:512 KBytes,4条路集关联,32字节行大小.46H快取第二级缓存: 1 MByte, 4 条路集关联, 32 字节行大小.47H快取 2 第一级缓存: 2 MByte, 4 条路集关联, 32 字节行大小.48H缓存 3 第一级缓存:4 MByte,4 条路集关联,64字节行大小.49H缓存 3 级缓存: 8 MByte, 8 路集 关联行大小 64 字节 二级缓存: 3 MByte, 12 路集 关联行大小 64 字节 3 级缓存: 4MB, 16 路集 关联行大小 64 字节 处理器 MP, Family0FH模式06H) 第2级缓存:4 MByte,16路编组关联,64字节行大小.

4AH 缓存 3 第一级缓存:6MByte,12路集 关联,64字节行大小.

4BH 缓存 3 第一级缓存: 8MByte, 16路集 关联, 64字节行大小.

4CH 缓存 3 第一级缓存: 12MByte, 12 way set assactive, 64 字节行大小.

4DH 缓存 3 第一级缓存:16MByte,16路集 关联,64字节行大小.

4EH 缓存 第2级缓存:6MByte,24路集合,64字节行大小.

4FH TLB 指令 TLB:4 KByte页,32个条目.

50H TLB 指令 TLB:4 KByte和2-MByte或4-MByte页,64个条目.

51H TLB 指令 TLB:4 KByte和2-MByte或4-MByte页,128个条目.

52H TLB 指令 TLB:4 KByte和2-MByte或4-MByte页,256个条目.

55H TLB 指令 TLB:2-MByte或4-MByte 页面,完全关联,7个条目.

56H TLB 数据 TLB0:4 MByte页,4路集联,16个条目.

57H TLB 数据TLB0:4 KByte页,4路联动,16个条目.

59H TLB 数据 TLB0:4 KByte页,全联,16个条目.

5AH TLB 数据 TLB0: 2 MByte 或 4 MByte 页面,4路集 关联,32个条目.

5BH TLB 数据 TLB:4 KByte和4 MByte页,64个条目.

5CH TLB 数据 TLB:4 KByte和4 MByte页,128项.

5DH TLB 数据 TLB:4 KByte和4 MByte页,256个条目.

60H 缓存 第1层数据缓存: 16 KByte, 8 路集 关联, 64 字节行大小.

61H TLB 指令 TLB:4 KByte 页面,完全关联,48个条目.

63H TLB 数据 TLB: 2 MByte 或 4 MByte 页面, 4 路集关联, 32 个条目和一个单独的数组, 带有

1GByte页面,4路集联,4条条目.

64H TLB 数据 TLB:4 KByte页,4条路集关联,512条.

66H 缓存 第1级数据缓存:8 KByte,4路集 关联,64字节行大小.

67H 缓存 1 级数据缓存: 16 KByte, 4 路集 关联, 64 字节行大小.

68H 缓存 1 级数据缓存: 32 KByte, 4 条路集 关联, 64 字节行大小.

6AH Cache uTLB:4 KByte页,8路集合集,64个条目.

6BH Cache DTLB:4 KByte页,8路集合集,256个条目.

6CH Cache DTLB:2M/4M页,8路集合集,128个条目.

6DH Cache DTLB: 1 GByte pages, 完全关联, 16个条目.

70H 缓存: 12 K-?op, 8 条路集 关联.

71H 缓存: 16 K-?op, 8 条路集 关联.

72H缓存 缓存: 32 K-?op, 8 道集 关联 .

76H TLB 指令 TLB:2M/4M页,完全联想,8个条目.

78H 缓存 第2级缓存: 1 MByte, 4路集 关联, 64字节行大小.

79H 缓存 第2级缓存:128 KByte,8路集 关联,64字节线大小,每区段2条线.

7AH 缓存 第2级缓存: 256 KByte, 8 条路集 关联, 64 字节线大小, 每个区段2条线.

7BH 缓存 第2级缓存: 512 KByte, 8 条路集 关联, 64 字节线大小, 每个区段2条线.

7CH 缓存 第2级缓存: 1 MByte, 8 条路集关联, 64 字节行大小, 每个扇区有 2 条行.

7DH 缓存 第2级缓存: 2 MByte, 8 条路集关联, 64字节行大小.

7FH 缓存 第2级缓存: 512 KByte, 双向集为关联, 64字节的行大小.

80H 缓存 第2级缓存: 512 KByte, 8 条路集 关联, 64 字节线大小.

82H 缓存 第2级缓存: 256 KByte, 8路集 关联, 32字节行大小.

83H 缓存 第2级缓存: 512 KByte, 8 条路集 关联, 32 字节行大小.

84H 缓存 第2级缓存: 1 MByte, 8 条行集, 32 字节行大小.

85H 缓存 第2级缓存: 2 MByte, 8 条行集, 32 字节行大小.

86H 缓存 第2级缓存: 512 KByte, 4路集 关联, 64字节行大小.

87H 缓存 第2级缓存: 1 MByte, 8 条行集, 64 字节行大小.

A0H DTLB DTLB:4k页,完全联想,共32个条目.

B0H TLB 指令 TLB:4 KByte页,4路集合集,128个条目.

B1H TLB 指令 TLB:2M页,4路,8条或4M页,4路,4条.

B2H TLB 训导 TLB:4KByte页,4路集联,64条条目.

B3H TLB 数据 TLB:4 KByte页,4路集合集,128个条目.

B4H TLB 数据TLB1:4 KByte页,4路联动,256条条目.

B5H TLB 指令 TLB:4KByte页,8路集联,64个条目.

B6H TLB 指令 TLB:4KByte页,8路集合集,128个条目.

BAH TLB 数据TLB1:4 KByte页,4路联动,64个条目.

C0H TLB 数据 TLB:4 KByte和4 MByte页,4路联动,8个条目.

C1H STLB 共享 2nd-level TLB: 4 KByte/2MByte 页面,8向关联,1024条目.

C2H DTLB DTLB: 2 MByte/4 MByte页,4路联运,16个条目.

C3H STLB 共享 2nd-level TLB:4 KByte 2 MByte pages,6路联运,1536条条目. 1GB字节

pages, 4-way, 16 entries.

C4H DTLB DTLB:2 MByte/4MByte页,4路联运,32条条目.

CAH STLB 共享 2nd-level TLB:4 KByte页,4条路联线,512条.

D0H 缓存 3 第一级缓存: 512 KByte, 4 条路集 关联, 64 字节行大小.

D1H 缓存 3 第一级缓存: 1 MByte, 4- way set assactive, 64字节行大小.

D2H 缓存 3 第一级缓存: 2 MByte, 4- way set assactive, 64字节行大小.

D6H 缓存 3 第一级缓存: 1 MByte, 8 条行集, 64 字节行大小.

D7H 缓存 3 第一级缓存: 2 MByte, 8 条行集, 64 字节行大小.

D8H 缓存 3 第一级缓存: 4 MByte, 8 路集 关联, 64 字节行大小.

DCH 缓存 3 第一级缓存: 1.5 MByte, 12 way set association, 64 字节行大小.

DDH 缓存 3 第一级缓存:3 MByte, 12 way set assactive, 64 字节行大小.

DEH 缓存 3 第一级缓存: 6 MByte, 12 way set association, 64 字节行大小.

E2H 缓存 3 第一级缓存: 2 MByte, 16 条路集 关联, 64 字节行大小.

E3H 缓存 3 第一级缓存: 4 MByte, 16路集 关联, 64字节行大小.

E4H 缓存 3 第一级缓存: 8 MByte, 16 条路集 关联, 64 字节行大小.

EAH 缓存 3 第一级缓存: 12MByte,24路集 关联,64字节行大小.

EBH 缓存 3 第一级缓存:18MByte,24路集合,64字节行大小.

ECH 缓存 3 第一级缓存: 24MByte, 24 way set association, 64 字节行大小.

F0H 预选赛64-Byte预选赛.

F1H 预选赛128-Byte预选赛.

FEH General CPUID 叶片2 不报告 TLB 描述信息;使用 CPUID 叶片 18H 查询 TLB 和

其他地址翻译参数。

FFH General CPUID 叶 2 不报告缓存描述符信息,使用 CPUID 叶 4查询缓存

parameters.

例21-1 (中文(简体) ). 缓存和 TLB 解释示例

Pentium 4 处理器家族的第一个成员在 CPUID 执行时返回以下关于缓存和 TLB 的信息,输入值为 2: EAX 66 5B 50 01H EBX 0H ECX 0H EDX 00 7A 70 00H 这意味着: * 最小字节( 字节 0) 注册 EAX 设置为 01H 。 应忽略这一价值。 * 所有四个登记册(EAX,EBX,ECX,和EDX)中最显著的位值被设定为0,表明每个登记册包含有效的1字节描述符. * 注册EAX的字节1、2和3表示处理器有:

--50H - 一个64进制指令 TLB,用于映射 4-KByte和2-MByte或4-MByte 页面. -- 5BH - 一个64进制数据 TLB,用于映射 4-KByte和4-MByte 页面. -- 66H - 一个8-Kyte 1级数据缓存,4条行集,带有64-Byte缓存行大小. * EBX和ECX登记册中的描述符是有效的,但包含NULL描述符. * 注册字节 0、1、2和3EDX表示处理器有:00H - NULL说明。70H- 追踪缓存: 12 K -op, 8 -way set associate.7AH- 256-KByte 第2级缓存, 8 条线的组合式缓存, 有扇形的64字节缓存线大小 。00H - NULL释义.

CPUID.03H - 处理器序列号

CPUID.03H返回处理器序列号,如果有的话. 处理器序列号(PSN)在Pentium 4处理器中或以后不支持. * 此 叶 如果 MAQQLEAF 03H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

注册字段名称表21-13. 叶 03H 处理器序列号 Domain EAX [31:0] 保留套件 EBX [31:0] 保留套件 ECX [31:0] PSN 31 0 保留. EDX [31:0] PSN 63 32 预留.

96位处理器序列号的比特00-31. (仅在Pentium III处理器中可用;否则,本寄存器中的值会被保留. )

96位处理器序列号的位点32-63. (仅在Pentium III处理器中可用;否则,本寄存器中的值会被保留. )

CPUID.04H - 决定缓存参数

CPUID.04H 返回每个缓存级的决定性缓存参数. * 如果 CPUID.04H.00H: EAX [4:0] <> 0 和 MAQQLEAF 04H,此 叶是有效的. * 子叶被列出,直到子叶 n在EAX [4:0]中返回0. * 如果ECX包含无效的子叶指数,则EAX/EBX/ECX/EDX返回0. 子叶指数n+1如果子叶n返回EAX[4:0]为0.

** 叶 04H 决定缓存参数**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[4:0] | CACHE_TYPE | 0=null,不再有缓存. | 逻辑 |
|  |  | 1=数据缓存 2=指令缓存 3=统一缓存 4-31=预留. | 处理器 |
| EAX[7:5] | CACHE_LEVEL | 快取级别( 从 1 开始) 。 | 逻辑处理器 |
| EAX[8] | SELF_INITIALIZING_CACHE | 自初始化缓存级别( 不需要) | 逻辑 |
|  |  | 软件初始化)。 | 处理器 |
| EAX[9] | FULLY_ASSOC | 完全关联缓存 。 | 逻辑处理器 |
| EAX[13:10] | 准备金 | 预留. |  |
| EAX[25:14] | MAX_LP_ADDRESSABLE_IDS | 逻辑的最大可地址ID数 | 逻辑 |
|  |  | 共享此缓存的处理器 。 在返回值中添加一个以获取结果 。 距离不小于(1+EAX[25:14])的2型整数的最近功率,是专为处理共享此缓存的不同逻辑处理器而保留的独有初始APIC ID的数量. | 处理器 |
| EAX[31:26] | MAX_CORES_ADDRESSABLE_IDS_PKG | 物理包中处理器核心的最大可地址ID数. 在返回值中添加一个以获取结果 。 距离不小于(1+EAX[31:26])的2型整数最近的功率是专为物理包中处理不同处理器核心而保留的独特Core ID的数量. Core ID是初始APIC ID的一个位元子集. 返回的值是 ECX 中有效初始值的常数。 有效的 ECX 值从 0 开始 。 物理包域中处理器核心的可地址ID最大数量可能包含饱和值,不会正确识别CPUID.0BH和/或CPUID.1FH存在的处理器上本包中对核心的可地址ID保留. 在 CPUID.0BH 或 CPUID.1FH 中列出地形信息的处理器需要使用这些 叶 来获取正确的地形细节 。 | 平台 |
| EBX[11:0] | LINE_SIZE | 系统协调线大小 。 在返回值中添加一个以获取结果 。 | 平台 |
| EBX[21:12] | PHYS_LINE_PARTITIONS | 物理线分区. | 逻辑 |
|  |  | 在返回值中添加一个以获取结果 。 | 处理器 |
| EBX[31:22] | NUM_WAYS | 结社的方式。 | 逻辑 |
|  |  | 在返回值中添加一个以获取结果 。 | 处理器 |

ECX [31:0] NUM SETS 套数.                                    逻辑 EDX [0] NOT LWR CACHE FLUSH 在返回值中添加一个以获得结果.     处理器 EDX [1] INCLUSIVE CACHE 0 = WBINVD/INVD 来自共享此处理器的线程 EDX [2] COMPLEXCACHE INDEXING 缓存在下级缓存上对线程进行动作

```text
                                                    sharing this cache.                                Logical
                                                    1 = WBINVD/INVD is not guaranteed to act upon      Processor
                                                    lower level caches of non-originating threads      Logical
                                                    sharing this cache.                                Processor
```

EDX[31:3] 预留0=缓存不包括下缓存级别. 1=缓存包含下缓存级别.

0 = 直接映射缓存. 1 = 一个复杂的函数用于索引缓存,可能使用所有地址位.

Reserved.

当CPUID与EAX设定为04H和ECX执行时,处理器返回了描述一组决定性缓存参数的编码数据(对于与ECX输入相关的缓存级别). 有效指数值从 0 开始. 软件可以列出缓存层次的每个层次的决定性缓存参数,从指数值0开始,直到参数报告缓存类型字段的相关值为0. 此缓存大小以字节表示 = (Ways + 1) * (部分+1) * (行 尺寸+1) * (Sets + 1) = (EBX [31:22] + 1) = (EBX) [31:22] + 1]. * (EBX [21:12] + 1) (中文(简体) ). * (EBX[11:0]+1] (中文(简体) ). * (ECX + 1) CPUID.04H还报告了数据,这些数据可以在关于遗留处理器的物理包中用来得出处理器芯的地形. 对于所有有效的索引值,此信息是常数的。 软件可以查询CPUID与EAX=04H和ECX=0一起执行的原始数据,并将其作为处理器的地形计数算法的一部分,这些处理器既没有列出CPUID.0BH,也没有列出CPUID.1FH,如第10章"多处理器管理",Intel(R)64和IA-32 Architectures Software开发者手册,Volume 3A所述.

CPUID.05H - MONITOR 和 MWAIT 特性

CPUID.05H返回MONITOR和MWAIT特征信息. * 此 叶 如果 MAQQLEAF 05H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 05H MONITOR 和 MWAIT 地物**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[15:0] | SMALLEST_MONITOR_LINE_SIZE | 在字节中最小的显示器行大小(默认为处理器的显示器颗粒性). | 平台 |
| EAX[31:16] | 准备金 | 预留. |  |
| EBX[15:0] | LARGEST_MONITOR_LINE_SIZE | 在字节中显示最大监视线大小(默认为处理器显示器颗粒性). | 平台 |
| EBX[31:16] | 准备金 | 预留. |  |
| ECX[0] | MONITOR_MWAIT_EXTENSIONS | 如果 1, 支持对 MONITOR/ MWAIT 扩展列表( 超越 EAX 和 EBX 注册) 。 | 平台 |
| ECX[1] | INTERRUPT_AS_BREAK_EVENT | 如果 1, 支持将中断作为 MWAIT 的中断事件, 即使中断被禁用 。 | 平台 |
| ECX[31:2] | 准备金 | 预留. |  |
| EDX[3:0] | C0_SUB_STATES | 使用 MWAIT 支持的 C0* 子 C 状态数 。 | 平台 |
| EDX[7:4] | C1_SUB_STATES | 使用 MWAIT 支持的 C1* 子 C 状态数量 。 | 平台 |
| EDX[11:8] | C2_SUB_STATES | 使用 MWAIT 支持的 C2* 子 C 状态数量 。 | 平台 |
| EDX[15:12] | C3_SUB_STATES | 使用 MWAIT 支持的 C3* 子 C 状态数量 。 | 平台 |
| EDX[19:16] | C4_SUB_STATES | 使用 MWAIT 支持的 C4* 子 C 状态数量 。 | 平台 |
| EDX[23:20] | C5_SUB_STATES | 使用 MWAIT 支持的 C5* 子 C 状态数量 。 | 平台 |
| EDX[27:24] | C6_SUB_STATES | 使用 MWAIT 支持的 C6* 子 C 状态数量 。 | 平台 |
| EDX[31:28] | C7_SUB_STATES | 使用 MWAIT 支持的 C7* 子 C 状态数量 。 | 平台 |

CPUID.06H - 热力和动力管理特性

CPUID.06H 返回关于热电管理特性的信息. * 此 叶 如果 MAQQLEAF 06H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 06H 热力和动力管理特性**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[0] | DIGITAL_TEMP_SENSOR | 如果 1,支持数字温度传感器. | 平台 |
| EAX[1] | TURBO_BOOST | 如果1,支持Intel Turbo Boost技术. (见IA32 MISC ENABLE[38]). | 平台 |
| EAX[2] | ALWAYS_RUNNING_APIC_TIMER | 如果 1,支持 APIC-Timer-Allways-running 特性. | 平台 |
| EAX[3] | 准备金 | 预留. |  |
| EAX[4] | POWER_LIMIT_NOTIFY | 如果1,支持电源限制通知控制. | 平台 |
| EAX[5] | EXT_CLOCK_MOD | 如果1,则支持时钟调制值勤周期延长. | 平台 |
| EAX[6] | PKG_THERM_MGMT | 如果1,支持包热管理. | 平台 |
| EAX[7] | HWP | 如果 1, 支持 HWP 基础注册(IA32 PM ENABLE[bit , IA32 HWP CAPABILITIES, IA32 HWP REQULEST, IA32 HWP STATUS). | 平台 |
| EAX[8] | HWP_INTERRUPT | 如果1,支持IA32 HWP INTERRUPT MSR. | 平台 |
| EAX[9] | HWP_ACTIVITY_WINDOW | 如果1,支持IA32 HWP REQULEST[比特41:32]. | 平台 |
| EAX[10] | HWP_EPP | 如果1,支持IA32 HWP REQULEST[位於31:24]. | 平台 |
| EAX[11] | HWP_REQUEST_PKG | 如果1,支持IA32 HWP REQULEST PKG MSR. | 平台 |
| EAX[12] | 准备金 | 预留. |  |
| EAX[13] | HDC | 如果 1,支持 HDC 碱基注册 IA32 PKG HDC CTL, IA32 PM CTL1,以及 IA32 THREAD STALL MSRs. | 平台 |
| EAX[14] | TURBO_BOOST_MAX | 如果1,支持Intel(R)Turbo Boost Max Technology 3.0. | 平台 |
| EAX[15] | HWP_CAP | 如果1,支持最高性能改变能力. | 平台 |
| EAX[16] | HWP_PECI_OVERRIDE | 如果 1, 支持 HWP PECI 覆盖 。 | 平台 |
| EAX[17] | FLEXIBLE_HWP | 如果1,则支持弹性HWP. | 平台 |
| EAX[18] | HWP_REQUEST_FAST_ACCESS | 若1,支持IA32 HWP REQULEST MSR快速访问模式. | 平台 |
| EAX[19] | HW_FEEDBACK | 如果1,支持IA32 HW FEEDBACK PTR MSR,IA32 HW FEEDBACK CONFIG MSR,IA32 PACKAGE THERM STATUS MSR bit 26,以及IA32 PACKAGE THERM INTERRUPT MSR bit 25. | 平台 |
| EAX[20] | HWP_REQUEST_IGNORE_IDLE | 如果 1, 支持忽略 Idle 逻辑处理器 HWP 请求 。 | 平台 |
| EAX[21] | 准备金 | 预留. |  |
| EAX[22] | HWP_CTL | 如果1,支持IA32 HWP CTL MSR. | 平台 |
| 21-24卷 第1册. |  | PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION |  |

EAX[23] THREAD DIRECTOR If 1,支持英特尔(R)线索总监.             平台

```text
                                     IA32_HW_FEEDBACK_CHAR and                          Platform
```

EAX [31:24] 预留的IA32 HW FEEDBACK THREAD CONFIG MSRs平台 EBX[3:0] DTS NUM INT THRESHOLDS 如果设定,则支持. EBX平台[31:4] 预留.                                          平台ECX[0] HW FEEDBACK CAP包数 数字ECX [2:1] 保留热感应.                                    软件包 ECX [3] ENERGY PERF BIAS 逻辑

```text
                                     Reserved.                                          Processor
```

ECX[7:4] 预留ECX[15:8] HW FEEDBACK NUM CLASES 如果1,支持IA32 MPERF和IA32 APERF,它们提供了交付的处理器ECX[31:16] 预留的性能(自上次重置计数器以来),EDX[7:0] HW FEEDBACK CAPS在TSC EDX[11:8] HW FEDBACK TABLEZEE频率运行时作为预期处理器性能的百分比.

EDX [15:12] 预备役. EDX [31:16] HW FEEDBACK TABLE INDEX 如果1,则支持性能偏重和名为IA32 ENERGY PERF BIAS(1B0H)的新建筑MSR.

Reserved.

处理器支持的英特尔(R)线导课程数量 。 许多类的信息被写入了硬件的Intel Thread Director Table中.

Reserved.

支持硬件反馈接口能力的位图. 0 = 如果1,支持性能报告. 1 = 如果1,支持能效能力报告. 2-7 = 预留. 0位和1位将永远被设置在一起.

假设硬件反馈接口结构的大小为4 KB页. 在返回值中添加一个以获取结果 。

Reserved.

硬件反馈接口结构中此逻辑处理器行的索引(从0开始). 请注意,在某些部分,多逻辑处理器的索引可能相同。 在某些部分,索引可能不是毗连的,即硬件反馈接口结构中可能存在未使用的行.

围绕这些特性的详情在"动力与热管理"第16章,Intel(R)64和IA-32 Architecture Software Developers's Manuto,Volume 3B中都有描述.

CPUID.07H - 结构化扩展特性旗

CPUID.07H 返回结构化的扩展特征标记计数信息 。 科分科提供叶 07H信息. * 此 叶 如果 MAQQLEAF 07H 有效 。 * 子叶最大值ECX在CPUID.07H.00H.EAX[31:0] MAQSUBLEAF中指定. * 如果ECX包含无效的子叶指数,则EAX/EBX/ECX/EDX返回0. 如果 n 超过 子叶 0 在 EAX 中返回的值,则 子叶 指数 n 无效.

CPUID.07H.00H - 结构化扩展特性旗 Main 子叶

CPUID.07H.00H返回最高的叶 07H 子叶的最大输入值;以及EBX,ECX,和EDX包含扩展特征旗的信息.

** 叶 07H 子叶(ECX=0) 输出登记簿**

| EAX[31:0] | MAX_SUBLEAF | 报告所支持的 07H 子叶的最大输入值 。 | 叶子 | 平台 |
| --- | --- | --- | --- | --- |
| EBX[31:0] |  | EBX的扩展特性旗信息(参见"CPUID.07H.00H:EBX-Extended Federal Flags Information"). |  |  |
| ECX[31:0] |  | ECX的扩展特性旗信息(参见"CPUID.07H.00H:ECX-Extended Federal Flags Information"). |  |  |
| EDX[31:0] |  | EDX的扩展特性旗信息(参见"CPUID.07H.00H:EDX-Extended Federal Flags Information"). |  |  |

** 叶 07H.00H 结构扩展特征旗 返回 EAX**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | 报告所支持的 叶 07H 子叶 的最大输入值. | 平台 |

** 叶 07H.00H 结构扩展特征旗 返回 EBX**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EBX[0] | FSGSBASE | 如果1,支持RDFSBASE/RDGSBASE/WRFS-BASE/WRGSBASE. | 平台 |
| EBX[1] | TSC_ADJUST | 如果 1,则支持IA32 TSC ADJUST MSR. | 平台 |
| EBX[2] | SGX | 如果 1,支持Intel(R)软件守护扩展(Intel(R)SGX扩展). | 平台 |
| EBX[3] | BMI1 | 如果 1, 支持 BMI1 指令 。 | 平台 |
| EBX[4] | HLE | 如果 1,支持硬件锁 Elision 指令集. | 平台 |
| EBX[5] | AVX2 | 如果 1,支持Intel(R)高级矢量扩展2(Intel(R)AVX2). | 平台 |
| 21-26卷 第1册. |  |  |  |
|  | PROCESSOR IDENTIFICATION AND | FEATURE DETERMINATION |  |

EBX[6] FDP EXCPTN ONLY 如果 1,则x87 FPU数据指针只在x87例外上更新平台. EBX [7] SMEP 平台 If 1,支持主管-Mode Executive EBX [8] BMI2 预防.                                             EBX平台[9] ENH REP MOVSB STOSB平台 EBX[10] INVPCID If 1,支持BMI2指令.                   平台

EBX[11] RTM If 1,支持增强型REP MOVSB/STOSB.                平台

EBX[12] RDT M If 1,支持管理进程文本EBX[13] FCS FDS DEPRECATION标识符的系统平台软件的INVPCID指令.                                            EBX平台[14] MPX平台 如果1,支持限制交易的EBX[15] RDT A内存指令集.                                 平台

EBX[16] AVX512F If 1,支持Intel(R)资源总监平台EBX[17] AVX512DQ Technology(Intel(R) RDT)监测能力.          平台EBX[18] RDSEED 平台EBX[19] ADX If 1,贬值FPU CS和FPU DS值.              EBX平台[20] SMAP平台 If 1,支持Intel(R)内存保护 EBX[21] AVX512 IFMA扩展.                                             平台EBX[22] 保留EBX[23] CLFLUSHOPT If 1,支持Intel(R)资源总监平台EBX[24] CLWB Technology(Intel(R) RDT)分配能力.          EBX[25] INTEL PROC TRACE 平台 EBX[26] AVX512PF If 1,支持AVX512F指令.                平台

EBX[27] AVX512ER If 1,支持AVX512DQ指令.               平台

EBX[28] AVX512CD If 1,支持RDSEED指令.                  EBX平台[29] SHA平台 如果1,支持ADX指令. EBX[30] AVX512BW平台 EBX[31] AVX512VL If 1,支持监理-Mode访问平台预防及CLAC/STAC指令.

如果 1, 支持 AVX512  IFMA 指令 。

Reserved.

如果 1, 支持 CLFLUSHOPT 指令 。

如果 1, 支持 CLWB 指令 。

如果 1, 支持 Intel( R) 处理器 Trace 。

如果 1, 支持 AVX512PF 指令 。 (英特尔(R)Xeon PhiTM只.

如果 1, 支持 AVX512ER 指令 。 (英特尔(R)Xeon PhiTM只.

如果 1, 支持 AVX512CD 指令 。

如果 1, 支持 Intel( R) 安全 Hash 算法扩展( Itel( R) SHA 扩展) 。

如果 1, 支持 AVX512BW 指令 。

如果 1, 支持 AVX512VL 指令 。

CPUID.07H.00H: ECX 扩展特性旗信息

CPUID.07H.00H的ECX登记册返回以下信息.

** 叶 07H.00H 结构扩展特征旗 返回 ECX**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| PROCESSOR | IDENTIFICATION A | ND FEATURE  DETERMINATION |  |
| ECX[0] | PREFETCHWT1 | 如果 1, 只支持 PREFETCHWT1 (Intel( R) Xeon PhiTM ) 。 | 指导。         平台 |
| ECX[1] | AVX512_VBMI | 如果 1, 支持 AVX512  VBMI | 说明。        平台 |

ECX[0] PREFETCHWT1 If 1,支持PREFETCHWT1指令.      平台 ECX [1] AVX512 VBMI (Intel(R) Xeon PhiTM only.) ECX [2] UMIP ECX [3] PKU If 1,支持AVX512 VBMI指令. ECX平台[4] OSPKE If 1,支持用户-mode指示预防. ECX平台 [5] WAITPKG ECX [6] AVX512 VBMI2 如果1,支持保护密钥的用户-mode平台 ECX [7] CET SS页面.

```text
                                                    If 1, the OS has set CR4.PKE to enable           Logical
```

处理器保护密钥和RDPKRU/WRPKRU指令.

```text
                                                    If 1, supports the TPAUSE, UMONITOR, and         Platform
```

UMWAIT 指令.

如果1,支持AVX512 VBMI2指令. 平台

```text
                                                    If 1, supports CET shadow stack features.        Platform
```

设置此位的处理器定义了 IA32 U CET 和 IA32 S CET MSR 的 1: 0 位.

假定支持下列核磁共振: IA32 INTERRUPT SPP ADR ADR,IA32 PL3 SSP,IA32 PL2 SSP,IA32 PL1 SSP,

and IA32_PL0_SSP.

ECX[8] GFNI If 1,支持GFNI指令集.         ECX [9] VAES 如果支持1和Intel AVX,则支持VEX-平台ECX[10] VPCLMULQDQ编码AES指令集.

ECX[11] AVX512 VNNI 如果支持1和Intel AVX,则支持平台ECX[12] AVX512 BITALG VPCLMULQDQ指令. ECX[13] TME EN If 1,支持AVX512 VNNI指令. 平台

如果 1, 支持 AVX512  BITALG 指令 。 平台

```text
                                                    If 1, the following MSRs are supported:          Platform
```

IA32_TME_CAPABILITY, IA32_TME_ACTIVATE, IA32_TME_EXCLUDE_MASK, and IA32_TME_EXCLUDE_BASE.

ECX[14] AVX512 VPOCNTDQ 如果1,支持AVX512 VPOCNTDQ平台指令.

ECX[15] 预备役. ECX[16] LA57 If 1,支持57位线性地址和5位平台级别呼声.

ECX [21:17] MPX MAWAU MAWAU在64位模式下使用BNDLDX和平台BNDSTX指令的值.

ECX[22] RDPID 如果1,RDPID和IA32 TSC AUX MSR是可用的平台.

ECX[23] keil LOCKER If 1,支持Key Locker.                       ECX [24] BUS LOCK DETECT ECX [25] CLDEMOTE If 1,表示支持OS总线锁检测. 平台ECX[26] 保留ECX[27] MOVDIRI If 1,支持缓存行降级.                平台ECX[28] MOVDIR64B ECX[29] ENQCMD储备.

```text
                                                    If 1, supports the MOVDIRI instruction.          Platform
```

```text
                                                    If 1, supports the MOVDIR64B instruction.        Platform
```

```text
                                                    If 1, supports Enqueue Stores.                   Platform
```

ECX[30] SGQQLC If 1,支持SGX 启动配置.               ECX平台 [31] PKS平台 If 1,支持保护 密钥用于主管mode页面.

CPUID.07H.00H: EDX 扩展特性旗信息

CPUID.07H.00H的EDX登记册返回以下信息.

** 叶 07H.00H 结构扩展特征旗 返回 EDX**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EDX[0] | 准备金 | 预留. |  |
| EDX[1] | SGX_KEYS | 如果 1, 支持 Intel( R) SGX 的验证服务 。 | 平台 |
| EDX[2] | AVX512_4VNNIW | 如果1,支持AVX512 4VNNIW指令. (英特尔(R)Xeon PhiTM只. | 平台 |
| EDX[3] | AVX512_4FMAPS | 如果1,支持AVX512 4FMAPS指令. (英特尔(R)Xeon PhiTM只. | 平台 |
| EDX[4] | FAST_SHORT_REP_MOVSB | 如果1,支持快速短REP MOVSB. | 平台 |
| EDX[5] | UINTR | 如果 1, 支持用户中断 。 | 平台 |
| EDX[7:6] | 准备金 | 预留. |  |
| EDX[8] | AVX512_VP2INTERSECT | 如果1,支持AVX512 VP2INTERSECT指令. | 平台 |
| EDX[9] | MCU_OPT_CTRL | 如果 1, 支持 IA32  MCU  OPT  CTRL MSR 及其比特 0 (RNGDS MITG DIS). | 平台 |
| EDX[10] | MD_CLEAR | 如果 1, 支持 MD  CLEAR 。 | 平台 |
| EDX[11] | RTM_ALWAYS_ABORT | 如果 1, XBEGIN 的任何执行都会立即中止并过渡到指定的倒置地址. | 平台 |
| EDX[12] | 准备金 | 预留. |  |
| EDX[13] | RTM_FORCE_ABORT | 如果 1, 则支持 RTM FORCE  ABORT 和 IA32 TS FORCE ABORT MSR 。 这些允许软件设置IA32 TS FORCE ABORT[0](RTM FORCE ABORT). | 平台 |
| EDX[14] | SERIALIZE | 如果 1, 支持 SERIALIZE 指令 。 | 平台 |
| EDX[15] | HYBRID | 如果1,处理器被确定为混合部分. 若CPUID.00H.MAXLEAF 1AH和CPUID.1AH:EAX <> 0,则原生型号ID Enumeration 叶 1AH存在. | 平台 |
| EDX[16] | TSXLDTRK | 如果1,支持Intel TSX暂停/恢复负载地址跟踪. | 平台 |
| EDX[17] | 准备金 | 预留. |  |
| EDX[18] | PCONFIG | 如果 1, 支持 PCONFIG 指令 。 | 平台 |
| EDX[19] | ARCH_LBRS | 如果1,支持建筑LBR. | 平台 |
| EDX[20] | CET_IBT | 如果 1,支持 CET 间接分支跟踪功能. 设置此位的处理器定义了IA32 U CET和IA32 S CETMSR中的位数5:2和位数63:10. | 平台 |
| PROCESSOR | IDENTIFICATION AND FEATURE DETERMINATION |  |  |
| EDX[21] | 准备金 | 预留. |  |
| EDX[22] | AMX_BF16 | 如果 1, 支持 bfloat16 数字上的瓦片计算操作 。 | 平台 |
| EDX[23] | AVX512_FP16 | 如果 1, 支持 FP16 数据类型, 并附有 AVX512 指令. | 平台 |
| EDX[24] | AMX_TILE | 如果 1, 支持瓦片结构 。 | 平台 |
| EDX[25] | AMX_INT8 | 如果 1,支持在8位整数上进行瓦片计算操作. | 平台 |
| EDX[26] | IBRS_IBPB | 如果1,支持间接分支限制投机(IBRS)和间接分支预测器屏障(IBPB). 设置此位的处理器支持IA32 SPEC CTRL MSR和IA32 PRED CMD MSR. 它们允许软件设置IA32 SPEC CTRL[0](IBRS)和IA32 PRED CMD[0](IBPB). | 平台 |
| EDX[27] | SPEC_CTRL_ST_PREDICTORS | 如果 1,支持单线程间接分支预测器(STIBP). 设置此位的处理器支持 IA32 SPEC CTRL MSR 。 它们允许软件设置IA32 SPEC CTRL[1] (STIBP). | 平台 |
| EDX[28] | L1D_FLUSH_INTERFACE | 如果1,则支持L1D FLUSH. 设置此位的处理器支持 IA32 FLUSH CMD MSR. 它们允许软件设置IA32 FLUSH CMD[0](L1D -FLUSH). | 平台 |
| EDX[29] | ARCH_CAPABILITIES | 如果1,支持IA32 ARCH CAPABILITIES MSR. | 平台 |
| EDX[30] | CORE_CAPABILITIES | 如果1,支持IA32 CORE CAPABILITIES MSR. IA32 CORE CAPABILITIES是一座建筑MSR,它列举了模型特有的特征. 此 MSR 中设置的位点表示支持模式特定特性;软件仍然必须查询 CPUID 家族/模型/步骤,以确定IA32 CORE CAPABILITIES 中列举的特征所列举特征的行为,在不同处理器模型上可能具有不同的行为. 其中一些特征可能具有不同处理器模型的一致行为(对于CPUID家族/型号/步态的咨询是不必要的);这些特征在本手册中记载的地方被明确识别出来. | 平台 |
| EDX[31] | SPEC_CTRL_SSBD | 如果 1, 支持 Speculative Store Bypass 禁用 (SSBD). 设置此位的处理器支持 IA32 SPEC CTRL MSR 。 它们允许软件设置IA32 SPEC CTRL[2](SSBD). | 平台 |

EDX[21] 预备役.                                           EDX平台[22] AMQXBF16平台

```text
                                                    If 1, supports tile computational operations on     Platform
```

EDX[23] AVX512 FP16 bfloat16数字.                                   平台 EDX[24] AMQQTILE If 1,支持FP16数据类型,并配有AVX512 EDX[25] AMQQINT8指令.                                       平台 EDX[26] IBRS IBPB If 1,支持瓦片架构.                   平台 EDX[27] SPEC CTRL ST PREDICTORS 如果 1, 支持在

```text
                                                    8-bit integers.                                     Platform
```

EDX[28] L1D FLUSH INTERFACE 如果1,支持间接分支限制EDX[29]ARCH CAPABILITIES投机(IBRS)和间接分支限制EDX[30]CORE CAPILIES预测屏障(IBPB). 设置此位的处理器支持 IA32 SPEC CTRL MSR 和 EDX [31] SPEC CTRL SSBD IA32 PRED CMD MSR. 它们允许软件设置IA32 SPEC CTRL[0](IBRS)和IA32 PRED CMD[0](IBPB).

如果 1,支持单线程间接分支预测器(STIBP). 设置此位的处理器支持 IA32 SPEC CTRL MSR 。 它们允许软件设置IA32 SPEC CTRL[1] (STIBP).

如果1,则支持L1D FLUSH. 设置此位的处理器支持 IA32 FLUSH CMD MSR. 它们允许软件设置IA32 FLUSH CMD[0](L1D -FLUSH).

如果1,支持IA32 ARCH CAPABILITIES MSR.

如果1,支持IA32 CORE CAPABILITIES MSR. IA32 CORE CAPABILITIES是一座建筑MSR,它列举了模型特有的特征. 此 MSR 中设置的位点表示支持模式特定特性;软件仍然必须查询 CPUID 家族/模型/步骤,以确定IA32 CORE CAPABILITIES 中列举的特征所列举特征的行为,在不同处理器模型上可能具有不同的行为. 其中一些特征可能具有不同处理器模型的一致行为(对于CPUID家族/型号/步态的咨询是不必要的);这些特征在本手册中记载的地方被明确识别出来.

如果 1, 支持 Speculative Store Bypass 禁用 (SSBD). 设置此位的处理器支持 IA32 SPEC CTRL MSR 。 它们允许软件设置IA32 SPEC CTRL[2](SSBD).

CPUID.07H.01H - 结构扩展特性 子叶 1

CPUID.07H.01H: EAX 扩展特性信息

CPUID.07H.01H的EAX登记册返回以下信息.

** 叶 07H.01H 结构扩展特征旗 返回 EAX**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[0] | SHA512 | 如果 1, 支持 SHA512 指令 。 | 平台 |
| EAX[1] | SM3 | 如果 1, 支持 SM3 指令 。 | 平台 |
| EAX[2] | SM4 | 如果 1, 支持 SM4 指令 。 | 平台 |
| EAX[3] | 准备金 | 预留. |  |
| EAX[4] | AVX_VNNI | 如果 1,支持矢量神经网络指令的VEX-encoded版本. | 平台 |
| EAX[5] | AVX512_BF16 | 如果 1,支持支持BFLOAT16输入的矢量神经网络指令和IEEE单精度的转换指令. | 平台 |
| EAX[6] | LASS | 如果 1, 支持线性地址空间分隔 。 | 平台 |
| EAX[7] | CMPCCXADD | 如果1,支持CMPccXADD指令. | 平台 |
| EAX[8] | ARCH_PERFMON_EXT | 如果1,则支持ArchPerfmonExt. 设定时,表示建筑性能监测扩展叶(EAX=23H)有效. | 平台 |
| EAX[9] | 准备金 | 预留. |  |
| EAX[10] | FAST_REP_MOVSB | 如果1,支持快速零长的REP MOVSB. | 平台 |
| EAX[11] | FAST_REP_STOSB | 如果1,支持快速短的REP STOSB. | 平台 |
| EAX[12] | FAST_REP_CMPSB_SCASB | 如果1,支持快速短的REP CMPSB,REP SCASB. | 平台 |
| EAX[16:13] | 准备金 | 预留. |  |
| EAX[17] | FRED | 如果 1, 支持灵活返回和事件交付以及FRED定义的建筑状态(MSR). 任何列举FRED过渡支持的英特尔处理器也会列举LKGS的支持. | 平台 |
| EAX[18] | LKGS | 如果1,支持LKGS(装入IA32 KERNEL GS BASE)指令. | 平台 |
| EAX[19] | WRMSRNS | 如果 1, 支持 WRMSRNS 指令 。 | 平台 |
| EAX[20] | 准备金 | 预留. |  |
| EAX[21] | AMX_FP16 | 如果 1, 支持 FP16 数字上的瓦片计算操作 。 | 平台 |
| EAX[22] | HRESET | 如果 1, 通过 HRESET 指令和 IA32 HRESET ENABLE MSR 支持历史重设 。 设定时,表示处理器历史重置叶(EAX = 20H)是有效的. | 平台 |
| EAX[23] | AVX_IFMA | 如果1,支持AVX-IFMA指令. | 平台 |
| EAX[25:24] | 准备金 | 预留. |  |
| EAX[26] | LAM | 如果 1, 支持 Linear 地址 Masking 。 | 平台 |
| EAX[27] | MSRLIST | 如果1,支持RDMSRLIST和WRMSRLIST指令以及IA32 BARRIER MSR. | 平台 |
| EAX[29:28] | 准备金 | 预留. |  |
| EAX[30] | INVD_DISABLE_POST_BIOS_DONE | 如果 1, 在 BIOS Done 之后支持 INVD 执行预防. | 平台 |

EAX[31] 预备役。

CPUID.07H.01H: EBX 扩展特性信息

CPUID.07H.01H的EBX登记册返回以下信息.

** 叶 07H.01H 结构扩展特征旗 返回 EBX**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EBX[0] | PPIN | 如果 1,支持IA32 PPIN和IA32 PPIN CTL MSRs. | 平台 |
| EBX[1] | PBNDKB | 如果 1, 支持 PBNDKB 指令并列举 IA32  TSE  CAPABILITY MSR 的存在. | 平台 |
| EBX[2] | 准备金 | 预留. |  |
| EBX[3] | CPUIDMAXVAL_LIM_RMV | 如果 1, IA32 MISC ENABLE [bit 22] 无法设定为 1,以限制 CPUID.00H: EAX [7:0] 返回的值. | 平台 |
| EBX[31:4] | 准备金 | 预留. |  |

** 叶 07H.01H 结构扩展特征旗 返回 ECX**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| ECX[0] | RDT_M_ASYM | 如果 1,这个平台上至少有一个逻辑处理器支持不对称的Intel(R)RDT监测能力. |  |
| ECX[1] | RDT_A_ASYM | 如果 1,这个平台上至少有一个逻辑处理器支持不对称的Intel(R)RDT分配能力. |  |
| ECX[31:2] | 准备金 | 预留. |  |

** 叶 07H.01H 结构扩展特征旗 返回 EDX**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EDX[3:0] | 准备金 | 预留. |  |
| EDX[4] | AVX_VNNI_INT8 | 如果1,支持AVX-VNNI-INT8指令. | 平台 |
| EDX[5] | AVX_NE_CONVERT | 如果1,支持AVX-NE-CONVERT指令. | 平台 |
| EDX[7:6] | 准备金 | 预留. |  |
| EDX[8] | AMX_COMPLEX | 如果 1, 支持 AMQQCOMPLEX 指令 。 |  |
| EDX[9] | 准备金 | 预留. |  |
| EDX[10] | AVX_VNNI_INT16 | 如果1,支持AVX-VNNI-INT16指令. | 平台 |
| 21-32卷 第1册. |  |  |  |
|  | PROCESSOR | IDENTIFICATION AND FEATURE DETERMINATION |  |

EDX [13:11] 预备役.                                                        EDX平台 [14] PREFETCHI平台 EDX [16:15] 预留1,支持PREFETCHIT0/1指令.                   平台 EDX[17] UIRET UIF

```text
                                   Reserved.                                                        Platform
```

EDX[18]       CET_SSS                                                                               Platform

```text
                                   If 1, UIRET sets UIF to the value of bit 1 of the                Platform
```

EDX[19] AVX10 RFLAGS图像从堆栈装入.                              平台

EDX [21:20] 保留 如果1,表示一个操作系统可以EDX[22] SEC-TEE-ATTESTATION允许主管影子堆栈,只要其EDX[23] MWAIT确保主管影子堆栈不会由于页面断层EDX[24] SLSM(见Intel(R)64和IA-32架构软件开发者手册第17.2.3节,EDX[31:25] 保留卷1)而过早繁忙. 仿照 CPUID 指令时,一个虚拟机显示器(VMM)只有在确保VM退出不能导致宾客主管影子堆栈出现过早繁忙的情况下,才能将此位返回为1. 这种VMM可以设置"早忙的影子堆栈"VM-exit控制,并使用它提供的附加信息.

如果 1, 支持 Intel( R) AVX10 指令, 并显示 CPUID.24H 的存在, 它列举了版本编号 。

Reserved.

N/A

If 1, MWAIT is supported (even if CPUID.01H:ECX.MONITOR[3] is enumerated as 0).

静态LSM在这个平台上得到支持. 如果设定, IA32 INTEGRITY STATUS(0x2DC)可供软件使用.

Reserved.

CPUID.07H.02H - 结构扩展特性 子叶 2

CPUID.07H.02H返回本节子节中包含的结构化扩展特征信息.

CPUID输出表21-26. 叶 07H 子叶 (ECX=2) 输出登记册 说明

EAX [31:0] 保留EBX [31:0] 保留ECX [31:0] 扩展特性信息(参见"CPUID.07H.02H:EDX-扩展特性信息").

EDX[31:0]

CPUID.07H.02H: EDX 扩展特性信息

CPUID.07H.02H的EDX登记册返回以下信息.

** CPUID.07H.02H 以 EDX1 提供的扩展特性信息**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EDX[0] | PSFD | 如果 1, 支持 IA32  SPEC  CTRL MSR 的位数 7 。 此 MSR 中的 Bit 7 禁用 Fast Store 转发 Predictor 而不禁禁用 Speculative Store Bypass 。 | 平台 |
| EDX[1] | IPRED_CTRL | 如果 1,则支持IA32 SPEC CTRL MSR中的位数3和4. 此 MSR 的比特 3 允许 IPED  DIS 控制 CPL3 。 此 MSR 的比特 4 允许 IPED  DIS 控制 CPL0/1/ 2 。 | 平台 |
| EDX[2] | RRSBA_CTRL | 如果1,则支持IA32 SPEC CTRL MSR中的位数5和6. 此 MSR 的比特 5 禁用 RRSBA 行为为 CPL3 。 此 MSR 的比特 6 禁用 RRSBA 行为为 CPL0/1/ 2 。 | 平台 |
| EDX[3] | DDPD_U | 如果 1, 支持 IA32  SPEC  CTRL MSR 中的位 8 。 此 MSR 的位 8 禁用数据依赖性预选 。 | 平台 |
| EDX[4] | BHI_CTRL | 如果 1, 支持 IA32  SPEC  CTRL MSR 的位数 10 。 此 MSR 中的位 10 允许 BHI  DIS  S 行为 。 | 平台 |
| EDX[5] | MCDT_NO | 如果 1, 处理器不显示 MXCSR 配置依赖时间( MCDT) 行为, 并且不需要为避免某些指令的数据依赖行为而减轻. | 平台 |
| EDX[6] | UC_LOCK_DISABLE | 如果 1, 支持 UC 时钟禁用特性并导致 #AC 。 | 平台 |
| EDX[7] | MONITOR_MITG_NO | 如果1,MONITOR/UMONITOR指令不会因MONITOR/UMONITOR指令超出内部显示器跟踪表容量而受性能或动力问题的影响. 如果为0,那么产品可能会受到这个问题的影响. | 平台 |
| EDX[31:8] | 准备金 | 预留. |  |

CPUID.08H -- Reserved

此 叶 保留 。

注册字段名称表21-28. 叶 08H 保留域名 EAX [31:0] 保留域名 EBX [31:0] 保留域名 ECX [31:0] 保留域名. EDX [31:0] 预备役. 预留. 预留.

CPUID.09H - 直接缓存访问信息

CPUID.09H返回关于直接缓存访问能力的信息. * 如果 CPUID.01H: ECX.DCA[18] = 1 和 MAXLEAF 09H ,此 叶 有效. * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 09H 直接缓存访问信息**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | PLATFORM_DCA_CAP | 位值 [31: 0] of IA32 PLATFORM DCA CAP MSR(地址1F8H). | 平台 |
| EBX[31:0] | 准备金 | 预留. |  |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |

CPUID.0AH -- -- 建筑性能监测

CPUID.0AH返回关于支持建筑性能监测能力的信息. * 如果 CPUID.0AH: EAX [7:0] (Version ID) > 0 和 MAX LEAF 0AH,此 叶是有效的. * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 0AH 建筑性能监测**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[7:0] | VERSION | 建筑性能监测的版本ID. | 平台 |
| EAX[15:8] | NUM_GP_CTRS | 每个逻辑处理器的通用性能监测计数器数量. | 平台 |
| EAX[23:16] | GP_CTR_WIDTH | 一般用途的位宽,性能监测计数器. | 平台 |
| EAX[31:24] | EVENT_ENUM_LENGTH | EBX位向量的长度以列举建筑性能监测事件. 建筑活动x如果EBX[x]=0&&EAX[31:24]>x,则支持. | 平台 |
| EBX[0] | CORE_CYC_NA | 如果 1 或 EAX [31:24] <1. 核心周期事件不可用. | 平台 |
| EBX[1] | INTR_RET_NA | 如果 1 或 EAX [31:24] <2. 指令退休事件不可用 。 | 平台 |
| EBX[2] | REF_CYC_NA | 如果 1 或 EAX [31:24] <3. 参考周期事件不可用 。 | 平台 |
| EBX[3] | LLC_CYC_NA | 如果 1 或 EAX [31:24] <4 则最后一个级别缓存引用事件不可用 。 | 平台 |
| EBX[4] | LLC_MISSES_NA | 如果 1 或 EAX [31:24] <5 ,则最后一个级别缓存丢失事件不可用 。 | 平台 |
| EBX[5] | BR_INSTR_RET_NA | 如果 1 或 EAX [31:24] <6 则无法提供分支指令退休事件 。 | 平台 |
| EBX[6] | BR_MISPRED_RET_NA | 如果 1 或 EAX [31:24] <7. | 平台 |
| EBX[7] | SLOTS_NA | 如果 1 或 EAX [31:24] <8. 则无法使用自上而下槽事件 。 | 平台 |
| EBX[8] | BACKEND_NA | 如果 1 或 EAX [31:24] < 9. 自上而下的后端绑定不可用 。 | 平台 |
| EBX[9] | BADSPEC_NA | 如果 1 或 EAX [31:24] < 10. 上下不良猜测不可用. | 平台 |
| EBX[10] | FRONTEND_NA | 如果 1 或 EAX [31:24] < 11. 上下前端绑定不可用 。 | 平台 |
| EBX[11] | RETIRING_NA | 如果 1 或 EAX [31:24] < 12,则无法自上而下退休。 | 平台 |
| EBX[12] | LBR_INSERTS_NA | LBR如果1或EAX[31:24] < 13. 插入不可用. | 平台 |
| EBX[31:13] | 准备金 | 预留. |  |

ECX [31:0] FIXED CTR MASK 支持固定计数器位罩. 固定平台

```text
                                                    function performance counter 'i' is supported if          Platform
```

EDX[4:0] NUM FIXED CTR比特'i'是1(第一个对数指数从零开始). 这是平台

```text
                                                    recommended to use the following logic to                 Platform
```

EDX [12:5] FIXED CTR WIDTH 确定是否支持固定计数器 :

```text
                                                    FxCtr[i]_is_supported := ECX[i] || (EDX[4:0] > i);        Platform
```

EDX [14:13] 保留EDX [15] AnythREAD DEPRECATION 从0开始(如果EDX [19:16] SLOTS PER CYC版本ID > 1)的连续固定功能性能计数器数.

EDX [31:20] 保留固定功能性能计数器的位宽(如果版本ID > 1).

Reserved.

从建筑性能监测第5版开始,这个字段表示一个处理器支持AnyThread模式贬值. 如果设置了这个字段,软件可以选择忽略第21章"绩效监测"中的"任意 Thread Counting and Software Evolution"中的准则,在Intel(R)64和IA-32架构软件开发者手册第3B卷中

如果这个字段为非零,则代表每个周期上下微architecture分析(TMA)槽数. 这个数字可以乘以周期数(从CPU_CLK_UNHALTED.THREAD / CPU_CLK_UNHALTED.CORE 或 IA32 FIXED CTR1)来确定槽的总数. 如果此字段为零,则应使用IA32 FIXED CTR3来确定槽的总数.

Reserved.

对于每个版本的建筑性能监测能力,软件必须列举这个叶,以发现处理器中可用的编程设施和建筑性能事件. 详情见第21章"绩效监测",Intel(R)64和IA-32架构软件开发者手册第3C卷.

CPUID.0BH - 扩展地形学

CPUID.0BH 返回扩展地形学的信息 。 CPUID.1FH是叶 0BH的首选超级集. Intel建议先检查叶 1FH的存在,然后再使用叶 0BH. * 如果 CPUID.0BH.00H: EBX [15:0] <> 0 和 MAQQLEAF 0BH,此 叶是有效的.

* 叶无效时,CPUID.0BH.00H:ECX.DOMAIN_TYPE[15:8]将报告域类型ID无效(0). * 子叶被列出,直到子叶 n在EBX[15:0]中返回0. * 如果 ECX 包含无效的 子叶 指数,则 EAX/EBX 返回 0. 子叶指数n+1如果子叶n返回EBX[15:0]为0.

CPUID.0BH -- ECX >= 0

** 叶 0BH 扩展地形**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[4:0] | SHIFT_COUNT | X2APIC ID 的位数必须转移到处理下一个更高范围域实例的右侧. 当处理器不支持逻辑处理器时,逻辑处理器域子叶的这个字段的值可以返回为0(在x2APIC ID中没有分配位)或1(在x2APIC ID中分配位);软件应该相应地计划. | 平台 |
| EAX[31:5] | 准备金 | 预留. |  |
| EBX[15:0] | NEXT_LEVEL_NUM_LP | 所有逻辑处理器的数目 | 逻辑 |
|  |  | 实例。 (例如,在一个包含每个"N"逻辑处理器的"M"核心的处理器套接字/包中,这个字段的"核心"域的子叶值将是M*N. )这个数字反映了英特尔发送的配置. 这个字段还可能包含跨不同逻辑处理器的不对称值,作为支持多个逻辑处理器和只支持一个逻辑处理器的核心的组合实例. 注意,软件不得使用此字段来列举处理器地形. 软件不得使用EBX[15:0]的值来列举系统的处理器地形. 该值仅用于展示和诊断目的. BIOS/OS/applications可用的逻辑处理器的实际数量可能与EBX[15:0]的值不同,取决于软件和平台硬件配置. | 处理器 |
| EBX[31:16] | 准备金 | 预留. |  |
| ECX[7:0] | LEVEL_NUM | 输入的ECX 子叶指数. | 平台 |

ECX [15:8] DOMAIN TYPE 此字段提供了一个识别值,平台表示表格中显示的域. ECX [31:16] Reserved 虽然命令了域,但其指定的逻辑EDX [31:0] X2APIC ID识别值不是,软件处理器不应该依赖它. 请注意,计数值为0和3-255。

Reserved.

此逻辑处理器的 X2APIC ID 。

子叶 of CPUID.0BH描述一个逻辑处理器最小范围域(子叶 index 0)起于Core域(子叶 index 1)至最大范围域(最后一个有效的子叶指数)的有序逻辑处理器的等级,该等级默认从属于处理器包(socket)的未假定最高范围域. 每个有效域的细节由相应的子叶列出. 一个域的细节包括它的类型,以及该域的所有实例如何决定下一个更高范围域的逻辑处理器和x2 APIC ID分区的数量. 等级内域的顺序在建筑上是固定的,如下所示. 对于给定的处理器来说,并非所有域都可能相关或列举;然而,逻辑处理器和核心域总是被列出. 对于两个有效的子叶 N和N+1,子叶 N+1代表了针对给定处理器的子叶 N域的下一个直接更高范围域. 如果子叶指数"N"在ECX [15:08] (00H)中返回无效域类型,那么所有指数大于"N"的子叶也返回无效域类型. A 子叶 返回无效域时,总是在 EAX 和 EBX 中返回 0.

** CPUID.0BH:ECX [15:8] **

| 等级 | 域名 | 域类型 ID 值 |
| --- | --- | --- |
| 无效 | 无效 | 0 |
| 最低 | 逻辑处理器 | 1 |
| ... | 核心 | 2 |
| 最高 | 软件包/软件包 | (音译). |
| 准备金 | 准备金 | 3-255 |
| 21-40卷 第1册. |  |  |
|  | PROCESSOR IDENTIFICATION AND FEATURE | DETERMINATION |
| CPUID.0CH - 保留 |  |  |

CPUID.0CH -- Reserved

注册字段名称表21-33. 叶 0CH 保留域名 EAX [31:0] 保留域名 EBX [31:0] 保留域名 ECX [31:0] 保留域名. EDX [31:0] 预备役. 预留. 预留.

CPUID.0DH - 处理器扩展状态

CPUID.0DH返回XSAVE/XRSTOR区域处理器和存储大小要求中支持的所有处理器状态扩展的位元表示. * 如果 CPUID.01H: ECX.XSAVE[26] = 1 和 MAXLEAF 0DH ,此 叶 有效. * 子叶0和子叶1始终有效;咨询它们,以确定哪些其他子叶存在".CPUID.0DH.n, n>01H-- 状态子叶".

CPUID.0DH.00H - 处理器扩展状态 Main 子叶

CPUID.0DH.00H 返回处理器扩展状态信息 。

** 叶 0DH.00H 处理器扩展状态**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[0] | X87 | x87国道. | 平台 |
| EAX[1] | SSE | SSE 州议会. | 平台 |
| EAX[2] | AVX | AVX 州议会. | 平台 |
| EAX[3] | MPX_BNDREGS | MPX 州议会. | 平台 |
| EAX[4] | MPX_BNDCSR | MPX 州议会. | 平台 |
| EAX[5] | AVX512_OPMASK | AVX-512 Opmask状态. | 平台 |
| EAX[6] | AVX512_ZMM_HI256 | AVX-512 ZMM上层256数据状态. | 平台 |
| EAX[7] | AVX512_HI16_ZMM | AVX-512 上层 16 ZMM 注册状态. | 平台 |
| EAX[8] | N/A | 总是返回 0( 为 IA32QQSS 分配) 。 | 平台 |
| EAX[9] | PKRU | PKRU 州议会. | 平台 |
| EAX[16:10] | N/A | 总是返回 0( 为 IA32QQSS 分配) 。 | 平台 |
| EAX[17] | AMX_TILECFG | TILECFG 州议会. | 平台 |
| EAX[18] | AMX_TILEDATA | TILEDATA 州议会. | 平台 |
| EAX[31:19] | 准备金 | 预留. |  |
| EBX[31:0] | XSAVE_BYTES_ENABLED_FEATURES | 最大大小(字节,从 | 逻辑 |
|  |  | XSAVE/XRSTOR保存区域),由XCR0中启用的特性所需要. 如果未启用 XSAVE 保存区域末端的某些特性,则可能与 ECX 不同. | 处理器 |
| ECX[31:0] | XSAVE_BYTES_SUPPORTED_FEATURES | XSAVE/XRSTOR 最大大小(字节,从 XSAVE/XRSTOR 保存区域开始) 保存处理器中所有支持特性所需的区域,即XCR0中所有有效的比特字段. | 平台 |
| EDX[31:0] | VALID_XCR0_UPPER_32 | 报告XCR0上32位的支持位. XCR0[n+32]只有在EDX[n]为1. | 平台 |

CPUID.0DH.01H - 地物和监督国 子叶

CPUID.0DH.01H 返回特性和主管状态信息 。

** 叶 0DH.01H 处理器扩展状态**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[0] | XSAVEOPT | 如果1,则支持XSAVEOPT. | 平台 |
| EAX[1] | XSAVEC | 如果1,则支持XSAVEC和紧凑形式XRSTOR. | 平台 |
| EAX[2] | XGETBV1 | 如果 1, 用 ECX = 1. 支持 XGETBV 则支持 ECX = 1. | 平台 |
| EAX[3] | XSAVES | 如果1,支持XSAVES/XRSTORS和IA32 XSS. | 平台 |
| EAX[4] | XFD | 如果 1, 支持扩展特性禁用( XFD) 。 | 平台 |
| EAX[31:5] | 准备金 | 预留. |  |
| EBX[31:0] | XSAVES_BYTES_ENABLED_FEATURES | 包含 XSAVE 区域的字节大小 | 逻辑 |
|  |  | XCR0 所启用的所有状态 IA32 SS. 如果 EAX [3] 被列举为 0, EAX [1] 被列举为 1, EBX 则列举了包含 XCR0 所允许的所有状态的 XSAVE 区域大小. 如果 EAX [1] 和 EAX [3] 均被列举为 0, EBX 则列举为 0. | 处理器 |
| ECX[7:0] | N/A | 总是返回 0 (为 XCR0 指定) 。 | 平台 |
| ECX[8] | PT | PT状态. | 平台 |
| ECX[9] | 准备金 | 总是返回 0 (为 XCR0 指定) 。 |  |
| ECX[10] | PASID | PASID 州议会. | 平台 |
| ECX[11] | CET_U | CET 用户状态. | 平台 |
| ECX[12] | CET_S | CET 监督州。 | 平台 |
| ECX[13] | HDC | HDC 州议会. | 平台 |
| ECX[14] | UINTR | UINTR 州议会. | 平台 |
| ECX[15] | LBR | LBR状态(仅用于建筑LBR特征). | 平台 |
| ECX[16] | HWP | HWP 州议会. | 平台 |
| ECX[18:17] | N/A | 总是返回 0 (为 XCR0 指定) 。 | 平台 |
| ECX[31:19] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 准备金 |  |

/ * 子叶 0 和 1 所示的每个支持特性改为大小并抵消 子叶 */ j=2至62

如果(CPUID.0DH.00H:<EDX:EAX>[j] == 1或/使用EDX的64位值:EAX CPUID.0DH.01H:<EDX:ECX>[j] == 1)//使用EDX:ECX Read(CPUID.0DH.j) /检查大小与抵消.

END IF END FOR

** 叶 0DH.子叶 处理器扩展状态**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | COMP_SIZE | 与有效的 子叶 指数 n 相关的扩展状态特性的保存区域的字节大小(来自 EBX 指定的偏移). | 平台 |
| EBX[31:0] | COMP_OFFSET | 从XSAVE/XRSTOR区域开始,此扩展状态组件保存区域的字节中抵消. 此字段报告 0 如果 子叶 索引, n, 不映射到 XCR0 寄存器中的有效位 。 如果ECX包含无效的子叶指数,则EAX/EBX/ECX/EDX返回0. 子叶 n (0 n 31) 如果 子叶 0 在 EAX [n] 中返回 0, 子叶 1 在 ECX [n] 中返回 0,则无效. 子叶 n (32 n 63) 如果 子叶 0 在 EDX [n-32] 中返回 0, 子叶 1 在 EDX [n- 32] 中返回 0,则无效 。 | 平台 |
| ECX[0] | COMP_SUP | 如果在 IA32 XSS MSR 中支持比特n(对应 子叶 指数),则设置此比特;如果比特n 被支持在 XCR0 中是明确的. | 平台 |
| ECX[1] | COMP_64B_ALIGNED | 如果在使用 XSAVE 区域的紧凑格式时, 此扩展状态组件位于前一个状态组件之后的下一个 64 字节边界上( 否则它紧接前一个状态组件) , 则设置此位值 。 | 平台 |
| ECX[2] | COMP_XFD | 此位设定用于表示对 XFD 错误的支持 。 | 平台 |
| ECX[31:3] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |
| 21-44卷 第1册. |  |  |  |

CPUID.0EH -- Reserved

此 叶 保留 。

注册字段名称表 21-37. 叶 0EH 保留域名 EAX [31:0] 保留域名 EBX [31:0] 保留域名 ECX [31:0] 保留域名. EDX [31:0] 预备役. 预留. 预留.

CPUID.0FH - 英特尔(R)资源主管技术(英特尔(R)RDT)监测

CPUID.0FH为英特尔资源总监技术监测能力返回信息. 如下文所述,软件使用子叶 00H在EDX中返回的位向量来确定可监测的可用资源类型(ResID). 这种信息对于软件编程IA32 PQR ASSOC和IA32 M EVTSEL MSR是必需的,这样,在IA32 M CTR MSR之后就可以读取服务质量数据. * 如果 CPUID.07H.00H: EBX.RDT_M[12] = 1 和 MAXLEAF 0FH ,此 叶 有效. * 如果叶是有效的,子叶 00H总是有效的. 子叶 n(n 1)只有在(CPUID.0FH.00H:EDX[n]== 1)时才有效.

CPUID.0FH.00H - 英特尔( R) RDT 监测主 子叶

CPUID.0FH.00H返回关于Intel RDT Monitoring的信息.

** 叶 0FH.00H Intel(R)资源主任技术(Intel(R)RDT)监测**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | 准备金 | 预留. |  |
| EBX[31:0] | MAX_RMID | 在所有类型物理处理器中 RMID 的最大范围(零基) 。 | 平台 |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[0] | 准备金 | 预留. |  |
| EDX[1] | L3_MON | 如果 1, 支持 L3 Cache Intel RDT 监控. 子叶指数0报告以EDX的位位置1开始的有效资源类型. | 平台 |
| EDX[31:2] | 准备金 | 预留. |  |

** 叶 0FH.01H Intel(R)资源主任技术(Intel(R)RDT)监测**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[7:0] | CTR_WIDTH | 柜台宽度编码为24b。 此字段的值为0,表示支持24位计数器. 这个字段的值为8,表示支持32位计数器. | 平台 |
| EAX[8] | RDT_M_OVF | 如果 1, 支持 IA32QQM  CTR MSR (bit 61) 中的溢出位 。 | 平台 |
| EAX[9] | IO_RDT_CMT | 如果 1 ,则表示存在支持Intel RDT CMT的非CPU代理. | 平台 |
| EAX[10] | IO_RDT_MBM | 如果 1, 表示支持Intel RDT MBM支持的非CPU代理的存在. | 平台 |
| 21-46卷 第1册. |  |  |  |
|  | PROCESSOR IDENTIFICATION AND FEATURE | DETERMINATION |  |

EAX [31:11] 预备役.                                      EBX平台 [31: 0] CONV FACTOR

```text
                          Factor used to convert from reported           Platform
```

ECX [31:0] MAX RMID L3 IA32 QM CTR 到衍生占用平台值

```text
                          metric (bytes) and Memory Bandwidth            Platform
```

EDX[0] CMT L3 OCCUP 监测(MBM) 度量衡.                      平台 EDX [1] MBM L3 TOTAL EDX [2] MBM L3 LOCAL 本 EDX中RMID的最大范围(零基) [31:3] 储量资源类型.

如果1,支持L3占用监测.

如果1,支持L3总带宽监测.

如果1,支持L3局部带宽监测.

Reserved.

CPUID.10H - 英特尔(R)资源主任技术(英特尔(R)RDT)配置

CPUID.10H返回Intel资源总监技术分配的信息. 当 CPUID.07H.00H: EBX.RDT_A[15] = 1. 此 叶 有效 。 如下文所述,软件使用子叶00H返回的EBX中的位矢量来确定处理器中支持的现有QoS执行(分配)资源类型. 这种信息对于软件在QoS Mask 注册,IA32 resourceType Mask n中使用能力位口罩来配置每类服务是必要的. * 如果 CPUID.07H.00H: EBX.RDT_A[15] = 1 和 MAXLEAF 10H ,此 叶 有效. * 如果叶是有效的,子叶 00H总是有效的. 子叶 n(n 1)只有在(CPUID.10H.00H:EBX[n]== 1)时才有效.

CPUID.10H.00H - 英特尔( R) RDT 分配主 子叶

CPUID.10H.00H返回关于Intel RDT分配的信息.

** 叶 10H.00H Intel(R)资源主任技术(Intel(R) RDT)分配**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | 准备金 | 预留. |  |
| EBX[0] | 准备金 | 预留. |  |
| EBX[1] | CAT_L3 | 如果 1, 支持 L3 缓存分配技术 。 子叶指数0报告以EBX的位位置1开始的有效资源识别(ResID). | 平台 |
| EBX[2] | CAT_L2 | 如果 1, 支持 L2 缓存分配技术 。 | 平台 |
| EBX[3] | MBA | 如果 1, 支持记忆带宽分配 。 | 平台 |
| EBX[4] | 准备金 | 预留. |  |
| EBX[5] | CBA | 如果 1, 支持缓存 Bandwidth 分配 。 | 平台 |
| EBX[6] | RESOURCE_PRIORITY | 如果 1, 支持资源优先级 。 | 平台 |
| EBX[31:7] | 准备金 | 预留. |  |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |

** 叶 10H.01H Intel(R)资源主任技术(Intel(R) RDT)分配**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[4:0] | CAT_L3_BITMASK_LENGTH | 相应的ResID 容量比特掩码的长度 。 在返回值中添加一个以获取结果 。 | 平台 |
| EAX[31:5] | 准备金 | 预留. |  |
| EBX[31:0] | CAT_L3_CONTENTION | 隔离/保留分配单位的位角图。 | 平台 |
| 21-48卷 第1册. |  |  |  |

ECX[0] 预备役.                                       ECX平台 [1] CAT L3 NONCPU平台 ECX [2] CAT L3 CDP If 1,支持非CPU代理的L3 CAT.       平台

ECX[3] CAT L3 NONCONTIG 如果1,支持L3代码和数据优先化平台技术. ECX [31:4] 保留EDX [15:0] CAT L3 MAQQCLOS If 1,支持非毗连容量比特马斯克. 在各种 EDX [31:16] 保存的 IA32 L3 MASK n 登记簿中设置的位点不必毗连.

Reserved.

此ResID 所支持的最高服务类别( COS) 编号 。

Reserved.

CPUID.10H.02H - L2 缓存分配技术

CPUID.10H.ResID=2返回关于L2缓存分配技术的信息.

** 叶 10H.02H Intel(R)资源主任技术(Intel(R) RDT)分配**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[4:0] | CAT_L2_BITMASK_LENGTH | 相应的ResID 容量比特掩码的长度 。 在返回值中添加一个以获取结果 。 | 平台 |
| EAX[31:5] | 准备金 | 预留. |  |
| EBX[31:0] | CAT_L2_CONTENTION | 隔离/保留分配单位的位角图。 | 平台 |
| ECX[1:0] | 准备金 | 预留. |  |
| ECX[2] | CAT_L2_CDP | 如果1,支持L2代码和数据优先化技术. | 平台 |
| ECX[3] | CAT_L2_NONCONTIG | 如果 1, 支持非连接容量比特马斯. 各种 IA32 L2 MASK n 登记簿中设置的位点不必毗连 。 | 平台 |
| ECX[31:4] | 准备金 | 预留. |  |
| EDX[15:0] | CAT_L2_MAX_CLOS | 此ResID 所支持的最高服务类别( COS) 编号 。 | 平台 |
| EDX[31:16] | 准备金 | 预留. |  |

** 叶 10H.03H Intel(R)资源主任技术(Intel(R) RDT)分配**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[11:0] | MBA_MAX | 报告相应的ResID所支持的最大 MBA 节流值 。 在返回值中添加一个以获取结果 。 | 平台 |
| EAX[31:12] | 准备金 | 预留. |  |

EBX [31:0] 预备役.                                           ECX[0]平台支持PER THREAD MBAper-thread MBA控件.              ECX平台[1] 保留保留.                                           ECX平台[2] MBA LINEAR 如果 1,延迟值的反应是线性的. ECX [31:3] 预备役. EDX [15:0] MBA MAX CLOS 最高服务级(COS)编号支持此ResID. EDX [31:16] 预备役.

CPUID.10H.05H - 快取带宽分配

** 叶 10H.05H Intel(R)资源主任技术(Intel(R) RDT)分配**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[7:0] | CBA_MAX_LEVELS | 报告支持相应ResID的最大核心节流水平。 在返回值中添加一个以获得对节流电位数的支持 。 | 平台 |
| EAX[11:8] | BW_SCOPE | 如果 1,则表示IA32 QoS Core BW Thrtl n MSRs的逻辑处理器范围. 其他数值保留。 | 平台 |
| EAX[31:12] | 准备金 | 预留. |  |
| EBX[31:0] | 准备金 | 预留. |  |
| ECX[2:0] | 准备金 | 预留. |  |
| ECX[3] | CBA_LINEAR | 如果1,带宽控制的反应大约是线性. 如果 0,则带宽控制的反应为非线性. | 平台 |
| ECX[31:4] | 准备金 | 预留. |  |
| EDX[15:0] | CBA_MAX_CLOS | 此ResID 所支持的最高服务类别( COS) 编号 。 | 平台 |
| EDX[31:16] | 准备金 | 预留. |  |
| CPUID.10H.06H - | - 资源优先控制 |  |  |

** 叶 10H.06H Intel(R)资源主任技术(Intel(R) RDT)分配**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[0] | THREAD_ENABLE | 如果 1, 通过 IA32 RES ources PRIORITY MSR 支持 RP 的每行启用. | 平台 |
| EAX[1] | PACKAGE_ENABLE | 如果 1, 通过 IA32 RES 资源优先级 PKG MSR 支持物理处理器包启用 RP. | 平台 |
| EAX[31:2] | 准备金 | 预留. |  |
| EBX[31:0] | 准备金 | 预留. |  |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |
| 21-50卷 第1册. |  |  |  |

CPUID.11H -- Reserved

此 叶 保留 。

注册字段名称表21-46. 叶 11H 保留域名 EAX [31:0] 保留域名 EBX [31:0] 保留域名 ECX [31:0] 保留域名. EDX [31:0] 预备役. 预留. 预留.

CPUID.12H - Intel(R)软件守护扩展(Intel(R)SGX)能力

CPUID.12H返回关于Intel(R)SGX能力的信息. 详见Intel(R)64和IA-32架构软件开发者手册第35章"Intel(R)软件卫士扩展介绍"和第36章"Clave Access Control and Data Structures",第3D卷. * 此 叶 在 CPUID.07H.00H: EBX.SGX[2] = 1 和 MAQQLEAF 12H 时有效. * 如果叶子有效,子叶00H和01H总是有效的. 子叶 n(n2)只有在CPUID.12H.n:EAX[3:0] != 0时才有效.

CPUID.12H.00H - 英特尔( R) SGX 主力子叶

CPUID.12H.00H返回关于Intel(R)SGX能力的信息. 只有在CPUID.07H.00H:EBX.SGX=1.

** 叶 12H.00H Intel(R)软件护卫扩展(Intel(R)SGX)能力**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[0] | SGX1 | 如果 1,支持收集 SGX1 叶 函数. | 平台 |
| EAX[1] | SGX2 | 如果 1,支持收集 SGX2 叶 函数. | 平台 |
| EAX[6:2] | 准备金 | 预留. |  |
| EAX[7] | EVERIFYREPORT2 | 如果 1,支持 ENCLU 指令 叶 EVERIFYREPORT2. | 平台 |
| EAX[9:8] | 准备金 | 预留. |  |
| EAX[10] | EUPDATESVN | 如果 1,支持 ENCLS 指令 叶 EUPDATESVN. | 平台 |
| EAX[11] | EDECCSSA | 如果 1,支持 ENCLU 指令 叶 EDECCSSA. | 平台 |
| EAX[31:12] | 准备金 | 预留. |  |
| EBX[31:0] | MISCSELECT | 支持扩展的 SGX 特性的位向量 。 MISCSELECT的定义可见于Intel(R)64和IA-32架构软件开发者手册第36.7.2节"SECS.MISCSELECT Field",Volume 3D. | 平台 |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[7:0] | MAX_ENCLAVE_SIZE_NOT_64 | 非64位模式下支持的最大飞地大小为2^(EDX[7:0]). | 平台 |
| EDX[15:8] | MAX_ENCLAVE_SIZE_64 | 64位模式中最大支持的飞地大小为2^(EDX[15:8]). | 平台 |
| EDX[31:16] | 准备金 | 预留. |  |
| CPUID.12H.01H - | - 英特尔(R) SGX 属性 |  |  |

** 叶 12H.01H Intel(R)软件护卫扩展(Intel(R)SGX)能力**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| 21-52卷 第1册. |  |  |  |
|  |  | PROCESSOR IDENTIFICATION AND FEATURE | DETERMINATION |

EAX [31: 0] ECREATE SECS ATRIBUTES 31 0 报告平台的有效位点

```text
                                            SECS.ATTRIBUTES[31:0] that software can set     Platform
```

EBX [31:0] ECREATE SECS ATTRIBUTES 63 32 与ECREATE.                                   平台ECX[31:0] ECREATE SECS ATTRIBUTES 95 64 报告SECS.ATTRIBUTES[63:32]的有效位元,软件可以设置EDX[31:0] ECREATE SECS ATTRIBUTES 127 96 与ECREATE.

报告软件可以用ECREATE设置的SECS.ATTRIBUTES[95:64]的有效位.

报告软件可以用ECREATE设置的SECS.ATTRIBUTES[127:96]的有效位.

属性的定义可见于Intel(R)64和IA-32架构软件开发者手册第36.7.1节,"ATTRIBUTES"第3D卷.

CPUID.12H - n2 - Intel( R) SGX 飞地页面缓存

CPUID.12H with ECX2 返回关于Intel(R) SGX Enclave Page Cache的信息,如果CPUID.07H.00H:EBX.SGX=1. 对于子叶其中的ECX2,EAX[31:4],EBX,ECX,以及EDX的定义取决于以下列出的子叶类型.

子叶 编码类型 EAX [3:0] = 0000b (无效)

此 子叶 无效 。 EDX:ECX:EBX:EAX返回0.

CPUID.12H - 子叶 编码类型 EAX [3:0] = 0001b

此 子叶 列举了 EPC 段,其中 EDX: ECX, EBX: EAX 定义如下.

**Leaf 12H.SUB-LEAF ENCODING TYPE EAX[3:0]=0001B Intel(R)软件护卫扩展(Intel(R) SGX)**.

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[3:0] | SUB_LEAF_TYPE | 值为0001b. | 平台 |
| EAX[11:4] | 准备金 | 预留. |  |
| EAX[31:12] | EPC_SECTION_ADDR_31_12 | EPC段基部物理地址的位数31:12. | 平台 |
| EBX[19:0] | EPC_SECTION_ADDR_51_32 | EPC段基部物理地址的位数51:32. | 平台 |
| EBX[31:20] | 准备金 | 预留. |  |

ECX [3:0] EPC SECTION PROPERTY EPC 路段属性编码定义,如下平台:

```text
                                                    0000b  All bits in EDX:ECX are enumerated as
```

0.

```text
                                                    0001b  This section has confidentiality,
```

正直,并重放保护。

```text
                                                    0010b  This section has confidentiality
```

只有保护。

0011b - 本节具有保密性和完整性保护. 所有其他编码都保留下来.

ECX [11:4] 预备役. ECX [31:12] EPC SECTION SIZE 31 12 比特31:12 处理器保留内存中对应的EPC平台部分大小.

EDX [19:0] EPC SECTION SIZE 51 32 比特 51:32 处理器保留内存中对应的EPC平台部分大小.

EDX [31:20] 预备役.

CPUID.13H -- Reserved

此 叶 保留 。

注册字段名称表21-50. 叶 13H 保留域名 EAX [31:0] 保留域名 EBX [31:0] 保留域名 ECX [31:0] 保留域名. EDX [31:0] 预备役. 预留. 预留.

CPUID.14H - Intel( R) 处理器追踪( Intel( R) PT)

CPUID.14H返回关于Intel(R)处理器追踪(PT)的信息. CPUID.14H.00H返回关于英特尔处理器 Trace扩展的信息. CPUID.14H.n(n > 0,小于CPUID.14H.00H:EAX中的非零位数)在Intel处理器 Trace中返回关于数据包生成的信息. 关于英特尔PT的更多详情,参见第34章"英特尔(R)处理器追踪",见英特尔(R)64和IA-32架构软件开发者手册,第3D卷. * 此 叶 在 CPUID.07H.00H: EBX.INTEL_PROC_TRACE[25] = 1 和 MAQQLEAF 14H 时有效. * 子叶最大值ECX在CPUID.14H.00H.EAX[31:0] MAQSUBLEAF中指定. * 如果ECX包含无效的子叶指数,则EAX/EBX/ECX/EDX返回0. 如果 n 超过 子叶 0 在 EAX 中返回的值,则 子叶 指数 n 无效.

CPUID.14H.00H - 英特尔( R) PT Main 子叶

CPUID.14H.00H返回关于英特尔处理器 Trace扩展的信息.

** 叶 14H.00H Intel(R)处理器追踪(Intel(R)PT)**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | 报告14H叶中支持的最大亚叶. | 平台 |
| EBX[0] | CR3_FILTER | 如果1,支持IA32_RTIT_CTL.CR3Filter可以设置为1,并且可以访问IA32 RTIT CR3 MATCH MSR. | 平台 |
| EBX[1] | CYC_ACC | 如果 1, 支持可配置的 PSB 和 Cycle - 精确模式 。 | 平台 |
| EBX[2] | IP_FILTER | 如果 1, 支持 IP 过滤, Trace stop 过滤, 并保存 英特尔 PT MSR 跨越温暖重置. | 平台 |
| EBX[3] | MTC | 如果 1, 支持 MTC 计时包和压制基于 COFI 的包 。 | 平台 |
| EBX[4] | PTWRITE | 如果1,则支持PTWRITE. 写作可以设置IA32 RTIT CTL[12](PTWEN)和IA32 RTIT CTL[5](FUPonPTW),PTWRITE可以生成包. | 平台 |
| EBX[5] | PWR_EVT_TRACE | 如果 1, 支持 Power Event Trace 。 写入可以设置 IA32 RTIT CTL[4] (PwrEvtEn),允许 Power Event Track 包生成. | 平台 |
| EBX[6] | PMI_PRESERVE | 如果1,支持PSB和PMI保存. 写作可以设置IA32 RTIT CTL[56](InjectPsbPmiOnEn-capaly),使处理器可以设置IA32 RTIT STATUS[7](PendTopapMI)和/或IA32 RTIT STATUS[6](PendPSB),以保存由于Intel PT禁用而在其他方面丢失的TOPA PMI和/或PSB. 写作还可以设置PendTOPAPMI和PendPSB. | 平台 |
| EBX[7] | EVENT_TRACE | 如果 1, 支持该写入可以设置 IA32  RTIT  CTL[31] (EventEn), 允许事件追踪包生成 。 | 平台 |
| EBX[8] | TNT_DIS | 如果 1, 支持该写入可以设置 IA32  RTIT  CTL[55] (DSTNT), 使 TNT 数据包生成失效 。 | 平台 |
| 21-56卷 第1册. |  |  |  |

EBX [9] PTTT 如果 1, 处理器追踪触发跟踪 (PTTT) 是平台

```text
                                       supported.                                         Platform
```

EBX [31:10] 保留ECX [0] 保留TOPAOUT.                                          平台

ECX [1] MENTRY 如果 1, 支持可以使用平台进行追踪

```text
                                       IA32_RTIT_CTL.ToPA = 1, hence utilizing the        Platform
```

ECX[2] SNGL RNG OUT TOPA输出方案;                                逻辑 ECX [3] TRACE TRANSPORT SUBSYSTEM IA32 RTIT UTPUT BASE和处理器 IA32 RTIT OUPUT MASK PTRS MSRs可以是ECX[30:4] 保留访问. ECX[31] LIP If 1,支持TOPA表格可以持有任何EDX[31:0] 输出项保留数量,以IA32 RTIT UTPUT MASK PTRS的MaskOrTableOffset域允许的最大数量为限.

如果1,支持单程输出计划.

如果 1, 支持输出到 Trace Transport 子系统.

Reserved.

如果 1, 包含 IP 有效载荷的生成包包含 LIP 。 如果 0 , 包含 IP 有效 IP 有效 IP 的生成包 。 使用平面内存模型的跟踪片段会生成相同的信息,无论逻辑处理器自LIP=EIP以来如何报告这一值.

Reserved.

CPUID.14H.01H - 特性信息 子叶

CPUID.14H.01H在Intel处理器 Trace中返回关于数据包生成的信息.

** 叶 14H.01H Intel(R)处理器追踪(Intel(R)PT)**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[2:0] | RANGECNT | 可配置过滤地址区域的数目 。 | 平台 |
| EAX[7:3] | 准备金 | 预留. |  |
| EAX[10:8] | TRIGGER_CFG_CNT | 编号为IA32 RTIT TRIGERx CFG MSR. 支持的触发数是 4x 此值 。 | 平台 |
| EAX[15:11] | 准备金 | 预留. |  |
| EAX[31:16] | MTC_RATE | 支持的 MTC 周期编码的位图 。 | 平台 |
| EBX[15:0] | CYC_THRESHOLDS | 支持的循环阈值编码的位图 。 | 平台 |
| EBX[31:16] | PSB_RATE | 支持的配置 PSB 频率编码的位图 。 | 平台 |
| ECX[0] | ICNT | 如果 1, 则支持触发动作 EN  ICNT 。 | 平台 |
| ECX[1] | TRIGGER_PAUSE | 如果 1, 则支持触发动作 TRACE  PAUSE 和TRACE  RESUME 。 | 平台 |
| ECX[14:2] | 准备金 | 预留. |  |

ECX[15] TRIGGER DR MATCH 如果1,则支持触发输入 DR匹配.  ECX平台[31:16] 预留. EDX [31:0] 预备役.

CPUID.15H - 时间印记计数器和名义核心晶体钟

CPUID.15H返回时间印记计数器和名义核心水晶时钟的信息. * 此 叶 如果 MAQQLEAF 15H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 15H 时间印记柜台和名义核心晶体钟**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | DENOMINATOR | 无符号整数,是 TSC/"核心晶钟"比例的分母。 | 平台 |
| EBX[31:0] | NUMERATOR | 无符号整数是 TSC / "核心晶钟" 比例的数值。 如果 0,则不列出TSC/"核心晶钟"比例. | 平台 |
| ECX[31:0] | NOMINAL_ART_FREQUENCY | 无符号整数,是赫兹核心晶钟的标称频率. 如果 0,则不列出标称的核心晶钟频率. 注意,核心晶时钟可能与参考时钟,总线时钟或核心时钟频率不同. | 平台 |
| EDX[31:0] | 准备金 | 预留. |  |

CPUID.16H - 处理器频率信息

CPUID.16H返回处理器频率信息. 数据按照处理器的规格从此接口返回,不反映实际值. 这些数据的适当使用包括以类似处理器品牌字符串的方式显示处理器信息,以及用于确定在显示处理器信息时使用的适当范围,例如频率历史图. 返回的信息不应用于任何其他目的,因为返回的信息与其他处理器接口返回的信息/计数器没有准确关联。 虽然处理器可能支持处理器频率信息叶,但返回值为0的字段不支持. * 此 叶 如果 MAQQLEAF 16H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 16H 处理器频率信息**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[15:0] | PROCESSOR_BASE_FREQUENCY | 处理器基频 (兆赫). | 逻辑处理器 |
| EAX[31:16] | 准备金 | 预留. |  |
| EBX[15:0] | MAXIMUM_FREQUENCY | 最大频率 (MHz). | 逻辑处理器 |
| EBX[31:16] | 准备金 | 预留. |  |
| ECX[15:0] | BUS_FREQUENCY | 客车(参考)频率(MHz). | 逻辑处理器 |
| ECX[31:16] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |
| 21-60卷 第1册. |  |  |  |

CPUID.17H - 系统对接芯片供应商属性

CPUID.17H返回 System-on-Chip 供应商属性信息. * 如果 CPUID.17H.00H: EAX [31:0] (MaxSOCID Index) 3 和 MAQQLEAF 17H,此 叶是有效的. * 子叶的最大值ECX在CPUID.17H.00H.EAX[31:0] MaxSOCID Index中指定. * 如果ECX包含无效的子叶指数,则EAX/EBX/ECX/EDX返回0. 如果 n 超过 子叶 0 在 EAX 中返回的值,则 子叶 指数 n 无效.

CPUID.17H.00H - 主用 子叶

CPUID.17H.00H返回 System-on-Chip 供应商属性信息.

** 叶 17H.00H 系统对芯片供应商属性**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SOCID_INDEX | 报告支持的 子叶 在 叶 17H 中的最大输入值. | 平台 |
| EBX[15:0] | SOC_VENDOR_ID | SOC 供应商身份证明. | 平台 |
| EBX[16] | IS_VENDOR_SCHEME | 如果 1, SOC 供应商识别字段通过行业标准计数计划分配. 否则,SOC供应商ID域由英特尔指定. | 平台 |
| EBX[31:17] | 准备金 | 预留. |  |
| ECX[31:0] | PROJECT_ID | 一个SOC供应商为其SOC项目分配了一个独特的编号。 | 平台 |
| EDX[31:0] | STEPPING_ID | SOC项目中一个独特的编号,由SOC供应商指定. | 软件包 |

** 叶 17H.01H 系统对芯片供应商属性**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | VENDOR_BRAND_STRING_BYTES_0_to_3 | SOC 销售商品牌字符串. UTF-8 编码字符串. | 平台 |
| EBX[31:0] | VENDOR_BRAND_STRING_BYTES_4_to_7 | SOC 销售商品牌字符串. UTF-8 编码字符串. | 平台 |
| ECX[31:0] | VENDOR_BRAND_STRING_BYTES_8_to_11 | SOC 销售商品牌字符串. UTF-8 编码字符串. | 平台 |
| EDX[31:0] | VENDOR_BRAND_STRING_BYTES_12_to_15 | SOC 销售商品牌字符串. UTF-8 编码字符串. | 平台 |

** 叶 17H.02H 系统对芯片供应商属性**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | VENDOR_BRAND_STRING_BYTES_16_to_19 | SOC 销售商品牌字符串. UTF-8 编码字符串. | 平台 |
| EBX[31:0] | VENDOR_BRAND_STRING_BYTES_20_to_23 | SOC 销售商品牌字符串. UTF-8 编码字符串. | 平台 |

ECX [31:0] VENDOR BRAND String BYTES 24 to 27 SOC 供应商品牌字符串. UTF-8 编码字符串. EDX平台 [31:0] VENDOR BRAND String BYTES 28 to 31 SOC 供应商品牌字符串. UTF-8 编码字符串. 平台

CPUID.17H.03H - 销售商品牌 String 子叶(32至47字节)

** 叶 17H.03H 系统对芯片供应商属性**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | VENDOR_BRAND_STRING_BYTES_32_to_35 | SOC 销售商品牌字符串. UTF-8 编码字符串. | 平台 |
| EBX[31:0] | VENDOR_BRAND_STRING_BYTES_36_to_39 | SOC 销售商品牌字符串. UTF-8 编码字符串. | 平台 |
| ECX[31:0] | VENDOR_BRAND_STRING_BYTES_40_to_43 | SOC 销售商品牌字符串. UTF-8 编码字符串. | 平台 |
| EDX[31:0] | VENDOR_BRAND_STRING_BYTES_44_to_47 | SOC 销售商品牌字符串. UTF-8 编码字符串. | 平台 |

** 叶 17H.M>MAXSOCID INDEX-RESERVED 子叶 系统对芯片供应商属性**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | 准备金 | 准备金 |  |
| EBX[31:0] | 准备金 | 准备金 |  |
| ECX[31:0] | 准备金 | 准备金 |  |
| EDX[31:0] | 准备金 | 准备金 |  |
| 21-62卷 第1册. |  |  |  |

CPUID.18H - 决定地址翻译参数

CPUID.18H 返回关于定时地址翻译参数的信息. 每个子叶列出不同的地址翻译结构. * 如果 CPUID.18H.00H: EAX [31:0] <> 0 和 MAQQLEAF 18H,此 叶是有效的. * 子叶最大值ECX在CPUID.18H.00H.EAX[31:0] MAQSUBLEAF中指定. * 如果ECX包含无效的子叶指数,则EAX/EBX/ECX/EDX返回0. 如果 n 超过 子叶 0 在 EAX 中返回的值,则 子叶 指数 n 无效. 如果 EDX [4:0] 返回 0,则 子叶 索引也无效. * 有效的子叶不需要毗连或任何特定的顺序. 有效的子叶在输入值ECX中可能高于无效的子叶,或高于高或低级结构的有效子叶.

CPUID.18H.00H - 主用 子叶

确定地址翻译参数 Main 叶

** 叶 18H.00H 决定地址翻译参数**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | 报告所支持的最大输入值 | 逻辑 |
|  |  | 子叶 in 叶 18H. 中国植物物种信息数据库. | 处理器 |
| EBX[31:0] | 准备金 | 预留. |  |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[4:0] | TYPE | 将永远返回0。 | 逻辑处理器 |
| EDX[31:5] | 准备金 | 预留. |  |

** 叶 18H.ECX >= 1 决定地址翻译参数**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | 准备金 | 预留. |  |
| EBX[0] | 4KB_ENTRIES | 如果 1, 在此支持 4K 页面大小条目 | 逻辑 |
|  |  | 结构。 | 处理器 |
| EBX[1] | 2MB_ENTRIES | 如果 1, 在此支持 2MB 页面大小条目 | 逻辑 |
|  |  | 结构。 | 处理器 |
| EBX[2] | 4MB_ENTRIES | 如果 1, 在此支持 4MB 页面大小条目 | 逻辑 |
|  |  | 结构。 | 处理器 |
| EBX[3] | 1GB_ENTRIES | 如果 1, 在此支持 1 GB 页面大小条目 | 逻辑 |
|  |  | 结构。 | 处理器 |
| EBX[7:4] | 准备金 | 预留. |  |
| EBX[10:8] | PARTITIONING | 分区( 0: 软分区) | 逻辑 |
|  |  | 共享此结构的逻辑处理器). | 处理器 |
| EBX[15:11] | 准备金 | 预留. |  |
| EBX[31:16] | NUM_WAYS | W = 结社方式。 | 逻辑处理器 |
| ECX[31:0] | NUM_SETS | S = 套数。 | 逻辑处理器 |

EDX[4:0] TYPE 00000b: Null( 指示此 子叶 不为逻辑

```text
                                                    valid).                                           Processor
```

EDX [7: 5] LEVEL NUM0001b: (中文(简体) ). 数据TLB.

```text
                                                    00010b: Instruction TLB.                          Logical
```

EDX[8] Fullly ASSOC 00011b : (中文(简体) ). 统一 TLB.1 处理器

```text
                                                    00100b: Load Only TLB. Hit on loads; fills on     Logical
```

EDX [13:9] 预留了负载和仓库.                            处理器 EDX [25:14] MAX LP Adressible IDS 00101b: 只存储 TLB 。 点击商店; 输入逻辑

```text
                                                    stores.                                           Processor
```

所有其他编码都保留下来. EDX [31:26] Reserved 一些统一的TLB将允许单TLB条目满足读/写和指令获取的数据. 其他则需要单独的条目(例如,一个在读/写数据上加载,另一个在指令获取上加载). 特定产品的细节见Intel(R)64和IA-32架构优化参考手册.

翻译缓存级别(始于 1).

完整的关联结构.

Reserved.

共享此翻译缓存的逻辑处理器的最大可地址ID数 。 在返回值中添加一个以获取结果 。

Reserved.

CPUID.19H -- Key Locker

CPUID.19H返回Key Locker信息. * 如果 CPUID.07H.00H: ECX.KEY_LOCKER[23] = 1 和 MAXLEAF 19H ,此 叶 有效. * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

**Leaf 19H Key Locker**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[0] | CPL0_RESTRICT | 如果 1, 支持 Key Locker 限制 CPL0- only. | 平台 |
| EAX[1] | NO_ENCRYPT_RESTRICT | 如果 1, 支持 Key Locker 对无加密的限制 。 | 平台 |
| EAX[2] | NO_DECRYPT_RESTRICT | 如果 1, 支持 Key Locker 无解密限制 。 | 平台 |
| EAX[31:3] | 准备金 | 预留. |  |
| EBX[0] | AESKLE | 如果 1, AES Key Locker 指令是完整的 | 逻辑 |
|  |  | 启用 。 CPUID.19H:EBX.AESKLE[0]被列举为1,如果AES键洛克尔指令已被系统固件激活,CR4.KL[bit 19]=1. 软件可以在设置 CR4.KL 后检查此位,以确定AES Key Locker 指令是否已启用. 请注意,一些处理器可能允许在不通过系统固件激活的情况下启用这些指令。 一些处理器可能不支持在系统管理-mode(SMM)中使用AES Key Locker指令. 这些处理器将 CPUID.19H:EBX.AESKLE[0] 列出为 SMM 的 0,而不论CR4.KL的设置如何. | 处理器 |
| EBX[1] | 准备金 | 预留. |  |
| EBX[2] | AES_WIDE | 如果 1, 支持 AES 宽 Key Locker 指令 。 | 平台 |
| EBX[3] | 准备金 | 预留. |  |
| EBX[4] | IWKEYBACKUP | 如果1,支持Key Locker MSR(IA32 COPY LOCAL TO PLATFORM,IA23 COPY PLATFORM TO LOCAL,IA32 COPY STATUS,IA32 IWKEYBACKUP STATUS),支持内部的包装密钥. | 平台 |
| EBX[31:5] | 准备金 | 预留. |  |
| ECX[0] | NOBACKUP | 如果 1, 支持 LOADIWKEY.1 的 NoBackup 参数 | 平台 |
| ECX[1] | RAND_IWKEY | 如果 1, 支持 1 的密钥源编码( 内部 包装密钥 的随机化) 1 。 | 平台 |
| ECX[31:2] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |

CPUID.1AH - 原生型号 ID 编号

CPUID.1AH返回原生型号ID信息. 这个叶存在于混合包中的所有逻辑处理器上,它也可能存在于其他处理器配置中. * 如果 CPUID.1AH.00H: EAX [31:0] <> 0 和 MAQQLEAF 1AH,此 叶是有效的. * 唯一有效的子叶是0,ECX必须设置为0.

** 叶 1AH 原生型号 ID 编号**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[23:0] | CORE_NATIVE_MODEL_ID | 可使用核心类型和本地模式ID | 逻辑 |
|  |  | 以唯一识别核心的微结构化。 这种原产地型号ID在核心类型中并不独特,与CPUID.01H中报告的型号ID无关,也不识别SOC. | 处理器 |
| EAX[31:24] | CORE_TYPE | 10H : (英语). 准备金 | 逻辑 |
|  |  | 20H : (英语). 英特尔( R) 原子( R) 30H : 保留 40H : Intel(R) Core 核心类型只能用作这个逻辑处理器的微结构图的识别,其数值没有意义,无论大小. 这个字段既不意味着也不表示这个逻辑处理器的任何其他属性,软件也不应该假设任何属性. | 处理器 |
| EBX[31:0] | 准备金 | 预留. |  |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |
| 21-66卷 第1册. |  | PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION |  |

CPUID.1BH - PCONFIG 信息

CPUID.1BH - 全部 子叶 输出注册格式

CPUID.1BH返回PCONFIG能力的信息. 按 ECX 的值选择的 子叶 中列出此信息(从 0 开始). * 如果 CPUID.07H.00H: EDX.PCONFIG[18] = 1 和 MAXLEAF 1BH ,此 叶 有效. * 子叶被列举到子叶 n,EAX [11:0] 返回 0.

注册字段名称表21-64. 叶 1BH PCONFIG 信息域名 EAX [11:0] SUB LEAF TYPE平台 EAX [31:12] 预留说明 EBX [31:0] 预留0 (无效) ECX [31:0] 预留. EDX [31:0] 预备役. 预留. 预留.

CPUID.1BH的每个子叶在EAX中列举了它的子叶类型. 如果子叶类型为0,则子叶无效,在EBX,ECX,和EDX中返回0. 在这种情况下,所有后来的子叶(由较大的输入值ECX选择)也是无效的. 目前唯一定义的有效子叶类型是1,表示子叶为PCONFIG指令列举了目标标识符. 在 EBX, ECX, 或 EDX 中返回的任何非零值, 都表示 PCONFIG 指令的有效目标标识符( 任何值为零, 应忽略) 。 目前唯一定义的目标标识符是1,表示TME-MK. 详见Intel(R)64和IA-32架构软件开发者手册第2B卷第4章中的"PCONFIG-Platform配置"指令.

CPUID.1BH.OUTPUT REGISTERS FOR SUB-LEAVE TYPE TARGET IDENTIFIER (1) - 副遗留类型目标识别器输出记录 (1)

**叶 1BH.OUTPUT REGISTERS FOR SUB-LEAVE TYPE TARGET IDENTIFIER (1) PCONFIG资料**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[11:0] | SUB_LEAF_TYPE | 1 (目标标识符) | 平台 |
| EAX[31:12] | 准备金 | 预留. |  |
| EBX[31:0] | TARGET_IDENTIFIER_1 | 目标标识符 | 平台 |
| ECX[31:0] | TARGET_IDENTIFIER_2 | 目标标识符 | 平台 |
| EDX[31:0] | TARGET_IDENTIFIER_3 | 目标标识符 | 平台 |

CPUID.1CH - 最后分支记录 (LBR) 信息

CPUID.1CH返回关于建筑最后分支记录(LBR)的信息. 关于LBR的详细情况,参见第20章"最后一分支记录",见Intel(R)64和IA-32架构软件开发者手册,第3B卷. * 如果 CPUID.07H.00H: EDX.ARCH_LBRS[19] = 1 和 MAXLEAF 1CH ,此 叶 有效. * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 1CH 最后分支记录(LBR)信息**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[7:0] | LBR_DEPTH_VALUES | 对于此字段中的每个位 n , 支持 IA32_LBR_DEPTH.DEPTH 值 8*(n+1) 。 | 平台 |
| EAX[29:8] | 准备金 | 预留. |  |
| EAX[30] | DEEP_C_STATE_RESET | 如果 1 , 支持在 MWAIT 上清除 LBR , 请求的 C 状态数值大于 C1 。 | 平台 |
| EAX[31] | IP_VALUES_CONTAIN_LIP | 如果 1, LBR IP 值包含 LIP. 如果 0, IP 值 | 逻辑 |
|  |  | 包含有效的IP。 使用平面内存模型追踪片段将生成相同信息,无论逻辑处理器自 LIP = EIP 以来如何报告这一值 | 处理器 |
| EBX[0] | CPL_FILTERING | 如果 1, 支持将 IA32  LBR  CTL [2: 1] 设置为非零值 。 | 平台 |
| EBX[1] | BRANCH_FILTERING | 如果 1,支持将 IA32 LBR CTL [22:16] 设置为非零值. | 平台 |
| EBX[2] | CALL_STACK_MODE | 如果 1, 支持设置 IA32  LBR  CTL [3] 到 1 。 | 平台 |
| EBX[31:3] | 准备金 | 预留. |  |
| ECX[0] | MISPREDICT_BIT | 如果 1, IA32 LBR x INFO[63] 持有分支误测指示(MISPRED). | 平台 |
| ECX[1] | TIMED_LBRS | 如果1,IA32 LBR x INFO[15:0]自上个LBR条目(CYC CNT)以来,持有CPU周期,IA32 LBR x INFO[60]持有持有的值是否有效的指示(CYC CNT VALID). | 平台 |
| ECX[2] | BRANCH_TYPE_FIELD_SUPPORTED | 如果 1, IA32 LBR INFO x[59:56] 持有记录操作的分支类型(BR TYPE)的表示. | 平台 |
| ECX[15:3] | 准备金 | 预留. |  |
| ECX[19:16] | EVENT_LOGGING_BITMAP | 事件日志位图,其中每个设置位对应一个支持 LBR 事件日志的可编程性能监测计数器. | 平台 |
| ECX[31:20] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |
| 21-68卷 第1册. |  | PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION |  |

CPUID.1DH - 铺设信息

CPUID.1DH返回关于瓦片架构和瓦片调色板1的信息(见第19章,"与英特尔(R)高级矩阵扩展程序",Intel(R)64和IA-32架构软件开发者手册第1卷). * 如果 CPUID.07H.00H: EDX.AMX_TILE[24] = 1 和 MAXLEAF 1DH ,此 叶 有效. * ECX的最大子叶值在CPUID.1DH.00H.EAX[31:0] max palette中指定. * 如果ECX包含无效的子叶指数,则EAX/EBX/ECX/EDX返回0. 如果 n 超过 子叶 0 在 EAX 中返回的值,则 子叶 指数 n 无效.

CPUID.1DH.00H - 平面信息主 子叶

CPUID.1DH.00H 返回瓷砖结构信息.

注册字段名称表21-67. 叶 1DH. 00H Tile信息域名EAX [31:0] MAQQQPALETTE平台 EBX [31:0] 保留说明 ECX [31:0] 保留最高编号调色板 子叶. 数值=1. EDX [31:0] 预备役. 预留. 预留.

CPUID.1DH.01H - 调色板1

CPUID.1DH.01H 返回瓷砖调色板信息 。

** 叶 1DH.01H 轮胎信息**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[15:0] | TOTAL_TILE_BYTES | 调色板 1 共   字节  字节 。 数值=8192。 | 平台 |
| EAX[31:16] | BYTES_PER_TILE | 调色板 1 字节 per tile. 数值=1024. | 平台 |
| EBX[15:0] | BYTES_PER_ROW | 调色板 1 字节  per row. 数值=64。 | 平台 |
| EBX[31:16] | MAX_NAMES | 调色板 1 最大名称( 瓦片登记簿的数目) 。 数值=8. | 平台 |
| ECX[15:0] | MAX_ROWS | 调色板 1 最大行数 。 数值=16。 | 平台 |
| ECX[31:16] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |

CPUID.1EH - TMUL 信息

CPUID.1EH返回关于TMUL能力的信息(见第19章,"与英特尔(R)高级矩阵扩展程序",Intel(R)64和IA-32架构软件开发者手册第1卷). * 如果 CPUID.07H.00H: EDX.AMX_TILE[24] = 1 和 MAXLEAF 1EH ,此 叶 有效. * 唯一有效的子叶是0,ECX必须设置为0.

CPUID.1EH.00H - TMUL 信息主题 叶

TMUL 主 叶 信息

注册字段名称表21-69. 叶 1EH. 00H TMUL信息域名EAX[31:0] 保留EBX[7:0] TMUL MAXK描述平台 EBX[23:8] TMUL MAXN 保留.                                 平台EBX[31:24] 保留tmul maxk(行或列). 数值=16。 ECX [31:0] 保留tmul maxn(列字节). 数值=64。 EDX [31:0] 预备役. 预留. 预留.

CPUID.1FH - V2 扩展地形学

CPUID.1FH返回关于V2扩展地形学的信息. CPUID.1FH是叶 0BH的首选超级集. Intel建议在可用时使用叶 1FH而不是叶 0BH,并确保任何叶 0BH算法更新以支持叶 1FH. * 如果 CPUID.1FH.00H: EBX [15:0] <> 0 和 MAQQLEAF 1FH,此 叶是有效的.

* 叶无效时,CPUID.1FH.00H:ECX.DOMAIN_TYPE[15:8]将报告域类型ID无效(0). * 子叶被列出,直到子叶 n在EBX[15:0]中返回0. * 如果 ECX 包含无效的 子叶 指数,则 EAX/EBX 返回 0. 子叶指数n+1如果子叶n返回EBX[15:0]为0.

CPUID.1FH -- ECX >= 0

** 叶 1FH V2 扩展地形学**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[4:0] | SHIFT_COUNT | X2APIC ID 的位数必须转移到处理下一个更高范围域实例的右侧. 当处理器不支持逻辑处理器时,逻辑处理器域子叶的这个字段的值可以返回为0(在x2APIC ID中没有分配位)或1(在x2APIC ID中分配位);软件应该相应地计划. | 平台 |
| EAX[31:5] | 准备金 | 预留. |  |
| EBX[15:0] | NEXT_LEVEL_NUM_LP | 所有逻辑处理器的数目 | 逻辑 |
|  |  | 相对于此当前逻辑处理器,此域在下一个更高范围的域中的实例。 (例如,在一个包含"M"的处理器套接字/包中,每个"N"核心的死,每个核心都有"L"的逻辑处理器,这个字段的"die"域子叶值将是M*N*L. 在不对称的地形学中,这将是对下域级实例的数值的总和,以创建每个上域级实例. ) 这个数字反映了英特尔运出的配置. 注意逻辑处理器的数量可以是不对称的,在这种情况下,"L"在不同逻辑处理器上可能有所不同,作为一个例子,在同一个平台上有一个带有2个逻辑处理器的芯与一个逻辑处理器的芯. 注意,软件不得使用此字段来列举处理器地形. 软件不得使用EBX[15:0]的值来列举系统的处理器地形. 该值仅用于展示和诊断目的. BIOS/OS/applications可用的逻辑处理器的实际数量可能与EBX[15:0]的值不同,取决于软件和平台硬件配置. | 处理器 |
| EBX[31:16] | 准备金 | 预留. |  |

ECX [7:0] LEVEL NUM 输入ECX 子叶指数.                      ECX平台[15:8] DOMAIN TYPE平台 本字段提供识别值,ECX[31:16] Reserved表示表所示域.        逻辑 EDX [31:0] X2APIC ID 尽管域被命令,其指定的处理器识别值不是,软件不应该依赖它. (例如,如果在核心和模块之间指定了一个新的域,则其识别值将高于5. ) 参见下表当前有效计数列表. 请注意,计数值为0和7-255。

Reserved.

当前逻辑处理器的x2APIC ID总是有效的,不会随ECX的子叶索引而变化.

CPUID.1FH的子叶描述了逻辑处理器从逻辑处理器最小范围域(子叶 index 0)开始到核心域(子叶 index 1)到最大范围域(最后一个有效的子叶指数)的有序的逻辑处理器等级,该等级默认从属于处理器包(socket)的未假定最高范围域. 每个有效域的细节由相应的子叶列出. 一个域的细节包括它的类型,以及该域的所有实例如何决定下一个更高范围域的逻辑处理器和x2 APIC ID分区的数量. 等级内域的顺序在建筑上是固定的,如下所示. 对于给定的处理器来说,并非所有域都可能相关或列举;然而,逻辑处理器和核心域总是被列出. 例如,一个处理器可以报告一个仅由"逻辑处理器","Core"和"Die"组成的命令等级. 对于两个有效的子叶 N和N+1,子叶 N+1代表了针对给定处理器的子叶 N域的下一个直接的更高范围域. 如果子叶指数"N"在ECX [15:08] (00H)中返回无效域类型,那么所有指数大于"N"的子叶也返回无效域类型. A 子叶 返回无效域时,总是在 EAX 和 EBX 中返回 0.

** CPUID.1FH:ECX [15:8] **

| 等级 | 域名 | 域类型 ID 值 |
| --- | --- | --- |
| 无效 | 无效 | 0 |
| 最低 | 逻辑处理器 | 1 |
| ... | 核心 | 2 |
| ... | 模块 | 3 |
| ... | 平铺 | 4 |
| ... | 死吧 死吧 死吧 | 5 |
| ... | DieGrp 软件 | 6 |
| 最高 | 软件包/软件包 | (音译). |
| 准备金 | 准备金 | 7-255 |
| 21-72卷 第1册. |  |  |

CPUID.20H - 处理器历史重置信息

CPUID.20H在CPUID.07H.01H:EAX.HRESET[22]=1. * 如果 CPUID.07H.01H: EAX.HRESET[22] = 1 和 MAXLEAF 20H ,此 叶 有效. * 子叶最大值ECX在CPUID.20H.00H.EAX[31:0] MAQSUBLEAF中指定. * 如果ECX包含无效的子叶指数,则EAX/EBX/ECX/EDX返回0. 如果 n 超过 子叶 0 在 EAX 中返回的值,则 子叶 指数 n 无效.

CPUID.20H.00H - 处理器历史 重置 子叶

** 叶 20H.00H 处理器历史重置信息**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | 报告20H叶中支持的子叶的最大数量. | 平台 |
| EBX[0] | THREAD_DIRECTOR_HRESET | 表示支持 HRESET 的 EAX [0] 参数,以及 OS 设置的 IA32 HRESET ENABLE[0] 以允许重置Intel(R) Thread Director历史. | 平台 |
| EBX[31:1] | 准备金 | 预留. |  |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |

CPUID.21H -- Unimplemented

不返回处理器的特性信息 。 分配给 TDX 模块使用;参见 Intel(R) Trust Domain Extensions (Intel(R) TDX) 模块基建规格. 模拟 CPUID 的软件不应更改返回的关于此 叶 的信息 。

CPUID.22H -- Reserved

此 叶 保留 。

注册字段名称表21-73. 叶 22H 保留域名 EAX [31:0] 保留域名 EBX [31:0] 保留域名 ECX [31:0] 保留域名. EDX [31:0] 预备役. 预留. 预留.

CPUID.23H - 建筑性能监测扩展

CPUID.23H返回建筑性能监测扩展信息. * 如果 CPUID.07H.01H: EAX.ARCH_PERFMON_EXT[8] = 1 和 MAXLEAF 23H ,此 叶 有效. * 此 叶 的 子叶 由 CPUID.23H.00H.EAX[31:0] SUBLEAF MASK 中指定的位图列出. 位图中设置的位数代表有效的子叶索引. * 如果ECX包含无效的子叶指数,则EAX/EBX/ECX/EDX返回0. 子叶指数如果在可用的子叶 Mask中作为位数的索引清晰或大于31,则无效.

CPUID.23H.00H - 主用 子叶

** 叶 23H.00H 建筑性能监测扩展**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | SUBLEAF_MASK | 如果设置位 n,则支持 子叶 n. (单位:千美元) | 逻辑 |
|  |  | 不支持的 子叶, 0 在登记簿中返回 EAX, EBX, ECX, 和 EDX. | 处理器 |
| EBX[0] | UNITMASK2 | 如果 1, 支持 UnitMask2 字段 | 逻辑 |
|  |  | IA32 PERFEVTSELx MSRs. 中国植物物种信息数据库. | 处理器 |
| EBX[1] | EQ | 如果 1, 支持在 | 逻辑 |
|  |  | IA32_PERFEVTSELx MSRS. | 处理器 |
| EBX[31:2] | 准备金 | 预留. |  |
| ECX[7:0] | SLOTS_PER_CYC | 如果此字段为非零,则代表 | 逻辑 |
|  |  | 每个周期自上而下微architecture分析(TMA)插槽的数目。 这个数字可以乘以周期数(从CPU_CLK_UNHALTED.THREAD / CPU_CLK_UNHALTED.CORE 或 IA32 FIXED CTR1)来确定槽的总数. 如果此字段为零,则应使用IA32 FIXED CTR3来确定槽的总数. | 处理器 |
| ECX[31:8] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |
| CPUID.23H.01H - | - 反情报子叶 |  |  |

** 叶 23H.01H 建筑性能监测扩展**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | GP_COUNTERS | 对于此字段中的每个位 n 设置, 处理器 | 逻辑 |
|  |  | 支持通用性能监测计数器 n. | 处理器 |
| EBX[31:0] | FIXED_COUNTERS | 对于此字段中的每个位 m 设置, 处理器 | 逻辑 |
|  |  | 支持固定功能性能监测计数器 m. 固定功能计数器的有效范围为0至15个. | 处理器 |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |
| 21-76 第1卷 (中文(简体) ). |  |  |  |

CPUID.23H.02H - 自动柜台重装 子叶的位图

** 叶 23H.02H 建筑性能监测扩展**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | ACR_GP_RELOAD | 可重装的普通计数器. 每个 | 逻辑 |
|  |  | bit n set in this 字段,处理器支持ACR用于通用性能监测计数器n. | 处理器 |
| EBX[31:0] | ACR_FIXED_RELOAD | 可以重新装填的固定计数器. 每个 | 逻辑 |
|  |  | bit m set in this field,处理器支持ACR用于固定函数性能监测计数器m. | 处理器 |
| ECX[31:0] | ACR_GP_TRIGGER | 可以引起重装的普通计数器. 用于 | 逻辑 |
|  |  | 处理器允许通用性能监测计数器y重新装入所有能够重新装入的现有的通用性能监测计数器。 | 处理器 |
| EDX[31:0] | ACR_FIXED_TRIGGER | 可以引起重载的固定计数器. 每个 | 逻辑 |
|  |  | bit x 设置在这个字段,处理器允许固定函数性能监测计数器x重新装入所有现有的能够重新装入的固定函数性能监测计数器. | 处理器 |

** 叶 23H.03H 建筑性能监测扩展**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[0] | CORE_CYC | 如果 1, 支持建筑索引 0. | 逻辑处理器 |
| EAX[1] | INSTR_RET | 如果1,支持建筑指数1. | 逻辑处理器 |
| EAX[2] | REF_CYC | 如果1,支持建筑指数2. | 逻辑处理器 |
| EAX[3] | LLC_REF | 如果1,支持建筑指数3. | 逻辑处理器 |
| EAX[4] | LLC_MISSES | 如果1,支持建筑指数4. | 逻辑处理器 |
| EAX[5] | BR_INSTR_RET | 如果 1, 支持建筑索引 5 | 逻辑处理器 |
| EAX[6] | BR_MISPRED_RET | 如果 1, 支持建筑索引 6 | 逻辑处理器 |
| EAX[7] | SLOTS | 如果1,支持建筑索引7 | 逻辑处理器 |
| EAX[8] | BACKEND | 如果 1, 支持建筑索引 8 | 逻辑处理器 |
| EAX[9] | BADSPEC | 如果 1, 支持建筑索引 9 | 逻辑处理器 |

EAX[10] FRONTEND 如果1,支持建筑索引 10 逻辑处理器 EAX[11] RETIRING 如果1,支持建筑索引 11 逻辑处理器 EAX[12] LBR INSERTS 如果1,支持建筑索引 12 处理器

```text
                                                    Reserved.                                        Logical
                                                    Reserved.                                        Processor
```

预留. EAX [31:13] 预备役. EBX [31:0] 保留 ECX [31:0] 保留 EDX [31:0] 保留

CPUID.23H.04H - PEBS 能力

** 叶 23H.04H 建筑性能监测扩展**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | 准备金 | 预留. |  |
| EBX[2:0] | 准备金 | 预留. |  |
| EBX[3] | ALLOW_IN_RECORD | 如果 1, 表示 ALLOW IN RECORD 位点为 | 逻辑 |
|  |  | 可在IA32 PMC GPn CFG C和IA32 PMC FXm CFG CMSRs中找到. | 处理器 |
| EBX[4] | CNTR_GP | 如果 1, 表示该计数组子组 | 逻辑 |
|  |  | 设有通用柜台。 | 处理器 |
| EBX[5] | CNTR_FIXED | 如果 1, 表示该计数组子组 | 逻辑 |
|  |  | 设有固定功能计数器。 | 处理器 |
| EBX[6] | CNTR_METRICS | 如果 1, 表示该计数组子组 | 逻辑 |
|  |  | 有业绩计量。 | 处理器 |
| EBX[7] | 准备金 | 预留. |  |
| EBX[9:8] | LBR | LBR组和两个比特[41:40]都可以使用. | 逻辑处理器 |
| EBX[15:10] | 准备金 | 预留. |  |
| EBX[23:16] | XER | XER 组合比特 [50:49] 和比特 [55:53] 是 | 逻辑 |
|  |  | 可用。 关于XER字段,见第11.4.4节,"XSAVE Enabled Registers Group"。 | 处理器 |
| EBX[28:24] | 准备金 | 预留. |  |
| EBX[29] | GPR | 如果 1, GPR 组可用 。 | 逻辑处理器 |
| EBX[30] | AUX | 如果 1, AUX 组可用 。 | 逻辑处理器 |
| EBX[31] | 准备金 | 预留. |  |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |
| 21-78卷 第1册. |  |  |  |

CPUID.23H.05H - 支持Arch PEBS GP和固定柜台

** 叶 23H.05H 建筑性能监测扩展**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | GP_PEBS | 通用计数器的位向量 | 逻辑 |
|  |  | 该建筑PEBS机制是可用的(bit n)==GP计数器#n. 如果EAX[n] == 1,那么可以使用IA32 PMC GPn CFG CMSR,并在该计数器上支持PEBS;可以设置PEBS EN[63]字段;也可以设置RELOAD[31:0]字段. 注意 CPUID.23H.04H:EBX 规范哪个适应性组位点可以设置. | 处理器 |
| EBX[31:0] | GP_PDIST | PEBS通用计数器 | 逻辑 |
|  |  | 支持 PDIST 。 | 处理器 |
| ECX[31:0] | FIXED_PEBS | 固定函数计数器的位向量 | 逻辑 |
|  |  | 建筑PEBS机制可供使用。 如果ECX[x] == 1,那么可以使用IA32 PMC FXm CFG CMSR,支持PEBS;可以设置PEBS EN[63]字段;也可以设置RELOAD[31:0]字段. 注意 CPUID.23H.04H:EBX 规范哪个适应性组位点可以设置. | 处理器 |
| EDX[31:0] | FIXED_PDIST | PEBS 的固定功能计数器 | 逻辑 |
|  |  | 支持 PDIST 。 | 处理器 |

CPUID.24H - 汇合矢量 ISA

CPUID.24H时,处理器返回Intel AVX10聚合向量 ISA信息. 当 CPUID.07H.01H: EDX.AVX10[19] = 1. 此 叶 支持. * 如果 CPUID.07H.01H: EDX.AVX10[19] = 1 和 MAXLEAF 24H ,此 叶 有效. * 子叶最大值ECX在CPUID.24H.00H.EAX[31:0] MAQSUBLEAF中指定. * 如果ECX包含无效的子叶指数,则EAX/EBX/ECX/EDX返回0. 如果 n 超过 子叶 0 在 EAX 中返回的值,则 子叶 指数 n 无效.

CPUID.24H.00H - 聚合矢量ISA 主力子叶

** 叶 24H.00H 交织的矢量ISA**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | 报告24H叶中支持的子叶的最大数量. | 平台 |
| EBX[7:0] | VECTOR_ISA_VERSION | 报告英特尔(R)AVX10交织的矢量ISA版本. | 平台 |
| EBX[15:8] | 准备金 | 预留. |  |
| EBX[18:16] | 预留额111 | 总是111b。 此规格的早期版本记录了这些位点,以列举对不同矢量长度的支持. 正在列出 Intel( R) AVX10 的处理器支持所有矢量长度 。 | 平台 |
| EBX[31:19] | 准备金 | 预留. |  |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |
| 21-80卷 第1册. |  |  |  |

CPUID.27H - Intel(R)资源主任技术(Intel(R) RDT)不对称监测

CPUID.27H为具有不对称地形的英特尔资源总监技术监测能力返回信息. 如下文所述,软件使用子叶 00H在EDX中返回的位向量来确定可监测的可用资源类型(ResID). 这种信息对于软件编程IA32 PQR ASSOC和IA32 M EVTSEL MSR是必需的,这样,在IA32 M CTR MSR之后就可以读取服务质量数据. * 如果 CPUID.07H.01H: ECX.RDT_M_ASYM[0] = 1 和 MAXLEAF 27H ,此 叶 有效. * 如果叶是有效的,子叶 00H总是有效的. 子叶 n(n 1)只有在(CPUID.27H.00H:EDX[n]== 1)时才有效. * 这个 叶 必须在每个逻辑处理器上读取,以确定每个处理器上的支持.

CPUID.27H.00H - Intel(R) RDT 不对称监测主 子叶

CPUID.27H.00H返回关于Intel RDT监测不对称的信息.

** 叶 27H.00H Intel(R)资源主任技术(Intel(R) RDT)不对称监测**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | 准备金 | 预留. |  |
| EBX[31:0] | MAX_RMID | RMID内最大范围(零基) | 逻辑 |
|  |  | 此所有类型物理处理器。 | 处理器 |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[0] | 准备金 | 预留. |  |
| EDX[1] | L3_MON | 如果 1, 支持 L3 Cache Intel RDT 监控. | 逻辑 |
|  |  | 子叶指数0报告以EDX的位位置1开始的有效资源类型. | 处理器 |
| EDX[31:2] | 准备金 | 预留. |  |

** 叶 27H.01H Intel(R)资源主任技术(Intel(R) RDT)不对称监测**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[7:0] | CTR_WIDTH | 柜台宽度编码为从 | 逻辑 |
|  |  | 24b. (中文(简体) ). 此字段的值为0,表示支持24位计数器. 这个字段的值为8,表示支持32位计数器. | 处理器 |
| EAX[8] | RDT_M_OVF | 如果 1, 支持在 | 逻辑 |
|  |  | IA32QQM CTR MSR (bit 61). | 处理器 |

EAX [9] IO RDT CMT 如果 1, 表示非CPU代理的存在 逻辑

```text
                                                    supporting Intel RDT CMT.                      Processor
```

EAX[10] IO RDT MBM 如果 1,则表示非CPU代理的存在 逻辑

```text
                                                    supporting Intel RDT MBM support.              Processor
```

EAX [31:11] 预备役. EBX [31: 0] CONV FACTOR 系数,用于从已报告的逻辑转换

```text
                                                    IA32_QM_CTR value to derived occupancy         Processor
```

ECX [31:0] MAX RMID L3 度量衡(字节)和记忆波段(Bandwidth EDX [0] CMT L3 OCCUP 监测(MBM)度量衡.                      逻辑 EDX [1] MBM L3 TOTAL 本处理器RMID的最大范围(零基) EDX [2] MBM L3 LOCAL资源类型.                                 逻辑 EDX [31:3] 预留1,支持L3占用监测.        处理器逻辑

```text
                                                    If 1, supports L3 total bandwidth monitoring.  Processor
```

Logical

```text
                                                    If 1, supports L3 local bandwidth monitoring.  Processor
```

Reserved.

CPUID.28H - 英特尔(R)资源总监技术(英特尔(R)RDT)不对称分配

CPUID.28H返回Intel资源总监技术分配的信息,带有不对称地形. 当 CPUID.07H.01H: ECX.RDT_A_SYM[1] = 1. 此 叶 有效 。 如下文所述,软件使用子叶00H返回的EBX中的位矢量来确定处理器中支持的现有QoS执行(分配)资源类型. 这种信息对于软件在QoS Mask 注册,IA32 resourceType Mask n中使用能力位口罩来配置每类服务是必要的. * 如果 CPUID.07H.01H: ECX.RDT_A_SYM[1] = 1 和 MAXLEAF 28H ,此 叶 有效. * 如果叶是有效的,子叶 00H总是有效的. 子叶 n(n 1)只有在(CPUID.28H.00H:EBX[n]== 1)时才有效.

CPUID.28H.00H - 英特尔( R) RDT 不对称分配 主 子叶

CPUID.28H.00H返回关于Intel RDT分配不对称的信息.

** 叶 28H.00H Intel(R)资源主任技术(Intel(R) RDT)不对称分配**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | 准备金 | 预留. |  |
| EBX[0] | 准备金 | 预留. |  |
| EBX[1] | CAT_L3 | 如果 1. 支持 L3 缓存分配技术 。 | 逻辑处理器 |
| EBX[2] | CAT_L2 | 如果 1. 支持 L2 缓存分配技术 。 | 逻辑处理器 |
| EBX[3] | MBA | 如果 1. 支持记忆带宽分配 。 | 逻辑处理器 |
| EBX[4] | 准备金 | 预留. |  |
| EBX[5] | CBA | 如果 1, 支持缓存 Bandwidth 分配 。 | 逻辑处理器 |
| EBX[6] | RESOURCE_PRIORITY | 如果 1, 支持资源优先级 。 | 平台 |
| EBX[31:7] | 准备金 | 预留. |  |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |

** 叶 28H.01H Intel(R)资源主任技术(Intel(R) RDT)不对称分配**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[4:0] | CAT_L3_BITMASK_LENGTH | 容量位罩的长度 | 逻辑 |
|  |  | 对应的ResID。 在返回值中添加一个以获取结果 。 | 处理器 |
| EAX[31:5] | 准备金 | 预留. |  |

EBX [31:0] CAT L3 Contention Bit-granular 隔离图/持有逻辑 ECX[0] 保留分配单位.                               处理器 ECX [1] CAT L3 NONCPU ECX [2] CAT L3 CDP 如果1,支持L3 CAT的非CPU代理.       逻辑 ECX [3] CAT L3 NONCONTIG 处理器

```text
                                                    N/A                                             Logical
```

ECX [31:4] 保留处理器 EDX [15:0] CAT L3 MAX CLOS 如果 1, 支持 L3 代码和数据排序逻辑

```text
                                                    Technology.                                     Processor
```

```text
                                                    If 1, supports non-contiguous capacity          Logical
                                                    bitmasks. The bits that are set in the various  Processor
```

IA32 L3 MASK n 登记册不必是EDX[31:16] 保留毗连.

Reserved.

此ResID 所支持的最高服务类别( COS) 编号 。

Reserved.

CPUID.28H.02H - 不对称 L2 快取分配技术

CPUID.28H.ResID=2 返回关于不对称 L2 缓存分配技术的信息.

** 叶 28H.02H Intel(R)资源主任技术(Intel(R) RDT)不对称分配**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[4:0] | CAT_L2_BITMASK_LENGTH | 容量位罩的长度 | 逻辑 |
|  |  | 对应的ResID。 在返回值中添加一个以获取结果 。 | 处理器 |
| EAX[31:5] | 准备金 | 预留. |  |
| EBX[31:0] | CAT_L2_CONTENTION | 隔离/保存的位角图 | 逻辑 |
|  |  | 分配单位。 | 处理器 |
| ECX[1:0] | 准备金 | 预留. |  |
| ECX[2] | CAT_L2_CDP | 如果 1, 支持 L2 代码和数据排序 | 逻辑 |
|  |  | 科技. | 处理器 |
| ECX[3] | CAT_L2_NONCONTIG | 如果1,支持非毗连能力 | 逻辑 |
|  |  | 比特马斯。 各种 IA32 L2 MASK n 登记簿中设置的位点不必毗连 。 | 处理器 |
| ECX[31:4] | 准备金 | 预留. |  |
| EDX[15:0] | CAT_L2_MAX_CLOS | 最高服务级别(COS) | 逻辑 |
|  |  | 支持此 ResID 。 | 处理器 |
| EDX[31:16] | 准备金 | 预留. |  |

** 叶 28H.03H Intel(R)资源主任技术(Intel(R) RDT)不对称分配**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| 21-84卷 第1册. |  |  |  |

EAX [11: 0] MBA MAX 报告最大 MBA 节奏值逻辑

```text
                                            supported for the corresponding ResID. Add          Processor
```

EAX [31:12] 保留一个返回值以获得结果. EBX [31:0] 预备役.                                           逻辑 ECX [0] PER THREAD MBA 保留.                                           支持Per-thread MBA控件. ECX[1] 保留逻辑 ECX[2] MBA LINEAR 保留.                                           处理器 如果 1, 延迟值的反应为线性 。 ECX [31:3] 保留逻辑 EDX [15:0] MBA MAX CLOS 保留.                                           处理器最高服务等级(COS)编号为EDX[31:16],为这个ResID支持保留. 预留.

CPUID.28H.05H - 不对称缓存带宽分配

** 叶 28H.05H Intel(R)资源主任技术(Intel(R) RDT)不对称分配**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[7:0] | CBA_MAX_LEVELS | 报告最大核心节流水平 | 逻辑 |
|  |  | 支持相应的ResID。 在返回值中添加一个以获得对节流电位数的支持 。 | 处理器 |
| EAX[11:8] | BW_SCOPE | 如果 1, 表示逻辑处理器范围 | 逻辑 |
|  |  | IA32 QoS Core BW Thrtl n MSRs. 互联网档案馆的存檔,存档日期2013-12-21. 其他数值保留。 | 处理器 |
| EAX[31:12] | 准备金 | 预留. |  |
| EBX[31:0] | 准备金 | 预留. |  |
| ECX[2:0] | 准备金 | 预留. |  |
| ECX[3] | CBA_LINEAR | 如果 1, 带宽控制的反应是 | 逻辑 |
|  |  | 大约线性。 如果 0,则带宽控制的反应为非线性. | 处理器 |
| ECX[31:4] | 准备金 | 预留. |  |
| EDX[15:0] | CBA_MAX_CLOS | 最高服务级别(COS) | 逻辑 |
|  |  | 支持此 ResID 。 | 处理器 |
| EDX[31:16] | 准备金 | 预留. |  |
| CPUID.28H.06H - | - 资源优先控制 |  |  |

** 叶 28H.06H Intel(R)资源主任技术(Intel(R) RDT)不对称分配**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[0] | THREAD_ENABLE | 如果 1, 通过 IA32 RES ources PRIORITY MSR 支持 RP 的每行启用. | 平台 |

EAX [1] PACKAGE ENABLE IF 1,支持物理处理器软件包平台通过IA32 RESources EAX[31:2] 保留优先 PKG MSR启用RP. EBX [31:0] 保留ECX [31:0] 保留. EDX [31:0] 预备役.

Reserved.

Reserved.

CPUID.80000000H - 扩展函数的最大输入值 CPUID 信息

CPUID.80000000H返回处理器识别的返回扩展处理器信息的最高值. 该值在 EAX 寄存器中返回,并具有处理器特定性. * 这个 叶 从Pentium 4开始得到支持. * Pentium 4 之前的处理器将比特 31 处理为 0,这个 叶 返回来自 CPUID.00H 的值. * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 80000000H 扩展函数最大输入值 CPUID信息**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_EXTENDED_LEAF | CPUID扩展函数信息的最大输入值 。 | 平台 |
| EBX[31:0] | 准备金 | 预留. |  |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |

CPUID.80000001H - 扩展处理器签名和特性位

CPUID.80000001H返回关于扩展处理器签名和特征位的信息. * 此 叶 如果 MAX XEXTENTED LEAF 80000001H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 80000001H 扩展处理器签名和特性位**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | 准备金 | 预留. |  |
| EBX[31:0] | 准备金 | 预留. |  |
| ECX[0] | LAHF_SAHF_64 | 如果1,支持以64位模式发布的LAHF/SAHF指令. LAHF和SAHF总是以其他模式提供,无论该特征旗的引用情况如何. | 平台 |
| ECX[4:1] | 准备金 | 预留. |  |
| ECX[5] | LZCNT | 如果 1, 支持 LZCNT 指令 。 | 平台 |
| ECX[7:6] | 准备金 | 预留. |  |
| ECX[8] | PREFETCHW | 如果 1, 支持 PREFETCHW 指令 。 | 平台 |
| ECX[31:9] | 准备金 | 预留. |  |
| EDX[10:0] | 准备金 | 预留. |  |
| EDX[11] | SYSCALL_SYSRET_64 | 如果1,则支持SYSCALL/SYSRET. Intel处理器只在64位模式下支持SYSCALL和SYSRET. 此特性旗总是被列举为64位模式外的0. | 平台 |
| EDX[19:12] | 准备金 | 预留. |  |
| EDX[20] | EXECUTE_DIS | 如果 1, 支持执行禁用位 。 | 平台 |
| EDX[25:21] | 准备金 | 预留. |  |
| EDX[26] | PAGE_1GB | 如果 1,支持 1-GByte 页面. | 平台 |
| EDX[27] | RDTSCP | 如果1,支持RDTSCP和IA32 TSC AUX. | 平台 |
| EDX[28] | 准备金 | 预留. |  |
| EDX[29] | INTEL64 | 如果 1, 则支持 Intel( R) 64 Architecture. | 平台 |
| EDX[31:30] | 准备金 | 预留. |  |
| 21-88卷 第1册. |  | PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION |  |

CPUID.80000002H - 处理器品牌字符串( Bytes 0 to 15)

CPUID.80000002H返回关于处理器品牌字符串的信息. 关于Processor Brand String的更多细节,参见第21.2节"使用CPUID的返回品牌信息的方法". * 此 叶 如果 MAX XEXTENTED LEAF 80000002H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 80000002H 处理器品牌字符串(字节0至15)**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | BRAND_NAME_0 | 处理器品牌字符串. | 平台 |
| EBX[31:0] | BRAND_NAME_1 | 处理器品牌字符串继续. | 平台 |
| ECX[31:0] | BRAND_NAME_2 | 处理器品牌字符串继续. | 平台 |
| EDX[31:0] | BRAND_NAME_3 | 处理器品牌字符串继续. | 平台 |

CPUID.80000003H - 处理器品牌字符串(Bytes 16至31)

CPUID.80000003H返回关于处理器品牌字符串的信息. 关于Processor Brand String的更多细节,参见第21.2节"使用CPUID的返回品牌信息的方法". * 此 叶 如果 MAX XEXTENTED LEAF 80000003H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 80000003H 处理器品牌字符串(字节16至31)**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | BRAND_NAME_4 | 处理器品牌字符串继续. | 平台 |
| EBX[31:0] | BRAND_NAME_5 | 处理器品牌字符串继续. | 平台 |
| ECX[31:0] | BRAND_NAME_6 | 处理器品牌字符串继续. | 平台 |
| EDX[31:0] | BRAND_NAME_7 | 处理器品牌字符串继续. | 平台 |
| 21-90卷 第1册. |  |  |  |

CPUID.80000004H - 处理器品牌字符串(32至47字节)

CPUID.80000004H返回关于处理器品牌字符串的信息. 关于Processor Brand String的更多细节,参见第21.2节"使用CPUID的返回品牌信息的方法". * 此 叶 如果 MAX XEXTENTED LEAF 80000004H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 80000004H 处理器品牌字符串(32至47字节)**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | BRAND_NAME_8 | 处理器品牌字符串继续. | 平台 |
| EBX[31:0] | BRAND_NAME_9 | 处理器品牌字符串继续. | 平台 |
| ECX[31:0] | BRAND_NAME_10 | 处理器品牌字符串继续. | 平台 |
| EDX[31:0] | BRAND_NAME_11 | 处理器品牌字符串继续. | 平台 |

CPUID.80000005H -- Reserved

此 叶 保留并返回所有零 。

注册字段名称表21-94. 叶 80000005H 保留域名 EAX [31:0] 保留域名 EBX [31:0] 保留域名 ECX [31:0] 保留域名. EDX [31:0] 预备役. 预留. 预留.

CPUID.80000006H - 扩展函数 CPUID 信息

CPUID.80000006H返回扩展函数 CPUID信息. 首选方法将缓存信息描述>is用于使用CPUID.04H-Deterministic缓存参数. * 此 叶 如果 MAX XEXTENTED LEAF 80000006H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 的值大小, 都提供相同的信息 。

** 叶 80000006H 扩展函数 CPUID 信息**

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | 准备金 | 预留. |  |
| EBX[31:0] | 准备金 | 预留. |  |
| ECX[7:0] | L2_LINE_SIZE | 缓存行大小以字节表示 。 | 逻辑处理器 |
| ECX[11:8] | 准备金 | 预留. |  |
| ECX[15:12] | L2_ASSOC | L2 关联场. L2 关联领域 | 逻辑 |
|  |  | 编码列于下表. | 处理器 |
| ECX[31:16] | L2_SIZE | 1K单位的缓存大小 。 | 逻辑处理器 |
| EDX[7:0] | 准备金 | 预留. |  |
| EDX[31:8] | 准备金 | 预留. |  |

**L2 关联场编码**

| 编码值 | 说明 | 编码值 | 说明 |
| --- | --- | --- | --- |
| 00H | 已禁用 | 08H | 16 方法 |
| 01H | 1 道( 直接绘制) | 09H | 准备金 |
| 02H | 2 途径 | 0AH | 32 方法 |
| 03H | 准备金 | 0BH | 48 方法 |
| 04H | 4 方 法 | 0CH | 64 方法 |
| 05H | 准备金 | 0DH | 96 方法 |
| 06H | 8 方法 | 0EH | 128条途径 |
| 07H | 参见CPUID 叶 4 子叶 21 q. | 0FH | 完全联合 |

CPUID.80000007H - 扩展函数 CPUID 信息 1

CPUID.80000007H返回扩展函数 CPUID信息. * 此 叶 如果 MAX XEXTENTED LEAF 80000007H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 80000007H 扩展函数 CPUID 信息 1 **

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[31:0] | 准备金 | 预留. |  |
| EBX[31:0] | 准备金 | 预留. |  |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[7:0] | 准备金 | 预留. |  |
| EDX[8] | TSC_INVARIANT | 如果1,则支持Invariant TSC. | 平台 |
| EDX[31:9] | 准备金 | 预留. |  |
| 21-94卷 第1册. |  |  |  |

CPUID.80000008H - 扩展函数 CPUID 信息 2

CPUID.80000008H返回扩展函数 CPUID信息. * 此 叶 如果 MAX XEXTENTED LEAF 80000008H 有效 。 * 此 叶 不包含 子叶 , 无论 ECX 值多少, 都提供相同的信息 。

** 叶 80000008H 扩展函数 CPUID 信息 2 **

| 登记册 | 字段名称 | 说明 | 域名 |
| --- | --- | --- | --- |
| EAX[7:0] | PHYS_ADDR_SIZE | 物理地址位数 。 如果TME-MK被启用,可用于解决内存的位数可以通过IA32 TME ACTIVATE[35:32]减少. | 平台 |
| EAX[15:8] | LIN_ADDR_SIZE | 线性地址位数 。 | 平台 |
| EAX[23:16] | GUEST_PHYS_ADDR_SIZE | 客-物理地址位数(用于虚拟机操作的软件). 如果此字段为零,则应使用 PHYS ADDR SIZE 。 英特尔处理器返回此字段的零 。 模拟 CPUID 的软件可能返回不同的值. | 平台 |
| EAX[31:24] | 准备金 | 预留. |  |
| EBX[8:0] | 准备金 | 预留. |  |
| EBX[9] | WBNOINVD | 如果 1, 支持 WBNOINVD 指令 。 | 平台 |
| EBX[31:10] | 准备金 | 预留. |  |
| ECX[31:0] | 准备金 | 预留. |  |
| EDX[31:0] | 准备金 | 预留. |  |
