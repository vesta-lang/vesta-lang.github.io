---
summary: 回写和不无效缓存
---

## 说明

WBNOINVD指令将处理器内部缓存中所有修改过的缓存行写回主内存,但不会使内部缓存失效(flush).

执行此指令后, 处理器不会等待外部缓存完成回写操作, 然后再执行指令 。 响应缓存回写信号是硬件的责任. WBNOINVD完成的时间或周期因大小和不同缓存等级的其他因素而异. 因此,使用WBNOINVD指令会对逻辑处理器中断/事件响应时间产生影响.

WBNOINVD指令是一种特殊指令. 当处理器在 保护模式 运行时,程序或程序的 CPL 必须是 0 执行此指令. 本指令也是序列化指令(参见英特尔(R)64和IA-32架构软件开发者手册第3A卷第9章中的"序列化指令").

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
WriteBack(InternalCaches);
Continue; (* Continue execution *)
```

## Intel C/C++ 内在编译器

```c
WBNOINVD void _wbnoinvd(void);
```

## 受影响的旗帜

None.
