---
summary: 包装对齐
---

## 说明

(V)PALIGNR 将 目标操作数(第一个操作数)和 源操作数(第二个操作数) 合成中间复合物,通过一个恒定的即时切换将字节颗粒的复合物移到右边,并提取右配位结果进入目的地. 第一个和第二个操作数可以是MMX,XMM,也可以是YMM的登记册. 即时值视为未署名值. 即时班数大于2L(即128位操作数为32位,或64位操作数为16位)产生零结果. 操作数都可以是MMX登记册,XMM登记册或YMM登记册. 当源操作数是128位的内存操作数时,操作数必须在16字节边界或一般保护例外(#GP)上对齐.

在64位模式中,不由VEX/EVEX前缀编码,使用REX前缀访问额外的登记册.

128位遗产 SSE 版本 : 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

EVEX.512 编码版本 : 第一源操作数是一个ZMM的寄存器,包含四个16字节的块. 第二源操作数是一个ZMM寄存器或512位内存位置,包含四个16字节块. 目标操作数是一个ZMM记录器,包含四个16字节的结果. Imm8 [7: 0] 是常见的班次数

用于连续四个16字节的区块源。 两个源操作数的低16字节区块产生目标操作数的低16字节结果,两个源操作数的高16字节区块产生目标操作数的高16字节结果等,用于中间的区块.

VEX.256和EVEX.256编码版本: 第一源操作数是一个YMM的寄存器,包含两个16字节的块. 第二源操作数是一个YMM寄存器或256位的内存位置,包含两个16字节块. 目标操作数是一个YMM记录器,包含两个16字节的结果. Imm8[7:0]是两个下位16字节区块源和两个上位16字节区块源所使用的常见的转向计数. 两个源操作数的低16字节区块产生目标操作数的低16字节结果,两个源操作数的高16字节区块产生目标操作数的高16字节结果. 对应的ZMM注册目的地被清零的上位(MAXVL-1:256).

VEX.128和EVEX.128编码版本: 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-128).

第一种和第二源操作数两种128位和256位指令的128位数据进行了聚合. 中间复合256位结果的高128位来自第一源操作数的128位数据;中间结果的低128位来自第二源操作数的128位数据.

```text
                             127                      0 127                  0
                   SRC1           128 255                                       SRC2
```

```text
         255                                                          Imm8[7:0]*8
```

SRC1                                                         128

SRC2

Imm8[7:0]*8

```text
         255                      128 127                                       0
```

DEST DEST 维基语录链接:名人名言 - 文学作品 - 谚语 - 谚语

图4-7. 256位 VPALIGN 指令操作

## 行动

```text
PALIGNR (With 64-bit Operands)

    temp1[127:0] = CONCATENATE(DEST,SRC)>>(imm8*8)
    DEST[63:0] = temp1[63:0]

PALIGNR (With 128-bit Operands)
temp1[255:0] := ((DEST[127:0] << 128) OR SRC[127:0])>>(imm8*8);
DEST[127:0] := temp1[127:0]
DEST[MAXVL-1:128] (Unmodified)

VPALIGNR (VEX.128 Encoded Version)
temp1[255:0] := ((SRC1[127:0] << 128) OR SRC2[127:0])>>(imm8*8);
DEST[127:0] := temp1[127:0]
DEST[MAXVL-1:128] := 0

VPALIGNR (VEX.256 Encoded Version)
temp1[255:0] := ((SRC1[127:0] << 128) OR SRC2[127:0])>>(imm8[7:0]*8);
DEST[127:0] := temp1[127:0]
temp1[255:0] := ((SRC1[255:128] << 128) OR SRC2[255:128])>>(imm8[7:0]*8);
DEST[MAXVL-1:128] := temp1[127:0]

VPALIGNR (EVEX Encoded Versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR l := 0 TO VL-1 with increments of 128
    temp1[255:0] := ((SRC1[l+127:l] << 128) OR SRC2[l+127:l])>>(imm8[7:0]*8);
    TMP_DEST[l+127:l] := temp1[127:0]

ENDFOR;

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := TMP_DEST[i+7:i]

     ELSE

            IF *merging-masking*            ; merging-masking

                THEN *DEST[i+7:i] remains unchanged*

                ELSE *zeroing-masking*      ; zeroing-masking

                    DEST[i+7:i] = 0

            FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
PALIGNR __m64 _mm_alignr_pi8 (__m64 a, __m64 b, int n) (V)PALIGNR __m128i _mm_alignr_epi8 (__m128i a, __m128i b, int n) VPALIGNR __m256i _mm256_alignr_epi8 (__m256i a, __m256i b, const int n) VPALIGNR __m512i _mm512_alignr_epi8 (__m512i a, __m512i b, const int n) VPALIGNR __m512i _mm512_mask_alignr_epi8 (__m512i s, __mmask64 m, __m512i a, __m512i b, const int n) VPALIGNR __m512i _mm512_maskz_alignr_epi8 ( __mmask64 m, __m512i a, __m512i b, const int n) VPALIGNR __m256i _mm256_mask_alignr_epi8 (__m256i s, __mmask32 m, __m256i a, __m256i b, const int n) VPALIGNR __m256i _mm256_maskz_alignr_epi8 (__mmask32 m, __m256i a, __m256i b, const int n) VPALIGNR __m128i _mm_mask_alignr_epi8 (__m128i s, __mmask16 m, __m128i a, __m128i b, const int n) VPALIGNR __m128i _mm_maskz_alignr_epi8 (__mmask16 m, __m128i a, __m128i b, const int n);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-编码指令,参见表2-52中的例外类型E4NF.nb,"Type E4NF类例外条件".
