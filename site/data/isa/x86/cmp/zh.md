---
summary: 比较两个 操作数
---

## 说明

将 第一源操作数 与 第二源操作数 相比较,并根据结果在 EFLAGS 登记册中设置 状态标志 . 比较方法是从第一个操作数中减去第二个操作数,然后以与SUB指令相同的方式设置状态标志. 当一个即时值被用作操作数时,其符号扩展至第一个操作数的长度.

Jcc,CMOVcc,SETcc指令所使用的条件代码是基于CMP指令的结果. 附录B"EFLAGS条件代码"在Intel(R)64和IA-32架构软件开发者手册第1卷中显示了状态标志与条件代码的关系.

在64位模式下,指令的默认操作大小为32位. 使用REX.R前缀可以访问额外的登记册(R8-R15). 使用REX.W前缀将操作提升到64位. 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
temp := SRC1 - SignExtend(SRC2);
ModifyStatusFlags; (* Modify status flags in the same manner as the SUB instruction*)
```

## 受影响的旗帜

CF,OF,SF,ZF,AF,和PF的旗帜根据结果设置.
