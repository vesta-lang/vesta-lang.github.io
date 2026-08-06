---
summary: 移动未对齐的 打包双精度浮点值
---

## 说明

说明: VEX.vvvv和EVEX.vvvv是保留的,必须为1111b否则指令会#UD.

EVEX.512 编码版本 :

将512位组合的双精度浮点值从源操作符(第二个操作符)移动到目的地操作符(第一个操作符). 此指令可用于从浮点64 内存位置装入ZMM寄存器,将ZMM寄存器的内容存储到内存中. 目标操作数根据写掩码更新.

VEX.256 编码版本 :

将256位组合的双精度浮点值从源操作符(第二个操作符)移动到目的地操作符(第一个操作符). 本指令可用于从256位的内存位置加载一个YMM寄存器,将一个YMM寄存器的内容存储到256位的内存位置寄存器中,或者在两个YMM寄存器之间移动数据. 目的地的比特(MAXVL-1:256)注册被清零.

128-bit versions:

将128位的打包双精度浮点值从源操作数(第二个操作数)移动到目标操作数(第一个操作数). 本指令可用于从128位的内存位置装入XMM寄存器,将XMM寄存器的内容存储到128位的内存位置寄存器中,或者在两个XMM寄存器之间移动数据.

128位遗产 SSE 版本 : 对应目的地的比特(MAXVL-1:128)注册保持不变.

当来源或目标操作数为内存操作数时,操作数可能在16字节边界上不协调,而不会产生一般保护例外(#GP).

VEX.128和EVEX.128编码版本: 目的地的位数(MAXVL-1:128)登记被清零.

## 行动

```text
VMOVUPD (EVEX Encoded Versions, Register-Copy Form)

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

VMOVUPD (EVEX Encoded Versions, Store-Form)      ; merging-masking
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := SRC[i+63:i]
          ELSE *DEST[i+63:i] remains unchanged*

    FI;
ENDFOR;


VMOVUPD (EVEX Encoded Versions, Load-Form)

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

VMOVUPD (VEX.256 Encoded Version, Load - and Register Copy)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0

VMOVUPD (VEX.256 Encoded Version, Store-Form)
DEST[255:0] := SRC[255:0]

VMOVUPD (VEX.128 Encoded Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] := 0

MOVUPD (128-bit Load- and Register-Copy- Form Legacy SSE Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] (Unmodified)

(V)MOVUPD (128-bit Store-Form Version)
DEST[127:0] := SRC[127:0]
```

## Intel C/C++ 内在编译器

```c
VMOVUPD __m512d _mm512_loadu_pd( void * s);
VMOVUPD __m512d _mm512_mask_loadu_pd(__m512d a, __mmask8 k, void * s);
VMOVUPD __m512d _mm512_maskz_loadu_pd( __mmask8 k, void * s);
VMOVUPD void _mm512_storeu_pd( void * d, __m512d a);
VMOVUPD void _mm512_mask_storeu_pd( void * d, __mmask8 k, __m512d a);
VMOVUPD __m256d _mm256_mask_loadu_pd(__m256d s, __mmask8 k, void * m);
VMOVUPD __m256d _mm256_maskz_loadu_pd( __mmask8 k, void * m);
VMOVUPD void _mm256_mask_storeu_pd( void * d, __mmask8 k, __m256d a);
VMOVUPD __m128d _mm_mask_loadu_pd(__m128d s, __mmask8 k, void * m);
VMOVUPD __m128d _mm_maskz_loadu_pd( __mmask8 k, void * m);
VMOVUPD void _mm_mask_storeu_pd( void * d, __mmask8 k, __m128d a);
MOVUPD __m256d _mm256_loadu_pd (double * p);
MOVUPD void _mm256_storeu_pd( double *p, __m256d a);
MOVUPD __m128d _mm_loadu_pd (double * p);
MOVUPD void _mm_storeu_pd( double *p, __m128d a);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

#AC的注解处理不尽相同;此外:

```text
#UD               If VEX.vvvv != 1111B.
```

EVEX-encoded 指令,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".
