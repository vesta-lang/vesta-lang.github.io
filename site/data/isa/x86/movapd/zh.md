---
summary: 移动对齐的 打包双精度浮点值
---

## 说明

将 2, 4 或 8 双精度浮点 值从 源操作数 (第二个 操作数) 移动到 目标操作数 (第一个 操作数) . 本指令可用于从128位,256位或512位内存位置装入XMM,YMM或ZMM的登记册,将XMM,YMM或ZMM的登记册内容存储到128位,256位或512位内存位置,或者将数据移动到两个XMM,两个YMM或两个ZMM登记册之间.

当来源或目标操作数为内存操作数时,操作数必须按16字节(128位版本),32字节(256位版本)或64字节(EVEX.512编码版本)边界或一般保护对齐.

将生成例外( #GP) 。 对于EVEX编码版本,操作数必须与内存操作数的大小一致. 要将 双精度浮点 值移动到或不匹配的内存位置,请使用 VMOVUPD 指令.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

EVEX.512 编码版本 :

将512位组合的双精度浮点值从源操作符(第二个操作符)移动到目的地操作符(第一个操作符). 本指令可用于从512位浮点数64 内存位置装入ZMM寄存器,将ZMM寄存器的内容存储到512位浮点数64 内存位置寄存器中,或者将数据移动到两个ZMM寄存器之间. 当来源或目标操作数是内存操作数时,操作数必须按64字节边界或一般保护例外(#GP)对齐. 要将 单精度浮点 值移动到或不匹配的内存位置,请使用 VMOVUPD 指令.

VEX.256和EVEX.256编码版本:

将256位组合的双精度浮点值从源操作符(第二个操作符)移动到目的地操作符(第一个操作符). 本指令可用于从256位的内存位置加载一个YMM寄存器,将一个YMM寄存器的内容存储到256位的内存位置寄存器中,或者在两个YMM寄存器之间移动数据. 当来源或目标操作数是内存操作数时,操作数必须在32字节边界或一般保护例外(#GP)上对齐. 要将 双精度浮点 值移动到或不匹配的内存位置,请使用 VMOVUPD 指令.

128-bit versions:

将128位的打包双精度浮点值从源操作数(第二个操作数)移动到目标操作数(第一个操作数). 本指令可用于从128位的内存位置装入XMM寄存器,将XMM寄存器的内容存储到128位的内存位置寄存器中,或者在两个XMM寄存器之间移动数据. 当来源或目标操作数是内存操作数时,操作数必须在16字节边界或一般保护例外(#GP)上对齐. 要将单精度浮点值上下移动到不匹配的内存位置,使用VMOVUPD指令.

128位遗产 SSE 版本 : 相应的ZMM目的地注册保持不变的位数(MAXVL-1:128).

(E)VEX.128编码版本: 目的地ZMM注册目的地被清零的位数(MAXVL-1:128).

## 行动

```text
VMOVAPD (EVEX Encoded Versions, Register-Copy Form)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[i+63:i]

     ELSE

             IF *merging-masking*        ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE DEST[i+63:i] := 0  ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VMOVAPD (EVEX Encoded Versions, Store-Form)      ; merging-masking
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := SRC[i+63:i]
          ELSE
          ELSE *DEST[i+63:i] remains unchanged*

    FI;
ENDFOR;

VMOVAPD (EVEX Encoded Versions, Load-Form)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[i+63:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE DEST[i+63:i] := 0     ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVAPD (VEX.256 Encoded Version, Load - and Register Copy)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0

VMOVAPD (VEX.256 Encoded Version, Store-Form)
DEST[255:0] := SRC[255:0]

VMOVAPD (VEX.128 Encoded Version, Load - and Register Copy)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] := 0

MOVAPD (128-bit Load- and Register-Copy- Form Legacy SSE Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] (Unmodified)

(V)MOVAPD (128-bit Store-Form Version)
DEST[127:0] := SRC[127:0]
```

## Intel C/C++ 内在编译器

```c
VMOVAPD __m512d _mm512_load_pd( void * m);
VMOVAPD __m512d _mm512_mask_load_pd(__m512d s, __mmask8 k, void * m);
VMOVAPD __m512d _mm512_maskz_load_pd( __mmask8 k, void * m);
VMOVAPD void _mm512_store_pd( void * d, __m512d a);
VMOVAPD void _mm512_mask_store_pd( void * d, __mmask8 k, __m512d a);
VMOVAPD __m256d _mm256_mask_load_pd(__m256d s, __mmask8 k, void * m);
VMOVAPD __m256d _mm256_maskz_load_pd( __mmask8 k, void * m);
VMOVAPD void _mm256_mask_store_pd( void * d, __mmask8 k, __m256d a);
VMOVAPD __m128d _mm_mask_load_pd(__m128d s, __mmask8 k, void * m);
VMOVAPD __m128d _mm_maskz_load_pd( __mmask8 k, void * m);
VMOVAPD void _mm_mask_store_pd( void * d, __mmask8 k, __m128d a);
MOVAPD __m256d _mm256_load_pd (double * p);
MOVAPD void _mm256_store_pd(double * p, __m256d a);
MOVAPD __m128d _mm_load_pd (double * p);
MOVAPD void _mm_store_pd(double * p, __m128d a);
```

## SIMD 浮点 例外

None.

## 其他例外

非EVEX-encoded 指令,参见表2-18中的例外类型1. SSE2,"第1类例外条件".

EVEX-encoded 指令,参见表2-46,"Type E1类例外条件".

Additionally:

```text
#UD               If EVEX.vvvv != 1111B or VEX.vvvv != 1111B.
```
