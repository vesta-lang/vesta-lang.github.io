---
summary: Save Processor Extended States With Compaction
---

## Description

Performs a full or partial save of processor state components to the XSAVE area located at the memory address specified by the destination operand. The implicit EDX:EAX register pair specifies a 64-bit instruction mask. The specific state components saved correspond to the bits set in the requested-feature bitmap (RFBM), which is the logical-AND of EDX:EAX and XCR0.

The format of the XSAVE area is detailed in Section 13.4, "XSAVE Area," of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1. Like FXRSTOR and FXSAVE, the memory format used for x87 state depends on a REX.W prefix; see Section 13.5.1, "x87 State" of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1.

Section 13.10, "Operation of XSAVEC," of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1 provides a detailed description of the operation of the XSAVEC instruction. The following items provide a highlevel outline:

* Execution of XSAVEC is similar to that of XSAVE. XSAVEC differs from XSAVE in that it uses compaction and that

it may use the init optimization.

* XSAVEC saves state component i if and only if RFBM[i] = 1 and XINUSE[i] = 1.1 (XINUSE is a bitmap by which

the processor tracks the status of various state components. See Section 13.6, "Processor Tracking of XSAVE- Managed State" of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1.)

* XSAVEC does not modify bytes 511:464 of the legacy region of the XSAVE area (see Section 13.4.1, "Legacy Region of an XSAVE Area" of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1).

* XSAVEC writes the logical AND of RFBM and XINUSE to the XSTATE_BV field of the XSAVE header.2,3 (See Section 13.4.2, "XSAVE Header" of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1.) XSAVEC sets bit 63 of the XCOMP_BV field and sets bits 62:0 of that field to RFBM[62:0]. XSAVEC does not write to any parts of the XSAVE header other than the XSTATE_BV and XCOMP_BV fields.

* XSAVEC always uses the compacted format of the extended region of the XSAVE area (see Section 13.4.3, "Extended Region of an XSAVE Area" of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1).

Use of a destination operand not aligned to 64-byte boundary (in either 64-bit or 32-bit modes) results in a general-protection (#GP) exception. In 64-bit mode, the upper 32 bits of RDX and RAX are ignored.

1. There is an exception for state component 1 (SSE). MXCSR is part of SSE state, but XINUSE[1] may be 0 even if MXCSR does not have its initial value of 1F80H. In this case, XSAVEC saves SSE state as long as RFBM[1] = 1.

2. Unlike XSAVE and XSAVEOPT, XSAVEC clears bits in the XSTATE_BV field that correspond to bits that are clear in RFBM.

3. There is an exception for state component 1 (SSE). MXCSR is part of SSE state, but XINUSE[1] may be 0 even if MXCSR does not have its initial value of 1F80H. In this case, XSAVEC sets XSTATE_BV[1] to 1 as long as RFBM[1] = 1.

## Operation

```text
/* bitwise logical AND */
                                 /* bitwise logical AND */
RFBM := XCR0 AND EDX:EAX;
TO_BE_SAVED := RFBM AND XINUSE;
If MXCSR  1F80H AND RFBM[1]

    TO_BE_SAVED[1] = 1;
FI;

IF TO_BE_SAVED[0] = 1
    THEN store x87 state into legacy region of XSAVE area;

FI;

IF TO_BE_SAVED[1] = 1
    THEN store SSE state into legacy region of XSAVE area; // this step saves the XMM registers, MXCSR, and MXCSR_MASK

FI;

NEXT_FEATURE_OFFSET = 576;       // Legacy area and XSAVE header consume 576 bytes

FOR i := 2 TO 62

IF RFBM[i] = 1

     THEN

         IF TO_BE_SAVED[i]

                  THEN save XSAVE state component i at offset NEXT_FEATURE_OFFSET from base of XSAVE area;

         FI;

NEXT_FEATURE_OFFSET = NEXT_FEATURE_OFFSET + n (n enumerated by CPUID.0DH.i:EAX);

FI;

ENDFOR;

XSTATE_BV field in XSAVE header := TO_BE_SAVED;
XCOMP_BV field in XSAVE header := RFBM OR 80000000_00000000H;
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
XSAVEC void _xsavec( void * , unsigned __int64);
XSAVEC64 void _xsavec64( void * , unsigned __int64);
```
