---
summary: 使用字节索引从四字节元素切换位数
---

## 说明

VPSHUFBITQMB 指令执行一个位集选择,使用第二个源作为控制,第一个源作为数据. 每个比特使用6个控制比特(2nd 源操作数)来选择要收集的数据比特(第一源操作数). 一个给定比特只能访问64个不同的比特数据(第一个64个目的地比特可以访问第一个64个数据比特,第二个64个目的地比特可以访问第二个64个数据比特等).

每个输出位的控制数据被存储在SRC2的8位元素中,但每个元素中只有6个最小的位.

本指令使用写掩码(仅零). 本指令支持内存断层抑制.

第一源操作数是一个ZMM登记册. 第二源操作数是一个ZMM的寄存器或内存位置. 目标操作数是一个面具寄存器.

## 行动

```text
VPSHUFBITQMB DEST, SRC1, SRC2

(KL, VL) = (16,128), (32,256), (64, 512)

FOR i := 0 TO KL/8-1:      //Qword

FOR j := 0 to 7:           // Byte

IF k2[i*8+j] or *no writemask*:

           m := SRC2.qword[i].byte[j] & 0x3F

           k1[i*8+j] := SRC1.qword[i].bit[m]

ELSE:

           k1[i*8+j] := 0

k1[MAX_KL-1:KL] := 0
```

## Intel C/C++ 内在编译器

```c
VPSHUFBITQMB __mmask16 _mm_bitshuffle_epi64_mask(__m128i, __m128i);
VPSHUFBITQMB __mmask16 _mm_mask_bitshuffle_epi64_mask(__mmask16, __m128i, __m128i);
VPSHUFBITQMB __mmask32 _mm256_bitshuffle_epi64_mask(__m256i, __m256i);
VPSHUFBITQMB __mmask32 _mm256_mask_bitshuffle_epi64_mask(__mmask32, __m256i, __m256i);
VPSHUFBITQMB __mmask64 _mm512_bitshuffle_epi64_mask(__m512i, __m512i);
VPSHUFBITQMB __mmask64 _mm512_mask_bitshuffle_epi64_mask(__mmask64, __m512i, __m512i);
```
