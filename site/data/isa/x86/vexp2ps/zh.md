---
summary: 近似包装 单精度浮点 的标志 2^x
---

## 说明

计算源操作数(第二个操作数)中单精度浮点值的大约基数-2指数评价,并利用写掩码 k1将结果存储在目标操作数(第一个操作数)中. 估计基数-2指数的相对误差小于2^-23。

异常输入值作为零处理,不信号#DE,而不论MXCSR.DAZ. 异常结果被冲成零,不信号#UE,不管MXCSR.FTZ.

源操作数是一个ZMM寄存器,512位内存位置,或512位矢量从32位内存位置广播. 目标操作数是一个ZMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

VEXP2xx在数字上的具体实施可参见https://software.intel.com/en-us/articles/reference-improductions- for-IA-近似-instructions-vrcp14-vrcp28-vrsqrt28-vexp2.

## 行动

```text
VEXP2PS

(KL, VL) = (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+31:i] := EXP2_23_SP(SRC[31:0])

                  ELSE DEST[i+31:i] := EXP2_23_SP(SRC[i+31:i])

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[i+31:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+31:i] := 0

     FI;

FI;

ENDFOR;



Source Input                   Table 8-2. Special Values Behavior  Comments
NaN               Result                                           If (SRC = SNaN) then #I
+                 QNaN(src)
+/-0              +                                                Exact result
-                 1.0f
Integral value N  +0.0f                                            Exact result
                  2^ (N)
```

## Intel C/C++ 内在编译器

```c
VEXP2PS __m512 _mm512_exp2a23_round_ps (__m512 a, int sae);
VEXP2PS __m512 _mm512_mask_exp2a23_round_ps (__m512 a, __mmask16 m, __m512 b, int sae);
VEXP2PS __m512 _mm512_maskz_exp2a23_round_ps (__mmask16 m, __m512 b, int sae);
```

## SIMD 浮点 例外

无效( 如果 SNaN 输入) , 重叠 。

## 其他例外

见表2-48"E2类例外条件"。

VGATHERPF0DPS/VGATHERPF0QPS/VGATHERPF0DPD/VGATHERPF0QPD-Sparse Prefetch SP/DP 数据值 带有署名词,署名词索引使用 T0 提示

操作码/ Op64/32 CPUID 描述指令 En bit 模式特性支持旗

EVEX.512.66.0F38.W0 C6/1 /vsib A V/V AVX512PF 使用署名的词典索引,预选稀疏字节VGATHERPF0DPS vm32z {k1}包含单精度数据的内存位置

使用 opmask k1 和 T0 提示。

EVEX.512.66.0F38.W0 C7/1 /vsib A V/V AVX512PF 使用署名的qword指数,预投的稀疏字节VGATHERPF0QPS vm64z {k1}内存位置,包含使用opmask k1和T0提示的单精度数据.

EVEX.512.66.0F38.W1 C6/1 /vsib A V/V AVX512PF 使用署名的词典索引,预示稀疏字节VGATHERPF0DPD vm32y {k1}内存位置,包含使用opmask k1和T0提示的双精度数据.

EVEX.512.66.0F38.W1 C7/1 /vsib A V/V AVX512PF 使用署名的qword指数,预选稀疏字节VGATHERPF0QPD vm64z {k1}包含双精度数据的内存位置

使用 opmask k1 和 T0 提示。

## 说明

该指令有条件地预选了16个32位或8个64位整数字节的数据元素. 元素通过 VSIB 指定(即索引寄存器为zmm,持有已打包的索引). 元素只有在相应的遮罩位是一时才会被预选.

预选的行被装入到以位置提示( T0) 指定的缓存结构中的位置 :

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

VGATHERPF0DPS/VGATHERPF0QPS/VGATHERPF0DPD/VGATHERPF0QPD--Sparse Prefetch Packed SP/DP Data Values With Signed


VGATHERPF0DPS (EVEX Encoded Version)
(KL, VL) = (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+31:i]) * SCALE + DISP], Level=0, RFO = 0)
    FI;
ENDFOR

VGATHERPF0DPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+31:k]) * SCALE + DISP], Level=0, RFO = 0)
    FI;
ENDFOR

VGATHERPF0QPS (EVEX Encoded Version)
(KL, VL) = (8, 256)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+63:i]) * SCALE + DISP], Level=0, RFO = 0)
    FI;
ENDFOR

VGATHERPF0QPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+63:k]) * SCALE + DISP], Level=0, RFO = 0)
    FI;
ENDFOR
```

## Intel C/C++ 内在编译器

```c
VGATHERPF0DPD void _mm512_mask_prefetch_i32gather_pd(__m256i vdx, __mmask8 m, void * base, int scale, int hint);
VGATHERPF0DPS void _mm512_mask_prefetch_i32gather_ps(__m512i vdx, __mmask16 m, void * base, int scale, int hint);
VGATHERPF0QPD void _mm512_mask_prefetch_i64gather_pd(__m512i vdx, __mmask8 m, void * base, int scale, int hint);
VGATHERPF0QPS void _mm512_mask_prefetch_i64gather_ps(__m512i vdx, __mmask8 m, void * base, int scale, int hint);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-64"Type E12NP类例外条件".

VGATHERPF0DPS/VGATHERPF0QPS/VGATHERPF0DPD/VGATHERPF0QPD-Sparse Prefetch SP/DP 数据值有签名

VGATHERPF1DPS/VGATHERPF1QPS/VGATHERPF1DPD/VGATHERPF1QPD-Sparse Prefetch SP/DP 数据值 带有署名词,署名词索引使用 T1 提示

操作码/ Op64/32 CPUID 描述指令 En bit 模式特性支持旗

EVEX.512.66.0F38.W0 C6/2/vsib A V/V AVX512PF 使用署名的dword指数,使用 VGATHERPF1DPS vm32z {k1} opmask k1 和 T1 提示预缩写包含单精度数据的稀疏字节内存位置.

EVEX.512.66.0F38.W0 C7/2 /vsib A V/V AVX512PF 使用签名的qword指数,预缩写稀疏字节

VGATHERPF1QPS vm64z {k1} 包含单精度数据的内存位置,使用opmask k1和T1提示.

EVEX.512.66.0F38.W1 C6/2/vsib A V/V AVX512PF 使用署名的dword指数,使用 VGATHERPF1DPD vm32y {k1} opmask k1 和 T1 提示预缩写含有双精度数据的稀疏字节内存位置.

EVEX.512.66.0F38.W1 C7/2 /vsib A V/V AVX512PF 使用签名的qword指数,使用 VGATHERPF1QPD vm64z {k1} opmask k1 和 T1 提示预选含有双精度数据的稀有字节内存位置.

## 说明

该指令有条件地预选了16个32位或8个64位整数字节的数据元素. 元素通过 VSIB 指定(即索引寄存器为zmm,持有已打包的索引). 元素只有在相应的遮罩位是一时才会被预选.

预选的行被装入一个位置提示( T1) 指定的缓存结构中的位置 :

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

VGATHERPF1DPS/VGATHERPF1QPS/VGATHERPF1DPD/VGATHERPF1QPD--Sparse Prefetch Packed SP/DP Data Values With Signed


VGATHERPF1DPS (EVEX Encoded Version)
(KL, VL) = (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+31:i]) * SCALE + DISP], Level=1, RFO = 0)
    FI;
ENDFOR

VGATHERPF1DPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+31:k]) * SCALE + DISP], Level=1, RFO = 0)
    FI;
ENDFOR

VGATHERPF1QPS (EVEX Encoded Version)
(KL, VL) = (8, 256)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+63:i]) * SCALE + DISP], Level=1, RFO = 0)
    FI;
ENDFOR

VGATHERPF1QPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+63:k]) * SCALE + DISP], Level=1, RFO = 0)
    FI;
ENDFOR
```

## Intel C/C++ 内在编译器

```c
VGATHERPF1DPD void _mm512_mask_prefetch_i32gather_pd(__m256i vdx, __mmask8 m, void * base, int scale, int hint);
VGATHERPF1DPS void _mm512_mask_prefetch_i32gather_ps(__m512i vdx, __mmask16 m, void * base, int scale, int hint);
VGATHERPF1QPD void _mm512_mask_prefetch_i64gather_pd(__m512i vdx, __mmask8 m, void * base, int scale, int hint);
VGATHERPF1QPS void _mm512_mask_prefetch_i64gather_ps(__m512i vdx, __mmask8 m, void * base, int scale, int hint);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-64"Type E12NP类例外条件".

VGATHERPF1DPS/VGATHERPF1QPS/VGATHERPF1DPD/VGATHERPF1QPD-Sparse Prefetch SP/DP 数据值有签名
