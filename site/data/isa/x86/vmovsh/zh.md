---
summary: 移动 标量 FP16 值
---

## 说明

此指令将 FP16 值移动到寄存器或 内存位置 。

两种只寄存器的表单是别名,仅在其操作数编码的地方有所不同;这是所选编码的副作用.

## 行动

```text
VMOVSH dest, src (two operand load)
IF k1[0] or no writemask:

    DEST.fp16[0] := SRC.fp16[0]
ELSE IF *zeroing*:

    DEST.fp16[0] := 0
// ELSE DEST.fp16[0] remains unchanged

DEST[MAXVL:16] := 0

VMOVSH dest, src (two operand store)
IF k1[0] or no writemask:

    DEST.fp16[0] := SRC.fp16[0]
// ELSE DEST.fp16[0] remains unchanged


VMOVSH dest, src1, src2 (three operand copy)
IF k1[0] or no writemask:

    DEST.fp16[0] := SRC2.fp16[0]
ELSE IF *zeroing*:

    DEST.fp16[0] := 0
// ELSE DEST.fp16[0] remains unchanged

DEST[127:16] := SRC1[127:16]
DEST[MAXVL:128] := 0
```

## Intel C/C++ 内在编译器

```c
VMOVSH __m128h _mm_load_sh (void const* mem_addr);
VMOVSH __m128h _mm_mask_load_sh (__m128h src, __mmask8 k, void const* mem_addr);
VMOVSH __m128h _mm_maskz_load_sh (__mmask8 k, void const* mem_addr);
VMOVSH __m128h _mm_mask_move_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VMOVSH __m128h _mm_maskz_move_sh (__mmask8 k, __m128h a, __m128h b);
VMOVSH __m128h _mm_move_sh (__m128h a, __m128h b);
VMOVSH void _mm_mask_store_sh (void * mem_addr, __mmask8 k, __m128h a);
VMOVSH void _mm_store_sh (void * mem_addr, __m128h a);
```

## SIMD 浮点 例外

None

## 其他例外

EVEX-encoded 指令,参见表2-53,"Type E5类例外条件".
