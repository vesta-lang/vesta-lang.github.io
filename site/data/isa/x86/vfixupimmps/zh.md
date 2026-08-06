---
summary: 修复特殊包装浮点32值
---

## 说明

使用在第二源操作(第三源操作)对应的双字元素中指定的32位双层仰视表,在第一源操作(第二源操作)中以单精度浮点格式编码的双字元素进行修复,但报告规格为imm8的除外. 固定的元素由 opmask k1 中指定的 1 的掩码位选择. Opmask k1或表响应动作0000b中的遮罩比特0保留了第一个操作数的相应元素. 来自第一源操作数的固定元件和第一个操作数中保存的元件被合并为目标操作数(第一个操作数)中的最后结果.

目的地和第一个源操作数是ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位向量从64位内存位置广播.

双层浏览表通过将输入数据编码为8个令牌类型,对第一个源操作中的每个单精度浮点输入数据进行修复. 对第一源操作数中以16个响应动作之一转换输入编码的每个符号类型都定义了一个响应表.

本指令专门用于确定涉及一个源的算术计算结果,使其与光谱相匹配,虽然它一般有助于确定多指令序列的结果,以反映特殊数字输入. 例如,考虑rcp(0). 输入 0 到 rcp,您应该根据 DX10 的光谱得到 INF 。 然而,通过牛顿-拉弗森(Newton-Raphson)来评价rcp,其中x=约(1/0)产生不正确的结果. 为了处理这个问题,VFIXUPIMMPS可以在N-R对等序列后用于设定结果为正确的值(即输入为0时的INF).

如果MXCSR.DAZ没有设置,则第一源操作数中的异常输入元素被认为是正常输入,不会触发任何修复或故障报告.

Imm8用于设定所需的旗帜报告. 它支持#ZE和#IE断层报告(详见下文).

MXCSR.DAZ被使用,仅指zmm2(即zmm1在MXCSR.DAZ设定的情况下不视为零).

MXCSR 面具比特被忽略,并被当作所有面具比特被设定为面具反应. 如果设置了imm8比特,并且满足了错误报告的条件,则MXCSR.IE或MXCSR.ZE可能会被更新.

## 行动

```text
enum TOKEN_TYPE
{

    QNAN_TOKEN := 0,
    SNAN_TOKEN := 1,
    ZERO_VALUE_TOKEN := 2,
    POS_ONE_VALUE_TOKEN := 3,
    NEG_INF_TOKEN := 4,
    POS_INF_TOKEN := 5,
    NEG_VALUE_TOKEN := 6,
    POS_VALUE_TOKEN := 7
}

FIXUPIMM_SP ( dest[31:0], src1[31:0],tbl3[31:0], imm8 [7:0]){

tsrc[31:0] := ((src1[30:23] = 0) AND (MXCSR.DAZ =1)) ? 0.0 : src1[31:0]

CASE(tsrc[31:0] of TOKEN_TYPE) {

   QNAN_TOKEN: j := 0;

   SNAN_TOKEN: j := 1;

   ZERO_VALUE_TOKEN: j := 2;

   POS_ONE_VALUE_TOKEN: j := 3;

   NEG_INF_TOKEN: j := 4;

   POS_INF_TOKEN: j := 5;

   NEG_VALUE_TOKEN: j := 6;

   POS_VALUE_TOKEN: j := 7;

}  ; end source special CASE(tsrc...)

; The required response from src3 table is extracted
token_response[3:0] = tbl3[3+4*j:4*j];

CASE(token_response[3:0]) {

   0000: dest[31:0] := dest[31:0];        ; preserve content of DEST

   0001: dest[31:0] := tsrc[31:0];        ; pass through src1 normal input value, denormal as zero

   0010: dest[31:0] := QNaN(tsrc[31:0]);

   0011: dest[31:0] := QNAN_Indefinite;

   0100: dest[31:0] := -INF;

   0101: dest[31:0] := +INF;

   0110: dest[31:0] := tsrc.sign? INF : +INF;

   0111: dest[31:0] := -0;

   1000: dest[31:0] := +0;

   1001: dest[31:0] := -1;

   1010: dest[31:0] := +1;

   1011: dest[31:0] := 1/2;

   1100: dest[31:0] := 90.0;

   1101: dest[31:0] := PI/2;

   1110: dest[31:0] := MAX_FLOAT;

   1111: dest[31:0] := -MAX_FLOAT;

}  ; end of token_response CASE

; The required fault reporting from imm8 is extracted
; TOKENs are mutually exclusive and TOKENs priority defines the order.

; Multiple faults related to a single token can occur simultaneously.

IF (tsrc[31:0] of TOKEN_TYPE: ZERO_VALUE_TOKEN) AND imm8[0] then set #ZE;
IF (tsrc[31:0] of TOKEN_TYPE: ZERO_VALUE_TOKEN) AND imm8[1] then set #IE;
IF (tsrc[31:0] of TOKEN_TYPE: ONE_VALUE_TOKEN) AND imm8[2] then set #ZE;


   IF (tsrc[31:0] of TOKEN_TYPE: ONE_VALUE_TOKEN) AND imm8[3] then set #IE;

   IF (tsrc[31:0] of TOKEN_TYPE: SNAN_TOKEN) AND imm8[4] then set #IE;

   IF (tsrc[31:0] of TOKEN_TYPE: NEG_INF_TOKEN) AND imm8[5] then set #IE;

   IF (tsrc[31:0] of TOKEN_TYPE: NEG_VALUE_TOKEN) AND imm8[6] then set #IE;

   IF (tsrc[31:0] of TOKEN_TYPE: POS_INF_TOKEN) AND imm8[7] then set #IE;

        ; end fault reporting

   return dest[31:0];

}       ; end of FIXUPIMM_SP()

VFIXUPIMMPS (EVEX)
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

   i := j * 32

   IF k1[j] OR *no writemask*

        THEN

                IF (EVEX.b = 1) AND (SRC2 *is memory*)

                     THEN

                       DEST[i+31:i] := FIXUPIMM_SP(DEST[i+31:i], SRC1[i+31:i], SRC2[31:0], imm8 [7:0])

                     ELSE

                       DEST[i+31:i] := FIXUPIMM_SP(DEST[i+31:i], SRC1[i+31:i], SRC2[i+31:i], imm8 [7:0])

                FI;

        ELSE

                IF *merging-masking*               ; merging-masking

                     THEN *DEST[i+31:i] remains unchanged*

                     ELSE DEST[i+31:i] := 0        ; zeroing-masking

                FI

   FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

Immediate Control Description:

                                                                        76543210

                           + INF  #IE
                           - VE  #IE
                           - INF  #IE
                            SNaN  #IE

                             ONE  #IE
                             ONE  #ZE
                            ZERO  #IE
                            ZERO  #ZE

                                 Figure 5-10. VFIXUPIMMPS Immediate Control Description
```

## Intel C/C++ 内在编译器

```c
VFIXUPIMMPS __m512 _mm512_fixupimm_ps( __m512 a, __m512 b, __m512i c, int imm8);
VFIXUPIMMPS __m512 _mm512_mask_fixupimm_ps(__m512 a, __mmask16 k, __m512 b, __m512i c, int imm8);
VFIXUPIMMPS __m512 _mm512_maskz_fixupimm_ps( __mmask16 k, __m512 a, __m512 b, __m512i c, int imm8);
VFIXUPIMMPS __m512 _mm512_fixupimm_round_ps( __m512 a, __m512 b, __m512i c, int imm8, int sae);
VFIXUPIMMPS __m512 _mm512_mask_fixupimm_round_ps(__m512 a, __mmask16 k, __m512 b, __m512i c, int imm8, int sae);
VFIXUPIMMPS __m512 _mm512_maskz_fixupimm_round_ps( __mmask16 k, __m512 a, __m512 b, __m512i c, int imm8, int sae);
VFIXUPIMMPS __m256 _mm256_fixupimm_ps( __m256 a, __m256 b, __m256i c, int imm8);
VFIXUPIMMPS __m256 _mm256_mask_fixupimm_ps(__m256 a, __mmask8 k, __m256 b, __m256i c, int imm8);
VFIXUPIMMPS __m256 _mm256_maskz_fixupimm_ps( __mmask8 k, __m256 a, __m256 b, __m256i c, int imm8);
VFIXUPIMMPS __m128 _mm_fixupimm_ps( __m128 a, __m128 b, __m128i c, int imm8);
VFIXUPIMMPS __m128 _mm_mask_fixupimm_ps(__m128 a, __mmask8 k, __m128 b, __m128i c, int imm8);
VFIXUPIMMPS __m128 _mm_maskz_fixupimm_ps( __mmask8 k, __m128 a, __m128 b, __m128i c, int imm8);
```

## SIMD 浮点 例外

Zero, Invalid.

## 其他例外

见表2-48"E2类例外条件"。
