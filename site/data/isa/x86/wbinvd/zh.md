---
summary: 回写无效缓存
---

## 说明

将处理器内部缓存中所有修改过的缓存行写回主内存,并取消内部缓存(flushes). 指令随后发布了一个特殊功能总线周期,指令外部缓存同时写入修改后的数据,另一个总线周期则表示外部缓存应当无效.

执行此指令后, 处理器不会等待外部缓存完成回写和冲洗操作, 然后再执行指令 。 硬件的责任是响应缓存回写和冲洗信号. WBINVD完成的时间或周期因大小和不同缓存等级的其他因素而异. 因此,使用WBINVD指令会对逻辑处理器中断/事件响应时间产生影响. 关于WBINVD在具有分级共享地形的缓存层级中的行为的额外信息,可参见Intel(R)64和IA-32架构软件开发者手册第3A卷第2章.

WBINVD指令是一种特殊指令. 当处理器在 保护模式 运行时,程序或程序的 CPL 必须是 0 执行此指令. 本指令也是序列化指令(参见英特尔(R)64和IA-32架构软件开发者手册第3A卷第9章中的"序列化指令").

在缓存与主内存的一致性不引起关注的情况下,软件可以使用INVD指令.

此指令的操作在非64位模式和64位模式中是相同的.

## IA-32 架构兼容性

WBINVD指令依赖于执行,其功能可能与未来的Intel 64和IA-32处理器不同. 该指令在IA-32处理器上不比Intel486处理器更早得到支持.

## 行动

```text
WriteBack(InternalCaches);
Flush(InternalCaches);
SignalWriteBack(ExternalCaches);
SignalFlush(ExternalCaches);
Continue; (* Continue execution *)

void _wbinvd(void)Flags Affected

None.
```
