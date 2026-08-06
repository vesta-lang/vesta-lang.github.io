---
summary: 用广播装入 BF16 元素并转换为 FP32 元素
---

## 说明

本指令从内存中加载一个BF16元素,将其转换为FP32,并广播到一个SIMD的寄存器.

本指令不生成 浮点 例外,也不咨询或更新 MXCSR.

由于任何BF16数字都可以用FP32表示,因此转换结果准确,不需要四舍五入.

## 行动

```text
VBCSTNEBF162PS dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/32

FOR i in range(0, KL):
    tmp.dword[i].word[0] = src.word[0] // reads 16b from memory

FOR i in range(0, KL):
    dest.dword[i] = make_fp32(TMP.dword[i].word[0])

DEST[MAXVL-1:VL] := 0
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VBCSTNEBF162PS __m128 _mm_bcstnebf16_ps (const __bf16* __A);
VBCSTNEBF162PS __m256 _mm256_bcstnebf16_ps (const __bf16* __A);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-22"第5类例外条件".
