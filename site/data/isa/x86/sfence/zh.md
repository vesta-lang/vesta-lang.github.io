---
summary: 存储栅栏
---

## 说明

相对于SFENCE指令前的所有内存存储,命令处理器执行. 处理器确保SFENCE之前的每个商店在SFENCE之后的任何商店都在全球可见. SFENCE指令针对内存存储,其他SFENCE指令,MFENCE指令,以及任何序列化指令(如CPUID指令). 它不是针对内存负载或LFENCE指令命令的.

弱序内存类型可以通过出订单发行,书写组合,书写拼接等技术,实现更高的处理器性能. 数据消费者在多大程度上承认或知道数据排序薄弱,各应用程序各不相同,这些数据的生产者可能不知道。 SFENCE指令提供了一种高效的性能方法,可确保存储顺序在产生低排序结果的常规和消耗这些数据的常规之间.

此指令的操作在非64位模式和64位模式中是相同的.

上面指示的操作码的规格表示一个ModR/M字节为F8. 对于此指令,处理器忽略了ModR/M字节的r/m字段. 因此,SFENCE由0F AE Fx形式的任何操作码编码,其中x位于8-F范围.

## 行动

```text
Wait_On_Following_Stores_Until(preceding_stores_globally_visible);
```

## Intel C/C++ 内在编译器

```c
void _mm_sfence(void);
```
