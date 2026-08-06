---
summary: 记忆栅栏
---

## 说明

在 MFENCE 指令之前发布的所有从记忆和储存到记忆的指令上进行序列化操作。 这种序列化操作保证了MFENCE指令前的每一个负载和存储指令在遵循MFENCE指令的任何负载或存储指令之前,都会在全球范围可见. 1 MFENCE指令是针对所有负载和存储指令,其他MFENCE指令,任何LFENCE和SFENCE指令,以及任何序列化指令(如CPUID指令)下达的指令. MFENCE不序列化指令流.

弱序内存类型可以用来通过排外发行,投机读取,书写组合,书写拼接等技术实现更高的处理器性能. 数据消费者在多大程度上承认或知道数据排序薄弱,各应用程序各不相同,这些数据的生产者可能不知道。 MFENCE指令提供了一种高效的性能方法,可确保在产生低排序结果的常规和消耗该数据的常规之间进行加载和存储顺序.

处理器可以自由地从使用WB,WC,和WT内存类型的系统内存区域随机获取和缓存数据. 这种投机性获取可能随时发生,与指令执行无关. 因此,对MFENCE指令的处决不下达命令;数据可在MFENCE指令执行之前、期间或之后的推测中输入缓存。

此指令的操作在非64位模式和64位模式中是相同的.

上面指示的操作码的规格表示一个ModR/M字节为F0. 对于此指令,处理器忽略了ModR/M字节的r/m字段. 因此,MFENCE由0F AE Fx形式的任何操作码编码,其中x在0-7之间.

## 行动

```text
Wait_On_Following_Loads_And_Stores_Until(preceding_loads_and_stores_globally_visible);
```

## Intel C/C++ 内在编译器

```c
void _mm_mfence(void) Exceptions (All Modes of Operation) #UD                   If CPUID.01H:EDX.SSE2[26] = 0. If the LOCK prefix is used.;
```
