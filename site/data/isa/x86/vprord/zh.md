---
summary: 右侧位旋转
---

## 说明

将 第一源操作数 中单个数据元素中的位数(双字,或四字)向右旋转,以计数 操作数 中指定的位数表示。 如果伯爵操作数指定的值大于31(对于双字),或63(对于四字),则使用伯爵操作数 modulo的数据大小(32或64).

EVEX.128 编码版本 : 目标操作数是一个XMM登记册. 源操作数是一个XMM的登记册或内存位置(用于即时形式). 操作数的计数可以来自XMM的寄存器,也可以来自内存位置或8位即时. 对应的ZMM注册被清零的位数(MAXVL-1:128).

EVEX.256 编码版本 : 目标操作数是一个YMM登记册. 源操作数是一个YMM的登记册或内存位置(用于即时形式). 操作数的计数可以来自XMM的寄存器,也可以来自内存位置或8位即时. 对应的ZMM注册被清零的位数(MAXVL-1:256).

EVEX.512 编码版本 : 目标操作数是一个按照写掩码更新的ZMM登记册. 对于即时状态的操作数计数,源操作数可以是ZMM计数器,512位内存位置或512位矢量从32/64位内存位置广播,操作数计数器是8位即时状态. 对于可变形态的操作数计数,第一源操作数(第二个操作数)是一个ZMM计数器,而计数器操作数(第三个操作数)是一个ZMM计数器,512位内存位置或512位向量从32/64位内存位置广播.

## 行动

```text
RIGHT_ROTATE_DWORDS(SRC, COUNT_SRC)
COUNT := COUNT_SRC modulo 32;
DEST[31:0] := (SRC >> COUNT) | (SRC << (32 - COUNT));

RIGHT_ROTATE_QWORDS(SRC, COUNT_SRC)
COUNT := COUNT_SRC modulo 64;
DEST[63:0] := (SRC >> COUNT) | (SRC << (64 - COUNT));

VPRORD (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC1 *is memory*)

                  THEN DEST[i+31:i] := RIGHT_ROTATE_DWORDS( SRC1[31:0], imm8)

                  ELSE DEST[i+31:i] := RIGHT_ROTATE_DWORDS(SRC1[i+31:i], imm8)

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*               ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPRORVD (EVEX encoded versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask* THEN

                IF (EVEX.b = 1) AND (SRC2 *is memory*)
                      THEN DEST[i+31:i] := RIGHT_ROTATE_DWORDS(SRC1[i+31:i], SRC2[31:0])
                      ELSE DEST[i+31:i] := RIGHT_ROTATE_DWORDS(SRC1[i+31:i], SRC2[i+31:i])

                FI;


     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPRORQ (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC1 *is memory*)

                  THEN DEST[i+63:i] := RIGHT_ROTATE_QWORDS(SRC1[63:0], imm8)

                  ELSE DEST[i+63:i] := RIGHT_ROTATE_QWORDS(SRC1[i+63:i], imm8])

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPRORVQ (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := RIGHT_ROTATE_QWORDS(SRC1[i+63:i], SRC2[63:0])

                  ELSE DEST[i+63:i] := RIGHT_ROTATE_QWORDS(SRC1[i+63:i], SRC2[i+63:i])

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPRORD __m512i _mm512_ror_epi32(__m512i a, int imm);
VPRORD __m512i _mm512_mask_ror_epi32(__m512i a, __mmask16 k, __m512i b, int imm);
VPRORD __m512i _mm512_maskz_ror_epi32( __mmask16 k, __m512i a, int imm);
VPRORD __m256i _mm256_ror_epi32(__m256i a, int imm);
VPRORD __m256i _mm256_mask_ror_epi32(__m256i a, __mmask8 k, __m256i b, int imm);
VPRORD __m256i _mm256_maskz_ror_epi32( __mmask8 k, __m256i a, int imm);
VPRORD __m128i _mm_ror_epi32(__m128i a, int imm);
VPRORD __m128i _mm_mask_ror_epi32(__m128i a, __mmask8 k, __m128i b, int imm);
VPRORD __m128i _mm_maskz_ror_epi32( __mmask8 k, __m128i a, int imm);
VPRORQ __m512i _mm512_ror_epi64(__m512i a, int imm);
VPRORQ __m512i _mm512_mask_ror_epi64(__m512i a, __mmask8 k, __m512i b, int imm);
VPRORQ __m512i _mm512_maskz_ror_epi64(__mmask8 k, __m512i a, int imm);
VPRORQ __m256i _mm256_ror_epi64(__m256i a, int imm);
VPRORQ __m256i _mm256_mask_ror_epi64(__m256i a, __mmask8 k, __m256i b, int imm);
VPRORQ __m256i _mm256_maskz_ror_epi64( __mmask8 k, __m256i a, int imm);
VPRORQ __m128i _mm_ror_epi64(__m128i a, int imm);
VPRORQ __m128i _mm_mask_ror_epi64(__m128i a, __mmask8 k, __m128i b, int imm);
VPRORQ __m128i _mm_maskz_ror_epi64( __mmask8 k, __m128i a, int imm);
VPRORVD __m512i _mm512_rorv_epi32(__m512i a, __m512i cnt);
VPRORVD __m512i _mm512_mask_rorv_epi32(__m512i a, __mmask16 k, __m512i b, __m512i cnt);
VPRORVD __m512i _mm512_maskz_rorv_epi32(__mmask16 k, __m512i a, __m512i cnt);
VPRORVD __m256i _mm256_rorv_epi32(__m256i a, __m256i cnt);
VPRORVD __m256i _mm256_mask_rorv_epi32(__m256i a, __mmask8 k, __m256i b, __m256i cnt);
VPRORVD __m256i _mm256_maskz_rorv_epi32(__mmask8 k, __m256i a, __m256i cnt);
VPRORVD __m128i _mm_rorv_epi32(__m128i a, __m128i cnt);
VPRORVD __m128i _mm_mask_rorv_epi32(__m128i a, __mmask8 k, __m128i b, __m128i cnt);
VPRORVD __m128i _mm_maskz_rorv_epi32(__mmask8 k, __m128i a, __m128i cnt);
VPRORVQ __m512i _mm512_rorv_epi64(__m512i a, __m512i cnt);
VPRORVQ __m512i _mm512_mask_rorv_epi64(__m512i a, __mmask8 k, __m512i b, __m512i cnt);
VPRORVQ __m512i _mm512_maskz_rorv_epi64( __mmask8 k, __m512i a, __m512i cnt);
VPRORVQ __m256i _mm256_rorv_epi64(__m256i a, __m256i cnt);
VPRORVQ __m256i _mm256_mask_rorv_epi64(__m256i a, __mmask8 k, __m256i b, __m256i cnt);
VPRORVQ __m256i _mm256_maskz_rorv_epi64(__mmask8 k, __m256i a, __m256i cnt);
VPRORVQ __m128i _mm_rorv_epi64(__m128i a, __m128i cnt);
VPRORVQ __m128i _mm_mask_rorv_epi64(__m128i a, __mmask8 k, __m128i b, __m128i cnt);
VPRORVQ __m128i _mm_maskz_rorv_epi64(__mmask8 k, __m128i a, __m128i cnt);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-51,"Type E4类例外条件".

VPSCATTERDD/VPSCATTERDQ/VPSCATTERQD/VPSCATTERQQ-Sclockter 包装的字,包装的字,带有签名的字,签名的字索引

操作码/ Op 64/32 CPUID 特性描述指令 En bit 模式旗

Support

EVEX.128.66.0F38.W0 A0/vsib A V/V(AVX512VL AND) 使用署名的dword指数,用写掩码 k1散开dword值作为内存. VPSCATTERDD vm32x {k1}, xmm1 AVX512F) OR AVX10.1 (英语).

EVEX.256.66.0F38.W0 A0 / vsib A V/V (AVX512VL AND) 使用署名的词词索引,散开词值

```text
                                                      AVX512F) OR    to memory using writemask k1.
```

VPSCATTERDD vm32y {k1}, ymm1 AVX10.1

EVEX.512.66.0F38.W0 A0 / vsib A V/V AVX512F 使用署名词索引,散开词值

```text
                                                      OR AVX10.1     to memory using writemask k1.
```

VPSCATTERDD vm32z {k1}, zmm1

EVEX.128.66.0F38.W1 A0 / vsib A V/V (AVX512VL AND) 使用署名的词典索引,散开qword值

```text
                                                      AVX512F) OR    to memory using writemask k1.
```

VPSCATTERDQ vm32x {k1}, xmm1 AVX10.1

EVEX.256.66.0F38.W1 A0 / vsib A V/V (AVX512VL AND) 使用署名的词典索引,散开qword值

```text
                                                      AVX512F) OR    to memory using writemask k1.
```

VPSCATTERDQ vm32x {k1}, ymm1 AVX10.1

EVEX.512.66.0F38.W1 A0 / vsib A V/V AVX512F 使用署名的词索引,散开qword值

```text
                                                      OR AVX10.1     to memory using writemask k1.
```

VPSCATTERDQ vm32y {k1}, zmm1

EVEX.128.66.0F38.W0 A1/vsib A V/V(AVX512VL AND) 使用签名的qword指数,散开的dword值

```text
                                                      AVX512F) OR    to memory using writemask k1.
```

VPSCATTERQD vm64x {k1}, xmm1 AVX10.1

EVEX.256.66.0F38.W0 A1/vsib A V/V(AVX512VL AND) 使用签名的qword指数,散开的dword值

```text
                                                      AVX512F) OR    to memory using writemask k1.
```

VPSCATTERQD vm64y {k1}, xmm1                          AVX10.1

EVEX.512.66.0F38.W0 A1 /vsib A V/V AVX512F 使用签名的qword指数,散开词值

```text
                                                      OR AVX10.1     to memory using writemask k1.
```

VPSCATTERQD vm64z {k1}, ymm1

EVEX.128.66.0F38.W1 A1/vsib A V/V(AVX512VL AND) 使用签名的qword指数,散射qword值

```text
                                                      AVX512F) OR    to memory using writemask k1.
```

VPSCATTERQQ vm64x {k1}, xmm1                          AVX10.1

EVEX.256.66.0F38.W1 A1/vsib A V/V(AVX512VL AND) 使用署名qword指数,用写掩码 k1散开qword值作为内存. VPSCATTERQQ vm64y {k1}, ymm1 AVX512F) OR AVX10.1 (英语).

EVEX.512.66.0F38.W1 A1 /vsib A V/V AVX512F 使用签名的qword指数,散射qword值

```text
                                                      OR AVX10.1     to memory using writemask k1.
```

VPSCATTERQQ vm64z {k1}, zmm1

## 说明

在双字向量中存储最多16个元素(qword指数中的8个元素),或者在四字向量中存储8个元素到基址BASE APDR和索引向量VINDEX指向的内存位置,其规模为SCALE. 元素通过VSIB指定(即索引寄存器是矢量寄存器,持有打包指数). 元素只有在相应的掩码位为一时才会被存储. 整个口罩寄存器将被本指令设定为零,除非它触发例外.

VPSCATTERDD/VPSCATTERDQ/VPSCATTERQD/VPSCATTERQQ-Sclocter 包装的字,包装的字,带有签名的字,签名

如果至少有一个元素已经散开(即例外是由除最右侧有其面具比特集的元素以外的元素触发),此指令可以被例外中止. 发生这种情况时,目的地登记册和面具登记册部分更新. 如果任何陷阱或中断从已经散开的元素中待决,它们将被交付来代替例外;在这种情况下,EFLAG.RF被设定为一个,因此在继续指令时不会重新触发指令断点.

注意:

* 只向重叠的矢量指数写字,保证互相命令(从LSB到

来源登记册的MSB)。 请注意,这也包括部分重叠的矢量指数。 不重叠的写作可以按任何顺序进行. 内存订购与其他指令遵循Intel-64内存订购模式. 请注意,这并非指向同一实际地址位置的不重叠指数。

* 如果两个或两个以上的目的地指数完全重叠,则"更远"的写入可能被跳过。 * 过失以右向左的方式交付. 也就是说,如果一个错误是由一个元素引发并交付的,所有

离目的地ZMM更接近LSB的元素将完成(和无故障). 离MSB更近的单个元素可能完成也可能不完成. 如果某一元素触发多个断层,则按常规顺序交付.

* 要件可以按任何顺序分散,但断层必须以右到左顺序交付;因此,要件必须按下列顺序交付:

在交付过失之前,可以收集过失的左边。 执行该指令可以重复--鉴于相同的输入值和建筑状态,将收集错误的指令左边相同的一组元素。

* 该指示不进行AC检查,因此永远不会造成AC故障。 * 16位有效地址无效 。 将带来#UD的过失. * 如果此指令覆盖了自身, 然后发生错误, 则在

过失交付(如上所述)。 如果断层处理器完成并试图重新执行此指令,则将执行新指令,散点不会完成.

注意VSIB字节的存在在本指令中执行. 因此,如果 ModRM.rm 与 100b 不同, 指令将会有 #UD 错误 。

本指令有特殊的Disp8*N和对齐规则. N被认为是单个矢量元素的大小.

缩放索引可能比处理器使用的地址比特需要更多的比特表示(例如,在32位模式下,如果比特大于一个). 在这种情况下,除了地址位数之外,最重要的位数会被忽略.

如果指定 k0 口罩寄存器, 指令会显示 #UD 错误 。

如果 EVEX.Z = 1. 指令将 #UD 错误 。

## 行动

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist
VINDEX stands for the memory operand vector of indices (a ZMM register)
SCALE stands for the memory operand scalar (1, 2, 4 or 8)
DISP is the optional 1 or 4 byte displacement

VPSCATTERDD (EVEX encoded versions)
(KL, VL)= (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR +SignExtend(VINDEX[i+31:i]) * SCALE + DISP] := SRC[i+31:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VPSCATTERDD/VPSCATTERDQ/VPSCATTERQD/VPSCATTERQQ--Scatter Packed Dword, Packed Qword with Signed Dword, Signed

VPSCATTERDQ (EVEX encoded versions)
(KL, VL)= (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR +SignExtend(VINDEX[k+31:k]) * SCALE + DISP] := SRC[i+63:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VPSCATTERQD (EVEX encoded versions)
(KL, VL)= (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 32
    k := j * 64
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR + (VINDEX[k+63:k]) * SCALE + DISP] := SRC[i+31:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VPSCATTERQQ (EVEX encoded versions)
(KL, VL)= (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR + (VINDEX[j+63:j]) * SCALE + DISP] := SRC[i+63:i]
    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0
```

## Intel C/C++ 内在编译器

```c
VPSCATTERDD void _mm512_i32scatter_epi32(void * base, __m512i vdx, __m512i a, int scale);
VPSCATTERDD void _mm256_i32scatter_epi32(void * base, __m256i vdx, __m256i a, int scale);
VPSCATTERDD void _mm_i32scatter_epi32(void * base, __m128i vdx, __m128i a, int scale);
VPSCATTERDD void _mm512_mask_i32scatter_epi32(void * base, __mmask16 k, __m512i vdx, __m512i a, int scale);
VPSCATTERDD void _mm256_mask_i32scatter_epi32(void * base, __mmask8 k, __m256i vdx, __m256i a, int scale);
VPSCATTERDD void _mm_mask_i32scatter_epi32(void * base, __mmask8 k, __m128i vdx, __m128i a, int scale);
VPSCATTERDQ void _mm512_i32scatter_epi64(void * base, __m256i vdx, __m512i a, int scale);
VPSCATTERDQ void _mm256_i32scatter_epi64(void * base, __m128i vdx, __m256i a, int scale);
VPSCATTERDQ void _mm_i32scatter_epi64(void * base, __m128i vdx, __m128i a, int scale);
VPSCATTERDQ void _mm512_mask_i32scatter_epi64(void * base, __mmask8 k, __m256i vdx, __m512i a, int scale);
VPSCATTERDQ void _mm256_mask_i32scatter_epi64(void * base, __mmask8 k, __m128i vdx, __m256i a, int scale);
VPSCATTERDQ void _mm_mask_i32scatter_epi64(void * base, __mmask8 k, __m128i vdx, __m128i a, int scale);
VPSCATTERQD void _mm512_i64scatter_epi32(void * base, __m512i vdx, __m256i a, int scale);
VPSCATTERQD void _mm256_i64scatter_epi32(void * base, __m256i vdx, __m128i a, int scale);
VPSCATTERQD void _mm_i64scatter_epi32(void * base, __m128i vdx, __m128i a, int scale);
VPSCATTERQD void _mm512_mask_i64scatter_epi32(void * base, __mmask8 k, __m512i vdx, __m256i a, int scale);
VPSCATTERQD void _mm256_mask_i64scatter_epi32(void * base, __mmask8 k, __m256i vdx, __m128i a, int scale);
VPSCATTERQD void _mm_mask_i64scatter_epi32(void * base, __mmask8 k, __m128i vdx, __m128i a, int scale);
VPSCATTERDD/VPSCATTERDQ/VPSCATTERQD/VPSCATTERQQ--Scatter Packed Dword, Packed Qword with Signed Dword, Signed VPSCATTERQQ void _mm512_i64scatter_epi64(void * base, __m512i vdx, __m512i a, int scale);
VPSCATTERQQ void _mm256_i64scatter_epi64(void * base, __m256i vdx, __m256i a, int scale);
VPSCATTERQQ void _mm_i64scatter_epi64(void * base, __m128i vdx, __m128i a, int scale);
VPSCATTERQQ void _mm512_mask_i64scatter_epi64(void * base, __mmask8 k, __m512i vdx, __m512i a, int scale);
VPSCATTERQQ void _mm256_mask_i64scatter_epi64(void * base, __mmask8 k, __m256i vdx, __m256i a, int scale);
VPSCATTERQQ void _mm_mask_i64scatter_epi64(void * base, __mmask8 k, __m128i vdx, __m128i a, int scale);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-63"Type E12类例外条件".

VPSCATTERDD/VPSCATTERDQ/VPSCATTERQD/VPSCATTERQQ-Sclocter 包装的字,包装的字,带有签名的字,签名
