---
summary: 包装的比较长度
---

## 说明

该指令根据imm8 contol字节中的编码值对两个字符串片段的数据进行比较(参见第4.1节,"PCMPESTRI / PCMPESTRM / PCMPISTRI / PCMPISTRM"的Imm8控制字节操作),生成一个存储到XMM0的面具.

每个字符串片段由两个值代表. 第一个值是xmm(或可能是m128为第二个操作数),包含字符串的数据元素(字节或单词数据). 第二个值存储在一个输入长度寄存器中. 输入长度寄存器为EAX/RAX(用于xmm1)或EDX/RDX(用于xmm2/m128). 长度代表相应的xmm/m128数据有效的字节/字节数.

每个输入的长度被解释为长度寄存器中数值的绝对值. 绝对值计算饱和度为16(对于字节)和8(对于字节),基于imm8[bit3]值,当长度寄存器中的值大于或小于-16(-8)时.

比较和汇总操作按照imm8比特字段的编码值进行(见第4.1节)。 按照imm8[6]的定义,IntRes2要么被存储到XMM0最不重要的位数(0延伸至128位),要么被扩展为字节/字面面具,然后存储到XMM0.

请注意,亚里士底旗的写法是非标准,以便提供最相关的信息:

```text
    CFlag  Reset if IntRes2 is equal to zero, set otherwise
    ZFlag  Set if absolute-value of EDX is < 16 (8), reset otherwise
    SFlag  Set if absolute-value of EAX is < 16 (8), reset otherwise
```

OFlag IntRes2[0]

```text
    AFlag  Reset
    PFlag  Reset
```

说明: 在VEX.128编码版本中,比特(MAXVL-1:128)为XMM0 被清零. VEX.vvvv是保留的,必须是1111b,VEX.L必须是0,否则指令会是#UD.

有效的 操作数大小

操作模式/大小操作数 1 操作数2 长度 1 长度 2 结果 16 比特 xmm xmm/m128 EAX EDX XMM032 位 xmm xmm / 键m128 EAX EDX XMM064 位 xmm xmm/ 调制m128 EAX EDX XMM064 位 + 键REX.Wxmm xmm / 调用m128 RAX RDX XMM0

英特尔 C/C++ 汇编器 内置等效的还原罩   m128i mm cmpestrm ( m128i a, int la, m128i b, int lb, const int 模式) ;

Intel C/C++ 用于读取 EFlag 结果的编译器

int  mm cmpestra ( m128i a, int la, m128i b, int lb, const int model); int  mm cmpestrc ( m128i a, int la, m128i b, int lb, cont model); int  mm cmpestrz ( m128i a, int la, m128i b, int lb, cont model); int  mm cmpestrz ( m128i a, et , m128i b, int model); mm cmpestrz ( m128i a, et , m128i b, int lb, cont model);

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",此外,如果内存操作数与16个字节边界不对齐,则本指令不会导致#GP,以及:

```text
#UD                  If VEX.L = 1.
```

```text
                     If VEX.vvvv  1111B.
```
