---
summary: 0XMM, YMM, 和 ZMM 登记册
---

## 说明

在64位模式中,指令零的XMM0-XMM15,YMM0-YMM15,以及ZMM0-ZMM15. 在64位模式外,它只零分XMM0-XMM7,YMM0-YMM7,以及ZMM0-ZMM7. VZEROALL不修改ZMM16-ZMM31.

说明: VEX.vvvv是保留的,必须是1111b,否则指令会#UD. 在兼容性和遗产32位模式中,只有下8位登记册被修改。

## 行动

```text
simd_reg_file[][] is a two dimensional array representing the SIMD register file containing all the overlapping xmm, ymm, and zmm
registers present in that implementation. The major dimension is the register number: 0 for xmm0, ymm0, and zmm0; 1 for xmm1,
ymm1, and zmm1; etc. The minor dimension size is the width of the implemented SIMD state measured in bits. On a machine
supporting Intel AVX-512, the width is 512.

VZEROALL (VEX.256 encoded version)
IF (64-bit mode)

    limit :=15
ELSE

    limit := 7
FOR i in 0 .. limit:

    simd_reg_file[i][MAXVL-1:0] := 0
```

## Intel C/C++ 内在编译器

```c
VZEROALL:    _mm256_zeroall();
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-25"第8类例外条件".
