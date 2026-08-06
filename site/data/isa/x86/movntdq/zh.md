---
summary: 使用非临时提示存储包装整数
---

## 说明

使用非时序提示将 源操作数(第二位 操作数) 中装入的整数移动到 目标操作数(第一位 操作数) ,以防止在写入内存时将数据缓存. 源操作数是一个XMM的寄存器,YMM寄存器或ZMM寄存器,它被假定包含整数数据(包字节,单词,双词,或四字). 目标操作数是一个128位,256位或512位的内存位置. 内存操作数必须在16字节(128位版本),32字节(VEX.256编码版本)或64字节(512位版本)的边界上对齐,否则会产生一般保护例外(#GP).

非时空提示是通过在将数据写入内存时使用结合(WC)内存类型协议的写法来实现的. 使用此协议,处理器不会将数据写入缓存层级,也不会将相应的缓存行从内存中提取到缓存层级中. 如果为非时空存储指定的内存地址位于不可切换的(UC)或写入受保护的(WP)内存区域,被写入区域的内存类型可以覆盖非时空提示. 关于非时空商店的更多信息,见"Caching of Temperal vs. 非时空数据"在IA-32 Intel架构软件开发者手册第10章第1卷.

由于WC协议使用一种命令不严的内存一致性模型,如果多个处理器可能使用不同的内存类型来读写/写入目的地内存位置,那么与SFENCE或MFENCE指令一起执行的栅栏操作应当与VMOVNTDQ指令一起使用.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,VEX.L必须是0;否则会发出指示

```text
#UD.
```

## 行动

```text
VMOVNTDQ(EVEX Encoded Versions)
VL = 128, 256, 512
DEST[VL-1:0] := SRC[VL-1:0]

1. ModRM.MOD != 011B


DEST[MAXVL-1:VL] := 0

MOVNTDQ (Legacy and VEX Versions)
DEST := SRC
```

## Intel C/C++ 内在编译器

```c
VMOVNTDQ void _mm512_stream_si512(void * p, __m512i a);
VMOVNTDQ void _mm256_stream_si256 (__m256i * p, __m256i a);
MOVNTDQ void _mm_stream_si128 (__m128i * p, __m128i a);
```

## SIMD 浮点 例外

None.

## 其他例外

非EVEX-encoded 指令,参见表2-18中的例外类型1. SSE2,"第1类例外条件".

EVEX-encoded discription,参见表2-47,"Type E1NF 类例外条件".

Additionally:

```text
#UD                    If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```
