---
summary: 计算 DWORDS / QUADWORDS 之间的间断
---

## 说明

此指令会写一个偶数/ 偶数的口罩登记簿 。 MODRM.REG字段所示的面具注册目的地用于构成注册对的基础. 该字段的低位被遮蔽( 设置为零) 以创建对子的第一个寄存器 。

EVEX.aaa and EVEX.z must be zero.

## 行动

```text
VP2INTERSECTD destmask, src1, src2
(KL, VL) = (4, 128), (8, 256), (16, 512)

// dest_mask_reg_id is the register id specified in the instruction for destmask
dest_base := dest_mask_reg_id & ~1

// maskregs[ ] is an array representing the mask registers
maskregs[dest_base+0][MAX_KL-1:0] := 0
maskregs[dest_base+1][MAX_KL-1:0] := 0

FOR i := 0 to KL-1:
    FOR j := 0 to KL-1:
         match := (src1.dword[i] == src2.dword[j])
          maskregs[dest_base+0].bit[i] |= match
          maskregs[dest_base+1].bit[j] |= match

VP2INTERSECTQ destmask, src1, src2
(KL, VL) = (2, 128), (4, 256), (8, 512)

// dest_mask_reg_id is the register id specified in the instruction for destmask
dest_base := dest_mask_reg_id & ~1

// maskregs[ ] is an array representing the mask registers
maskregs[dest_base+0][MAX_KL-1:0] := 0
maskregs[dest_base+1][MAX_KL-1:0] := 0

FOR i = 0 to KL-1:
    FOR j = 0 to KL-1:
         match := (src1.qword[i] == src2.qword[j])
          maskregs[dest_base+0].bit[i] |= match
          maskregs[dest_base+1].bit[j] |= match
```

## Intel C/C++ 内在编译器

```c
VP2INTERSECTD void _mm_2intersect_epi32(__m128i, __m128i, __mmask8 *, __mmask8 *);
VP2INTERSECTD void _mm256_2intersect_epi32(__m256i, __m256i, __mmask8 *, __mmask8 *);
VP2INTERSECTD void _mm512_2intersect_epi32(__m512i, __m512i, __mmask16 *, __mmask16 *);
VP2INTERSECTQ void _mm_2intersect_epi64(__m128i, __m128i, __mmask8 *, __mmask8 *);
VP2INTERSECTQ void _mm256_2intersect_epi64(__m256i, __m256i, __mmask8 *, __mmask8 *);
VP2INTERSECTQ void _mm512_2intersect_epi64(__m512i, __m512i, __mmask8 *, __mmask8 *);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-52"Type E4NF类例外条件".
