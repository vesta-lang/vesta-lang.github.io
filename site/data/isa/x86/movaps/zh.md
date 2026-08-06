---
summary: 移动对齐的 打包单精度浮点值
---

## 说明

将 4, 8 或 16 单精度浮点 值从 源操作数 (第二 操作数) 移动到 目标操作数 (第一 操作数) . 本指令可用于从128位,256位或512位内存位置装入XMM,YMM或ZMM的登记册,将XMM,YMM或ZMM的登记册内容存储到128位,256位或512位内存位置,或者将数据移动到两个XMM,两个YMM或两个ZMM登记册之间.

当来源或目标操作数为内存操作数时,操作数必须按16字节(128位版本),32字节(VEX.256编码版本)或64字节(EVEX.512编码版本)边界或一般-对齐.

将生成保护例外( #GP) 。 对于EVEX.512编码版本,操作数必须与内存操作数的大小一致. 要将 单精度浮点 值移动到或不匹配的内存位置,请使用 VMOVUPS 指令.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

EVEX.512 编码版本 :

将512位组合的单精度浮点值从源操作(第二操作)移动到目的地操作(第一操作). 本指令可用于从512位浮点32 内存位置装入一个ZMM寄存器,将一个ZMM寄存器的内容存储到一个浮点32 内存位置,或者在两个ZMM寄存器之间移动数据. 当来源或目标操作数是内存操作数时,操作数必须按64字节边界或一般保护例外(#GP)对齐. 要将单精度浮点值上下移动到不匹配的内存位置,使用VMOVUPS指令.

VEX.256和EVEX.256编码版本:

将256位组合的单精度浮点值从源操作(第二操作)移动到目的地操作(第一操作). 本指令可用于从256位的内存位置加载一个YMM寄存器,将一个YMM寄存器的内容存储到256位的内存位置寄存器中,或者在两个YMM寄存器之间移动数据. 当来源或目标操作数是内存操作数时,操作数必须在32字节边界或一般保护例外(#GP)上对齐.

128-bit versions:

将128位的打包单精度浮点值从源操作数(第二个操作数)移动到目标操作数(第一个操作数). 本指令可用于从128位的内存位置装入XMM寄存器,将XMM寄存器的内容存储到128位的内存位置寄存器中,或者在两个XMM寄存器之间移动数据. 当来源或目标操作数是内存操作数时,操作数必须在16字节边界或一般保护例外(#GP)上对齐. 要将单精度浮点值上下移动到不匹配的内存位置,使用VMOVUPS指令.

128位遗产 SSE 版本 : 相应的ZMM目的地注册保持不变的位数(MAXVL-1:128).

(E)VEX.128编码版本: 目的地ZMM的位数(MAXVL-1:128)登记被清零.

## 行动

```text
VMOVAPS (EVEX Encoded Versions, Register-Copy Form)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[i+31:i]

     ELSE

             IF *merging-masking*         ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE DEST[i+31:i] := 0   ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VMOVAPS (EVEX Encoded Versions, Store Form)      ; merging-masking
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] :=
                SRC[i+31:i]

          ELSE *DEST[i+31:i] remains unchanged*
    FI;
ENDFOR;

VMOVAPS (EVEX Encoded Versions, Load Form)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[i+31:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE DEST[i+31:i] := 0     ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVAPS (VEX.256 Encoded Version, Load - and Register Copy)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0

VMOVAPS (VEX.256 Encoded Version, Store-Form)
DEST[255:0] := SRC[255:0]

VMOVAPS (VEX.128 Encoded Version, Load - and Register Copy)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] := 0

MOVAPS (128-bit Load- and Register-Copy- Form Legacy SSE Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] (Unmodified)

(V)MOVAPS (128-bit Store-Form Version)
DEST[127:0] := SRC[127:0]
```

## Intel C/C++ 内在编译器

```c
VMOVAPS __m512 _mm512_load_ps( void * m);
VMOVAPS __m512 _mm512_mask_load_ps(__m512 s, __mmask16 k, void * m);
VMOVAPS __m512 _mm512_maskz_load_ps( __mmask16 k, void * m);
VMOVAPS void _mm512_store_ps( void * d, __m512 a);
VMOVAPS void _mm512_mask_store_ps( void * d, __mmask16 k, __m512 a);
VMOVAPS __m256 _mm256_mask_load_ps(__m256 a, __mmask8 k, void * s);
VMOVAPS __m256 _mm256_maskz_load_ps( __mmask8 k, void * s);
VMOVAPS void _mm256_mask_store_ps( void * d, __mmask8 k, __m256 a);
VMOVAPS __m128 _mm_mask_load_ps(__m128 a, __mmask8 k, void * s);
VMOVAPS __m128 _mm_maskz_load_ps( __mmask8 k, void * s);
VMOVAPS void _mm_mask_store_ps( void * d, __mmask8 k, __m128 a);
MOVAPS __m256 _mm256_load_ps (float * p);
MOVAPS void _mm256_store_ps(float * p, __m256 a);
MOVAPS __m128 _mm_load_ps (float * p);
MOVAPS void _mm_store_ps(float * p, __m128 a);
```

## SIMD 浮点 例外

None.

## 其他例外

非EVEX-encoded 指令,参见表2-18中的例外类型1.SSE,"第1类例外条件",另外:

```text
#UD               If VEX.vvvv != 1111B.
```

EVEX-encoded 指令,参见表2-46,"Type E1类例外条件".
