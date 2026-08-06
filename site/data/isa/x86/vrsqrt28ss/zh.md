---
summary: 标量 单精度浮动的对等方根
---

## 说明

计算第二源操作数(第三个操作数)中低浮点32值的对等方根,并将结果存储到目标操作数(第一个操作数). 在最后四舍五入前,对近似对等方根进行最大相对误差小于2^-28的评价。 最终结果在按照写掩码 k1写到目的地低浮32元素之前,四舍五入为< 2^-23相对错误. 目的地的比特127:32从第一源操作数(第二个操作数)的相应比特复制.

如果任何源元素是NaN,则返回该元素的静态NaN源值。 负(非零)源号,以及 -,返回犬形NaN并设置无效旗帜(#I).

值为 -0 必须返回 - 并设置 DivByZero 旗 (# Z) 。 负数应返回NaN并设置无效的旗帜(# I). 但请注意, 指令将输入异常冲到相同标志的零, 因此负异常返回 - 并设置 DivByZero 旗 。

第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或32位的内存位置. 目标操作数是一个XMM登记册.

在https://software.intel.com/en-us/articles/for-IA-近似-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2上可以找到VRSQRT28xx的数值精确执行.

## 行动

```text
VRSQRT28SS (EVEX Encoded Versions)

IF k1[0] OR *no writemask* THEN

             DEST[31: 0] := (1.0/ SQRT(SRC[31: 0]));

ELSE

     IF *merging-masking*           ; merging-masking

           THEN *DEST[31: 0] remains unchanged*

           ELSE                     ; zeroing-masking

             DEST[31: 0] := 0

     FI;

FI;

ENDFOR;

DEST[127:32] := SRC1[127: 32]

DEST[MAXVL-1:128] := 0



                             Table 8-10. VRSQRT28SS Special Cases

Input Value                  Result Value              Comments
NAN
X = 2-2n                     QNAN(input)               If (SRC = SNaN) then #I
X<0
X = -0 or negative denormal  2n
X = +0 or positive denormal
X = +INF                     QNaN_Indefinite           Including -INF

                             -INF                      #Z

                             +INF                      #Z

                             +0
```

## Intel C/C++ 内在编译器

```c
VRSQRT28SS __m128 _mm_rsqrt28_round_ss(__m128 a, __m128 b, int rounding);
VRSQRT28SS __m128 _mm_mask_rsqrt28_round_ss(__m128 s, __mmask8 m,__m128 a,__m128 b, int rounding);
VRSQRT28SS __m128 _mm_maskz_rsqrt28_round_ss(__mmask8 m,__m128 a,__m128 b, int rounding);
```

## SIMD 浮点 例外

无效( 如果 SNaN 输入), 乘以零 。

## 其他例外

见表2-49"E3类例外条件"。

VSCATTERPF0DPS/VSCATTERPF0QPS/VSCATTERPF0DPD/VSCATTERPF0QPD-Sparse Prefetch SP/DP 数据值有签名的Dword,有签名的用 T0 提示写字的字词索引

操作码/ Op64/32 CPUID 描述指令 En bit 模式特性支持旗

EVEX.512.66.0F38.W0 C6/5 /vsib A V/V AVX512PF 使用署名的字词索引,预选稀疏字节

VSCATTERPF0DPS vm32z {k1} 包含单精度数据的内存位置,使用写掩码 k1和T0提示,意图写入.

EVEX.512.66.0F38.W0 C7/5 /vsib A V/V AVX512PF 使用署名的qword指数,预选含有单精度数据的稀疏字节内存位置使用VSCATTERPF0QPS vm64z {k1}写掩码 k1和T0提示,意图写作.

EVEX.512.66.0F38.W1 C6/5 /vsib A V/V AVX512PF 使用署名的dword指数,预缩写含有双精度数据的稀疏字节内存位置 VSCATTERPF0DPD vm32y {k1}使用写掩码 k1和T0提示,意图写作.

EVEX.512.66.0F38.W1 C7/5 /vsib A V/V AVX512PF 使用签名的qword指数,预缩写稀疏字节

VSCATTERPF0QPD vm64z {k1} 包含双精度数据的内存位置 使用 写掩码 k1 和 T0 提示,意图写入.

## 说明

该指令有条件地预选了16个32位或8个64位整数字节的数据元素. 元素通过 VSIB 指定(即索引寄存器为zmm,持有已打包的索引). 元素只有在相应的遮罩位是一时才会被预选.

缓存行将被带入一个位置提示( T0) 指定的专属状态( RFO) :

* T0(时间数据)-预留数据进入第一级缓存.

[PS数据]对于dword指数来说,该指令会预示16个内存位置. 对于qword指数,该指示会预示8个值.

[PD数据]对于dword和qword指数,该指示会预示八个内存位置.

注意:

(1)预产期可能按任何顺序发生(或根本不发生). 指令是一种暗示。

(2) 口罩保持不变。

(3)16位有效地址无效. 将带来#UD的过失.

(4)本规范不得产生FP或内存断层.

(5) Prefetches 不分割 句柄 缓存行

(6)如果内存操作数的编码没有SIB字节,则表示#UD.

## 行动

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist.
VINDEX stands for the memory operand vector of indices (a vector register).
SCALE stands for the memory operand scalar (1, 2, 4 or 8).
DISP is the optional 1, 2 or 4 byte displacement.
PREFETCH(mem, Level, State) Prefetches a byte memory location pointed by `mem' into the cache level specified by `Level'; a request
for exclusive/ownership is done if `State' is 1. Note that the memory location ignore cache line splits. This operation is considered a
hint for the processor and may be skipped depending on implementation.

VSCATTERPF0DPS/VSCATTERPF0QPS/VSCATTERPF0DPD/VSCATTERPF0QPD--Sparse Prefetch Packed SP/DP Data Values with


VSCATTERPF0DPS (EVEX Encoded Version)
(KL, VL) = (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+31:i]) * SCALE + DISP], Level=0, RFO = 1)
    FI;
ENDFOR

VSCATTERPF0DPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+31:k]) * SCALE + DISP], Level=0, RFO = 1)
    FI;
ENDFOR

VSCATTERPF0QPS (EVEX Encoded Version)
(KL, VL) = (8, 256)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+63:i]) * SCALE + DISP], Level=0, RFO = 1)
    FI;
ENDFOR

VSCATTERPF0QPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+63:k]) * SCALE + DISP], Level=0, RFO = 1)
    FI;
ENDFOR
```

## Intel C/C++ 内在编译器

```c
VSCATTERPF0DPD void _mm512_prefetch_i32scatter_pd(void *base, __m256i vdx, int scale, int hint);
VSCATTERPF0DPD void _mm512_mask_prefetch_i32scatter_pd(void *base, __mmask8 m, __m256i vdx, int scale, int hint);
VSCATTERPF0DPS void _mm512_prefetch_i32scatter_ps(void *base, __m512i vdx, int scale, int hint);
VSCATTERPF0DPS void _mm512_mask_prefetch_i32scatter_ps(void *base, __mmask16 m, __m512i vdx, int scale, int hint);
VSCATTERPF0QPD void _mm512_prefetch_i64scatter_pd(void * base, __m512i vdx, int scale, int hint);
VSCATTERPF0QPD void _mm512_mask_prefetch_i64scatter_pd(void * base, __mmask8 m, __m512i vdx, int scale, int hint);
VSCATTERPF0QPS void _mm512_prefetch_i64scatter_ps(void * base, __m512i vdx, int scale, int hint);
VSCATTERPF0QPS void _mm512_mask_prefetch_i64scatter_ps(void * base, __mmask8 m, __m512i vdx, int scale, int hint);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-64"Type E12NP类例外条件".

VSCATTERPF0DPS/VSCATTERPF0QPS/VSCATTERPF0DPD/VSCATTERPF0QPD-Sparse Prefetch SP/DP 数据值带有

VSCATTERPF1DPS/VSCATTERPF1QPS/VSCATTERPF1DPD/VSCATTERPF1QPD-Sparse Prefetch SP/DP 数据值有署名词,署名词索引使用 T1 提示意图写入

操作码/ Op64/32 CPUID 描述指令 En bit 模式特性支持旗

EVEX.512.66.0F38.W0 C6/6 /vsib A V/V AVX512PF 使用签名的字词索引,预缩写稀疏字节内存

VSCATTERPF1DPS vm32z {k1} 使用 写掩码 k1 和 T1 提示含有单精度数据的位置,意图写入.

EVEX.512.66.0F38.W0 C7/6 /vsib A V/V AVX512PF 使用署名的qword指数,预选含有单精度数据的稀疏字节内存位置使用写掩码 VSCATTERPF1QPS vm64z {k1}k1和T1提示,意图写入.

EVEX.512.66.0F38.W1 C6/6 /vsib A V/V AVX512PF 使用署名的dword指数,预挑含有双精度数据的稀疏字节内存位置使用VSCATTERPF1DPD vm32y {k1}写掩码 k1和T1提示,意图写入.

EVEX.512.66.0F38.W1 C7/6 /vsib A V/V AVX512PF 使用签名的qword指数,预缩写稀疏字节内存

VSCATTERPF1QPD vm64z {k1} 含有双精度数据的位置 使用 写掩码 k1 和 T1 提示,意图写入.

## 说明

该指令有条件地预选了16个32位或8个64位整数字节的数据元素. 元素通过 VSIB 指定(即索引寄存器为zmm,持有已打包的索引). 元素只有在相应的遮罩位是一时才会被预选.

缓存行将被带入一个位置提示(T1)指定的专属状态(RFO):

* T1(时间数据)-预留数据进入第二关缓存.

[PS数据]对于dword指数来说,该指令会预示16个内存位置. 对于qword指数,该指示会预示8个值.

[PD数据]对于dword和qword指数,该指示会预示八个内存位置.

注意:

(1)预产期可能按任何顺序发生(或根本不发生). 指令是一种暗示。

(2) 口罩保持不变。

(3)16位有效地址无效. 将带来#UD的过失.

(4)本规范不得产生FP或内存断层.

(5) Prefetches 不分割 句柄 缓存行

(6)如果内存操作数的编码没有SIB字节,则表示#UD.

## 行动

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist.
VINDEX stands for the memory operand vector of indices (a vector register).
SCALE stands for the memory operand scalar (1, 2, 4 or 8).
DISP is the optional 1, 2 or 4 byte displacement.
PREFETCH(mem, Level, State) Prefetches a byte memory location pointed by `mem' into the cache level specified by `Level'; a request
for exclusive/ownership is done if `State' is 1. Note that the memory location ignore cache line splits. This operation is considered a
hint for the processor and may be skipped depending on implementation.

VSCATTERPF1DPS/VSCATTERPF1QPS/VSCATTERPF1DPD/VSCATTERPF1QPD--Sparse Prefetch Packed SP/DP Data Values With


VSCATTERPF1DPS (EVEX Encoded Version)
(KL, VL) = (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+31:i]) * SCALE + DISP], Level=1, RFO = 1)
    FI;
ENDFOR

VSCATTERPF1DPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+31:k]) * SCALE + DISP], Level=1, RFO = 1)
    FI;
ENDFOR

VSCATTERPF1QPS (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+63:i]) * SCALE + DISP], Level=1, RFO = 1)
    FI;
ENDFOR

VSCATTERPF1QPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+63:k]) * SCALE + DISP], Level=1, RFO = 1)
    FI;
ENDFOR
```

## Intel C/C++ 内在编译器

```c
VSCATTERPF1DPD void _mm512_prefetch_i32scatter_pd(void *base, __m256i vdx, int scale, int hint);
VSCATTERPF1DPD void _mm512_mask_prefetch_i32scatter_pd(void *base, __mmask8 m, __m256i vdx, int scale, int hint);
VSCATTERPF1DPS void _mm512_prefetch_i32scatter_ps(void *base, __m512i vdx, int scale, int hint);
VSCATTERPF1DPS void _mm512_mask_prefetch_i32scatter_ps(void *base, __mmask16 m, __m512i vdx, int scale, int hint);
VSCATTERPF1QPD void _mm512_prefetch_i64scatter_pd(void * base, __m512i vdx, int scale, int hint);
VSCATTERPF1QPD void _mm512_mask_prefetch_i64scatter_pd(void * base, __mmask8 m, __m512i vdx, int scale, int hint);
VSCATTERPF1QPS void _mm512_prefetch_i64scatter_ps(void *base, __m512i vdx, int scale, int hint);
VSCATTERPF1QPS void _mm512_mask_prefetch_i64scatter_ps(void *base, __mmask8 m, __m512i vdx, int scale, int hint);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-64"Type E12NP类例外条件".

VSCATTERPF1DPS/VSCATTERPF1QPS/VSCATTERPF1DPD/VSCATTERPF1QPD-Sparse Prefetch SP/DP 数据值使用
