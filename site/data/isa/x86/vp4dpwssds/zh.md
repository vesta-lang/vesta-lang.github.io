---
summary: 带有填字积累和饱和的署名词的点产品
---

## 说明

本指令计算了两个签名单词操作数的4个顺序注册源块点产品,并带有双字累积和签名饱和. 内存操作数在四个步骤中每个步骤按顺序选择.

在上述框中,使用"+3"的标记来表示该指令基于操作数的4源注册;来源是连续的,从4个边界的多个开始,并包含编码的注册号操作数.

本指令支持内存断层抑制. 内存操作数如果将口罩中最低的16位中的任何位设为1,或者使用"无口罩"编码,则全部装入.

Tuple类型Tuple1 4X意味着四个32位元素(16字节)被本指令的内存操作部分引用.

## 行动

```text
src_reg_id is the 5 bit index of the vector register specified in the instruction as the src1 register.

VP4DPWSSDS dest, src1, src2
(KL,VL) = (16,512)
N := 4

ORIGDEST := DEST
src_base := src_reg_id & ~ (N-1) // for src1 operand

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
         FOR m := 0 to N-1:
               t := SRC2.dword[m]
               p1dword := reg[src_base+m].word[2*i] * t.word[0]
               p2dword := reg[src_base+m].word[2*i+1] * t.word[1]
               DEST.dword[i] := SIGNED_DWORD_SATURATE(DEST.dword[i] + p1dword + p2dword)
    ELSE IF *zeroing*:
         DEST.dword[i] := 0
    ELSE
         DEST.dword[i] := ORIGDEST.dword[i]

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VP4DPWSSDS __m512i _mm512_4dpwssds_epi32(__m512i, __m512ix4, __m128i *);
VP4DPWSSDS __m512i _mm512_mask_4dpwssds_epi32(__m512i, __mmask16, __m512ix4, __m128i *);
VP4DPWSSDS __m512i _mm512_maskz_4dpwssds_epi32(__mmask16, __m512i, __m512ix4, __m128i *);
```

## SIMD 浮点 例外

None.

## 其他例外

See Type E4; additionally:

```text
#UD               If the EVEX broadcast bit is set to 1.
```

```text
#UD               If the MODRM.mod = 0b11.
```
