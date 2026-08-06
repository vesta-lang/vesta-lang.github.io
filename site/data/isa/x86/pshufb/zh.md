---
summary: 包装的散列字节
---

## 说明

PSHUFB(没有VEX或EVEX前缀)根据源操作数(第二个操作数)中的shuffle控制罩,在目标操作数(第一个操作数)中执行位内洗字节. 指令将数据固定在 目标操作数 中,使洗牌面具不受影响. 如果设定了shuffle控制罩每个字节中最显著的位点(bit[7]),则在结果字节中写入常数零. Shuffle控制罩中的每个字节都会形成一个索引,在目标操作数中将相应的字节固定. 每个索引的值是shuffle控制字节中最小的3位(64位操作)或4位(128位操作). 64位操作的示例见图4-15.

PSHUFB的128位形式留下了目的地注册簿中的MAXVL1:128位. 128位的内存操作数必须在16字节边界上对齐,或者生成一般保护例外(#GP). 在64位模式下,REX的前缀可以用于访问XMM8-XMM15.

下列项目适用于VPSHUFB,编码为VEX或EVEX前缀: 1.

* 其中每一种形式都使用其第二源操作数中的shuffle控制字节来选择第一个字节中的哪个字节

源操作数 复制到 目标操作数.

* 这些形式以1,2,或4个16字节的"路由"运行. 和128位的PSHUFB(上方)一样,低

每个shuffle控制字节的4位决定了源道中16个字节中的哪个被复制到相应的目的地道中相应的字节.

* 这些128位和256位版本在目的地登记册中形成0个上位

指令的操作数大小。

* EVEX-encoded版本以写掩码 k1有条件地更新目的地.

## 行动

```text
PSHUFB (with 64-bit MMX operands)
TEMP := DEST
FOR destpos := 0 TO 7

    shufbyte := SRC.byte[destpos];
    IF shufbyte & 80H = 80H

          THEN DEST.byte[destpos] := 0;
          ELSE

                srcpos := shufbyte & 07H;
                DEST.byte[destpos] := TEMP.byte[srcpos];
    FI;

PSHUFB (with 128-bit SSE operands)
TEMP := DEST;
FOR destpos := 0 TO 15

    shufbyte := SRC.byte[destpos];
    IF shufbyte & 80H = 80H

          THEN DEST.byte[destpos] := 0;
          ELSE

                srcpos := shufbyte & 0FH;
                DEST.byte[destpos] := TEMP.byte[srcpos];
    FI;

VPSHUFB (VEX.128 encoded version)
FOR destpos := 0 TO 15

    shufbyte := SRC2.byte[destpos];
    IF shufbyte & 80H = 80H

          THEN DEST.byte[destpos] := 0;
          ELSE

                srcpos := shufbyte & 0FH;
                DEST.byte[destpos] := SRC1.byte[srcpos];
    FI;
DEST[MAXVL1:128] := 0;

VPSHUFB (VEX.256 encoded version)
FOR lane := 0 to 1

    FOR lanepos := 0 TO 15
          destpos := 16 * lane + lanepos;
          shufbyte := SRC2.byte[destpos];
          IF shufbyte & 80H = 80H
                THEN DEST.byte[destpos] := 0;
                ELSE
                      srcpos := 16 * lane + (shufbyte & 0FH);
                      DEST.byte[destpos] := SRC1.byte[srcpos];
          FI;

DEST[MAXVL1:256] := 0;


VPSHUFB (EVEX encoded versions)

// VL is 128, 256, or 512, depending on instruction encoding

// no masking if EVEX.aaa = 0; zeroing if EVEX.z = 1

FOR lane := 0 to VL/128  1

FOR lanepos := 0 TO 15

destpos := 16 * lane + lanepos;

IF no masking OR k[destpos] = 1  // using selected bit from k register

     THEN

     shufbyte := SRC2.byte[destpos];

     IF shufbyte & 80H = 80H

           THEN DEST.byte[destpos] := 0;

           ELSE

                        srcpos := 16 * lane + (shufbyte & 0FH);

                        DEST.byte[destpos] := SRC1.byte[srcpos];

     FI;

     ELSE IF zeroing             // if not zeroing, DEST.byte[destpos] is unchanged

     THEN DEST.byte[destpos] := 0;

FI;

DEST[MAXVL1:VL] := 0;

                        07H 07H  FFH                  MM2         01H   00H  00H          00H
                                                      80H

                        04H 01H  07H                  MM1         02H   02H  FFH          01H
                                                      03H

                                                      MM1

                        04H 04H  00H                  00H         FFH   01H  01H          01H

                                                Figure 4-15. PSHUFB with 64-Bit Operands
```

## Intel C/C++ 内在编译器

```c
VPSHUFB __m512i _mm512_shuffle_epi8(__m512i a, __m512i b);
VPSHUFB __m512i _mm512_mask_shuffle_epi8(__m512i s, __mmask64 k, __m512i a, __m512i b);
VPSHUFB __m512i _mm512_maskz_shuffle_epi8( __mmask64 k, __m512i a, __m512i b);
VPSHUFB __m256i _mm256_mask_shuffle_epi8(__m256i s, __mmask32 k, __m256i a, __m256i b);
VPSHUFB __m256i _mm256_maskz_shuffle_epi8( __mmask32 k, __m256i a, __m256i b);
VPSHUFB __m128i _mm_mask_shuffle_epi8(__m128i s, __mmask16 k, __m128i a, __m128i b);
VPSHUFB __m128i _mm_maskz_shuffle_epi8( __mmask16 k, __m128i a, __m128i b);
PSHUFB: __m64 _mm_shuffle_pi8 (__m64 a, __m64 b) (V)PSHUFB: __m128i _mm_shuffle_epi8 (__m128i a, __m128i b) VPSHUFB:__m256i _mm256_shuffle_epi8(__m256i a, __m256i b);
```

## SIMD 浮点 例外

None.

## 其他例外

非EVEX-encoded指令,参见表2-21"第4类例外条件". EVEX-encoded指令,参见表2-52中的例外类型E4NF.nb,"Type E4NF Class Except Convention Centers".
