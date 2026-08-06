---
summary: 装入栅栏
---

## 说明

在 LFENCE 指令前发布的所有装入式指令上执行序列化操作 。 具体地说,LFENCE在本地完成所有前置指令之前不会执行,在LFENCE完成之前不会在以后指令开始执行. 特别是,一个从内存加载且先于LFENCE的指令在LFENCE完成前接收来自内存的数据. (An LFENCE遵循一个存储存储内存的指令可能会在存储的数据变得全球可见之前完成. ) LFENCE之后的指令可能会在LFENCE之前从内存中获取,但在LFENCE完成前不会执行(甚至推测).

弱序内存类型可以通过异序发行和投机读取等技术来达到更高的处理器性能. 数据消费者在多大程度上承认或知道数据排序薄弱,各应用程序各不相同,这些数据的生产者可能不知道。 LFENCE指令提供了一种高效的性能方法,可确保在产生弱序结果的常规和消耗该数据的常规之间进行负载顺序。

处理器可以自由地从使用WB,WC,和WT内存类型的系统内存区域随机获取和缓存数据. 这种投机性获取可能随时发生,与指令执行无关. 因此,对LFENCE指令的处决不下达命令;数据可在LFENCE指令执行之前、期间或之后的推测中输入缓存。

此指令的操作在非64位模式和64位模式中是相同的.

上面指示的操作码的规格表示一个ModR/M字节为E8. 对于此指令,处理器忽略了ModR/M字节的r/m字段. 因此,LFENCE由0F AE Ex形式的任何操作码编码,其中x位于8-F范围.

## 行动

```text
Wait_On_Following_Instructions_Until(preceding_instructions_complete);
```

## Intel C/C++ 内在编译器

```c
void _mm_lfence(void) Exceptions (All Modes of Operation) #UD                 If CPUID.01H:EDX.SSE2[26] = 0. If the LOCK prefix is used.;
```
