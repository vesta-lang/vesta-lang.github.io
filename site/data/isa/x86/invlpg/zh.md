---
summary: 无效的 TLB 条目
---

## 说明

无效使用 源操作数 指定的任何翻译外观缓冲( TLB) 条目 。 源操作数是一个内存地址. 处理器确定包含该地址的页面,并冲掉该页面的所有 TLB 条目。

INVLPG指令是一种特殊指令. 当处理器在 保护模式 运行时, CPL 必须是 0 执行此指令 。

INVLPG指令通常只对指定的页面冲洗TLB条目;然而,在某些情况下,它可能冲洗更多的条目,甚至整个TLB. 该指令取消了与当前PCID相关的TLB条目,对于与其他PCID相关的TLB条目,可以也可以不这样做. (如果 PCID 已禁用 - CR4.PCIDE = 0 - 当前 PCID 是 000H. ) 该指令也使指定页面的任何全局性 TLB 条目无效,无论 PCID.

欲了解更多关于冲洗TLB,见 "MOV- 移动到/调出控制注册簿",载于Intel(R)64和IA-32架构软件开发者手册第2B卷和第5.10.4.1节,"使TLB和Page-Structure Caches无效的操作",载于Intel(R)64和IA-32架构软件开发者手册第3A卷.

此指令的操作在所有非64位模式中都是相同的. 它也在64位模式下运行相同,除非内存地址为非卡通形式. 在这种情况下,INVLPG与一个NOP相同.

## IA-32 架构兼容性

INVLPG指令依赖于执行,其功能可能会在Intel 64或IA-32处理器的不同家族上得到不同的执行. 此指令在IA-32处理器上不比Intel486处理器更早得到支持.

## 行动

```text
Invalidate(RelevantTLBEntries);
Continue; (* Continue execution *)
```

## 受影响的旗帜

None.
