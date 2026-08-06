---
summary: 缩放 标量 浮点32 值与浮点32 值
---

## 说明

在第一源操作数中执行一个浮点比例尺的标量 单精度浮点值,方法是将其乘以2到第二源操作数中浮点32值的功率.

此操作的方程式由:

```text
xmm1 := xmm2*2floor(xmm3).
```

地板(xmm3)是指最大整数值xmm3.

如果结果不能以单一精度表示,则会发出适当的溢出响应(正缩放操作数),或适当的下流响应(负缩放操作数). 溢出和下流响应取决于四舍五入模式(对于符合IEEE的四舍五入),以及MXCSR的其他设置(例外面具位,FTZ位),以及SAE位.

EVEX 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM登记册或内存位置. 目的地操作器是一个 XMM 的寄存器,有条件的更新有 writemask k1.

特殊情况输入值的处理情况见表5-37和表5-41。

## 行动

```text
SCALE(SRC1, SRC2)
{

                ; Check for denormal operands
TMP_SRC2 := SRC2
TMP_SRC1 := SRC1
IF (SRC2 is denormal AND MXCSR.DAZ) THEN TMP_SRC2=0
IF (SRC1 is denormal AND MXCSR.DAZ) THEN TMP_SRC1=0
/* SRC2 is a 32 bits floating-point value */
DEST[31:0] := TMP_SRC1[31:0] * POW(2, Floor(TMP_SRC2[31:0]))
}


VSCALEFSS (EVEX encoded version)

IF (EVEX.b= 1) and SRC2 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] OR *no writemask*

     THEN DEST[31:0] := SCALE(SRC1[31:0], SRC2[31:0])

     ELSE

     IF *merging-masking*                ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                          ; zeroing-masking

           DEST[31:0] := 0

     FI

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VSCALEFSS __m128 _mm_scalef_round_ss(__m128 a, __m128 b, int);
VSCALEFSS __m128 _mm_mask_scalef_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, int);
VSCALEFSS __m128 _mm_maskz_scalef_round_ss(__mmask8 k, __m128 a, __m128 b, int);
```

## SIMD 浮点 例外

过度流, 内流, 无效, 精度, 异常( 对于 Src1) 。 Src2 没有报告异常情况。

## 其他例外

见表2-49"E3类例外条件"。

VSCATTERDPS/VSCATTERDPD/VSCATTERQPS/VSCATTERQPD-散射器包装单精度,打包双精度浮点值带有署名的字词索引

操作码/ Op/E 64/32 CPUID 特性描述指令 n位模式旗支持

EVEX.128.66.0F38.W0 A2 / vsib A V/V(AVX512VL AND) 使用署名的词典索引,分散单词-

VSCATTERDPS vm32x {k1}, xmm1 AVX512F) OR精度 浮点值 使用内存

```text
                                                   AVX10.1        writemask k1.
```

EVEX.256.66.0F38.W0 A2 / vsib A V/V(AVX512VL AND) 使用署名的词典索引,分散单词-

```text
                                                   AVX512F) OR    precision floating-point values to memory using
```

VSCATTERDPS vm32y {k1}, ymm1

```text
                                                   AVX10.1        writemask k1.
```

EVEX.512.66.0F38.W0 A2 / vsib A V/V AVX512F 使用署名的词索引,分散单词 -

```text
                                                   OR AVX10.1     precision floating-point values to memory using
```

VSCATTERDPS vm32z {k1}, zmm1                                      writemask k1.

EVEX.128.66.0F38.W1 A2 / vsib A V/V (AVX512VL AND) 使用署名的词典索引, 散开双倍

VSCATTERDPD vm32x {k1}, xmm1 AVX512F) OR精度 浮点值 使用内存

```text
                                                   AVX10.1        writemask k1.
```

EVEX.256.66.0F38.W1 A2 / vsib A V/V (AVX512VL AND) 使用署名的词典索引, 散开双倍

VSCATTERDPD vm32y {k1}, ymm1 AVX512F) OR精度 浮点值 使用内存

```text
                                                   AVX10.1        writemask k1.
```

EVEX.512.66.0F38.W1 A2 / vsib A V/V AVX512F 使用署名的词索引,双倍散射

```text
                                                   OR AVX10.1     precision floating-point values to memory using
```

VSCATTERDPD vm32z {k1}, zmm1 writemask k1.

EVEX.128.66.0F38.W0 A3 / vsib A V/V(AVX512VL AND) 使用署名qword指数,分散单词-

```text
                                                   AVX512F) OR    precision floating-point values to memory using
```

VSCATTERQPS vm64x {k1}, xmm1                       AVX10.1        writemask k1.

EVEX.256.66.0F38.W0 A3 / vsib A V/V(AVX512VL AND) 使用署名qword指数,分散单词-

VSCATTERQPS vm64y {k1}, xmm1 AVX512F) OR精度 浮点值 使用内存

```text
                                                   AVX10.1        writemask k1.
```

EVEX.512.66.0F38.W0 A3 /vsib A V/V AVX512F 使用签名的qword指数,分散单词 -

```text
                                                   OR AVX10.1     precision floating-point values to memory using
```

VSCATTERQPS vm64z {k1}, ymm1 writemask k1.

EVEX.128.66.0F38.W1 A3 / vsib A V/V (AVX512VL AND) 使用签名的qword指数,撒布双倍

```text
                                                   AVX512F) OR    precision floating-point values to memory using
```

VSCATTERQPD vm64x {k1}, xmm1                       AVX10.1        writemask k1.

EVEX.256.66.0F38.W1 A3 / vsib A V/V (AVX512VL AND) 使用签名的qword指数,撒布双倍

VSCATTERQPD vm64y {k1}, ymm1 AVX512F) OR精度 浮点值 使用内存

```text
                                                   AVX10.1        writemask k1.
```

EVEX.512.66.0F38.W1 A3 /vsib A V/V AVX512F 使用署名的qword指数,分散双倍

```text
                                                   OR AVX10.1     precision floating-point values to memory using
```

VSCATTERQPD vm64z {k1}, zmm1 writemask k1.

## 说明

在双字/夸字矢量xmm1,ymm1,或zmm1中存储最多4,8,或16个单精度元件(或2,4,或8个双精度元件),到基址BASE ADR和索引矢量VINDEX指向的内存位置,其规模为SCALE. 元素通过VSIB指定(即索引寄存器是矢量寄存器,持有打包指数). 元素只有在相应的掩码位为一时才会被存储. 整个口罩寄存器将被本指令设定为零,除非它触发例外.

如果至少有一个元素已经散开(即例外是由除最右侧有其面具比特集的元素以外的元素触发),此指令可以被例外中止. 发生这种情况时,会部分更新目的地注册和面具注册(k1). 如果任何陷阱或中断从已经散开的元素中待决,它们将被交付来代替例外;在这种情况下,EFLAG.RF被设定为一个,因此在继续指令时不会重新触发指令断点.

注意:

* 只向重叠的矢量指数写字,保证互相命令(从LSB到

来源登记册的MSB)。 请注意,这也包括部分重叠的矢量指数。 不重叠的写作可以按任何顺序进行. 内存订购与其他指令遵循Intel-64内存订购模式. 请注意,这并非指向同一实际地址位置的不重叠指数。

* 如果两个或两个以上的目的地指数完全重叠,则"更远"的写入可能被跳过。 * 过失以右向左的方式交付. 也就是说,如果一个错误是由一个元素引发并交付的,所有

离源寄存器xmm,ymm,或zmm的LSB更近的元素将完成(和不故障). 离MSB更近的单个元素可能完成也可能不完成. 如果某一元素触发多个断层,则按常规顺序交付.

* 要件可以按任何顺序分散,但断层必须以右到左顺序交付;因此,要件必须按下列顺序交付:

断层的左边可能在断层交付前散开。 执行这一指令可以重复--鉴于相同的输入值和建筑状态,错误的指令左侧相同的一组元素将被分散。

* 该指示不进行AC检查,因此永远不会造成AC故障。 * 16位有效地址无效 。 将带来#UD的过失. * 如果此指令覆盖了自身, 然后发生错误, 则在

过失交付(如上所述)。 如果断层处理器完成并试图重新执行此指令,则将执行新指令,散点不会完成.

注意VSIB字节的存在在本指令中执行. 因此,如果 ModRM.rm 与 100b 不同, 指令将会有 #UD 错误 。

本指令有特殊的Disp8*N和对齐规则. N被认为是单个矢量元素的大小.

缩放索引可能比处理器使用的地址比特需要更多的比特表示(例如,在32位模式下,如果比特大于一个). 在这种情况下,除了地址位数之外,最重要的位数会被忽略.

如果指定 k0 口罩寄存器, 指令会显示 #UD 错误 。

## 行动

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist
VINDEX stands for the memory operand vector of indices (a ZMM register)
SCALE stands for the memory operand scalar (1, 2, 4 or 8)
DISP is the optional 1 or 4 byte displacement

VSCATTERDPS/VSCATTERDPD/VSCATTERQPS/VSCATTERQPD--Scatter Packed Single Precision, Packed Double Precision Floating-

VSCATTERDPS (EVEX encoded versions)
(KL, VL)= (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR +SignExtend(VINDEX[i+31:i]) * SCALE + DISP] :=
                SRC[i+31:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VSCATTERDPD (EVEX encoded versions)
(KL, VL)= (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR +SignExtend(VINDEX[k+31:k]) * SCALE + DISP] :=
                SRC[i+63:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VSCATTERQPS (EVEX encoded versions)
(KL, VL)= (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    k := j * 64
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR + (VINDEX[k+63:k]) * SCALE + DISP] :=
                SRC[i+31:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VSCATTERQPD (EVEX encoded versions)
(KL, VL)= (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR + (VINDEX[i+63:i]) * SCALE + DISP] :=
                SRC[i+63:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VSCATTERDPS/VSCATTERDPD/VSCATTERQPS/VSCATTERQPD--Scatter Packed Single Precision, Packed Double Precision Floating-
```

## Intel C/C++ 内在编译器

```c
VSCATTERDPD void _mm512_i32scatter_pd(void * base, __m512i vdx, __m512d a, int scale);
VSCATTERDPD void _mm512_mask_i32scatter_pd(void * base, __mmask8 k, __m512i vdx, __m512d a, int scale);
VSCATTERDPS void _mm512_i32scatter_ps(void * base, __m512i vdx, __m512 a, int scale);
VSCATTERDPS void _mm512_mask_i32scatter_ps(void * base, __mmask16 k, __m512i vdx, __m512 a, int scale);
VSCATTERQPD void _mm512_i64scatter_pd(void * base, __m512i vdx, __m512d a, int scale);
VSCATTERQPD void _mm512_mask_i64scatter_pd(void * base, __mmask8 k, __m512i vdx, __m512d a, int scale);
VSCATTERQPS void _mm512_i64scatter_ps(void * base, __m512i vdx, __m512 a, int scale);
VSCATTERQPS void _mm512_mask_i64scatter_ps(void * base, __mmask8 k, __m512i vdx, __m512 a, int scale);
VSCATTERDPD void _mm256_i32scatter_pd(void * base, __m256i vdx, __m256d a, int scale);
VSCATTERDPD void _mm256_mask_i32scatter_pd(void * base, __mmask8 k, __m256i vdx, __m256d a, int scale);
VSCATTERDPS void _mm256_i32scatter_ps(void * base, __m256i vdx, __m256 a, int scale);
VSCATTERDPS void _mm256_mask_i32scatter_ps(void * base, __mmask8 k, __m256i vdx, __m256 a, int scale);
VSCATTERQPD void _mm256_i64scatter_pd(void * base, __m256i vdx, __m256d a, int scale);
VSCATTERQPD void _mm256_mask_i64scatter_pd(void * base, __mmask8 k, __m256i vdx, __m256d a, int scale);
VSCATTERQPS void _mm256_i64scatter_ps(void * base, __m256i vdx, __m256 a, int scale);
VSCATTERQPS void _mm256_mask_i64scatter_ps(void * base, __mmask8 k, __m256i vdx, __m256 a, int scale);
VSCATTERDPD void _mm_i32scatter_pd(void * base, __m128i vdx, __m128d a, int scale);
VSCATTERDPD void _mm_mask_i32scatter_pd(void * base, __mmask8 k, __m128i vdx, __m128d a, int scale);
VSCATTERDPS void _mm_i32scatter_ps(void * base, __m128i vdx, __m128 a, int scale);
VSCATTERDPS void _mm_mask_i32scatter_ps(void * base, __mmask8 k, __m128i vdx, __m128 a, int scale);
VSCATTERQPD void _mm_i64scatter_pd(void * base, __m128i vdx, __m128d a, int scale);
VSCATTERQPD void _mm_mask_i64scatter_pd(void * base, __mmask8 k, __m128i vdx, __m128d a, int scale);
VSCATTERQPS void _mm_i64scatter_ps(void * base, __m128i vdx, __m128 a, int scale);
VSCATTERQPS void _mm_mask_i64scatter_ps(void * base, __mmask8 k, __m128i vdx, __m128 a, int scale);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-63"Type E12类例外条件".

VSCATTERDPS/VSCATTERDPD/VSCATTERQPS/VSCATTERQPD-散射器 包装单精度,包装双精度浮射-
