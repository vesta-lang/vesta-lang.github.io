---
summary: 标量 单倍减法
---

## 说明

使用三个 源操作数 在低的 打包单精度浮点值 上执行 SIMD 乘积-减数计算,并写入乘积-减数结果为 目标操作数 。 目标操作数亦为第一源操作数. 第二个操作数必须是XMM的登记册. 第三个源操作数可以是XMM寄存器或32位内存位置.

VFMSUB132SS : (英语). 将第一源操作数的低包装单精度浮点值乘以第三源操作数的低包装单精度浮点值. 从无限精度中间结果中,减去第二源操作数中低的打包单精度浮点值,进行四舍五入,并将由此产生的包装的单精度浮点值存储到目标操作数(第一源操作数).

VFMSUB213SS : (英语). 将第二源操作数的低包装单精度浮点值乘以第一源操作数的低包装单精度浮点值. 从无限精度中间结果中,在第三个 源操作数 中减去低包装的 单精度浮点 值,进行四舍五入,并将由此产生的包装的 单精度浮点 值存储到 目标操作数 (第一源操作数).

VFMSUB231SS : (英语). 将第二源的低包装单精度浮点值乘以第三源操作中的低包装单精度浮点值. 从无限精度中间结果中减去单精度浮点在第一源操作数中的低包装值,进行四舍五入,并将由此产生的包装单精度浮点值存储到目标操作数(第一源操作数).

VEX.128和EVEX编码版本: 目标操作数(也是第一源操作数)在reg field中编码. 第二源操作数编码为VEX.vvvv/EVEX.vvvv. 第三个源操作数编码为rm field. 目的地的位数127:32不变. 目的地的Bits MAXVL-1:128注册被清零.

EVEX 编码版本 : 目的地的低双字元素根据写掩码更新.

编译工具可以可选择支持汇总表操作码/指令栏列出的每个指令元的互补元音. 在涉及NANs的情况中,互补的mnemonic的行为受操作码/指令列中定义的指令mnemonic的定义制约.

## 行动

```text
In the operations below, "*" and "-" symbols represent multiplication and subtraction with infinite precision inputs and outputs (no
rounding).

VFMSUB132SS DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundFPControl(DEST[31:0]*SRC3[31:0] - SRC2[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := DEST[127:32]

DEST[MAXVL-1:128] := 0

VFMSUB213SS DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundFPControl(SRC2[31:0]*DEST[31:0] - SRC3[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := DEST[127:32]

DEST[MAXVL-1:128] := 0


VFMSUB231SS DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundFPControl(SRC2[31:0]*SRC3[63:0] - DEST[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := DEST[127:32]

DEST[MAXVL-1:128] := 0

VFMSUB132SS DEST, SRC2, SRC3 (VEX encoded version)
DEST[31:0] := RoundFPControl_MXCSR(DEST[31:0]*SRC3[31:0] - SRC2[31:0])
DEST[127:32] := DEST[127:32]
DEST[MAXVL-1:128] := 0

VFMSUB213SS DEST, SRC2, SRC3 (VEX encoded version)
DEST[31:0] := RoundFPControl_MXCSR(SRC2[31:0]*DEST[31:0] - SRC3[31:0])
DEST[127:32] := DEST[127:32]
DEST[MAXVL-1:128] := 0

VFMSUB231SS DEST, SRC2, SRC3 (VEX encoded version)
DEST[31:0] := RoundFPControl_MXCSR(SRC2[31:0]*SRC3[31:0] - DEST[31:0])
DEST[127:32] := DEST[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VFMSUBxxxSS __m128 _mm_fmsub_round_ss(__m128 a, __m128 b, __m128 c, int r);
VFMSUBxxxSS __m128 _mm_mask_fmsub_ss(__m128 a, __mmask8 k, __m128 b, __m128 c);
VFMSUBxxxSS __m128 _mm_maskz_fmsub_ss(__mmask8 k, __m128 a, __m128 b, __m128 c);
VFMSUBxxxSS __m128 _mm_mask3_fmsub_ss(__m128 a, __m128 b, __m128 c, __mmask8 k);
VFMSUBxxxSS __m128 _mm_mask_fmsub_round_ss(__m128 a, __mmask8 k, __m128 b, __m128 c, int r);
VFMSUBxxxSS __m128 _mm_maskz_fmsub_round_ss(__mmask8 k, __m128 a, __m128 b, __m128 c, int r);
VFMSUBxxxSS __m128 _mm_mask3_fmsub_round_ss(__m128 a, __m128 b, __m128 c, __mmask8 k, int r);
VFMSUBxxxSS __m128 _mm_fmsub_ss (__m128 a, __m128 b, __m128 c);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal

## 其他例外

VEX-encoded 指令,参见表2-20,"Type 3 Class Exception条件". EVEX-encoded 指令,参见表2-49,"Type E3 Class Exceptity条件".

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD- Fused 倍式替代减法/ Add of 打包双精度浮点值

操作码/ Op/ 64/32 CPUID 特性描述指令 En Bit模式旗帜支持

VEX.128.66.0F38.W1 97 /r A V/V FMA 多倍包装 双精度浮点

VFMSUBADD132PD xmm1,xmm2,数值来自xmm1和xmm3/mem,在xmm2中减去/添加元素,并将结果xmm3/m128放入xmm1.

VEX.128.66.0F38.W1 A7 /r A V/V FMA 多倍包装 双精度浮点

VFMSUBADD213PD xmm1,xmm2,来自xmm1和xmm2的值,在xmm3/mem中减去/添加元素,结果为xmm1. xmm3/m128.

VEX.128.66.0F38.W1 B7 /r A V/V FMA 从xmm2和xmm3/mem,VFMSUBADD231PD xmm1,xmm2,在xmm1中减去/添加元素,并将结果xmm3/m128放入xmm1.

VEX.256.66.0F38.W1 97 /r A V/V FMA 多倍包装 双精度浮点

VFMSUBADD132PD ymm1,ymm2,数值来自ymm1和ymm3/mem,在ymm2中减去/添加元素,并将结果ymm3/m256放入ymm1.

VEX.256.66.0F38.W1 A7 /r A V/V FMA 多倍包装 双精度浮点

VFMSUBADD213PD ymm1,ymm2,来自ymm1和ymm2的值,在ymm3/mem中减去/添加元素,结果为ymm1. ymm3/m256.

VEX.256.66.0F38.W1 B7 /r A V/V FMA 从ymm2和ymm3/mem,VFMSUBADD231PD ymm1,ymm2,在ymm1中减去/添加元素,并将结果ymm3/m256放入ymm1.

EVEX.128.66.0F38.W1 97 /r B V/V (AVX512VL AND 乘积装配的 双精度浮点).

```text
                                          AVX512F) OR    values from xmm1 and xmm3/m128/m64bcst,
```

VFMSUBADD132PD xmm1 {k1}{z},

```text
                                          AVX10.1        subtract/add elements in xmm2 and put result
```

xmm2, xmm3/m128/m64bcst                                  in xmm1 subject to writemask k1.

EVEX.128.66.0F38.W1 A7 /r B V/V (AVX512VL AND 倍数包装的 双精度浮点).

```text
                                          AVX512F) OR    values from xmm1 and xmm2, subtract/add
```

VFMSUBADD213PD xmm1 {k1}{z},

```text
                                          AVX10.1        elements in xmm3/m128/m64bcst and put
```

xmm2, xmm3/m128/m64bcst 的结果为 xmm1 受书写mask k1.

EVEX.128.66.0F38.W1 B7 /r B V/V (AVX512VL AND 乘积装配的 双精度浮点).

```text
                                          AVX512F) OR    values from xmm2 and xmm3/m128/m64bcst,
```

VFMSUBADD231PD xmm1 {k1}{z},

```text
                                          AVX10.1        subtract/add elements in xmm1 and put result
```

xmm2, xmm3/m128/m64bcst                                  in xmm1 subject to writemask k1.

EVEX.256.66.0F38.W1 97 /r B V/V (AVX512VL AND 乘积装配的 双精度浮点).

```text
                                          AVX512F) OR    values from ymm1 and ymm3/m256/m64bcst,
```

VFMSUBADD132PD ymm1 {k1}{z},

```text
                                          AVX10.1        subtract/add elements in ymm2 and put result
```

ymm2, ymm3/m256/m64bcst                                  in ymm1 subject to writemask k1.

EVEX.256.66.0F38.W1 A7 /r B V/V (AVX512VL AND 倍数包装的 双精度浮点).

```text
                                          AVX512F) OR    values from ymm1 and ymm2, subtract/add
```

VFMSUBADD213PD ymm1 {k1}{z},

```text
                                          AVX10.1        elements in ymm3/m256/m64bcst and put
```

ymm2, ymm3/m256/m64bcst 的结果为 ymm1 受书写mask k1.

EVEX.256.66.0F38.W1 B7 /r B V/V (AVX512VL AND 乘积装配的 双精度浮点).

```text
                                          AVX512F) OR    values from ymm2 and ymm3/m256/m64bcst,
```

VFMSUBADD231PD ymm1 {k1}{z},

```text
                                          AVX10.1        subtract/add elements in ymm1 and put result
```

ymm2, ymm3/m256/m64bcst                                  in ymm1 subject to writemask k1.

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD- Fused 倍式替代减式/添加包装双精度

操作码/ Op 64/32 CPUID 特性描述 En Bit模式旗

```text
                                         Support                 Multiply packed double precision floating-point
```

EVEX.512.66.0F38.W1 97 /r 值来自 zmm1 和 zmm3/m512/m64bcst, VFMSUBADD132PD k1 {zmm1}{z}, B V/V AVX512F 减去/添加 zmm2 的元素,并生成 zmm2, zmm3/m512/m64bcst{er} OR AVX10.1 zmm1 受 写掩码 k1 约束.

EVEX.512.66.0F38.W1 A7 /r B V/V AVX512F 多倍包装 双精度浮点 VFMSUBADD213PD zmm1 {k1}{z},OR AVX10.1值来自zmm1和zmm2,减去/add zmm2,zmm3/m512/m64bcst{er}元素在zmm3/m512/m64bcst中并放入.

```text
                              B          V/V      AVX512F        result in zmm1 subject to writemask k1.
```

EVEX.512.66.0F38.W1 B7 /r OR AVX10.1 VFMSUBADD231PD zmm1 {k1}{z},多倍包装的双精度浮点 zmm2,zmm3/m512/m64bcst{er}来自zmm2和zmm3/m512/m64bcst的值,在zmm1中减去/add元素,并将结果放入zmm1中服从写掩码 k1.

## 说明

VFMSUBADD132PD : (英语). 将两个,四个,或八个打包双精度浮点值从第一源操作数乘以第三个源操作数中的两个或四个打包双精度浮点值. 从无限精度中间结果中,减去奇数的双精度浮点元素,并在第二源操作数中加入偶数的双精度浮点值,进行四舍五入,并将所产生的2或4个打包双精度浮点值存储到目标操作数(第一源操作数).

VFMSUBADD213PD : (英语). 将第二源操作数的2,4,或8个打包双精度浮点值乘以第一源操作数的2,4个打包双精度浮点值. 从无限精度中间结果中,减去奇数的双精度浮点元素,并在第三个源操作数中加入偶数的双精度浮点值,进行四舍五入,并将所产生的两四个打包双精度浮点值存储到目标操作数(第一源操作数).

VFMSUBADD231PD : (英语). 将两个,四个,或八个打包双精度浮点值从第二源操作数乘以第三个源操作数中的两个或四个打包双精度浮点值. 从无限精度中间结果中,减去奇数的双精度浮点元素,并在第一源操作数中加入偶数的双精度浮点值,进行四舍五入,并将所产生的2或4个打包双精度浮点值存储到目标操作数(第一源操作数).

EVEX 编码版本 : 目标操作数(也是第一源操作数)和第二源操作数是ZMM/YMM/XMM登记册. 第三个源操作数是一个ZMM/YMM/XMM注册,一个512/256/128位内存位置或512/256/128位矢量从一个64位内存位置广播. 目标操作数是有条件更新的,带有写面具k1.

VEX.256 编码版本 : 目标操作数(也是第一源操作数)是一个YMM的注册,并在reg field中编码. 第二源操作数是一个YMM的寄存器,编码为VEX.vvvv. 第三个源操作数是一个YMM寄存器或256位内存位置,并在rm field中编码.

VEX.128 编码版本 : 目标操作数(也是第一源操作数)是一个XMM的注册,并在reg field中编码. 第二源操作数是一个XMM的寄存器,编码为VEX.vvvv. 第三个源操作数是一个XMM寄存器或128位内存位置,并在rm field中编码. YMM目的地的上方128位注册被清零.

编译工具可以可选择支持汇总表操作码/指令栏列出的每个指令元的互补元音. 辅助元音在情况中的行为

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD- Fused 倍式替代减式/添加包装双精度

涉及NANs的,受操作码/指令列中定义的指令元量的定义管辖.

## 行动

```text
In the operations below, "*" and "+" symbols represent multiplication and addition with infinite precision inputs and outputs (no
rounding).

VFMSUBADD132PD DEST, SRC2, SRC3
IF (VEX.128) THEN

    DEST[63:0] := RoundFPControl_MXCSR(DEST[63:0]*SRC3[63:0] + SRC2[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(DEST[127:64]*SRC3[127:64] - SRC2[127:64])
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[63:0] := RoundFPControl_MXCSR(DEST[63:0]*SRC3[63:0] + SRC2[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(DEST[127:64]*SRC3[127:64] - SRC2[127:64])
    DEST[191:128] := RoundFPControl_MXCSR(DEST[191:128]*SRC3[191:128] + SRC2[191:128])
    DEST[255:192] := RoundFPControl_MXCSR(DEST[255:192]*SRC3[255:192] - SRC2[255:192]
FI

VFMSUBADD213PD DEST, SRC2, SRC3
IF (VEX.128) THEN

    DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*DEST[63:0] + SRC3[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(SRC2[127:64]*DEST[127:64] - SRC3[127:64])
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*DEST[63:0] + SRC3[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(SRC2[127:64]*DEST[127:64] - SRC3[127:64])
    DEST[191:128] := RoundFPControl_MXCSR(SRC2[191:128]*DEST[191:128] + SRC3[191:128])
    DEST[255:192] := RoundFPControl_MXCSR(SRC2[255:192]*DEST[255:192] - SRC3[255:192]
FI

VFMSUBADD231PD DEST, SRC2, SRC3
IF (VEX.128) THEN

    DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*SRC3[63:0] + DEST[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(SRC2[127:64]*SRC3[127:64] - DEST[127:64])
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*SRC3[63:0] + DEST[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(SRC2[127:64]*SRC3[127:64] - DEST[127:64])
    DEST[191:128] := RoundFPControl_MXCSR(SRC2[191:128]*SRC3[191:128] + DEST[191:128])
    DEST[255:192] := RoundFPControl_MXCSR(SRC2[255:192]*SRC3[255:192] - DEST[255:192]
FI

VFMSUBADD132PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF (VL = 512) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

     THEN

        IF j *is even*

            THEN DEST[i+63:i] :=

            RoundFPControl(DEST[i+63:i]*SRC3[i+63:i] + SRC2[i+63:i])

            ELSE DEST[i+63:i] :=

            RoundFPControl(DEST[i+63:i]*SRC3[i+63:i] - SRC2[i+63:i])

        FI

     ELSE

        IF *merging-masking*      ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE                  ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[63:0] + SRC2[i+63:i])
                                  ELSE
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[i+63:i] + SRC2[i+63:i])
                            FI;
                      ELSE
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[63:0] - SRC2[i+63:i])
                                  ELSE
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[i+63:i] - SRC2[i+63:i])
                            FI;
                FI

     ELSE

        IF *merging-masking*      ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE                  ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

VFMSUBADD213PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (2, 128), (4, 256), (8, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+63:i] :=

                      RoundFPControl(SRC2[i+63:i]*DEST[i+63:i] + SRC3[i+63:i])

                      ELSE DEST[i+63:i] :=

                      RoundFPControl(SRC2[i+63:i]*DEST[i+63:i] - SRC3[i+63:i])

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD213PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] + SRC3[63:0])
                                  ELSE
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] + SRC3[i+63:i])
                            FI;
                      ELSE
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] - SRC3[63:0])
                                  ELSE
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] - SRC3[i+63:i])

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

                      FI;

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (2, 128), (4, 256), (8, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+63:i] :=

                      RoundFPControl(SRC2[i+63:i]*SRC3[i+63:i] + DEST[i+63:i])

                      ELSE DEST[i+63:i] :=

                      RoundFPControl(SRC2[i+63:i]*SRC3[i+63:i] - DEST[i+63:i])

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[63:0] + DEST[i+63:i])
                                  ELSE

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

                              DEST[i+63:i] :=
                  RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[i+63:i] + DEST[i+63:i])
                  FI;
            ELSE
                  IF (EVEX.b = 1)

                        THEN
                              DEST[i+63:i] :=

                  RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[63:0] - DEST[i+63:i])

                       ELSE

                       DEST[i+63:i] :=

            RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[i+63:i] - DEST[i+63:i])

            FI;

        FI

     ELSE

        IF *merging-masking*            ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE                        ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VFMSUBADDxxxPD __m512d _mm512_fmsubadd_pd(__m512d a, __m512d b, __m512d c);
VFMSUBADDxxxPD __m512d _mm512_fmsubadd_round_pd(__m512d a, __m512d b, __m512d c, int r);
VFMSUBADDxxxPD __m512d _mm512_mask_fmsubadd_pd(__m512d a, __mmask8 k, __m512d b, __m512d c);
VFMSUBADDxxxPD __m512d _mm512_maskz_fmsubadd_pd(__mmask8 k, __m512d a, __m512d b, __m512d c);
VFMSUBADDxxxPD __m512d _mm512_mask3_fmsubadd_pd(__m512d a, __m512d b, __m512d c, __mmask8 k);
VFMSUBADDxxxPD __m512d _mm512_mask_fmsubadd_round_pd(__m512d a, __mmask8 k, __m512d b, __m512d c, int r);
VFMSUBADDxxxPD __m512d _mm512_maskz_fmsubadd_round_pd(__mmask8 k, __m512d a, __m512d b, __m512d c, int r);
VFMSUBADDxxxPD __m512d _mm512_mask3_fmsubadd_round_pd(__m512d a, __m512d b, __m512d c, __mmask8 k, int r);
VFMSUBADDxxxPD __m256d _mm256_mask_fmsubadd_pd(__m256d a, __mmask8 k, __m256d b, __m256d c);
VFMSUBADDxxxPD __m256d _mm256_maskz_fmsubadd_pd(__mmask8 k, __m256d a, __m256d b, __m256d c);
VFMSUBADDxxxPD __m256d _mm256_mask3_fmsubadd_pd(__m256d a, __m256d b, __m256d c, __mmask8 k);
VFMSUBADDxxxPD __m128d _mm_mask_fmsubadd_pd(__m128d a, __mmask8 k, __m128d b, __m128d c);
VFMSUBADDxxxPD __m128d _mm_maskz_fmsubadd_pd(__mmask8 k, __m128d a, __m128d b, __m128d c);
VFMSUBADDxxxPD __m128d _mm_mask3_fmsubadd_pd(__m128d a, __m128d b, __m128d c, __mmask8 k);
VFMSUBADDxxxPD __m128d _mm_fmsubadd_pd (__m128d a, __m128d b, __m128d c);
VFMSUBADDxxxPD __m256d _mm256_fmsubadd_pd (__m256d a, __m256d b, __m256d c);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

VEX-encoded指令,参见表2-19,"第2类例外条件". EVEX-encoded指令,参见表2-48,"第E2类例外条件".

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD- Fused 倍式替代减式/添加包装双精度

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH- Fused 倍式替代减法/添加包装的FP16值

操作码/ Op 64/32 CPUID 特性描述 En Bit Mode 旗帜支持

EVEX.128.66.MAP6.W0 97 /r A V/V(AVX512 FP16) 从 xmm1 和 FP16 中乘以包装的 FP16 值

VFMSUBADD132PH xmm1{k1}{z},AND AVX512VL) xmm3/m128/m16bcst,在xmm2,xmm3/m128/m16bcst OR AVX10.1 xmm2中减去/添加元素,并将结果存储在xmm1中服从写掩码 k1.

EVEX.256.66.MAP6.W0 97 /r A V/V(AVX512 FP16) 从 ymm1 和 FP16 中乘以包装的 FP16 值

VFMSUBADD132PH ymm1{k1}{z},AND AVX512VL) ymm3/m256/m16bcst,在ymm2,ymm3/m256/m16bcst OR AVX10.1 ymm2中减去/添加元素,并将结果存储在ymm1中服从写掩码 k1.

EVEX.512.66.MAP6.W097 /r A V/V AVX512 FP16 乘以包装FP16来自zmm1其他资源AVX10.1 VFMSUBADD132PH zmm1{k1}{z}, zmm3/m512/m16bcst, 减去/添加zmm2, zmm3/m512/m16bcst {er} (韩语).zmm2,并存储结果为zmm1须遵守

writemask k1.

EVEX.128.66.MAP6.W0A7/r AV/V(AVX512 FP16) 乘以包装FP16来自xmm1和VFMSUBADD213PH xmm1{k1}{z}, AND AVX512VL) xmm2中,减去/添加元素xmm2, xmm3/m128/m16bcst 其他资源AVX10.1 xmm3/m128/m16bcst,并存储结果为

xmm1 subject to writemask k1.

EVEX.256.66.MAP6.W0A7/r AV/V(AVX512 FP16) 乘以包装FP16来自ymm1和VFMSUBADD213PH ymm1{k1}{z}, AND AVX512VL) ymm2中,减去/添加元素ymm2, ymm3/m256/m16bcst 其他资源AVX10.1 ymm3/m256/m16bcst,并存储结果为

ymm1 subject to writemask k1.

EVEX.512.66.MAP6.W0A7/r AV/V AVX512 FP16 倍数包装FP16来自zmm1和VFMSUBADD213PH zmm1{k1OR,或AVX10.1 zmm2中,减去/添加元素zmm2, zmm3/m512/m16bcst {er} (韩语).zmm3/m512/m16bcst,并存储结果为

zmm1 subject to writemask k1.

EVEX.128.66.MAP6.W0B7/r A V/V(AVX512 FP16) 乘以包装FP16来自xmm2和VFMSUBADD231PH xmm1{k1}{z}, AND AVX512VL) xmm3/m128/m16bcst, 减去/添加xmm2, xmm3/m128/m16bcst 其他资源AVX10.1 xmm1,并存储结果为xmm1须遵守

writemask k1.

EVEX.256.66.MAP6.W0B7/r A V/V(AVX512 FP16) 乘以包装FP16来自ymm2和VFMSUBADD231PH ymm1{k1}{z}, AND AVX512VL) ymm3/m256/m16bcst, 减去/添加ymm2, ymm3/m256/m16bcst 其他资源AVX10.1 ymm1,并存储结果为ymm1须遵守

writemask k1.

EVEX.512.66.MAP6.W0B7/r A V/V AVX512 FP16 倍数包装FP16来自zmm2和VFMSUBADD231PH zmm1{k1OR,或AVX10.1 zmm3/m512/m16bcst, 减去/添加zmm2, zmm3/m512/m16bcst {er} (韩语).zmm1,并存储结果为zmm1须遵守

writemask k1.

## 说明

本指令使用三个 源操作数 值对 FP16 值进行组合乘法(甚至元素)或乘法(奇数)的计算,并在 目标操作数 中写入结果。 目标操作数亦为第一源操作数. 标注"132","213"和"231"表示使用A中的操作数. * B +/- C,每个数字对应操作数数字,目的地为操作数 1;见表5-10.

目的地元素根据写掩码更新.

** VFMSUBADD [132,213,231] PH 奇数甚至元素的标记**

| 标记 | 奇数元素 | 甚至连元素 |
| --- | --- | --- |
| 132 度 = | 脱落*src3-src2 de | st = 脱落度*src3+src2 |

## 行动

```text
VFMSUBADD132PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a register
VL = 128, 256 or 512
KL := VL/16

IF (VL = 512) AND (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(DEST.fp16[j]*SRC3.fp16[j] + SRC2.fp16[j])
          ELSE:
                DEST.fp16[j] := RoundFPControl(DEST.fp16[j]*SRC3.fp16[j] - SRC2.fp16[j])
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a memory source
VL = 128, 256 or 512
KL := VL/16

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF EVEX.b = 1:
                t3 := SRC3.fp16[0]
          ELSE:
                t3 := SRC3.fp16[j]
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(DEST.fp16[j] * t3 + SRC2.fp16[j])
          ELSE:
                DEST.fp16[j] := RoundFPControl(DEST.fp16[j] * t3 - SRC2.fp16[j])
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values

    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0:

VFMSUBADD213PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a register
VL = 128, 256 or 512
KL := VL/16

IF (VL = 512) AND (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j]*DEST.fp16[j] + SRC3.fp16[j])
          ELSE
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j]*DEST.fp16[j] - SRC3.fp16[j])
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0

VFMSUBADD213PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a memory source
VL = 128, 256 or 512
KL := VL/16

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF EVEX.b = 1:
                t3 := SRC3.fp16[0]
          ELSE:
                t3 := SRC3.fp16[j]
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j] * DEST.fp16[j] + t3 )
          ELSE:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j] * DEST.fp16[j] - t3 )
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0:

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values

VFMSUBADD231PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a register
VL = 128, 256 or 512
KL := VL/16

IF (VL = 512) AND (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *j is even:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j]*SRC3.fp16[j] + DEST.fp16[j])
          ELSE:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j]*SRC3.fp16[j] - DEST.fp16[j])
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a memory source
VL = 128, 256 or 512
KL := VL/16

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF EVEX.b = 1:
                t3 := SRC3.fp16[0]
          ELSE:
                t3 := SRC3.fp16[j]
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j] * t3 + DEST.fp16[j] )
          ELSE:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j] * t3 - DEST.fp16[j] )
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values
```

## Intel C/C++ 内在编译器

```c
VFMSUBADD132PH, VFMSUBADD213PH, and VFMSUBADD231PH: __m128h _mm_fmsubadd_ph (__m128h a, __m128h b, __m128h c);
__m128h _mm_mask_fmsubadd_ph (__m128h a, __mmask8 k, __m128h b, __m128h c);
__m128h _mm_mask3_fmsubadd_ph (__m128h a, __m128h b, __m128h c, __mmask8 k);
__m128h _mm_maskz_fmsubadd_ph (__mmask8 k, __m128h a, __m128h b, __m128h c);
__m256h _mm256_fmsubadd_ph (__m256h a, __m256h b, __m256h c);
__m256h _mm256_mask_fmsubadd_ph (__m256h a, __mmask16 k, __m256h b, __m256h c);
__m256h _mm256_mask3_fmsubadd_ph (__m256h a, __m256h b, __m256h c, __mmask16 k);
__m256h _mm256_maskz_fmsubadd_ph (__mmask16 k, __m256h a, __m256h b, __m256h c);
__m512h _mm512_fmsubadd_ph (__m512h a, __m512h b, __m512h c);
__m512h _mm512_mask_fmsubadd_ph (__m512h a, __mmask32 k, __m512h b, __m512h c);
__m512h _mm512_mask3_fmsubadd_ph (__m512h a, __m512h b, __m512h c, __mmask32 k);
__m512h _mm512_maskz_fmsubadd_ph (__mmask32 k, __m512h a, __m512h b, __m512h c);
__m512h _mm512_fmsubadd_round_ph (__m512h a, __m512h b, __m512h c, const int rounding);
__m512h _mm512_mask_fmsubadd_round_ph (__m512h a, __mmask32 k, __m512h b, __m512h c, const int rounding);
__m512h _mm512_mask3_fmsubadd_round_ph (__m512h a, __m512h b, __m512h c, __mmask32 k, const int rounding);
__m512h _mm512_maskz_fmsubadd_round_ph (__mmask32 k, __m512h a, __m512h b, __m512h c, const int rounding);
```

## SIMD 浮点 例外

Invalid, Underflow, Overflow, Precision, Denormal.

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH- Fused 倍式替代减法/添加包装的FP16值

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS- Fused 倍式替代减法/ Add of 打包单精度浮点值

操作码/ Op/ 64/32 CPUID 特性描述指令 En Bit模式旗帜支持

VEX.128.66.0F38.W0 97 /r A V/V FMA 多倍包装 单精度浮点

VFMSUBADD132PS xmm1,xmm2,数值来自xmm1和xmm3/mem,在xmm2中减去/添加元素,并结果为xmm1. xmm3/m128.

VEX.128.66.0F38.W0 A7 /r A V/V FMA乘数打包单精度浮点值从xmm1和xmm2,减去/添加VFMSUBADD213PS xmm1, xmm2时,xmm3将结果放入xmm1. xmm3/m128

VEX.128.66.0F38.W0 B7 /r A V/V FMA 从 xmm2 和 xmm3/mem 中乘积的单精度浮点值,减去/add VFMSUBADD231PS xmm1,xmm2,元素在 xmm1 中,将结果放入 xmm1.

xmm3/m128

VEX.256.66.0F38.W0 97 /r A V/V FMA 多倍包装 单精度浮点

VFMSUBADD132PS ymm1,ymm2,数值来自ymm1和ymm3/mem,在ymm2中减去/添加元素,并结果为ymm1. ymm3/m256.

VEX.256.66.0F38.W0 A7 /r A V/V FMA 多倍包装 单精度浮点

VFMSUBADD213PS ymm1,ymm2,来自ymm1和ymm2的值,在ymm3/mem中减去/添加元素,结果为ymm1. ymm3/m256.

VEX.256.66.0F38.W0 B7 /r A V/V FMA乘数打包单精度浮点值从ymm2和ymm3/米,减去/添加VFMSUBADD231PS ymm1, ymm2时,ymm1并产生结果ymm1. ymm3/m256

EVEX.128.66.0F38.W0 97 /r B V/V (AVX512VL AND 乘积装配的 单精度浮点).

```text
                                          AVX512F) OR    values from xmm1 and xmm3/m128/m32bcst,
```

VFMSUBADD132PS xmm1 {k1}{z},              AVX10.1        subtract/add elements in xmm2 and put result in

xmm2, xmm3/m128/m32bcst xmm1 受书写mask k1约束.

EVEX.128.66.0F38.W0 A7 /r B V/V (AVX512VL AND 倍数包装的 单精度浮点).

```text
                                          AVX512F) OR    values from xmm1 and xmm2, subtract/add
```

VFMSUBADD213PS xmm1 {k1}{z},AVX10.1元素在xmm3/m128/m32bcst中并放结果

xmm2, xmm3/m128/m32bcst                                  in xmm1 subject to writemask k1.

EVEX.128.66.0F38.W0 B7 /r B V/V (AVX512VL AND 乘积装配的 单精度浮点).

```text
                                          AVX512F) OR    values from xmm2 and xmm3/m128/m32bcst,
```

VFMSUBADD231PS xmm1 {k1}{z},              AVX10.1        subtract/add elements in xmm1 and put result in

xmm2, xmm3/m128/m32bcst xmm1 受书写mask k1约束.

EVEX.256.66.0F38.W0 97 /r B V/V (AVX512VL AND 乘积装配的 单精度浮点).

```text
                                          AVX512F) OR    values from ymm1 and ymm3/m256/m32bcst,
```

VFMSUBADD132PS ymm1 {k1}{z},              AVX10.1        subtract/add elements in ymm2 and put result in

ymm2, ymm3/m256/m32bcst ymm1 受书写mask k1约束.

EVEX.256.66.0F38.W0 A7 /r B V/V (AVX512VL AND 倍数包装的 单精度浮点).

```text
                                          AVX512F) OR    values from ymm1 and ymm2, subtract/add
```

VFMSUBADD213PS ymm1 {k1}{z},AVX10.1元素在ymm3/m256/m32bcst中并放结果

ymm2, ymm3/m256/m32bcst                                  in ymm1 subject to writemask k1.

EVEX.256.66.0F38.W0 B7 /r B V/V (AVX512VL AND 乘积装配的 单精度浮点).

```text
                                          AVX512F) OR    values from ymm2 and ymm3/m256/m32bcst,
```

VFMSUBADD231PS ymm1 {k1}{z},              AVX10.1        subtract/add elements in ymm1 and put result in

ymm2, ymm3/m256/m32bcst ymm1 受书写mask k1约束.

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS- Fused 倍式替代减式/添加包装单精度

操作码/ Op 64/32 CPUID 特性描述 En Bit模式旗

```text
                                 Support                      Multiply packed single precision floating-point
```

EVEX.512.66.0F38.W0 97/r值来自 zmm1 和 zmm3/m512/m32bcst, VFMSUBADD132PS zmm1 {k1}{z}, B V/V AVX512F 在 zmm2 中减去/添加元素,并生成 zmm2, zmm3/m512/m32bcst{er} OR AVX10.1 zmm1 受 写掩码 k1 约束.

EVEX.512.66.0F38.W0 A7 /r B V/V AVX512F 多倍包装 单精度浮点

```text
                                               OR AVX10.1     values from zmm1 and zmm2, subtract/add
```

VFMSUBADD213PS zmm1 {k1,元素在zmm3/m512/m32bcst 和结果zmm1须遵守写掩码 k1. zmm2, zmm3/m512/m32bcst{er} 乘以包装单精度浮点 EVEX.512.66.0F38.W0 B7 /r B V/V AVX512F来自zmm2和zmm3/m512/m32bcst, (中文(简体) ).

```text
                                               OR AVX10.1     subtract/add elements in zmm1 and put result in
```

VFMSUBADD231PS zmm1 {k1}{z},                                  zmm1 subject to writemask k1.

zmm2, zmm3/m512/m32bcst{er}

## 说明

VFMSUBADD132PS : (英语). 将四,八或十六打包单精度浮点值从第一源操作数乘以第三源操作数中对应的打包单精度浮点值. 从无限精度中间结果中减去奇数的单精度浮点元素,并在第二源操作数中加入偶数的单精度浮点值,进行四舍五入,并将由此产生的打包单精度浮点值存储到目标操作数(第一源操作数).

VFMSUBADD213PS : (英语). 在第一源操作数中将四,八或十六个打包单精度浮点值从第二源操作数乘以相应的打包单精度浮点值. 从无限精度中间结果中减去奇数的单精度浮点元素,并在第三个源操作数中加入偶数的单精度浮点值,进行四舍五入,并将由此产生的打包单精度浮点值存储到目标操作数(第一源操作数).

VFMSUBADD231PS : (英语). 将四,八或十六打包单精度浮点值从第二源操作数乘以第三源操作数中对应的打包单精度浮点值. 从无限精度中间结果中减去奇数的单精度浮点元素,并在第一源操作数中加入偶数的单精度浮点值,进行四舍五入,并将由此产生的打包单精度浮点值存储到目标操作数(第一源操作数).

EVEX 编码版本 : 目标操作数(也是第一源操作数)和第二源操作数是ZMM/YMM/XMM登记册. 第三个源操作数是一个ZMM/YMM/XMM注册,一个512/256/128位内存位置或512/256/128位矢量从32位内存位置广播. 目标操作数是有条件更新的,带有写面具k1.

VEX.256 编码版本 : 目标操作数(也是第一源操作数)是一个YMM的注册,并在reg field中编码. 第二源操作数是一个YMM的寄存器,编码为VEX.vvvv. 第三个源操作数是一个YMM寄存器或256位内存位置,并在rm field中编码.

VEX.128 编码版本 : 目标操作数(也是第一源操作数)是一个XMM的注册,并在reg field中编码. 第二源操作数是一个XMM的寄存器,编码为VEX.vvvv. 第三个源操作数是一个XMM寄存器或128位内存位置,并在rm field中编码. YMM目的地的上方128位注册被清零.

编译工具可以可选择支持汇总表操作码/指令栏列出的每个指令元的互补元音. 在涉及NANs的情况中,互补的mnemonic的行为受操作码/指令列中定义的指令mnemonic的定义制约.

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS- Fused 倍式替代减式/添加包装单精度

## 行动

```text
In the operations below, "*" and "+" symbols represent multiplication and addition with infinite precision inputs and outputs (no
rounding).

VFMSUBADD132PS DEST, SRC2, SRC3
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM -1{

    n := 64*i;
    DEST[n+31:n] := RoundFPControl_MXCSR(DEST[n+31:n]*SRC3[n+31:n] + SRC2[n+31:n])
    DEST[n+63:n+32] := RoundFPControl_MXCSR(DEST[n+63:n+32]*SRC3[n+63:n+32] -SRC2[n+63:n+32])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFMSUBADD213PS DEST, SRC2, SRC3
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM -1{

    n := 64*i;
    DEST[n+31:n] := RoundFPControl_MXCSR(SRC2[n+31:n]*DEST[n+31:n] +SRC3[n+31:n])
    DEST[n+63:n+32] := RoundFPControl_MXCSR(SRC2[n+63:n+32]*DEST[n+63:n+32] -SRC3[n+63:n+32])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFMSUBADD231PS DEST, SRC2, SRC3
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM -1{

    n := 64*i;
    DEST[n+31:n] := RoundFPControl_MXCSR(SRC2[n+31:n]*SRC3[n+31:n] + DEST[n+31:n])
    DEST[n+63:n+32] := RoundFPControl_MXCSR(SRC2[n+63:n+32]*SRC3[n+63:n+32] -DEST[n+63:n+32])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

VFMSUBADD132PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+31:i] :=

                      RoundFPControl(DEST[i+31:i]*SRC3[i+31:i] + SRC2[i+31:i])

                      ELSE DEST[i+31:i] :=

                      RoundFPControl(DEST[i+31:i]*SRC3[i+31:i] - SRC2[i+31:i])

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+31:i] :=
                                  RoundFPControl_MXCSR(DEST[i+31:i]*SRC3[31:0] + SRC2[i+31:i])
                                  ELSE
                                        DEST[i+31:i] :=
                                  RoundFPControl_MXCSR(DEST[i+31:i]*SRC3[i+31:i] + SRC2[i+31:i])
                            FI;
                      ELSE
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+31:i] :=
                            RoundFPControl_MXCSR(DEST[i+31:i]*SRC3[31:0] - SRC2[i+31:i])
                                  ELSE
                                        DEST[i+31:i] :=
                            RoundFPControl_MXCSR(DEST[i+31:i]*SRC3[i+31:i] - SRC2[i+31:i])

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

                              FI;
                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD213PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+31:i] :=

                      RoundFPControl(SRC2[i+31:i]*DEST[i+31:i] + SRC3[i+31:i])

                      ELSE DEST[i+31:i] :=

                      RoundFPControl(SRC2[i+31:i]*DEST[i+31:i] - SRC3[i+31:i])

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD213PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+31:i] :=
                            RoundFPControl_MXCSR(SRC2[i+31:i]*DEST[i+31:i] + SRC3[31:0])

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

                           ELSE

                                  DEST[i+31:i] :=

                           RoundFPControl_MXCSR(SRC2[i+31:i]*DEST[i+31:i] + SRC3[i+31:i])

                      FI;

                      ELSE

                           IF (EVEX.b = 1)

                                  THEN

                                  DEST[i+31:i] :=

                           RoundFPControl_MXCSR(SRC2[i+31:i]*DEST[i+31:i] - SRC3[i+31:i])

                                  ELSE

                                  DEST[i+31:i] :=

                           RoundFPControl_MXCSR(SRC2[i+31:i]*DEST[i+31:i] - SRC3[31:0])

                           FI;

                  FI

          ELSE

                  IF *merging-masking*             ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                         ; zeroing-masking

                           DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+31:i] :=

                           RoundFPControl(SRC2[i+31:i]*SRC3[i+31:i] + DEST[i+31:i])

                      ELSE DEST[i+31:i] :=

                           RoundFPControl(SRC2[i+31:i]*SRC3[i+31:i] - DEST[i+31:i])

                  FI

          ELSE

                  IF *merging-masking*             ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                         ; zeroing-masking

                           DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (4, 128), (8, 256), (16, 512)

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF j *is even*

                 THEN

                    IF (EVEX.b = 1)

                             THEN

                             DEST[i+31:i] :=

                             RoundFPControl_MXCSR(SRC2[i+31:i]*SRC3[31:0] + DEST[i+31:i])

                             ELSE

                             DEST[i+31:i] :=

                             RoundFPControl_MXCSR(SRC2[i+31:i]*SRC3[i+31:i] + DEST[i+31:i])

                    FI;

                 ELSE

                    IF (EVEX.b = 1)

                             THEN

                             DEST[i+31:i] :=

                    RoundFPControl_MXCSR(SRC2[i+31:i]*SRC3[31:0] - DEST[i+31:i])

                             ELSE

                             DEST[i+31:i] :=

                    RoundFPControl_MXCSR(SRC2[i+31:i]*SRC3[i+31:i] - DEST[i+31:i])

                    FI;

             FI

     ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                         ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VFMSUBADDxxxPS __m512 _mm512_fmsubadd_ps(__m512 a, __m512 b, __m512 c);
VFMSUBADDxxxPS __m512 _mm512_fmsubadd_round_ps(__m512 a, __m512 b, __m512 c, int r);
VFMSUBADDxxxPS __m512 _mm512_mask_fmsubadd_ps(__m512 a, __mmask16 k, __m512 b, __m512 c);
VFMSUBADDxxxPS __m512 _mm512_maskz_fmsubadd_ps(__mmask16 k, __m512 a, __m512 b, __m512 c);
VFMSUBADDxxxPS __m512 _mm512_mask3_fmsubadd_ps(__m512 a, __m512 b, __m512 c, __mmask16 k);
VFMSUBADDxxxPS __m512 _mm512_mask_fmsubadd_round_ps(__m512 a, __mmask16 k, __m512 b, __m512 c, int r);
VFMSUBADDxxxPS __m512 _mm512_maskz_fmsubadd_round_ps(__mmask16 k, __m512 a, __m512 b, __m512 c, int r);
VFMSUBADDxxxPS __m512 _mm512_mask3_fmsubadd_round_ps(__m512 a, __m512 b, __m512 c, __mmask16 k, int r);
VFMSUBADDxxxPS __m256 _mm256_mask_fmsubadd_ps(__m256 a, __mmask8 k, __m256 b, __m256 c);
VFMSUBADDxxxPS __m256 _mm256_maskz_fmsubadd_ps(__mmask8 k, __m256 a, __m256 b, __m256 c);
VFMSUBADDxxxPS __m256 _mm256_mask3_fmsubadd_ps(__m256 a, __m256 b, __m256 c, __mmask8 k);
VFMSUBADDxxxPS __m128 _mm_mask_fmsubadd_ps(__m128 a, __mmask8 k, __m128 b, __m128 c);
VFMSUBADDxxxPS __m128 _mm_maskz_fmsubadd_ps(__mmask8 k, __m128 a, __m128 b, __m128 c);
VFMSUBADDxxxPS __m128 _mm_mask3_fmsubadd_ps(__m128 a, __m128 b, __m128 c, __mmask8 k);
VFMSUBADDxxxPS __m128 _mm_fmsubadd_ps (__m128 a, __m128 b, __m128 c);
VFMSUBADDxxxPS __m256 _mm256_fmsubadd_ps (__m256 a, __m256 b, __m256 c);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

VEX-encoded指令,参见表2-19,"第2类例外条件". EVEX-encoded指令,参见表2-48,"第E2类例外条件".

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS- Fused 倍式替代减式/添加包装单精度
