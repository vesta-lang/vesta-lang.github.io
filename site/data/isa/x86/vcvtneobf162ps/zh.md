---
summary: 将包装的 BF16 值的奇数元素转换为 FP32 值
---

## 说明

此指令从内存中装入 BF16 元素,将奇数元素转换为 FP32,并将结果写入目的地 SIMD 寄存器.

本指令不生成 浮点 例外,也不咨询或更新 MXCSR.

由于任何BF16数字都可以用FP32表示,因此转换结果准确,不需要四舍五入.

## 行动

```text
VCVTNEOBF162PS dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/32

FOR i in range(0, KL):
    dest.dword[i] = make_fp32(src.dword[i].word[1])

DEST[MAXVL-1:VL] := 0
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VCVTNEOBF162PS __m128 _mm_cvtneobf16_ps (const __m128bh* __A);
VCVTNEOBF162PS __m256 _mm256_cvtneobf16_ps (const __m256bh* __A);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".
