---
summary: Restore Processor Extended States
---

## Description

Performs a full or partial restore of processor state components from the XSAVE area located at the memory address specified by the source operand. The implicit EDX:EAX register pair specifies a 64-bit instruction mask. The specific state components restored correspond to the bits set in the requested-feature bitmap (RFBM), which is the logical-AND of EDX:EAX and XCR0.

The format of the XSAVE area is detailed in Section 13.4, "XSAVE Area," of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1. Like FXRSTOR and FXSAVE, the memory format used for x87 state depends on a REX.W prefix; see Section 13.5.1, "x87 State" of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1.

Section 13.8, "Operation of XRSTOR," of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1 provides a detailed description of the operation of the XRSTOR instruction. The following items provide a highlevel outline:

* Execution of XRSTOR may take one of two forms: standard and compacted. Bit 63 of the XCOMP_BV field in the

XSAVE header determines which form is used: value 0 specifies the standard form, while value 1 specifies the compacted form.

* If RFBM[i] = 0, XRSTOR does not update state component i.1 * If RFBM[i] = 1 and bit i is clear in the XSTATE_BV field in the XSAVE header, XRSTOR initializes state

component i.

* If RFBM[i] = 1 and XSTATE_BV[i] = 1, XRSTOR loads state component i from the XSAVE area. * The standard form of XRSTOR treats MXCSR (which is part of state component 1 -- SSE) differently from the

XMM registers. If either form attempts to load MXCSR with an illegal value, a general-protection exception (#GP) occurs.

* XRSTOR loads the internal value XRSTOR_INFO, which may be used to optimize a subsequent execution of

XSAVEOPT or XSAVES.

* Immediately following an execution of XRSTOR, the processor tracks as in-use (not in initial configuration) any

state component i for which RFBM[i] = 1 and XSTATE_BV[i] = 1; it tracks as modified any state component i for which RFBM[i] = 0.

Use of a source operand not aligned to 64-byte boundary (for 64-bit and 32-bit modes) results in a general-protection (#GP) exception. In 64-bit mode, the upper 32 bits of RDX and RAX are ignored.

See Section 13.6, "Processor Tracking of XSAVE-Managed State," of Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1 for discussion of the bitmaps XINUSE and XMODIFIED and of the quantity XRSTOR_INFO.

1. There is an exception if RFBM[1] = 0 and RFBM[2] = 1. In this case, the standard form of XRSTOR will load MXCSR from memory, even though MXCSR is part of state component 1 -- SSE. The compacted form of XRSTOR does not make this exception.

## Operation

```text
RFBM := XCR0 AND EDX:EAX; /* bitwise logical AND */
COMPMASK := XCOMP_BV field from XSAVE header;
RSTORMASK := XSTATE_BV field from XSAVE header;

IF COMPMASK[63] = 0
    THEN
          /* Standard form of XRSTOR */
          TO_BE_RESTORED := RFBM AND RSTORMASK;
          TO_BE_INITIALIZED := RFBM AND NOT RSTORMASK;

          IF TO_BE_RESTORED[0] = 1
                THEN
                       XINUSE[0] := 1;
                       load x87 state from legacy region of XSAVE area;

          ELSIF TO_BE_INITIALIZED[0] = 1
                THEN
                       XINUSE[0] := 0;
                       initialize x87 state;

          FI;

          IF RFBM[1] = 1 OR RFBM[2] = 1
                THEN load MXCSR from legacy region of XSAVE area;

          FI;

          IF TO_BE_RESTORED[1] = 1
                THEN
                       XINUSE[1] := 1;
                       load XMM registers from legacy region of XSAVE area; // this step does not load MXCSR

          ELSIF TO_BE_INITIALIZED[1] = 1
                THEN
                       XINUSE[1] := 0;
                       set all XMM registers to 0; // this step does not initialize MXCSR

          FI;

          FOR i := 2 TO 62
                IF TO_BE_RESTORED[i] = 1
                       THEN
                             XINUSE[i] := 1;
                             load XSAVE state component i at offset n from base of XSAVE area;
                                   // n enumerated by CPUID.0DH.i:EBX)
                ELSIF TO_BE_INITIALIZED[i] = 1
                       THEN
                             XINUSE[i] := 0;
                             initialize XSAVE state component i;
                FI;

          ENDFOR;

    ELSE
          /* Compacted form of XRSTOR */
          IF CPUID.0DH.01H:EAX.XSAVEC[1] = 0
                THEN /* compacted form not supported */
                       #GP(0);
          FI;


     FORMAT = COMPMASK AND 7FFFFFFF_FFFFFFFFH;
     RESTORE_FEATURES = FORMAT AND RFBM;
     TO_BE_RESTORED := RESTORE_FEATURES AND RSTORMASK;
     FORCE_INIT := RFBM AND NOT FORMAT;
     TO_BE_INITIALIZED = (RFBM AND NOT RSTORMASK) OR FORCE_INIT;

     IF TO_BE_RESTORED[0] = 1
           THEN
                 XINUSE[0] := 1;
                 load x87 state from legacy region of XSAVE area;

     ELSIF TO_BE_INITIALIZED[0] = 1
           THEN
                 XINUSE[0] := 0;
                 initialize x87 state;

     FI;

     IF TO_BE_RESTORED[1] = 1
           THEN
                 XINUSE[1] := 1;
                 load SSE state from legacy region of XSAVE area; // this step loads the XMM registers and MXCSR

     ELSIF TO_BE_INITIALIZED[1] = 1
           THEN
                 set all XMM registers to 0;
                 XINUSE[1] := 0;
                 MXCSR := 1F80H;

     FI;

     NEXT_FEATURE_OFFSET = 576;            // Legacy area and XSAVE header consume 576 bytes

     FOR i := 2 TO 62

     IF FORMAT[i] = 1

              THEN

              IF TO_BE_RESTORED[i] = 1

                        THEN

                        XINUSE[i] := 1;

                        load XSAVE state component i at offset NEXT_FEATURE_OFFSET from base of XSAVE area;

              FI;

NEXT_FEATURE_OFFSET = NEXT_FEATURE_OFFSET + n (n enumerated by CPUID.0DH.i:EAX);

     FI;

     IF TO_BE_INITIALIZED[i] = 1

              THEN

              XINUSE[i] := 0;

              initialize XSAVE state component i;

     FI;

     ENDFOR;

FI;

XMODIFIED := NOT RFBM;

IF in VMX non-root operation
    THEN VMXNR := 1;
    ELSE VMXNR := 0;

FI;
LAXA := linear address of XSAVE area;


XRSTOR_INFO := CPL,VMXNR,LAXA,COMPMASK;
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
XRSTOR void _xrstor( void * , unsigned __int64);
XRSTOR void _xrstor64( void * , unsigned __int64);
```
