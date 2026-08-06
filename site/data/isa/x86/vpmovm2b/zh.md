---
summary: 将遮罩登记器转换为矢量
---

## 说明

将掩码寄存器转换为矢量寄存器。 目的地寄存器中的每个元素被设定为全部1'或全部0',这取决于源面罩寄存器中对应位的值. 源操作数是一个面具寄存器. 目标操作数是一个ZMM/YMM/XMM登记册. EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VPMOVM2B (EVEX encoded versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)
FOR j := 0 TO KL-1

    i := j * 8
    IF SRC[j]

          THEN DEST[i+7:i] := -1
          ELSE DEST[i+7:i] := 0
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VPMOVM2W (EVEX encoded versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)
FOR j := 0 TO KL-1

    i := j * 16
    IF SRC[j]

          THEN DEST[i+15:i] := -1
          ELSE DEST[i+15:i] := 0
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VPMOVM2D (EVEX encoded versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF SRC[j]

          THEN DEST[i+31:i] := -1
          ELSE DEST[i+31:i] := 0
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VPMOVM2Q (EVEX encoded versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF SRC[j]

          THEN DEST[i+63:i] := -1
          ELSE DEST[i+63:i] := 0
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPMOVM2B __m512i _mm512_movm_epi8(__mmask64 );
VPMOVM2D __m512i _mm512_movm_epi32(__mmask8 );
VPMOVM2Q __m512i _mm512_movm_epi64(__mmask16 );
VPMOVM2W __m512i _mm512_movm_epi16(__mmask32 );
VPMOVM2B __m256i _mm256_movm_epi8(__mmask32 );
VPMOVM2D __m256i _mm256_movm_epi32(__mmask8 );
VPMOVM2Q __m256i _mm256_movm_epi64(__mmask8 );
VPMOVM2W __m256i _mm256_movm_epi16(__mmask16 );
VPMOVM2B __m128i _mm_movm_epi8(__mmask16 );
VPMOVM2D __m128i _mm_movm_epi32(__mmask8 );
VPMOVM2Q __m128i _mm_movm_epi64(__mmask8 );
VPMOVM2W __m128i _mm_movm_epi16(__mmask8 );
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded discription,参见表2-57"Type E7NM类例外条件".

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
