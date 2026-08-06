---
summary: Execute Authenticated Chipset Code
---

## Description

The GETSEC[ENTERACCS] function loads, authenticates, and executes an authenticated code module using an Intel(R) TXT platform chipset's public key. The ENTERACCS leaf of GETSEC is selected with EAX set to 2 at entry.

There are certain restrictions enforced by the processor for the execution of the GETSEC[ENTERACCS] instruction:

* Execution is not allowed unless the processor is in protected mode or IA-32e mode with CPL = 0 and

EFLAGS.VM = 0.

* Processor cache must be available and not disabled, that is, CR0.CD and CR0.NW bits must be 0. * For processor packages containing more than one logical processor, CR0.CD is checked to ensure consistency

between enabled logical processors.

* For enforcing consistency of operation with numeric exception reporting using Interrupt 16, CR0.NE must be

set.

* An Intel TXT-capable chipset must be present as communicated to the processor by sampling of the power-on

configuration capability field after reset.

* The processor can not already be in authenticated code execution mode as launched by a previous

GETSEC[ENTERACCS] or GETSEC[SENTER] instruction without a subsequent exiting using GETSEC[EXITAC]).

* To avoid potential operability conflicts between modes, the processor is not allowed to execute this instruction

if it currently is in SMM or VMX operation.

* To ensure consistent handling of SIPI messages, the processor executing the GETSEC[ENTERACCS] instruction

must also be designated the BSP (boot-strap processor) as defined by IA32_APIC_BASE.BSP (Bit 8).

Failure to conform to the above conditions results in the processor signaling a general protection exception.

Prior to execution of the ENTERACCS leaf, other logical processors, i.e., RLPs, in the platform must be:

* Idle in a wait-for-SIPI state (as initiated by an INIT assertion or through reset for non-BSP designated

processors), or

* In the SENTER sleep state as initiated by a GETSEC[SENTER] from the initiating logical processor (ILP).

If other logical processor(s) in the same package are not idle in one of these states, execution of ENTERACCS signals a general protection exception. The same requirement and action applies if the other logical processor(s) of the same package do not have CR0.CD = 0.

A successful execution of ENTERACCS results in the ILP entering an authenticated code execution mode. Prior to reaching this point, the processor performs several checks. These include:

* Establish and check the location and size of the specified authenticated code module to be executed by the

processor.

* Inhibit the ILP's response to the external events: INIT, A20M, NMI, and SMI. * Broadcast a message to enable protection of memory and I/O from other processor agents. * Load the designated code module into an authenticated code execution area. * Isolate the contents of the authenticated code execution area from further state modification by external

agents.

* Authenticate the authenticated code module. * Initialize the initiating logical processor state based on information contained in the authenticated code module

header.

* Unlock the Intel(R) TXT-capable chipset private configuration space and TPM locality 3 space.

* Begin execution in the authenticated code module at the defined entry point.

The GETSEC[ENTERACCS] function requires two additional input parameters in the general purpose registers EBX and ECX. EBX holds the authenticated code (AC) module physical base address (the AC module must reside below 4 GBytes in physical address space) and ECX holds the AC module size (in bytes). The physical base address and size are used to retrieve the code module from system memory and load it into the internal authenticated code execution area. The base physical address is checked to verify it is on a modulo-4096 byte boundary. The size is verified to be a multiple of 64, that it does not exceed the internal authenticated code execution area capacity (as reported by GETSEC[CAPABILITIES]), and that the top address of the AC module does not exceed 32 bits. An error condition results in an abort of the authenticated code execution launch and the signaling of a general protection exception.

As an integrity check for proper processor hardware operation, execution of GETSEC[ENTERACCS] will also check the contents of all the machine check status registers (as reported by the MSRs IA32_MCi_STATUS) for any valid uncorrectable error condition. In addition, the global machine check status register IA32_MCG_STATUS MCIP bit must be cleared and the IERR processor package pin (or its equivalent) must not be asserted, indicating that no machine check exception processing is currently in progress. These checks are performed prior to initiating the load of the authenticated code module. Any outstanding valid uncorrectable machine check error condition present in these status registers at this point will result in the processor signaling a general protection violation.

The ILP masks the response to the assertion of the external signals INIT#, A20M, NMI#, and SMI#. This masking remains active until optionally unmasked by GETSEC[EXITAC] (this defined unmasking behavior assumes GETSEC[ENTERACCS] was not executed by a prior GETSEC[SENTER]). The purpose of this masking control is to prevent exposure to existing external event handlers that may not be under the control of the authenticated code module.

The ILP sets an internal flag to indicate it has entered authenticated code execution mode. The state of the A20M pin is likewise masked and forced internally to a de-asserted state so that any external assertion is not recognized during authenticated code execution mode.

To prevent other (logical) processors from interfering with the ILP operating in authenticated code execution mode, memory (excluding implicit write-back transactions) access and I/O originating from other processor agents are blocked. This protection starts when the ILP enters into authenticated code execution mode. Only memory and I/O transactions initiated from the ILP are allowed to proceed. Exiting authenticated code execution mode is done by executing GETSEC[EXITAC]. The protection of memory and I/O activities remains in effect until the ILP executes GETSEC[EXITAC].

Prior to launching the authenticated execution module using GETSEC[ENTERACCS] or GETSEC[SENTER], the processor's MTRRs (Memory Type Range Registers) must first be initialized to map out the authenticated RAM addresses as WB (writeback). Failure to do so may affect the ability for the processor to maintain isolation of the loaded authenticated code module. If the processor detected this requirement is not met, it will signal an Intel(R) TXT reset condition with an error code during the loading of the authenticated code module.

While physical addresses within the load module must be mapped as WB, the memory type for locations outside of the module boundaries must be mapped to one of the supported memory types as returned by GETSEC[PARAME- TERS] (or UC as default).

To conform to the minimum granularity of MTRR MSRs for specifying the memory type, authenticated code RAM (ACRAM) is allocated to the processor in 4096 byte granular blocks. If an AC module size as specified in ECX is not a multiple of 4096 then the processor will allocate up to the next 4096 byte boundary for mapping as ACRAM with indeterminate data. This pad area will not be visible to the authenticated code module as external memory nor can it depend on the value of the data used to fill the pad area.

At the successful completion of GETSEC[ENTERACCS], the architectural state of the processor is partially initialized from contents held in the header of the authenticated code module. The processor GDTR, CS, and DS selectors are initialized from fields within the authenticated code module. Since the authenticated code module must be relocatable, all address references must be relative to the authenticated code module base address in EBX. The processor GDTR base value is initialized to the AC module header field GDTBasePtr + module base address held in EBX and the GDTR limit is set to the value in the GDTLimit field. The CS selector is initialized to the AC module header SegSel field, while the DS selector is initialized to CS + 8. The segment descriptor fields are implicitly initialized to BASE=0, LIMIT=FFFFFh, G=1, D=1, P=1, S=1, read/write access for DS, and execute/read access for CS. The processor begins the authenticated code module execution with the EIP set to the AC module header EntryPoint field + module base address (EBX). The AC module based fields used for initializing the processor state are checked for consistency and any failure results in a shutdown condition.

A summary of the register state initialization after successful completion of GETSEC[ENTERACCS] is given for the processor in Table 7-4. The paging is disabled upon entry into authenticated code execution mode. The authenticated code module is loaded and initially executed using physical addresses. It is up to the system software after execution of GETSEC[ENTERACCS] to establish a new (or restore its previous) paging environment with an appropriate mapping to meet new protection requirements. EBP is initialized to the authenticated code module base physical address for initial execution in the authenticated environment. As a result, the authenticated code can reference EBP for relative address based references, given that the authenticated code module must be position independent.

**Register State Initialization After GETSEC[ENTERACCS]**

| Register State | Initialization Status | Comment |
| --- | --- | --- |
| CR0 | PG0, AM0, WP0: Others unchanged | Paging, Alignment Check, Write-protection are disabled. |
| CR4 | MCE0, CET0, PCIDE0, FRED0: Others | Machine Check Exceptions, Control-flow Enforcement Technology, Process-context |
|  | unchanged | Identifiers, and FRED disabled. |
| EFLAGS | 00000002H |  |
| IA32_EFER | 0H | IA-32e mode disabled. |
| EIP | AC.base + EntryPoint | AC.base is in EBX as input to GETSEC[ENTERACCS]. |
| [E\|R]BX | Pre-ENTERACCS state: Next [E\|R]IP prior to GETSEC[ENTERACCS] | Carry forward 64-bit processor state across GETSEC[ENTERACCS]. |
| ECX | Pre-ENTERACCS state: [31:16]=GDTR.limit; [15:0]=CS.sel | Carry forward processor state across GETSEC[ENTERACCS]. |
| [E\|R]DX | Pre-ENTERACCS state: GDTR base | Carry forward 64-bit processor state across GETSEC[ENTERACCS]. |
| EBP | AC.base |  |
| CS | Sel=[SegSel], base=0, limit=FFFFFh, G=1, D=1, AR=9BH |  |
| DS | Sel=[SegSel] +8, base=0, limit=FFFFFh, G=1, D=1, AR=93H |  |
| GDTR | Base= AC.base (EBX) + [GDTBasePtr], Limit=[GDTLimit] |  |
| DR7 | 00000400H |  |
| IA32_DEBUGCTL | 0H |  |
| IA32_MISC_ENABLE | See Table 7-5 for example. | The number of initialized fields may change due to processor implementation. |
| Performance | 0H |  |
| counters and counter |  |  |
| control registers |  |  |

Performance related counters and counter control registers are cleared as part of execution of ENTERACCS. This implies any active performance counters at any time of ENTERACCS execution will be disabled. To reactive the processor performance counters, this state must be re-initialized and re-enabled.

The IA32_MISC_ENABLE MSR is initialized upon entry into authenticated execution mode. Certain bits of this MSR are preserved because preserving these bits may be important to maintain previously established platform settings (See the footnote for Table 7-5.). The remaining bits are cleared for the purpose of establishing a more consistent environment for the execution of authenticated code modules. One of the impacts of initializing this MSR is any previous condition established by the MONITOR instruction will be cleared.

To support the possible return to the processor architectural state prior to execution of GETSEC[ENTERACCS], certain critical processor state is captured and stored in the generalpurpose registers at instruction completion. [E|R]BX holds effective address ([E|R]IP) of the instruction that would execute next after GETSEC[ENTERACCS], ECX[15:0] holds the CS selector value, ECX[31:16] holds the GDTR limit field, and [E|R]DX holds the GDTR base field. The subsequent authenticated code can preserve the contents of these registers so that this state can be manually restored if needed, prior to exiting authenticated code execution mode with GETSEC[EXITAC]. For the processor state after exiting authenticated code execution mode, see the description of GETSEC[SEXIT].

**IA32_MISC_ENABLE MSR Initialization1 by ENTERACCS and SENTER**

| Field | Bit position | Description |
| --- | --- | --- |
| Fast strings enable | 0 | Clear to 0. |
| FOPCODE compatibility mode | 2 | Clear to 0. |
| enable |  |  |
| Thermal monitor enable | 3 | Set to 1 if other thermal monitor capability is not enabled.2 |
| Split-lock disable | 4 | Clear to 0. |
| Bus lock on cache line splits | 8 | Clear to 0. |
| disable |  |  |
| Hardware prefetch disable | 9 | Clear to 0. |
| GV1/2 legacy enable | 15 | Clear to 0. |
| MONITOR/MWAIT s/m enable | 18 | Clear to 0. |
| Adjacent sector prefetch disable | 19 | Clear to 0. |

Operation in a Uni-Processor Platform

(* The state of the internal flag ACMODEFLAG persists across instruction boundary *)

```text
IF (CR4.SMXE=0)
```

```text
    THEN #UD;
```

ELSIF (in VMX non-root operation)

```text
    THEN VM Exit (reason="GETSEC instruction");
```

ELSIF (GETSEC leaf unsupported)

```text
    THEN #UD;
```

ELSIF ((in VMX operation) or

(CR0.PE=0) or (CR0.CD=1) or (CR0.NW=1) or (CR0.NE=0) or (CPL>0) or (EFLAGS.VM=1) or (IA32_APIC_BASE.BSP=0) or (TXT chipset not present) or (ACMODEFLAG=1) or (IN_SMM=1))

```text
          THEN #GP(0);
IF (GETSEC[PARAMETERS].Parameter_Type = 5, MCA_Handling (bit 6) = 0)
```

```text
    FOR I = 0 to IA32_MCG_CAP.COUNT-1 DO
          IF (IA32_MC[I]_STATUS = uncorrectable error)
                THEN #GP(0);
```

OD; FI;

```text
IF (IA32_MCG_STATUS.MCIP=1) or (IERR pin is asserted)
```

```text
    THEN #GP(0);
ACBASE := EBX;
ACSIZE := ECX;
IF (((ACBASE MOD 4096)  0) or ((ACSIZE MOD 64 )  0 ) or (ACSIZE < minimum module size) OR (ACSIZE > authenticated RAM
```

capacity)) or ((ACBASE+ACSIZE) > (2^32 -1)))

```text
    THEN #GP(0);
IF (secondary thread(s) CR0.CD = 1) or ((secondary thread(s) NOT(wait-for-SIPI)) and
```

(secondary thread(s) not in SENTER sleep state)

```text
    THEN #GP(0);
```

Mask SMI, INIT, A20M, and NMI external pin events;

```text
IA32_MISC_ENABLE := (IA32_MISC_ENABLE & MASK_CONST*)
```

(* The hexadecimal value of MASK_CONST may vary due to processor implementations *)

```text
A20M := 0;
IA32_DEBUGCTL := 0;
```

Invalidate processor TLB(s); Drain Outgoing Transactions;

```text
ACMODEFLAG := 1;
```

SignalTXTMessage(ProcessorHold); Load the internal ACRAM based on the AC module size; (* Ensure that all ACRAM loads hit Write Back memory space *)

```text
IF (ACRAM memory type  WB)
    THEN TXT-SHUTDOWN(#BadACMMType);
IF (AC module header version isnot supported) OR (ACRAM[ModuleType]  2)
    THEN TXT-SHUTDOWN(#UnsupportedACM);
```

(* Authenticate the AC Module and shutdown with an error if it fails *)

```text
KEY := GETKEY(ACRAM, ACBASE);
KEYHASH := HASH(KEY);
CSKEYHASH := READ(TXT.PUBLIC.KEY);
IF (KEYHASH  CSKEYHASH)
    THEN TXT-SHUTDOWN(#AuthenticateFail);
SIGNATURE := DECRYPT(ACRAM, ACBASE, KEY);
```

(* The value of SIGNATURE_LEN_CONST is implementation-specific*)

```text
FOR I=0 to SIGNATURE_LEN_CONST - 1 DO
    ACRAM[SCRATCH.I] := SIGNATURE[I];
```

```text
COMPUTEDSIGNATURE := HASH(ACRAM, ACBASE, ACSIZE);
FOR I=0 to SIGNATURE_LEN_CONST - 1 DO
```

```text
    ACRAM[SCRATCH.SIGNATURE_LEN_CONST+I] := COMPUTEDSIGNATURE[I];
IF (SIGNATURE  COMPUTEDSIGNATURE)
```

```text
    THEN TXT-SHUTDOWN(#AuthenticateFail);
ACMCONTROL := ACRAM[CodeControl];
IF ((ACMCONTROL.0 = 0) and (ACMCONTROL.1 = 1) and (snoop hit to modified line detected on ACRAM load))
```

```text
    THEN TXT-SHUTDOWN(#UnexpectedHITM);
IF (ACMCONTROL reserved bits are set)
```

```text
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[GDTBasePtr] < (ACRAM[HeaderLen] * 4 + Scratch_size)) OR
```

((ACRAM[GDTBasePtr] + ACRAM[GDTLimit]) >= ACSIZE))

```text
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACMCONTROL.0 = 1) and (ACMCONTROL.1 = 1) and (snoop hit to modified line detected on ACRAM load))
    THEN ACEntryPoint := ACBASE+ACRAM[ErrorEntryPoint];
ELSE
    ACEntryPoint := ACBASE+ACRAM[EntryPoint];
IF ((ACEntryPoint >= ACSIZE) OR (ACEntryPoint < (ACRAM[HeaderLen] * 4 + Scratch_size)))THEN TXT-SHUTDOWN(#BadACMFormat);
IF (ACRAM[GDTLimit] & FFFF0000h)
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[SegSel] > (ACRAM[GDTLimit] - 15)) OR (ACRAM[SegSel] < 8))
    THEN TXT-SHUTDOWN(#BadACMFormat);
IF ((ACRAM[SegSel].TI=1) OR (ACRAM[SegSel].RPL0))
    THEN TXT-SHUTDOWN(#BadACMFormat);
CR0.[PG.AM.WP] := 0;
CR4.MCE := 0;
ACRAM[CR4High].FRED := CR4.FRED;
CR4.FRED := 0;
EFLAGS := 00000002h;
IA32_EFER := 0h;
[E|R]BX := [E|R]IP of the instruction after GETSEC[ENTERACCS];
ECX := Pre-GETSEC[ENTERACCS] GDT.limit:CS.sel;
[E|R]DX := Pre-GETSEC[ENTERACCS] GDT.base;
EBP := ACBASE;
GDTR.BASE := ACBASE+ACRAM[GDTBasePtr];
GDTR.LIMIT := ACRAM[GDTLimit];
CS.SEL := ACRAM[SegSel];
CS.BASE := 0;
CS.LIMIT := FFFFFh;
CS.G := 1;
CS.D := 1;
CS.AR := 9Bh;
DS.SEL := ACRAM[SegSel]+8;
DS.BASE := 0;
DS.LIMIT := FFFFFh;
DS.G := 1;
DS.D := 1;
DS.AR := 93h;
DR7 := 00000400h;
IA32_DEBUGCTL := 0;
```

SignalTXTMsg(OpenPrivate); SignalTXTMsg(OpenLocality3);

```text
EIP := ACEntryPoint;
```

END;

## Flags affected

All flags are cleared.

Use of Prefixes

LOCK                    Causes #UD.

REP*                    Cause #UD (includes REPNE/REPNZ and REP/REPE/REPZ).

Operand size            Causes #UD.

NP                      66/F2/F3 prefixes are not allowed.

Segment overrides Ignored.

Address size            Ignored.

REX                     Ignored.
