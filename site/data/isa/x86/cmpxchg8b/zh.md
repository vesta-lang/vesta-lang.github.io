---
summary: 比较和交换字节
---

## 说明

将EDX:EAX中的64位值(或128位值为RDX:RAX,如果操作数大小是128位)与操作数(目标操作数)进行比较. 如果数值相等,则以ECX:EBX的64位值(或以RCX:RBX的128位值)存储在目标操作数. 否则,目标操作数中的值会被加载到EDX:EAX(或RDX:RAX)中. 目标操作数是一个8字节的内存位置(或16字节的内存位置,如果操作数大小是128位). 对于EDX:EAX和ECX:EBX注册对,EDX和ECX包含高序32位,EAX和EBX包含64位值的低序32位. 对于RDX:RAX和RCX:RBX注册对,RDX和RCX包含高序64位,RAX和RBX包含128位值的低序64位.

此指令可用 LOCK 前缀来允许指令在原子上执行. 为了简化处理器总线的接口,目标操作数在不考虑比较结果的情况下得到一个写周期. 如果比较失败, 目标操作数 会被写回;否则, 源操作数 会被写回目的地. (处理器从不产生锁定的读数,而不产生锁定的写字).

在64位模式下,默认操作大小为64位. 使用REX.W前缀将操作提升到128位. 注意CMPXCHG16B要求目的地(memory)操作数为16字节对齐. 参见本节开头的汇总图,用于编码数据和限制. 关于表示CMPX-CHG16B的CPUID旗的信息,参见Intel(R)64和IA-32架构软件开发者手册第1卷第21章.

## IA-32 架构兼容性

这种指令编码在英特尔处理器上不比Pentium处理器早得到支持.

## 行动

```text
IF (64-Bit Mode and OperandSize = 64)
    THEN
          TEMP128 := DEST

        IF (RDX:RAX = TEMP128)

                THEN
                      ZF := 1;
                      DEST := RCX:RBX;

                ELSE
                      ZF := 0;
                      RDX:RAX := TEMP128;
                      DEST := TEMP128;
                      FI;

          FI
    ELSE

          TEMP64 := DEST;

        IF (EDX:EAX = TEMP64)

                THEN
                      ZF := 1;
                      DEST := ECX:EBX;

                ELSE
                      ZF := 0;
                      EDX:EAX := TEMP64;
                      DEST := TEMP64;
                      FI;

          FI;
FI;
```

## 受影响的旗帜

若目标操作数和EDX:EAX等值,则设置ZF旗;否则清除. CF、PF、AF、SF和OF旗帜不受影响。
