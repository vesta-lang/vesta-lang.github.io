---
summary: 预选数据输入 Caches
---

## 说明

从包含用 源操作数 指定的字节的内存中获取数据或代码的行(指示字节)到一个地方提示指定的缓存结构中的位置:

* T0(时间数据) - 预留数据进入缓存层次的各级. * T1(第一级缓存丢失的时段数据) - 预留数据进入第二级缓存并更高. * T2(关于第二级别缓存缺失的时段数据)-预留数据进入第三级别缓存和更高,或

具体执行的选择。

* NTA(关于所有缓存级别的非时态数据) - 预选数据进入非时态缓存结构及

进入一个靠近处理器的位置,尽量减少缓存污染。

* IT0(时序代码) - 预置代码进入缓存层次的各级. * IT1(关于第一级缓存缺失的时序代码) - 预选代码进入除第一级以外的所有

缓存等级 。

源操作数是一个字节内存位置. (使用 ModR/M 字节中的位数 3 至 5 编码到机器级别指令中的地方提示) 某些地方提示可能只为 RIP 相对的内存地址预设;见下文的额外细节. 预选的地址是NextRIP+32位移位,其中NextRIP是遵循预选指令本身的指令的第一个字节.

如果选中的行已经在缓存层次层中以更接近处理器的级别存在,则不会发生数据移动. 来自无法取用或WC记忆的预费被忽略.

PREFETCHh 指令只是提示,不影响程序行为. 如果执行,本指令将数据移动到处理器附近,以预想未来使用.

预选位置提示的实现取决于执行,可以被处理器执行超载或忽略. 预选的数据或代码行的数量也依赖处理器执行. 不过,这至少是32字节。 Intel(R)64和IA-32《建筑优化参考手册》第7.4节介绍了更多关于取决于实施的地方提示的细节。

应当指出的是,处理器可以自由地从系统内存区域投机获取和缓存数据,这些区域被分配到允许投机阅读的内存类型(即WB、WC和WT内存类型)。 A级

PREFETCHh指示被认为是这种投机行为的暗示. 由于这种投机性抓取可以随时发生,并且不与指令执行捆绑,因此没有针对栅栏指令(MFENCE,SFENCE,和LFENCE)或锁定的内存引用命令PREFETCHh指令. 对CLFLUSH和CLFLUSHOPT指示、其他PREFETCHh指示或任何其他一般指示,也无命令。 命令涉及CPUID、WRMSR、OUT和MOV CR等序列化指令。

PREFETCHIT0/1可以使用64位模式,使用RIP相对地址;否则它们仍然是NOP. 为了实现最佳的性能,这些指令所使用的地址应该是真实指令的开头字节.

PREFETCHIT0/1指令由CPUID.07H.01H:EDX.PREFETCHI[14]列出. 编码在不列举这些指令的处理器中仍然是NOP.

## 行动

```text
FETCH (m8);
```

## Intel C/C++ 内在编译器

```c
void _mm_prefetch(char *p, int i) The argument "*p" gives the address of the byte (and corresponding cache line) to be prefetched. The value "i" gives a constant (_MM_HINT_T0, _MM_HINT_T1, _MM_HINT_T2, _MM_HINT_NTA, _MM_HINT_IT0, or _MM_HINT_IT1) that specifies the type of prefetch operation to be performed.;
```

## 数字例外

None.
