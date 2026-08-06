---
summary: 预选矢量数据输入刻录和 T1 提示
---

## 说明

从包含 源操作数 指定的字节的内存中获取数据行到以写入提示(通过请求所有权将数据带入"排除"状态)和地点提示指定的缓存结构中的位置:

* T1(关于一级缓存的时态数据)-预留数据进入二级缓存.

源操作数是一个字节内存位置. (使用 ModR/M 字节中的位数 3 至 5 编码到机器级别指令中的位置提示。) 使用指定值以外的任何 ModR/M 值会导致不可预测的行为. )

如果选中的行已经在缓存层次层中以更接近处理器的级别存在,则不会发生数据移动. 来自无法取用或WC记忆的预费被忽略.

PREFETCHWT1指令只是提示,不影响程序行为. 如果执行,本指令将数据移动到处理器附近,以预想未来使用.

预选位置提示的实现取决于执行,可以被处理器执行超载或忽略. 预选数据的数量也依赖处理器执行. 不过,这至少是32字节。 更多关于依赖执行的地方提示的细节,见Intel(R)64和IA-32架构优化参考手册第9.5节"使用预选的记忆优化".

应当指出的是,处理器可以自由地从系统内存区域投机获取和缓存数据,这些区域被分配到允许投机阅读的内存类型(即WB、WC和WT内存类型)。 PREFETCHWT1指令被认为是这种投机行为的暗示. 由于这种投机性抓取可以随时发生,并且不与指令执行绑定,因此对栅栏指令(MFENCE,SFENCE,和LFENCE)或锁定的内存引用,没有命令PREFETCHWT1指令. PREFETCHWT1指令对于CLFLUSH和CLFLUSHOPT指令,其他PREFETCHWT1指令,或任何其他一般指令,也无命令. 命令涉及CPUID、WRMSR、OUT和MOV CR等序列化指令。

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
PREFETCH(mem, Level, State) Prefetches a byte memory location pointed by `mem' into the cache level specified by `Level'; a request
for exclusive/ownership is done if `State' is 1. Note that the memory location ignore cache line splits. This operation is considered a
hint for the processor and may be skipped depending on implementation.

Prefetch (m8, Level = 1, EXCLUSIVE=1);
```

## 受影响的旗帜

所有旗帜都受到影响。

C/C++ 编译器内置等效空格  mm  prefetch(字符 const *, int提示= MM HINT ET1);
