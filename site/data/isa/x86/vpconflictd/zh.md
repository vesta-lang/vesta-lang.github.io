---
summary: 检测包装词/词值的矢量内的冲突
---

## 说明

测试源操作数(第二个操作数)的每个dword/qword元素,以与源操作数中所有其他元素在最接近最小元素时平等. 每个元素的比较结果都形成一个位向量,然后按照写掩码将零延伸并写入目的地.

EVEX.512 编码版本 : 源操作数是一个ZMM寄存器,512位内存位置,或512位矢量从32/64位内存位置广播. 目标操作数是一个ZMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.256 编码版本 : 源操作数是一个YMM的寄存器,256位的内存位置,或由32/64位的内存位置广播的256位矢量. 目标操作数是一个YMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.128 编码版本 : 源操作数是一个XMM寄存器,一个128位的内存位置,或者从32/64位的内存位置广播128位的矢量. 目标操作数是一个XMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VPCONFLICTD
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j*32
    IF MaskBit(j) OR *no writemask* THEN

          FOR k := 0 TO j-1
                m := k*32
                IF ((SRC[i+31:i] = SRC[m+31:m])) THEN
                       DEST[i+k] := 1
                ELSE
                       DEST[i+k] := 0
                FI

          ENDFOR
          DEST[i+31:i+j] := 0
    ELSE
          IF *merging-masking* THEN

                *DEST[i+31:i] remains unchanged*
          ELSE

                DEST[i+31:i] := 0
          FI
    FI
ENDFOR

DEST[MAXVL-1:VL] := 0

VPCONFLICTQ
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

      i := j*64
      IF MaskBit(j) OR *no writemask* THEN

          FOR k := 0 TO j-1

                m := k*64
                 IF ((SRC[i+63:i] = SRC[m+63:m])) THEN

                       DEST[i+k] := 1
                 ELSE

                       DEST[i+k] := 0
                 FI
           ENDFOR
           DEST[i+63:i+j] := 0
     ELSE
           IF *merging-masking* THEN
                 *DEST[i+63:i] remains unchanged*
            ELSE
                  DEST[i+63:i] := 0
            FI
     FI
ENDFOR
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPCONFLICTD __m512i _mm512_conflict_epi32( __m512i a);
VPCONFLICTD __m512i _mm512_mask_conflict_epi32(__m512i s, __mmask16 m, __m512i a);
VPCONFLICTD __m512i _mm512_maskz_conflict_epi32(__mmask16 m, __m512i a);
VPCONFLICTQ __m512i _mm512_conflict_epi64( __m512i a);
VPCONFLICTQ __m512i _mm512_mask_conflict_epi64(__m512i s, __mmask8 m, __m512i a);
VPCONFLICTQ __m512i _mm512_maskz_conflict_epi64(__mmask8 m, __m512i a);
VPCONFLICTD __m256i _mm256_conflict_epi32( __m256i a);
VPCONFLICTD __m256i _mm256_mask_conflict_epi32(__m256i s, __mmask8 m, __m256i a);
VPCONFLICTD __m256i _mm256_maskz_conflict_epi32(__mmask8 m, __m256i a);
VPCONFLICTQ __m256i _mm256_conflict_epi64( __m256i a);
VPCONFLICTQ __m256i _mm256_mask_conflict_epi64(__m256i s, __mmask8 m, __m256i a);
VPCONFLICTQ __m256i _mm256_maskz_conflict_epi64(__mmask8 m, __m256i a);
VPCONFLICTD __m128i _mm_conflict_epi32( __m128i a);
VPCONFLICTD __m128i _mm_mask_conflict_epi32(__m128i s, __mmask8 m, __m128i a);
VPCONFLICTD __m128i _mm_maskz_conflict_epi32(__mmask8 m, __m128i a);
VPCONFLICTQ __m128i _mm_conflict_epi64( __m128i a);
VPCONFLICTQ __m128i _mm_mask_conflict_epi64(__m128i s, __mmask8 m, __m128i a);
VPCONFLICTQ __m128i _mm_maskz_conflict_epi64(__mmask8 m, __m128i a);
```

## SIMD 浮点 例外

None

## 其他例外

EVEX-encoded discription,参见表2-52,"Type E4NF类例外条件".
