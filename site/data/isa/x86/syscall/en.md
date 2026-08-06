---
summary: Fast System Call
---

## Description

SYSCALL invokes an OS system-call handler at privilege level 0. Its operation depends on whether FRED transitions are enabled.

Operation When FRED Transitions Are Not Enabled

When FRED transitions are not enabled, SYSCALL invokes the OS handler by loading RIP from the IA32_LSTAR MSR (after saving the address of the instruction following SYSCALL into RCX). (MSR writes ensure that the IA32_LSTAR MSR always contain a canonical address.) The OS handler returns using the SYSRET instruction.

SYSCALL also saves RFLAGS into R11 and then masks RFLAGS using the IA32_FMASK MSR (MSR address C0000084H); specifically, the processor clears in RFLAGS every bit corresponding to a bit that is set in the IA32_FMASK MSR.

SYSCALL loads the CS and SS selectors with values derived from bits 47:32 of the IA32_STAR MSR. However, the CS and SS descriptor caches are not loaded from the descriptors (in GDT or LDT) referenced by those selectors. Instead, the descriptor caches are loaded with fixed values. See the Operation section for details. It is the responsibility of OS software to ensure that the descriptors (in GDT or LDT) referenced by those selector values correspond to the fixed values loaded into the descriptor caches; the SYSCALL instruction does not ensure this correspondence.

The SYSCALL instruction does not save the stack pointer (RSP). If the OS system-call handler will change the stack pointer, it is the responsibility of software to save the previous value of the stack pointer. This might be done prior to executing SYSCALL, with software restoring the stack pointer with the instruction following SYSCALL (which will be executed after SYSRET). Alternatively, the OS system-call handler may save the stack pointer and restore it before executing SYSRET.

When shadow stacks are enabled at a privilege level where the SYSCALL instruction is invoked, the SSP is saved to the IA32_PL3_SSP MSR. If shadow stacks are enabled at privilege level 0, the SSP is loaded with 0. Refer to Chapter 6, "Procedure Calls, Interrupts, and Exceptions," and Chapter 18, "Control-flow Enforcement Technology (CET)," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1, for additional CET details.

When FRED Transitions are Enabled

When FRED transitions are enabled, SYSCALL invokes the OS handler by performing FRED event delivery. See Section 8.3, "FRED Event Delivery," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3. The event is delivered using event type 7 and vector 1. With FRED transitions, the OS handler uses the ERETU instruction to return to calling code operating at CPL 3.

Instruction ordering. Instructions following a SYSCALL may be fetched from memory before earlier instructions complete execution, but they will not execute (even speculatively) until all instructions prior to the SYSCALL have completed execution (the later instructions may execute before data stored by the earlier instructions have become globally visible).

## Operation

```text
IF IA32_EFER.LMA = 0 OR CS.L = 0 (* SYSCALL can be used only in 64-bit mode *)

    THEN #UD;
ELSE IF CR4.FRED = 0


THEN

IF IA32_EFER.SCE = 0

      THEN #UD;

      ELSE

      RCX := RIP;                                            (* Will contain address of next instruction *)

      RIP := IA32_LSTAR;

      R11 := RFLAGS;

      RFLAGS := RFLAGS AND NOT(IA32_FMASK);

      CS.Selector := IA32_STAR[47:32] AND FFFCH (* Operating system provides CS; RPL forced to 0 *)

      (* Set rest of CS to a fixed value *)

      CS.Base := 0;                                          (* Flat segment *)

      CS.Limit := FFFFFH;                                    (* With 4-KByte granularity, implies a 4-GByte limit *)

      CS.Type := 11;                                         (* Execute/read code, accessed *)

      CS.S := 1;

      CS.DPL := 0;

      CS.P := 1;

      CS.L := 1;                                             (* Entry is to 64-bit mode *)

      CS.D := 0;                                             (* Required if CS.L = 1 *)

      CS.G := 1;                                             (* 4-KByte granularity *)

      IF ShadowStackEnabled(CPL)
            THEN (* adjust so bits 63:N get the value of bit N1, where N is the CPU's maximum linear-address width *)
                  IA32_PL3_SSP := LA_adjust(SSP);
                  (* With shadow stacks enabled the system call is supported from Ring 3 to Ring 0 *)
                  (* OS supporting Ring 0 to Ring 0 system calls or Ring 1/2 to ring 0 system call *)
                  (* Must preserve the contents of IA32_PL3_SSP to avoid losing ring 3 state *)

      FI;

      CPL := 0;

      IF ShadowStackEnabled(CPL)
            SSP := 0;

      FI;
      IF EndbranchEnabled(CPL)

            IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
            IA32_S_CET.SUPPRESS = 0
      FI;

                      SS.Selector := IA32_STAR[47:32] + 8;   (* SS just above CS *)
                      (* Set rest of SS to a fixed value *)  (* Flat segment *)
                      SS.Base := 0;                          (* With 4-KByte granularity, implies a 4-GByte limit *)
                      SS.Limit := FFFFFH;                    (* Read/write data, accessed *)
                      SS.Type := 3;
                      SS.S := 1;                             (* 32-bit stack segment *)
                      SS.DPL := 0;                           (* 4-KByte granularity *)
                      SS.P := 1;
                      SS.B := 1;                             (* save instruction length on stack *)
                      SS.G := 1;
          FI;
    ELSE (* CR4.FRED = 1 *)
          FRED event delivery of SYSCALL;
FI;
```

## Flags affected

All.
