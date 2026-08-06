---
summary: 包装比较隐长字符串, 返回遮罩
---

## 说明

该指令根据imm8字节中的编码值对两个字符串的数据进行比较(参见第4.1节,"PCMPESTRI / PCMPESTRM / PCMPISTRI / PCMPISTRM"),生成一个存储到XMM0的掩码.

每个字符串由一个单一的值代表. 该值是一个xmm(或可能是m128为第二个操作数),包含字符串的数据元素(字节或单词数据). 每个输入字节/字节都加了一个有效的/无效的标记. 一个字节/词只有在其指数低于最小的空字节/词时才被认为有效. (最小的无字节/字节也被视为无效. )

比较和汇总操作按照imm8比特字段的编码值进行(见第4.1节)。 按照imm8[6]的定义,IntRes2要么被存储到XMM0最不重要的位数(0延伸至128位),要么被扩展为字节/字面面具,然后存储到XMM0.

请注意,亚里士底旗的写法是非标准,以便提供最相关的信息:

```text
    CFlag  Reset if IntRes2 is equal to zero, set otherwise
    ZFlag  Set if any byte/word of xmm2/mem128 is null, reset otherwise
    SFlag  Set if any byte/word of xmm1 is null, reset otherwise
    OFlag  IntRes2[0]
    AFlag  Reset
    PFlag  Reset
```

说明: 在VEX.128编码版本中,比特(MAXVL-1:128)为XMM0 被清零. VEX.vvvv是保留的,必须是1111b,VEX.L必须是0,否则指令会是#UD.

有效的 操作数大小

操作模式/大小 操作方式 1 操作方式 2 结果 16 位 xmm xmm/m128 XMM0 32 位 xmm xmm/m128 XMM0 64 位 xmm/m128 XMM0

英特尔 C/C++ 编译器 Intrinsic Equality for Returning Mask   m128i mm cmpistrm ( m128i a, m128i b, const int mode) ;

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
