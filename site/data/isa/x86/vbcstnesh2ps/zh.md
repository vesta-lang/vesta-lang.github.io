---
summary: 用广播装入 FP16 元素并转换为 FP32 元素
---

## 说明

本指令从内存中加载一个FP16元素,将其转换为FP32,并广播到一个SIMD的寄存器.

本指令不生成 浮点 例外,也不咨询或更新 MXCSR.

输入FP16异常值转换为正常的FP32数字,不作为零处理. 由于任何FP16数字都可以用FP32表示,因此转换结果准确,不需要四舍五入.

## 行动

```text
VBCSTNESH2PS dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/32

FOR i in range(0, KL):
    tmp.dword[i].word[0] = src.word[0] // read 16b from memory

FOR i in range(0, KL):
    dest.dword[i] = convert_fp16_to_fp32(tmp.dword[i].word[0]) //SAE

DEST[MAXVL-1:VL] := 0
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VBCSTNESH2PS __m128 _mm_bcstnesh_ps (const _Float16* __A);
VBCSTNESH2PS __m256 _mm256_bcstnesh_ps (const _Float16* __A);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-22"第5类例外条件".
