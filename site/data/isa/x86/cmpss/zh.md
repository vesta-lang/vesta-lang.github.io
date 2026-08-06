---
summary: 比较 标量 单精度浮点 值
---

## 说明

比较 第二源操作数 和 第一源操作数 中低的 单精度浮点 值,并返回比较 目标操作数 的结果. 比较的上游操作数(立即数操作数)指定了进行比较的类型.

128位遗产 SSE 版本 : 第一个来源和目标操作数(第一个操作数)是一个XMM登记册. 第二源操作数(第二个操作数)可以是XMM的寄存器或32位内存位置. 对应的YMM目的地注册保持不变的位数(MAXVL-1:32). 比较结果是一个所有1s(比较真)或所有0s(比较假)的双字面具.

VEX.128 编码版本 : 第一源操作数(第二个操作数)是一个XMM登记册. 第二源操作数(第三代操作数)可以是XMM寄存器或32位内存位置. 结果存储在目标操作数的低位32位;比特127:32的目标操作数从第一源操作数复制. 目的地ZMM的位数(MAXVL-1:128)登记被清零. 比较结果是一个所有1s(比较真)或所有0s(比较假)的双字面具.

EVEX 编码版本 : 第一源操作数(第二个操作数)是一个XMM登记册. 第二源操作数可以是XMM寄存器,也可以是32位的内存位置. 目标操作数(第一个操作数)是一个opmask寄存器. 比较结果为单面罩位1(比较真)或0(比较假),按照写掩码 k2从LSB开始写到目的地. 目的地注册簿的位数(MAQQKL-1:128)被清除.

比较的上游操作数是8位直线:

* 对于使用 VEX 前缀编码的指令,比特 4:0 定义要执行的比较类型(参见

表3-8. 妇女状况 直接的5至7位保留。

* 对于不使用 VEX 前缀的指令编码,比特 2:0 定义要进行比较的类型(参见

表3至表8的前8行。 3至7位的直线部分保留。

当比较的两个源操作数中至少有一个是NaN时,无序关系是真实的;当两个源操作数都不是NaN时,有序关系是真实的.

后续使用掩码的计算指令得出目标操作数作为输入的操作数不会产生例外,因为所有0s的掩码对应于+0.0的浮点值,所有1s的掩码对应于QNaN.

注意,"CPUID.01H:ECX.AVX[28] = 0"的处理器不执行"大于","大于或等于","大于或等于","大于或等于"的上游关系. 这些比较可以通过使用反向关系(即使用"不小于或相等"来进行"大于"的比较)或使用软件仿真来进行. 在使用软件仿真时,程序必须互换操作数(在必要时进行复制登记以保护现在将出现在目的地的数据),然后使用不同的上游来进行比较.

编译器和装配器除了3-操作数 CMPSS指令外,还可以执行以下2-操作数伪op,用于"CPUID.01H:ECX.AVX[28] = 0"的处理器. 见表3-15。 编译器应将保留的imm8值视为非法语法.

数字 :                                 表3-15. 妇女状况 Pseudo-Op 和 CMPSS 执行

Pseudo-Op CMPSS 执行

CMPEQSS xmm1,xmm2 CMPSS xmm1,xmm2,0

CMPLTSS xmm1,xmm2 CMPSS xmm1,xmm2,1号机车

CMPLESS xmm1, xmm2 CMPSS xmm1, xmm2, 2 (中文(简体) ).

CMPUNORDSS xmm1, xmm2 CMPSS xmm1, xmm2, 3 (中文(简体) ).

CMPNEQSS xmm1, xmm2 CMPSS xmm1, xmm2, 4 (中文(简体) ).

CMPNLTSS xmm1, xmm2 CMPSS xmm1, xmm2, 5

CMPNLESS xmm1, xmm2 CMPSS xmm1, xmm2, 6 (中文(简体) ).

CMPORDSS xmm1, xmm2 CMPSS xmm1, xmm2, 7 (中文(简体) ).

相对于处理器不执行的关系,需要在软件中进行不止一个指令的仿真,因此不应作为伪操作执行. (对于这些,程序员应当将对应关系小于关系的操作数反转,并使用移动指令,以确保面具移动到正确的目的地寄存器,源操作数完好无损. )

具有"CPUID.01H:ECX.AVX[28] = 1"的处理器执行表3-14中显示的32个上游的完整补充,不再需要软件仿真. 编译器和装配器除了执行4-操作数 VCMPSS指令外,还可以执行以下三operand伪op. 参见表3-16,其中reg1 reg2和reg3的注释代表XMM登记册或YMM登记册. 编译器应将保留的imm8值视为非法语法. 反之,内在可以将伪ops映射到预定义的常数上,支持更简单的内在界面. 编译器和组装器可以通过扩展表3-16列出的语法,以类似的方式执行EVEX编码的VCMPSS指令的3-操作数伪op.

数字 :                                 表格 3-16。 Pseudo-Op 和 VCMPSS 执行

Pseudo-Op CMPSS 执行

VCMPEQSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 0

VCMPLTSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 1

VCMPLESS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 2

VCMPUNORDSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 3

VCMPNEQSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 4

VCMPNLTSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 5

VCMPNLESS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 6

VCMPORDSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 7

VCMPEQQUQSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 8

VCMPNGESS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 9

VCMPNGTSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 0AH

VCMPFALSESS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 0BH

VCMPNEQ OQSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 0CH

** Pseudo-Op和VCMPSS执行(Cont.)**

| 修道会 | CMPSS 执行 |
| --- | --- |
| VCMPGESS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 0DH |
| VCMPGTSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 0EH |
| VCMPTRUESS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 0FH |
| VCMPEQ_OSSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 10H |
| VCMPLT_OQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 11H |
| VCMPLE_OQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 12H |
| VCMPUNORD_SSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 13H |
| VCMPNEQ_USSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 14H |
| VCMPNLT_UQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 15H |
| VCMPNLE_UQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 16H |
| VCMPORD_SSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 17H |
| VCMPEQ_USSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 18H |
| VCMPNGE_UQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 19H |
| VCMPNGT_UQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 1AH |
| VCMPFALSE_OSSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 1BH |
| VCMPNEQ_OSSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 1CH |
| VCMPGE_OQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 1DH |
| VCMPGT_OQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 1EH |
| VCMPTRUE_USSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 1FH |
| 软件应确保VCMPSS编码为VEX.L=0. 编码 | VCMPSS 与 VEX.L = 1 相遇 |
| 不同处理器世代之间无法预测的行为. |  |

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

VCMPSS (EVEX Encoded Version)
CMP0 := SRC1[31:0] OP5 SRC2[31:0];

IF k2[0] or *no writemask*                    ; zeroing-masking only
    THEN IF CMP0 = TRUE
                      THEN DEST[0] := 1;
                      ELSE DEST[0] := 0; FI;
    ELSE DEST[0] := 0

FI;
DEST[MAX_KL-1:1] := 0

CMPSS (128-bit Legacy SSE Version)
CMP0 := DEST[31:0] OP3 SRC[31:0];
IF CMP0 = TRUE
THEN DEST[31:0] := FFFFFFFFH;
ELSE DEST[31:0] := 00000000H; FI;
DEST[MAXVL-1:32] (Unmodified)

VCMPSS (VEX.128 Encoded Version)
CMP0 := SRC1[31:0] OP5 SRC2[31:0];
IF CMP0 = TRUE
THEN DEST[31:0] := FFFFFFFFH;
ELSE DEST[31:0] := 00000000H; FI;
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VCMPSS __mmask8 _mm_cmp_ss_mask( __m128 a, __m128 b, int imm);
VCMPSS __mmask8 _mm_cmp_round_ss_mask( __m128 a, __m128 b, int imm, int sae);
VCMPSS __mmask8 _mm_mask_cmp_ss_mask( __mmask8 k1, __m128 a, __m128 b, int imm);
VCMPSS __mmask8 _mm_mask_cmp_round_ss_mask( __mmask8 k1, __m128 a, __m128 b, int imm, int sae);
(V)CMPSS __m128 _mm_cmp_ss(__m128 a, __m128 b, const int imm);
```

## SIMD 浮点 例外

如果 SNaN 操作数 无效, 如果 QNaN 和表 3-8 所列上游无效, 异常值 。

## 其他例外

VEX-encoded指令,参见表2-20"第3类例外条件".

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".
