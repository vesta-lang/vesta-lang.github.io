---
summary: 将矢量记录转换为遮罩
---

## 说明

将矢量寄存器转换为掩码寄存器。 目的地登记册中的每个元素被设定为1或0,这取决于源登记册中相应元素中最显著位的值. 源操作数是一个ZMM/YMM/XMM登记册. 目标操作数是一个面具寄存器. EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VPMOVB2M (EVEX encoded versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)
FOR j := 0 TO KL-1

    i := j * 8
    IF SRC[i+7]

          THEN DEST[j] := 1
          ELSE DEST[j] := 0
    FI;
ENDFOR
DEST[MAX_KL-1:KL] := 0

VPMOVW2M (EVEX encoded versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)
FOR j := 0 TO KL-1

    i := j * 16
    IF SRC[i+15]

          THEN DEST[j] := 1
          ELSE DEST[j] := 0
    FI;
ENDFOR
DEST[MAX_KL-1:KL] := 0

VPMOVD2M (EVEX encoded versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF SRC[i+31]

          THEN DEST[j] := 1
          ELSE DEST[j] := 0
    FI;
ENDFOR
DEST[MAX_KL-1:KL] := 0

VPMOVQ2M (EVEX encoded versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF SRC[i+63]

          THEN DEST[j] := 1
          ELSE DEST[j] := 0
    FI;
ENDFOR
DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ 内在编译器

```c
VPMPOVB2M __mmask64 _mm512_movepi8_mask( __m512i );
VPMPOVD2M __mmask16 _mm512_movepi32_mask( __m512i );
VPMPOVQ2M __mmask8 _mm512_movepi64_mask( __m512i );
VPMPOVW2M __mmask32 _mm512_movepi16_mask( __m512i );
VPMPOVB2M __mmask32 _mm256_movepi8_mask( __m256i );
VPMPOVD2M __mmask8 _mm256_movepi32_mask( __m256i );
VPMPOVQ2M __mmask8 _mm256_movepi64_mask( __m256i );
VPMPOVW2M __mmask16 _mm256_movepi16_mask( __m256i );
VPMPOVB2M __mmask16 _mm_movepi8_mask( __m128i );
VPMPOVD2M __mmask8 _mm_movepi32_mask( __m128i );
VPMPOVQ2M __mmask8 _mm_movepi64_mask( __m128i );
VPMPOVW2M __mmask8 _mm_movepi16_mask( __m128i );
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded discription,参见表2-57"Type E7NM类例外条件".

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
