---
summary: 比较 打包双精度浮点值
---

## 说明

执行 SIMD 比较 第二源操作数 和 第一源操作数 的 打包双精度浮点值 并返回比较结果 目标操作数 . 比较的上游操作数(即时字节)指定了两个源操作数中每对包装值的比较类型.

EVEX 编码版本 : 第一源操作数(第二个操作数)是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位向量从64位内存位置广播. 目标操作数(第一个操作数)是一个opmask寄存器. 比较结果在写mask k2下写入目的地操作. 每个比较结果都是单面罩比特1(比较真)或0(比较假).

VEX.256 编码版本 : 第一源操作数(第二个操作数)是一个YMM的登记册. 第二源操作数(第三代操作数)可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数(首个操作数)是一个YMM的登记册. 与写给目标操作数的结果进行了四次比较。 每次比较的结果都是所有1s(比较真)或所有0s(比较假)的四字罩.

128位遗产 SSE 版本 : 第一个来源和目标操作数(第一个操作数)是一个XMM登记册. 第二源操作数(第二个操作数)可以是XMM的寄存器或128位内存位置. 相应的ZMM目的地注册保持不变的位数(MAXVL-1:128). 与结果进行了两次比较

写入 目标操作数 的 127: 0 位元 。 每次比较的结果都是所有1s(比较真)或所有0s(比较假)的四字罩.

VEX.128 编码版本 : 第一源操作数(第二个操作数)是一个XMM登记册. 第二源操作数(第三代操作数)可以是XMM的寄存器,也可以是128位的内存位置. 目的地ZMM的位数(MAXVL-1:128)登记被清零. 进行了两次比较,结果写到目标操作数的127:0。

比较的上游操作数是8位直线:

* 对于使用 VEX 或 EVEX 前缀编码的指令,比特 4:0 定义要执行的比较类型

(见表3-8)。 直接的5至7位保留。

* 对于不使用 VEX 前缀的指令编码,比特 2:0 定义要进行比较的类型(参见

表3至表8的前8行。 3至7位的直线部分保留。

** CMPPD 和 CMPPS 指令的比较

| EQ_OQ (EQ) | 0H | 等值( 顺序, 无符号) | 虚假 | 虚假 | 没错 | 虚假 | No |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LT_OS (LT) | 1H | 低于(顺序,信号) | 虚假 | 没错 | 虚假 | 虚假 | 对 |
| LE_OS (LE) | 2H | 低于或等于(顺序、信号) | 虚假 | 没错 | 没错 | 虚假 | 对 |
| UNORD_Q (UNORD) | 3H | 无序( 无信号) | 虚假 | 虚假 | 虚假 | 没错 | No |
| NEQ_UQ (NEQ) | 4H | 不平等( 无命令、 无信号) | 没错 | 没错 | 虚假 | 没错 | No |
| NLT_US (NLT) | 5H | 不低于(无序,信号) | 没错 | 虚假 | 没错 | 没错 | 对 |
| NLE_US (NLE) | 6H | 不低于或等于(无序,信号) | 没错 | 虚假 | 虚假 | 没错 | 对 |
| ORD_Q (ORD) | 7H | 订购(无标志) | 没错 | 没错 | 没错 | 虚假 | No |
| EQ_UQ | 8H | 相等( 无命令、 无信号) | 虚假 | 虚假 | 没错 | 没错 | No |
| NGE_US (NGE) | 9H | 不大于或等于(无序,信号) | 虚假 | 没错 | 虚假 | 没错 | 对 |
| NGT_US (NGT) | AH | 不大于(无序,信号) | 虚假 | 没错 | 没错 | 没错 | 对 |
| FALSE_OQ(FALSE) | BH | 虚假( 有序、 无信号) | 虚假 | 虚假 | 虚假 | 虚假 | No |
| NEQ_OQ | CH | 非对等( 顺序, 无符号) | 没错 | 没错 | 虚假 | 虚假 | No |
| GE_OS (GE) | DH | 大于或等于(顺序、信号) | 没错 | 虚假 | 没错 | 虚假 | 对 |
| GT_OS (GT) | EH | 大于(顺序,信号) | 没错 | 虚假 | 虚假 | 虚假 | 对 |
| TRUE_UQ(TRUE) | FH | 真( 无命令, 无信号) | 没错 | 没错 | 没错 | 没错 | No |
| EQ_OS | 10H | 相等( 顺序, 信号) | 虚假 | 虚假 | 没错 | 虚假 | 对 |
| LT_OQ | 11H | 低于(订购、无信号) | 虚假 | 没错 | 虚假 | 虚假 | No |
| LE_OQ | 12H | 低于或等于(顺序、不信号) | 虚假 | 没错 | 没错 | 虚假 | No |
| UNORD_S | 13H | 无序( 信号) | 虚假 | 虚假 | 虚假 | 没错 | 对 |
| NEQ_US | 14H | 不平等( 无命令, 信号) | 没错 | 没错 | 虚假 | 没错 | 对 |
| NLT_UQ | 15H | 不下(无序,无信号) | 没错 | 虚假 | 没错 | 没错 | No |
| NLE_UQ | 16H | 不低于或等于(无序、不小) | 没错 | 虚假 | 虚假 | 没错 | No |
| ORD_S | 17H | 订购(信号) | 没错 | 没错 | 没错 | 虚假 | 对 |
| EQ_US | 18H | 相等( 无命令, 信号) | 虚假 | 虚假 | 没错 | 没错 | 对 |

** CMPPD 和 CMPPS 指令的比对(Contd.)**

| EQ_OQ (EQ) | 0H | 等值( 顺序, 无符号) | 虚假 | 虚假 | 没错 | 虚假 | No |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LT_OS (LT) | 1H | 低于(顺序,信号) | 虚假 | 没错 | 虚假 | 虚假 | 对 |
| LE_OS (LE) | 2H | 低于或等于(顺序、信号) | 虚假 | 没错 | 没错 | 虚假 | 对 |
| UNORD_Q (UNORD) | 3H | 无序( 无信号) | 虚假 | 虚假 | 虚假 | 没错 | No |
| NEQ_UQ (NEQ) | 4H | 不平等( 无命令、 无信号) | 没错 | 没错 | 虚假 | 没错 | No |
| NLT_US (NLT) | 5H | 不低于(无序,信号) | 没错 | 虚假 | 没错 | 没错 | 对 |
| NLE_US (NLE) | 6H | 不低于或等于(无序,信号) | 没错 | 虚假 | 虚假 | 没错 | 对 |
| ORD_Q (ORD) | 7H | 订购(无标志) | 没错 | 没错 | 没错 | 虚假 | No |
| EQ_UQ | 8H | 相等( 无命令、 无信号) | 虚假 | 虚假 | 没错 | 没错 | No |
| NGE_US (NGE) | 9H | 不大于或等于(无序,信号) | 虚假 | 没错 | 虚假 | 没错 | 对 |
| NGT_US (NGT) | AH | 不大于(无序,信号) | 虚假 | 没错 | 没错 | 没错 | 对 |
| FALSE_OQ(FALSE) | BH | 虚假( 有序、 无信号) | 虚假 | 虚假 | 虚假 | 虚假 | No |
| NEQ_OQ | CH | 非对等( 顺序, 无符号) | 没错 | 没错 | 虚假 | 虚假 | No |
| GE_OS (GE) | DH | 大于或等于(顺序、信号) | 没错 | 虚假 | 没错 | 虚假 | 对 |
| GT_OS (GT) | EH | 大于(顺序,信号) | 没错 | 虚假 | 虚假 | 虚假 | 对 |
| TRUE_UQ(TRUE) | FH | 真( 无命令, 无信号) | 没错 | 没错 | 没错 | 没错 | No |
| EQ_OS | 10H | 相等( 顺序, 信号) | 虚假 | 虚假 | 没错 | 虚假 | 对 |
| LT_OQ | 11H | 低于(订购、无信号) | 虚假 | 没错 | 虚假 | 虚假 | No |
| LE_OQ | 12H | 低于或等于(顺序、不信号) | 虚假 | 没错 | 没错 | 虚假 | No |
| UNORD_S | 13H | 无序( 信号) | 虚假 | 虚假 | 虚假 | 没错 | 对 |
| NEQ_US | 14H | 不平等( 无命令, 信号) | 没错 | 没错 | 虚假 | 没错 | 对 |
| NLT_UQ | 15H | 不下(无序,无信号) | 没错 | 虚假 | 没错 | 没错 | No |
| NLE_UQ | 16H | 不低于或等于(无序、不小) | 没错 | 虚假 | 虚假 | 没错 | No |
| ORD_S | 17H | 订购(信号) | 没错 | 没错 | 没错 | 虚假 | 对 |
| EQ_US | 18H | 相等( 无命令, 信号) | 虚假 | 虚假 | 没错 | 没错 | 对 |

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
    DEFAULT: Reserved;
ESAC;

VCMPPD (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k2[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    CMP := SRC1[i+63:i] OP5 SRC2[63:0]

                  ELSE

                    CMP := SRC1[i+63:i] OP5 SRC2[i+63:i]

             FI;

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                    ; zeroing-masking only

FI;


ENDFOR
DEST[MAX_KL-1:KL] := 0

VCMPPD (VEX.256 Encoded Version)
CMP0 := SRC1[63:0] OP5 SRC2[63:0];
CMP1 := SRC1[127:64] OP5 SRC2[127:64];
CMP2 := SRC1[191:128] OP5 SRC2[191:128];
CMP3 := SRC1[255:192] OP5 SRC2[255:192];
IF CMP0 = TRUE

    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[63:0] := 0000000000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0000000000000000H; FI;
IF CMP2 = TRUE
    THEN DEST[191:128] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[191:128] := 0000000000000000H; FI;
IF CMP3 = TRUE
    THEN DEST[255:192] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[255:192] := 0000000000000000H; FI;
DEST[MAXVL-1:256] := 0

VCMPPD (VEX.128 Encoded Version)
CMP0 := SRC1[63:0] OP5 SRC2[63:0];
CMP1 := SRC1[127:64] OP5 SRC2[127:64];
IF CMP0 = TRUE

    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[63:0] := 0000000000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0000000000000000H; FI;
DEST[MAXVL-1:128] := 0

CMPPD (128-bit Legacy SSE Version)
CMP0 := SRC1[63:0] OP3 SRC2[63:0];
CMP1 := SRC1[127:64] OP3 SRC2[127:64];
IF CMP0 = TRUE

    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[63:0] := 0000000000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0000000000000000H; FI;
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VCMPPD __mmask8 _mm512_cmp_pd_mask( __m512d a, __m512d b, int imm);
VCMPPD __mmask8 _mm512_cmp_round_pd_mask( __m512d a, __m512d b, int imm, int sae);
VCMPPD __mmask8 _mm512_mask_cmp_pd_mask( __mmask8 k1, __m512d a, __m512d b, int imm);
VCMPPD __mmask8 _mm512_mask_cmp_round_pd_mask( __mmask8 k1, __m512d a, __m512d b, int imm, int sae);
VCMPPD __mmask8 _mm256_cmp_pd_mask( __m256d a, __m256d b, int imm);
VCMPPD __mmask8 _mm256_mask_cmp_pd_mask( __mmask8 k1, __m256d a, __m256d b, int imm);
VCMPPD __mmask8 _mm_cmp_pd_mask( __m128d a, __m128d b, int imm);
VCMPPD __mmask8 _mm_mask_cmp_pd_mask( __mmask8 k1, __m128d a, __m128d b, int imm);
VCMPPD __m256 _mm256_cmp_pd(__m256d a, __m256d b, int imm) (V)CMPPD __m128 _mm_cmp_pd(__m128d a, __m128d b, int imm);
```

## SIMD 浮点 例外

如果 SNaN 操作数 无效,如果 QNaN 和表 3-8 所列上游,则无效。

## 其他例外

VEX-encoded指令,参见表2-19,"第2类例外条件". EVEX-encoded指令,参见表2-48,"第E2类例外条件".
