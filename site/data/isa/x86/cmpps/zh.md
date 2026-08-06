---
summary: 比较 打包单精度浮点值
---

## 说明

执行 SIMD 比较 第二源操作数 和 第一源操作数 的 打包单精度浮点值 并返回比较结果 目标操作数 . 比较的上游操作数(即时字节)规定了每对包装值的比较类型。

EVEX 编码版本 : 第一源操作数(第二个操作数)是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位向量从32位内存位置广播. 目标操作数(第一个操作数)是一个opmask寄存器. 比较结果在写mask k2下写入目的地操作. 每个比较结果都是单面罩比特1(比较真)或0(比较假).

VEX.256 编码版本 : 第一源操作数(第二个操作数)是一个YMM的登记册. 第二源操作数(第三代操作数)可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数(首个操作数)是一个YMM的登记册. 进行了8次比较,结果写给目标操作数。 每次比较的结果都是所有1s(比较真)或所有0s(比较假)的双字面具.

128位遗产 SSE 版本 : 第一个来源和目标操作数(第一个操作数)是一个XMM登记册. 第二源操作数(第二个操作数)可以是XMM的寄存器或128位内存位置. 相应的ZMM目的地注册保持不变的位数(MAXVL-1:128). 进行了四次比较,结果写为目标操作数中的127:0。 每次比较的结果都是所有1s(比较真)或所有0s(比较假)的双字面具.

VEX.128 编码版本 : 第一源操作数(第二个操作数)是一个XMM登记册. 第二源操作数(第三代操作数)可以是XMM的寄存器,也可以是128位的内存位置. 目的地ZMM的位数(MAXVL-1:128)登记被清零. 进行了四次比较,结果写为目标操作数中的127:0。

比较的上游操作数是8位直线:

* 对于使用 VEX 前缀和 EVEX 前缀编码的指令,比特 4:0 定义比较类型为

(见表3-8)。 直接的5至7位保留。

* 对于不使用 VEX 前缀的指令编码,比特 2:0 定义要进行比较的类型(参见

表3至表8的前8行。 3至7位的直线部分保留。

当比较的两个源操作数中至少有一个是NaN时,无序关系是真实的;当两个源操作数都不是NaN时,有序关系是真实的.

后续使用掩码的计算指令得出目标操作数作为输入的操作数不会产生例外,因为所有0s的掩码对应于+0.0的浮点值,所有1s的掩码对应于QNaN.

注意,"CPUID.01H:ECX.AVX[28] = 0"的处理器不执行"比大","比大","比大","比大","比大"和"比大或平等"的关系上游. 这些比较可以通过使用反向关系(即使用"不小于或相等"来进行"大于"的比较)或使用软件仿真来进行. 在使用软件仿真时,程序必须互换操作数(在必要时进行复制登记以保护现在将出现在目的地的数据),然后使用不同的上游来进行比较.

编译器和装配器除了3-操作数 CMPPS指令外,还可以执行以下2-操作数伪op,用于"CPUID.01H:ECX.AVX[28] = 0"的处理器. 见表3-11。 编译器应将保留的imm8值视为非法语法.

数字 :                         表 3-11 (中文(简体) ). Pseudo-Op 和 CMPPS 执行

Pseudo-Op CMPPS 执行

CMPEQPS xmm1,xmm2 CMPPS xmm1,xmm2,0

CMPLTPS xmm1,xmm2 CMPPS xmm1,xmm2,1号机车

CMPLEPS xmm1, xmm2 CMPPS xmm1, xmm2, 2 (中文(简体) ).

CMPUNORDPS xmm1, xmm2 CMPPS xmm1, xmm2, 3 (中文(简体) ).

CMPNEQPS xmm1, xmm2 CMPPS xmm1, xmm2, 4 (中文(简体) ).

CMPNLTPS xmm1, xmm2 CMPPS xmm1, xmm2, 5

CMPNLEPS xmm1, xmm2 CMPPS xmm1, xmm2, 6 (中文(简体) ).

CMPORDPS xmm1, xmm2 CMPPS xmm1, xmm2, 7 (中文(简体) ).

相对于处理器不执行的关系,需要在软件中进行不止一个指令的仿真,因此不应作为伪操作执行. (对于这些,程序员应当将对应关系小于关系的操作数反转,并使用移动指令,以确保面具移动到正确的目的地寄存器,源操作数完好无损. )

具有"CPUID.01H:ECX.AVX[28] = 1"的处理器执行表3-12中显示的32个上游的完整补充,不再需要软件仿真. 编译器和装配器除了执行4-操作数 VCMPPS指令外,还可以执行以下三operand伪op. 参见表3-12,Reg1和reg2的注法代表XMM登记册或YMM登记册. 编译器应将保留的imm8值视为非法语法. 反之,内在可以将伪ops映射到预定义的常数上,支持更简单的内在界面. 编译器和组装器可以通过扩展表3-12列出的语法,以类似的方式执行EVEX编码的VCMPPS指令的3-操作数伪op.

:

** Pseudo-Op和VCMPPS执行**

| 修道会 | CMPPS 执行 |
| --- | --- |
| VCMPEQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0 |
| VCMPLTPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1 |
| VCMPLEPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 2 |
| VCMPUNORDPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 3 |
| VCMPNEQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 4 |
| VCMPNLTPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 5 |
| VCMPNLEPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 6 |
| VCMPORDPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 7 |
| VCMPEQ_UQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 8 |
| VCMPNGEPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 9 |
| VCMPNGTPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0AH |
| VCMPFALSEPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0BH |
| VCMPNEQ_OQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0CH |
| VCMPGEPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0DH |
| VCMPGTPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0EH |
| VCMPTRUEPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0FH |
| VCMPEQ_OSPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 10H |
| VCMPLT_OQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 11H |
| VCMPLE_OQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 12H |
| VCMPUNORD_SPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 13H |
| VCMPNEQ_USPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 14H |
| VCMPNLT_UQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 15H |
| VCMPNLE_UQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 16H |
| VCMPORD_SPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 17H |
| VCMPEQ_USPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 18H |
| VCMPNGE_UQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 19H |
| VCMPNGT_UQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1AH |
| VCMPFALSE_OSPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1BH |
| VCMPNEQ_OSPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1CH |
| VCMPGE_OQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1DH |
| VCMPGT_OQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1EH |
| VCMPTRUE_USPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1FH |
| CMPPS - Compare 打包单精度浮点值 维基月球在线解说- 维基月球在线解说- 维基月球在线解说- 维基月球在线解说- 维基月球在线解说- 维基月球在线解说- 维基月球在线解说- 维基月球在线解说- 维基月球在线解说- 维基月球在线解说- 维基月球在线解说- 维基月球 |  |

## 行动

```text
CASE (COMPARISON PREDICATE) OF
    0: OP3 := EQ_OQ; OP5 := EQ_OQ;
    1: OP3 := LT_OS; OP5 := LT_OS;
    2: OP3 := LE_OS; OP5 := LE_OS;
    3: OP3 := UNORD_Q; OP5 := UNORD_Q;
    4: OP3 := NEQ_UQ; OP5 := NEQ_UQ;
    5: OP3 := NLT_US; OP5 := NLT_US;
    6: OP3 := NLE_US; OP5 := NLE_US;
    7: OP3 := ORD_Q; OP5 := ORD_Q;
    8: OP5 := EQ_UQ;
    9: OP5 := NGE_US;
    10: OP5 := NGT_US;
    11: OP5 := FALSE_OQ;
    12: OP5 := NEQ_OQ;
    13: OP5 := GE_OS;
    14: OP5 := GT_OS;
    15: OP5 := TRUE_UQ;
    16: OP5 := EQ_OS;
    17: OP5 := LT_OQ;
    18: OP5 := LE_OQ;
    19: OP5 := UNORD_S;
    20: OP5 := NEQ_US;
    21: OP5 := NLT_UQ;
    22: OP5 := NLE_UQ;
    23: OP5 := ORD_S;
    24: OP5 := EQ_US;
    25: OP5 := NGE_UQ;
    26: OP5 := NGT_UQ;
    27: OP5 := FALSE_OS;
    28: OP5 := NEQ_OS;
    29: OP5 := GE_OQ;
    30: OP5 := GT_OQ;
    31: OP5 := TRUE_US;
    DEFAULT: Reserved

ESAC;

VCMPPS (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k2[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    CMP := SRC1[i+31:i] OP5 SRC2[31:0]

                  ELSE

                    CMP := SRC1[i+31:i] OP5 SRC2[i+31:i]

             FI;

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                    ; zeroing-masking onlyFI;

FI;


ENDFOR
DEST[MAX_KL-1:KL] := 0

VCMPPS (VEX.256 Encoded Version)
CMP0 := SRC1[31:0] OP5 SRC2[31:0];
CMP1 := SRC1[63:32] OP5 SRC2[63:32];
CMP2 := SRC1[95:64] OP5 SRC2[95:64];
CMP3 := SRC1[127:96] OP5 SRC2[127:96];
CMP4 := SRC1[159:128] OP5 SRC2[159:128];
CMP5 := SRC1[191:160] OP5 SRC2[191:160];
CMP6 := SRC1[223:192] OP5 SRC2[223:192];
CMP7 := SRC1[255:224] OP5 SRC2[255:224];
IF CMP0 = TRUE

    THEN DEST[31:0] :=FFFFFFFFH;
    ELSE DEST[31:0] := 000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[63:32] := FFFFFFFFH;
    ELSE DEST[63:32] :=000000000H; FI;
IF CMP2 = TRUE
    THEN DEST[95:64] := FFFFFFFFH;
    ELSE DEST[95:64] := 000000000H; FI;
IF CMP3 = TRUE
    THEN DEST[127:96] := FFFFFFFFH;
    ELSE DEST[127:96] := 000000000H; FI;
IF CMP4 = TRUE
    THEN DEST[159:128] := FFFFFFFFH;
    ELSE DEST[159:128] := 000000000H; FI;
IF CMP5 = TRUE
    THEN DEST[191:160] := FFFFFFFFH;
    ELSE DEST[191:160] := 000000000H; FI;
IF CMP6 = TRUE
    THEN DEST[223:192] := FFFFFFFFH;
    ELSE DEST[223:192] :=000000000H; FI;
IF CMP7 = TRUE
    THEN DEST[255:224] := FFFFFFFFH;
    ELSE DEST[255:224] := 000000000H; FI;
DEST[MAXVL-1:256] := 0

VCMPPS (VEX.128 Encoded Version)
CMP0 := SRC1[31:0] OP5 SRC2[31:0];
CMP1 := SRC1[63:32] OP5 SRC2[63:32];
CMP2 := SRC1[95:64] OP5 SRC2[95:64];
CMP3 := SRC1[127:96] OP5 SRC2[127:96];
IF CMP0 = TRUE

    THEN DEST[31:0] :=FFFFFFFFH;
    ELSE DEST[31:0] := 000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[63:32] := FFFFFFFFH;
    ELSE DEST[63:32] := 000000000H; FI;
IF CMP2 = TRUE
    THEN DEST[95:64] := FFFFFFFFH;
    ELSE DEST[95:64] := 000000000H; FI;
IF CMP3 = TRUE
    THEN DEST[127:96] := FFFFFFFFH;


    ELSE DEST[127:96] :=000000000H; FI;
DEST[MAXVL-1:128] := 0

CMPPS (128-bit Legacy SSE Version)
CMP0 := SRC1[31:0] OP3 SRC2[31:0];
CMP1 := SRC1[63:32] OP3 SRC2[63:32];
CMP2 := SRC1[95:64] OP3 SRC2[95:64];
CMP3 := SRC1[127:96] OP3 SRC2[127:96];
IF CMP0 = TRUE

    THEN DEST[31:0] :=FFFFFFFFH;
    ELSE DEST[31:0] := 000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[63:32] := FFFFFFFFH;
    ELSE DEST[63:32] := 000000000H; FI;
IF CMP2 = TRUE
    THEN DEST[95:64] := FFFFFFFFH;
    ELSE DEST[95:64] := 000000000H; FI;
IF CMP3 = TRUE
    THEN DEST[127:96] := FFFFFFFFH;
    ELSE DEST[127:96] :=000000000H; FI;
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VCMPPS __mmask16 _mm512_cmp_ps_mask( __m512 a, __m512 b, int imm);
VCMPPS __mmask16 _mm512_cmp_round_ps_mask( __m512 a, __m512 b, int imm, int sae);
VCMPPS __mmask16 _mm512_mask_cmp_ps_mask( __mmask16 k1, __m512 a, __m512 b, int imm);
VCMPPS __mmask16 _mm512_mask_cmp_round_ps_mask( __mmask16 k1, __m512 a, __m512 b, int imm, int sae);
VCMPPS __mmask8 _mm256_cmp_ps_mask( __m256 a, __m256 b, int imm);
VCMPPS __mmask8 _mm256_mask_cmp_ps_mask( __mmask8 k1, __m256 a, __m256 b, int imm);
VCMPPS __mmask8 _mm_cmp_ps_mask( __m128 a, __m128 b, int imm);
VCMPPS __mmask8 _mm_mask_cmp_ps_mask( __mmask8 k1, __m128 a, __m128 b, int imm);
VCMPPS __m256 _mm256_cmp_ps(__m256 a, __m256 b, int imm) CMPPS __m128 _mm_cmp_ps(__m128 a, __m128 b, int imm);
```

## SIMD 浮点 例外

如果 SNaN 操作数 无效,如果 QNaN 和表 3-8 所列上游,则无效。

## 其他例外

VEX-encoded指令,参见表2-19"第2类例外条件".

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".
