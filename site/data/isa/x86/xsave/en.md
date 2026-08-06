---
summary: Save Processor Extended States
---

## Description

Performs a full or partial save of processor state components to the XSAVE area located at the memory address specified by the destination operand. The implicit EDX:EAX register pair specifies a 64-bit instruction mask. The specific state components saved correspond to the bits set in the requested-feature bitmap (RFBM), which is the logical-AND of EDX:EAX and XCR0.

The format of the XSAVE area is detailed in Section 13.4, "XSAVE Area," of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1. Like FXRSTOR and FXSAVE, the memory format used for x87 state depends on a REX.W prefix; see Section 13.5.1, "x87 State" of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1.

Section 13.7, "Operation of XSAVE," of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1 provides a detailed description of the operation of the XSAVE instruction. The following items provide a high-level outline:

* XSAVE saves state component i if and only if RFBM[i] = 1.1 * XSAVE does not modify bytes 511:464 of the legacy region of the XSAVE area (see Section 13.4.1, "Legacy

Region of an XSAVE Area" of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1).

* XSAVE reads the XSTATE_BV field of the XSAVE header (see Section 13.4.2, "XSAVE Header" of Intel(R) 64 and

IA-32 Architectures Software Developer's Manual, Volume 1) and writes a modified value back to memory as follows. If RFBM[i] = 1, XSAVE writes XSTATE_BV[i] with the value of XINUSE[i]. (XINUSE is a bitmap by which the processor tracks the status of various state components. See Section 13.6, "Processor Tracking of XSAVE- Managed State" of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1.) If RFBM[i] = 0, XSAVE writes XSTATE_BV[i] with the value that it read from memory (it does not modify the bit). XSAVE does not write to any part of the XSAVE header other than the XSTATE_BV field.

* XSAVE always uses the standard format of the extended region of the XSAVE area (see Section 13.4.3, "Extended Region of an XSAVE Area" of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1).

Use of a destination operand not aligned to 64-byte boundary (in either 64-bit or 32-bit modes) results in a general-protection (#GP) exception. In 64-bit mode, the upper 32 bits of RDX and RAX are ignored.

1. An exception is made for MXCSR and MXCSR_MASK, which belong to state component 1 -- SSE. XSAVE saves these values to memory if either RFBM[1] or RFBM[2] is 1.

## Operation

```text
RFBM := XCR0 AND EDX:EAX; /* bitwise logical AND */
OLD_BV := XSTATE_BV field from XSAVE header;

IF RFBM[0] = 1
    THEN store x87 state into legacy region of XSAVE area;

FI;

IF RFBM[1] = 1
    THEN store XMM registers into legacy region of XSAVE area; // this step does not save MXCSR or MXCSR_MASK

FI;

IF RFBM[1] = 1 OR RFBM[2] = 1
    THEN store MXCSR and MXCSR_MASK into legacy region of XSAVE area;

FI;

FOR i := 2 TO 62
    IF RFBM[i] = 1

THEN save XSAVE state component i at offset n from base of XSAVE area (n enumerated by CPUID.0DH.i:EBX);
    FI;

ENDFOR;

XSTATE_BV field in XSAVE header := (OLD_BV AND NOT RFBM) OR (XINUSE AND RFBM);
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
XSAVE void _xsave( void * , unsigned __int64);
XSAVE void _xsave64( void * , unsigned __int64);
```
