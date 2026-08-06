---
summary: Unordered Compare Scalar Single Precision Floating-Point Values and Set EFLAGS
---

## Description

Compares the single precision floating-point values in the low doublewords of operand 1 (first operand) and operand 2 (second operand), and sets the ZF, PF, and CF flags in the EFLAGS register according to the result (unordered, greater than, less than, or equal). The OF, SF, and AF flags in the EFLAGS register are set to 0. The unordered result is returned if either source operand is a NaN (QNaN or SNaN).

Operand 1 is an XMM register; operand 2 can be an XMM register or a 32 bit memory location.

The UCOMISS instruction differs from the COMISS instruction in that it signals a SIMD floating-point invalid operation exception (#I) only if a source operand is an SNaN. The COMISS instruction signals an invalid operation exception when a source operand is either a QNaN or SNaN.

The EFLAGS register is not updated if an unmasked SIMD floating-point exception is generated.

Note: VEX.vvvv and EVEX.vvvv are reserved and must be 1111b, otherwise instructions will #UD.

Software should ensure VCOMISS is encoded with VEX.L=0. Encoding VCOMISS with VEX.L=1 may encounter unpredictable behavior across different processor generations.

## Operation

```text
(V)UCOMISS (All Versions)
RESULT := UnorderedCompare(DEST[31:0] <> SRC[31:0]) {
(* Set EFLAGS *) CASE (RESULT) OF

    UNORDERED: ZF,PF,CF := 111;
    GREATER_THAN: ZF,PF,CF := 000;
    LESS_THAN: ZF,PF,CF := 001;
    EQUAL: ZF,PF,CF := 100;
ESAC;
OF, AF, SF := 0; }
```

## Intel C/C++ compiler intrinsics

```c
VUCOMISS     int _mm_comi_round_ss(__m128 a, __m128 b, int imm, int sae);
UCOMISS      int _mm_ucomieq_ss(__m128 a, __m128 b);
UCOMISS      int _mm_ucomilt_ss(__m128 a, __m128 b);
UCOMISS      int _mm_ucomile_ss(__m128 a, __m128 b);
UCOMISS  int _mm_ucomigt_ss(__m128 a, __m128 b);
UCOMISS  int _mm_ucomige_ss(__m128 a, __m128 b);
UCOMISS  int _mm_ucomineq_ss(__m128 a, __m128 b);
```

## SIMD Floating-Point Exceptions

Invalid (if SNaN Operands), Denormal.

## Other Exceptions

VEX-encoded instructions, see Table 2-20, "Type 3 Class Exception Conditions," additionally:

```text
#UD               If VEX.vvvv != 1111B.
```

EVEX-encoded instructions, see Table 2-50, "Type E3NF Class Exception Conditions."
