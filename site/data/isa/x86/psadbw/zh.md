---
summary: 绝对差异的计算总和
---

## 说明

计算来自源操作数(第二个操作数)和目标操作数(第一个操作数)的8个无符号字节整数的差额的绝对值. 然后将这8种差异进行总和,生成一个无符号的单词整数结果,储存在目标操作数中. 图4-14显示了PSADBW指令在使用64位操作数时的操作.

在64位操作数上运行时,单词整数结果存储在目标操作数的低词中,目标操作数中剩余的字节被清除到所有0s.

在128位的操作数上运行时,计算出两个打包的结果. 在这里,源头的8个低序字节和目标操作数运行,生成一个存储在目标操作数的低词的单词结果,8个高序字节运行,生成一个存储在目标操作数的比特64到79的单词结果. 目标操作数的剩余字节已清除.

对于256位版本,第三组8位差异被归纳为以位数[143:128]生成一个未签名的词,第四组8位差异被汇总为以位数[207:192]生成一个未签名的词. 目的地的剩余单词设定为0.

对于512位版本,第五组结果被存储在目的地的位数[271:256]. 第六组的产物以比特存储[335:320]. 第七组和第八组的成绩分别以比特[399:384]和比特[463:447]存储. 目的地剩下的位数设定为0.

在64位模式中,不由VEX/EVEX前缀编码,使用REX前缀形式为REX.R,允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE 版本 : 源操作数可以是MMX技术寄存器或64位内存位置. 目标操作数是一个MMX技术登记册.

128位遗产 SSE 版本 : 第一源操作数和目的地登记册是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 相应的ZMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128和EVEX.128编码版本: 第一源操作数和目的地登记册是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 对应的ZMM注册被清零的位数(MAXVL-1:128).

VEX.256和EVEX.256编码版本: 第一源操作数和目的地登记册是YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 对应的ZMM注册被清零的位数(MAXVL-1:256).

EVEX.512 编码版本 : 第一源操作数和目的地登记册是ZMM登记册. 第二源操作数是一个ZMM的寄存器或512位内存位置.

SRC X7                                       X6   X5   X4  X3   X2  X1  X0

DEST Y7                                      Y6   Y5   Y4  Y3   Y2  Y1  Y0

TEMP ABS(X7:Y7) ABS(X6:Y6) ABS(X5:Y5) ABS(X4:Y4) ABS(X3:Y3) ABS(X2:Y2) ABS(X1:Y1) ABS(X5:Y5) ABS(X4:Y4) ABS(X3:Y3) ABS(X2:Y2) ABS(X1:Y1) ABS(X0) ABS(X6) ABS(X1:Y1:Y1) ABS(X0.

DEST 00H                                     00H  00H  00H 00H  00H SUM(TEMP7...TEMP0)

图4-14. PSADBW 指令操作 使用 64 位 操作数

## 行动

```text
VPSADBW (EVEX Encoded Versions)
VL = 128, 256, 512
TEMP0 := ABS(SRC1[7:0] - SRC2[7:0])
(* Repeat operation for bytes 1 through 15 *)
TEMP15 := ABS(SRC1[127:120] - SRC2[127:120])
DEST[15:0] := SUM(TEMP0:TEMP7)
DEST[63:16] := 000000000000H
DEST[79:64] := SUM(TEMP8:TEMP15)
DEST[127:80] := 00000000000H

IF VL >= 256
    (* Repeat operation for bytes 16 through 31*)
    TEMP31 := ABS(SRC1[255:248] - SRC2[255:248])
    DEST[143:128] := SUM(TEMP16:TEMP23)
    DEST[191:144] := 000000000000H
    DEST[207:192] := SUM(TEMP24:TEMP31)
    DEST[223:208] := 00000000000H

FI;
IF VL >= 512
(* Repeat operation for bytes 32 through 63*)

    TEMP63 := ABS(SRC1[511:504] - SRC2[511:504])
    DEST[271:256] := SUM(TEMP0:TEMP7)
    DEST[319:272] := 000000000000H
    DEST[335:320] := SUM(TEMP8:TEMP15)
    DEST[383:336] := 00000000000H
    DEST[399:384] := SUM(TEMP16:TEMP23)
    DEST[447:400] := 000000000000H
    DEST[463:448] := SUM(TEMP24:TEMP31)
    DEST[511:464] := 00000000000H
FI;
DEST[MAXVL-1:VL] := 0

VPSADBW (VEX.256 Encoded Version)
TEMP0 := ABS(SRC1[7:0] - SRC2[7:0])
(* Repeat operation for bytes 2 through 30*)
TEMP31 := ABS(SRC1[255:248] - SRC2[255:248])
DEST[15:0] := SUM(TEMP0:TEMP7)
DEST[63:16] := 000000000000H
DEST[79:64] := SUM(TEMP8:TEMP15)
DEST[127:80] := 00000000000H
DEST[143:128] := SUM(TEMP16:TEMP23)
DEST[191:144] := 000000000000H
DEST[207:192] := SUM(TEMP24:TEMP31)
DEST[223:208] := 00000000000H
DEST[MAXVL-1:256] := 0


VPSADBW (VEX.128 Encoded Version)
TEMP0 := ABS(SRC1[7:0] - SRC2[7:0])
(* Repeat operation for bytes 2 through 14 *)
TEMP15 := ABS(SRC1[127:120] - SRC2[127:120])
DEST[15:0] := SUM(TEMP0:TEMP7)
DEST[63:16] := 000000000000H
DEST[79:64] := SUM(TEMP8:TEMP15)
DEST[127:80] := 00000000000H
DEST[MAXVL-1:128] := 0

PSADBW (128-bit Legacy SSE Version)
TEMP0 := ABS(DEST[7:0] - SRC[7:0])
(* Repeat operation for bytes 2 through 14 *)
TEMP15 := ABS(DEST[127:120] - SRC[127:120])
DEST[15:0] := SUM(TEMP0:TEMP7)
DEST[63:16] := 000000000000H
DEST[79:64] := SUM(TEMP8:TEMP15)
DEST[127:80] := 00000000000
DEST[MAXVL-1:128] (Unmodified)

PSADBW (64-bit Operand)
TEMP0 := ABS(DEST[7:0] - SRC[7:0])
(* Repeat operation for bytes 2 through 6 *)
TEMP7 := ABS(DEST[63:56] - SRC[63:56])
DEST[15:0] := SUM(TEMP0:TEMP7)
DEST[63:16] := 000000000000H
```

## Intel C/C++ 内在编译器

```c
VPSADBW __m512i _mm512_sad_epu8( __m512i a, __m512i b) PSADBW __m64 _mm_sad_pu8(__m64 a,__m64 b) (V)PSADBW __m128i _mm_sad_epu8(__m128i a, __m128i b) VPSADBW __m256i _mm256_sad_epu8( __m256i a, __m256i b);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-编码指令,参见表2-52中的例外类型E4NF.nb,"Type E4NF类例外条件".
