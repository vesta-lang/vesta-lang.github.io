---
summary: 逻辑 AND 和设置遮罩
---

## 说明

在第一源操作数(第二个操作数)和第二源操作数(第三个操作数)上执行一个位元逻辑的AND操作,并将结果存储在写掩码下的目标操作数(第一个操作数). 如果第一个和第二个src 操作数中对应元素的位元AND为非零,则结果的每个位值被设定为1;否则被设定为0.

VPTESTMD/VPTESTMQ 坐标: 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位矢量从32/64位内存位置播出. 目标操作数是一个在写掩码下更新的面具寄存器.

VPTESTMB/VPTESTMW 坐标: 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM登记器或512/256/128位内存位置. 目标操作数是一个在写掩码下更新的面具寄存器.

## 行动

```text
VPTESTMB (EVEX encoded versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[j] := (SRC1[i+7:i] BITWISE AND SRC2[i+7:i] != 0)? 1 : 0;

     ELSE DEST[j] = 0                       ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0

VPTESTMW (EVEX encoded versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[j] := (SRC1[i+15:i] BITWISE AND SRC2[i+15:i] != 0)? 1 : 0;

     ELSE DEST[j] = 0                       ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0


VPTESTMD (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[j] := (SRC1[i+31:i] BITWISE AND SRC2[31:0] != 0)? 1 : 0;

                  ELSE DEST[j] := (SRC1[i+31:i] BITWISE AND SRC2[i+31:i] != 0)? 1 : 0;

             FI;

     ELSE DEST[j] := 0                    ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0

VPTESTMQ (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[j] := (SRC1[i+63:i] BITWISE AND SRC2[63:0] != 0)? 1 : 0;

                  ELSE DEST[j] := (SRC1[i+63:i] BITWISE AND SRC2[i+63:i] != 0)? 1 : 0;

             FI;

     ELSE DEST[j] := 0                    ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ 内在编译器

```c
VPTESTMB __mmask64 _mm512_test_epi8_mask( __m512i a, __m512i b);
VPTESTMB __mmask64 _mm512_mask_test_epi8_mask(__mmask64, __m512i a, __m512i b);
VPTESTMW __mmask32 _mm512_test_epi16_mask( __m512i a, __m512i b);
VPTESTMW __mmask32 _mm512_mask_test_epi16_mask(__mmask32, __m512i a, __m512i b);
VPTESTMD __mmask16 _mm512_test_epi32_mask( __m512i a, __m512i b);
VPTESTMD __mmask16 _mm512_mask_test_epi32_mask(__mmask16, __m512i a, __m512i b);
VPTESTMQ __mmask8 _mm512_test_epi64_mask(__m512i a, __m512i b);
VPTESTMQ __mmask8 _mm512_mask_test_epi64_mask(__mmask8, __m512i a, __m512i b);
```

## SIMD 浮点 例外

None.

## 其他例外

VPTESTMD/Q : (中文(简体) ). 参见表2-51,"Type E4类例外条件". VPTESTMB/W: 参见表2-51中的例外类型E4.nb,"类型E4类例外条件".
