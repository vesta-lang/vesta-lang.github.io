---
summary: 解包和互放低包单精度浮点值
---

## 说明

执行 第一源操作数 和 第二源操作数 的 低 单精度浮点 值的互页解析。

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(ZMM注册点)没有修改. 当从 内存操作数 解开时,一个执行可能只获取适当的64位;然而,与 16 字节边界的对齐和正常的段检查仍然会被执行.

VEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册.

SRC1 X7  X6  X5  X4  X3                                                            X2  X1  X0

SRC2 Y7  Y6  Y5  Y4  Y3                                                            Y2  Y1  Y0

DEST Y5  X5  Y4  X4  Y1                                                            X1  Y0  X0

图4-28. VUNPCKLPS 操作

EVEX.512 编码版本 : 第一源操作数是一个ZMM登记册. 第二源操作数是一个ZMM寄存器,512位内存位置,或512位矢量从32位内存位置广播. 目标操作数是一个ZMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM寄存器,一个256位的内存位置,或者从32位的内存位置广播的256位矢量. 目标操作数是一个YMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM寄存器,一个128位的内存位置,或者从32位的内存位置广播128位的矢量. 目标操作数是一个XMM的寄存器,有条件的更新使用写掩码 k1.

## 行动

```text
VUNPCKLPS (EVEX Encoded Version When SRC2 is a ZMM Register)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF VL >= 128

    TMP_DEST[31:0] := SRC1[31:0]
    TMP_DEST[63:32] := SRC2[31:0]
    TMP_DEST[95:64] := SRC1[63:32]
    TMP_DEST[127:96] := SRC2[63:32]
FI;
IF VL >= 256
    TMP_DEST[159:128] := SRC1[159:128]
    TMP_DEST[191:160] := SRC2[159:128]
    TMP_DEST[223:192] := SRC1[191:160]
    TMP_DEST[255:224] := SRC2[191:160]
FI;
IF VL >= 512
    TMP_DEST[287:256] := SRC1[287:256]
    TMP_DEST[319:288] := SRC2[287:256]
    TMP_DEST[351:320] := SRC1[319:288]
    TMP_DEST[383:352] := SRC2[319:288]
    TMP_DEST[415:384] := SRC1[415:384]
    TMP_DEST[447:416] := SRC2[415:384]
    TMP_DEST[479:448] := SRC1[447:416]
    TMP_DEST[511:480] := SRC2[447:416]
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

VUNPCKLPS (EVEX Encoded Version When SRC2 is Memory)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 31

     IF (EVEX.b = 1)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]

          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]

     FI;

ENDFOR;

IF VL >= 128

TMP_DEST[31:0] := SRC1[31:0]

TMP_DEST[63:32] := TMP_SRC2[31:0]

TMP_DEST[95:64] := SRC1[63:32]

TMP_DEST[127:96] := TMP_SRC2[63:32]

FI;

IF VL >= 256

     TMP_DEST[159:128] := SRC1[159:128]

     TMP_DEST[191:160] := TMP_SRC2[159:128]

     TMP_DEST[223:192] := SRC1[191:160]

     TMP_DEST[255:224] := TMP_SRC2[191:160]

FI;

IF VL >= 512

     TMP_DEST[287:256] := SRC1[287:256]

     TMP_DEST[319:288] := TMP_SRC2[287:256]

     TMP_DEST[351:320] := SRC1[319:288]

     TMP_DEST[383:352] := TMP_SRC2[319:288]

     TMP_DEST[415:384] := SRC1[415:384]

     TMP_DEST[447:416] := TMP_SRC2[415:384]

     TMP_DEST[479:448] := SRC1[447:416]

     TMP_DEST[511:480] := TMP_SRC2[447:416]

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

UNPCKLPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[31:0]
DEST[63:32] := SRC2[31:0]
DEST[95:64] := SRC1[63:32]
DEST[127:96] := SRC2[63:32]
DEST[159:128] := SRC1[159:128]
DEST[191:160] := SRC2[159:128]
DEST[223:192] := SRC1[191:160]
DEST[255:224] := SRC2[191:160]
DEST[MAXVL-1:256] := 0

VUNPCKLPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0]
DEST[63:32] := SRC2[31:0]
DEST[95:64] := SRC1[63:32]
DEST[127:96] := SRC2[63:32]
DEST[MAXVL-1:128] := 0

UNPCKLPS (128-bit Legacy SSE Version)
DEST[31:0] := SRC1[31:0]
DEST[63:32] := SRC2[31:0]
DEST[95:64] := SRC1[63:32]
DEST[127:96] := SRC2[63:32]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VUNPCKLPS __m512 _mm512_unpacklo_ps(__m512 a, __m512 b);
VUNPCKLPS __m512 _mm512_mask_unpacklo_ps(__m512 s, __mmask16 k, __m512 a, __m512 b);
VUNPCKLPS __m512 _mm512_maskz_unpacklo_ps(__mmask16 k, __m512 a, __m512 b);
VUNPCKLPS __m256 _mm256_unpacklo_ps (__m256 a, __m256 b);
VUNPCKLPS __m256 _mm256_mask_unpacklo_ps(__m256 s, __mmask8 k, __m256 a, __m256 b);
VUNPCKLPS __m256 _mm256_maskz_unpacklo_ps(__mmask8 k, __m256 a, __m256 b);
UNPCKLPS __m128 _mm_unpacklo_ps (__m128 a, __m128 b);
VUNPCKLPS __m128 _mm_mask_unpacklo_ps(__m128 s, __mmask8 k, __m128 a, __m128 b);
VUNPCKLPS __m128 _mm_maskz_unpacklo_ps(__mmask8 k, __m128 a, __m128 b);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded 指令,参见表2-21,"第4类例外条件".

EVEX-encoded 指令,参见表2-52,"Type E4NF class Exception Centers".

CHAPTER 5

5.1 TERNARY BIT VECTOR LOGIC TABLE (中文(简体) ).

VPTERNLOGD/VPTERNLOGQ指令在dword/qword元素上运行,并取相应输入数据元素的3位矢量形成32/64指数集,其中每个3位值提供一个索引,以8位的查询表作为指令的imm8字节. Imm8字节的256个可能值被构建为16x16布尔逻辑表. 表的16行使用imm8的下4位作为行索引. 16列的参考文献为imm8[7:4]. 表的16列为两半,表5-1显示的栏指数值在0:7之间,表5-2显示与栏指数8.15对应的8列. 本节介绍256输入表的双吸盘,使用简写法表示简单或复合布尔逻辑表达式,并有3个输入位源数据。 三个输入比特源数据将用大写字母表示: A,B,C;其中A代表了第一源操作数(也是目标操作数)的一点,B和C代表了第2和第3源操作数的一点. 每个地图条目都采取逻辑表达式的形式,其中包含一个更多的组件表达式. 每个组件表达式都由一个无函数或二进制布尔运算符和相关的操作数组成. 每个二进制布尔运算符用小写字母表示,操作数在逻辑运算符之后缩写. The unary operator `not' is expressed using `!'. 此外,有条件的表达式"A?B:C"表示如果A设定了返回B的结果,返回C否则. 二进制布尔运算符后面是两个操作数,例如和AB。 对于一个包含共通性组件并包含同一逻辑运算符的复合二进制表达式,省略了第2逻辑运算符,并可以按顺序调和3个操作数,如和ABC. 当第一个二进制布尔表达式的第2个操作数来自另一个布尔表达式的结果时,第2个布尔表达式在第一个逻辑表达式的大写操作数之后,例如NorBnandAC被调和. 当结果独立于一个操作数时,该操作数在逻辑表达式中被省略,如零或NorCB. 3-输入表达式"MajorABC"如果两个或两个以上的输入位为0,返回0,如果两个或两个以上的输入位为1,返回1。 3-输入表达式" minorABC" 返回 1, 如果两个或多个输入位为 0, 如果两个或多个输入位为 1, 返回 0 。 表5-1和表5-2中使用的建筑块位逻辑函数包括:

* 常数 : TRUE(1),FALSE(0); ; (中文(简体) ). * 无效函数 : 不是(!) ; (中文(简体) ). * 二进制函数:和、nand、或或xor、xnor; * 条件函数 : 选择(?) ; * 三级功能:主要,次要.

数字 :              表5-1. 妇女状况 VPTERNLOG Boolean 逻辑操作图的 16x16 下 8 列

[7:4] [3:0]00H 0H 1H 2H 3H 4H 5H 6H 7H 01H 02H FALSE(原始内容存档于2018-09-21). AnorBC NorBnandAC and A!!. B NorCnandBA and A!. C和AxorBC 和 AnandBC.03H 04HABC 或 CB 或 BxorAC A ?!. B:NorBC 或 CxorBA A ?!. C:NorBC A?xorBC:NorB A?nandBC :没有05H 06H溴化二苯醚07H 08H和CnorBA或BxnorAC和C! B或BnorAC C?NorBA:和C?NorBA:A C!BBA C!和BA C?09H学士0AH 0BHBA和BandAC C? BOBA! BOBA:xnor A! CBA:BA?XORBC:BA?NANDBC:! BOB:BBA:BBA!BBB:BBA:XNORA!BBB:BBA:BB:BBA:BBB:BBB:BBB:BBB:BBB:BBB:BBBB:BBB:BBB:BBA:BBB:BBA:BBA:BBBA:BBBA:BBBA:BBA:BBBAABBBABBBBBBBBBBBABB:BABBBBBB:BBBBBBABBBBBBABBBBBBBBBBBB:BBBBBBB:BBBBBBB:BBBBBBBBB:BBBBBBBBBBBBBBB0CH学士0DH 0EHBnorAC NorcnorBA B?NorAC:和BnorAC:A和B!CnorBA B!!C:和CnorBA?!C:和B!C:0FH空调

```text
        norCA      norCandBA  B?norAC:xnor A?!B:!C     B?!C:norAC !C                  A?xorBC:!C A?nandBC:!C
```

AC

```text
        norAxnorBC A?norBC:xorB B?norAC:C  xorBorAC    C?norBA:B xorCorBA             xorCB       B?!C:orAC
```

C

```text
        norAandBC minorABC    C?!B:!A      nandBorAC B?!C:!A      nandCorBA           A?xorBC:nan nandCB
```

dBC

```text
        norAnandBC A?norBC:and andCxorBA   A?!B:andBC  andBxorAC  A?!C:andBC          A?xorBC:and xorAandBC
                            BC                                                        BC
```

```text
        norAxorBC  A?norBC:xnor C?xorBA:norB A?!B:xnorBC B?xorAC:norA A?!C:xnorBC xnorABC         A?nandBC:xn
```

orBC

```text
                   BC         A                        C
```

```text
        andC!A     A?norBC:C andCnandBA A?!B:C         C?!A:andBA xorCA               xorCandBA A?nandBC:C
```

```text
        C?!A:norBA C?!A:!B    C?nandBA:no C?nandBA:!B B?xorAC:!A  B?xorAC:nan C?nandBA:xn nandBxnorAC
                              rBA                                 dAC                 orBA
```

```text
        andB!A     A?norBC:B B?!A:andAC xorBA          andBnandAC A?!C:B              xorBandAC A?nandBC:B
```

```text
        B?!A:norAC B?!A:!C    B?!A:xnorAC C?xorBA:nan B?nandAC:no B?nandAC:!C B?nandAC:xn nandCxnorBA
                                           dBA         rAC                            orAC
```

```text
        norAnorBC xorAorBC    B?!A:C       A?!B:orBC   C?!A:B     A?!C:orBC           B?nandAC:C A?nandBC:or
```

BC

```text
        !A         nandAorBC C?nandBA:!A nandBA        B?nandAC:!A nandCA             nandAxnorBC nandABC
```

表5-2显示与栏指数值8:15相对应的256条目地图的一半.

数字 :               表5-2. 妇女状况 16x16 VPTERNLOG 布尔逻辑操作图的上 8 列

[7:4] [3:0]00H 08H 09H 0AH 0BH 0CH 0DH 0EH 0FH 01H 02HABC和AxnoBC和CA B?和AC:A和BA C?和BA:A和AorBC A03H 04H(原始内容存档于2018-09-26). A. and BC:noor B.andAC:!!. C. NorBC C. A. B. B. B. B. B. A. A. A. A. A. A. A. A. A. A. A. A. A. A. A. A. A. B. B. B. B. B. B. B. B. B. B. B. B. B. B. B. B. B. B. B. C. A. C. C. C. NorBC. C. C. C. C. C. C. C. C. C. C. C. C. C. C. B. B. B. B. B. A. A. B. A. A. B. A. B. B. A. A. B. B. A. B. B. A. B. A. B. B. A. B. B. A. B. B. B. B. A. B. B. B. A. B. B. B. A. B. B. B. B.05H业连06H 07H和CxnorBA B?andAC:xor B?andAC:C B?08HAC C dBA (英语).09H 0AHA.andBC:! BxnordBandAC A?C:!! BnandBnandA xnorBA B?A:nandAC A?orBC:!B orB!0BH C 0CH 0DH和BxnorAC C?和BA:xor B?xnorAC:an B?xnorAC:A?和BA:BBA C?和BA:或BC?0EHBA dAC A (英语).0FH

```text
        A?andBC:!C xnorCandBA xnorCA       C?A:nandBA A?B:!C       nandCnandB A?orBC:!C            orA!C
```

A

```text
        A?andBC:xor xorABC      A?C:xorBC  B?xnorAC:orA A?B:xorBC  C?xnorBA:orB A?orBC:xorBC orAxorBC
        BC                                 C                       A
```

XnorAandBC A?xnorBC:na A?C:nandBC nandBxorAC A?B:nandBC nandCxorBA A?orBCnandB 或AnandBC 互联网档案馆的存檔,存档日期2013-03-02.

```text
                ndBC                                                          C
```

```text
        andCB   A?xnorBC:an andCorAB       B?C:A     andBorAC      C?B:A      majorABC             orAandBC
```

dBC

```text
        B?C:norAC xnorCB        xnorCorBA C?orBA:!B  xnorBorAC B?orAC:!C      A?orBC:xnorB orAxnorBC
```

C

```text
        A?andBC:C A?xnorBC:C C             B?C:orAC  A?B:C         B?orAC:xorAC orCandBA           orCA
```

```text
        B?C:!A  B?C:nandAC orCnorBA        orC!B     B?orAC:!A     B?orAC:nand orCxnorBA           nandBnorAC
```

AC

```text
        A?andBC:B A?xnorBC:B A?C:B         C?orBA:xorBA B          C?B:orBA   orBandAC             orBA
```

```text
        C?B!A   C?B:nandBA C?orBA:!A       C?orBA:nand orBnorAC    orB!C      orBxnorAC nandCnorBA
```

BA

```text
        A?andBC:orB A?xnorBC:orB A?C:orBC  orCxorBA  A?B:orBC      orBxorAC   orCB                 orABC
        C       C
```

```text
        nandAnandB nandAxorBC orC!A        orCnandBA orB!A         orBnandAC nandAnorBC TRUE
```

C

表5-1和表5-2将 imm8 字节的每个可能值翻译为布尔表达式. 这些表格也可以被软件用来将布尔表达式翻译为数值常数,形成构建imm8语法所需的VPTERNLOG值. 有一套独特的三字节常数(F0H,CCH,AAH)可以用于此目的,与这些表格中定义的布尔表达式一起作为输入操作数. 反向映射可以表现为:

Result_imm8 = Table_Lookup_Entry(0F0H, 0CCH, 0AAH)

表  Lookup  Entry 是表5-1和表5-2中定义的布尔表达式.

5.2 INSTRUCTIONS (V)

第5章继续按字母顺序讨论英特尔(R)64和IA-32指令(V). 另见: 第3章,"指令集参考,A-L",载于Intel(R)64和IA-32架构软件开发者手册,Volume

2A级; 第5章,"指令集参考,V",载于Intel(R)64和IA-32架构软件开发者手册第2B卷;第5章,"指令集参考,V",载于Intel(R)64和IA-32架构软件开发者手册第2D卷.
