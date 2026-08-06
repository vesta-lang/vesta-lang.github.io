---
summary: 读取模式特定登记册列表
---

## 说明

本指令读取了软件提供的最多64个MSR的列表,并将其值存储在内存中.

RDMSRLIST 需要三个暗示输入 操作数:

* RSI : (英语). MSR地址表的线性地址(每个地址8字节)1。 * RDI : (英语). MSR数据存储的表格的线性地址(每MSR有8字节). * RCX:用于MSR的64位有效位元罩. Bit 0是每个表格中条目0等的有效位.

对于每个 RCX 位 [n] 从 0 到 63, 如果 RCX [n] 是 1, RDMSRLIST 将读取 RSI 表格中条目 [n] 指定的 MSR , 在 RDI 表格中条目 [n] 将其写入内存 。

这意味着最多可使用本指令处理的64个MSR. 处理器将在完成对MSR的处理后清除RCX[n]. 与重复的字符串操作类似,RDMSRLIST支持部分完成中断,例外,和陷阱. 在这种情况下,保存的RIP寄存器会指向RDMSRLIST指示,而RCX寄存器则会清除与所有已完成的迭代对应的位元.

此指令必须在特权级别 0 执行; 否则将生成一般保护例外 #GP(0) 。 本指令以与RDMSR相同的方式执行MSR特定检查.

虽然RDMSRLIST按顺序访问两个表格中的条目,但MSR的实际读数可能会出现异常: 对于表格条目 m < n,处理器在读 MSR 的条目 m 之前可以读 MSR 为条目 n. (对于RDMSR的处决顺序也可能是这样)如果在MSR地址表中出现IA32 BARRIER MSR(2FH)的地址,则命令是有保障的. 具体地说,如果IA32 BARRIER出现在条目m,那么MSR读作含有 n > m的任何条目n,则在(1) RDMSRLIST之前的所有指令都在当地完成之前不会发生;(2)条目m之前所有表格条目的MSR已经读取.

处理器被允许(但不需要)在列表中"提前装入". 例如,尽管处理器只读出n MSRs,但它可能导致一个页面错误在nth之后访问表项。

## 行动

```text
DO WHILE RCX != 0

    MSR_index := position of least significant bit set in RCX;
    Load MSR_address_table_entry from 8 bytes at the linear address RSI + (MSR_index * 8);
    IF MSR_address_table_entry[63:32] != 0 THEN #GP(0); FI;
    MSR_address := MSR_address_table_entry[31:0];
    IF RDMSR of the MSR with address MSR_address would #GP THEN #GP(0); FI;
    Store the value of the MSR with address MSR_address into 8 bytes at the linear address RDI + (MSR_index * 8);
    RCX[MSR_index] := 0;
    Allow delivery of any pending interrupts or traps;
OD;

1. Since MSR addresses are only 32-bits wide, bits 63:32 of each MSR address table entry is reserved.

2. For example, the processor may take a page fault due to a linear address for the 10th entry in the MSR address table despite only
    having completed the MSR reads up to entry 5.
```

## 受影响的旗帜

None.
