---
summary: 累积 CRC32 值
---

## 说明

从第一个操作数(目标操作数)的初始值开始,积累第二个操作数(源操作数)的CRC32(polynomial 11EDC6F41H)值,并将结果存储为目标操作数. 源操作数可以是寄存器或内存位置. 目标操作数必须是r32或r64登记册. 如果目的地是r64寄存器,则32位结果存储在最小的双字中,00000000H则存储在r64寄存器中最显著的双字中.

目标操作数中提供的初始值是存储在r32登记册中的双字整数,或者r64登记册中最小的双字整数. 为了递增积累一个CRC32值,软件保留了目标操作数中之前的CRC32操作的结果,然后用源操作数中的新输入数据再次执行CRC32指令. 源操作数中包含的数据按反射位顺序处理. 这意味着源操作数中最显著的位点,被作为所有源操作数中最不重要的位点,等等. 同样,CRC操作的结果也以反射的位顺序存储在目标操作数中. 这意味着产生的CRC中最显著的位(bit 31)被存储在目标操作数中最小的位(bit 0)等中,用于CRC中的所有位.

## 行动

```text
Notes:
    BIT_REFLECT64: DST[63-0] = SRC[0-63]
    BIT_REFLECT32: DST[31-0] = SRC[0-31]
    BIT_REFLECT16: DST[15-0] = SRC[0-15]
    BIT_REFLECT8: DST[7-0] = SRC[0-7]
    MOD2: Remainder from Polynomial division modulus 2


CRC32 instruction for 64-bit source operand and 64-bit destination operand:
    TEMP1[63-0] := BIT_REFLECT64 (SRC[63-0])
    TEMP2[31-0] := BIT_REFLECT32 (DEST[31-0])
    TEMP3[95-0] := TEMP1[63-0] << 32
    TEMP4[95-0] := TEMP2[31-0] << 64
    TEMP5[95-0] := TEMP3[95-0] XOR TEMP4[95-0]
    TEMP6[31-0] := TEMP5[95-0] MOD2 11EDC6F41H
    DEST[31-0] := BIT_REFLECT (TEMP6[31-0])
    DEST[63-32] := 00000000H

CRC32 instruction for 32-bit source operand and 32-bit destination operand:
    TEMP1[31-0] := BIT_REFLECT32 (SRC[31-0])
    TEMP2[31-0] := BIT_REFLECT32 (DEST[31-0])
    TEMP3[63-0] := TEMP1[31-0] << 32
    TEMP4[63-0] := TEMP2[31-0] << 32
    TEMP5[63-0] := TEMP3[63-0] XOR TEMP4[63-0]
    TEMP6[31-0] := TEMP5[63-0] MOD2 11EDC6F41H
    DEST[31-0] := BIT_REFLECT (TEMP6[31-0])

CRC32 instruction for 16-bit source operand and 32-bit destination operand:
    TEMP1[15-0] := BIT_REFLECT16 (SRC[15-0])
    TEMP2[31-0] := BIT_REFLECT32 (DEST[31-0])
    TEMP3[47-0] := TEMP1[15-0] << 32
    TEMP4[47-0] := TEMP2[31-0] << 16
    TEMP5[47-0] := TEMP3[47-0] XOR TEMP4[47-0]
    TEMP6[31-0] := TEMP5[47-0] MOD2 11EDC6F41H
    DEST[31-0] := BIT_REFLECT (TEMP6[31-0])

CRC32 instruction for 8-bit source operand and 64-bit destination operand:
    TEMP1[7-0] := BIT_REFLECT8(SRC[7-0])
    TEMP2[31-0] := BIT_REFLECT32 (DEST[31-0])
    TEMP3[39-0] := TEMP1[7-0] << 32
    TEMP4[39-0] := TEMP2[31-0] << 8
    TEMP5[39-0] := TEMP3[39-0] XOR TEMP4[39-0]
    TEMP6[31-0] := TEMP5[39-0] MOD2 11EDC6F41H
    DEST[31-0] := BIT_REFLECT (TEMP6[31-0])
    DEST[63-32] := 00000000H

CRC32 instruction for 8-bit source operand and 32-bit destination operand:
    TEMP1[7-0] := BIT_REFLECT8(SRC[7-0])
    TEMP2[31-0] := BIT_REFLECT32 (DEST[31-0])
    TEMP3[39-0] := TEMP1[7-0] << 32
    TEMP4[39-0] := TEMP2[31-0] << 8
    TEMP5[39-0] := TEMP3[39-0] XOR TEMP4[39-0]
    TEMP6[31-0] := TEMP5[39-0] MOD2 11EDC6F41H
    DEST[31-0] := BIT_REFLECT (TEMP6[31-0])
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
unsigned int _mm_crc32_u8( unsigned int crc, unsigned char data ) unsigned int _mm_crc32_u16( unsigned int crc, unsigned short data ) unsigned int _mm_crc32_u32( unsigned int crc, unsigned int data ) unsigned __int64 _mm_crc32_u64( unsigned __int64 crc, unsigned __int64 data );
```

## SIMD 浮点 例外

None.
