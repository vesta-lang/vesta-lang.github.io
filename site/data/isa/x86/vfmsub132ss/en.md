---
summary: Fused Multiply-Subtract of Scalar Single
---

## Description

Performs a SIMD multiply-subtract computation on the low packed single precision floating-point values using three source operands and writes the multiply-subtract result in the destination operand. The destination operand is also the first source operand. The second operand must be a XMM register. The third source operand can be a XMM register or a 32-bit memory location.

VFMSUB132SS: Multiplies the low packed single precision floating-point value from the first source operand to the low packed single precision floating-point value in the third source operand. From the infinite precision intermediate result, subtracts the low packed single precision floating-point values in the second source operand, performs rounding and stores the resulting packed single precision floating-point value to the destination operand (first source operand).

VFMSUB213SS: Multiplies the low packed single precision floating-point value from the second source operand to the low packed single precision floating-point value in the first source operand. From the infinite precision intermediate result, subtracts the low packed single precision floating-point value in the third source operand, performs rounding and stores the resulting packed single precision floating-point value to the destination operand (first source operand).

VFMSUB231SS: Multiplies the low packed single precision floating-point value from the second source to the low packed single precision floating-point value in the third source operand. From the infinite precision intermediate result, subtracts the low packed single precision floating-point value in the first source operand, performs rounding and stores the resulting packed single precision floating-point value to the destination operand (first source operand).

VEX.128 and EVEX encoded version: The destination operand (also first source operand) is encoded in reg_field. The second source operand is encoded in VEX.vvvv/EVEX.vvvv. The third source operand is encoded in rm_field. Bits 127:32 of the destination are unchanged. Bits MAXVL-1:128 of the destination register are zeroed.

EVEX encoded version: The low doubleword element of the destination is updated according to the writemask.

Compiler tools may optionally support a complementary mnemonic for each instruction mnemonic listed in the opcode/instruction column of the summary table. The behavior of the complementary mnemonic in situations involving NANs are governed by the definition of the instruction mnemonic defined in the opcode/instruction column.

## Operation

```text
In the operations below, "*" and "-" symbols represent multiplication and subtraction with infinite precision inputs and outputs (no
rounding).

VFMSUB132SS DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundFPControl(DEST[31:0]*SRC3[31:0] - SRC2[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := DEST[127:32]

DEST[MAXVL-1:128] := 0

VFMSUB213SS DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundFPControl(SRC2[31:0]*DEST[31:0] - SRC3[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := DEST[127:32]

DEST[MAXVL-1:128] := 0


VFMSUB231SS DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundFPControl(SRC2[31:0]*SRC3[63:0] - DEST[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := DEST[127:32]

DEST[MAXVL-1:128] := 0

VFMSUB132SS DEST, SRC2, SRC3 (VEX encoded version)
DEST[31:0] := RoundFPControl_MXCSR(DEST[31:0]*SRC3[31:0] - SRC2[31:0])
DEST[127:32] := DEST[127:32]
DEST[MAXVL-1:128] := 0

VFMSUB213SS DEST, SRC2, SRC3 (VEX encoded version)
DEST[31:0] := RoundFPControl_MXCSR(SRC2[31:0]*DEST[31:0] - SRC3[31:0])
DEST[127:32] := DEST[127:32]
DEST[MAXVL-1:128] := 0

VFMSUB231SS DEST, SRC2, SRC3 (VEX encoded version)
DEST[31:0] := RoundFPControl_MXCSR(SRC2[31:0]*SRC3[31:0] - DEST[31:0])
DEST[127:32] := DEST[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compiler intrinsics

```c
VFMSUBxxxSS __m128 _mm_fmsub_round_ss(__m128 a, __m128 b, __m128 c, int r);
VFMSUBxxxSS __m128 _mm_mask_fmsub_ss(__m128 a, __mmask8 k, __m128 b, __m128 c);
VFMSUBxxxSS __m128 _mm_maskz_fmsub_ss(__mmask8 k, __m128 a, __m128 b, __m128 c);
VFMSUBxxxSS __m128 _mm_mask3_fmsub_ss(__m128 a, __m128 b, __m128 c, __mmask8 k);
VFMSUBxxxSS __m128 _mm_mask_fmsub_round_ss(__m128 a, __mmask8 k, __m128 b, __m128 c, int r);
VFMSUBxxxSS __m128 _mm_maskz_fmsub_round_ss(__mmask8 k, __m128 a, __m128 b, __m128 c, int r);
VFMSUBxxxSS __m128 _mm_mask3_fmsub_round_ss(__m128 a, __m128 b, __m128 c, __mmask8 k, int r);
VFMSUBxxxSS __m128 _mm_fmsub_ss (__m128 a, __m128 b, __m128 c);
```

## SIMD Floating-Point Exceptions

Overflow, Underflow, Invalid, Precision, Denormal

## Other Exceptions

VEX-encoded instructions, see Table 2-20, "Type 3 Class Exception Conditions." EVEX-encoded instructions, see Table 2-49, "Type E3 Class Exception Conditions."

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision Floating-Point Values

Opcode/                       Op / 64/32  CPUID Feature  Description Instruction                   En Bit Mode Flag Support

VEX.128.66.0F38.W1 97 /r      A  V/V      FMA            Multiply packed double precision floating-point

VFMSUBADD132PD xmm1, xmm2,                               values from xmm1 and xmm3/mem, subtract/add elements in xmm2 and put result xmm3/m128                                                in xmm1.

VEX.128.66.0F38.W1 A7 /r      A  V/V      FMA            Multiply packed double precision floating-point

VFMSUBADD213PD xmm1, xmm2,                               values from xmm1 and xmm2, subtract/add elements in xmm3/mem and put result in xmm1. xmm3/m128

VEX.128.66.0F38.W1 B7 /r      A  V/V      FMA            Multiply packed double precision floating-point values from xmm2 and xmm3/mem, VFMSUBADD231PD xmm1, xmm2, subtract/add elements in xmm1 and put result xmm3/m128                                                in xmm1.

VEX.256.66.0F38.W1 97 /r      A  V/V      FMA            Multiply packed double precision floating-point

VFMSUBADD132PD ymm1, ymm2,                               values from ymm1 and ymm3/mem, subtract/add elements in ymm2 and put result ymm3/m256                                                in ymm1.

VEX.256.66.0F38.W1 A7 /r      A  V/V      FMA            Multiply packed double precision floating-point

VFMSUBADD213PD ymm1, ymm2,                               values from ymm1 and ymm2, subtract/add elements in ymm3/mem and put result in ymm1. ymm3/m256

VEX.256.66.0F38.W1 B7 /r      A  V/V      FMA            Multiply packed double precision floating-point values from ymm2 and ymm3/mem, VFMSUBADD231PD ymm1, ymm2, subtract/add elements in ymm1 and put result ymm3/m256                                                in ymm1.

EVEX.128.66.0F38.W1 97 /r     B  V/V      (AVX512VL AND  Multiply packed double precision floating-point

```text
                                          AVX512F) OR    values from xmm1 and xmm3/m128/m64bcst,
```

VFMSUBADD132PD xmm1 {k1}{z},

```text
                                          AVX10.1        subtract/add elements in xmm2 and put result
```

xmm2, xmm3/m128/m64bcst                                  in xmm1 subject to writemask k1.

EVEX.128.66.0F38.W1 A7 /r     B  V/V      (AVX512VL AND  Multiply packed double precision floating-point

```text
                                          AVX512F) OR    values from xmm1 and xmm2, subtract/add
```

VFMSUBADD213PD xmm1 {k1}{z},

```text
                                          AVX10.1        elements in xmm3/m128/m64bcst and put
```

xmm2, xmm3/m128/m64bcst                                  result in xmm1 subject to writemask k1.

EVEX.128.66.0F38.W1 B7 /r     B  V/V      (AVX512VL AND  Multiply packed double precision floating-point

```text
                                          AVX512F) OR    values from xmm2 and xmm3/m128/m64bcst,
```

VFMSUBADD231PD xmm1 {k1}{z},

```text
                                          AVX10.1        subtract/add elements in xmm1 and put result
```

xmm2, xmm3/m128/m64bcst                                  in xmm1 subject to writemask k1.

EVEX.256.66.0F38.W1 97 /r     B  V/V      (AVX512VL AND  Multiply packed double precision floating-point

```text
                                          AVX512F) OR    values from ymm1 and ymm3/m256/m64bcst,
```

VFMSUBADD132PD ymm1 {k1}{z},

```text
                                          AVX10.1        subtract/add elements in ymm2 and put result
```

ymm2, ymm3/m256/m64bcst                                  in ymm1 subject to writemask k1.

EVEX.256.66.0F38.W1 A7 /r     B  V/V      (AVX512VL AND  Multiply packed double precision floating-point

```text
                                          AVX512F) OR    values from ymm1 and ymm2, subtract/add
```

VFMSUBADD213PD ymm1 {k1}{z},

```text
                                          AVX10.1        elements in ymm3/m256/m64bcst and put
```

ymm2, ymm3/m256/m64bcst                                  result in ymm1 subject to writemask k1.

EVEX.256.66.0F38.W1 B7 /r     B  V/V      (AVX512VL AND  Multiply packed double precision floating-point

```text
                                          AVX512F) OR    values from ymm2 and ymm3/m256/m64bcst,
```

VFMSUBADD231PD ymm1 {k1}{z},

```text
                                          AVX10.1        subtract/add elements in ymm1 and put result
```

ymm2, ymm3/m256/m64bcst                                  in ymm1 subject to writemask k1.

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

Opcode/                       Op / 64/32          CPUID Feature  Description Instruction                   En Bit Mode Flag

```text
                                         Support                 Multiply packed double precision floating-point
```

EVEX.512.66.0F38.W1 97 /r                                        values from zmm1 and zmm3/m512/m64bcst, VFMSUBADD132PD zmm1 {k1}{z},  B          V/V      AVX512F        subtract/add elements in zmm2 and put result in zmm2, zmm3/m512/m64bcst{er}                       OR AVX10.1     zmm1 subject to writemask k1.

EVEX.512.66.0F38.W1 A7 /r     B          V/V      AVX512F        Multiply packed double precision floating-point VFMSUBADD213PD zmm1 {k1}{z},                      OR AVX10.1     values from zmm1 and zmm2, subtract/add zmm2, zmm3/m512/m64bcst{er}                                      elements in zmm3/m512/m64bcst and put

```text
                              B          V/V      AVX512F        result in zmm1 subject to writemask k1.
```

EVEX.512.66.0F38.W1 B7 /r                         OR AVX10.1 VFMSUBADD231PD zmm1 {k1}{z},                                     Multiply packed double precision floating-point zmm2, zmm3/m512/m64bcst{er}                                      values from zmm2 and zmm3/m512/m64bcst, subtract/add elements in zmm1 and put result in zmm1 subject to writemask k1.

## Description

VFMSUBADD132PD: Multiplies the two, four, or eight packed double precision floating-point values from the first source operand to the two or four packed double precision floating-point values in the third source operand. From the infinite precision intermediate result, subtracts the odd double precision floating-point elements and adds the even double precision floating-point values in the second source operand, performs rounding and stores the resulting two or four packed double precision floating-point values to the destination operand (first source operand).

VFMSUBADD213PD: Multiplies the two, four, or eight packed double precision floating-point values from the second source operand to the two or four packed double precision floating-point values in the first source operand. From the infinite precision intermediate result, subtracts the odd double precision floating-point elements and adds the even double precision floating-point values in the third source operand, performs rounding and stores the resulting two or four packed double precision floating-point values to the destination operand (first source operand).

VFMSUBADD231PD: Multiplies the two, four, or eight packed double precision floating-point values from the second source operand to the two or four packed double precision floating-point values in the third source operand. From the infinite precision intermediate result, subtracts the odd double precision floating-point elements and adds the even double precision floating-point values in the first source operand, performs rounding and stores the resulting two or four packed double precision floating-point values to the destination operand (first source operand).

EVEX encoded versions: The destination operand (also first source operand) and the second source operand are ZMM/YMM/XMM register. The third source operand is a ZMM/YMM/XMM register, a 512/256/128-bit memory location or a 512/256/128-bit vector broadcasted from a 64-bit memory location. The destination operand is conditionally updated with write mask k1.

VEX.256 encoded version: The destination operand (also first source operand) is a YMM register and encoded in reg_field. The second source operand is a YMM register and encoded in VEX.vvvv. The third source operand is a YMM register or a 256-bit memory location and encoded in rm_field.

VEX.128 encoded version: The destination operand (also first source operand) is a XMM register and encoded in reg_field. The second source operand is a XMM register and encoded in VEX.vvvv. The third source operand is a XMM register or a 128-bit memory location and encoded in rm_field. The upper 128 bits of the YMM destination register are zeroed.

Compiler tools may optionally support a complementary mnemonic for each instruction mnemonic listed in the opcode/instruction column of the summary table. The behavior of the complementary mnemonic in situations

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

involving NANs are governed by the definition of the instruction mnemonic defined in the opcode/instruction column.

## Operation

```text
In the operations below, "*" and "+" symbols represent multiplication and addition with infinite precision inputs and outputs (no
rounding).

VFMSUBADD132PD DEST, SRC2, SRC3
IF (VEX.128) THEN

    DEST[63:0] := RoundFPControl_MXCSR(DEST[63:0]*SRC3[63:0] + SRC2[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(DEST[127:64]*SRC3[127:64] - SRC2[127:64])
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[63:0] := RoundFPControl_MXCSR(DEST[63:0]*SRC3[63:0] + SRC2[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(DEST[127:64]*SRC3[127:64] - SRC2[127:64])
    DEST[191:128] := RoundFPControl_MXCSR(DEST[191:128]*SRC3[191:128] + SRC2[191:128])
    DEST[255:192] := RoundFPControl_MXCSR(DEST[255:192]*SRC3[255:192] - SRC2[255:192]
FI

VFMSUBADD213PD DEST, SRC2, SRC3
IF (VEX.128) THEN

    DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*DEST[63:0] + SRC3[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(SRC2[127:64]*DEST[127:64] - SRC3[127:64])
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*DEST[63:0] + SRC3[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(SRC2[127:64]*DEST[127:64] - SRC3[127:64])
    DEST[191:128] := RoundFPControl_MXCSR(SRC2[191:128]*DEST[191:128] + SRC3[191:128])
    DEST[255:192] := RoundFPControl_MXCSR(SRC2[255:192]*DEST[255:192] - SRC3[255:192]
FI

VFMSUBADD231PD DEST, SRC2, SRC3
IF (VEX.128) THEN

    DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*SRC3[63:0] + DEST[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(SRC2[127:64]*SRC3[127:64] - DEST[127:64])
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*SRC3[63:0] + DEST[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(SRC2[127:64]*SRC3[127:64] - DEST[127:64])
    DEST[191:128] := RoundFPControl_MXCSR(SRC2[191:128]*SRC3[191:128] + DEST[191:128])
    DEST[255:192] := RoundFPControl_MXCSR(SRC2[255:192]*SRC3[255:192] - DEST[255:192]
FI

VFMSUBADD132PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF (VL = 512) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

     THEN

        IF j *is even*

            THEN DEST[i+63:i] :=

            RoundFPControl(DEST[i+63:i]*SRC3[i+63:i] + SRC2[i+63:i])

            ELSE DEST[i+63:i] :=

            RoundFPControl(DEST[i+63:i]*SRC3[i+63:i] - SRC2[i+63:i])

        FI

     ELSE

        IF *merging-masking*      ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE                  ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[63:0] + SRC2[i+63:i])
                                  ELSE
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[i+63:i] + SRC2[i+63:i])
                            FI;
                      ELSE
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[63:0] - SRC2[i+63:i])
                                  ELSE
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[i+63:i] - SRC2[i+63:i])
                            FI;
                FI

     ELSE

        IF *merging-masking*      ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE                  ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

VFMSUBADD213PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (2, 128), (4, 256), (8, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+63:i] :=

                      RoundFPControl(SRC2[i+63:i]*DEST[i+63:i] + SRC3[i+63:i])

                      ELSE DEST[i+63:i] :=

                      RoundFPControl(SRC2[i+63:i]*DEST[i+63:i] - SRC3[i+63:i])

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD213PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] + SRC3[63:0])
                                  ELSE
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] + SRC3[i+63:i])
                            FI;
                      ELSE
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] - SRC3[63:0])
                                  ELSE
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] - SRC3[i+63:i])

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

                      FI;

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (2, 128), (4, 256), (8, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+63:i] :=

                      RoundFPControl(SRC2[i+63:i]*SRC3[i+63:i] + DEST[i+63:i])

                      ELSE DEST[i+63:i] :=

                      RoundFPControl(SRC2[i+63:i]*SRC3[i+63:i] - DEST[i+63:i])

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[63:0] + DEST[i+63:i])
                                  ELSE

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

                              DEST[i+63:i] :=
                  RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[i+63:i] + DEST[i+63:i])
                  FI;
            ELSE
                  IF (EVEX.b = 1)

                        THEN
                              DEST[i+63:i] :=

                  RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[63:0] - DEST[i+63:i])

                       ELSE

                       DEST[i+63:i] :=

            RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[i+63:i] - DEST[i+63:i])

            FI;

        FI

     ELSE

        IF *merging-masking*            ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE                        ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VFMSUBADDxxxPD __m512d _mm512_fmsubadd_pd(__m512d a, __m512d b, __m512d c);
VFMSUBADDxxxPD __m512d _mm512_fmsubadd_round_pd(__m512d a, __m512d b, __m512d c, int r);
VFMSUBADDxxxPD __m512d _mm512_mask_fmsubadd_pd(__m512d a, __mmask8 k, __m512d b, __m512d c);
VFMSUBADDxxxPD __m512d _mm512_maskz_fmsubadd_pd(__mmask8 k, __m512d a, __m512d b, __m512d c);
VFMSUBADDxxxPD __m512d _mm512_mask3_fmsubadd_pd(__m512d a, __m512d b, __m512d c, __mmask8 k);
VFMSUBADDxxxPD __m512d _mm512_mask_fmsubadd_round_pd(__m512d a, __mmask8 k, __m512d b, __m512d c, int r);
VFMSUBADDxxxPD __m512d _mm512_maskz_fmsubadd_round_pd(__mmask8 k, __m512d a, __m512d b, __m512d c, int r);
VFMSUBADDxxxPD __m512d _mm512_mask3_fmsubadd_round_pd(__m512d a, __m512d b, __m512d c, __mmask8 k, int r);
VFMSUBADDxxxPD __m256d _mm256_mask_fmsubadd_pd(__m256d a, __mmask8 k, __m256d b, __m256d c);
VFMSUBADDxxxPD __m256d _mm256_maskz_fmsubadd_pd(__mmask8 k, __m256d a, __m256d b, __m256d c);
VFMSUBADDxxxPD __m256d _mm256_mask3_fmsubadd_pd(__m256d a, __m256d b, __m256d c, __mmask8 k);
VFMSUBADDxxxPD __m128d _mm_mask_fmsubadd_pd(__m128d a, __mmask8 k, __m128d b, __m128d c);
VFMSUBADDxxxPD __m128d _mm_maskz_fmsubadd_pd(__mmask8 k, __m128d a, __m128d b, __m128d c);
VFMSUBADDxxxPD __m128d _mm_mask3_fmsubadd_pd(__m128d a, __m128d b, __m128d c, __mmask8 k);
VFMSUBADDxxxPD __m128d _mm_fmsubadd_pd (__m128d a, __m128d b, __m128d c);
VFMSUBADDxxxPD __m256d _mm256_fmsubadd_pd (__m256d a, __m256d b, __m256d c);
```

## SIMD Floating-Point Exceptions

Overflow, Underflow, Invalid, Precision, Denormal.

## Other Exceptions

VEX-encoded instructions, see Table 2-19, "Type 2 Class Exception Conditions." EVEX-encoded instructions, see Table 2-48, "Type E2 Class Exception Conditions."

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values

Opcode/                       Op/ 64/32        CPUID Feature  Description Instruction                   En Bit Mode Flag Support

EVEX.128.66.MAP6.W0 97 /r     A       V/V      (AVX512_FP16   Multiply packed FP16 values from xmm1 and

VFMSUBADD132PH xmm1{k1}{z},                    AND AVX512VL)  xmm3/m128/m16bcst, subtract/add elements in xmm2, xmm3/m128/m16bcst                        OR AVX10.1     xmm2, and store the result in xmm1 subject to writemask k1.

EVEX.256.66.MAP6.W0 97 /r     A       V/V      (AVX512_FP16   Multiply packed FP16 values from ymm1 and

VFMSUBADD132PH ymm1{k1}{z},                    AND AVX512VL)  ymm3/m256/m16bcst, subtract/add elements in ymm2, ymm3/m256/m16bcst                        OR AVX10.1     ymm2, and store the result in ymm1 subject to writemask k1.

EVEX.512.66.MAP6.W0 97 /r     A       V/V      AVX512_FP16    Multiply packed FP16 values from zmm1 and OR AVX10.1 VFMSUBADD132PH zmm1{k1}{z},                                   zmm3/m512/m16bcst, subtract/add elements in zmm2, zmm3/m512/m16bcst {er}                                  zmm2, and store the result in zmm1 subject to

writemask k1.

EVEX.128.66.MAP6.W0 A7 /r     A       V/V      (AVX512_FP16   Multiply packed FP16 values from xmm1 and VFMSUBADD213PH xmm1{k1}{z},                    AND AVX512VL)  xmm2, subtract/add elements in xmm2, xmm3/m128/m16bcst                        OR AVX10.1     xmm3/m128/m16bcst, and store the result in

xmm1 subject to writemask k1.

EVEX.256.66.MAP6.W0 A7 /r     A       V/V      (AVX512_FP16   Multiply packed FP16 values from ymm1 and VFMSUBADD213PH ymm1{k1}{z},                    AND AVX512VL)  ymm2, subtract/add elements in ymm2, ymm3/m256/m16bcst                        OR AVX10.1     ymm3/m256/m16bcst, and store the result in

ymm1 subject to writemask k1.

EVEX.512.66.MAP6.W0 A7 /r     A       V/V      AVX512_FP16    Multiply packed FP16 values from zmm1 and VFMSUBADD213PH zmm1{k1}{z},                    OR AVX10.1     zmm2, subtract/add elements in zmm2, zmm3/m512/m16bcst {er}                                  zmm3/m512/m16bcst, and store the result in

zmm1 subject to writemask k1.

EVEX.128.66.MAP6.W0 B7 /r     A       V/V      (AVX512_FP16   Multiply packed FP16 values from xmm2 and VFMSUBADD231PH xmm1{k1}{z},                    AND AVX512VL)  xmm3/m128/m16bcst, subtract/add elements in xmm2, xmm3/m128/m16bcst                        OR AVX10.1     xmm1, and store the result in xmm1 subject to

writemask k1.

EVEX.256.66.MAP6.W0 B7 /r     A       V/V      (AVX512_FP16   Multiply packed FP16 values from ymm2 and VFMSUBADD231PH ymm1{k1}{z},                    AND AVX512VL)  ymm3/m256/m16bcst, subtract/add elements in ymm2, ymm3/m256/m16bcst                        OR AVX10.1     ymm1, and store the result in ymm1 subject to

writemask k1.

EVEX.512.66.MAP6.W0 B7 /r     A       V/V      AVX512_FP16    Multiply packed FP16 values from zmm2 and VFMSUBADD231PH zmm1{k1}{z},                    OR AVX10.1     zmm3/m512/m16bcst, subtract/add elements in zmm2, zmm3/m512/m16bcst {er}                                  zmm1, and store the result in zmm1 subject to

writemask k1.

## Description

This instruction performs a packed multiply-add (even elements) or multiply-subtract (odd elements) computation on FP16 values using three source operands and writes the results in the destination operand. The destination operand is also the first source operand. The notation "132", "213" and "231" indicate the use of the operands in A * B +/- C, where each digit corresponds to the operand number, with the destination being operand 1; see Table 5-10.

The destination elements are updated according to the writemask.

**VFMSUBADD[132,213,231]PH Notation for Odd and Even Elements**

| Notation | Odd Elements | Even Elements |
| --- | --- | --- |
| 132                        dest = | dest*src3-src2                                de | st = dest*src3+src2 |

## Operation

```text
VFMSUBADD132PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a register
VL = 128, 256 or 512
KL := VL/16

IF (VL = 512) AND (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(DEST.fp16[j]*SRC3.fp16[j] + SRC2.fp16[j])
          ELSE:
                DEST.fp16[j] := RoundFPControl(DEST.fp16[j]*SRC3.fp16[j] - SRC2.fp16[j])
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a memory source
VL = 128, 256 or 512
KL := VL/16

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF EVEX.b = 1:
                t3 := SRC3.fp16[0]
          ELSE:
                t3 := SRC3.fp16[j]
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(DEST.fp16[j] * t3 + SRC2.fp16[j])
          ELSE:
                DEST.fp16[j] := RoundFPControl(DEST.fp16[j] * t3 - SRC2.fp16[j])
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values

    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0:

VFMSUBADD213PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a register
VL = 128, 256 or 512
KL := VL/16

IF (VL = 512) AND (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j]*DEST.fp16[j] + SRC3.fp16[j])
          ELSE
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j]*DEST.fp16[j] - SRC3.fp16[j])
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0

VFMSUBADD213PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a memory source
VL = 128, 256 or 512
KL := VL/16

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF EVEX.b = 1:
                t3 := SRC3.fp16[0]
          ELSE:
                t3 := SRC3.fp16[j]
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j] * DEST.fp16[j] + t3 )
          ELSE:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j] * DEST.fp16[j] - t3 )
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0:

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values

VFMSUBADD231PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a register
VL = 128, 256 or 512
KL := VL/16

IF (VL = 512) AND (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *j is even:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j]*SRC3.fp16[j] + DEST.fp16[j])
          ELSE:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j]*SRC3.fp16[j] - DEST.fp16[j])
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a memory source
VL = 128, 256 or 512
KL := VL/16

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF EVEX.b = 1:
                t3 := SRC3.fp16[0]
          ELSE:
                t3 := SRC3.fp16[j]
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j] * t3 + DEST.fp16[j] )
          ELSE:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j] * t3 - DEST.fp16[j] )
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values
```

## Intel C/C++ compiler intrinsics

```c
VFMSUBADD132PH, VFMSUBADD213PH, and VFMSUBADD231PH: __m128h _mm_fmsubadd_ph (__m128h a, __m128h b, __m128h c);
__m128h _mm_mask_fmsubadd_ph (__m128h a, __mmask8 k, __m128h b, __m128h c);
__m128h _mm_mask3_fmsubadd_ph (__m128h a, __m128h b, __m128h c, __mmask8 k);
__m128h _mm_maskz_fmsubadd_ph (__mmask8 k, __m128h a, __m128h b, __m128h c);
__m256h _mm256_fmsubadd_ph (__m256h a, __m256h b, __m256h c);
__m256h _mm256_mask_fmsubadd_ph (__m256h a, __mmask16 k, __m256h b, __m256h c);
__m256h _mm256_mask3_fmsubadd_ph (__m256h a, __m256h b, __m256h c, __mmask16 k);
__m256h _mm256_maskz_fmsubadd_ph (__mmask16 k, __m256h a, __m256h b, __m256h c);
__m512h _mm512_fmsubadd_ph (__m512h a, __m512h b, __m512h c);
__m512h _mm512_mask_fmsubadd_ph (__m512h a, __mmask32 k, __m512h b, __m512h c);
__m512h _mm512_mask3_fmsubadd_ph (__m512h a, __m512h b, __m512h c, __mmask32 k);
__m512h _mm512_maskz_fmsubadd_ph (__mmask32 k, __m512h a, __m512h b, __m512h c);
__m512h _mm512_fmsubadd_round_ph (__m512h a, __m512h b, __m512h c, const int rounding);
__m512h _mm512_mask_fmsubadd_round_ph (__m512h a, __mmask32 k, __m512h b, __m512h c, const int rounding);
__m512h _mm512_mask3_fmsubadd_round_ph (__m512h a, __m512h b, __m512h c, __mmask32 k, const int rounding);
__m512h _mm512_maskz_fmsubadd_round_ph (__mmask32 k, __m512h a, __m512h b, __m512h c, const int rounding);
```

## SIMD Floating-Point Exceptions

Invalid, Underflow, Overflow, Precision, Denormal.

## Other Exceptions

EVEX-encoded instructions, see Table 2-48, "Type E2 Class Exception Conditions."

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision Floating-Point Values

Opcode/                       Op / 64/32  CPUID Feature  Description Instruction                   En Bit Mode Flag Support

VEX.128.66.0F38.W0 97 /r      A  V/V      FMA            Multiply packed single precision floating-point

VFMSUBADD132PS xmm1, xmm2,                               values from xmm1 and xmm3/mem, subtract/add elements in xmm2 and put result in xmm1. xmm3/m128

VEX.128.66.0F38.W0 A7 /r      A  V/V      FMA            Multiply packed single precision floating-point values from xmm1 and xmm2, subtract/add VFMSUBADD213PS xmm1, xmm2, elements in xmm3/mem and put result in xmm1. xmm3/m128

VEX.128.66.0F38.W0 B7 /r      A  V/V      FMA            Multiply packed single precision floating-point values from xmm2 and xmm3/mem, subtract/add VFMSUBADD231PS xmm1, xmm2,                               elements in xmm1 and put result in xmm1.

xmm3/m128

VEX.256.66.0F38.W0 97 /r      A  V/V      FMA            Multiply packed single precision floating-point

VFMSUBADD132PS ymm1, ymm2,                               values from ymm1 and ymm3/mem, subtract/add elements in ymm2 and put result in ymm1. ymm3/m256

VEX.256.66.0F38.W0 A7 /r      A  V/V      FMA            Multiply packed single precision floating-point

VFMSUBADD213PS ymm1, ymm2,                               values from ymm1 and ymm2, subtract/add elements in ymm3/mem and put result in ymm1. ymm3/m256

VEX.256.66.0F38.W0 B7 /r      A  V/V      FMA            Multiply packed single precision floating-point values from ymm2 and ymm3/mem, subtract/add VFMSUBADD231PS ymm1, ymm2, elements in ymm1 and put result in ymm1. ymm3/m256

EVEX.128.66.0F38.W0 97 /r     B  V/V      (AVX512VL AND  Multiply packed single precision floating-point

```text
                                          AVX512F) OR    values from xmm1 and xmm3/m128/m32bcst,
```

VFMSUBADD132PS xmm1 {k1}{z},              AVX10.1        subtract/add elements in xmm2 and put result in

xmm2, xmm3/m128/m32bcst                                  xmm1 subject to writemask k1.

EVEX.128.66.0F38.W0 A7 /r     B  V/V      (AVX512VL AND  Multiply packed single precision floating-point

```text
                                          AVX512F) OR    values from xmm1 and xmm2, subtract/add
```

VFMSUBADD213PS xmm1 {k1}{z},              AVX10.1        elements in xmm3/m128/m32bcst and put result

xmm2, xmm3/m128/m32bcst                                  in xmm1 subject to writemask k1.

EVEX.128.66.0F38.W0 B7 /r     B  V/V      (AVX512VL AND  Multiply packed single precision floating-point

```text
                                          AVX512F) OR    values from xmm2 and xmm3/m128/m32bcst,
```

VFMSUBADD231PS xmm1 {k1}{z},              AVX10.1        subtract/add elements in xmm1 and put result in

xmm2, xmm3/m128/m32bcst                                  xmm1 subject to writemask k1.

EVEX.256.66.0F38.W0 97 /r     B  V/V      (AVX512VL AND  Multiply packed single precision floating-point

```text
                                          AVX512F) OR    values from ymm1 and ymm3/m256/m32bcst,
```

VFMSUBADD132PS ymm1 {k1}{z},              AVX10.1        subtract/add elements in ymm2 and put result in

ymm2, ymm3/m256/m32bcst                                  ymm1 subject to writemask k1.

EVEX.256.66.0F38.W0 A7 /r     B  V/V      (AVX512VL AND  Multiply packed single precision floating-point

```text
                                          AVX512F) OR    values from ymm1 and ymm2, subtract/add
```

VFMSUBADD213PS ymm1 {k1}{z},              AVX10.1        elements in ymm3/m256/m32bcst and put result

ymm2, ymm3/m256/m32bcst                                  in ymm1 subject to writemask k1.

EVEX.256.66.0F38.W0 B7 /r     B  V/V      (AVX512VL AND  Multiply packed single precision floating-point

```text
                                          AVX512F) OR    values from ymm2 and ymm3/m256/m32bcst,
```

VFMSUBADD231PS ymm1 {k1}{z},              AVX10.1        subtract/add elements in ymm1 and put result in

ymm2, ymm3/m256/m32bcst                                  ymm1 subject to writemask k1.

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

Opcode/                       Op / 64/32       CPUID Feature  Description Instruction                   En Bit Mode Flag

```text
                                 Support                      Multiply packed single precision floating-point
```

EVEX.512.66.0F38.W0 97 /r                                     values from zmm1 and zmm3/m512/m32bcst, VFMSUBADD132PS zmm1 {k1}{z},  B  V/V           AVX512F        subtract/add elements in zmm2 and put result in zmm2, zmm3/m512/m32bcst{er}                    OR AVX10.1     zmm1 subject to writemask k1.

EVEX.512.66.0F38.W0 A7 /r     B  V/V           AVX512F        Multiply packed single precision floating-point

```text
                                               OR AVX10.1     values from zmm1 and zmm2, subtract/add
```

VFMSUBADD213PS zmm1 {k1}{z},                                  elements in zmm3/m512/m32bcst and put result in zmm1 subject to writemask k1. zmm2, zmm3/m512/m32bcst{er} Multiply packed single precision floating-point EVEX.512.66.0F38.W0 B7 /r     B  V/V           AVX512F        values from zmm2 and zmm3/m512/m32bcst,

```text
                                               OR AVX10.1     subtract/add elements in zmm1 and put result in
```

VFMSUBADD231PS zmm1 {k1}{z},                                  zmm1 subject to writemask k1.

zmm2, zmm3/m512/m32bcst{er}

## Description

VFMSUBADD132PS: Multiplies the four, eight or sixteen packed single precision floating-point values from the first source operand to the corresponding packed single precision floating-point values in the third source operand. From the infinite precision intermediate result, subtracts the odd single precision floating-point elements and adds the even single precision floating-point values in the second source operand, performs rounding and stores the resulting packed single precision floating-point values to the destination operand (first source operand).

VFMSUBADD213PS: Multiplies the four, eight or sixteen packed single precision floating-point values from the second source operand to the corresponding packed single precision floating-point values in the first source operand. From the infinite precision intermediate result, subtracts the odd single precision floating-point elements and adds the even single precision floating-point values in the third source operand, performs rounding and stores the resulting packed single precision floating-point values to the destination operand (first source operand).

VFMSUBADD231PS: Multiplies the four, eight or sixteen packed single precision floating-point values from the second source operand to the corresponding packed single precision floating-point values in the third source operand. From the infinite precision intermediate result, subtracts the odd single precision floating-point elements and adds the even single precision floating-point values in the first source operand, performs rounding and stores the resulting packed single precision floating-point values to the destination operand (first source operand).

EVEX encoded versions: The destination operand (also first source operand) and the second source operand are ZMM/YMM/XMM register. The third source operand is a ZMM/YMM/XMM register, a 512/256/128-bit memory location or a 512/256/128-bit vector broadcasted from a 32-bit memory location. The destination operand is conditionally updated with write mask k1.

VEX.256 encoded version: The destination operand (also first source operand) is a YMM register and encoded in reg_field. The second source operand is a YMM register and encoded in VEX.vvvv. The third source operand is a YMM register or a 256-bit memory location and encoded in rm_field.

VEX.128 encoded version: The destination operand (also first source operand) is a XMM register and encoded in reg_field. The second source operand is a XMM register and encoded in VEX.vvvv. The third source operand is a XMM register or a 128-bit memory location and encoded in rm_field. The upper 128 bits of the YMM destination register are zeroed.

Compiler tools may optionally support a complementary mnemonic for each instruction mnemonic listed in the opcode/instruction column of the summary table. The behavior of the complementary mnemonic in situations involving NANs are governed by the definition of the instruction mnemonic defined in the opcode/instruction column.

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

## Operation

```text
In the operations below, "*" and "+" symbols represent multiplication and addition with infinite precision inputs and outputs (no
rounding).

VFMSUBADD132PS DEST, SRC2, SRC3
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM -1{

    n := 64*i;
    DEST[n+31:n] := RoundFPControl_MXCSR(DEST[n+31:n]*SRC3[n+31:n] + SRC2[n+31:n])
    DEST[n+63:n+32] := RoundFPControl_MXCSR(DEST[n+63:n+32]*SRC3[n+63:n+32] -SRC2[n+63:n+32])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFMSUBADD213PS DEST, SRC2, SRC3
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM -1{

    n := 64*i;
    DEST[n+31:n] := RoundFPControl_MXCSR(SRC2[n+31:n]*DEST[n+31:n] +SRC3[n+31:n])
    DEST[n+63:n+32] := RoundFPControl_MXCSR(SRC2[n+63:n+32]*DEST[n+63:n+32] -SRC3[n+63:n+32])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFMSUBADD231PS DEST, SRC2, SRC3
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM -1{

    n := 64*i;
    DEST[n+31:n] := RoundFPControl_MXCSR(SRC2[n+31:n]*SRC3[n+31:n] + DEST[n+31:n])
    DEST[n+63:n+32] := RoundFPControl_MXCSR(SRC2[n+63:n+32]*SRC3[n+63:n+32] -DEST[n+63:n+32])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

VFMSUBADD132PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+31:i] :=

                      RoundFPControl(DEST[i+31:i]*SRC3[i+31:i] + SRC2[i+31:i])

                      ELSE DEST[i+31:i] :=

                      RoundFPControl(DEST[i+31:i]*SRC3[i+31:i] - SRC2[i+31:i])

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+31:i] :=
                                  RoundFPControl_MXCSR(DEST[i+31:i]*SRC3[31:0] + SRC2[i+31:i])
                                  ELSE
                                        DEST[i+31:i] :=
                                  RoundFPControl_MXCSR(DEST[i+31:i]*SRC3[i+31:i] + SRC2[i+31:i])
                            FI;
                      ELSE
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+31:i] :=
                            RoundFPControl_MXCSR(DEST[i+31:i]*SRC3[31:0] - SRC2[i+31:i])
                                  ELSE
                                        DEST[i+31:i] :=
                            RoundFPControl_MXCSR(DEST[i+31:i]*SRC3[i+31:i] - SRC2[i+31:i])

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

                              FI;
                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD213PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+31:i] :=

                      RoundFPControl(SRC2[i+31:i]*DEST[i+31:i] + SRC3[i+31:i])

                      ELSE DEST[i+31:i] :=

                      RoundFPControl(SRC2[i+31:i]*DEST[i+31:i] - SRC3[i+31:i])

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD213PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+31:i] :=
                            RoundFPControl_MXCSR(SRC2[i+31:i]*DEST[i+31:i] + SRC3[31:0])

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

                           ELSE

                                  DEST[i+31:i] :=

                           RoundFPControl_MXCSR(SRC2[i+31:i]*DEST[i+31:i] + SRC3[i+31:i])

                      FI;

                      ELSE

                           IF (EVEX.b = 1)

                                  THEN

                                  DEST[i+31:i] :=

                           RoundFPControl_MXCSR(SRC2[i+31:i]*DEST[i+31:i] - SRC3[i+31:i])

                                  ELSE

                                  DEST[i+31:i] :=

                           RoundFPControl_MXCSR(SRC2[i+31:i]*DEST[i+31:i] - SRC3[31:0])

                           FI;

                  FI

          ELSE

                  IF *merging-masking*             ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                         ; zeroing-masking

                           DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+31:i] :=

                           RoundFPControl(SRC2[i+31:i]*SRC3[i+31:i] + DEST[i+31:i])

                      ELSE DEST[i+31:i] :=

                           RoundFPControl(SRC2[i+31:i]*SRC3[i+31:i] - DEST[i+31:i])

                  FI

          ELSE

                  IF *merging-masking*             ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                         ; zeroing-masking

                           DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (4, 128), (8, 256), (16, 512)

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF j *is even*

                 THEN

                    IF (EVEX.b = 1)

                             THEN

                             DEST[i+31:i] :=

                             RoundFPControl_MXCSR(SRC2[i+31:i]*SRC3[31:0] + DEST[i+31:i])

                             ELSE

                             DEST[i+31:i] :=

                             RoundFPControl_MXCSR(SRC2[i+31:i]*SRC3[i+31:i] + DEST[i+31:i])

                    FI;

                 ELSE

                    IF (EVEX.b = 1)

                             THEN

                             DEST[i+31:i] :=

                    RoundFPControl_MXCSR(SRC2[i+31:i]*SRC3[31:0] - DEST[i+31:i])

                             ELSE

                             DEST[i+31:i] :=

                    RoundFPControl_MXCSR(SRC2[i+31:i]*SRC3[i+31:i] - DEST[i+31:i])

                    FI;

             FI

     ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                         ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VFMSUBADDxxxPS __m512 _mm512_fmsubadd_ps(__m512 a, __m512 b, __m512 c);
VFMSUBADDxxxPS __m512 _mm512_fmsubadd_round_ps(__m512 a, __m512 b, __m512 c, int r);
VFMSUBADDxxxPS __m512 _mm512_mask_fmsubadd_ps(__m512 a, __mmask16 k, __m512 b, __m512 c);
VFMSUBADDxxxPS __m512 _mm512_maskz_fmsubadd_ps(__mmask16 k, __m512 a, __m512 b, __m512 c);
VFMSUBADDxxxPS __m512 _mm512_mask3_fmsubadd_ps(__m512 a, __m512 b, __m512 c, __mmask16 k);
VFMSUBADDxxxPS __m512 _mm512_mask_fmsubadd_round_ps(__m512 a, __mmask16 k, __m512 b, __m512 c, int r);
VFMSUBADDxxxPS __m512 _mm512_maskz_fmsubadd_round_ps(__mmask16 k, __m512 a, __m512 b, __m512 c, int r);
VFMSUBADDxxxPS __m512 _mm512_mask3_fmsubadd_round_ps(__m512 a, __m512 b, __m512 c, __mmask16 k, int r);
VFMSUBADDxxxPS __m256 _mm256_mask_fmsubadd_ps(__m256 a, __mmask8 k, __m256 b, __m256 c);
VFMSUBADDxxxPS __m256 _mm256_maskz_fmsubadd_ps(__mmask8 k, __m256 a, __m256 b, __m256 c);
VFMSUBADDxxxPS __m256 _mm256_mask3_fmsubadd_ps(__m256 a, __m256 b, __m256 c, __mmask8 k);
VFMSUBADDxxxPS __m128 _mm_mask_fmsubadd_ps(__m128 a, __mmask8 k, __m128 b, __m128 c);
VFMSUBADDxxxPS __m128 _mm_maskz_fmsubadd_ps(__mmask8 k, __m128 a, __m128 b, __m128 c);
VFMSUBADDxxxPS __m128 _mm_mask3_fmsubadd_ps(__m128 a, __m128 b, __m128 c, __mmask8 k);
VFMSUBADDxxxPS __m128 _mm_fmsubadd_ps (__m128 a, __m128 b, __m128 c);
VFMSUBADDxxxPS __m256 _mm256_fmsubadd_ps (__m256 a, __m256 b, __m256 c);
```

## SIMD Floating-Point Exceptions

Overflow, Underflow, Invalid, Precision, Denormal.

## Other Exceptions

VEX-encoded instructions, see Table 2-19, "Type 2 Class Exception Conditions." EVEX-encoded instructions, see Table 2-48, "Type E2 Class Exception Conditions."

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision
