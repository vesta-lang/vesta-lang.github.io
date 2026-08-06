---
summary: 平均包装整数
---

## 说明

执行SIMD从源操作数(第二个操作数)和目标操作数(第一个操作数)中打包的无符号整数平均值,并将结果存储在目标操作数中. 对于第一个和第二个操作数中的每一对对应的数据元素,元素被加在一起,在临时和数中加一个1,结果被右移一个位位位置.

(V)PAVGB指令运行在已打包的无符号字节上,(V)PAVGW指令运行在已打包的无符号字节上.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE 指令 : 源操作数可以是MMX技术寄存器或64位内存位置. 目标操作数可以是MMX技术登记册.

128位遗产 SSE 版本 : 第一源操作数是一个XMM登记册. 第二个操作数可以是XMM寄存器或128位内存位置. 目的地与第一个来源的XMM寄存器没有区别,对应寄存器目的地的上位(MAXVL-1:128)没有修改.

EVEX.512 编码版本 : 第一源操作数是一个ZMM登记册. 第二源操作数是一个ZMM的寄存器或512位内存位置. 目标操作数是一个ZMM登记册.

VEX.256和EVEX.256编码版本: 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册.

VEX.128和EVEX.128编码版本: 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 相应的注册目的地被清零的上位位(MAXVL-128).

## 行动

```text
PAVGB (With 64-bit Operands)
    DEST[7:0] := (SRC[7:0] + DEST[7:0] + 1) >> 1; (* Temp sum before shifting is 9 bits *)
    (* Repeat operation performed for bytes 2 through 6 *)
    DEST[63:56] := (SRC[63:56] + DEST[63:56] + 1) >> 1;

PAVGW (With 64-bit Operands)
    DEST[15:0] := (SRC[15:0] + DEST[15:0] + 1) >> 1; (* Temp sum before shifting is 17 bits *)
    (* Repeat operation performed for words 2 and 3 *)
    DEST[63:48] := (SRC[63:48] + DEST[63:48] + 1) >> 1;

PAVGB (With 128-bit Operands)
    DEST[7:0] := (SRC[7:0] + DEST[7:0] + 1) >> 1; (* Temp sum before shifting is 9 bits *)
    (* Repeat operation performed for bytes 2 through 14 *)
    DEST[127:120] := (SRC[127:120] + DEST[127:120] + 1) >> 1;

PAVGW (With 128-bit Operands)
    DEST[15:0] := (SRC[15:0] + DEST[15:0] + 1) >> 1; (* Temp sum before shifting is 17 bits *)
    (* Repeat operation performed for words 2 through 6 *)
    DEST[127:112] := (SRC[127:112] + DEST[127:112] + 1) >> 1;


VPAVGB (VEX.128 Encoded Version)
    DEST[7:0] := (SRC1[7:0] + SRC2[7:0] + 1) >> 1;
    (* Repeat operation performed for bytes 2 through 15 *)
    DEST[127:120] := (SRC1[127:120] + SRC2[127:120] + 1) >> 1
    DEST[MAXVL-1:128] := 0

VPAVGW (VEX.128 Encoded Version)
    DEST[15:0] := (SRC1[15:0] + SRC2[15:0] + 1) >> 1;
    (* Repeat operation performed for 16-bit words 2 through 7 *)
    DEST[127:112] := (SRC1[127:112] + SRC2[127:112] + 1) >> 1
    DEST[MAXVL-1:128] := 0

VPAVGB (VEX.256 Encoded Instruction)
    DEST[7:0] := (SRC1[7:0] + SRC2[7:0] + 1) >> 1; (* Temp sum before shifting is 9 bits *)
    (* Repeat operation performed for bytes 2 through 31)
    DEST[255:248] := (SRC1[255:248] + SRC2[255:248] + 1) >> 1;

VPAVGW (VEX.256 Encoded Instruction)

DEST[15:0] := (SRC1[15:0] + SRC2[15:0] + 1) >> 1; (* Temp sum before shifting is 17 bits *)

(* Repeat operation performed for words 2 through 15)

DEST[255:14]) := (SRC1[255:240] + SRC2[255:240] + 1) >> 1;

VPAVGB (EVEX encoded versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := (SRC1[i+7:i] + SRC2[i+7:i] + 1) >> 1; (* Temp sum before shifting is 9 bits *)

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+7:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+7:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VPAVGW (EVEX Encoded Versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := (SRC1[i+15:i] + SRC2[i+15:i] + 1) >> 1

                                            ; (* Temp sum before shifting is 17 bits *)

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPAVGB __m512i _mm512_avg_epu8( __m512i a, __m512i b);
VPAVGW __m512i _mm512_avg_epu16( __m512i a, __m512i b);
VPAVGB __m512i _mm512_mask_avg_epu8(__m512i s, __mmask64 m, __m512i a, __m512i b);
VPAVGW __m512i _mm512_mask_avg_epu16(__m512i s, __mmask32 m, __m512i a, __m512i b);
VPAVGB __m512i _mm512_maskz_avg_epu8( __mmask64 m, __m512i a, __m512i b);
VPAVGW __m512i _mm512_maskz_avg_epu16( __mmask32 m, __m512i a, __m512i b);
VPAVGB __m256i _mm256_mask_avg_epu8(__m256i s, __mmask32 m, __m256i a, __m256i b);
VPAVGW __m256i _mm256_mask_avg_epu16(__m256i s, __mmask16 m, __m256i a, __m256i b);
VPAVGB __m256i _mm256_maskz_avg_epu8( __mmask32 m, __m256i a, __m256i b);
VPAVGW __m256i _mm256_maskz_avg_epu16( __mmask16 m, __m256i a, __m256i b);
VPAVGB __m128i _mm_mask_avg_epu8(__m128i s, __mmask16 m, __m128i a, __m128i b);
VPAVGW __m128i _mm_mask_avg_epu16(__m128i s, __mmask8 m, __m128i a, __m128i b);
VPAVGB __m128i _mm_maskz_avg_epu8( __mmask16 m, __m128i a, __m128i b);
VPAVGW __m128i _mm_maskz_avg_epu16( __mmask8 m, __m128i a, __m128i b);
PAVGB __m64 _mm_avg_pu8 (__m64 a, __m64 b) PAVGW __m64 _mm_avg_pu16 (__m64 a, __m64 b) (V)PAVGB __m128i _mm_avg_epu8 ( __m128i a, __m128i b) (V)PAVGW __m128i _mm_avg_epu16 ( __m128i a, __m128i b) VPAVGB __m256i _mm256_avg_epu8 ( __m256i a, __m256i b) VPAVGW __m256i _mm256_avg_epu16 ( __m256i a, __m256i b);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded 指令,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".
