---
summary: Scale Scalar Float32 Value With Float32 Value
---

## Description

Performs a floating-point scale of the scalar single precision floating-point value in the first source operand by multiplying it by 2 to the power of the float32 value in second source operand.

The equation of this operation is given by:

```text
xmm1 := xmm2*2floor(xmm3).
```

Floor(xmm3) means maximum integer value  xmm3.

If the result cannot be represented in single precision, then the proper overflow response (for positive scaling operand), or the proper underflow response (for negative scaling operand) is issued. The overflow and underflow responses are dependent on the rounding mode (for IEEE-compliant rounding), as well as on other settings in MXCSR (exception mask bits, FTZ bit), and on the SAE bit.

EVEX encoded version: The first source operand is an XMM register. The second source operand is an XMM register or a memory location. The destination operand is an XMM register conditionally updated with writemask k1.

Handling of special-case input values are listed in Table 5-37 and Table 5-41.

## Operation

```text
SCALE(SRC1, SRC2)
{

                ; Check for denormal operands
TMP_SRC2 := SRC2
TMP_SRC1 := SRC1
IF (SRC2 is denormal AND MXCSR.DAZ) THEN TMP_SRC2=0
IF (SRC1 is denormal AND MXCSR.DAZ) THEN TMP_SRC1=0
/* SRC2 is a 32 bits floating-point value */
DEST[31:0] := TMP_SRC1[31:0] * POW(2, Floor(TMP_SRC2[31:0]))
}


VSCALEFSS (EVEX encoded version)

IF (EVEX.b= 1) and SRC2 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] OR *no writemask*

     THEN DEST[31:0] := SCALE(SRC1[31:0], SRC2[31:0])

     ELSE

     IF *merging-masking*                ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                          ; zeroing-masking

           DEST[31:0] := 0

     FI

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compiler intrinsics

```c
VSCALEFSS __m128 _mm_scalef_round_ss(__m128 a, __m128 b, int);
VSCALEFSS __m128 _mm_mask_scalef_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, int);
VSCALEFSS __m128 _mm_maskz_scalef_round_ss(__mmask8 k, __m128 a, __m128 b, int);
```

## SIMD Floating-Point Exceptions

Overflow, Underflow, Invalid, Precision, Denormal (for Src1). Denormal is not reported for Src2.

## Other Exceptions

See Table 2-49, "Type E3 Class Exception Conditions."

VSCATTERDPS/VSCATTERDPD/VSCATTERQPS/VSCATTERQPD--Scatter Packed Single Precision, Packed Double Precision Floating-Point Values with Signed Dword and Qword Indices

Opcode/                       Op/E       64/32     CPUID Feature  Description Instruction                   n          bit Mode  Flag Support

EVEX.128.66.0F38.W0 A2 /vsib  A          V/V       (AVX512VL AND  Using signed dword indices, scatter single-

VSCATTERDPS vm32x {k1}, xmm1                       AVX512F) OR    precision floating-point values to memory using

```text
                                                   AVX10.1        writemask k1.
```

EVEX.256.66.0F38.W0 A2 /vsib  A          V/V       (AVX512VL AND  Using signed dword indices, scatter single-

```text
                                                   AVX512F) OR    precision floating-point values to memory using
```

VSCATTERDPS vm32y {k1}, ymm1

```text
                                                   AVX10.1        writemask k1.
```

EVEX.512.66.0F38.W0 A2 /vsib  A          V/V       AVX512F        Using signed dword indices, scatter single-

```text
                                                   OR AVX10.1     precision floating-point values to memory using
```

VSCATTERDPS vm32z {k1}, zmm1                                      writemask k1.

EVEX.128.66.0F38.W1 A2 /vsib  A          V/V       (AVX512VL AND  Using signed dword indices, scatter double

VSCATTERDPD vm32x {k1}, xmm1                       AVX512F) OR    precision floating-point values to memory using

```text
                                                   AVX10.1        writemask k1.
```

EVEX.256.66.0F38.W1 A2 /vsib  A          V/V       (AVX512VL AND  Using signed dword indices, scatter double

VSCATTERDPD vm32y {k1}, ymm1                       AVX512F) OR    precision floating-point values to memory using

```text
                                                   AVX10.1        writemask k1.
```

EVEX.512.66.0F38.W1 A2 /vsib  A          V/V       AVX512F        Using signed dword indices, scatter double

```text
                                                   OR AVX10.1     precision floating-point values to memory using
```

VSCATTERDPD vm32z {k1}, zmm1 writemask k1.

EVEX.128.66.0F38.W0 A3 /vsib  A          V/V       (AVX512VL AND  Using signed qword indices, scatter single-

```text
                                                   AVX512F) OR    precision floating-point values to memory using
```

VSCATTERQPS vm64x {k1}, xmm1                       AVX10.1        writemask k1.

EVEX.256.66.0F38.W0 A3 /vsib  A          V/V       (AVX512VL AND  Using signed qword indices, scatter single-

VSCATTERQPS vm64y {k1}, xmm1                       AVX512F) OR    precision floating-point values to memory using

```text
                                                   AVX10.1        writemask k1.
```

EVEX.512.66.0F38.W0 A3 /vsib  A          V/V       AVX512F        Using signed qword indices, scatter single-

```text
                                                   OR AVX10.1     precision floating-point values to memory using
```

VSCATTERQPS vm64z {k1}, ymm1 writemask k1.

EVEX.128.66.0F38.W1 A3 /vsib  A          V/V       (AVX512VL AND  Using signed qword indices, scatter double

```text
                                                   AVX512F) OR    precision floating-point values to memory using
```

VSCATTERQPD vm64x {k1}, xmm1                       AVX10.1        writemask k1.

EVEX.256.66.0F38.W1 A3 /vsib  A          V/V       (AVX512VL AND  Using signed qword indices, scatter double

VSCATTERQPD vm64y {k1}, ymm1                       AVX512F) OR    precision floating-point values to memory using

```text
                                                   AVX10.1        writemask k1.
```

EVEX.512.66.0F38.W1 A3 /vsib  A          V/V       AVX512F        Using signed qword indices, scatter double

```text
                                                   OR AVX10.1     precision floating-point values to memory using
```

VSCATTERQPD vm64z {k1}, zmm1 writemask k1.

## Description

Stores up to four, eight, or 16 single precision elements (or two, four, or eight double precision elements) in doubleword/quadword vector xmm1, ymm1, or zmm1, to the memory locations pointed by base address BASE_ADDR and index vector VINDEX, with scale SCALE. The elements are specified via the VSIB (i.e., the index register is a vector register, holding packed indices). Elements will only be stored if their corresponding mask bit is one. The entire mask register will be set to zero by this instruction unless it triggers an exception.

This instruction can be suspended by an exception if at least one element is already scattered (i.e., if the exception is triggered by an element other than the rightmost one with its mask bit set). When this happens, the destination register and the mask register (k1) are partially updated. If any traps or interrupts are pending from already scattered elements, they will be delivered in lieu of the exception; in this case, EFLAG.RF is set to one so an instruction breakpoint is not re-triggered when the instruction is continued.

Note that:

* Only writes to overlapping vector indices are guaranteed to be ordered with respect to each other (from LSB to

MSB of the source registers). Note that this also include partially overlapping vector indices. Writes that are not overlapped may happen in any order. Memory ordering with other instructions follows the Intel-64 memory ordering model. Note that this does not account for non-overlapping indices that map into the same physical address locations.

* If two or more destination indices completely overlap, the "earlier" write(s) may be skipped. * Faults are delivered in a right-to-left manner. That is, if a fault is triggered by an element and delivered, all

elements closer to the LSB of the source register xmm, ymm, or zmm will be completed (and non-faulting). Individual elements closer to the MSB may or may not be completed. If a given element triggers multiple faults, they are delivered in the conventional order.

* Elements may be scattered in any order, but faults must be delivered in a right-to left order; thus, elements to

the left of a faulting one may be scattered before the fault is delivered. A given implementation of this instruction is repeatable - given the same input values and architectural state, the same set of elements to the left of the faulting one will be scattered.

* This instruction does not perform AC checks, and so will never deliver an AC fault. * Not valid with 16-bit effective addresses. Will deliver a #UD fault. * If this instruction overwrites itself and then takes a fault, only a subset of elements may be completed before

the fault is delivered (as described above). If the fault handler completes and attempts to re-execute this instruction, the new instruction will be executed, and the scatter will not complete.

Note that the presence of VSIB byte is enforced in this instruction. Hence, the instruction will #UD fault if ModRM.rm is different than 100b.

This instruction has special disp8*N and alignment rules. N is considered to be the size of a single vector element.

The scaled index may require more bits to represent than the address bits used by the processor (e.g., in 32-bit mode, if the scale is greater than one). In this case, the most significant bits beyond the number of address bits are ignored.

The instruction will #UD fault if the k0 mask register is specified.

## Operation

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist
VINDEX stands for the memory operand vector of indices (a ZMM register)
SCALE stands for the memory operand scalar (1, 2, 4 or 8)
DISP is the optional 1 or 4 byte displacement

VSCATTERDPS/VSCATTERDPD/VSCATTERQPS/VSCATTERQPD--Scatter Packed Single Precision, Packed Double Precision Floating-

VSCATTERDPS (EVEX encoded versions)
(KL, VL)= (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR +SignExtend(VINDEX[i+31:i]) * SCALE + DISP] :=
                SRC[i+31:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VSCATTERDPD (EVEX encoded versions)
(KL, VL)= (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR +SignExtend(VINDEX[k+31:k]) * SCALE + DISP] :=
                SRC[i+63:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VSCATTERQPS (EVEX encoded versions)
(KL, VL)= (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    k := j * 64
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR + (VINDEX[k+63:k]) * SCALE + DISP] :=
                SRC[i+31:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VSCATTERQPD (EVEX encoded versions)
(KL, VL)= (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR + (VINDEX[i+63:i]) * SCALE + DISP] :=
                SRC[i+63:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VSCATTERDPS/VSCATTERDPD/VSCATTERQPS/VSCATTERQPD--Scatter Packed Single Precision, Packed Double Precision Floating-
```

## Intel C/C++ compiler intrinsics

```c
VSCATTERDPD void _mm512_i32scatter_pd(void * base, __m512i vdx, __m512d a, int scale);
VSCATTERDPD void _mm512_mask_i32scatter_pd(void * base, __mmask8 k, __m512i vdx, __m512d a, int scale);
VSCATTERDPS void _mm512_i32scatter_ps(void * base, __m512i vdx, __m512 a, int scale);
VSCATTERDPS void _mm512_mask_i32scatter_ps(void * base, __mmask16 k, __m512i vdx, __m512 a, int scale);
VSCATTERQPD void _mm512_i64scatter_pd(void * base, __m512i vdx, __m512d a, int scale);
VSCATTERQPD void _mm512_mask_i64scatter_pd(void * base, __mmask8 k, __m512i vdx, __m512d a, int scale);
VSCATTERQPS void _mm512_i64scatter_ps(void * base, __m512i vdx, __m512 a, int scale);
VSCATTERQPS void _mm512_mask_i64scatter_ps(void * base, __mmask8 k, __m512i vdx, __m512 a, int scale);
VSCATTERDPD void _mm256_i32scatter_pd(void * base, __m256i vdx, __m256d a, int scale);
VSCATTERDPD void _mm256_mask_i32scatter_pd(void * base, __mmask8 k, __m256i vdx, __m256d a, int scale);
VSCATTERDPS void _mm256_i32scatter_ps(void * base, __m256i vdx, __m256 a, int scale);
VSCATTERDPS void _mm256_mask_i32scatter_ps(void * base, __mmask8 k, __m256i vdx, __m256 a, int scale);
VSCATTERQPD void _mm256_i64scatter_pd(void * base, __m256i vdx, __m256d a, int scale);
VSCATTERQPD void _mm256_mask_i64scatter_pd(void * base, __mmask8 k, __m256i vdx, __m256d a, int scale);
VSCATTERQPS void _mm256_i64scatter_ps(void * base, __m256i vdx, __m256 a, int scale);
VSCATTERQPS void _mm256_mask_i64scatter_ps(void * base, __mmask8 k, __m256i vdx, __m256 a, int scale);
VSCATTERDPD void _mm_i32scatter_pd(void * base, __m128i vdx, __m128d a, int scale);
VSCATTERDPD void _mm_mask_i32scatter_pd(void * base, __mmask8 k, __m128i vdx, __m128d a, int scale);
VSCATTERDPS void _mm_i32scatter_ps(void * base, __m128i vdx, __m128 a, int scale);
VSCATTERDPS void _mm_mask_i32scatter_ps(void * base, __mmask8 k, __m128i vdx, __m128 a, int scale);
VSCATTERQPD void _mm_i64scatter_pd(void * base, __m128i vdx, __m128d a, int scale);
VSCATTERQPD void _mm_mask_i64scatter_pd(void * base, __mmask8 k, __m128i vdx, __m128d a, int scale);
VSCATTERQPS void _mm_i64scatter_ps(void * base, __m128i vdx, __m128 a, int scale);
VSCATTERQPS void _mm_mask_i64scatter_ps(void * base, __mmask8 k, __m128i vdx, __m128 a, int scale);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-63, "Type E12 Class Exception Conditions."

VSCATTERDPS/VSCATTERDPD/VSCATTERQPS/VSCATTERQPD--Scatter Packed Single Precision, Packed Double Precision Floating-
