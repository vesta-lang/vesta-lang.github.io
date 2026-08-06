---
summary: 用借款进行整数减法
---

## 说明

添加 源操作数(第二个操作数)和 进位标志 (CF),并从 目标操作数(第一个操作数)中减去结果. 减法的结果保存在目标操作数中. 目标操作数可以是寄存器或内存位置;源操作数可以是即时寄存器,也可以是内存位置. (然而,两个内存操作数不能在一个指令中使用. ) CF旗的状态代表从先前的减法中借出.

当一个即时值被用作操作数时,其符号扩展为目标操作数格式的长度.

SBB指令没有区分签名或未签名的操作数. 相反,处理器会评价数据类型的结果,并设置OF和CF旗,以分别表示在签名或未签名的结果中的借阅. SF旗表示签名结果的标志.

SBB指令通常作为多字节或多字节减法的一部分执行,其中SUB指令后面是SBB指令.

此指令可用 LOCK 前缀来允许指令在原子上执行.

在64位模式下,指令的默认操作大小为32位. 使用REX的前缀形式为REX.R,允许访问额外的注册(R8-R15). 使用REX前缀,形式为REX.W,促进运行到64位. 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
DEST := (DEST  (SRC + CF));
```

## Intel C/C++ 内在编译器

```c
SBB extern unsigned char _subborrow_u8(unsigned char c_in, unsigned char src1, unsigned char src2, unsigned char *diff_out);
SBB extern unsigned char _subborrow_u16(unsigned char c_in, unsigned short src1, unsigned short src2, unsigned short *diff_out);
SBB extern unsigned char _subborrow_u32(unsigned char c_in, unsigned int src1, unsigned char int, unsigned int *diff_out);
SBB extern unsigned char _subborrow_u64(unsigned char c_in, unsigned __int64 src1, unsigned __int64 src2, unsigned __int64 *diff_out);
```

## 受影响的旗帜

OF,SF,ZF,AF,PF,和CF旗根据结果设置.
