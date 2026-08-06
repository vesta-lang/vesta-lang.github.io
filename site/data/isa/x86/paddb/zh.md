---
summary: 添加包装整数
---

## 说明

执行SIMD从源操作数(第二位操作数)和目标操作数(第一位操作数)中添加的包装整数,并将包装整数结果存储在目标操作数中. 参见Intel(R)64和IA-32 Architectures Software开发者手册第1卷图9-4中的SIMD操作的插图. 如以下各段所述,过度流动是包罗万象的。

PADDB 和 VPADDB 指令从 第一源操作数 和 第二源操作数 中添加已包装的字节整数,并将已包装的整数结果存储在 目标操作数 中. 当单个结果太大,无法以8位表示(流过)时,结果被包裹,低8位被写到目标操作数(即背负被忽略).

PADDW和VPADDW指令从第一源操作数和第二源操作数中添加了打包的单词整数,并将打包的整数结果存储在目标操作数中. 当单个结果太大到无法

以 16 位(流过)表示,结果被包裹,低16 位被写入 目标操作数(即背负被忽略).

PADDD和VPADDD指令从第一源操作数和第二源操作数添加了包装的双字整数,并将包装的整数结果存储在目标操作数中. 当单个结果太大,无法以32位表示(流过)时,结果被包起来,低的32位写到目标操作数(即背负被忽略).

PADDQ和VPADDQ指令从第一源操作数和第二源操作数中添加了包装的四字整数,并将包装的整数结果存储在目标操作数中. 当一个四字形的结果太大,无法用64位(过度流)表示时,结果被包起来,低64位写给目标操作数(即背负被忽略).

注意,(V)PADDB,(V)PADDW,(V)PADDD和(V)PADDQ指令可以在无签名或签名(两个"补充注")的包装整数上运行;然而,它并没有在EFLAGS的寄存器中设置比特,以表示溢出和/或结转. 为防止未被发现的溢出条件,软件必须控制运行在的值范围.

EVEX编码为VPADDD/Q: 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数是一个ZMM/YMM/XMM的登记器,512/256/128位内存位置或512/256/128位矢量从32/64位内存位置广播. 目标操作数是一个按照写掩码更新的ZMM/YMM/XMM登记册.

EVEX编码为VPADDB/W: 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数是一个ZMM/YMM/XMM登记册,一个512/256/128位的内存位置. 目标操作数是一个按照写掩码更新的ZMM/YMM/XMM登记册.

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM记录器. 目的地的上位(MAXVL-1:256)被清除.

VEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

128位遗产 SSE 版本 : 第一源操作数是一个XMM登记册. 第二个操作数可以是XMM寄存器或128位内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(ZMM注册点)没有修改.

## 行动

```text
PADDB (With 64-bit Operands)
    DEST[7:0] := DEST[7:0] + SRC[7:0];
    (* Repeat add operation for 2nd through 7th byte *)
    DEST[63:56] := DEST[63:56] + SRC[63:56];

PADDW (With 64-bit Operands)
    DEST[15:0] := DEST[15:0] + SRC[15:0];
    (* Repeat add operation for 2nd and 3th word *)
    DEST[63:48] := DEST[63:48] + SRC[63:48];

PADDD (With 64-bit Operands)
    DEST[31:0] := DEST[31:0] + SRC[31:0];
    DEST[63:32] := DEST[63:32] + SRC[63:32];

PADDQ (With 64-Bit Operands)
    DEST[63:0] := DEST[63:0] + SRC[63:0];


PADDB (Legacy SSE Instruction)
    DEST[7:0] := DEST[7:0] + SRC[7:0];
    (* Repeat add operation for 2nd through 15th byte *)
    DEST[127:120] := DEST[127:120] + SRC[127:120];
    DEST[MAXVL-1:128] (Unmodified)

PADDW (Legacy SSE Instruction)
    DEST[15:0] := DEST[15:0] + SRC[15:0];
    (* Repeat add operation for 2nd through 7th word *)
    DEST[127:112] := DEST[127:112] + SRC[127:112];
    DEST[MAXVL-1:128] (Unmodified)

PADDD (Legacy SSE Instruction)
    DEST[31:0] := DEST[31:0] + SRC[31:0];
    (* Repeat add operation for 2nd and 3th doubleword *)
    DEST[127:96] := DEST[127:96] + SRC[127:96];
    DEST[MAXVL-1:128] (Unmodified)

PADDQ (Legacy SSE Instruction)
    DEST[63:0] := DEST[63:0] + SRC[63:0];
    DEST[127:64] := DEST[127:64] + SRC[127:64];
    DEST[MAXVL-1:128] (Unmodified)

VPADDB (VEX.128 Encoded Instruction)
    DEST[7:0] := SRC1[7:0] + SRC2[7:0];
    (* Repeat add operation for 2nd through 15th byte *)
    DEST[127:120] := SRC1[127:120] + SRC2[127:120];
    DEST[MAXVL-1:128] := 0;

VPADDW (VEX.128 Encoded Instruction)
    DEST[15:0] := SRC1[15:0] + SRC2[15:0];
    (* Repeat add operation for 2nd through 7th word *)
    DEST[127:112] := SRC1[127:112] + SRC2[127:112];
    DEST[MAXVL-1:128] := 0;

VPADDD (VEX.128 Encoded Instruction)
    DEST[31:0] := SRC1[31:0] + SRC2[31:0];
    (* Repeat add operation for 2nd and 3th doubleword *)
    DEST[127:96] := SRC1[127:96] + SRC2[127:96];
    DEST[MAXVL-1:128] := 0;

VPADDQ (VEX.128 Encoded Instruction)
    DEST[63:0] := SRC1[63:0] + SRC2[63:0];
    DEST[127:64] := SRC1[127:64] + SRC2[127:64];
    DEST[MAXVL-1:128] := 0;

VPADDB (VEX.256 Encoded Instruction)
    DEST[7:0] := SRC1[7:0] + SRC2[7:0];
    (* Repeat add operation for 2nd through 31th byte *)
    DEST[255:248] := SRC1[255:248] + SRC2[255:248];


VPADDW (VEX.256 Encoded Instruction)
    DEST[15:0] := SRC1[15:0] + SRC2[15:0];
    (* Repeat add operation for 2nd through 15th word *)
    DEST[255:240] := SRC1[255:240] + SRC2[255:240];

VPADDD (VEX.256 Encoded Instruction)
    DEST[31:0] := SRC1[31:0] + SRC2[31:0];
    (* Repeat add operation for 2nd and 7th doubleword *)
    DEST[255:224] := SRC1[255:224] + SRC2[255:224];

VPADDQ (VEX.256 Encoded Instruction)
    DEST[63:0] := SRC1[63:0] + SRC2[63:0];
    DEST[127:64] := SRC1[127:64] + SRC2[127:64];
    DEST[191:128] := SRC1[191:128] + SRC2[191:128];
    DEST[255:192] := SRC1[255:192] + SRC2[255:192];

VPADDB (EVEX Encoded Versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SRC1[i+7:i] + SRC2[i+7:i]

     ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+7:i] remains unchanged*

                 ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+7:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VPADDW (EVEX Encoded Versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SRC1[i+15:i] + SRC2[i+15:i]

     ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0


VPADDD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+31:i] := SRC1[i+31:i] + SRC2[31:0]

                  ELSE DEST[i+31:i] := SRC1[i+31:i] + SRC2[i+31:i]

             FI;

     ELSE

             IF *merging-masking*             ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VPADDQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := SRC1[i+63:i] + SRC2[63:0]

                  ELSE DEST[i+63:i] := SRC1[i+63:i] + SRC2[i+63:i]

             FI;

     ELSE

             IF *merging-masking*             ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPADDB__m512i _mm512_add_epi8 ( __m512i a, __m512i b) VPADDW__m512i _mm512_add_epi16 ( __m512i a, __m512i b) VPADDB__m512i _mm512_mask_add_epi8 ( __m512i s, __mmask64 m, __m512i a, __m512i b) VPADDW__m512i _mm512_mask_add_epi16 ( __m512i s, __mmask32 m, __m512i a, __m512i b) VPADDB__m512i _mm512_maskz_add_epi8 (__mmask64 m, __m512i a, __m512i b) VPADDW__m512i _mm512_maskz_add_epi16 (__mmask32 m, __m512i a, __m512i b) VPADDB__m256i _mm256_mask_add_epi8 (__m256i s, __mmask32 m, __m256i a, __m256i b) VPADDW__m256i _mm256_mask_add_epi16 (__m256i s, __mmask16 m, __m256i a, __m256i b) VPADDB__m256i _mm256_maskz_add_epi8 (__mmask32 m, __m256i a, __m256i b) VPADDW__m256i _mm256_maskz_add_epi16 (__mmask16 m, __m256i a, __m256i b) VPADDB__m128i _mm_mask_add_epi8 (__m128i s, __mmask16 m, __m128i a, __m128i b) VPADDW__m128i _mm_mask_add_epi16 (__m128i s, __mmask8 m, __m128i a, __m128i b) VPADDB__m128i _mm_maskz_add_epi8 (__mmask16 m, __m128i a, __m128i b) VPADDW__m128i _mm_maskz_add_epi16 (__mmask8 m, __m128i a, __m128i b) VPADDD __m512i _mm512_add_epi32( __m512i a, __m512i b);
VPADDD __m512i _mm512_mask_add_epi32(__m512i s, __mmask16 k, __m512i a, __m512i b);
VPADDD __m512i _mm512_maskz_add_epi32( __mmask16 k, __m512i a, __m512i b);
VPADDD __m256i _mm256_mask_add_epi32(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPADDD __m256i _mm256_maskz_add_epi32( __mmask8 k, __m256i a, __m256i b);
VPADDD __m128i _mm_mask_add_epi32(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPADDD __m128i _mm_maskz_add_epi32( __mmask8 k, __m128i a, __m128i b);
VPADDQ __m512i _mm512_add_epi64( __m512i a, __m512i b);
VPADDQ __m512i _mm512_mask_add_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPADDQ __m512i _mm512_maskz_add_epi64( __mmask8 k, __m512i a, __m512i b);
VPADDQ __m256i _mm256_mask_add_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPADDQ __m256i _mm256_maskz_add_epi64( __mmask8 k, __m256i a, __m256i b);
VPADDQ __m128i _mm_mask_add_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPADDQ __m128i _mm_maskz_add_epi64( __mmask8 k, __m128i a, __m128i b);
PADDB __m128i _mm_add_epi8 (__m128i a,__m128i b );
PADDW __m128i _mm_add_epi16 ( __m128i a, __m128i b);
PADDD __m128i _mm_add_epi32 ( __m128i a, __m128i b);
PADDQ __m128i _mm_add_epi64 ( __m128i a, __m128i b);
VPADDB __m256i _mm256_add_epi8 (__m256ia,__m256i b );
VPADDW __m256i _mm256_add_epi16 ( __m256i a, __m256i b);
VPADDD __m256i _mm256_add_epi32 ( __m256i a, __m256i b);
VPADDQ __m256i _mm256_add_epi64 ( __m256i a, __m256i b);
PADDB __m64 _mm_add_pi8(__m64 m1, __m64 m2) PADDW __m64 _mm_add_pi16(__m64 m1, __m64 m2) PADDD __m64 _mm_add_pi32(__m64 m1, __m64 m2) PADDQ __m64 _mm_add_si64(__m64 m1, __m64 m2);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded VPADDD/Q,参见表2-51"Type E4类例外条件".

EVEX-encoded VPADDB/W,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".
