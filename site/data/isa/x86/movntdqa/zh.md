---
summary: 装入双四字形非时态对齐提示
---

## 说明

MOVNTDQA从源操作数(第二个操作数)到目标操作数(第一个操作数)加载一个双四字,如果内存来源是WC(写入组合)内存类型,则使用非时空提示. 对于WC内存类型,非时空提示可能通过在缓存中不填充此数据而加载相当于对齐缓存行的临时内部缓冲器来实现. 缓存中的任何内存型别名行都将被监视和冲洗. 之后的MOVNTDQA读取到WC缓存线的未读部分,如果有数据,将会收到临时内部缓冲器的数据. 临时内部缓冲器可能出于任何理由随时被处理器冲走,例如:

* MOVNTDQA以外的负载操作,该操作引用了临时内部存储的内存

buffer.

* 非WC参考存储器已存在临时内部缓冲. * 将读写连接到一个临时的内部缓冲器。 * 在流线中重复(V)MOVNTDQA对特定16字节项的负载. * 某些微观结构条件,包括资源短缺、检测误测条件,

和各种错误条件。

非时空提示是通过在从内存读取数据时使用结合(WC)内存类型协议的写法来实现的. 使用此协议,处理器不会将数据读入缓存层级,也不会将相应的缓存行从内存中提取到缓存层级. 如果为非时读所指定的内存地址不是WC内存区域,被读区域的内存类型可以凌驾于非时读提示. 非时空读写信息可见于"Caching of Temperal vs. 在英特尔(R)64和IA-32架构软件开发者手册第3A卷第10章中的非时空数据".

由于WC协议使用一个弱排序的内存一致性模型,如果多个处理器可能为引用的内存位置使用不同的内存类型,或者将处理器的读取与书写者同步,那么使用MFENCE指令的栅栏操作应当与MOVNTDQA指令结合使用.

1. ModRM.MOD != 011B

系统中的其他特工 一个处理器对流载提示的实现并不凌驾于有效的内存类型,但提示的实现取决于处理器. 例如,一个处理器执行可能选择忽略提示,将指令作为任何内存类型的普通MOVDQA处理. 或者,另一个执行可能会优化由 MOVNTDQA 在WB内存类型上生成的缓存读取,以减少缓存驱逐.

128位(V)MOVNTDQA地址必须是16字节对齐,否则指令会导致#GP.

256位的VMOVNTDQA地址必须是32字节对齐,否则指令将导致#GP.

512位VMOVNTDQA地址必须是64字节对齐,否则指令会导致#GP.

## 行动

```text
MOVNTDQA (128bit- Legacy SSE Form)
DEST := SRC
DEST[MAXVL-1:128] (Unmodified)

VMOVNTDQA (VEX.128 and EVEX.128 Encoded Form)
DEST := SRC
DEST[MAXVL-1:128] := 0

VMOVNTDQA (VEX.256 and EVEX.256 Encoded Forms)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0

VMOVNTDQA (EVEX.512 Encoded Form)
DEST[511:0] := SRC[511:0]
DEST[MAXVL-1:512] := 0
```

## Intel C/C++ 内在编译器

```c
VMOVNTDQA __m512i _mm512_stream_load_si512(__m512i const* p);
MOVNTDQA __m128i _mm_stream_load_si128 (const __m128i *p);
VMOVNTDQA __m256i _mm256_stream_load_si256 (__m256i const* p);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-18"第1类例外条件".

EVEX-encoded discription,参见表2-47,"Type E1NF 类例外条件".

Additionally:

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```
