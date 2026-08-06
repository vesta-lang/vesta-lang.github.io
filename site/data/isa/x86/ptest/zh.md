---
summary: 逻辑比较
---

## 说明

PTEST和VPTEST如果结果中的所有位点都是第一源操作数(第一操作数)的位点AND的0和第二源操作数(第二操作数),则设置ZF旗. VPTEST设定了CF旗,如果结果中的所有位点都是第二源运行符(第二源运行符)的位元AND的0,以及目的地运行符的逻辑NOT.

第一个源寄存器由ModR/M reg字段指定.

128位版本 : 第一个来源登记册是XMM登记册。 第二个来源寄存器可以是XMM寄存器,也可以是128位的内存位置寄存器. 目的地登记册没有修改 。

VEX.256 编码版本 : 第一个来源登记册是YMM登记册。 第二个来源寄存器可以是YMM寄存器或256位内存位置寄存器. 目的地登记册没有修改 。

说明: 在VEX-encoded版本中,VEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
(V)PTEST (128-bit Version)
IF (SRC[127:0] BITWISE AND DEST[127:0] = 0)

    THEN ZF := 1;
    ELSE ZF := 0;
IF (SRC[127:0] BITWISE AND NOT DEST[127:0] = 0)
    THEN CF := 1;
    ELSE CF := 0;
DEST (unmodified)
AF := OF := PF := SF := 0;

VPTEST (VEX.256 Encoded Version)
IF (SRC[255:0] BITWISE AND DEST[255:0] = 0) THEN ZF := 1;

    ELSE ZF := 0;
IF (SRC[255:0] BITWISE AND NOT DEST[255:0] = 0) THEN CF := 1;

    ELSE CF := 0;
DEST (unmodified)
AF := OF := PF := SF := 0;
```

## Intel C/C++ 内在编译器

```c
PTEST int _mm_testz_si128 (__m128i s1, __m128i s2);
PTEST int _mm_testc_si128 (__m128i s1, __m128i s2);
PTEST int _mm_testnzc_si128 (__m128i s1, __m128i s2);
VPTEST int _mm256_testz_si256 (__m256i s1, __m256i s2);
VPTEST int _mm256_testc_si256 (__m256i s1, __m256i s2);
VPTEST int _mm256_testnzc_si256 (__m256i s1, __m256i s2);
VPTEST int _mm_testz_si128 (__m128i s1, __m128i s2);
VPTEST int _mm_testc_si128 (__m128i s1, __m128i s2);
VPTEST int _mm_testnzc_si128 (__m128i s1, __m128i s2);
```

## 受影响的旗帜

OF,AF,PF,SF的旗帜被清除,ZF,CF的旗帜按照行动设置.

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",另外:

```text
#UD                     If VEX.vvvv  1111B.
```
