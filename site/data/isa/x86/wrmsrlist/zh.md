---
summary: 写入特定示范登记册清单
---

## 说明

本指令会写一个软件提供的最多64个MSR的列表,其中包含来自内存的值.

WRMSRLIST 需要三个暗示输入 操作数:

* RSI : (英语). MSR地址表的线性地址(每个地址8字节)1。 * RDI : (英语). 一个MSR数据从中加载的表格的线性地址(每MSR有8字节). * RCX:用于MSR的64位有效位元罩. Bit 0是每个表格中条目0等的有效位.

对于每个 RCX 位 [n] 从 0 到 63, 如果 RCX [n] 是 1, WRMSRLIST 将写入 RSI 基于表格的条目 [n] 中指定的 MSR , 其值在 RDI 基于表格的条目 [n] 中读取。

这意味着最多可使用本指令处理的64个MSR. 处理器将在完成对MSR的处理后清除RCX[n]. 与重复的字符串操作类似,WRMSRLIST支持部分完成中断,例外,和陷阱. 在这种情况下,保存的RIP寄存器会指向MSRLIST指示,而RCX寄存器则会清除与所有已完成的迭代对应的位元.

此指令必须在特权级别 0 执行; 否则将生成一般保护例外 #GP(0) 。 本指令以与WRMSR相同的方式执行MSR特定检查.

和WRMSRNS(和WRMSR不同)一样,WRMSRLIST不定义为序列化指令(参见Intel(R)64和IA-32架构软件开发者手册第3A卷第11章中的"序列化指令"). 这意味着软件不应该依赖WRMSRLIST在获取和执行下一个指令之前将所有缓冲的写作排入内存. 出于执行原因,一些处理器在撰写某些MSR时可能会序列化,尽管这得不到保证.

和WRMSR和WRMSRNS一样,WRMSRLIST确保WRMSRLIST之前的所有操作不使用任何新的MSR值,并确保WRMSRLIST之后的所有操作都使用新的值. 这一规则的一个例外是某些商店相关的性能监视器事件,它们只有在被消耗到内存时才会计数商店. 由于WRMSRLIST不是一个序列化指令,如果软件使用WRMSRLIST来改变此类性能-监视器事件的控制,那么WRMSRLIST之前发布的存储可以根据WRMSRLIST建立的控制进行计算. 如果需要,软件可以在WRMSRLIST前插入SERIALIZE指令.

那些在通过WRMSR(如MTRRs)写入时导致TLB无效的MSR也会在WRMSRLIST写入时导致同样的TLB无效.

在WRMSR作为序列化指令的代名词的地方,可以使用不同的序列化指令(如SERIALIZE).

WRMSRLIST按顺序写作MSR,这意味着处理器将确保在重排"n"中一个MSR只有在之前重排("n-1")后才能写成. 如果更古老的MSR写作具有影响下一个MSR行为的副作用,处理器将确保副作用被尊重.

处理器被允许(但不需要)在列表中"提前装入". 以下是处理器可能做的事情的例子:

* 使用旧的内存类型或 TLB 条目来装载或存储包含表格的内存, 尽管有 MSR

由先前的迭代更改 MTRR 或无效的 TLB 写入。

1. 联合国 由于MSR地址只有32位宽,因此每个MSR地址表条目的比特为63:32保留.

* 尽管处理器只写了 n MSRs, 因为在 nth 之后访问表项时要使用 页面错误 。

## 行动

```text
DO WHILE RCX != 0
    MSR_index := position of least significant bit set in RCX;
    Load MSR_address_table_entry from 8 bytes at the linear address RSI + (MSR_index * 8);
    IF MSR_address_table_entry[63:32] != 0 THEN #GP(0); FI;
    MSR_address := MSR_address_table_entry[31:0];
    Load MSR_data from 8 bytes at the linear address RDI + (MSR_index * 8);
    IF WRMSR of MSR_data to the MSR with address MSR_address would #GP THEN #GP(0); FI;
    Load the MSR with address MSR_address with MSR_data;
    RCX[MSR_index] := 0;
    Allow delivery of any pending interrupts or traps;

OD;
```

## 受影响的旗帜

None.
