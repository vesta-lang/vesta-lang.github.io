---
summary: 比较包装的字节值输入遮盖
---

## 说明

执行 SIMD 比较 第二源操作数 和 第一源操作数 的 盘点字节值,并返回比较结果 mask 目标操作数 。 比较的上游操作数(即时字节)指定了两个源操作数中每对包装值的比较类型. 每次比较的结果都是1(比较真)或0(比较假)的单面罩比特结果.

VPCMPB对签名字节值进行了比较。

VPCMPUB对无符号字节值进行比较。

第一源操作数(第二个操作数)是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM登记器或512/256/128位内存位置. 目标操作数(第一个操作数)是一个面具寄存器k1. 最多进行了64/32/16的比较,结果在写作程序k2下写到目的地操作处。

比较的上游操作数是一个8位即时:比特2:0定义了要执行的比较类型. 3至7位的直线部分保留。 编译器可以执行表5-19列出的伪op mnemonic.

数字 :                               表5-19 (中文(简体) ). 修道院和VPCMP* 执行PCMPM执行 Pseudo-OpVPCMP* 正则1,正则2,正则3,0VPCMPEQ* 正则1,正则2,正则3VPCMP*雷格1,雷格2,雷格3,1VPCMPLT* 正则1,正则2,正则3VPCMP* 正则1,正则2,正则3,2VPCMPLE* 正则1,正则2,正则3VPCMP* 正则1,正则2,正则3,4VPCMPNEQ* 正则1,正则2,正则3VPCMP* 正则1,正则2,正则3,5VPPCMPNLT* 正则1,正则2,正则3VPCMP* 正则1,正则2,正则3,6VPCMPNLE* 正则1,正则2,正则3

## 行动

```text
CASE (COMPARISON PREDICATE) OF
    0: OP := EQ;
    1: OP := LT;
    2: OP := LE;
    3: OP := FALSE;
    4: OP := NEQ;
    5: OP := NLT;
    6: OP := NLE;
    7: OP := TRUE;

ESAC;

VPCMPB (EVEX encoded versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k2[j] OR *no writemask*

     THEN

            CMP := SRC1[i+7:i] OP SRC2[i+7:i];

            IF CMP = TRUE

            THEN DEST[j] := 1;

            ELSE DEST[j] := 0; FI;

     ELSE DEST[j] = 0                       ; zeroing-masking onlyFI;

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0


VPCMPUB (EVEX encoded versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k2[j] OR *no writemask*

     THEN

            CMP := SRC1[i+7:i] OP SRC2[i+7:i];

            IF CMP = TRUE

            THEN DEST[j] := 1;

            ELSE DEST[j] := 0; FI;

     ELSE DEST[j] = 0                       ; zeroing-masking onlyFI;

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ 内在编译器

```c
VPCMPB __mmask64 _mm512_cmp_epi8_mask( __m512i a, __m512i b, int cmp);
VPCMPB __mmask64 _mm512_mask_cmp_epi8_mask( __mmask64 m, __m512i a, __m512i b, int cmp);
VPCMPB __mmask32 _mm256_cmp_epi8_mask( __m256i a, __m256i b, int cmp);
VPCMPB __mmask32 _mm256_mask_cmp_epi8_mask( __mmask32 m, __m256i a, __m256i b, int cmp);
VPCMPB __mmask16 _mm_cmp_epi8_mask( __m128i a, __m128i b, int cmp);
VPCMPB __mmask16 _mm_mask_cmp_epi8_mask( __mmask16 m, __m128i a, __m128i b, int cmp);
VPCMPB __mmask64 _mm512_cmp[eq|ge|gt|le|lt|neq]_epi8_mask( __m512i a, __m512i b);
VPCMPB __mmask64 _mm512_mask_cmp[eq|ge|gt|le|lt|neq]_epi8_mask( __mmask64 m, __m512i a, __m512i b);
VPCMPB __mmask32 _mm256_cmp[eq|ge|gt|le|lt|neq]_epi8_mask( __m256i a, __m256i b);
VPCMPB __mmask32 _mm256_mask_cmp[eq|ge|gt|le|lt|neq]_epi8_mask( __mmask32 m, __m256i a, __m256i b);
VPCMPB __mmask16 _mm_cmp[eq|ge|gt|le|lt|neq]_epi8_mask( __m128i a, __m128i b);
VPCMPB __mmask16 _mm_mask_cmp[eq|ge|gt|le|lt|neq]_epi8_mask( __mmask16 m, __m128i a, __m128i b);
VPCMPUB __mmask64 _mm512_cmp_epu8_mask( __m512i a, __m512i b, int cmp);
VPCMPUB __mmask64 _mm512_mask_cmp_epu8_mask( __mmask64 m, __m512i a, __m512i b, int cmp);
VPCMPUB __mmask32 _mm256_cmp_epu8_mask( __m256i a, __m256i b, int cmp);
VPCMPUB __mmask32 _mm256_mask_cmp_epu8_mask( __mmask32 m, __m256i a, __m256i b, int cmp);
VPCMPUB __mmask16 _mm_cmp_epu8_mask( __m128i a, __m128i b, int cmp);
VPCMPUB __mmask16 _mm_mask_cmp_epu8_mask( __mmask16 m, __m128i a, __m128i b, int cmp);
VPCMPUB __mmask64 _mm512_cmp[eq|ge|gt|le|lt|neq]_epu8_mask( __m512i a, __m512i b, int cmp);
VPCMPUB __mmask64 _mm512_mask_cmp[eq|ge|gt|le|lt|neq]_epu8_mask( __mmask64 m, __m512i a, __m512i b, int cmp);
VPCMPUB __mmask32 _mm256_cmp[eq|ge|gt|le|lt|neq]_epu8_mask( __m256i a, __m256i b, int cmp);
VPCMPUB __mmask32 _mm256_mask_cmp[eq|ge|gt|le|lt|neq]_epu8_mask( __mmask32 m, __m256i a, __m256i b, int cmp);
VPCMPUB __mmask16 _mm_cmp[eq|ge|gt|le|lt|neq]_epu8_mask( __m128i a, __m128i b, int cmp);
VPCMPUB __mmask16 _mm_mask_cmp[eq|ge|gt|le|lt|neq]_epu8_mask( __mmask16 m, __m128i a, __m128i b, int cmp);
```

## SIMD 浮点 例外

None

## 其他例外

EVEX-encoded 指令,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".
