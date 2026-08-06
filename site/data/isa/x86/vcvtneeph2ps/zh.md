---
summary: 将包装的 FP16 值的偶数元素转换为 FP32 值
---

## 说明

此指令从内存中装入 FP16 元素,将偶数元素转换为 FP32,并将结果写入目的地 SIMD 寄存器.

本指令不生成 浮点 例外,也不咨询或更新 MXCSR.

输入FP16异常值转换为正常的FP32数字,不作为零处理. 由于任何FP16数字都可以用FP32表示,因此转换结果准确,不需要四舍五入.

## 行动

```text
VCVTNEEPH2PS dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/32

FOR i in range(0, KL):
    dest.dword[i] = convert_fp16_to_fp32(src.dword[i].word[0]) //SAE

DEST[MAXVL-1:VL] := 0
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VCVTNEEPH2PS __m128 _mm_cvtneeph_ps (const __m128h* __A);
VCVTNEEPH2PS __m256 _mm256_cvtneeph_ps (const __m256h* __A);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".
