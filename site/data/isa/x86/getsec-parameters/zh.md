---
summary: 报告 SMX 参数
---

## 说明

GETSEC[PARAMETERS]指令返回处理器支持的SMX特性的特定参数信息. 参数信息在EAX,EBX,和ECX中返回,输入参数选择使用EBX.

软件检索参数信息,从0开始使用EBX的输入索引检索,然后在EAX,EBX,和ECX读取返回的结果. EAX [4:0] 被指定返回一个参数类型字段,表示是否有参数及其类型. 如果 EAX [4:0] 以 0 返回,则此处指定一个无效参数,并表明不再有参数可用.

表7-7界定了当前和未来执行中支持的参数类型。

** SMX 报告参数格式**

| EAX 类型 [4: 0] | 参数描述 | EAX[31:5] | EBX[31:0] | ECX[31:0] |
| --- | --- | --- | --- | --- |
| 0 | NULL | 保留(0份退回) | 保留(未修改) | 保留(未修改) |
| 1 | 支持的AC模块版本 | 保留(0份退回) | 版本比较掩码 | 支持的版本编号 |
| 2 | 认证代码执行区域的最大大小 | 以字节表示大小乘以 32 | 保留(未修改) | 保留(未修改) |
| 3 | AC模式下支持的外部内存类型 | 内存类型比特掩码 | 保留(未修改) | 保留(未修改) |
| 4 | 选择 SENTER 功能控制 | EAX [14: 8] 对应可用的 SENTER 函数禁用控制 | 保留(未修改) | 保留(未修改) |
| 5 | TXT 扩展支持 | TXT 特性扩展旗(见表) | 准备金 | 准备金 |
| 6-31 | 未定义 | 保留(未修改) | 保留(未修改) | 保留(未修改) |

** TXT 特性扩展旗**

| 位数 | 定义 | 说明 |
| --- | --- | --- |
| 5 | 基于 S- CRTM 的处理器 | 如果此处理器执行基于处理器的 S- CRTM 能力, 返回 1, 如果 0 |
|  | 支助 | 不是(S-CRTM根植于BIOS). 此旗帜不能用来推断芯片是支持TXT,还是处理器支持SMX. |
| 6 | 机器检查处理 | 如果它通过ENTERACCS和SENTER保存机器检查状态登记册,则返回 1。 如果这个位是1,则不需要ENTERACCS和SENTER的调用器在引用这些GETSEC 叶之前清除机器检查错误状态位. 如果此位返回 0, ENTERACCS 和 SENTER 的调用器必须在引用这些 GETSEC 叶 之前清除所有机器检查错误状态位. |
| 31:7 | 准备金 | 预留未来使用. 将返回0。 |

支持的AC模块版本(由AC模块HeaderVersion域定义)可以通过类型1参数为特定的SMX处理器确定. 使用EBX通过GETSEC[PARAMETERS]报告的现有参数,为返回的1型的每一独有参数集进行索引,软件可以确定所支持的AC模块版本的完整列表.

对于每个参数集,EBX返回比较掩码,ECX返回所支持的现有headerVersion字段值,在AND'ing目标headerVersion与比较掩码之后. 然后,软件可以确定某一AC模块版本是否通过遵循下面给出的伪码搜索常规来支持:

parameter_search_index= 0 do {

EBX= parameter_search_index++ EAX= 6 GETSEC if (EAX[4:0] = 1) {

if ((version_query & EBX) = ECX) { version_is_supported= 1 break

} } } while (EAX[4:0]  0)

如果处理器只支持标题为0的AC模块,则只返回1型的一组参数,具体如下: EAX = 00000001H, (中文(简体) ).

EBX = FFFFFFFFH 和 ECX = 00000000H.

处理器支持的认证代码执行区的最大容量用参数类型为2来报告. 最大支持的字节大小由返回的EAX[31:5]大小乘以32决定. 因此,对于最大支持的验证大小为32KBytes的RAM,EAX以00008002H返回.

在已认证代码执行区外映射的内存可支持的内存类型以参数类型3报告. 虽然是活跃的,由GETSEC函数SENTER和ENTERACCS发起,由EXITAC终止,但对系统内存的其余部分允许哪些内存类型有限制. 系统软件的责任是初始化内存类型域寄存器(MTRR)MSR和/或页面属性表(PAT),只映射符合此参数报告的内存类型. 使用 EAX [31:8] 中返回的位图来表示可支持的内存类型外部内存的报告. 这些位位置对应MTRR MSR和PAT编程中定义的内存类型编码. 见

Table 7-9.

4的参数类型用于列举选择性GETSEC[SENTER]函数禁用控件的可用性. 如果以返回参数EAX的14:8的位数报告一个1,那么这表示对特定函数存在SENTER的禁用控制能力. 14:8中列举的字段对应EDX输入参数比特6:0的SENTER使用. 如果列出的字段位设为1,那么对应的EDX输入参数位EDX可以设为1,以禁用指定的函数. 如果列举的字段位是0,或者这个参数没有被报告,那么没有使用对应的EDX输入参数的SENTER的禁用能力,EDX比特(s)必须清除到0,才能执行SENTER. 如果所列举的 SENTER 不存在选择性的禁用能力,那么如果设置了 SENTER 的 MSR 中 MSR 的 Zq32 FEATURE CONTROL MSR 位中对应的位,则也必须编程到 1 . 之所以需要这样做,是为了将来能够扩展SENTER选择性的禁用能力,使之适用于MSR的潜在单独软件初始化。

EAX 位位置表 7-9. 外部内存类型 使用参数 3 8 参数 描述 9 无法完成(UC) 11:10 书写组合(WC) 12 保留书写(WT)

13 SAFER MODE EXTENSIONS REFERENCE 14 31:15 表7-9. 外部内存类型 使用参数3( Contd.) 写保护(WP) 回写(WB) 保留

如果给定的 GETSEC [PARAMETERS] 叶 或特定参数没有为给定的 SMX 能力处理器显示,那么应该假设默认参数值. 这些定义见表7-10。

** 参数值**

| EAX 型参数 [4:0] | 默认设置 | 参数描述 |
| --- | --- | --- |
| 1 | 仅 0.0 | 支持AC模块版本. |
| 2 | 32 K字节 | 经认证的代码执行区域大小 。 |
| 3 | 仅UC | 在AC执行模式下支持的外部内存类型. |
| 4 | 无 | 可用的 SENTER 选择性禁用控制 。 |

## 行动

```text
(* example of a processor supporting only a 0.0 HeaderVersion, 32K ACRAM size, memory types UC and WC *)
IF (CR4.SMXE=0)

    THEN #UD;
ELSE IF (in VMX non-root operation)

    THEN VM Exit (reason="GETSEC instruction");
ELSE IF (GETSEC leaf unsupported)

    THEN #UD;
    (* example of a processor supporting a 0.0 HeaderVersion *)
IF (EBX=0) THEN
    EAX := 00000001h;
    EBX := FFFFFFFFh;
    ECX := 00000000h;
ELSE IF (EBX=1)
    (* example of a processor supporting a 32K ACRAM size *)
    THEN EAX := 00008002h;
ESE IF (EBX= 2)
    (* example of a processor supporting external memory types of UC and WC *)
    THEN EAX := 00000303h;
ESE IF (EBX= other value(s) less than unsupported index value)
    (* EAX value varies. Consult Table 7-7 and Table *)
ELSE (* unsupported index*)
    EAX := 00000000h;
END;
```

## 受影响的旗帜

None.

使用前缀原因 #UD. LOCK 原因 #UD(包括REPNE/REPNZ和REP/REPE/REPZ). REP* 原因 #UD. 操作大小

NP 66/F2/F3 前缀不允许使用.

线段覆盖已忽略 。

地址大小已忽略 。

REX           Ignored.
