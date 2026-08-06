---
summary: 包装双字
---

## 说明

复制来自源操作数(第二个操作数)的双字,并在所选位置按顺序操作数(第三个操作数)插入目标操作数(第一个操作数). 图4-16显示了256位VPSHUFD指令的操作和命令操作数的编码. 每个2位字段在操作数的顺序中选择一个128位字道内双字位置的内容,并复制到目标操作数中的目标元素. 例如,顺序的比特0和1操作数针对的是目标操作数低位和高位128位车道中的第一个双字元素,用于256位VPSHUFD. 顺序操作数的1:0位编码值(见图4-16中的字段编码)确定源操作数的哪个双字元素(从相应的128位车道)会被复制到目标操作数的双字0.

对于128位操作,只有低128位车道可以运行. 源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目标操作数是一个XMM登记册. 操作数的命令是8位即时命令. 注意,本指令允许源操作数中的双字复制到目标操作数中多个双字位置.

SRC X7                              X6        X5     X4  X3         X2  X1                 X0

DEST Y7                             Y6        Y5     Y4  Y3         Y2  Y1                 Y0

编码 00B - X4 ORDER 编码 00B - X0 字段在01B - X5 字段在01B - X1

```text
                                    10B - X6                        ORDER 10B - X2
```

ORDER                            11B - X7         7 65 4 3 21 0  Operand 11B - X3 Operand

图4-16. 256位 VPSHUFD 指令操作

源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目标操作数是一个XMM登记册. 操作数的命令是8位即时命令. 注意,本指令允许源操作数中的双字复制到目标操作数中多个双字位置.

在64位模式中,没有在VEX/EVEX中编码,使用REX.R允许此指令访问XMM8-XMM15.

128位遗产 SSE 版本 : 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册被清零的位数(MAXVL-1:128).

VEX.256 编码版本 : 源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册. 对应的ZMM注册被清零的位数(MAXVL-1:256). 目的地的比特(255-1:128)存储源操作数上16字节的洗牌结果,使用即时字节作为命令操作数.

EVEX 编码版本 : 源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位的内存位置,也可以是512/256/128位的向量,通过32位的内存位置广播. 目标操作数是一个按照写掩码更新的ZMM/YMM/XMM登记册.

目的地的每个128位车道存储源操作数各自车道的洗牌结果,使用即时字节作为命令操作数.

说明: EVEX.vvvv和VEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
PSHUFD (128-bit Legacy SSE Version)
DEST[31:0] := (SRC >> (ORDER[1:0] * 32))[31:0];
DEST[63:32] := (SRC >> (ORDER[3:2] * 32))[31:0];
DEST[95:64] := (SRC >> (ORDER[5:4] * 32))[31:0];
DEST[127:96] := (SRC >> (ORDER[7:6] * 32))[31:0];
DEST[MAXVL-1:128] (Unmodified)

VPSHUFD (VEX.128 Encoded Version)
DEST[31:0] := (SRC >> (ORDER[1:0] * 32))[31:0];
DEST[63:32] := (SRC >> (ORDER[3:2] * 32))[31:0];
DEST[95:64] := (SRC >> (ORDER[5:4] * 32))[31:0];
DEST[127:96] := (SRC >> (ORDER[7:6] * 32))[31:0];
DEST[MAXVL-1:128] := 0


VPSHUFD (VEX.256 Encoded Version)
DEST[31:0] := (SRC[127:0] >> (ORDER[1:0] * 32))[31:0];
DEST[63:32] := (SRC[127:0] >> (ORDER[3:2] * 32))[31:0];
DEST[95:64] := (SRC[127:0] >> (ORDER[5:4] * 32))[31:0];
DEST[127:96] := (SRC[127:0] >> (ORDER[7:6] * 32))[31:0];
DEST[159:128] := (SRC[255:128] >> (ORDER[1:0] * 32))[31:0];
DEST[191:160] := (SRC[255:128] >> (ORDER[3:2] * 32))[31:0];
DEST[223:192] := (SRC[255:128] >> (ORDER[5:4] * 32))[31:0];
DEST[255:224] := (SRC[255:128] >> (ORDER[7:6] * 32))[31:0];
DEST[MAXVL-1:256] := 0

VPSHUFD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF (EVEX.b = 1) AND (SRC *is memory*)

          THEN TMP_SRC[i+31:i] := SRC[31:0]

          ELSE TMP_SRC[i+31:i] := SRC[i+31:i]

     FI;

ENDFOR;

IF VL >= 128

     TMP_DEST[31:0] := (TMP_SRC[127:0] >> (ORDER[1:0] * 32))[31:0];

     TMP_DEST[63:32] := (TMP_SRC[127:0] >> (ORDER[3:2] * 32))[31:0];

     TMP_DEST[95:64] := (TMP_SRC[127:0] >> (ORDER[5:4] * 32))[31:0];

     TMP_DEST[127:96] := (TMP_SRC[127:0] >> (ORDER[7:6] * 32))[31:0];

FI;

IF VL >= 256

     TMP_DEST[159:128] := (TMP_SRC[255:128] >> (ORDER[1:0] * 32))[31:0];

     TMP_DEST[191:160] := (TMP_SRC[255:128] >> (ORDER[3:2] * 32))[31:0];

     TMP_DEST[223:192] := (TMP_SRC[255:128] >> (ORDER[5:4] * 32))[31:0];

     TMP_DEST[255:224] := (TMP_SRC[255:128] >> (ORDER[7:6] * 32))[31:0];

FI;

IF VL >= 512

     TMP_DEST[287:256] := (TMP_SRC[383:256] >> (ORDER[1:0] * 32))[31:0];

     TMP_DEST[319:288] := (TMP_SRC[383:256] >> (ORDER[3:2] * 32))[31:0];

     TMP_DEST[351:320] := (TMP_SRC[383:256] >> (ORDER[5:4] * 32))[31:0];

     TMP_DEST[383:352] := (TMP_SRC[383:256] >> (ORDER[7:6] * 32))[31:0];

     TMP_DEST[415:384] := (TMP_SRC[511:384] >> (ORDER[1:0] * 32))[31:0];

     TMP_DEST[447:416] := (TMP_SRC[511:384] >> (ORDER[3:2] * 32))[31:0];

     TMP_DEST[479:448] := (TMP_SRC[511:384] >> (ORDER[5:4] * 32))[31:0];

     TMP_DEST[511:480] := (TMP_SRC[511:384] >> (ORDER[7:6] * 32))[31:0];

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR


DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPSHUFD __m512i _mm512_shuffle_epi32(__m512i a, int n );
VPSHUFD __m512i _mm512_mask_shuffle_epi32(__m512i s, __mmask16 k, __m512i a, int n );
VPSHUFD __m512i _mm512_maskz_shuffle_epi32( __mmask16 k, __m512i a, int n );
VPSHUFD __m256i _mm256_mask_shuffle_epi32(__m256i s, __mmask8 k, __m256i a, int n );
VPSHUFD __m256i _mm256_maskz_shuffle_epi32( __mmask8 k, __m256i a, int n );
VPSHUFD __m128i _mm_mask_shuffle_epi32(__m128i s, __mmask8 k, __m128i a, int n );
VPSHUFD __m128i _mm_maskz_shuffle_epi32( __mmask8 k, __m128i a, int n );
(V)PSHUFD __m128i _mm_shuffle_epi32(__m128i a, int n) VPSHUFD __m256i _mm256_shuffle_epi32(__m256i a, const int n);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded discription,参见表2-52,"Type E4NF类例外条件".

Additionally:

```text
#UD                    If VEX.vvvv  1111B or EVEX.vvvv  1111B.
```
