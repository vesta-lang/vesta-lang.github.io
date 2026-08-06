---
summary: 比较和交换
---

## 说明

比较在 AL, AX, EAX, 或 RAX 注册中与第一个 操作数 (目标操作数) 的值. 如果两个值相等,第二个操作数(源操作数)被装入目标操作数. 否则,目标操作数会被装入AL,AX,EAX或RAX的注册. RAX寄存器仅以64位模式提供.

此指令可用 LOCK 前缀来允许指令在原子上执行. 为了简化处理器总线的接口,目标操作数在不考虑比较结果的情况下得到一个写周期. 如果比较失败, 目标操作数 会被写回;否则, 源操作数 会被写回目的地. (处理器从不产生锁定的读数,而不产生锁定的写字).

在64位模式下,指令的默认操作大小为32位. 使用REX.R前缀可以访问额外的登记册(R8-R15). 使用REX.W前缀将操作提升到64位. 参见本节开头的汇总图,用于编码数据和限制.

## IA-32 架构兼容性

本指令在英特尔处理器上不比英特尔486处理器更早得到支持.

## 行动

```text
(* Accumulator = AL, AX, EAX, or RAX depending on whether a byte, word, doubleword, or quadword comparison is being performed *)

TEMP := DEST

IF accumulator = TEMP

    THEN
          ZF := 1;
          DEST := SRC;

    ELSE
          ZF := 0;
          accumulator := TEMP;
          DEST := TEMP;

FI;
```

## 受影响的旗帜

如果 目标操作数 和注册 AL, AX 或 EAX 中的值相等,则设置 ZF 旗;否则清除. CF,PF,AF,SF,以及OF旗根据比较操作的结果设置.
