---
summary: 返回最小 标量 FP16 值
---

## 说明

本指令对 第一源操作数 和 第二源操作数 中的低包装的 FP16 值进行比较,并将对数值的最小值返回 目标操作数 。

如果所比较的值均为0.0s(其中任一符号),则返回第二个操作数(源操作数)中的值。 如果在第二个 操作数 中的值是 SNaN,那么 SNaN 会被不加修改地传输到目的地(即不返回 SNaN 的 QNaN 版本).

如果只有一个值是用于此指令的NaN(SNAN或QNaN),则第二个操作数(源操作数),一个NaN或一个有效的浮点值会被写入结果. 如果代替这种行为,则需要将NaN 源操作数(从第一个或第二个操作数)返回,则VMINSH的动作可以使用一个指令序列来模拟,如AND,ANDN,和OR的比较.

EVEX 编码版本 : 第一源操作数(第二个操作数)是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的注册,512/256/128位的内存位置或512/256/128位的向量从16位的内存位置广播. 目标操作数是一个ZMM/YMM/XMM的登记册,有条件的更新有写掩码 k1.

目标操作数的比特127:16从第一源操作数的相应比特复制. 比特斯MAXVL-1:128 其中目标操作数为被清零. 目的地的低FP16元素根据写掩码更新.

## 行动

```text
def MIN(SRC1, SRC2):
    IF (SRC1 = 0.0) and (SRC2 = 0.0):
          DEST := SRC2
    ELSE IF (SRC1 = NaN):
          DEST := SRC2
    ELSE IF (SRC2 = NaN):
          DEST := SRC2
    ELSE IF (SRC1 < SRC2):
          DEST := SRC1
    ELSE:
          DEST := SRC2


VMINSH dest, src1, src2
IF k1[0] OR *no writemask*:

    DEST.fp16[0] := MIN(SRC1.fp16[0], SRC2.fp16[0])
ELSE IF *zeroing*:

    DEST.fp16[0] := 0
// else dest.fp16[j] remains unchanged

DEST[127:16] := SRC1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VMINSH __m128h _mm_mask_min_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, int sae);
VMINSH __m128h _mm_maskz_min_round_sh (__mmask8 k, __m128h a, __m128h b, int sae);
VMINSH __m128h _mm_min_round_sh (__m128h a, __m128h b, int sae);
VMINSH __m128h _mm_mask_min_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VMINSH __m128h _mm_maskz_min_sh (__mmask8 k, __m128h a, __m128h b);
VMINSH __m128h _mm_min_sh (__m128h a, __m128h b);
```

## SIMD 浮点 例外

Invalid, Denormal

## 其他例外

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".
