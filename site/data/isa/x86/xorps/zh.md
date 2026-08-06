---
summary: 打包单精度浮点值的逻辑 XOR
---

## 说明

从 第一源操作数 和 第二源操作数 执行四、八或十六 打包单精度浮点值 的位逻辑 XOR,并将结果存储到 目标操作数

EVEX.512 编码版本 : 第一源操作数是一个ZMM登记册. 第二源操作数可以是ZMM寄存器或矢量内存位置. 目标操作数是一个ZMM的寄存器,有条件更新为写掩码 k1.

VEX.256和EVEX.256编码版本: 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM的登记册(在EVEX的情况下,有条件的更新为写掩码 k1). 对应的ZMM注册目的地被清零的上位(MAXVL-1:256).

VEX.128和EVEX.128编码版本: 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM的登记册(在EVEX的情况下,有条件的更新为写掩码 k1). 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM寄存器没有区别,对应寄存器目的地的上位(MAXVL-1:128)没有修改.

## 行动

```text
VXORPS (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b == 1) AND (SRC2 *is memory*)

                  THEN DEST[i+31:i] := SRC1[i+31:i] BITWISE XOR SRC2[31:0];

                  ELSE DEST[i+31:i] := SRC1[i+31:i] BITWISE XOR SRC2[i+31:i];

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*              ; zeroing-masking

                    DEST[i+31:i] = 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VXORPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[31:0] BITWISE XOR SRC2[31:0]
DEST[63:32] := SRC1[63:32] BITWISE XOR SRC2[63:32]
DEST[95:64] := SRC1[95:64] BITWISE XOR SRC2[95:64]
DEST[127:96] := SRC1[127:96] BITWISE XOR SRC2[127:96]
DEST[159:128] := SRC1[159:128] BITWISE XOR SRC2[159:128]
DEST[191:160] := SRC1[191:160] BITWISE XOR SRC2[191:160]
DEST[223:192] := SRC1[223:192] BITWISE XOR SRC2[223:192]
DEST[255:224] := SRC1[255:224] BITWISE XOR SRC2[255:224].
DEST[MAXVL-1:256] := 0

VXORPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] BITWISE XOR SRC2[31:0]
DEST[63:32] := SRC1[63:32] BITWISE XOR SRC2[63:32]
DEST[95:64] := SRC1[95:64] BITWISE XOR SRC2[95:64]
DEST[127:96] := SRC1[127:96] BITWISE XOR SRC2[127:96]
DEST[MAXVL-1:128] := 0

XORPS (128-bit Legacy SSE Version)
DEST[31:0] := SRC1[31:0] BITWISE XOR SRC2[31:0]
DEST[63:32] := SRC1[63:32] BITWISE XOR SRC2[63:32]
DEST[95:64] := SRC1[95:64] BITWISE XOR SRC2[95:64]
DEST[127:96] := SRC1[127:96] BITWISE XOR SRC2[127:96]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VXORPS __m512 _mm512_xor_ps (__m512 a, __m512 b);
VXORPS __m512 _mm512_mask_xor_ps (__m512 a, __mmask16 m, __m512 b);
VXORPS __m512 _mm512_maskz_xor_ps (__mmask16 m, __m512 a);
VXORPS __m256 _mm256_xor_ps (__m256 a, __m256 b);
VXORPS __m256 _mm256_mask_xor_ps (__m256 a, __mmask8 m, __m256 b);
VXORPS __m256 _mm256_maskz_xor_ps (__mmask8 m, __m256 a);
XORPS __m128 _mm_xor_ps (__m128 a, __m128 b);
VXORPS __m128 _mm_mask_xor_ps (__m128 a, __mmask8 m, __m128 b);
VXORPS __m128 _mm_maskz_xor_ps (__mmask8 m, __m128 a);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded 指令,参见表2-21,"第4类例外条件".

EVEX-encoded 指令,参见表2-49,"Type E4类例外条件".
