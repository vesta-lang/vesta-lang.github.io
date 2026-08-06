---
summary: 从四字形源选择包装的未对齐字节
---

## 说明

本指令从第二源操作数(第三个操作数)的每个输入qword元素中选择8个不匹配的字节,并在目标操作数(第一个操作数)中为每个qword元素写入8个组装的字节. 每个字节结果在第一源操作数(第二个操作数)对应的qword元素内使用一个字节-granular移位控制来选择. 目标操作数的每个字节结果在写掩码 k1下更新.

只使用每个控制字节的低6位来选择一个8位的槽,从第二源操作数的qword数据中提取输出字节. 8位位槽的起始位点相对于任意字节边界可以不匹配,从控制位点低6位指定位置的输入qword源中提取. 如果8位槽将超过qword边界,则8位槽的出界部分会被包回,从输入qword元素的比特0开始.

第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位向量从64位内存位置广播. 目标操作数是一个ZMM/YMM/XMM登记册.

## 行动

```text
VPMULTISHIFTQB DEST, SRC1, SRC2 (EVEX encoded version)
(KL, VL) = (2, 128),(4, 256), (8, 512)
FOR i := 0 TO KL-1

    IF EVEX.b=1 AND src2 is memory THEN
                tcur := src2.qword[0]; //broadcasting

    ELSE
                tcur := src2.qword[i];

    FI;
    FOR j := 0 to 7

          ctrl := src1.qword[i].byte[j] & 63;
          FOR k := 0 to 7

                res.bit[k] := tcur.bit[ (ctrl+k) mod 64 ];
          ENDFOR
          IF k1[i*8+j] or no writemask THEN

                DEST.qword[i].byte[j] := res;
          ELSE IF zeroing-masking THEN

                DEST.qword[i].byte[j] := 0;
    ENDFOR
ENDFOR
DEST.qword[MAX_VL-1:VL] := 0;
```

## Intel C/C++ 内在编译器

```c
VPMULTISHIFTQB __m512i _mm512_multishift_epi64_epi8( __m512i a, __m512i b);
VPMULTISHIFTQB __m512i _mm512_mask_multishift_epi64_epi8(__m512i s, __mmask64 k, __m512i a, __m512i b);
VPMULTISHIFTQB __m512i _mm512_maskz_multishift_epi64_epi8( __mmask64 k, __m512i a, __m512i b);
VPMULTISHIFTQB __m256i _mm256_multishift_epi64_epi8( __m256i a, __m256i b);
VPMULTISHIFTQB __m256i _mm256_mask_multishift_epi64_epi8(__m256i s, __mmask32 k, __m256i a, __m256i b);
VPMULTISHIFTQB __m256i _mm256_maskz_multishift_epi64_epi8( __mmask32 k, __m256i a, __m256i b);
VPMULTISHIFTQB __m128i _mm_multishift_epi64_epi8( __m128i a, __m128i b);
VPMULTISHIFTQB __m128i _mm_mask_multishift_epi64_epi8(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMULTISHIFTQB __m128i _mm_maskz_multishift_epi64_epi8( __mmask8 k, __m128i a, __m128i b);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-52"Type E4NF类例外条件".
