---
summary: Approximation to the Exponential 2^x of Packed Single Precision Floating-Point
---

## Description

Computes the approximate base-2 exponential evaluation of the single precision floating-point values in the source operand (the second operand) and store the results in the destination operand (the first operand) using the writemask k1. The approximate base-2 exponential is evaluated with less than 2^-23 of relative error.

Denormal input values are treated as zeros and do not signal #DE, irrespective of MXCSR.DAZ. Denormal results are flushed to zeros and do not signal #UE, irrespective of MXCSR.FTZ.

The source operand is a ZMM register, a 512-bit memory location, or a 512-bit vector broadcasted from a 32-bit memory location. The destination operand is a ZMM register, conditionally updated using writemask k1.

EVEX.vvvv is reserved and must be 1111b otherwise instructions will #UD.

A numerically exact implementation of VEXP2xx can be found at https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2.

## Operation

```text
VEXP2PS

(KL, VL) = (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+31:i] := EXP2_23_SP(SRC[31:0])

                  ELSE DEST[i+31:i] := EXP2_23_SP(SRC[i+31:i])

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[i+31:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+31:i] := 0

     FI;

FI;

ENDFOR;



Source Input                   Table 8-2. Special Values Behavior  Comments
NaN               Result                                           If (SRC = SNaN) then #I
+                 QNaN(src)
+/-0              +                                                Exact result
-                 1.0f
Integral value N  +0.0f                                            Exact result
                  2^ (N)
```

## Intel C/C++ compiler intrinsics

```c
VEXP2PS __m512 _mm512_exp2a23_round_ps (__m512 a, int sae);
VEXP2PS __m512 _mm512_mask_exp2a23_round_ps (__m512 a, __mmask16 m, __m512 b, int sae);
VEXP2PS __m512 _mm512_maskz_exp2a23_round_ps (__mmask16 m, __m512 b, int sae);
```

## SIMD Floating-Point Exceptions

Invalid (if SNaN input), Overflow.

## Other Exceptions

See Table 2-48, "Type E2 Class Exception Conditions."

VGATHERPF0DPS/VGATHERPF0QPS/VGATHERPF0DPD/VGATHERPF0QPD--Sparse Prefetch Packed SP/DP Data Values With Signed Dword, Signed Qword Indices Using T0 Hint

Opcode/                          Op/ 64/32            CPUID      Description Instruction                      En bit Mode Feature Support Flag

EVEX.512.66.0F38.W0 C6 /1 /vsib  A  V/V               AVX512PF   Using signed dword indices, prefetch sparse byte VGATHERPF0DPS vm32z {k1}                                         memory locations containing single precision data

using opmask k1 and T0 hint.

EVEX.512.66.0F38.W0 C7 /1 /vsib  A  V/V               AVX512PF   Using signed qword indices, prefetch sparse byte VGATHERPF0QPS vm64z {k1} memory locations containing single precision data using opmask k1 and T0 hint.

EVEX.512.66.0F38.W1 C6 /1 /vsib  A  V/V               AVX512PF   Using signed dword indices, prefetch sparse byte VGATHERPF0DPD vm32y {k1}                                         memory locations containing double precision data using opmask k1 and T0 hint.

EVEX.512.66.0F38.W1 C7 /1 /vsib  A  V/V               AVX512PF   Using signed qword indices, prefetch sparse byte VGATHERPF0QPD vm64z {k1}                                         memory locations containing double precision data

using opmask k1 and T0 hint.

## Description

The instruction conditionally prefetches up to sixteen 32-bit or eight 64-bit integer byte data elements. The elements are specified via the VSIB (i.e., the index register is an zmm, holding packed indices). Elements will only be prefetched if their corresponding mask bit is one.

Lines prefetched are loaded into to a location in the cache hierarchy specified by a locality hint (T0):

* T0 (temporal data)--prefetch data into the first level cache.

[PS data] For dword indices, the instruction will prefetch sixteen memory locations. For qword indices, the instruction will prefetch eight values.

[PD data] For dword and qword indices, the instruction will prefetch eight memory locations.

Note that:

(1) The prefetches may happen in any order (or not at all). The instruction is a hint.

(2) The mask is left unchanged.

(3) Not valid with 16-bit effective addresses. Will deliver a #UD fault.

(4) No FP nor memory faults may be produced by this instruction.

(5) Prefetches do not handle cache line splits

(6) A #UD is signaled if the memory operand is encoded without the SIB byte.

## Operation

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist.
VINDEX stands for the memory operand vector of indices (a vector register).
SCALE stands for the memory operand scalar (1, 2, 4 or 8).
DISP is the optional 1, 2 or 4 byte displacement.
PREFETCH(mem, Level, State) Prefetches a byte memory location pointed by `mem' into the cache level specified by `Level'; a request
for exclusive/ownership is done if `State' is 1. Note that the memory location ignore cache line splits. This operation is considered a
hint for the processor and may be skipped depending on implementation.

VGATHERPF0DPS/VGATHERPF0QPS/VGATHERPF0DPD/VGATHERPF0QPD--Sparse Prefetch Packed SP/DP Data Values With Signed


VGATHERPF0DPS (EVEX Encoded Version)
(KL, VL) = (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+31:i]) * SCALE + DISP], Level=0, RFO = 0)
    FI;
ENDFOR

VGATHERPF0DPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+31:k]) * SCALE + DISP], Level=0, RFO = 0)
    FI;
ENDFOR

VGATHERPF0QPS (EVEX Encoded Version)
(KL, VL) = (8, 256)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+63:i]) * SCALE + DISP], Level=0, RFO = 0)
    FI;
ENDFOR

VGATHERPF0QPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+63:k]) * SCALE + DISP], Level=0, RFO = 0)
    FI;
ENDFOR
```

## Intel C/C++ compiler intrinsics

```c
VGATHERPF0DPD void _mm512_mask_prefetch_i32gather_pd(__m256i vdx, __mmask8 m, void * base, int scale, int hint);
VGATHERPF0DPS void _mm512_mask_prefetch_i32gather_ps(__m512i vdx, __mmask16 m, void * base, int scale, int hint);
VGATHERPF0QPD void _mm512_mask_prefetch_i64gather_pd(__m512i vdx, __mmask8 m, void * base, int scale, int hint);
VGATHERPF0QPS void _mm512_mask_prefetch_i64gather_ps(__m512i vdx, __mmask8 m, void * base, int scale, int hint);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-64, "Type E12NP Class Exception Conditions."

VGATHERPF0DPS/VGATHERPF0QPS/VGATHERPF0DPD/VGATHERPF0QPD--Sparse Prefetch Packed SP/DP Data Values With Signed

VGATHERPF1DPS/VGATHERPF1QPS/VGATHERPF1DPD/VGATHERPF1QPD--Sparse Prefetch Packed SP/DP Data Values With Signed Dword, Signed Qword Indices Using T1 Hint

Opcode/                   Op/ 64/32             CPUID      Description Instruction               En bit Mode Feature Support Flag

EVEX.512.66.0F38.W0 C6 /2 /vsib A  V/V          AVX512PF   Using signed dword indices, prefetch sparse byte memory locations containing single precision data using VGATHERPF1DPS vm32z {k1} opmask k1 and T1 hint.

EVEX.512.66.0F38.W0 C7 /2 /vsib A  V/V          AVX512PF   Using signed qword indices, prefetch sparse byte

VGATHERPF1QPS vm64z {k1}                                   memory locations containing single precision data using opmask k1 and T1 hint.

EVEX.512.66.0F38.W1 C6 /2 /vsib A  V/V          AVX512PF   Using signed dword indices, prefetch sparse byte memory locations containing double precision data using VGATHERPF1DPD vm32y {k1}                                   opmask k1 and T1 hint.

EVEX.512.66.0F38.W1 C7 /2 /vsib A  V/V          AVX512PF   Using signed qword indices, prefetch sparse byte memory locations containing double precision data using VGATHERPF1QPD vm64z {k1} opmask k1 and T1 hint.

## Description

The instruction conditionally prefetches up to sixteen 32-bit or eight 64-bit integer byte data elements. The elements are specified via the VSIB (i.e., the index register is an zmm, holding packed indices). Elements will only be prefetched if their corresponding mask bit is one.

Lines prefetched are loaded into to a location in the cache hierarchy specified by a locality hint (T1):

* T1 (temporal data)--prefetch data into the second level cache.

[PS data] For dword indices, the instruction will prefetch sixteen memory locations. For qword indices, the instruction will prefetch eight values.

[PD data] For dword and qword indices, the instruction will prefetch eight memory locations.

Note that:

(1) The prefetches may happen in any order (or not at all). The instruction is a hint.

(2) The mask is left unchanged.

(3) Not valid with 16-bit effective addresses. Will deliver a #UD fault.

(4) No FP nor memory faults may be produced by this instruction.

(5) Prefetches do not handle cache line splits

(6) A #UD is signaled if the memory operand is encoded without the SIB byte.

## Operation

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist.
VINDEX stands for the memory operand vector of indices (a vector register).
SCALE stands for the memory operand scalar (1, 2, 4 or 8).
DISP is the optional 1, 2 or 4 byte displacement.
PREFETCH(mem, Level, State) Prefetches a byte memory location pointed by `mem' into the cache level specified by `Level'; a request
for exclusive/ownership is done if `State' is 1. Note that the memory location ignore cache line splits. This operation is considered a
hint for the processor and may be skipped depending on implementation.

VGATHERPF1DPS/VGATHERPF1QPS/VGATHERPF1DPD/VGATHERPF1QPD--Sparse Prefetch Packed SP/DP Data Values With Signed


VGATHERPF1DPS (EVEX Encoded Version)
(KL, VL) = (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+31:i]) * SCALE + DISP], Level=1, RFO = 0)
    FI;
ENDFOR

VGATHERPF1DPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+31:k]) * SCALE + DISP], Level=1, RFO = 0)
    FI;
ENDFOR

VGATHERPF1QPS (EVEX Encoded Version)
(KL, VL) = (8, 256)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+63:i]) * SCALE + DISP], Level=1, RFO = 0)
    FI;
ENDFOR

VGATHERPF1QPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+63:k]) * SCALE + DISP], Level=1, RFO = 0)
    FI;
ENDFOR
```

## Intel C/C++ compiler intrinsics

```c
VGATHERPF1DPD void _mm512_mask_prefetch_i32gather_pd(__m256i vdx, __mmask8 m, void * base, int scale, int hint);
VGATHERPF1DPS void _mm512_mask_prefetch_i32gather_ps(__m512i vdx, __mmask16 m, void * base, int scale, int hint);
VGATHERPF1QPD void _mm512_mask_prefetch_i64gather_pd(__m512i vdx, __mmask8 m, void * base, int scale, int hint);
VGATHERPF1QPS void _mm512_mask_prefetch_i64gather_ps(__m512i vdx, __mmask8 m, void * base, int scale, int hint);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-64, "Type E12NP Class Exception Conditions."

VGATHERPF1DPS/VGATHERPF1QPS/VGATHERPF1DPD/VGATHERPF1QPD--Sparse Prefetch Packed SP/DP Data Values With Signed
