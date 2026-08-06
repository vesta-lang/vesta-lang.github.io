---
summary: 加载
---

## 说明

添加 目标操作数(第一个操作数), 源操作数(第二个操作数),以及 进位标志 (CF) 并存储结果为 目标操作数. 目标操作数可以是寄存器或内存位置;源操作数可以是即时寄存器,也可以是内存位置. (然而,两个内存操作数不能在一个指令中使用. ) CF旗的状态代表了前一个加法的传承. 当一个即时值被用作操作数时,其符号扩展为目标操作数格式的长度.

ADC指令没有区分签名或未签名的操作数. 相反,处理器对数据类型都进行结果评价,并设置OF和CF旗,以分别表示在签名或未签名结果中的载荷. SF旗表示签名结果的标志.

ADC指令通常作为多字节或多字节添加的一部分执行,其中ADD指令后面是ADC指令.

此指令可用 LOCK 前缀来允许指令在原子上执行.

在64位模式下,指令的默认操作大小为32位. 使用REX的前缀形式为REX.R,允许访问额外的注册(R8-R15). 使用REX前缀,形式为REX.W,促进运行到64位. 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
DEST := DEST + SRC + CF;
```

## Intel C/C++ 内在编译器

```c
ADC extern unsigned char _addcarry_u8(unsigned char c_in, unsigned char src1, unsigned char src2, unsigned char *sum_out);
ADC extern unsigned char _addcarry_u16(unsigned char c_in, unsigned short src1, unsigned short src2, unsigned short *sum_out);
ADC extern unsigned char _addcarry_u32(unsigned char c_in, unsigned int src1, unsigned char int, unsigned int *sum_out);
ADC extern unsigned char _addcarry_u64(unsigned char c_in, unsigned __int64 src1, unsigned __int64 src2, unsigned __int64 *sum_out);
```

## 受影响的旗帜

OF,SF,ZF,AF,CF,和PF的旗帜根据结果设置.
