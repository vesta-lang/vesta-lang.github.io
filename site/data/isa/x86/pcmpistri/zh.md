---
summary: 包装的比较隐长字符串,返回索引
---

## 说明

该指令根据imm8控制字节中的编码值对两个字符串的数据进行比较(参见第4.1节,"PCMPESTRI / PCMPESTRM / PCMPISTRI / PCMPISTRM"),并生成存储到ECX的索引.

每个字符串由一个单一的值代表. 该值是一个xmm(或可能是m128为第二个操作数),包含字符串的数据元素(字节或单词数据). 每个输入字节/字节都加了一个有效的/无效的标记. 一个字节/词只有在其指数低于最小的空字节/词时才被认为有效. (最小的无字节/字节也被视为无效. )

比较和汇总操作按照imm8比特字段的编码值进行(见第4.1节)。 第一个(或最后一个,根据imm8[6])集位点IntRes2的索引以ECX返回. 如果IntRes2中没有设置位元,则ECX被设定为16(8).

请注意,亚里士底旗的写法是非标准,以便提供最相关的信息:

```text
    CFlag  Reset if IntRes2 is equal to zero, set otherwise
    ZFlag  Set if any byte/word of xmm2/mem128 is null, reset otherwise
    SFlag  Set if any byte/word of xmm1 is null, reset otherwise
```

OFlag IntRes2[0]

```text
    AFlag  Reset
    PFlag  Reset
```

说明: 在VEX.128编码版本中,VEX.vvvv被保留,必须是1111b,VEX.L必须是0,否则指令会是#UD.

有效的操作操作 1 操作 2 结果操作模式/大小 xmm xmm/m128 ECX 16比特 xmm/m128 ECX 32比特 xmm/m128 ECX 64比特

英特尔 C/C++ 编译器 Intrinsic for Returning Index int mm cmpistri ( m128i a, m128i b, const int mode) ; 2.

Intel C/C++ 用于读取 EFlag 结果的编译器

int  mm cmpistra ( m128i a, m128i b, const int模式); int  mm cmistrc ( m128i a, m128i b, const int模式); int  mm cmpistro ( m128i a, m128i b, const 模式); int  mm cmpistrz ( m128i a, m128i b, const 模式);

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",此外,如果内存操作数与16个字节边界不对齐,则本指令不会导致#GP,以及:

```text
#UD               If VEX.L = 1.
```

```text
                  If VEX.vvvv  1111B.
```
