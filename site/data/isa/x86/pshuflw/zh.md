---
summary: 包装的低词
---

## 说明

复制字来自源操作数128位车道的低四字,并在用立即数操作数选择的字位位置(相应车道)的目标操作数低四字中插入. 256位操作与256位的VPSHUFD指令所使用的车内操作相似,图4-16对此进行了说明. 对于128位操作,只有低128位车道可以运行. 立即数操作数中的每个2位字段在目标操作数的低四字形中选择一个单词位置的内容. 立即数操作数字段的二进制编码从源操作数的低四字中选择单词(0, 1, 2 或 3),以复制到目标操作数. 源操作数的高四字被复制到目标操作数的高四字,每个128位车道.

注意,本指令允许源操作数低四字中的单词复制到目标操作数低四字中的多个单词位置.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

128位遗产 SSE 版本 : 目标操作数是一个XMM登记册. 源操作数可以是XMM的寄存器,也可以是128位的内存位置. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 目标操作数是一个XMM登记册. 源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目的地YMM的位数(MAXVL-1:128)登记被清零.

VEX.256 编码版本 : 目标操作数是一个YMM登记册. 源操作数可以是YMM的寄存器,也可以是256位的内存位置.

EVEX 编码版本 : 目标操作数是一个ZMM/YMM/XMM登记册. 源操作数可以是ZMM/YMM/XMM登记器,512/256/128位内存位置. 目的地根据写掩码更新.

说明: 在VEX编码版本中,VEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
PSHUFLW (128-bit Legacy SSE Version)
DEST[15:0] := (SRC >> (imm[1:0] *16))[15:0]
DEST[31:16] := (SRC >> (imm[3:2] * 16))[15:0]
DEST[47:32] := (SRC >> (imm[5:4] * 16))[15:0]
DEST[63:48] := (SRC >> (imm[7:6] * 16))[15:0]
DEST[127:64] := SRC[127:64]
DEST[MAXVL-1:128] (Unmodified)

VPSHUFLW (VEX.128 Encoded Version)
DEST[15:0] := (SRC1 >> (imm[1:0] *16))[15:0]
DEST[31:16] := (SRC1 >> (imm[3:2] * 16))[15:0]
DEST[47:32] := (SRC1 >> (imm[5:4] * 16))[15:0]
DEST[63:48] := (SRC1 >> (imm[7:6] * 16))[15:0]
DEST[127:64] := SRC[127:64]
DEST[MAXVL-1:128] := 0

VPSHUFLW (VEX.256 Encoded Version)
DEST[15:0] := (SRC1 >> (imm[1:0] *16))[15:0]
DEST[31:16] := (SRC1 >> (imm[3:2] * 16))[15:0]
DEST[47:32] := (SRC1 >> (imm[5:4] * 16))[15:0]
DEST[63:48] := (SRC1 >> (imm[7:6] * 16))[15:0]
DEST[127:64] := SRC1[127:64]
DEST[143:128] := (SRC1 >> (imm[1:0] *16))[143:128]
DEST[159:144] := (SRC1 >> (imm[3:2] * 16))[143:128]
DEST[175:160] := (SRC1 >> (imm[5:4] * 16))[143:128]
DEST[191:176] := (SRC1 >> (imm[7:6] * 16))[143:128]
DEST[255:192] := SRC1[255:192]
DEST[MAXVL-1:256] := 0

VPSHUFLW (EVEX.U1.512 Encoded Version)
(KL, VL) = (8, 128), (16, 256), (32, 512)
IF VL >= 128

    TMP_DEST[15:0] := (SRC1 >> (imm[1:0] *16))[15:0]
    TMP_DEST[31:16] := (SRC1 >> (imm[3:2] * 16))[15:0]
    TMP_DEST[47:32] := (SRC1 >> (imm[5:4] * 16))[15:0]
    TMP_DEST[63:48] := (SRC1 >> (imm[7:6] * 16))[15:0]
    TMP_DEST[127:64] := SRC1[127:64]
FI;
IF VL >= 256
    TMP_DEST[143:128] := (SRC1 >> (imm[1:0] *16))[143:128]
    TMP_DEST[159:144] := (SRC1 >> (imm[3:2] * 16))[143:128]
    TMP_DEST[175:160] := (SRC1 >> (imm[5:4] * 16))[143:128]
    TMP_DEST[191:176] := (SRC1 >> (imm[7:6] * 16))[143:128]
    TMP_DEST[255:192] := SRC1[255:192]
FI;
IF VL >= 512
    TMP_DEST[271:256] := (SRC1 >> (imm[1:0] *16))[271:256]
    TMP_DEST[287:272] := (SRC1 >> (imm[3:2] * 16))[271:256]
    TMP_DEST[303:288] := (SRC1 >> (imm[5:4] * 16))[271:256]
    TMP_DEST[319:304] := (SRC1 >> (imm[7:6] * 16))[271:256]
    TMP_DEST[383:320] := SRC1[383:320]


    TMP_DEST[399:384] := (SRC1 >> (imm[1:0] *16))[399:384]
    TMP_DEST[415:400] := (SRC1 >> (imm[3:2] * 16))[399:384]
    TMP_DEST[431:416] := (SRC1 >> (imm[5:4] * 16))[399:384]
    TMP_DEST[447:432] := (SRC1 >> (imm[7:6] * 16))[399:384]
    TMP_DEST[511:448] := SRC1[511:448]
FI;

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := TMP_DEST[i+15:i];

     ELSE

             IF *merging-masking*            ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*      ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPSHUFLW __m512i _mm512_shufflelo_epi16(__m512i a, int n);
VPSHUFLW __m512i _mm512_mask_shufflelo_epi16(__m512i s, __mmask16 k, __m512i a, int n );
VPSHUFLW __m512i _mm512_maskz_shufflelo_epi16( __mmask16 k, __m512i a, int n );
VPSHUFLW __m256i _mm256_mask_shufflelo_epi16(__m256i s, __mmask8 k, __m256i a, int n );
VPSHUFLW __m256i _mm256_maskz_shufflelo_epi16( __mmask8 k, __m256i a, int n );
VPSHUFLW __m128i _mm_mask_shufflelo_epi16(__m128i s, __mmask8 k, __m128i a, int n );
VPSHUFLW __m128i _mm_maskz_shufflelo_epi16( __mmask8 k, __m128i a, int n );
(V)PSHUFLW:__m128i _mm_shufflelo_epi16(__m128i a, int n) VPSHUFLW:__m256i _mm256_shufflelo_epi16(__m256i a, const int n);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-编码指令,参见表2-52中的例外类型E4NF.nb,"Type E4NF类例外条件".

Additionally:

```text
#UD                    If VEX.vvvv != 1111B, or EVEX.vvvv != 1111B.
```
