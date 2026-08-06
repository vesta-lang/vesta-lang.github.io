---
summary: YMM 和 ZMM 的上位数
---

## 说明

在64位模式中,指令将128位位置的位数零化,在YMM0-YMM15和ZMM0-ZMM15更高. 在64位模式外,它只在YMM0-YMM7和ZMM0-ZMM7中将这些位点零化. VZEROUPPER不修改这些登记册的下128位,也不修改ZMM16-ZMM31.

在AVX和遗留的SSE代码之间过渡时建议使用此指令;它将消除假依赖导致的性能处罚.

说明: VEX.vvvv是保留的,必须是1111b,否则指令会#UD. 在兼容性和遗产32位模式中,只有下8位登记册被修改。

## 行动

```text
simd_reg_file[][] is a two dimensional array representing the SIMD register file containing all the overlapping xmm, ymm, and zmm
registers present in that implementation. The major dimension is the register number: 0 for xmm0, ymm0, and zmm0; 1 for xmm1,
ymm1, and zmm1; etc. The minor dimension size is the width of the implemented SIMD state measured in bits.

VZEROUPPER
IF (64-bit mode)

    limit :=15
ELSE

    limit := 7
FOR i in 0 .. limit:

    simd_reg_file[i][MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VZEROUPPER: _mm256_zeroupper();
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-25"第8类例外条件".

CHAPTER 6

6.1 INSTRUCTIONS (W-Z)

第六章继续按字母顺序讨论英特尔(R)64和IA-32指令(W-Z). 另见: 第3章,"指令集参考,A-L",载于Intel(R)64和IA-32架构软件开发者手册,第2A卷; 第4章,"指令集参考,M-U",载于Intel(R)64和IA-32架构软件开发者手册第2B卷;第5章,"指令集参考,V",载于Intel(R)64和IA-32架构软件开发者手册第2D卷.
