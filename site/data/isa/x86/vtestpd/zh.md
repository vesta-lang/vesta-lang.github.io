---
summary: 包装的位测试
---

## 说明

VTESTPS对第一次源代码操作中包装的单精度元素的所有标志位和第二源操作数中的相应标志位进行比对. 如果源代码符号位的AND带有解码符号位产生所有零,则ZF会被另设定为ZF是清晰的. 如果源代码符号的AND带有反转的解码符号位产生所有零,则CF被设定为其他CF是清晰的. 试图用VEX.W=1执行VTESTPS,将导致#UD.

VTESTPD对第一个源操作中双精度元件的所有符号位和第二源操作数中相应的符号位进行比对. 如果源代码符号位的AND带有解码符号位产生所有零,则ZF会被另设定为ZF是清晰的. 如果 AND 的源符号位与反转的脱落符号位产生所有零,则CF被设定为其他CF是清晰的. 试图用VEX.W=1执行VTESTPS,将导致#UD.

第一个源寄存器由ModR/M reg字段指定.

128位版本 : 第一个来源登记册是XMM登记册。 第二个来源寄存器可以是XMM寄存器,也可以是128位的内存位置寄存器. 目的地登记册没有修改 。

VEX.256 编码版本 : 第一个来源登记册是YMM登记册。 第二个来源寄存器可以是YMM寄存器或256位内存位置寄存器. 目的地登记册没有修改 。

说明: 在VEX-encoded版本中,VEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VTESTPS (128-bit version)
TEMP[127:0] := SRC[127:0] AND DEST[127:0]
IF (TEMP[31] = TEMP[63] = TEMP[95] = TEMP[127] = 0)

    THEN ZF := 1;
    ELSE ZF := 0;

TEMP[127:0] := SRC[127:0] AND NOT DEST[127:0]
IF (TEMP[31] = TEMP[63] = TEMP[95] = TEMP[127] = 0)

    THEN CF := 1;
    ELSE CF := 0;
DEST (unmodified)
AF := OF := PF := SF := 0;

VTESTPS (VEX.256 encoded version)
TEMP[255:0] := SRC[255:0] AND DEST[255:0]
IF (TEMP[31] = TEMP[63] = TEMP[95] = TEMP[127]= TEMP[160] =TEMP[191] = TEMP[224] = TEMP[255] = 0)

    THEN ZF := 1;
    ELSE ZF := 0;

TEMP[255:0] := SRC[255:0] AND NOT DEST[255:0]
IF (TEMP[31] = TEMP[63] = TEMP[95] = TEMP[127]= TEMP[160] =TEMP[191] = TEMP[224] = TEMP[255] = 0)

    THEN CF := 1;
    ELSE CF := 0;
DEST (unmodified)
AF := OF := PF := SF := 0;

VTESTPD (128-bit version)
TEMP[127:0] := SRC[127:0] AND DEST[127:0]
IF ( TEMP[63] = TEMP[127] = 0)

    THEN ZF := 1;
    ELSE ZF := 0;

TEMP[127:0] := SRC[127:0] AND NOT DEST[127:0]
IF ( TEMP[63] = TEMP[127] = 0)

    THEN CF := 1;
    ELSE CF := 0;
DEST (unmodified)
AF := OF := PF := SF := 0;

VTESTPD (VEX.256 encoded version)
TEMP[255:0] := SRC[255:0] AND DEST[255:0]
IF (TEMP[63] = TEMP[127] = TEMP[191] = TEMP[255] = 0)

    THEN ZF := 1;
    ELSE ZF := 0;

TEMP[255:0] := SRC[255:0] AND NOT DEST[255:0]
IF (TEMP[63] = TEMP[127] = TEMP[191] = TEMP[255] = 0)

    THEN CF := 1;
    ELSE CF := 0;
DEST (unmodified)
AF := OF := PF := SF := 0;
```

## Intel C/C++ 内在编译器

```c
VTESTPS int _mm256_testz_ps (__m256 s1, __m256 s2);
int _mm256_testc_ps (__m256 s1, __m256 s2);
int _mm256_testnzc_ps (__m256 s1, __m128 s2);
int _mm_testz_ps (__m128 s1, __m128 s2);
int _mm_testc_ps (__m128 s1, __m128 s2);
int _mm_testnzc_ps (__m128 s1, __m128 s2);
VTESTPD int _mm256_testz_pd (__m256d s1, __m256d s2);
int _mm256_testc_pd (__m256d s1, __m256d s2);
int _mm256_testnzc_pd (__m256d s1, __m256d s2);
int _mm_testz_pd (__m128d s1, __m128d s2);
int _mm_testc_pd (__m128d s1, __m128d s2);
int _mm_testnzc_pd (__m128d s1, __m128d s2);
```

## 受影响的旗帜

OF,AF,PF,SF的旗帜被清除,ZF,CF的旗帜按照行动设置.

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".

Additionally:

```text
#UD               If VEX.vvvv  1111B.
```

If VEX.W = 1 for VTESTPS or VTESTPD.
