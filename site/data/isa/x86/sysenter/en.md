---
summary: Fast System Call
---

## Description

SYSENTER invokes an OS system-call handler at privilege level 0. Its operation depends on whether FRED transitions are enabled.

Operation When FRED Transitions Are Not Enabled

When FRED transitions are not enabled, SYSENTER is a companion instruction to SYSEXIT. SYSENTER is optimized to provide the maximum performance for system calls from user code running at privilege level 3 to operating system or executive procedures running at privilege level 0.

When executed in IA-32e mode, the SYSENTER instruction transitions the logical processor to 64-bit mode; otherwise, the logical processor remains in protected mode.

Prior to executing the SYSENTER instruction, software must specify the privilege level 0 code segment and code entry point, and the privilege level 0 stack segment and stack pointer by writing values to the following MSRs:

* IA32_SYSENTER_CS (MSR address 174H) -- The lower 16 bits of this MSR are the segment selector for the

privilege level 0 code segment. This value is also used to determine the segment selector of the privilege level 0 stack segment (see the Operation section). This value cannot indicate a null selector.

* IA32_SYSENTER_EIP (MSR address 176H) -- The value of this MSR is loaded into RIP (thus, this value

references the first instruction of the selected operating procedure or routine). In protected mode, only bits 31:0 are loaded.

* IA32_SYSENTER_ESP (MSR address 175H) -- The value of this MSR is loaded into RSP (thus, this value

contains the stack pointer for the privilege level 0 stack). This value cannot represent a non-canonical address. In protected mode, only bits 31:0 are loaded.

MSR writes ensure that the IA32_SYSENTER_EIP and IA32_SYSENTER_ESP MSRs always contain canonical addresses.

While SYSENTER loads the CS and SS selectors with values derived from the IA32_SYSENTER_CS MSR, the CS and SS descriptor caches are not loaded from the descriptors (in GDT or LDT) referenced by those selectors. Instead, the descriptor caches are loaded with fixed values. See the Operation section for details. It is the responsibility of OS software to ensure that the descriptors (in GDT or LDT) referenced by those selector values correspond to the fixed values loaded into the descriptor caches; the SYSENTER instruction does not ensure this correspondence.

The SYSENTER instruction cannot be invoked from real-address mode.

The SYSENTER and SYSEXIT instructions are companion instructions, but they do not constitute a call/return pair. When executing a SYSENTER instruction, the processor does not save state information for the user code (e.g., the instruction pointer), and neither the SYSENTER nor the SYSEXIT instruction supports passing parameters on the stack.

To use the SYSENTER and SYSEXIT instructions as companion instructions for transitions between privilege level 3 code and privilege level 0 operating system procedures, the following conventions must be followed:

* The segment descriptors for the privilege level 0 code and stack segments and for the privilege level 3 code and

stack segments must be contiguous in a descriptor table. This convention allows the processor to compute the segment selectors from the value entered in the SYSENTER_CS_MSR MSR.

* The fast system call "stub" routines executed by user code (typically in shared libraries or DLLs) must save the

required return IP and processor state information if a return to the calling procedure is required. Likewise, the

operating system or executive procedures called with SYSENTER instructions must have access to and use this saved return and state information when returning to the user code.

The SYSENTER and SYSEXIT instructions were introduced into the IA-32 architecture in the Pentium II processor. The availability of these instructions on a processor is indicated with the SYSENTER/SYSEXIT present (SEP) feature flag returned to the EDX register by the CPUID instruction. An operating system that qualifies the SEP flag must also qualify the processor family and model to ensure that the SYSENTER/SYSEXIT instructions are actually present. For example:

```text
IF CPUID SEP bit is set
```

```text
   THEN IF (Family = 6) and (Model < 3) and (Stepping < 3)
```

```text
          THEN
```

SYSENTER/SYSEXIT_Not_Supported; FI;

```text
          ELSE
```

SYSENTER/SYSEXIT_Supported; FI;

FI;

When the CPUID instruction is executed on the Pentium Pro processor (model 1), the processor returns a the SEP flag as set, but does not support the SYSENTER/SYSEXIT instructions.

When shadow stacks are enabled at privilege level where SYSENTER instruction is invoked, the SSP is saved to the IA32_PL3_SSP MSR. If shadow stacks are enabled at privilege level 0, the SSP is loaded with 0. Refer to Chapter 6, "Procedure Calls, Interrupts, and Exceptions," and Chapter 18, "Control-flow Enforcement Technology (CET)," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1, for additional CET details.

When FRED Transitions are Enabled

When FRED transitions are enabled, SYSENTER invokes the OS handler by performing FRED event delivery. See Section 8.3, "FRED Event Delivery," in Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3. The event is delivered using event type 7 and vector 2. With FRED transitions, the OS handler uses the ERETU instruction to return to calling code operating at CPL 3.

Instruction ordering. Instructions following a SYSENTER may be fetched from memory before earlier instructions complete execution, but they will not execute (even speculatively) until all instructions prior to the SYSENTER have completed execution (the later instructions may execute before data stored by the earlier instructions have become globally visible).

## Operation

```text
IF CR0.PE = 0 OR (CR4.FRED = 0 AND IA32_SYSENTER_CS[15:2] = 0)

    THEN #GP(0); FI;

IF CR4.FRED = 0                                        (* Ensures protected mode execution *)
    THEN                                               (* Mask interrupts *)
          RFLAGS.VM := 0;
          RFLAGS.IF := 0;
          IF in IA-32e mode
                THEN
                      RSP := IA32_SYSENTER_ESP;
                      RIP := IA32_SYSENTER_EIP;
          ELSE
                      ESP := IA32_SYSENTER_ESP[31:0];
                      EIP := IA32_SYSENTER_EIP[31:0];
          FI;

CS.Selector := IA32_SYSENTER_CS[15:0] AND FFFCH;

                                       (* Operating system provides CS; RPL forced to 0 *)

(* Set rest of CS to a fixed value *)

CS.Base := 0;                                          (* Flat segment *)

CS.Limit := FFFFFH;                                    (* With 4-KByte granularity, implies a 4-GByte limit *)

CS.Type := 11;                                         (* Execute/read code, accessed *)


     CS.S := 1;                                  (* Entry is to 64-bit mode *)
     CS.DPL := 0;                                (* Required if CS.L = 1 *)
     CS.P := 1;
     IF in IA-32e mode                           (* 32-bit code segment*)
                                                 (* 4-KByte granularity *)
           THEN
                 CS.L := 1;
                 CS.D := 0;

           ELSE
                 CS.L := 0;
                 CS.D := 1;

     FI;
     CS.G := 1;

     IF ShadowStackEnabled(CPL)
           THEN
                 IF IA32_EFER.LMA = 0
                       THEN IA32_PL3_SSP := SSP;
                       ELSE (* adjust so bits 63:N get the value of bit N1, where N is the CPU's maximum linear-address width *)
                             IA32_PL3_SSP := LA_adjust(SSP);
                 FI;

     FI;

     CPL := 0;

     IF ShadowStackEnabled(CPL)
           SSP := 0;

     FI;
     IF EndbranchEnabled(CPL)

           IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
           IA32_S_CET.SUPPRESS = 0
     FI;

          SS.Selector := CS.Selector + 8;        (* SS just above CS *)
          (* Set rest of SS to a fixed value *)  (* Flat segment *)
          SS.Base := 0;                          (* With 4-KByte granularity, implies a 4-GByte limit *)
          SS.Limit := FFFFFH;                    (* Read/write data, accessed *)
          SS.Type := 3;
          SS.S := 1;                             (* 32-bit stack segment*)
          SS.DPL := 0;                           (* 4-KByte granularity *)
          SS.P := 1;                             (* save instruction length on stack *)
          SS.B := 1;
          SS.G := 1;
    ELSE (* CR4.FRED = 1 *)
          FRED event delivery of SYSENTER;
FI;
```

## Flags affected

VM, IF (see Operation above).
