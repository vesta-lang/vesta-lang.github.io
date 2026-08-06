---
summary: 标量 FP16 值的倍增
---

## 说明

在使用三个 源操作数 的低 FP16 值上执行 标量 乘积或否定乘积计算,并将结果写入 目标操作数 。 目标操作数亦为第一源操作数. 本规范的"N"(阴性)形式在相应的剩余操作数中加入否定的无限精密中间产物. 标记的"132","213"和"231"表示操作数在+/-A中的使用. * B + C,每个数字对应操作数数字,目的地为操作数 1;见表5-6.

目标操作数中的Bits 127:16保存下来. 比特斯MAXVL-1:128 其中目标操作数为被清零. 目的地的低FP16元素根据写掩码更新.

```text
             Notation  Table 5-6. VF[,N]MADD[132,213,231]SH Notation for Operands
                132                                                                       Operands
```

231

```text
                213                                                             dest = +/- dest*src3+src2
```

dest = +/- src2*src3+dest dest = +/- src2*dest+src3  des = =

## 行动

```text
VF[,N]MADD132SH DEST, SRC2, SRC3 (EVEX encoded versions)
IF EVEX.b = 1 and SRC3 is a register:

    SET_RM(EVEX.RC)
ELSE

    SET_RM(MXCSR.RC)

IF k1[0] OR *no writemask*:
    IF *negative form*:
          DEST.fp16[0] := RoundFPControl(-DEST.fp16[0]*SRC3.fp16[0] + SRC2.fp16[0])
    ELSE:
          DEST.fp16[0] := RoundFPControl(DEST.fp16[0]*SRC3.fp16[0] + SRC2.fp16[0])

ELSE IF *zeroing*:
    DEST.fp16[0] := 0

// else DEST.fp16[0] remains unchanged

//DEST[127:16] remains unchanged
DEST[MAXVL-1:128] := 0

VF[,N]MADD213SH DEST, SRC2, SRC3 (EVEX encoded versions)
IF EVEX.b = 1 and SRC3 is a register:

    SET_RM(EVEX.RC)
ELSE

    SET_RM(MXCSR.RC)

IF k1[0] OR *no writemask*:
    IF *negative form:
          DEST.fp16[0] := RoundFPControl(-SRC2.fp16[0]*DEST.fp16[0] + SRC3.fp16[0])
    ELSE:
          DEST.fp16[0] := RoundFPControl(SRC2.fp16[0]*DEST.fp16[0] + SRC3.fp16[0])

ELSE IF *zeroing*:
    DEST.fp16[0] := 0

// else DEST.fp16[0] remains unchanged

//DEST[127:16] remains unchanged
DEST[MAXVL-1:128] := 0

VF[,N]MADD231SH DEST, SRC2, SRC3 (EVEX encoded versions)
IF EVEX.b = 1 and SRC3 is a register:

    SET_RM(EVEX.RC)
ELSE

    SET_RM(MXCSR.RC)

IF k1[0] OR *no writemask*:
    IF *negative form*:
          DEST.fp16[0] := RoundFPControl(-SRC2.fp16[0]*SRC3.fp16[0] + DEST.fp16[0])
    ELSE:
          DEST.fp16[0] := RoundFPControl(SRC2.fp16[0]*SRC3.fp16[0] + DEST.fp16[0])

ELSE IF *zeroing*:
    DEST.fp16[0] := 0

// else DEST.fp16[0] remains unchanged

//DEST[127:16] remains unchanged
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VFMADD132SH, VFMADD213SH, and VFMADD231SH: __m128h _mm_fmadd_round_sh (__m128h a, __m128h b, __m128h c, const int rounding);
__m128h _mm_mask_fmadd_round_sh (__m128h a, __mmask8 k, __m128h b, __m128h c, const int rounding);
__m128h _mm_mask3_fmadd_round_sh (__m128h a, __m128h b, __m128h c, __mmask8 k, const int rounding);
__m128h _mm_maskz_fmadd_round_sh (__mmask8 k, __m128h a, __m128h b, __m128h c, const int rounding);
__m128h _mm_fmadd_sh (__m128h a, __m128h b, __m128h c);
__m128h _mm_mask_fmadd_sh (__m128h a, __mmask8 k, __m128h b, __m128h c);
__m128h _mm_mask3_fmadd_sh (__m128h a, __m128h b, __m128h c, __mmask8 k);
__m128h _mm_maskz_fmadd_sh (__mmask8 k, __m128h a, __m128h b, __m128h c);
VFNMADD132SH, VFNMADD213SH, and VFNMADD231SH: __m128h _mm_fnmadd_round_sh (__m128h a, __m128h b, __m128h c, const int rounding);
__m128h _mm_mask_fnmadd_round_sh (__m128h a, __mmask8 k, __m128h b, __m128h c, const int rounding);
__m128h _mm_mask3_fnmadd_round_sh (__m128h a, __m128h b, __m128h c, __mmask8 k, const int rounding);
__m128h _mm_maskz_fnmadd_round_sh (__mmask8 k, __m128h a, __m128h b, __m128h c, const int rounding);
__m128h _mm_fnmadd_sh (__m128h a, __m128h b, __m128h c);
__m128h _mm_mask_fnmadd_sh (__m128h a, __mmask8 k, __m128h b, __m128h c);
__m128h _mm_mask3_fnmadd_sh (__m128h a, __m128h b, __m128h c, __mmask8 k);
__m128h _mm_maskz_fnmadd_sh (__mmask8 k, __m128h a, __m128h b, __m128h c);
```

## SIMD 浮点 例外

Invalid, Underflow, Overflow, Precision, Denormal

## 其他例外

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".
