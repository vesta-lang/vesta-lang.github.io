---
summary: CPU Identification
---

## Description

The ID flag (bit 21) in the EFLAGS register indicates support for the CPUID instruction. If a software procedure can set and clear this flag, the processor executing the procedure supports the CPUID instruction. This instruction operates the same in non-64-bit modes and 64-bit mode.

CPUID returns processor identification and feature information in the EAX, EBX, ECX, and EDX registers.1 The instruction's output is dependent on the contents of the EAX register upon execution and, in some cases, ECX.

Chapter 21, "Processor Identification and Feature Determination," in Volume 1 of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual provides CPUID leaf information and shows information returned, depending on the initial value loaded into the EAX and ECX registers.

CPUID can be executed at any privilege level to serialize instruction execution. Serializing instruction execution guarantees that any modifications to flags, registers, and memory for previous instructions are completed before the next instruction is fetched and executed. Although the CPUID instruction provides serialization, it is not the preferred method on newer processors that support the SERIALIZE instruction. See "Serializing Instructions" in Chapter 11 of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3A for more details.

Execution of CPUID causes a VM exit when executed in VMX non-root operation. See Chapter 27, "Virtual Machine Control Structures," of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3C for more details.

## IA-32 architecture compatibility

CPUID is not supported in early models of the Intel486 processor or in any IA-32 processor earlier than the Intel486 processor.

## Operation

```text
IA32_BIOS_SIGN_ID MSR := Update with installed microcode revision number;
(* Note that for some leaf values in EAX, the subleaf value in ECX is ignored. *)
(* Note that for invalid CPUID leaves and subleaves, the output values returned in EAX, EBX, ECX, and EDX are "Reserved" *)
(* Refer to Volume 1, Chapter 21 for details surrounding CPUID_INFO() *)
(EAX, EBX, ECX, EDX) := CPUID_INFO(EAX, ECX)
```

## Flags affected

None.

## CPUID leaves

CHAPTER 21

When writing software intended to run on Intel processors, it is necessary to identify the type of processor present in a system and the processor features that are available to an application. The CPUID instruction, known as CPU Identification, was introduced with the Intel(R) Pentium processor to query the processor's information name space for its identity and supported features. Logically, the CPUID name space comprises a series of nodes indexed by leaf (using the input value of EAX) and in some cases further indexed by sub-leaf (using the input value of ECX). The value of a queried node is returned in EAX, EBX, ECX, and EDX. Note that not all leaves have sub-leaf indexing and the input ECX value will be ignored in those cases. The full description of CPUID can be found in Chapter 3 of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 2A. All references to "MAX_LEAF" throughout this chapter are used as an abbreviation of "CPUID.00H:EAX.MAX_LEAF".

### 21.1 IMPORTANT CONSIDERATIONS WHEN USING THE CPUID INSTRUCTION

This section outlines additional factors to consider when using the CPUID instruction.

#### 21.1.1 Guidelines for Using the CPUID Instruction

Use the CPUID instruction for processor identification in the Pentium M processor family, Pentium 4 processor family, Intel Xeon processor family, P6 family, Pentium processor, and later Intel486 processors. This instruction returns the family, model, and (for some processors) a brand string for the processor that executes the instruction. It also indicates the features that are present in the processor and gives information about the processor's caches and TLB. The ID flag (bit 21) in the EFLAGS register indicates support for the CPUID instruction. If a software procedure can set and clear this flag, the processor executing the procedure supports the CPUID instruction. The CPUID instruction will cause the invalid opcode exception (#UD) if executed on a processor that does not support it. To obtain processor identification information, a source operand value is placed in the EAX register to select the type of information to be returned. When the CPUID instruction is executed, selected information is returned in the EAX, EBX, ECX, and EDX registers. The following guidelines are among the most important and should always be followed when using the CPUID instruction to determine available features:

* Always begin by testing for the "GenuineIntel," message in the EBX, EDX, and ECX registers when the CPUID

instruction is executed with EAX equal to 0. If the processor is not genuine Intel, the feature identification flags may have different meanings than are described in Intel documentation.

* Test feature identification flags individually and do not make assumptions about undefined bits.

#### 21.1.2 Identification of Earlier Processors

The CPUID instruction is not available in earlier Intel processors up through the earlier Intel 486 processors. For these processors, several other architectural features can be exploited to identify the processor. The settings of bits 12 and 13 (IOPL), 14 (NT), and 15 (reserved) in the EFLAGS register are different for Intel's 32-bit processors than for the Intel 8086 and Intel 286 processors. By examining the settings of these bits (with the PUSHF/PUSHFD and POPF/POPFD instructions), an application program can determine whether the processor is an 8086, Intel 286, or one of the Intel 32-bit processors:

* 8086 processor -- Bits 12 through 15 of the EFLAGS register are always set. * Intel 286 processor -- Bits 12 through 15 are always clear in real-address mode.

* 32-bit processors -- In real-address mode, bit 15 is always clear and bits 12 through 14 have the last value

loaded into them. In protected mode, bit 15 is always clear, bit 14 has the last value loaded into it, and the IOPL bits depend on the current privilege level (CPL). The IOPL field can be changed only if the CPL is 0. Other EFLAGS register bits that can be used to differentiate between the 32-bit processors:

* Bit 18 (AC) -- Implemented only on the Pentium 4, Intel Xeon, P6 family, Pentium, and Intel486 processors.

The inability to set or clear this bit distinguishes an Intel386 processor from the later IA-32 processors.

* Bit 21 (ID) -- Determines if the processor is able to execute the CPUID instruction. The ability to set and clear

this bit indicates that it is a Pentium 4, Intel Xeon, P6 family, Pentium, or later-version Intel486 processor. To determine whether an x87 FPU or Numeric Processor Extension (NPX) is present in a system, applications can write to the x87 FPU status and control registers using the FNINIT instruction and then verify that the correct values are read back using the FNSTENV instruction. After determining that an x87 FPU or NPX is present, its type can then be determined. In most cases, the processor type will determine the type of FPU or NPX; however, an Intel386 processor is compatible with either an Intel 287 or Intel 387 math coprocessor. The method the coprocessor uses to represent  (after the execution of the FINIT, FNINIT, or RESET instruction) indicates which coprocessor is present. The Intel 287 math coprocessor uses the same bit representation for + and -; whereas, the Intel 387 math coprocessor uses different representations for + and -.

#### 21.1.3 CPUID Basic and Extended Range

The CPUID basic range starts at CPUID.00H and ends at the maximum leaf enumerated in CPUID.00H:EAX.MAX_LEAF[31:0]. The legacy set of CPUID leaves are defined as leaves 00H, 01H, and 02H, which represent the architecture up to and including Pentium II. Processors provided legacy compatibility by limiting the exposed number of leaves to just these legacy leaves by setting IA32_MISC_ENABLE[22] (Limit CPUID Maxval). This is no longer supported on processors that report CPUID.07H.01H:EBX.CPUIDMAXVAL_LIM_RMV[3] as 1; for such processors, IA32_MIS- C_ENABLE[22] cannot be set to 1 to limit the value returned by CPUID.00H:EAX.MAX_LEAF. The extended CPUID range starts at leaf 80000000H and ends at the maximum leaf enumerated in CPUID.80000000H:EAX.MAX_EXTENDED_LEAF[31:0]. Older processors before the Pentium 4 do not support the extended CPUID range and treat bit 31 of CPUID's input EAX value as zero. If a value entered for CPUID.EAX is higher than the maximum input value for basic or extended function for that processor then the data for the highest basic information leaf is returned. Software should not rely on the values returned by the processor outside of the above ranges. The range CPUID.40000000H to CPUID.4FFFFFFFH do not return feature information for the processor. These are allocated for emulation by software.

#### 21.1.4 CPUID Domains

The fields of each CPUID node are classified into one of several CPUID domains. The fields may be classified separately within a specific node or in aggregate for all the nodes in a leaf or sub-leaf. On a properly configured platform, all logical processors within a CPUID domain return a consistent output value for fields belonging to that domain. As an example, the initial X2APIC ID value returned in CPUID.1FH.00H:EDX[31:0] is classified as being in the Logical Processor Domain because the value is unique for each logical processor in the platform. Whereas, the CLFLUSH Line Size returned in CPUID.00H:EBX[15:8] is classified as Platform Domain because it must be consistent for all logical processor within the entire platform.

* Platform Domain--A properly configured platform would provide consistent values for these CPUID fields for

each logical processor in the platform.

* Package Domain--A properly configured platform provides consistent values for these CPUID fields for each

logical processor within the same processor package. These values however can be different when comparing the values of logical processors on different packages.

* Logical Processor Domain--A properly configured platform can provide different values for these CPUID

fields for each logical processor in the platform. The values contained within these may have their own scope as per a specific shared resource (i.e., cache, hybrid, etc.); in that case, each logical processor may need to be queried to obtain the full platform view of given features.

#### 21.1.5 CPUID Runtime Mutable Fields

A CPUID field is said to be mutable if it can change during runtime. Such fields are affected by supervisor-mode operations that can affect processor mode, status bits, or privileged registers. Mutable fields that are expected to change dynamically as part of normal operation are shown in the table Table 21-1. Mutable fields that should remain consistent are shown in the table Table 21-2. Note all of the listed controls may not be available on all Intel processors.

**Runtime Mutable CPUID Fields Expected to Change During Normal Operation**

| Leaf | Sub-Leaf | Register | Field Name | Description and Mutability Control |
| --- | --- | --- | --- | --- |
| 01H | Ignored | ECX[27] | OSXSAVE | If 1, the OS has set CR4.OSXSAVE[bit 18] to enable XSETBV/XGETBV instructions to access XCR0 and to support processor extended state management using XSAVE/XRSTOR. |
| 07H | 00H | ECX[4] | OSPKE | If 1, OS has set CR4.PKE to enable protection keys (and the RDPKRU/WRPKRU instructions). |
| 0DH | 00H | EBX[31:0] | XSAVE_BYTES_ ENABLED_FEATURE | The size of the XSAVE/XRSTOR area required for the state bits enabled in XCR0. |
| 0DH | 01H | EBX[31:0] | XSAVE_BYTES_ ENABLED_FEATURE | The size of the XSAVES/XRSTORS area required for the state bits enabled in XCR0 and IA32_XSS. |
| 19H | 00H | EBX[0] | AESKLE | If 1, if the AES Key Locker instructions have been activated by system firmware and the OS has set CR4.KL[bit 19] = 1. |
| 80000001H | Ignored | EDX[20] | SYSCALL_SYSRET_64 | Intel processors support SYSCALL and SYSRET only in 64-bit mode. This feature flag is always enumerated as 0 outside 64-bit mode. |

**Runtime Mutable CPUID Fields That Should Remain Consistent**

| Leaf | Sub-Leaf | Register | Field Name | Description and Mutability Control |
| --- | --- | --- | --- | --- |
| 00H | Ignored | EAX[31:0] | MAX_LEAF | Support for legacy software by limiting CPUID number of leaves reporting to a maximum of 2. This is set by using IA32_MISC_ENABLE[22] Limit CPUID Maxval. |
| 01H | Ignored | ECX[3] | MONITOR | This feature flag reflects the setting in IA32_MISC_ENABLE[18] Enable Monitor FSM. |
| 01H | Ignored | ECX[7] | EIST | This feature flag reflects the setting in IA32_MISC_ENABLE[16] Enhanced Intel SpeedStep Technology Enable. |
| 01H | Ignored | EDX[9] | APIC | This feature flag reflects IA32_APIC_BASE[11], APIC Global Enable. |
| 05H | Ignored | ECX[0] | MONITOR_MWAIT_ EXTENSIONS | This field not available when CPUID.01H:ECX.MONITOR[3] = 0. |

**Runtime Mutable CPUID Fields That Should Remain Consistent (Contd.)**

| Leaf | Sub-Leaf | Register | Field Name | Description and Mutability Control |
| --- | --- | --- | --- | --- |
| 00H | Ignored | EAX[31:0] | MAX_LEAF | Support for legacy software by limiting CPUID number of leaves reporting to a maximum of 2. This is set by using IA32_MISC_ENABLE[22] Limit CPUID Maxval. |
| 01H | Ignored | ECX[3] | MONITOR | This feature flag reflects the setting in IA32_MISC_ENABLE[18] Enable Monitor FSM. |
| 01H | Ignored | ECX[7] | EIST | This feature flag reflects the setting in IA32_MISC_ENABLE[16] Enhanced Intel SpeedStep Technology Enable. |
| 01H | Ignored | EDX[9] | APIC | This feature flag reflects IA32_APIC_BASE[11], APIC Global Enable. |
| 05H | Ignored | ECX[0] | MONITOR_MWAIT_ EXTENSIONS | This field not available when CPUID.01H:ECX.MONITOR[3] = 0. |

#### 21.1.6 CPUID Reserved Fields

Software must ignore and not rely upon the values returned by reserved fields of a CPUID leaf or sub-leaf because they may have meaning on future processors. Once a previously-reserved field becomes defined, this specification will be updated to reflect that.

#### 21.1.7 CPUID Instruction for Serialization

Although the CPUID instruction provides serialization, it is not the preferred method on newer processors that support the SERIALIZE instruction, which is enumerated via CPUID.07H.00H:EDX[14]=1. If backward compatibility is required with older processors, use leaf 00H [CPUID.00H] for serialization because it has the lowest latency when executed. See "Serializing Instructions" in Chapter 11 of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3A for more details.

#### 21.1.8 IA32_BIOS_SIGN_ID Returns Microcode Update Signature

For processors that support the microcode update facility, the IA32_BIOS_SIGN_ID MSR is loaded with the update signature whenever CPUID executes. The signature is returned in the upper DWORD. For details, see Chapter 11 in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3A.

### 21.2 METHODS FOR RETURNING BRANDING INFORMATION USING CPUID

Use the following techniques to access branding information: 1. Processor brand string method. 2. Processor brand index; this method uses a software supplied brand string table. These two methods are discussed in the following sections. For methods that are available in early processors, see Section 21.1.2, "Identification of Earlier Processors," of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1.

#### 21.2.1 The Processor Brand String Method

Figure 21-1 describes the algorithm used for detection of the brand string. Processor brand identification software should execute this algorithm on all Intel 64 and IA-32 processors. This method (introduced with Pentium 4 processors) returns an ASCII brand identification string and the Processor Base frequency of the processor to the EAX, EBX, ECX, and EDX registers.

Input: EAX= 0x80000000

CPUID

```text
             IF (EAX & 0x80000000)                   False  Processor Brand
```

String Not Supported

```text
                 CPUID   True
               Function  Extended
```

Supported

EAX Return Value = Max. Extended CPUID

Function Index

```text
             IF (EAX Return Value                    True   Processor Brand
                 0x80000004)                                String Supported
```

OM15194

Figure 21-1. Determination of Support for the Processor Brand String

#### 21.2.2 The Processor Brand Index Method

The brand index method (introduced with Pentium(R) III Xeon(R) processors) provides an entry point into a brand identification table that is maintained in memory by software. In this table, each brand index is associated with an ASCII brand identification string that identifies the official Intel family and model number of a processor.

When CPUID executes with EAX set to 1, the processor returns a brand index to the low byte in EBX. Software can then use this index to locate the brand identification string for the processor in the brand identification table. The first entry (brand index 0) in this table is reserved, allowing for backward compatibility with processors that do not support the brand identification feature. Starting with processor signature family ID = 0FH, model = 03H, brand index method is no longer supported. Use brand string method instead.

Table 21-3 shows brand indices that have identification strings associated with them.

**Mapping of Brand Indices; and Intel 64 and IA-32 Processor Brand Strings**

| Brand Index | Brand String |
| --- | --- |
| 00H          This processor does not support the brand ident | ification feature |
| 01H          Intel(R) Celeron(R) processor1 |  |
| 02H          Intel(R) Pentium(R) III processor1 |  |

**Mapping of Brand Indices; and Intel 64 and IA-32 Processor Brand Strings**

| Brand Index | Brand String |
| --- | --- |
| 00H          This processor does not support the brand ident | ification feature |
| 01H          Intel(R) Celeron(R) processor1 |  |
| 02H          Intel(R) Pentium(R) III processor1 |  |

### 21.3 CPUID LEAVES

The remainder of this chapter provides CPUID enumeration information for Intel(R) 64 and IA-32 architectures.

CPUID.00H -- Maximum Input for Basic CPUID and Vendor ID

CPUID.00H returns the highest value the CPUID recognizes for returning basic processor information. The value is returned in the EAX register and is processor specific. * This leaf is always valid. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 00H Maximum Input for Basic CPUID and Vendor ID**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_LEAF | Maximum input value for basic CPUID Information. | Platform |
| EBX[31:0] | VENDOR_ID_1 | "Genu" | Platform |
| ECX[31:0] | VENDOR_ID_2 | "ntel" | Platform |
| EDX[31:0] | VENDOR_ID_3 | "inel" | Platform |

CPUID.01H -- Version and Features

CPUID.01H returns type, family, model, stepping, and feature information. * This leaf is valid if MAX_LEAF  01H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 01H Output Registers**

| CPUID Output | Description |
| --- | --- |
| Registers |  |
| EAX[31:0] | Version information: Type, Family, Model, and Stepping ID (see "CPUID.01H:EAX--Version Information: Type, |
|  | Family, Model and Stepping ID"). |
| EBX[31:0] | Feature information (see "CPUID.01H:EBX--Feature Information"). |
| ECX[31:0] | Feature information (see "CPUID.01H:ECX--Feature Information"). |
| EDX[31:0] | Feature information (see "CPUID.01H:EDX--Feature Information"). |

**Leaf 01H Version and Features Returned in EAX**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[3:0] | STEPPING_ID | Identifies a revision of the specific processor family and model. The stepping information is specified as a per- package basis for legacy processors. More recent processors do not allow mixing steppings. | Package |
| EAX[7:4] | MODEL_ID | Identifies a set of processors within a family. Certain models of Pentium(R) 4 processors allowed mixed Model IDs and would have this identified as a Package Domain. | Platform |
| EAX[11:8] | FAMILY_ID | Identifies a set of processors that have a general architectural similarity. | Platform |
| EAX[13:12] | PROCESSOR_TYPE | Identifies specific type of processor. | Platform |
| EAX[15:14] | Reserved | Reserved. |  |
| EAX[19:16] | EXTENDED_MODEL_ID | When the Family ID is 06H or 0FH, this field is prepended to the Model ID to provide an 8-bit model identification. | Platform |
| EAX[27:20] | EXTENDED_FAMILY_ID | When the Family ID is 0FH, this field is added to the Family ID to provide an 8-bit family identification. | Platform |
| EAX[31:28] | Reserved | Reserved. |  |

**Processor Type Field**

| Type | Encoding |
| --- | --- |
| Original OEM Processor | 00B |
| Intel OverDrive(R) Processor | 01B |
| Dual processor (not applicable to Intel486 processors) | 10B |
| Intel reserved | 11B |

**Leaf 01H Version and Features Returned in EBX**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EBX[7:0] | BRAND_INDEX | This number provides an entry into a brand string table that contains brand strings for IA- 32 processors. More information about this field is provided in Section 21.2.2, "The Processor Brand Index Method." | Platform |
| EBX[15:8] | CLFLUSH_LINE_SIZE | Value * 8 = cache line size in bytes. This number indicates the size of the cache line flushed by the CLFLUSH and CLFLUSHOPT instructions in 8-byte increments. This field was introduced in the Pentium 4 processor. | Platform |
| EBX[23:16] | APIC_ID_SPACE | Maximum number of addressable IDs for logical processors in this physical package. The nearest power-of-2 integer that is not smaller than EBX[23:16] is the number of unique initial APIC IDs reserved for addressing different logical processors in a physical package. This field is only valid if CPUID.01H.EDX.HTT[28]= 1. See further details below on the usage of this field. | Platform |

EBX[31:24] INITIAL_APIC_ID                          This number is the 8-bit ID that is assigned to  Logical

```text
                                                    the local APIC on the processor during power     Processor
```

up. This field was introduced in the Penium 4 processor. The 8-bit initial APIC ID in EBX[31:24] is

replaced by the 32-bit x2APIC ID, available in Leaf 0BH and Leaf 1FH.

The Maximum Addressable IDs for logical processors in this package should not be used on platforms that support CPUID leaf 0BH or CPUID leaf 1FH as it can be saturated and incorrect. Modern platforms can have many more processors than can be enumerated or have topology domains with discontinuous APIC ID reservations. To correctly enumerate APIC ID information on modern platforms, use CPUID.0BH or CPUID.1FH.

CPUID.01H:ECX Feature Information

The ECX register of CPUID.01H returns the information shown below. For all feature flags, a 1 indicates that the feature is supported. Software should identify Intel as the vendor to properly interpret feature flags. Software must confirm that a processor feature is present using feature flags returned by CPUID prior to using the feature. Software should not depend on future offerings retaining all features.

**Leaf 01H Version and Features Returned in ECX**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| ECX[0] | SSE3 | If 1, supports Streaming SIMD Extensions 3. | Platform |
| ECX[1] | PCLMULQDQ | If 1, supports the PCLMULQDQ instruction. | Platform |
| ECX[2] | DTES64 | 64-bit DS Area. If 1, supports DS area using 64- bit layout. | Platform |
| ECX[3] | MONITOR | If 1, supports the MONITOR/MWAIT and CPUID.05H. | Platform |
| ECX[4] | DS_CPL | If 1, supports the extensions to the Debug Store feature to allow for branch message storage qualified by CPL. | Platform |
| ECX[5] | VMX | If 1, supports the Virtual Machine Extensions. | Platform |
| ECX[6] | SMX | If 1, supports Safer Mode Extensions. See Chapter 7, "Safer Mode Extensions Reference." | Platform |
| ECX[7] | EIST | If 1, supports Enhanced Intel SpeedStep(R) technology. | Platform |
| ECX[8] | TM2 | If 1, supports Thermal Monitor 2. | Platform |
| ECX[9] | SSSE3 | If 1, supports Supplemental Streaming SIMD Extensions 3. | Platform |
| ECX[10] | L1_CONTEXT_ID | If 1, the L1 data cache mode can be set to either adaptive mode or shared mode. See definition of the IA32_MISC_ENABLE MSR Bit 24 (L1 Data Cache Context Mode) for details. | Platform |
| ECX[11] | DEBUG_INTERFACE | If 1, supports IA32_DEBUG_INTERFACE MSR for silicon debug. | Platform |
| ECX[12] | FMA | If 1, supports FMA extensions using YMM state. | Platform |
| 21-10  Vol. 1 |  |  |  |

ECX[13]   CMPXCHG16B           If 1, supports this instruction. See the            Platform "CMPXCHG8B/CMPXCHG16B--Compare and ECX[14]   XTPR_UPDATE_CONTROL  Exchange Bytes" section in this chapter for a       Platform

```text
                               description.                                        Platform
```

ECX[15]   PERF_CAPABILITIES

```text
                               If 1, supports changing IA32_MISC_ENABLE[bit        Platform
```

ECX[16]   Reserved             23]. ECX[17]   PCID                                                                     Platform

```text
                               If 1, supports the performance and debug            Platform
```

ECX[18]   DCA                  feature indication MSR                              Platform

```text
                               IA32_PERF_CAPABILITIES.                             Platform
```

ECX[19]   SSE4_1                                                                   Platform ECX[20]   SSE4_2               Reserved.                                           Platform ECX[21]   X2APIC                                                                   Platform ECX[22]   MOVBE                If 1, supports Process-context identifiers and      Platform ECX[23]   POPCNT               software setting CR4.PCIDE to 1.Process-            Platform ECX[24]   TSC_DEADLINE         context identifiers. Logical ECX[25]   AESNI                If 1, supports the ability to prefetch data from a  Processor ECX[26]   XSAVE                memory mapped device. See CPUID.09H. Platform ECX[27]   OSXSAVE              If 1, supports SSE4.1.                              Platform Platform ECX[28]   AVX                  If 1, supports SSE4.2.                              Platform ECX[29]   F16C If 1, supports x2APIC feature. ECX[30]   RDRAND ECX[31]   Not Used             If 1, supports MOVBE instruction.

If 1, supports the POPCNT instruction.

If 1, the processor's local APIC timer supports one-shot operation using a TSC deadline value.

If 1, supports the AESNI instruction extensions.

If 1, supports the XSAVE/XRSTOR processor extended states feature, the XSETBV/XGETBV instructions, and XCR0.

If 1, the OS has set CR4.OSXSAVE[bit 18] to enable XSETBV/XGETBV instructions to access XCR0 and to support processor extended state management using XSAVE/XRSTOR.

If 1, supports the AVX instruction extensions.

If 1, supports 16-bit floating-point conversion instructions.

If 1, supports RDRAND instruction.

Intel processors always return 0. Allocated for use by software emulation.

CPUID.01H:EDX Feature Information

The EDX register of CPUID.01H returns the information shown below. For all feature flags, a 1 indicates that the feature is supported. Software should identify Intel as the vendor to properly interpret feature flags. Software must confirm that a processor feature is present using feature flags returned by CPUID prior to using the feature. Software should not depend on future offerings retaining all features.

**Leaf 01H Version and Features Returned in EDX**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EDX[0] | FPU | Floating Point Unit On-Chip. The processor contains an x87 FPU. | Platform |

EDX[1]        VME                                   If 1, supports Virtual 8086 mode                   Platform enhancements, including CR4.VME for EDX[2]        DE                                    controlling the feature; CR4.PVI for protected     Platform

```text
                                                    mode virtual interrupts; software interrupt        Platform
```

EDX[3]        PSE                                   indirection; expansion of the TSS with the         Platform

```text
                                                    software indirection bitmap; and EFLAGS.VIF        Platform
```

EDX[4]        TSC                                   and EFLAGS.VIP flags.                              Platform Platform EDX[5]        MSR                                   If 1, supports I/O breakpoints debugging

```text
                                                    extensions, including CR4.DE for controlling the   Platform
```

EDX[6]        PAE                                   feature, and optional trapping of accesses to      Platform DR4 and DR5. EDX[7]        MCE                                                                                      Platform P If 1, supports page size extensions for large EDX[8]        CMPXCHG8B                             pages of size 4 MByte, including: CR4.PSE for EDX[9]        APIC                                  controlling the feature; the defined dirty bit in PDE (Page Directory Entries); optional reserved EDX[10]       Reserved                              bit trapping in CR3; PDEs; and PTEs. EDX[11]       SEP If 1, supports the Time Stamp Counter, RDTSC instruction, including CR4.TSD for controlling privilege.

If 1, supports the Model Specific Registers RDMSR and WRMSR Instructions. Some of the MSRs are implementation dependent.

If 1, supports the Physical Address Extension which is for physical addresses greater than 32 bits, including: extended page table entry formats; an extra level in the page translation tables; and 2-MByte pages rather than 4 Mbyte pages.

If 1, supports exception 18 for Machine Checks, including CR4.MCE for controlling the feature. This feature does not define the modelspecific implementations of machine-check error logging, reporting, and processor shutdowns. Machine Check exception handlers may have to depend on processor version to do model specific processing of the exception, or test for the presence of the Machine Check feature.

If 1, supports the CMPXCHG8B (64 bits) Instruction, implicitly locked and atomic.

If 1, the processor contains an Advanced Programmable Interrupt Controller (APIC), responding to memory mapped commands in the physical address range FEE00000H to FEE00FFFH (by default - some processors permit the APIC to be relocated).

Reserved.

If 1 supports the SYSENTER and SYSEXIT Instructions and associated MSRs.

EDX[12]  MTRR      If 1, supports the Memory Type Range                Platform Registers. (The MTRRcap MSR contains feature

bits that describe what memory types are supported, how many variable MTRRs are supported, and whether fixed MTRRs are

supported.)

EDX[13]  PGE       If 1, supports the global bit in paging-structure   Platform

entries that map a page, indicating TLB entries that are common to different processes and need not be flushed. The CR4.PGE bit controls

this feature.

EDX[14]  MCA       If 1, supports the Machine Check Architecture       Platform

feature. The MCG_CAP MSR contains feature bits describing how many banks of error reporting MSRs are supported.

EDX[15]  CMOV      If 1, supports the Conditional Move Instructions.   Platform

If CPUID.01H:EDX.FPU[0] (x87 FPU present) is 1 also, supports the FCOMI and FCMOV instructions.

EDX[16]  PAT       If 1, supports the Page Attribute Table feature.    Platform (This feature augments the Memory Type

Range Registers (MTRRs), allowing an operating system to specify attributes of memory accessed through a linear address on a 4KB

granularity.)

EDX[17]  PSE_36    If 1, supports the 36-Bit Page Size Extension       Platform

which enables 4-MByte pages addressing physical memory beyond 4 GBytes with 32-bit paging. This feature indicates that upper bits of

the physical address of a 4-MByte page are encoded in bits 20:13 of the page directory entry. Such physical addresses are limited by

MAXPHYADDR and may be up to 40 bits in size.

EDX[18]  PSN       If 1, supports the 96-bit Processor Serial          Platform

Number identification number feature, and the feature is enabled. Available only in Pentium III, see CPUID.03H.

EDX[19]  CLFLUSH   If 1, supports the CLFLUSH instruction.             Platform EDX[20]  Reserved EDX[21]  DS        Reserved.

```text
                   If 1, supports the Debug Store feature which        Platform
```

provides the ability to write debug information into a memory resident buffer. This feature is used by the branch trace store (BTS) and

processor event-based sampling (PEBS) facilities (see Chapter 19, "Debug, Branch Profile, TSC, and Intel(R) Resource Director

Technology (Intel(R) RDT) Features," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3B).

EDX[22]       ACPI                                  If 1, supports the Thermal Monitor and            Platform Software Controlled Clock Facilities. These are EDX[23]       MMX                                   internal MSRs that allow processor temperature    Platform EDX[24]       FXSR                                  to be monitored and processor performance to      Platform be modulated in predefined duty cycles under EDX[25]       SSE                                   software control.                                 Platform EDX[26]       SSE2                                                                                    Platform EDX[27]       SELF_SNOOP                            If 1, supports the Intel MMX Technology.          Platform Platform EDX[28]       HTT                                   If 1, supports the FXSAVE and FXRSTOR

```text
                                                    Instructions, which are fast save and restore of  Platform
```

EDX[29]       TM                                    the floating-point context, and the availability

```text
                                                    of CR4.OSFXSR for an operating system to          Platform
```

EDX[30]       Reserved                              indicate support of same. EDX[31]       PBE If 1, supports SSE.

If 1, supports SSE2.

If 1, supports Self Snoop which is the management of conflicting memory types by performing a snoop of its own cache structure for transactions issued to the bus.

If 1, the value in CPUID.1.EBX[23:16] (the Maximum number of addressable IDs for logical processors in this package) is valid for the package. If 0, there is only a single logical processor in the package and software should assume only a single APIC ID is reserved.

If 1, supports the Thermal Monitor feature in which the processor implements the thermal monitor automatic thermal control circuitry (TCC).Thermal Monitor.

Reserved.

If 1, supports the Pending Break Enable feature, which is the use of the FERR#/PBE# pin when the processor is in the stop-clock state (STPCLK# is asserted) to signal the processor that an interrupt is pending and that the processor should return to normal operation to handle the interrupt.

CPUID.02H -- TLB/Cache/Prefetch Information

CPUID.02H returns TLB, cache, and prefetch information.This leaf has been superseded by CPUID.04H for cache enumeration and CPUID.18H for TLB enumeration. These processors will also report new descriptor values of types 0FEh or 0FFh to refer enumerations to CPUID.04H and CPUID.18H. * This leaf is valid if MAX_LEAF  02H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 02H TLB/Cache/Prefetch Information**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[7:0] | Reserved | Reserved with a value of 1 |  |
| EAX[15:8] | DESCRIPTOR_1 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| EAX[23:16] | DESCRIPTOR_2 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| EAX[31:24] | DESCRIPTOR_3 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| EBX[7:0] | DESCRIPTOR_4 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| EBX[15:8] | DESCRIPTOR_5 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| EBX[23:16] | DESCRIPTOR_6 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| EBX[31:24] | DESCRIPTOR_7 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| ECX[7:0] | DESCRIPTOR_8 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| ECX[15:8] | DESCRIPTOR_9 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| ECX[23:16] | DESCRIPTOR_10 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| ECX[31:24] | DESCRIPTOR_11 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| EDX[7:0] | DESCRIPTOR_12 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| EDX[15:8] | DESCRIPTOR_13 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| EDX[23:16] | DESCRIPTOR_14 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |
| EDX[31:24] | DESCRIPTOR_15 | See Table "Encoding of CPUID Leaf 2 | Logical |
|  |  | Descriptors" below this table. | Processor |

below. Note that the order of descriptors in the EAX, EBX, ECX, and EDX registers is not defined; that is, specific bytes are not designated to contain descriptors for specific cache, prefetch, or TLB types. The descriptors may appear in any order. Note also a processor may report a general descriptor type FFH and FEH and not report any byte descriptor of "cache type" or "*TLB type" via CPUID.02H.

Descriptor    Type        Table 21-12. Encoding of CPUID Leaf 2 Descriptors Value 00H           General  Cache or TLB Description 01H           TLB 02H           TLB      Null descriptor, this byte contains no information. 03H           TLB      Instruction TLB: 4 KByte pages, 4-way set associative, 32 entries. 04H           TLB      Instruction TLB: 4 MByte pages, fully associative, 2 entries. 05H           TLB      Data TLB: 4 KByte pages, 4-way set associative, 64 entries. 06H           Cache    Data TLB: 4 MByte pages, 4-way set associative, 8 entries. 08H           Cache    Data TLB1: 4 MByte pages, 4-way set associative, 32 entries. 09H           Cache    1st-level instruction cache: 8 KBytes, 4-way set associative, 32 byte line size. 0AH           Cache    1st-level instruction cache: 16 KBytes, 4-way set associative, 32 byte line size. 0BH           TLB      1st-level instruction cache: 32KBytes, 4-way set associative, 64 byte line size. 0CH           Cache    1st-level data cache: 8 KBytes, 2-way set associative, 32 byte line size. 0DH           Cache    Instruction TLB: 4 MByte pages, 4-way set associative, 4 entries. 0EH           Cache    1st-level data cache: 16 KBytes, 4-way set associative, 32 byte line size. 1DH           Cache    1st-level data cache: 16 KBytes, 4-way set associative, 64 byte line size. 21H           Cache    1st-level data cache: 24 KBytes, 6-way set associative, 64 byte line size. 22H           Cache    2nd-level cache: 128 KBytes, 2-way set associative, 64 byte line size. 23H           Cache    2nd-level cache: 256 KBytes, 8-way set associative, 64 byte line size. 24H           Cache    3rd-level cache: 512 KBytes, 4-way set associative, 64 byte line size, 2 lines per sector. 25H           Cache    3rd-level cache: 1 MBytes, 8-way set associative, 64 byte line size, 2 lines per sector. 29H           Cache    2nd-level cache: 1 MBytes, 16-way set associative, 64 byte line size. 2CH           Cache    3rd-level cache: 2 MBytes, 8-way set associative, 64 byte line size, 2 lines per sector. 30H           Cache    3rd-level cache: 4 MBytes, 8-way set associative, 64 byte line size, 2 lines per sector. 40H           Cache    1st-level data cache: 32 KBytes, 8-way set associative, 64 byte line size. 41H           Cache    1st-level instruction cache: 32 KBytes, 8-way set associative, 64 byte line size. 42H           Cache    No 2nd-level cache or, if processor contains a valid 2nd-level cache, no 3rd-level cache. 43H           Cache    2nd-level cache: 128 KBytes, 4-way set associative, 32 byte line size. 44H           Cache    2nd-level cache: 256 KBytes, 4-way set associative, 32 byte line size. 45H           Cache    2nd-level cache: 512 KBytes, 4-way set associative, 32 byte line size. 46H           Cache    2nd-level cache: 1 MByte, 4-way set associative, 32 byte line size. 47H           Cache    2nd-level cache: 2 MByte, 4-way set associative, 32 byte line size. 48H           Cache    3rd-level cache: 4 MByte, 4-way set associative, 64 byte line size. 49H           Cache    3rd-level cache: 8 MByte, 8-way set associative, 64 byte line size. 2nd-level cache: 3MByte, 12-way set associative, 64 byte line size. 3rd-level cache: 4MB, 16-way set associative, 64-byte line size (Intel Xeon processor MP, Family 0FH, Model 06H) 2nd-level cache: 4 MByte, 16-way set associative, 64 byte line size.

4AH  Cache  3rd-level cache: 6MByte, 12-way set associative, 64 byte line size.

4BH  Cache  3rd-level cache: 8MByte, 16-way set associative, 64 byte line size.

4CH  Cache  3rd-level cache: 12MByte, 12-way set associative, 64 byte line size.

4DH  Cache  3rd-level cache: 16MByte, 16-way set associative, 64 byte line size.

4EH  Cache  2nd-level cache: 6MByte, 24-way set associative, 64 byte line size.

4FH  TLB    Instruction TLB: 4 KByte pages, 32 entries.

50H  TLB    Instruction TLB: 4 KByte and 2-MByte or 4-MByte pages, 64 entries.

51H  TLB    Instruction TLB: 4 KByte and 2-MByte or 4-MByte pages, 128 entries.

52H  TLB    Instruction TLB: 4 KByte and 2-MByte or 4-MByte pages, 256 entries.

55H  TLB    Instruction TLB: 2-MByte or 4-MByte pages, fully associative, 7 entries.

56H  TLB    Data TLB0: 4 MByte pages, 4-way set associative, 16 entries.

57H  TLB    Data TLB0: 4 KByte pages, 4-way associative, 16 entries.

59H  TLB    Data TLB0: 4 KByte pages, fully associative, 16 entries.

5AH  TLB    Data TLB0: 2 MByte or 4 MByte pages, 4-way set associative, 32 entries.

5BH  TLB    Data TLB: 4 KByte and 4 MByte pages, 64 entries.

5CH  TLB    Data TLB: 4 KByte and 4 MByte pages,128 entries.

5DH  TLB    Data TLB: 4 KByte and 4 MByte pages,256 entries.

60H  Cache  1st-level data cache: 16 KByte, 8-way set associative, 64 byte line size.

61H  TLB    Instruction TLB: 4 KByte pages, fully associative, 48 entries.

63H  TLB    Data TLB: 2 MByte or 4 MByte pages, 4-way set associative, 32 entries and a separate array with

1 GByte pages, 4-way set associative, 4 entries.

64H  TLB    Data TLB: 4 KByte pages, 4-way set associative, 512 entries.

66H  Cache  1st-level data cache: 8 KByte, 4-way set associative, 64 byte line size.

67H  Cache  1st-level data cache: 16 KByte, 4-way set associative, 64 byte line size.

68H  Cache  1st-level data cache: 32 KByte, 4-way set associative, 64 byte line size.

6AH  Cache  uTLB: 4 KByte pages, 8-way set associative, 64 entries.

6BH  Cache  DTLB: 4 KByte pages, 8-way set associative, 256 entries.

6CH  Cache  DTLB: 2M/4M pages, 8-way set associative, 128 entries.

6DH  Cache  DTLB: 1 GByte pages, fully associative, 16 entries.

70H  Cache  Trace cache: 12 K-?op, 8-way set associative.

71H  Cache  Trace cache: 16 K-?op, 8-way set associative.

72H  Cache  Trace cache: 32 K-?op, 8-way set associative.

76H  TLB    Instruction TLB: 2M/4M pages, fully associative, 8 entries.

78H  Cache  2nd-level cache: 1 MByte, 4-way set associative, 64byte line size.

79H  Cache  2nd-level cache: 128 KByte, 8-way set associative, 64 byte line size, 2 lines per sector.

7AH  Cache  2nd-level cache: 256 KByte, 8-way set associative, 64 byte line size, 2 lines per sector.

7BH  Cache  2nd-level cache: 512 KByte, 8-way set associative, 64 byte line size, 2 lines per sector.

7CH  Cache  2nd-level cache: 1 MByte, 8-way set associative, 64 byte line size, 2 lines per sector.

7DH  Cache  2nd-level cache: 2 MByte, 8-way set associative, 64byte line size.

7FH  Cache  2nd-level cache: 512 KByte, 2-way set associative, 64-byte line size.

80H           Cache     2nd-level cache: 512 KByte, 8-way set associative, 64-byte line size.

82H           Cache     2nd-level cache: 256 KByte, 8-way set associative, 32 byte line size.

83H           Cache     2nd-level cache: 512 KByte, 8-way set associative, 32 byte line size.

84H           Cache     2nd-level cache: 1 MByte, 8-way set associative, 32 byte line size.

85H           Cache     2nd-level cache: 2 MByte, 8-way set associative, 32 byte line size.

86H           Cache     2nd-level cache: 512 KByte, 4-way set associative, 64 byte line size.

87H           Cache     2nd-level cache: 1 MByte, 8-way set associative, 64 byte line size.

A0H           DTLB      DTLB: 4k pages, fully associative, 32 entries.

B0H           TLB       Instruction TLB: 4 KByte pages, 4-way set associative, 128 entries.

B1H           TLB       Instruction TLB: 2M pages, 4-way, 8 entries or 4M pages, 4-way, 4 entries.

B2H           TLB       Instruction TLB: 4KByte pages, 4-way set associative, 64 entries.

B3H           TLB       Data TLB: 4 KByte pages, 4-way set associative, 128 entries.

B4H           TLB       Data TLB1: 4 KByte pages, 4-way associative, 256 entries.

B5H           TLB       Instruction TLB: 4KByte pages, 8-way set associative, 64 entries.

B6H           TLB       Instruction TLB: 4KByte pages, 8-way set associative, 128 entries.

BAH           TLB       Data TLB1: 4 KByte pages, 4-way associative, 64 entries.

C0H           TLB       Data TLB: 4 KByte and 4 MByte pages, 4-way associative, 8 entries.

C1H           STLB      Shared 2nd-Level TLB: 4 KByte/2MByte pages, 8-way associative, 1024 entries.

C2H           DTLB      DTLB: 2 MByte/4 MByte pages, 4-way associative, 16 entries.

C3H           STLB      Shared 2nd-Level TLB: 4 KByte /2 MByte pages, 6-way associative, 1536 entries. Also 1GBbyte

pages, 4-way, 16 entries.

C4H           DTLB      DTLB: 2 MByte/ 4MByte pages, 4-way associative, 32 entries.

CAH           STLB      Shared 2nd-Level TLB: 4 KByte pages, 4-way associative, 512 entries.

D0H           Cache     3rd-level cache: 512 KByte, 4-way set associative, 64 byte line size.

D1H           Cache     3rd-level cache: 1 MByte, 4-way set associative, 64 byte line size.

D2H           Cache     3rd-level cache: 2 MByte, 4-way set associative, 64 byte line size.

D6H           Cache     3rd-level cache: 1 MByte, 8-way set associative, 64 byte line size.

D7H           Cache     3rd-level cache: 2 MByte, 8-way set associative, 64 byte line size.

D8H           Cache     3rd-level cache: 4 MByte, 8-way set associative, 64 byte line size.

DCH           Cache     3rd-level cache: 1.5 MByte, 12-way set associative, 64 byte line size.

DDH           Cache     3rd-level cache: 3 MByte, 12-way set associative, 64 byte line size.

DEH           Cache     3rd-level cache: 6 MByte, 12-way set associative, 64 byte line size.

E2H           Cache     3rd-level cache: 2 MByte, 16-way set associative, 64 byte line size.

E3H           Cache     3rd-level cache: 4 MByte, 16-way set associative, 64 byte line size.

E4H           Cache     3rd-level cache: 8 MByte, 16-way set associative, 64 byte line size.

EAH           Cache     3rd-level cache: 12MByte, 24-way set associative, 64 byte line size.

EBH           Cache     3rd-level cache: 18MByte, 24-way set associative, 64 byte line size.

ECH           Cache     3rd-level cache: 24MByte, 24-way set associative, 64 byte line size.

F0H           Prefetch  64-Byte prefetching.

F1H           Prefetch  128-Byte prefetching.

FEH  General  CPUID leaf 2 does not report TLB descriptor information; use CPUID leaf 18H to query TLB and

other address translation parameters.

FFH  General  CPUID leaf 2 does not report cache descriptor information, use CPUID leaf 4 to query cache

parameters.

Example 21-1. Example of Cache and TLB Interpretation

The first member of the family of Pentium 4 processors returns the following information about caches and TLBs when the CPUID executes with an input value of 2: EAX 66 5B 50 01H EBX 0H ECX 0H EDX 00 7A 70 00H Which means: * The least-significant byte (byte 0) of register EAX is set to 01H. This value should be ignored. * The most-significant bit of all four registers (EAX, EBX, ECX, and EDX) is set to 0, indicating that each register contains valid 1-byte descriptors. * Bytes 1, 2, and 3 of register EAX indicate that the processor has:

-- 50H - a 64-entry instruction TLB, for mapping 4-KByte and 2-MByte or 4-MByte pages. -- 5BH - a 64-entry data TLB, for mapping 4-KByte and 4-MByte pages. -- 66H - an 8-KByte 1st level data cache, 4-way set associative, with a 64-Byte cache line size. * The descriptors in registers EBX and ECX are valid, but contain NULL descriptors. * Bytes 0, 1, 2, and 3 of register EDX indicate that the processor has: -- 00H - NULL descriptor. -- 70H - Trace cache: 12 K-op, 8-way set associative. -- 7AH - a 256-KByte 2nd level cache, 8-way set associative, with a sectored, 64-byte cache line size. -- 00H - NULL descriptor.

CPUID.03H -- Processor Serial Number

CPUID.03H returns the processor serial number, if available. Processor serial number (PSN) is not supported in the Pentium 4 processor or later. * This leaf is valid if MAX_LEAF  03H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

Register      Field Name  Table 21-13. Leaf 03H Processor Serial Number                                      Domain EAX[31:0]     Reserved                                                                                       Package EBX[31:0]     Reserved                                        Description                                    Package ECX[31:0]     PSN_31_0 Reserved. EDX[31:0]     PSN_63_32 Reserved.

Bits 00-31 of 96-bit processor serial number. (Available in Pentium III processor only; otherwise, the value in this register is reserved.)

Bits 32-63 of 96-bit processor serial number. (Available in Pentium III processor only; otherwise, the value in this register is reserved.)

CPUID.04H -- Deterministic Cache Parameters

CPUID.04H returns the deterministic cache parameters for each cache level. * This leaf is valid if CPUID.04H.00H:EAX[4:0] <> 0 and MAX_LEAF  04H. * The sub-leaves are enumerated until sub-leaf n returns 0 in EAX[4:0]. * If ECX contains an invalid sub-leaf index, EAX/EBX/ECX/EDX return 0. Sub-leaf index n+1 is invalid if sub-leaf n returns EAX[4:0] as 0.

**Leaf 04H Deterministic Cache Parameters**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[4:0] | CACHE_TYPE | 0 = Null, no more caches. | Logical |
|  |  | 1 = Data Cache. 2 = Instruction Cache. 3 = Unified Cache. 4-31 = Reserved. | Processor |
| EAX[7:5] | CACHE_LEVEL | Cache level (starts at 1). | Logical Processor |
| EAX[8] | SELF_INITIALIZING_CACHE | Self initializing cache level (does not need | Logical |
|  |  | software initialization). | Processor |
| EAX[9] | FULLY_ASSOC | Fully associative cache. | Logical Processor |
| EAX[13:10] | Reserved | Reserved. |  |
| EAX[25:14] | MAX_LP_ADDRESSABLE_IDS | Maximum number of addressable IDs for logical | Logical |
|  |  | processors sharing this cache. Add one to the return value to get the result. The nearest power-of-2 integer that is not smaller than (1 + EAX[25:14]) is the number of unique initial APIC IDs reserved for addressing different logical processors sharing this cache. | Processor |
| EAX[31:26] | MAX_CORES_ADDRESSABLE_IDS_PKG | Maximum number of addressable IDs for processor cores in the physical package. Add one to the return value to get the result. The nearest power-of-2 integer that is not smaller than (1 + EAX[31:26]) is the number of unique Core_IDs reserved for addressing different processor cores in a physical package. Core ID is a subset of bits of the initial APIC ID. The returned value is constant for valid initial values in ECX. Valid ECX values start from 0. The maximum number of addressable IDs for processor cores in the physical package field may contain a saturated value and will not correctly identify the addressable ID reservations for cores in this package on processors where CPUID.0BH and/or CPUID.1FH exist. Processors which enumerate topology information in either CPUID.0BH or CPUID.1FH need to use those leaves to obtain the correct topology details. | Platform |
| EBX[11:0] | LINE_SIZE | System Coherency Line Size. Add one to the return value to get the result. | Platform |
| EBX[21:12] | PHYS_LINE_PARTITIONS | Physical line partitions. | Logical |
|  |  | Add one to the return value to get the result. | Processor |
| EBX[31:22] | NUM_WAYS | Ways of associativity. | Logical |
|  |  | Add one to the return value to get the result. | Processor |

ECX[31:0]     NUM_SETS                              Number of sets.                                    Logical EDX[0]        NOT_LWR_CACHE_FLUSH                   Add one to the return value to get the result.     Processor Logical EDX[1]        INCLUSIVE_CACHE                       0 = WBINVD/INVD from threads sharing this          Processor EDX[2]        COMPLEX_CACHE_INDEXING                cache acts upon lower level caches for threads

```text
                                                    sharing this cache.                                Logical
                                                    1 = WBINVD/INVD is not guaranteed to act upon      Processor
                                                    lower level caches of non-originating threads      Logical
                                                    sharing this cache.                                Processor
```

EDX[31:3]     Reserved                              0 = Cache is not inclusive of lower cache levels. 1 = Cache is inclusive of lower cache levels.

0 = Direct mapped cache. 1 = A complex function is used to index the cache, potentially using all address bits.

Reserved.

When CPUID executes with EAX set to 04H and ECX contains an index value, the processor returns encoded data that describe a set of deterministic cache parameters (for the cache level associated with the input in ECX). Valid index values start from 0. Software can enumerate the deterministic cache parameters for each level of the cache hierarchy starting with an index value of 0, until the parameters report the value associated with the cache type field is 0. This Cache Size in Bytes = (Ways + 1) * (Partitions + 1) * (Line_Size + 1) * (Sets + 1) = (EBX[31:22] + 1) * (EBX[21:12] + 1) * (EBX[11:0] + 1) * (ECX + 1) The CPUID.04H also reports data that can be used to derive the topology of processor cores in a physical package on legacy processors. This information is constant for all valid index values. Software can query the raw data reported by executing CPUID with EAX=04H and ECX=0 and use it as part of the topology enumeration algorithm on processors that do not enumerate either CPUID.0BH or CPUID.1FH as described in Chapter 10, "Multiple- Processor Management," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3A.

CPUID.05H -- MONITOR and MWAIT Features

CPUID.05H returns the MONITOR and MWAIT feature information. * This leaf is valid if MAX_LEAF  05H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 05H MONITOR and MWAIT Features**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[15:0] | SMALLEST_MONITOR_LINE_SIZE | Smallest monitor-line size in bytes (default is processor's monitor granularity). | Platform |
| EAX[31:16] | Reserved | Reserved. |  |
| EBX[15:0] | LARGEST_MONITOR_LINE_SIZE | Largest monitor-line size in bytes (default is processor's monitor granularity). | Platform |
| EBX[31:16] | Reserved | Reserved. |  |
| ECX[0] | MONITOR_MWAIT_EXTENSIONS | If 1, supports enumeration of MONITOR/MWAIT extensions (beyond EAX and EBX registers). | Platform |
| ECX[1] | INTERRUPT_AS_BREAK_EVENT | If 1, supports treating interrupts as break-event for MWAIT, even when interrupts are disabled. | Platform |
| ECX[31:2] | Reserved | Reserved. |  |
| EDX[3:0] | C0_SUB_STATES | Number of C0* sub C-states supported using MWAIT. | Platform |
| EDX[7:4] | C1_SUB_STATES | Number of C1* sub C-states supported using MWAIT. | Platform |
| EDX[11:8] | C2_SUB_STATES | Number of C2* sub C-states supported using MWAIT. | Platform |
| EDX[15:12] | C3_SUB_STATES | Number of C3* sub C-states supported using MWAIT. | Platform |
| EDX[19:16] | C4_SUB_STATES | Number of C4* sub C-states supported using MWAIT. | Platform |
| EDX[23:20] | C5_SUB_STATES | Number of C5* sub C-states supported using MWAIT. | Platform |
| EDX[27:24] | C6_SUB_STATES | Number of C6* sub C-states supported using MWAIT. | Platform |
| EDX[31:28] | C7_SUB_STATES | Number of C7* sub C-states supported using MWAIT. | Platform |

CPUID.06H -- Thermal and Power Management Features

CPUID.06H returns information about thermal and power management features. * This leaf is valid if MAX_LEAF  06H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 06H Thermal and Power Management Features**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[0] | DIGITAL_TEMP_SENSOR | If 1, supports Digital Temperature Sensor. | Platform |
| EAX[1] | TURBO_BOOST | If 1, supports Intel Turbo Boost Technology. (see description of IA32_MISC_ENABLE[38]). | Platform |
| EAX[2] | ALWAYS_RUNNING_APIC_TIMER | If 1, supports APIC-Timer-always-running feature. | Platform |
| EAX[3] | Reserved | Reserved. |  |
| EAX[4] | POWER_LIMIT_NOTIFY | If 1, supports power limit notification controls. | Platform |
| EAX[5] | EXT_CLOCK_MOD | If 1, supports clock modulation duty cycle extension. | Platform |
| EAX[6] | PKG_THERM_MGMT | If 1, supports package thermal management. | Platform |
| EAX[7] | HWP | If 1, supports HWP base registers (IA32_PM_ENABLE[bit 0], IA32_HWP_CAPABILITIES, IA32_HWP_REQUEST, IA32_HWP_STATUS). | Platform |
| EAX[8] | HWP_INTERRUPT | If 1, supports IA32_HWP_INTERRUPT MSR. | Platform |
| EAX[9] | HWP_ACTIVITY_WINDOW | If 1, supports IA32_HWP_REQUEST[bits 41:32]. | Platform |
| EAX[10] | HWP_EPP | If 1, supports IA32_HWP_REQUEST[bits 31:24]. | Platform |
| EAX[11] | HWP_REQUEST_PKG | If 1, supports IA32_HWP_REQUEST_PKG MSR. | Platform |
| EAX[12] | Reserved | Reserved. |  |
| EAX[13] | HDC | If 1, supports HDC base registers IA32_PKG_HDC_CTL, IA32_PM_CTL1, and IA32_THREAD_STALL MSRs. | Platform |
| EAX[14] | TURBO_BOOST_MAX | If 1, supports Intel(R) Turbo Boost Max Technology 3.0. | Platform |
| EAX[15] | HWP_CAP | If 1, supports Highest Performance change capability. | Platform |
| EAX[16] | HWP_PECI_OVERRIDE | If 1, supports HWP PECI override. | Platform |
| EAX[17] | FLEXIBLE_HWP | If 1, supports Flexible HWP. | Platform |
| EAX[18] | HWP_REQUEST_FAST_ACCESS | If 1, supports Fast access mode for the IA32_HWP_REQUEST MSR. | Platform |
| EAX[19] | HW_FEEDBACK | If 1, supports IA32_HW_FEEDBACK_PTR MSR, IA32_HW_FEEDBACK_CONFIG MSR, IA32_PACKAGE_THERM_STATUS MSR bit 26, and IA32_PACKAGE_THERM_INTERRUPT MSR bit 25. | Platform |
| EAX[20] | HWP_REQUEST_IGNORE_IDLE | If 1, supports Ignoring Idle Logical Processor HWP request. | Platform |
| EAX[21] | Reserved | Reserved. |  |
| EAX[22] | HWP_CTL | If 1, supports IA32_HWP_CTL MSR. | Platform |
| 21-24  Vol. 1 |  | PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION |  |

EAX[23]     THREAD_DIRECTOR          If 1, supports Intel(R) Thread Director.             Platform

```text
                                     IA32_HW_FEEDBACK_CHAR and                          Platform
```

EAX[31:24]  Reserved                 IA32_HW_FEEDBACK_THREAD_CONFIG MSRs                Platform EBX[3:0]    DTS_NUM_INT_THRESHOLDS   are supported if set. Platform EBX[31:4]   Reserved                 Reserved.                                          Platform ECX[0]      HW_FEEDBACK_CAP                                                             Package Number of Interrupt Thresholds in Digital ECX[2:1]    Reserved                 Thermal Sensor.                                    Package ECX[3]      ENERGY_PERF_BIAS                                                            Logical

```text
                                     Reserved.                                          Processor
```

ECX[7:4]    Reserved ECX[15:8]   HW_FEEDBACK_NUM_CLASSES  If 1, supports IA32_MPERF and IA32_APERF which provide a measure of delivered processor ECX[31:16]  Reserved                 performance (since last reset of the counters), EDX[7:0]    HW_FEEDBACK_CAPS         as a percentage of the expected processor performance when running at the TSC EDX[11:8]   HW_FEEDBACK_TABLE_SIZE   frequency.

EDX[15:12]  Reserved                 Reserved. EDX[31:16]  HW_FEEDBACK_TABLE_INDEX If 1, supports performance-energy bias preference and a new architectural MSR called IA32_ENERGY_PERF_BIAS (1B0H).

Reserved.

Number of Intel(R) Thread Director classes supported by the processor. Information for that many classes is written into the Intel Thread Director Table by the hardware.

Reserved.

Bitmap of supported hardware feedback interface capabilities. 0 = If 1, supports performance capability reporting. 1 = If 1, supports energy efficiency capability reporting. 2-7 = Reserved. Bits 0 and 1 will always be set together.

Enumerates the size of the hardware feedback interface structure in number of 4 KB pages. Add one to the return value to get the result.

Reserved.

Index (starting at 0) of this logical processor's row in the hardware feedback interface structure. Note that on some parts the index may be same for multiple logical processors. On some parts the indices may not be contiguous, i.e., there may be unused rows in the hardware feedback interface structure.

Details around these features are described in Chapter 16, "Power and Thermal Management," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3B.

CPUID.07H -- Structured Extended Feature Flags

CPUID.07H returns structured extended feature flags enumeration information. The sub-sections of Section provide leaf 07H information. * This leaf is valid if MAX_LEAF  07H. * The maximum sub-leaf value for ECX is specified in CPUID.07H.00H.EAX[31:0] MAX_SUBLEAF. * If ECX contains an invalid Sub-leaf index, EAX/EBX/ECX/EDX return 0. Sub-leaf index n is invalid if n exceeds the value that sub-leaf 0 returns in EAX.

CPUID.07H.00H -- Structured Extended Feature Flags Main Sub-Leaf

CPUID.07H.00H returns the maximum input value of the highest leaf 07H sub-leaf; and EBX, ECX, and EDX contain information of extended feature flags.

**Leaf 07H Sub-Leaf (ECX=0) Output Registers**

| EAX[31:0] | MAX_SUBLEAF | Reports the maximum input value for supported 07H subleaves. | leaf | Platform |
| --- | --- | --- | --- | --- |
| EBX[31:0] |  | Extended Feature Flags Information in EBX (see "CPUID.07H.00H:EBX--Extended Feature Flags Information") |  |  |
| ECX[31:0] |  | Extended Feature Flags Information in ECX (see "CPUID.07H.00H:ECX--Extended Feature Flags Information") |  |  |
| EDX[31:0] |  | Extended Feature Flags Information in EDX (see "CPUID.07H.00H:EDX--Extended Feature Flags Information") |  |  |

**Leaf 07H.00H Structured Extended Feature Flags Returned in EAX**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | Reports the maximum input value for supported leaf 07H sub-leaves. | Platform |

**Leaf 07H.00H Structured Extended Feature Flags Returned in EBX**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EBX[0] | FSGSBASE | If 1, supports RDFSBASE/RDGSBASE/WRFS- BASE/WRGSBASE. | Platform |
| EBX[1] | TSC_ADJUST | If 1, the IA32_TSC_ADJUST MSR is supported. | Platform |
| EBX[2] | SGX | If 1, supports Intel(R) Software Guard Extensions (Intel(R) SGX Extensions). | Platform |
| EBX[3] | BMI1 | If 1, supports the BMI1 instructions. | Platform |
| EBX[4] | HLE | If 1, supports the Hardware Lock Elision instruction set. | Platform |
| EBX[5] | AVX2 | If 1, supports Intel(R) Advanced Vector Extensions 2 (Intel(R) AVX2). | Platform |
| 21-26  Vol. 1 |  |  |  |
|  | PROCESSOR IDENTIFICATION AND | FEATURE DETERMINATION |  |

EBX[6]    FDP_EXCPTN_ONLY      If 1, the x87 FPU Data Pointer is updated only          Platform on x87 exceptions. EBX[7]    SMEP                                                                         Platform If 1, supports Supervisor-Mode Execution EBX[8]    BMI2                 Prevention.                                             Platform EBX[9]    ENH_REP_MOVSB_STOSB                                                          Platform EBX[10]   INVPCID              If 1, supports the BMI2 instructions.                   Platform

EBX[11]   RTM                  If 1, supports Enhanced REP MOVSB/STOSB.                Platform

EBX[12]   RDT_M                If 1, supports INVPCID instruction for system           Platform software that manages process-context EBX[13]   FCS_FDS_DEPRECATION  identifiers.                                            Platform EBX[14]   MPX                                                                          Platform If 1, supports the Restricted Transactional EBX[15]   RDT_A                Memory instruction set.                                 Platform

EBX[16]   AVX512F              If 1, supports Intel(R) Resource Director                 Platform EBX[17]   AVX512DQ             Technology (Intel(R) RDT) Monitoring capability.          Platform EBX[18]   RDSEED                                                                       Platform EBX[19]   ADX                  If 1, deprecates FPU CS and FPU DS values.              Platform EBX[20]   SMAP                                                                         Platform If 1, supports Intel(R) Memory Protection EBX[21]   AVX512_IFMA          Extensions.                                             Platform EBX[22]   Reserved EBX[23]   CLFLUSHOPT           If 1, supports Intel(R) Resource Director                 Platform EBX[24]   CLWB                 Technology (Intel(R) RDT) Allocation capability.          Platform EBX[25]   INTEL_PROC_TRACE                                                             Platform EBX[26]   AVX512PF             If 1, supports the AVX512F instructions.                Platform

EBX[27]   AVX512ER             If 1, supports the AVX512DQ instructions.               Platform

EBX[28]   AVX512CD             If 1, supports the RDSEED instruction.                  Platform EBX[29]   SHA                                                                          Platform If 1, supports the ADX instructions. EBX[30]   AVX512BW                                                                     Platform EBX[31]   AVX512VL             If 1, supports Supervisor-Mode Access                   Platform Prevention and the CLAC/STAC instructions.

If 1, supports the AVX512_IFMA instructions.

Reserved.

If 1, supports the CLFLUSHOPT instruction.

If 1, supports the CLWB instruction.

If 1, supports Intel(R) Processor Trace.

If 1, supports the AVX512PF instructions. (Intel(R) Xeon PhiTM only.)

If 1, supports the AVX512ER instructions. (Intel(R) Xeon PhiTM only.)

If 1, supports the AVX512CD instructions.

If 1, supports Intel(R) Secure Hash Algorithm Extensions (Intel(R) SHA Extensions).

If 1, supports the AVX512BW instructions.

If 1, supports the AVX512VL instructions.

CPUID.07H.00H:ECX Extended Feature Flags Information

The ECX register of CPUID.07H.00H returns the information shown below.

**Leaf 07H.00H Structured Extended Feature Flags Returned in ECX**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| PROCESSOR | IDENTIFICATION A | ND FEATURE  DETERMINATION |  |
| ECX[0] | PREFETCHWT1 | If 1, supports the PREFETCHWT1 (Intel(R) Xeon PhiTM only.) | instruction.         Platform |
| ECX[1] | AVX512_VBMI | If 1, supports the AVX512_VBMI | instructions.        Platform |

ECX[0]        PREFETCHWT1                           If 1, supports the PREFETCHWT1 instruction.      Platform ECX[1]        AVX512_VBMI                           (Intel(R) Xeon PhiTM only.) ECX[2]        UMIP ECX[3]        PKU                                   If 1, supports the AVX512_VBMI instructions. Platform ECX[4]        OSPKE If 1, supports user-mode instruction prevention. Platform ECX[5]        WAITPKG ECX[6]        AVX512_VBMI2                          If 1, supports protection keys for user-mode     Platform ECX[7]        CET_SS                                pages.

```text
                                                    If 1, the OS has set CR4.PKE to enable           Logical
```

Processor protection keys and the RDPKRU/WRPKRU instructions.

```text
                                                    If 1, supports the TPAUSE, UMONITOR, and         Platform
```

UMWAIT instructions.

If 1, supports the AVX512_VBMI2 instructions. Platform

```text
                                                    If 1, supports CET shadow stack features.        Platform
```

Processors that set this bit define bits 1:0 of the IA32_U_CET and IA32_S_CET MSRs.

Enumerates support for the following MSRs: IA32_INTERRUPT_SPP_TABLE_ADDR, IA32_PL3_SSP, IA32_PL2_SSP, IA32_PL1_SSP,

and IA32_PL0_SSP.

ECX[8]        GFNI                                  If 1, supports the GFNI instruction set.         Platform ECX[9]        VAES If 1 and Intel AVX supported, supports the VEX- Platform ECX[10]       VPCLMULQDQ                            encoded AES instruction set.

ECX[11]       AVX512_VNNI                           If 1 and Intel AVX supported, supports the       Platform ECX[12]       AVX512_BITALG                         VPCLMULQDQ instruction. ECX[13]       TME_EN If 1, supports the AVX512_VNNI instructions. Platform

If 1, supports the AVX512_BITALG instructions. Platform

```text
                                                    If 1, the following MSRs are supported:          Platform
```

IA32_TME_CAPABILITY, IA32_TME_ACTIVATE, IA32_TME_EXCLUDE_MASK, and IA32_TME_EXCLUDE_BASE.

ECX[14]       AVX512_VPOPCNTDQ                      If 1, supports the AVX512_VPOPCNTDQ              Platform instructions.

ECX[15]       Reserved                              Reserved. ECX[16]       LA57 If 1, supports 57-bit linear addresses and five- Platform level paging.

ECX[21:17] MPX_MAWAU                                The value of MAWAU used by the BNDLDX and Platform BNDSTX instructions in 64-bit mode.

ECX[22]       RDPID                                 If 1, RDPID and the IA32_TSC_AUX MSR are         Platform available.

ECX[23]       KEY_LOCKER                            If 1, supports Key Locker.                       Platform ECX[24]       BUS_LOCK_DETECT ECX[25]       CLDEMOTE                              If 1, indicates support for OS bus-lock detection. Platform ECX[26]       Reserved ECX[27]       MOVDIRI                               If 1, supports cache line demote.                Platform ECX[28]       MOVDIR64B ECX[29]       ENQCMD                                Reserved.

```text
                                                    If 1, supports the MOVDIRI instruction.          Platform
```

```text
                                                    If 1, supports the MOVDIR64B instruction.        Platform
```

```text
                                                    If 1, supports Enqueue Stores.                   Platform
```

ECX[30]   SGX_LC                If 1, supports SGX Launch Configuration.               Platform ECX[31]   PKS                                                                          Platform If 1, supports protection keys for supervisormode pages.

CPUID.07H.00H:EDX Extended Feature Flags Information

The EDX register of CPUID.07H.00H returns the information shown below.

**Leaf 07H.00H Structured Extended Feature Flags Returned in EDX**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EDX[0] | Reserved | Reserved. |  |
| EDX[1] | SGX_KEYS | If 1, supports Attestation Services for Intel(R) SGX. | Platform |
| EDX[2] | AVX512_4VNNIW | If 1, supports the AVX512_4VNNIW instructions. (Intel(R) Xeon PhiTM only.) | Platform |
| EDX[3] | AVX512_4FMAPS | If 1, supports the AVX512_4FMAPS instructions. (Intel(R) Xeon PhiTM only.) | Platform |
| EDX[4] | FAST_SHORT_REP_MOVSB | If 1, supports Fast Short REP MOVSB. | Platform |
| EDX[5] | UINTR | If 1, supports user interrupts. | Platform |
| EDX[7:6] | Reserved | Reserved. |  |
| EDX[8] | AVX512_VP2INTERSECT | If 1, supports the AVX512_VP2INTERSECT instruction. | Platform |
| EDX[9] | MCU_OPT_CTRL | If 1, supports both the IA32_MCU_OPT_CTRL MSR and its bit 0 (RNGDS_MITG_DIS). | Platform |
| EDX[10] | MD_CLEAR | If 1, supports MD_CLEAR. | Platform |
| EDX[11] | RTM_ALWAYS_ABORT | If 1, any execution of XBEGIN immediately aborts and transitions to the specified fallback address. | Platform |
| EDX[12] | Reserved | Reserved. |  |
| EDX[13] | RTM_FORCE_ABORT | If 1, supports RTM_FORCE_ABORT and the IA32_TSX_FORCE_ABORT MSR. These allow software to set IA32_TSX_FORCE_ABORT[0] (RTM_FORCE_ABORT). | Platform |
| EDX[14] | SERIALIZE | If 1, supports SERIALIZE instruction. | Platform |
| EDX[15] | HYBRID | If 1, the processor is identified as a hybrid part. If CPUID.00H.MAXLEAF  1AH and CPUID.1AH:EAX <> 0, then the Native Model ID Enumeration Leaf 1AH exists. | Platform |
| EDX[16] | TSXLDTRK | If 1, supports Intel TSX suspend/resume of load address tracking. | Platform |
| EDX[17] | Reserved | Reserved. |  |
| EDX[18] | PCONFIG | If 1, supports the PCONFIG instruction. | Platform |
| EDX[19] | ARCH_LBRS | If 1, supports architectural LBRs. | Platform |
| EDX[20] | CET_IBT | If 1, supports CET indirect branch tracking features. Processors that set this bit define bits 5:2 and bits 63:10 of the IA32_U_CET and IA32_S_CET MSRs. | Platform |
| PROCESSOR | IDENTIFICATION AND FEATURE DETERMINATION |  |  |
| EDX[21] | Reserved | Reserved. |  |
| EDX[22] | AMX_BF16 | If 1, supports tile computational operations on bfloat16 numbers. | Platform |
| EDX[23] | AVX512_FP16 | If 1, supports the FP16 data type with AVX512 instructions. | Platform |
| EDX[24] | AMX_TILE | If 1, supports tile architecture. | Platform |
| EDX[25] | AMX_INT8 | If 1, supports tile computational operations on 8-bit integers. | Platform |
| EDX[26] | IBRS_IBPB | If 1, supports indirect branch restricted speculation (IBRS) and the indirect branch predictor barrier (IBPB). Processors that set this bit support the IA32_SPEC_CTRL MSR and the IA32_PRED_CMD MSR. They allow software to set IA32_SPEC_CTRL[0] (IBRS) and IA32_PRED_CMD[0] (IBPB). | Platform |
| EDX[27] | SPEC_CTRL_ST_PREDICTORS | If 1, supports single thread indirect branch predictors (STIBP). Processors that set this bit support the IA32_SPEC_CTRL MSR. They allow software to set IA32_SPEC_CTRL[1] (STIBP). | Platform |
| EDX[28] | L1D_FLUSH_INTERFACE | If 1, supports L1D_FLUSH. Processors that set this bit support the IA32_FLUSH_CMD MSR. They allow software to set IA32_FLUSH_CMD[0] (L1D_- FLUSH). | Platform |
| EDX[29] | ARCH_CAPABILITIES | If 1, supports the IA32_ARCH_CAPABILITIES MSR. | Platform |
| EDX[30] | CORE_CAPABILITIES | If 1, supports the IA32_CORE_CAPABILITIES MSR. IA32_CORE_CAPABILITIES is an architectural MSR that enumerates model-specific features. A bit being set in this MSR indicates that a model specific feature is supported; software must still consult CPUID family/model/stepping to determine the behavior of the enumerated feature as features enumerated in IA32_CORE_CAPABILITIES may have different behavior on different processor models. Some of these features may have behavior that is consistent across processor models (and for which consultation of CPUID family/model/stepping is not necessary); such features are identified explicitly where they are documented in this manual. | Platform |
| EDX[31] | SPEC_CTRL_SSBD | If 1, supports Speculative Store Bypass Disable (SSBD). Processors that set this bit support the IA32_SPEC_CTRL MSR. They allow software to set IA32_SPEC_CTRL[2] (SSBD). | Platform |

EDX[21]  Reserved                                   Reserved.                                           Platform EDX[22]  AMX_BF16                                                                                       Platform

```text
                                                    If 1, supports tile computational operations on     Platform
```

EDX[23]  AVX512_FP16                                bfloat16 numbers.                                   Platform Platform EDX[24]  AMX_TILE                                   If 1, supports the FP16 data type with AVX512 EDX[25]  AMX_INT8                                   instructions.                                       Platform Platform EDX[26]  IBRS_IBPB                                  If 1, supports tile architecture.                   Platform Platform EDX[27]  SPEC_CTRL_ST_PREDICTORS                    If 1, supports tile computational operations on

```text
                                                    8-bit integers.                                     Platform
```

EDX[28]  L1D_FLUSH_INTERFACE If 1, supports indirect branch restricted EDX[29]  ARCH_CAPABILITIES                          speculation (IBRS) and the indirect branch EDX[30]  CORE_CAPABILITIES                          predictor barrier (IBPB). Processors that set this bit support the IA32_SPEC_CTRL MSR and the EDX[31]  SPEC_CTRL_SSBD                             IA32_PRED_CMD MSR. They allow software to set IA32_SPEC_CTRL[0] (IBRS) and IA32_PRED_CMD[0] (IBPB).

If 1, supports single thread indirect branch predictors (STIBP). Processors that set this bit support the IA32_SPEC_CTRL MSR. They allow software to set IA32_SPEC_CTRL[1] (STIBP).

If 1, supports L1D_FLUSH. Processors that set this bit support the IA32_FLUSH_CMD MSR. They allow software to set IA32_FLUSH_CMD[0] (L1D_- FLUSH).

If 1, supports the IA32_ARCH_CAPABILITIES MSR.

If 1, supports the IA32_CORE_CAPABILITIES MSR. IA32_CORE_CAPABILITIES is an architectural MSR that enumerates model-specific features. A bit being set in this MSR indicates that a model specific feature is supported; software must still consult CPUID family/model/stepping to determine the behavior of the enumerated feature as features enumerated in IA32_CORE_CAPABILITIES may have different behavior on different processor models. Some of these features may have behavior that is consistent across processor models (and for which consultation of CPUID family/model/stepping is not necessary); such features are identified explicitly where they are documented in this manual.

If 1, supports Speculative Store Bypass Disable (SSBD). Processors that set this bit support the IA32_SPEC_CTRL MSR. They allow software to set IA32_SPEC_CTRL[2] (SSBD).

CPUID.07H.01H -- Structured Extended Feature Sub-Leaf 1

CPUID.07H.01H:EAX Extended Feature Information

The EAX register of CPUID.07H.01H returns the information shown below.

**Leaf 07H.01H Structured Extended Feature Flags Returned in EAX**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[0] | SHA512 | If 1, supports the SHA512 instructions. | Platform |
| EAX[1] | SM3 | If 1, supports the SM3 instructions. | Platform |
| EAX[2] | SM4 | If 1, supports the SM4 instructions. | Platform |
| EAX[3] | Reserved | Reserved. |  |
| EAX[4] | AVX_VNNI | If 1, supports the VEX-encoded versions of the Vector Neural Network Instructions. | Platform |
| EAX[5] | AVX512_BF16 | If 1, supports the Vector Neural Network Instructions supporting BFLOAT16 inputs and conversion instructions from IEEE single precision. | Platform |
| EAX[6] | LASS | If 1, supports Linear Address Space Separation. | Platform |
| EAX[7] | CMPCCXADD | If 1, supports the CMPccXADD instruction. | Platform |
| EAX[8] | ARCH_PERFMON_EXT | If 1, supports ArchPerfmonExt. When set, indicates that the Architectural Performance Monitoring Extended Leaf (EAX=23H) is valid. | Platform |
| EAX[9] | Reserved | Reserved. |  |
| EAX[10] | FAST_REP_MOVSB | If 1, supports fast zero-length REP MOVSB. | Platform |
| EAX[11] | FAST_REP_STOSB | If 1, supports fast short REP STOSB. | Platform |
| EAX[12] | FAST_REP_CMPSB_SCASB | If 1, supports fast short REP CMPSB, REP SCASB. | Platform |
| EAX[16:13] | Reserved | Reserved. |  |
| EAX[17] | FRED | If 1, supports Flexible Return and Event Delivery and the architectural state (MSRs) defined by FRED. Any Intel processor that enumerates support for FRED transitions will also enumerate support for LKGS. | Platform |
| EAX[18] | LKGS | If 1, supports the LKGS (load into IA32_KERNEL_GS_BASE) instruction. | Platform |
| EAX[19] | WRMSRNS | If 1, supports the WRMSRNS instruction. | Platform |
| EAX[20] | Reserved | Reserved. |  |
| EAX[21] | AMX_FP16 | If 1, supports tile computational operations on FP16 numbers. | Platform |
| EAX[22] | HRESET | If 1, supports history reset via the HRESET instruction and the IA32_HRESET_ENABLE MSR. When set, indicates that the Processor History Reset Leaf (EAX = 20H) is valid. | Platform |
| EAX[23] | AVX_IFMA | If 1, supports the AVX-IFMA instructions. | Platform |
| EAX[25:24] | Reserved | Reserved. |  |
| EAX[26] | LAM | If 1, supports Linear Address Masking. | Platform |
| EAX[27] | MSRLIST | If 1, supports the RDMSRLIST and WRMSRLIST instructions and the IA32_BARRIER MSR. | Platform |
| EAX[29:28] | Reserved | Reserved. |  |
| EAX[30] | INVD_DISABLE_POST_BIOS_DONE | If 1, supports INVD execution prevention after BIOS Done. | Platform |

EAX[31]       Reserved                              Reserved.

CPUID.07H.01H:EBX Extended Feature Information

The EBX register of CPUID.07H.01H returns the information shown below.

**Leaf 07H.01H Structured Extended Feature Flags Returned in EBX**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EBX[0] | PPIN | If 1, supports the IA32_PPIN and IA32_PPIN_CTL MSRs. | Platform |
| EBX[1] | PBNDKB | If 1, supports the PBNDKB instruction and enumerates the existence of the IA32_TSE_CAPABILITY MSR. | Platform |
| EBX[2] | Reserved | Reserved. |  |
| EBX[3] | CPUIDMAXVAL_LIM_RMV | If 1, IA32_MISC_ENABLE[bit 22] cannot be      set to 1 to limit the value returned by CPUID.00H:EAX[7:0]. | Platform |
| EBX[31:4] | Reserved | Reserved. |  |

**Leaf 07H.01H Structured Extended Feature Flags Returned in ECX**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| ECX[0] | RDT_M_ASYM | If 1, at least one logical processor on this platform supports Asymmetrical Intel(R) RDT Monitoring capability. |  |
| ECX[1] | RDT_A_ASYM | If 1, at least one logical processor on this platform supports Asymmetrical Intel(R) RDT Allocation capability. |  |
| ECX[31:2] | Reserved | Reserved. |  |

**Leaf 07H.01H Structured Extended Feature Flags Returned in EDX**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EDX[3:0] | Reserved | Reserved. |  |
| EDX[4] | AVX_VNNI_INT8 | If 1, supports the AVX-VNNI-INT8 instructions. | Platform |
| EDX[5] | AVX_NE_CONVERT | If 1, supports the AVX-NE-CONVERT instructions. | Platform |
| EDX[7:6] | Reserved | Reserved. |  |
| EDX[8] | AMX_COMPLEX | If 1, supports the AMX_COMPLEX instructions. |  |
| EDX[9] | Reserved | Reserved. |  |
| EDX[10] | AVX_VNNI_INT16 | If 1, supports the AVX-VNNI-INT16 instructions. | Platform |
| 21-32  Vol. 1 |  |  |  |
|  | PROCESSOR | IDENTIFICATION AND FEATURE DETERMINATION |  |

EDX[13:11]    Reserved             Reserved.                                                        Platform EDX[14]       PREFETCHI                                                                             Platform EDX[16:15]    Reserved             If 1, supports the PREFETCHIT0/1 instructions.                   Platform EDX[17]       UIRET_UIF

```text
                                   Reserved.                                                        Platform
```

EDX[18]       CET_SSS                                                                               Platform

```text
                                   If 1, UIRET sets UIF to the value of bit 1 of the                Platform
```

EDX[19]       AVX10                RFLAGS image loaded from the stack.                              Platform

EDX[21:20]    Reserved             If 1, indicates that an operating system can EDX[22]       SEC-TEE-ATTESTATION  enable supervisor shadow stacks as long as it EDX[23]       MWAIT                ensures that a supervisor shadow stack cannot become prematurely busy due to page faults EDX[24]       SLSM                 (see Section 17.2.3 of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, EDX[31:25] Reserved                Volume 1). When emulating the CPUID instruction, a virtual-machine monitor (VMM) should return this bit as 1 only if it ensures that VM exits cannot cause a guest supervisor shadow stack to appear to be prematurely busy. Such a VMM could set the "prematurely busy shadow stack" VM-exit control and use the additional information that it provides.

If 1, supports the Intel(R) AVX10 instructions and indicates the presence of CPUID.24H, which enumerates the version number.

Reserved.

N/A

If 1, MWAIT is supported (even if CPUID.01H:ECX.MONITOR[3] is enumerated as 0).

Static LSM is supported on this platform. If set, IA32_INTEGRITY_STATUS (0x2DC) is available for software use.

Reserved.

CPUID.07H.02H -- Structured Extended Feature Sub-Leaf 2

CPUID.07H.02H returns the structured extended feature information contained in the sub-sections of this section.

CPUID Output                Table 21-26. Leaf 07H Sub-Leaf (ECX=2) Output Registers Registers     Description

EAX[31:0]     Reserved EBX[31:0]     Reserved Reserved ECX[31:0]     Extended Feature Information (see "CPUID.07H.02H:EDX--Extended Feature Information")

EDX[31:0]

CPUID.07H.02H:EDX Extended Feature Information

The EDX register of CPUID.07H.02H returns the information shown below.

**CPUID.07H.02H Extended Feature Information Provided in EDX1**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EDX[0] | PSFD | If 1, supports bit 7 of the IA32_SPEC_CTRL MSR. Bit 7 of this MSR disables Fast Store Forwarding Predictor without disabling Speculative Store Bypass. | Platform |
| EDX[1] | IPRED_CTRL | If 1, supports bits 3 and 4 of the IA32_SPEC_CTRL MSR. Bit 3 of this MSR enables IPRED_DIS control for CPL3. Bit 4 of this MSR enables IPRED_DIS control for CPL0/1/2. | Platform |
| EDX[2] | RRSBA_CTRL | If 1, supports bits 5 and 6 of the IA32_SPEC_CTRL MSR. Bit 5 of this MSR disables RRSBA behavior for CPL3. Bit 6 of this MSR disables RRSBA behavior for CPL0/1/2. | Platform |
| EDX[3] | DDPD_U | If 1, supports bit 8 of the IA32_SPEC_CTRL MSR. Bit 8 of this MSR disables Data Dependent Prefetcher. | Platform |
| EDX[4] | BHI_CTRL | If 1, supports bit 10 of the IA32_SPEC_CTRL MSR. Bit 10 of this MSR enables BHI_DIS_S behavior. | Platform |
| EDX[5] | MCDT_NO | If 1, the processor does not exhibit MXCSR Configuration Dependent Timing (MCDT) behavior and does not need to be mitigated to avoid data- dependent behavior for certain instructions. | Platform |
| EDX[6] | UC_LOCK_DISABLE | If 1, supports the UC-lock disable feature and it causes #AC. | Platform |
| EDX[7] | MONITOR_MITG_NO | If 1, the MONITOR/UMONITOR instructions are not affected by performance or power issues due to MONITOR/UMONITOR instructions exceeding the capacity of an internal monitor tracking table. If 0, then the product may be affected by this issue. | Platform |
| EDX[31:8] | Reserved | Reserved. |  |

CPUID.08H -- Reserved

This leaf is reserved.

Register   Field Name   Table 21-28. Leaf 08H Reserved        Domain EAX[31:0]  Reserved EBX[31:0]  Reserved                              Description ECX[31:0]  Reserved                              Reserved. EDX[31:0]  Reserved                              Reserved. Reserved. Reserved.

CPUID.09H -- Direct Cache Access Information

CPUID.09H returns information about Direct Cache Access capabilities. * This leaf is valid if CPUID.01H:ECX.DCA[18] = 1 and MAX_LEAF  09H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 09H Direct Cache Access Information**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | PLATFORM_DCA_CAP | Value of bits [31:0] of IA32_PLATFORM_DCA_CAP MSR (address 1F8H). | Platform |
| EBX[31:0] | Reserved | Reserved. |  |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |

CPUID.0AH -- Architectural Performance Monitoring

CPUID.0AH returns information about support for architectural performance monitoring capabilities. * This leaf is valid if CPUID.0AH:EAX[7:0] (Version ID) > 0 and MAX_LEAF  0AH. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 0AH Architectural Performance Monitoring**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[7:0] | VERSION | Version ID of architectural performance monitoring. | Platform |
| EAX[15:8] | NUM_GP_CTRS | Number of general-purpose performance monitoring counter(s) per logical processor. | Platform |
| EAX[23:16] | GP_CTR_WIDTH | Bit width of general-purpose, performance monitoring counter. | Platform |
| EAX[31:24] | EVENT_ENUM_LENGTH | Length of EBX bit vector to enumerate architectural performance monitoring events. Architectural event x is supported if EBX[x]=0 && EAX[31:24]>x. | Platform |
| EBX[0] | CORE_CYC_NA | Core cycle event not available if 1 or if EAX[31:24]<1. | Platform |
| EBX[1] | INTR_RET_NA | Instruction retired event not available if 1 or if EAX[31:24]<2. | Platform |
| EBX[2] | REF_CYC_NA | Reference cycles event not available if 1 or if EAX[31:24]<3. | Platform |
| EBX[3] | LLC_CYC_NA | Last-level cache reference event not available if 1 or if EAX[31:24]<4. | Platform |
| EBX[4] | LLC_MISSES_NA | Last-level cache misses event not available if 1 or if EAX[31:24]<5. | Platform |
| EBX[5] | BR_INSTR_RET_NA | Branch instruction retired event not available if 1 or if EAX[31:24]<6. | Platform |
| EBX[6] | BR_MISPRED_RET_NA | Branch mispredict retired event not available if 1 or if EAX[31:24]<7. | Platform |
| EBX[7] | SLOTS_NA | Top-down slots event not available if 1 or if EAX[31:24]<8. | Platform |
| EBX[8] | BACKEND_NA | Topdown backend bound not available if 1 or if EAX[31:24] < 9. | Platform |
| EBX[9] | BADSPEC_NA | Topdown bad speculation not available if 1 or if EAX[31:24] < 10. | Platform |
| EBX[10] | FRONTEND_NA | Topdown frontend bound not available if 1 or if EAX[31:24] < 11. | Platform |
| EBX[11] | RETIRING_NA | Topdown retiring not available if 1 or if EAX[31:24] < 12. | Platform |
| EBX[12] | LBR_INSERTS_NA | LBR inserts not available if 1 or if EAX[31:24] < 13. | Platform |
| EBX[31:13] | Reserved | Reserved. |  |

ECX[31:0]     FIXED_CTR_MASK                        Supported fixed counters bit mask. Fixed-                 Platform

```text
                                                    function performance counter 'i' is supported if          Platform
```

EDX[4:0]      NUM_FIXED_CTR                         bit 'i' is 1 (first counter index starts at zero). It is  Platform

```text
                                                    recommended to use the following logic to                 Platform
```

EDX[12:5]     FIXED_CTR_WIDTH                       determine if a Fixed Counter is supported:

```text
                                                    FxCtr[i]_is_supported := ECX[i] || (EDX[4:0] > i);        Platform
```

EDX[14:13]    Reserved EDX[15]       ANYTHREAD_DEPRECATION                 Number of contiguous fixed-function performance counters starting from 0 (if EDX[19:16] SLOTS_PER_CYC                            Version ID > 1).

EDX[31:20] Reserved                                 Bit width of fixed-function performance counters (if Version ID > 1).

Reserved.

Starting with Architectural Performance Monitoring Version 5, this field indicates that a processor supports AnyThread mode deprecation. If this field is set, software can choose to ignore guidelines in "AnyThread Counting and Software Evolution" of Chapter 21, "Performance Monitoring," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3B

If this field is non-zero, it represents the number of Top-down Microarchitecture Analysis (TMA) slots per cycle. This number can be multiplied by the number of cycles (from CPU_CLK_UNHALTED.THREAD / CPU_CLK_UNHALTED.CORE or IA32_FIXED_CTR1) to determine the total number of slots. If this field is zero, IA32_FIXED_CTR3 should be used to determine the total number of slots.

Reserved.

For each version of architectural performance monitoring capability, software must enumerate this leaf to discover the programming facilities and the architectural performance events available in the processor. The details are described in Chapter 21, "Performance Monitoring," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3C.

CPUID.0BH -- Extended Topology

CPUID.0BH returns information about Extended Topology. CPUID.1FH is a preferred superset to leaf 0BH. Intel recommends first checking for the existence of leaf 1FH before using leaf 0BH. * This leaf is valid if CPUID.0BH.00H:EBX[15:0] <> 0 and MAX_LEAF  0BH.

* When the leaf is invalid, CPUID.0BH.00H:ECX.DOMAIN_TYPE[15:8] will report the Domain Type ID as Invalid (0). * The sub-leaves are enumerated until sub-leaf n returns 0 in EBX[15:0]. * If ECX contains an invalid sub-leaf index, EAX/EBX return 0. Sub-leaf index n+1 is invalid if sub-leaf n returns EBX[15:0] as 0.

CPUID.0BH -- ECX >= 0

**Leaf 0BH Extended Topology**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[4:0] | SHIFT_COUNT | The number of bits that the x2APIC ID must be shifted to the right to address instances of the next higher-scoped domain. When logical processor is not supported by the processor, the value of this field at the Logical Processor domain sub-leaf may be returned as either 0 (no allocated bits in the x2APIC ID) or 1 (one allocated bit in the x2APIC ID); software should plan accordingly. | Platform |
| EAX[31:5] | Reserved | Reserved. |  |
| EBX[15:0] | NEXT_LEVEL_NUM_LP | The number of logical processors across all | Logical |
|  |  | instances of this domain within the next higher- scoped domain. (For example, in a processor socket/package comprising "M" cores of "N" logical processors each, the "core" domain sub- leaf value of this field would be M*N.) This number reflects configuration as shipped by Intel. This field may also contain asymmetric values across different logical processors, as an example of a mix of cores that support more than one logical processor with cores that support only one logical processor. Note, software must not use this field to enumerate processor topology. Software must not use the value of EBX[15:0] to enumerate processor topology of the system. The value is only intended for display and diagnostic purposes. The actual number of logical processors available to BIOS/OS/Applications may be different from the value of EBX[15:0], depending on software and platform hardware configurations. | Processor |
| EBX[31:16] | Reserved | Reserved. |  |
| ECX[7:0] | LEVEL_NUM | The input ECX sub-leaf index. | Platform |

ECX[15:8]     DOMAIN_TYPE                           This field provides an identification value which  Platform indicates the domain shown in the table. ECX[31:16]    Reserved                              Although domains are ordered, their assigned       Logical EDX[31:0]     X2APIC_ID                             identification values are not and software         Processor should not depend on it. Note that enumeration values of 0 and 3-255 are reserved.

Reserved.

The X2APIC ID of this logical processor.

The sub-leaves of CPUID.0BH describe an ordered hierarchy of logical processors starting from the smallest-scoped domain of a Logical Processor (sub-leaf index 0) to the Core domain (sub-leaf index 1) to the largest-scoped domain (the last valid sub-leaf index) that is implicitly subordinate to the unenumerated highest-scoped domain of the processor package (socket). The details of each valid domain is enumerated by a corresponding sub-leaf. Details for a domain include its type and how all instances of that domain determine the number of logical processors and x2 APIC ID partitioning at the next higher-scoped domain. The ordering of domains within the hierarchy is fixed architecturally as shown below. For a given processor, not all domains may be relevant or enumerated; however, the logical processor and core domains are always enumerated. For two valid sub-leaves N and N+1, sub-leaf N+1 represents the next immediate higher-scoped domain with respect to the domain of sub-leaf N for the given processor. If sub-leaf index "N" returns an invalid domain type in ECX[15:08] (00H), then all sub-leaves with an index greater than "N" also return an invalid domain type. A sub-leaf returning an invalid domain always returns 0 in EAX and EBX.

**Hierarchy of Valid Domain Enumerations in CPUID.0BH:ECX[15:8]**

| Hierarchy | Domain | Domain Type ID Value |
| --- | --- | --- |
| Invalid | Invalid | 0 |
| Lowest | Logical Processor | 1 |
| ... | Core | 2 |
| Highest | Package/Socket | (Implied) |
| Reserved | Reserved | 3-255 |
| 21-40  Vol. 1 |  |  |
|  | PROCESSOR IDENTIFICATION AND FEATURE | DETERMINATION |
| CPUID.0CH -- Reserved |  |  |

CPUID.0CH -- Reserved

Register   Field Name  Table 21-33. Leaf 0CH Reserved       Domain EAX[31:0]  Reserved EBX[31:0]  Reserved                            Description ECX[31:0]  Reserved                            Reserved. EDX[31:0]  Reserved                            Reserved. Reserved. Reserved.

CPUID.0DH -- Processor Extended State

CPUID.0DH returns a bit-vector representation of all processor state extensions that are supported in the processor and storage size requirements of the XSAVE/XRSTOR area. * This leaf is valid if CPUID.01H:ECX.XSAVE[26] = 1 and MAX_LEAF  0DH. * Sub-leafs 0 and 1 are always valid; consult them to determine which other sub-leafs are present as described in "CPUID.0DH.n, n>01H--State Sub-Leaves".

CPUID.0DH.00H -- Processor Extended State Main Sub-Leaf

CPUID.0DH.00H returns the processor extended state information.

**Leaf 0DH.00H Processor Extended State**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[0] | X87 | x87 state. | Platform |
| EAX[1] | SSE | SSE state. | Platform |
| EAX[2] | AVX | AVX state. | Platform |
| EAX[3] | MPX_BNDREGS | MPX state. | Platform |
| EAX[4] | MPX_BNDCSR | MPX state. | Platform |
| EAX[5] | AVX512_OPMASK | AVX-512 Opmask state. | Platform |
| EAX[6] | AVX512_ZMM_HI256 | AVX-512 ZMM upper 256 data state. | Platform |
| EAX[7] | AVX512_HI16_ZMM | AVX-512 upper 16 ZMM registers state. | Platform |
| EAX[8] | N/A | Always returns 0 (Allocated for IA32_XSS). | Platform |
| EAX[9] | PKRU | PKRU state. | Platform |
| EAX[16:10] | N/A | Always returns 0 (Allocated for IA32_XSS). | Platform |
| EAX[17] | AMX_TILECFG | TILECFG state. | Platform |
| EAX[18] | AMX_TILEDATA | TILEDATA state. | Platform |
| EAX[31:19] | Reserved | Reserved. |  |
| EBX[31:0] | XSAVE_BYTES_ENABLED_FEATURES | Maximum size (bytes, from the beginning of the | Logical |
|  |  | XSAVE/XRSTOR save area) required by enabled features in XCR0. May be different than ECX if some features at the end of the XSAVE save area are not enabled. | Processor |
| ECX[31:0] | XSAVE_BYTES_SUPPORTED_FEATURES | Maximum size (bytes, from the beginning of the XSAVE/XRSTOR save area) of the XSAVE/XRSTOR save area required by all supported features in the processors, i.e. all the valid bit fields in XCR0. | Platform |
| EDX[31:0] | VALID_XCR0_UPPER_32 | Reports the supported bits of the upper 32 bits of XCR0. XCR0[n+32] can be set to 1 only if EDX[n] is 1. | Platform |

CPUID.0DH.01H -- Feature and Supervisor State Sub-Leaf

CPUID.0DH.01H returns feature and supervisor state information.

**Leaf 0DH.01H Processor Extended State**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[0] | XSAVEOPT | If 1, supports XSAVEOPT. | Platform |
| EAX[1] | XSAVEC | If 1, supports XSAVEC and the compacted form of XRSTOR. | Platform |
| EAX[2] | XGETBV1 | If 1, supports XGETBV with ECX = 1. | Platform |
| EAX[3] | XSAVES | If 1, supports XSAVES/XRSTORS and IA32_XSS. | Platform |
| EAX[4] | XFD | If 1, supports extended feature disable (XFD). | Platform |
| EAX[31:5] | Reserved | Reserved. |  |
| EBX[31:0] | XSAVES_BYTES_ENABLED_FEATURES | The size in bytes of the XSAVE area containing | Logical |
|  |  | all states enabled by XCR0 \| IA32_XSS. If EAX[3] is enumerated as 0 and EAX[1] is enumerated as 1, EBX enumerates the size of the XSAVE area containing all states enabled by XCR0. If EAX[1] and EAX[3] are both enumerated as 0, EBX enumerates zero. | Processor |
| ECX[7:0] | N/A | Always returns 0 (Allocated for XCR0). | Platform |
| ECX[8] | PT | PT state. | Platform |
| ECX[9] | Reserved | Always returns 0 (Allocated for XCR0). |  |
| ECX[10] | PASID | PASID state. | Platform |
| ECX[11] | CET_U | CET user state. | Platform |
| ECX[12] | CET_S | CET supervisor state. | Platform |
| ECX[13] | HDC | HDC state. | Platform |
| ECX[14] | UINTR | UINTR state. | Platform |
| ECX[15] | LBR | LBR state (only for the architectural LBR feature). | Platform |
| ECX[16] | HWP | HWP state. | Platform |
| ECX[18:17] | N/A | Always returns 0 (Allocated for XCR0). | Platform |
| ECX[31:19] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved |  |

//* For each supported feature indicated by sub-leaf 0 and 1, read the size and offset sub-leaf *// For j= 2 to 62

If (CPUID.0DH.00H:<EDX:EAX>[j] == 1 or // Use 64-bit value of EDX:EAX CPUID.0DH.01H:<EDX:ECX>[j] == 1) // Use 64-bit value of EDX:ECX Read(CPUID.0DH.j) // Examine the size and offset.

END IF END FOR

**Leaf 0DH.SUB-LEAVES Processor Extended State**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | COMP_SIZE | The size in bytes (from the offset specified in EBX) of the save area for an extended state feature associated with a valid sub-leaf index n. | Platform |
| EBX[31:0] | COMP_OFFSET | The offset in bytes of this extended state component's save area from the beginning of the XSAVE/XRSTOR area. This field reports 0 if the sub-leaf index, n, does not map to a valid bit in the XCR0 register. If ECX contains an invalid sub-leaf index, EAX/EBX/ECX/EDX return 0. Sub-leaf n (0  n 31) is invalid if sub-leaf 0 returns 0 in EAX[n] and sub-leaf 1 returns 0 in ECX[n]. Sub-leaf n (32  n  63) is invalid if sub-leaf 0 returns 0 in EDX[n-32] and sub-leaf 1 returns 0 in EDX[n- 32] | Platform |
| ECX[0] | COMP_SUP | This bit is set if the bit n (corresponding to the sub-leaf index) is supported in the IA32_XSS MSR; it is clear if bit n is instead supported in XCR0. | Platform |
| ECX[1] | COMP_64B_ALIGNED | This bit is set if, when the compacted format of an XSAVE area is used, this extended state component located on the next 64-byte boundary following the preceding state component (otherwise, it is located immediately following the preceding state component) | Platform |
| ECX[2] | COMP_XFD | This bit is set to indicate support for XFD faulting. | Platform |
| ECX[31:3] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |
| 21-44  Vol. 1 |  |  |  |

CPUID.0EH -- Reserved

This leaf is reserved.

Register   Field Name   Table 21-37. Leaf 0EH Reserved        Domain EAX[31:0]  Reserved EBX[31:0]  Reserved                              Description ECX[31:0]  Reserved                              Reserved. EDX[31:0]  Reserved                              Reserved. Reserved. Reserved.

CPUID.0FH -- Intel(R) Resource Director Technology (Intel(R) RDT) Monitoring

CPUID.0FH returns information for the Intel Resource Director Technology Monitoring capabilities. As described below, software uses the bit vector returned in EDX by sub-leaf 00H to determine the available resource types (ResID) that can be monitored. This information is necessary for software to program the IA32_PQR_ASSOC and IA32_QM_EVTSEL MSRs such that Quality-of-Service data can be read afterwards from the IA32_QM_CTR MSR. * This leaf is valid if CPUID.07H.00H:EBX.RDT_M[12] = 1 and MAX_LEAF  0FH. * If the leaf is valid, sub-leaf 00H is always valid. Sub-leaf n (n  1) is only valid when (CPUID.0FH.00H:EDX[n] == 1).

CPUID.0FH.00H -- Intel(R) RDT Monitoring Main Sub-Leaf

CPUID.0FH.00H returns information about Intel RDT Monitoring.

**Leaf 0FH.00H Intel(R) Resource Director Technology (Intel(R) RDT) Monitoring**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | Reserved | Reserved. |  |
| EBX[31:0] | MAX_RMID | Maximum range (zero-based) of RMID within this physical processor of all types. | Platform |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[0] | Reserved | Reserved. |  |
| EDX[1] | L3_MON | If 1, supports L3 Cache Intel RDT Monitoring. Sub-leaf index 0 reports valid resource type starting at bit position 1 of EDX. | Platform |
| EDX[31:2] | Reserved | Reserved. |  |

**Leaf 0FH.01H Intel(R) Resource Director Technology (Intel(R) RDT) Monitoring**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[7:0] | CTR_WIDTH | The counter width is encoded as an offset from 24b. A value of zero in this field indicates that 24-bit counters are supported. A value of 8 in this field indicates that 32-bit counters are supported. | Platform |
| EAX[8] | RDT_M_OVF | If 1, supports an overflow bit in the IA32_QM_CTR MSR (bit 61). | Platform |
| EAX[9] | IO_RDT_CMT | If 1, indicates the presence of non-CPU agent supporting Intel RDT CMT. | Platform |
| EAX[10] | IO_RDT_MBM | If 1, indicates the presence of non-CPU agent supporting Intel RDT MBM support. | Platform |
| 21-46  Vol. 1 |  |  |  |
|  | PROCESSOR IDENTIFICATION AND FEATURE | DETERMINATION |  |

EAX[31:11]  Reserved      Reserved.                                      Platform EBX[31:0]   CONV_FACTOR

```text
                          Factor used to convert from reported           Platform
```

ECX[31:0]   MAX_RMID_L3   IA32_QM_CTR value to derived occupancy         Platform

```text
                          metric (bytes) and Memory Bandwidth            Platform
```

EDX[0]      CMT_L3_OCCUP  Monitoring (MBM) metrics.                      Platform EDX[1]      MBM_L3_TOTAL EDX[2]      MBM_L3_LOCAL  Maximum range (zero-based) of RMID of this EDX[31:3]   Reserved      resource type.

If 1, supports L3 occupancy monitoring.

If 1, supports L3 total bandwidth monitoring.

If 1, supports L3 local bandwidth monitoring.

Reserved.

CPUID.10H -- Intel(R) Resource Director Technology (Intel(R) RDT) Allocation

CPUID.10H returns information for Intel Resource Director Technology Allocation. This leaf is valid when CPUID.07H.00H:EBX.RDT_A[15] = 1. As described below, software uses the bit vector returned in EBX by subleaf 00H to determine the available QoS Enforcement (allocation) resource types that are supported in the processor. This information is necessary for software to configure each class of services using capability bit masks in the QoS Mask registers, IA32_resourceType_Mask_n. * This leaf is valid if CPUID.07H.00H:EBX.RDT_A[15] = 1 and MAX_LEAF  10H. * If the leaf is valid, sub-leaf 00H is always valid. Sub-leaf n (n  1) is only valid when (CPUID.10H.00H:EBX[n] == 1).

CPUID.10H.00H -- Intel(R) RDT Allocation Main Sub-Leaf

CPUID.10H.00H returns information about Intel RDT Allocation.

**Leaf 10H.00H Intel(R) Resource Director Technology (Intel(R) RDT) Allocation**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | Reserved | Reserved. |  |
| EBX[0] | Reserved | Reserved. |  |
| EBX[1] | CAT_L3 | If 1, supports L3 Cache Allocation Technology. Sub-leaf index 0 reports valid resource identification (ResID) starting at bit position 1 of EBX. | Platform |
| EBX[2] | CAT_L2 | If 1, supports L2 Cache Allocation Technology. | Platform |
| EBX[3] | MBA | If 1, supports Memory Bandwidth Allocation. | Platform |
| EBX[4] | Reserved | Reserved. |  |
| EBX[5] | CBA | If 1, supports Cache Bandwidth Allocation. | Platform |
| EBX[6] | RESOURCE_PRIORITY | If 1, supports Resource Priority. | Platform |
| EBX[31:7] | Reserved | Reserved. |  |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |

**Leaf 10H.01H Intel(R) Resource Director Technology (Intel(R) RDT) Allocation**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[4:0] | CAT_L3_BITMASK_LENGTH | Length of the capacity bit mask for the corresponding ResID. Add one to the return value to get the result. | Platform |
| EAX[31:5] | Reserved | Reserved. |  |
| EBX[31:0] | CAT_L3_CONTENTION | Bit-granular map of isolation/contention of allocation units. | Platform |
| 21-48  Vol. 1 |  |  |  |

ECX[0]      Reserved               Reserved.                                       Platform ECX[1]      CAT_L3_NONCPU                                                          Platform ECX[2]      CAT_L3_CDP             If 1, supports L3 CAT for non-CPU agents.       Platform

ECX[3]      CAT_L3_NONCONTIG       If 1, supports L3 Code and Data Prioritization  Platform Technology. ECX[31:4]   Reserved EDX[15:0]   CAT_L3_MAX_CLOS        If 1, supports non-contiguous capacity bitmasks. The bits that are set in the various EDX[31:16] Reserved                IA32_L3_MASK_n registers do not have to be contiguous.

Reserved.

Highest Class of Service (COS) number supported for this ResID.

Reserved.

CPUID.10H.02H -- L2 Cache Allocation Technology

CPUID.10H.ResID=2 returns information about L2 Cache Allocation Technology.

**Leaf 10H.02H Intel(R) Resource Director Technology (Intel(R) RDT) Allocation**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[4:0] | CAT_L2_BITMASK_LENGTH | Length of the capacity bit mask for the corresponding ResID. Add one to the return value to get the result. | Platform |
| EAX[31:5] | Reserved | Reserved. |  |
| EBX[31:0] | CAT_L2_CONTENTION | Bit-granular map of isolation/contention of allocation units. | Platform |
| ECX[1:0] | Reserved | Reserved. |  |
| ECX[2] | CAT_L2_CDP | If 1, supports L2 Code and Data Prioritization Technology. | Platform |
| ECX[3] | CAT_L2_NONCONTIG | If 1, supports non-contiguous capacity bitmasks. The bits that are set in the various IA32_L2_MASK_n registers do not have to be contiguous. | Platform |
| ECX[31:4] | Reserved | Reserved. |  |
| EDX[15:0] | CAT_L2_MAX_CLOS | Highest Class of Service (COS) number supported for this ResID. | Platform |
| EDX[31:16] | Reserved | Reserved. |  |

**Leaf 10H.03H Intel(R) Resource Director Technology (Intel(R) RDT) Allocation**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[11:0] | MBA_MAX | Reports the maximum MBA throttling value supported for the corresponding ResID. Add one to the return value to get the result. | Platform |
| EAX[31:12] | Reserved | Reserved. |  |

EBX[31:0]     Reserved                              Reserved.                                           Platform ECX[0]        PER_THREAD_MBA                        Per-thread MBA controls are supported.              Platform ECX[1]        Reserved                              Reserved.                                           Platform ECX[2]        MBA_LINEAR                            If 1, the response of the delay values is linear. ECX[31:3]     Reserved                              Reserved. EDX[15:0]     MBA_MAX_CLOS                          Highest Class of Service (COS) number supported for this ResID. EDX[31:16] Reserved                                 Reserved.

CPUID.10H.05H -- Cache Bandwidth Allocation

**Leaf 10H.05H Intel(R) Resource Director Technology (Intel(R) RDT) Allocation**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[7:0] | CBA_MAX_LEVELS | Reports the maximum core throttling level supported for the corresponding ResID. Add one to the return value to get the number of throttling levels supported. | Platform |
| EAX[11:8] | BW_SCOPE | If 1, indicates the logical processor scope of the IA32_QoS_Core_BW_Thrtl_n MSRs. Other values are reserved. | Platform |
| EAX[31:12] | Reserved | Reserved. |  |
| EBX[31:0] | Reserved | Reserved. |  |
| ECX[2:0] | Reserved | Reserved. |  |
| ECX[3] | CBA_LINEAR | If 1, the response of the bandwidth control is approximately linear. If 0, the response of the bandwidth control is non-linear. | Platform |
| ECX[31:4] | Reserved | Reserved. |  |
| EDX[15:0] | CBA_MAX_CLOS | Highest Class of Service (COS) number supported for this ResID. | Platform |
| EDX[31:16] | Reserved | Reserved. |  |
| CPUID.10H.06H - | - Resource Priority Control |  |  |

**Leaf 10H.06H Intel(R) Resource Director Technology (Intel(R) RDT) Allocation**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[0] | THREAD_ENABLE | If 1, supports per-thread enable of RP through the IA32_RESOURCE_PRIORITY MSR. | Platform |
| EAX[1] | PACKAGE_ENABLE | If 1, supports physical processor package enable of RP through the IA32_RESOURCE PRIORITY_PKG MSR. | Platform |
| EAX[31:2] | Reserved | Reserved. |  |
| EBX[31:0] | Reserved | Reserved. |  |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |
| 21-50  Vol. 1 |  |  |  |

CPUID.11H -- Reserved

This leaf is reserved.

Register   Field Name   Table 21-46. Leaf 11H Reserved        Domain EAX[31:0]  Reserved EBX[31:0]  Reserved                              Description ECX[31:0]  Reserved                              Reserved. EDX[31:0]  Reserved                              Reserved. Reserved. Reserved.

CPUID.12H -- Intel(R) Software Guard Extensions (Intel(R) SGX) Capability

CPUID.12H returns information about Intel(R) SGX capabilities. More details can be found in Chapter 35, "Introduction to Intel(R) Software Guard Extensions," and Chapter 36, "Enclave Access Control and Data Structures," of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3D. * This leaf is valid when CPUID.07H.00H:EBX.SGX[2] = 1 and MAX_LEAF  12H. * If the leaf is valid, sub-leaf 00H and 01H are always valid. Sub-leaf n (n  2) is only valid when CPUID.12H.n:EAX[3:0] != 0.

CPUID.12H.00H -- Intel(R) SGX Main Sub-Leaf

CPUID.12H.00H returns information about Intel(R) SGX capabilities. It is only valid when CPUID.07H.00H:EBX.SGX = 1.

**Leaf 12H.00H Intel(R) Software Guard Extensions (Intel(R) SGX) Capability**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[0] | SGX1 | If 1, supports the collection of SGX1 Leaf functions. | Platform |
| EAX[1] | SGX2 | If 1, supports the collection of SGX2 Leaf functions. | Platform |
| EAX[6:2] | Reserved | Reserved. |  |
| EAX[7] | EVERIFYREPORT2 | If 1, supports the ENCLU instruction Leaf EVERIFYREPORT2. | Platform |
| EAX[9:8] | Reserved | Reserved. |  |
| EAX[10] | EUPDATESVN | If 1, supports the ENCLS instruction Leaf EUPDATESVN. | Platform |
| EAX[11] | EDECCSSA | If 1, supports the ENCLU instruction Leaf EDECCSSA. | Platform |
| EAX[31:12] | Reserved | Reserved. |  |
| EBX[31:0] | MISCSELECT | Bit vector of supported extended SGX features. The definition of MISCSELECT can be found in Section 36.7.2, "SECS.MISCSELECT Field," of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3D. | Platform |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[7:0] | MAX_ENCLAVE_SIZE_NOT_64 | The maximum supported enclave size in non- 64-bit mode is 2^(EDX[7:0]). | Platform |
| EDX[15:8] | MAX_ENCLAVE_SIZE_64 | The maximum supported enclave size in 64-bit mode is 2^(EDX[15:8]). | Platform |
| EDX[31:16] | Reserved | Reserved. |  |
| CPUID.12H.01H - | - Intel(R) SGX Attributes |  |  |

**Leaf 12H.01H Intel(R) Software Guard Extensions (Intel(R) SGX) Capability**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| 21-52  Vol. 1 |  |  |  |
|  |  | PROCESSOR IDENTIFICATION AND FEATURE | DETERMINATION |

EAX[31:0]   ECREATE_SECS_ATTRIBUTES_31_0    Reports the valid bits of                       Platform

```text
                                            SECS.ATTRIBUTES[31:0] that software can set     Platform
```

EBX[31:0]   ECREATE_SECS_ATTRIBUTES_63_32   with ECREATE.                                   Platform Platform ECX[31:0]   ECREATE_SECS_ATTRIBUTES_95_64   Reports the valid bits of SECS.ATTRIBUTES[63:32] that software can set EDX[31:0]   ECREATE_SECS_ATTRIBUTES_127_96  with ECREATE.

Reports the valid bits of SECS.ATTRIBUTES[95:64] that software can set with ECREATE.

Reports the valid bits of SECS.ATTRIBUTES[127:96] that software can set with ECREATE.

The definition of the attributes can be found in Section 36.7.1, "ATTRIBUTES," of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3D

CPUID.12H -- n2 - Intel(R) SGX Enclave Page Cache

CPUID.12H with ECX2 returns information about Intel(R) SGX Enclave Page Cache and is supported if CPUID.07H.00H:EBX.SGX = 1. For sub-leaves where ECX2, the definition of EAX[31:4], EBX, ECX, and EDX depends on the sub-leaf type listed below.

Sub-Leaf Encoding Type EAX[3:0] = 0000b (Invalid)

This sub-leaf is invalid. EDX:ECX:EBX:EAX return 0.

CPUID.12H -- Sub-Leaf Encoding Type EAX[3:0] = 0001b

This sub-leaf enumerates an EPC section with EDX:ECX, EBX:EAX defined as follows.

**Leaf 12H.SUB-LEAF ENCODING TYPE EAX[3:0] = 0001B Intel(R) Software Guard Extensions (Intel(R) SGX)**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[3:0] | SUB_LEAF_TYPE | Value is 0001b. | Platform |
| EAX[11:4] | Reserved | Reserved. |  |
| EAX[31:12] | EPC_SECTION_ADDR_31_12 | Bits 31:12 of the physical address of the base of the EPC section. | Platform |
| EBX[19:0] | EPC_SECTION_ADDR_51_32 | Bits 51:32 of the physical address of the base of the EPC section. | Platform |
| EBX[31:20] | Reserved | Reserved. |  |

ECX[3:0]      EPC_SECTION_PROPERTY                  EPC Section Property Encoding Definitions, as  Platform follows:

```text
                                                    0000b  All bits in EDX:ECX are enumerated as
```

0.

```text
                                                    0001b  This section has confidentiality,
```

integrity, and replay protection.

```text
                                                    0010b  This section has confidentiality
```

protection only.

0011b - This section has confidentiality and integrity protection. All other encodings are reserved.

ECX[11:4]     Reserved                              Reserved. ECX[31:12]    EPC_SECTION_SIZE_31_12 Bits 31:12 of the size of the corresponding EPC Platform section within the Processor Reserved Memory.

EDX[19:0]     EPC_SECTION_SIZE_51_32                Bits 51:32 of the size of the corresponding EPC Platform section within the Processor Reserved Memory.

EDX[31:20] Reserved                                 Reserved.

CPUID.13H -- Reserved

This leaf is reserved.

Register   Field Name   Table 21-50. Leaf 13H Reserved        Domain EAX[31:0]  Reserved EBX[31:0]  Reserved                              Description ECX[31:0]  Reserved                              Reserved. EDX[31:0]  Reserved                              Reserved. Reserved. Reserved.

CPUID.14H -- Intel(R) Processor Trace (Intel(R) PT)

CPUID.14H returns information about Intel(R) Processor Trace (PT). CPUID.14H.00H returns information about Intel Processor Trace extensions. CPUID.14H.n (n > 0 and less than the number of non-zero bits in CPUID.14H.00H:EAX) returns information about packet generation in Intel Processor Trace. For more details on Intel PT, see Chapter 34, "Intel(R) Processor Trace," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3D. * This leaf is valid when CPUID.07H.00H:EBX.INTEL_PROC_TRACE[25] = 1 and MAX_LEAF  14H. * The maximum sub-leaf value for ECX is specified in CPUID.14H.00H.EAX[31:0] MAX_SUBLEAF. * If ECX contains an invalid sub-leaf index, EAX/EBX/ECX/EDX return 0. Sub-leaf index n is invalid if n exceeds the value that sub-leaf 0 returns in EAX.

CPUID.14H.00H -- Intel(R) PT Main Sub-Leaf

CPUID.14H.00H returns information about Intel Processor Trace extensions.

**Leaf 14H.00H Intel(R) Processor Trace (Intel(R) PT)**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | Reports the maximum sub-leaf supported in leaf 14H. | Platform |
| EBX[0] | CR3_FILTER | If 1, supports that IA32_RTIT_CTL.CR3Filter can be set to 1, and that IA32_RTIT_CR3_MATCH MSR can be accessed. | Platform |
| EBX[1] | CYC_ACC | If 1, supports Configurable PSB and Cycle- Accurate Mode. | Platform |
| EBX[2] | IP_FILTER | If 1, supports IP Filtering, TraceStop filtering, and preservation of Intel PT MSRs across warm reset. | Platform |
| EBX[3] | MTC | If 1, supports MTC timing packet and suppression of COFI-based packets. | Platform |
| EBX[4] | PTWRITE | If 1, supports PTWRITE. Writes can set IA32_RTIT_CTL[12] (PTWEn) and IA32_RTIT_CTL[5] (FUPonPTW), and PTWRITE can generate packets. | Platform |
| EBX[5] | PWR_EVT_TRACE | If 1, supports Power Event Trace. Writes can set IA32_RTIT_CTL[4] (PwrEvtEn), enabling Power Event Trace packet generation. | Platform |
| EBX[6] | PMI_PRESERVE | If 1, supports the PSB and PMI preservation. Writes can set IA32_RTIT_CTL[56] (InjectPsbPmiOnEn- able), enabling the processor to set IA32_RTIT_STATUS[7] (PendTopaPMI) and/or IA32_RTIT_STATUS[6] (PendPSB) in order to preserve ToPA PMIs and/or PSBs otherwise lost due to Intel PT disable. Writes can also set PendToPAPMI and PendPSB. | Platform |
| EBX[7] | EVENT_TRACE | If 1, supports that writes can set IA32_RTIT_CTL[31] (EventEn), enabling Event Trace packet generation. | Platform |
| EBX[8] | TNT_DIS | If 1, supports that writes can set IA32_RTIT_CTL[55] (DisTNT), disabling TNT packet generation. | Platform |
| 21-56  Vol. 1 |  |  |  |

EBX[9]      PTTT                       If 1, Processor Trace Trigger Tracing (PTTT) is    Platform

```text
                                       supported.                                         Platform
```

EBX[31:10]  Reserved ECX[0]      TOPAOUT                    Reserved.                                          Platform

ECX[1]      MENTRY                     If 1, supports that tracing can be enabled with    Platform

```text
                                       IA32_RTIT_CTL.ToPA = 1, hence utilizing the        Platform
```

ECX[2]      SNGL_RNG_OUT               ToPA output scheme;                                Logical ECX[3]      TRACE_TRANSPORT_SUBSYSTEM  IA32_RTIT_OUTPUT_BASE and                          Processor IA32_RTIT_OUPUT_MASK_PTRS MSRs can be ECX[30:4]   Reserved                   accessed. ECX[31]     LIP If 1, supports that ToPA tables can hold any EDX[31:0]   Reserved                   number of output entries, up to the maximum allowed by the MaskOrTableOffset field of IA32_RTIT_OUTPUT_MASK_PTRS.

If 1, supports the Single-Range Output scheme.

If 1, supports the output to Trace Transport subsystem.

Reserved.

If 1, the generated packets which contain IP payloads contain LIP. If 0, the generated packets which contain IP payloads contain Effective IP. Trace segments using a flat memory model will generate the same information regardless of how a logical processor reports this value since LIP=EIP.

Reserved.

CPUID.14H.01H -- Feature Information Sub-Leaf

CPUID.14H.01H returns information about packet generation in Intel Processor Trace.

**Leaf 14H.01H Intel(R) Processor Trace (Intel(R) PT)**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[2:0] | RANGECNT | Number of configurable Address Ranges for filtering. | Platform |
| EAX[7:3] | Reserved | Reserved. |  |
| EAX[10:8] | TRIGGER_CFG_CNT | Number of IA32_RTIT_TRIGGERx_CFG MSRs. The number of triggers supported is 4x this value. | Platform |
| EAX[15:11] | Reserved | Reserved. |  |
| EAX[31:16] | MTC_RATE | Bitmap of supported MTC period encodings. | Platform |
| EBX[15:0] | CYC_THRESHOLDS | Bitmap of supported Cycle Threshold value encodings. | Platform |
| EBX[31:16] | PSB_RATE | Bitmap of supported Configurable PSB frequency encodings. | Platform |
| ECX[0] | ICNT | If 1, the trigger action EN_ICNT is supported. | Platform |
| ECX[1] | TRIGGER_PAUSE | If 1, the trigger actions TRACE_PAUSE and TRACE_RESUME are supported. | Platform |
| ECX[14:2] | Reserved | Reserved. |  |

ECX[15]       TRIGGER_DR_MATCH                      If 1, trigger input DR match is supported.  Platform ECX[31:16]    Reserved                              Reserved. EDX[31:0]     Reserved                              Reserved.

CPUID.15H -- Time Stamp Counter and Nominal Core Crystal Clock

CPUID.15H returns information about the Time Stamp Counter and the Nominal Core Crystal Clock. * This leaf is valid if MAX_LEAF  15H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 15H Time Stamp Counter and Nominal Core Crystal Clock**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | DENOMINATOR | An unsigned integer which is the denominator of the TSC/"core crystal clock" ratio. | Platform |
| EBX[31:0] | NUMERATOR | An unsigned integer which is the numerator of the TSC/"core crystal clock" ratio. If 0, the TSC/"core crystal clock" ratio is not enumerated. | Platform |
| ECX[31:0] | NOMINAL_ART_FREQUENCY | An unsigned integer which is the nominal frequency of the core crystal clock in Hz. If 0, the nominal core crystal clock frequency is not enumerated. Note, the core crystal clock may differ from the reference clock, bus clock or core clock frequencies. | Platform |
| EDX[31:0] | Reserved | Reserved. |  |

CPUID.16H -- Processor Frequency Information

CPUID.16H returns information about processor frequency information. Data is returned from this interface in accordance with the processor's specification and does not reflect actual values. Suitable use of this data includes the display of processor information in like manner to the processor brand string and for determining the appropriate range to use when displaying processor information e.g. frequency history graphs. The returned information should not be used for any other purpose as the returned information does not accurately correlate to information / counters returned by other processor interfaces. While a processor may support the Processor Frequency Information leaf, fields that return a value of zero are not supported. * This leaf is valid if MAX_LEAF  16H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 16H Processor Frequency Information**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[15:0] | PROCESSOR_BASE_FREQUENCY | Processor Base Frequency (in MHz). | Logical Processor |
| EAX[31:16] | Reserved | Reserved. |  |
| EBX[15:0] | MAXIMUM_FREQUENCY | Maximum Frequency (in MHz). | Logical Processor |
| EBX[31:16] | Reserved | Reserved. |  |
| ECX[15:0] | BUS_FREQUENCY | Bus (Reference) Frequency (in MHz). | Logical Processor |
| ECX[31:16] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |
| 21-60  Vol. 1 |  |  |  |

CPUID.17H -- System-on-Chip Vendor Attribute

CPUID.17H returns System-on-Chip vendor attribute information. * This leaf is valid if CPUID.17H.00H:EAX[31:0] (MaxSOCID_Index)  3 and MAX_LEAF  17H. * The maximum sub-leaf value for ECX is specified in CPUID.17H.00H.EAX[31:0] MaxSOCID_Index. * If ECX contains an invalid sub-leaf index, EAX/EBX/ECX/EDX return 0. Sub-leaf index n is invalid if n exceeds the value that sub-leaf 0 returns in EAX.

CPUID.17H.00H -- Main Sub-Leaf

CPUID.17H.00H returns System-on-Chip vendor attribute information.

**Leaf 17H.00H System-on-Chip Vendor Attribute**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SOCID_INDEX | Reports the maximum input value of supported Sub-leaf in Leaf 17H. | Platform |
| EBX[15:0] | SOC_VENDOR_ID | SOC Vendor ID. | Platform |
| EBX[16] | IS_VENDOR_SCHEME | If 1, the SOC Vendor ID field is assigned via an industry standard enumeration scheme. Otherwise, the SOC Vendor ID field is assigned by Intel. | Platform |
| EBX[31:17] | Reserved | Reserved. |  |
| ECX[31:0] | PROJECT_ID | A unique number an SOC vendor assigns to its SOC projects. | Platform |
| EDX[31:0] | STEPPING_ID | A unique number within an SOC project that an SOC vendor assigns. | Package |

**Leaf 17H.01H System-on-Chip Vendor Attribute**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | VENDOR_BRAND_STRING_BYTES_0_to_3 | SOC Vendor Brand String. UTF-8 encoded string. | Platform |
| EBX[31:0] | VENDOR_BRAND_STRING_BYTES_4_to_7 | SOC Vendor Brand String. UTF-8 encoded string. | Platform |
| ECX[31:0] | VENDOR_BRAND_STRING_BYTES_8_to_11 | SOC Vendor Brand String. UTF-8 encoded string. | Platform |
| EDX[31:0] | VENDOR_BRAND_STRING_BYTES_12_to_15 | SOC Vendor Brand String. UTF-8 encoded string. | Platform |

**Leaf 17H.02H System-on-Chip Vendor Attribute**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | VENDOR_BRAND_STRING_BYTES_16_to_19 | SOC Vendor Brand String. UTF-8 encoded string. | Platform |
| EBX[31:0] | VENDOR_BRAND_STRING_BYTES_20_to_23 | SOC Vendor Brand String. UTF-8 encoded string. | Platform |

ECX[31:0]     VENDOR_BRAND_STRING_BYTES_24_to_27    SOC Vendor Brand String. UTF-8 encoded string. Platform EDX[31:0]     VENDOR_BRAND_STRING_BYTES_28_to_31    SOC Vendor Brand String. UTF-8 encoded string. Platform

CPUID.17H.03H -- Vendor Brand String Sub-Leaf (Bytes 32 to 47)

**Leaf 17H.03H System-on-Chip Vendor Attribute**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | VENDOR_BRAND_STRING_BYTES_32_to_35 | SOC Vendor Brand String. UTF-8 encoded string. | Platform |
| EBX[31:0] | VENDOR_BRAND_STRING_BYTES_36_to_39 | SOC Vendor Brand String. UTF-8 encoded string. | Platform |
| ECX[31:0] | VENDOR_BRAND_STRING_BYTES_40_to_43 | SOC Vendor Brand String. UTF-8 encoded string. | Platform |
| EDX[31:0] | VENDOR_BRAND_STRING_BYTES_44_to_47 | SOC Vendor Brand String. UTF-8 encoded string. | Platform |

**Leaf 17H.M>MAXSOCID_INDEX--RESERVED SUB-LEAVES System-on-Chip Vendor Attribute**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | Reserved | Reserved |  |
| EBX[31:0] | Reserved | Reserved |  |
| ECX[31:0] | Reserved | Reserved |  |
| EDX[31:0] | Reserved | Reserved |  |
| 21-62  Vol. 1 |  |  |  |

CPUID.18H -- Deterministic Address Translation Parameters

CPUID.18H returns information about the Deterministic Address Translation Parameters. Each sub-leaf enumerates a different address translation structure. * This leaf is valid if CPUID.18H.00H:EAX[31:0] <> 0 and MAX_LEAF  18H. * The maximum sub-leaf value for ECX is specified in CPUID.18H.00H.EAX[31:0] MAX_SUBLEAF. * If ECX contains an invalid sub-leaf index, EAX/EBX/ECX/EDX return 0. Sub-leaf index n is invalid if n exceeds the value that sub-leaf 0 returns in EAX. A sub-leaf index is also invalid if EDX[4:0] returns 0. * Valid sub-leaves do not need to be contiguous or in any particular order. A valid sub-leaf may be in a higher input ECX value than an invalid sub-leaf or than a valid sub-leaf of a higher or lower-level structure.

CPUID.18H.00H -- Main Sub-Leaf

Deterministic Address Translation Parameters Main Leaf

**Leaf 18H.00H Deterministic Address Translation Parameters**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | Reports the maximum input value of supported | Logical |
|  |  | sub-leaf in leaf 18H. | Processor |
| EBX[31:0] | Reserved | Reserved. |  |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[4:0] | TYPE | Will always return 0. | Logical Processor |
| EDX[31:5] | Reserved | Reserved. |  |

**Leaf 18H.ECX >= 1 Deterministic Address Translation Parameters**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | Reserved | Reserved. |  |
| EBX[0] | 4KB_ENTRIES | If 1, supports 4K page size entries in this | Logical |
|  |  | structure. | Processor |
| EBX[1] | 2MB_ENTRIES | If 1, supports 2MB page size entries in this | Logical |
|  |  | structure. | Processor |
| EBX[2] | 4MB_ENTRIES | If 1, supports 4MB page size entries in this | Logical |
|  |  | structure. | Processor |
| EBX[3] | 1GB_ENTRIES | If 1, supports 1 GB page size entries in this | Logical |
|  |  | structure. | Processor |
| EBX[7:4] | Reserved | Reserved. |  |
| EBX[10:8] | PARTITIONING | Partitioning (0:Soft partitioning between the | Logical |
|  |  | logical processors sharing this structure). | Processor |
| EBX[15:11] | Reserved | Reserved. |  |
| EBX[31:16] | NUM_WAYS | W = ways of associativity. | Logical Processor |
| ECX[31:0] | NUM_SETS | S = number of sets. | Logical Processor |

EDX[4:0]      TYPE                                  00000b: Null (indicates this Sub-leaf is not      Logical

```text
                                                    valid).                                           Processor
```

EDX[7:5]      LEVEL_NUM                             00001b: Data TLB.

```text
                                                    00010b: Instruction TLB.                          Logical
```

EDX[8]        FULLY_ASSOC                           00011b: Unified TLB.1                             Processor

```text
                                                    00100b: Load Only TLB. Hit on loads; fills on     Logical
```

EDX[13:9]     Reserved                              both loads and stores.                            Processor EDX[25:14]    MAX_LP_ADDRESSABLE_IDS                00101b: Store Only TLB. Hit on stores; fill on    Logical

```text
                                                    stores.                                           Processor
```

All other encodings are reserved. EDX[31:26] Reserved                                 Some unified TLBs will allow a single TLB entry to satisfy data read/write and instruction fetches. Others will require separate entries (e.g., one loaded on data read/write and another loaded on an instruction fetch). See the Intel(R) 64 and IA-32 Architectures Optimization Reference Manual for details of a particular product.

Translation cache level (starts at 1).

Fully associative structure.

Reserved.

Maximum number of addressable IDs for logical processors sharing this translation cache. Add one to the return value to get the result.

Reserved.

CPUID.19H -- Key Locker

CPUID.19H returns Key Locker information. * This leaf is valid if CPUID.07H.00H:ECX.KEY_LOCKER[23] = 1 and MAX_LEAF  19H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 19H Key Locker**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[0] | CPL0_RESTRICT | If 1, supports the Key Locker restriction of CPL0-only.1 | Platform |
| EAX[1] | NO_ENCRYPT_RESTRICT | If 1, supports the Key Locker restriction of no- encrypt.1 | Platform |
| EAX[2] | NO_DECRYPT_RESTRICT | If 1, supports the Key Locker restriction of no- decrypt.1 | Platform |
| EAX[31:3] | Reserved | Reserved. |  |
| EBX[0] | AESKLE | If 1, the AES Key Locker instructions are fully | Logical |
|  |  | enabled. CPUID.19H:EBX.AESKLE[0] is enumerated as 1 if the AES Key Locker instructions have been activated by system firmware and CR4.KL[bit 19] = 1. Software can check this bit after setting CR4.KL to determine whether AES Key Locker instructions have been enabled. Note that some processors may allow enabling of those instructions without activation by system firmware. Some processors may not support the use of AES Key Locker instructions in system-management-mode (SMM). Those processors enumerate CPUID.19H:EBX.AESKLE[0] as 0 in SMM regardless of the setting of CR4.KL. | Processor |
| EBX[1] | Reserved | Reserved. |  |
| EBX[2] | AES_WIDE | If 1, supports the AES wide Key Locker instructions.1 | Platform |
| EBX[3] | Reserved | Reserved. |  |
| EBX[4] | IWKEYBACKUP | If 1, supports the Key Locker MSRs (IA32_COPY_LOCAL_TO_PLATFORM, IA23_COPY_PLATFORM_TO_LOCAL, IA32_COPY_STATUS, and IA32_IWKEYBACKUP_STATUS) and backing up the internal wrapping key.1 | Platform |
| EBX[31:5] | Reserved | Reserved. |  |
| ECX[0] | NOBACKUP | If 1, supports the NoBackup parameter to LOADIWKEY.1 | Platform |
| ECX[1] | RAND_IWKEY | If 1, supports KeySource encoding of 1 (randomization of the internal wrapping key).1 | Platform |
| ECX[31:2] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |

CPUID.1AH -- Native Model ID Enumeration

CPUID.1AH returns Native Model ID information. This leaf exists on all logical processors in a hybrid package, it may also be present in other processor configurations. * This leaf is valid if CPUID.1AH.00H:EAX[31:0] <> 0 and MAX_LEAF  1AH. * The only valid sub-leaf is 0 and ECX must be set to 0.

**Leaf 1AH Native Model ID Enumeration**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[23:0] | CORE_NATIVE_MODEL_ID | The core-type and native model ID can be used | Logical |
|  |  | to uniquely identify the microarchitecture of the core. This native model ID is not unique across core types, and not related to the model ID reported in CPUID.01H, and does not identify the SOC. | Processor |
| EAX[31:24] | CORE_TYPE | 10H: Reserved | Logical |
|  |  | 20H: Intel(R) Atom(R) 30H: Reserved 40H: Intel(R) Core The core type may only be used as an identification of the microarchitecture for this logical processor and its numeric value has no significance, neither large nor small. This field neither implies nor expresses any other attribute to this logical processor and software should not assume any. | Processor |
| EBX[31:0] | Reserved | Reserved. |  |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |
| 21-66   Vol. 1 |  | PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION |  |

CPUID.1BH -- PCONFIG Information

CPUID.1BH -- Output Registers Format for All Sub-Leaves

CPUID.1BH returns information for PCONFIG capabilities. This information is enumerated in sub-leaves selected by the value of ECX (starting with 0). * This leaf is valid if CPUID.07H.00H:EDX.PCONFIG[18] = 1 and MAX_LEAF  1BH. * Sub-leaves are enumerated until sub-leaf n, where EAX[11:0] returns 0.

Register    Field Name     Table 21-64. Leaf 1BH PCONFIG Information              Domain EAX[11:0]   SUB_LEAF_TYPE                                                         Platform EAX[31:12]  Reserved                                        Description EBX[31:0]   Reserved                                        0 (Invalid) ECX[31:0]   Reserved                                        Reserved. EDX[31:0]   Reserved                                        Reserved. Reserved. Reserved.

Each sub-leaf of CPUID.1BH enumerates its sub-leaf type in EAX. If a sub-leaf type is 0, the sub-leaf is invalid and zero is returned in EBX, ECX, and EDX. In this case, all subsequent sub-leaves (selected by larger input values of ECX) are also invalid. The only valid sub-leaf type currently defined is 1, indicating that the sub-leaf enumerates target identifiers for the PCONFIG instruction. Any non-zero value returned in EBX, ECX, or EDX indicates a valid target identifier of the PCONFIG instruction (any value of zero should be ignored). The only target identifier currently defined is 1, indicating TME-MK. See the "PCONFIG--Platform Configuration" instruction in Chapter 4 of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 2B, for more information.

CPUID.1BH.OUTPUT REGISTERS FOR SUB-LEAVE TYPE TARGET IDENTIFIER (1) -- Output Registers for Sub-Leave Type Target Identifier (1)

**Leaf 1BH.OUTPUT REGISTERS FOR SUB-LEAVE TYPE TARGET IDENTIFIER (1) PCONFIG Information**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[11:0] | SUB_LEAF_TYPE | 1 (Target Identifier) | Platform |
| EAX[31:12] | Reserved | Reserved. |  |
| EBX[31:0] | TARGET_IDENTIFIER_1 | Target identifier | Platform |
| ECX[31:0] | TARGET_IDENTIFIER_2 | Target identifier | Platform |
| EDX[31:0] | TARGET_IDENTIFIER_3 | Target identifier | Platform |

CPUID.1CH -- Last Branch Records (LBR) Information

CPUID.1CH returns information about architectural Last Branch Records (LBR). For details on LBR, see Chapter 20, "Last Branch Records," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3B. * This leaf is valid if CPUID.07H.00H:EDX.ARCH_LBRS[19] = 1 and MAX_LEAF  1CH. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 1CH Last Branch Records (LBR) Information**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[7:0] | LBR_DEPTH_VALUES | For each bit n set in this field, the IA32_LBR_DEPTH.DEPTH value 8*(n+1) is supported. | Platform |
| EAX[29:8] | Reserved | Reserved. |  |
| EAX[30] | DEEP_C_STATE_RESET | If 1, supports that LBRs may be cleared on an MWAIT that requests a C-state numerically greater than C1. | Platform |
| EAX[31] | IP_VALUES_CONTAIN_LIP | If 1, the LBR IP values contain LIP. If 0, IP values | Logical |
|  |  | contain Effective IP. Trace segments using a flat memory model will generate the same information regardless of how a logical processor reports this value since LIP = EIP | Processor |
| EBX[0] | CPL_FILTERING | If 1, supports setting IA32_LBR_CTL[2:1] to a non-zero value. | Platform |
| EBX[1] | BRANCH_FILTERING | If 1, supports setting IA32_LBR_CTL[22:16] to a non-zero value. | Platform |
| EBX[2] | CALL_STACK_MODE | If 1, supports setting IA32_LBR_CTL[3] to 1. | Platform |
| EBX[31:3] | Reserved | Reserved. |  |
| ECX[0] | MISPREDICT_BIT | If 1, IA32_LBR_x_INFO[63] holds indication of branch misprediction (MISPRED). | Platform |
| ECX[1] | TIMED_LBRS | If 1, IA32_LBR_x_INFO[15:0] holds CPU cycles since last LBR entry (CYC_CNT), and IA32_LBR_x_INFO[60] holds an indication of whether the value held there is valid (CYC_CNT_VALID). | Platform |
| ECX[2] | BRANCH_TYPE_FIELD_SUPPORTED | If 1, IA32_LBR_INFO_x[59:56] holds indication of the recorded operation's branch type (BR_TYPE). | Platform |
| ECX[15:3] | Reserved | Reserved. |  |
| ECX[19:16] | EVENT_LOGGING_BITMAP | The event logging bitmap, wherein each set bit corresponds to a programmable performance monitoring counter that supports LBR event logging. | Platform |
| ECX[31:20] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |
| 21-68  Vol. 1 |  | PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION |  |

CPUID.1DH -- Tile Information

CPUID.1DH returns information about tile architecture and tile palette 1 (see Chapter 19, "Programming with Intel(R) Advanced Matrix Extensions," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1). * This leaf is valid if CPUID.07H.00H:EDX.AMX_TILE[24] = 1 and MAX_LEAF  1DH. * The maximum sub-leaf value for ECX is specified in CPUID.1DH.00H.EAX[31:0] max_palette. * If ECX contains an invalid sub-leaf index, EAX/EBX/ECX/EDX return 0. Sub-leaf index n is invalid if n exceeds the value that sub-leaf 0 returns in EAX.

CPUID.1DH.00H -- Tile Information Main Sub-Leaf

CPUID.1DH.00H returns the tile architecture information.

Register    Field Name        Table 21-67. Leaf 1DH.00H Tile Information                                      Domain EAX[31:0]   MAX_PALETTE                                                                                       Platform EBX[31:0]   Reserved                                           Description ECX[31:0]   Reserved                                           Highest numbered palette sub-leaf. Value = 1. EDX[31:0]   Reserved                                           Reserved. Reserved. Reserved.

CPUID.1DH.01H -- Tile Palette 1

CPUID.1DH.01H returns tile palette information.

**Leaf 1DH.01H Tile Information**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[15:0] | TOTAL_TILE_BYTES | Palette 1 total_tile_bytes. Value = 8192. | Platform |
| EAX[31:16] | BYTES_PER_TILE | Palette 1 bytes_per_tile. Value = 1024. | Platform |
| EBX[15:0] | BYTES_PER_ROW | Palette 1 bytes_per_row. Value = 64. | Platform |
| EBX[31:16] | MAX_NAMES | Palette 1 max_names (number of tile registers). Value = 8. | Platform |
| ECX[15:0] | MAX_ROWS | Palette 1 max_rows. Value = 16. | Platform |
| ECX[31:16] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |

CPUID.1EH -- TMUL Information

CPUID.1EH returns information about TMUL capabilities (see Chapter 19, "Programming with Intel(R) Advanced Matrix Extensions," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1). * This leaf is valid if CPUID.07H.00H:EDX.AMX_TILE[24] = 1 and MAX_LEAF  1EH. * The only valid sub-leaf is 0 and ECX must be set to 0.

CPUID.1EH.00H -- TMUL Information Main Leaf

TMUL Main Leaf Information

Register      Field Name  Table 21-69. Leaf 1EH.00H TMUL Information                                  Domain EAX[31:0]     Reserved EBX[7:0]      TMUL_MAXK                                     Description                               Platform EBX[23:8]     TMUL_MAXN                                     Reserved.                                 Platform EBX[31:24]    Reserved                                      tmul_maxk (rows or columns). Value = 16. ECX[31:0]     Reserved                                      tmul_maxn (column bytes). Value = 64. EDX[31:0]     Reserved                                      Reserved. Reserved. Reserved.

CPUID.1FH -- V2 Extended Topology

CPUID.1FH returns information about V2 Extended Topology. CPUID.1FH is a preferred superset to leaf 0BH. Intel recommends using leaf 1FH when available rather than leaf 0BH and ensuring that any leaf 0BH algorithms are updated to support leaf 1FH. * This leaf is valid if CPUID.1FH.00H:EBX[15:0] <> 0 and MAX_LEAF  1FH.

* When the leaf is invalid, CPUID.1FH.00H:ECX.DOMAIN_TYPE[15:8] will report the Domain Type ID as Invalid (0). * The sub-leaves are enumerated until sub-leaf n returns 0 in EBX[15:0]. * If ECX contains an invalid sub-leaf index, EAX/EBX return 0. Sub-leaf index n+1 is invalid if sub-leaf n returns EBX[15:0] as 0.

CPUID.1FH -- ECX >= 0

**Leaf 1FH V2 Extended Topology**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[4:0] | SHIFT_COUNT | The number of bits that the x2APIC ID must be shifted to the right to address instances of the next higher-scoped domain. When logical processor is not supported by the processor, the value of this field at the Logical Processor domain sub-leaf may be returned as either 0 (no allocated bits in the x2APIC ID) or 1 (one allocated bit in the x2APIC ID); software should plan accordingly. | Platform |
| EAX[31:5] | Reserved | Reserved. |  |
| EBX[15:0] | NEXT_LEVEL_NUM_LP | The number of logical processors across all | Logical |
|  |  | instances of this domain within the next higher- scoped domain relative to this current logical processor. (For example, in a processor socket/package comprising "M" dies of "N" cores each, where each core has "L" logical processors, the "die" domain sub-leaf value of this field would be M*N*L. In an asymmetric topology this would be the summation of the value across the lower domain level instances to create each upper domain level instance.) This number reflects configuration as shipped by Intel. Note that the number of logical processors can be asymmetric in which case "L" may be different on different logical processors, as an example a core with 2 logical processors on the same platform as a core with 1 logical processor. Note, software must not use this field to enumerate processor topology. Software must not use the value of EBX[15:0] to enumerate processor topology of the system. The value is only intended for display and diagnostic purposes. The actual number of logical processors available to BIOS/OS/Applications may be different from the value of EBX[15:0], depending on software and platform hardware configurations. | Processor |
| EBX[31:16] | Reserved | Reserved. |  |

ECX[7:0]      LEVEL_NUM                             The input ECX sub-leaf index.                      Platform ECX[15:8]     DOMAIN_TYPE                                                                              Platform This field provides an identification value which ECX[31:16]    Reserved                              indicates the domain as shown in the table.        Logical EDX[31:0]     X2APIC_ID                             Although domains are ordered, their assigned       Processor identification values are not and software should not depend on it. (For example, if a new domain between core and module is specified, it will have an identification value higher than 5.) See the table below for the current list of valid enumerations. Note that enumeration values of 0 and 7-255 are reserved.

Reserved.

The x2APIC ID of the current logical processor is always valid and does not vary with the subleaf index in ECX.

The sub-leaves of CPUID.1FH describe an ordered hierarchy of logical processors starting from the smallest scoped domain of a Logical Processor (sub-leaf index 0) to the Core domain (sub-leaf index 1) to the largest scoped domain (the last valid sub-leaf index) that is implicitly subordinate to the unenumerated highest-scoped domain of the processor package (socket). The details of each valid domain is enumerated by a corresponding sub-leaf. Details for a domain include its type and how all instances of that domain determine the number of logical processors and x2 APIC ID partitioning at the next higher-scoped domain. The ordering of domains within the hierarchy is fixed architecturally as shown below. For a given processor, not all domains may be relevant or enumerated; however, the logical processor and core domains are always enumerated. As an example, a processor may report an ordered hierarchy consisting only of "Logical Processor," "Core," and "Die." For two valid sub-leaves N and N+1, sub-leaf N+1 represents the next immediate higher-scoped domain with respect to the domain of sub-leaf N for the given processor. If sub-leaf index "N" returns an invalid domain type in ECX[15:08] (00H), then all sub-leaves with an index greater than "N" also return an invalid domain type. A sub-leaf returning an invalid domain always returns 0 in EAX and EBX.

**Hierarchy of Valid Domain Enumerations in CPUID.1FH:ECX[15:8]**

| Hierarchy | Domain | Domain Type ID Value |
| --- | --- | --- |
| Invalid | Invalid | 0 |
| Lowest | Logical Processor | 1 |
| ... | Core | 2 |
| ... | Module | 3 |
| ... | Tile | 4 |
| ... | Die | 5 |
| ... | DieGrp | 6 |
| Highest | Package/Socket | (Implied) |
| Reserved | Reserved | 7-255 |
| 21-72  Vol. 1 |  |  |

CPUID.20H -- Processor History Reset Information

CPUID.20H returns information about processor history reset when CPUID.07H.01H:EAX.HRESET[22] = 1. * This leaf is valid if CPUID.07H.01H:EAX.HRESET[22] = 1 and MAX_LEAF  20H. * The maximum sub-leaf value for ECX is specified in CPUID.20H.00H.EAX[31:0] MAX_SUBLEAF. * If ECX contains an invalid sub-leaf index, EAX/EBX/ECX/EDX return 0. Sub-leaf index n is invalid if n exceeds the value that sub-leaf 0 returns in EAX.

CPUID.20H.00H -- Processor History Reset Sub-leaf

**Leaf 20H.00H Processor History Reset Information**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | Reports the maximum number of sub-leaves that are supported in leaf 20H. | Platform |
| EBX[0] | THREAD_DIRECTOR_HRESET | Indicates support for both HRESET's EAX[0] parameter, and IA32_HRESET_ENABLE[0] set by the OS to enable reset of Intel(R) Thread Director history. | Platform |
| EBX[31:1] | Reserved | Reserved. |  |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |

CPUID.21H -- Unimplemented

Does not return feature information for the processor. Allocated for use by TDX modules; see Intel(R) Trust Domain Extensions (Intel(R) TDX) Module Base Architecture Specification. Software emulating CPUID should not change the information returned for this leaf.

CPUID.22H -- Reserved

This leaf is reserved.

Register   Field Name   Table 21-73. Leaf 22H Reserved        Domain EAX[31:0]  Reserved EBX[31:0]  Reserved                              Description ECX[31:0]  Reserved                              Reserved. EDX[31:0]  Reserved                              Reserved. Reserved. Reserved.

CPUID.23H -- Architectural Performance Monitoring Extended

CPUID.23H returns architectural performance monitoring extended information. * This leaf is valid if CPUID.07H.01H:EAX.ARCH_PERFMON_EXT[8] = 1 and MAX_LEAF  23H. * The sub-leaves of this leaf are enumerated by a bitmask specified in CPUID.23H.00H.EAX[31:0] SUBLEAF_MASK. The bit numbers of set bits in the bitmask represent valid sub-leaf indexes. * If ECX contains an invalid sub-leaf index, EAX/EBX/ECX/EDX return 0. Sub-leaf index is invalid if the index as a bit number is clear in the Available Sub-Leaf Mask or is greater than 31.

CPUID.23H.00H -- Main Sub-Leaf

**Leaf 23H.00H Architectural Performance Monitoring Extended**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | SUBLEAF_MASK | If bit n is set, sub-leaf n is supported. (For | Logical |
|  |  | unsupported sub-leaves, 0 is returned in the registers EAX, EBX, ECX, and EDX.) | Processor |
| EBX[0] | UNITMASK2 | If 1, supports the UnitMask2 field in the | Logical |
|  |  | IA32_PERFEVTSELx MSRs. | Processor |
| EBX[1] | EQ | If 1, supports the equal flag in the | Logical |
|  |  | IA32_PERFEVTSELx MSRS. | Processor |
| EBX[31:2] | Reserved | Reserved. |  |
| ECX[7:0] | SLOTS_PER_CYC | If this field is non-zero, it represents the | Logical |
|  |  | number of Top-down Microarchitecture Analysis (TMA) slots per cycle. This number can be multiplied by the number of cycles (from CPU_CLK_UNHALTED.THREAD / CPU_CLK_UNHALTED.CORE or IA32_FIXED_CTR1) to determine the total number of slots. If this field is zero, IA32_FIXED_CTR3 should be used to determine the total number of slots. | Processor |
| ECX[31:8] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |
| CPUID.23H.01H - | - Counter Information Sub-Leaf |  |  |

**Leaf 23H.01H Architectural Performance Monitoring Extended**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | GP_COUNTERS | For each bit n set in this field, the processor | Logical |
|  |  | supports general-purpose performance monitoring counter n. | Processor |
| EBX[31:0] | FIXED_COUNTERS | For each bit m set in this field, the processor | Logical |
|  |  | supports fixed-function performance monitoring counter m. The valid range of fixed-function counters is 0 through 15. | Processor |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |
| 21-76  Vol. 1 |  |  |  |

CPUID.23H.02H -- Bitmap of Auto Counter Reload Sub-Leaf

**Leaf 23H.02H Architectural Performance Monitoring Extended**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | ACR_GP_RELOAD | General counters that can be reloaded. For each | Logical |
|  |  | bit n set in this field, the processor supports ACR for general-purpose performance monitoring counter n. | Processor |
| EBX[31:0] | ACR_FIXED_RELOAD | Fixed counters that can be reloaded. For each | Logical |
|  |  | bit m set in this field, the processor supports ACR for fixed-function performance monitoring counter m. | Processor |
| ECX[31:0] | ACR_GP_TRIGGER | General counters that can cause reloads. For | Logical |
|  |  | each bit y set in this field, the processor allows general-purpose performance monitoring counter y to reload all existing general-purpose performance monitoring counters capable of being reloaded. | Processor |
| EDX[31:0] | ACR_FIXED_TRIGGER | Fixed counters that can cause reloads. For each | Logical |
|  |  | bit x set in this field, the processor allows fixed- function performance monitoring counter x to reload all existing fixed-function performance monitoring counters capable of being reloaded. | Processor |

**Leaf 23H.03H Architectural Performance Monitoring Extended**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[0] | CORE_CYC | If 1, supports architectural index 0. | Logical Processor |
| EAX[1] | INSTR_RET | If 1, supports architectural index 1. | Logical Processor |
| EAX[2] | REF_CYC | If 1, supports architectural index 2. | Logical Processor |
| EAX[3] | LLC_REF | If 1, supports architectural index 3. | Logical Processor |
| EAX[4] | LLC_MISSES | If 1, supports architectural index 4. | Logical Processor |
| EAX[5] | BR_INSTR_RET | If 1, supports architectural index 5 | Logical Processor |
| EAX[6] | BR_MISPRED_RET | If 1, supports architectural index 6 | Logical Processor |
| EAX[7] | SLOTS | If 1, supports architectural index 7 | Logical Processor |
| EAX[8] | BACKEND | If 1, supports architectural index 8 | Logical Processor |
| EAX[9] | BADSPEC | If 1, supports architectural index 9 | Logical Processor |

EAX[10]       FRONTEND                              If 1, supports architectural index 10            Logical Processor EAX[11]       RETIRING                              If 1, supports architectural index 11 Logical EAX[12]       LBR_INSERTS                           If 1, supports architectural index 12            Processor

```text
                                                    Reserved.                                        Logical
                                                    Reserved.                                        Processor
```

Reserved. EAX[31:13]    Reserved                              Reserved. EBX[31:0]     Reserved ECX[31:0]     Reserved EDX[31:0]     Reserved

CPUID.23H.04H -- PEBS Capabilities

**Leaf 23H.04H Architectural Performance Monitoring Extended**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | Reserved | Reserved. |  |
| EBX[2:0] | Reserved | Reserved. |  |
| EBX[3] | ALLOW_IN_RECORD | If 1, indicates that the ALLOW_IN_RECORD bit is | Logical |
|  |  | available in the IA32_PMC_GPn_CFG_C and IA32_PMC_FXm_CFG_C MSRs. | Processor |
| EBX[4] | CNTR_GP | If 1, indicates that counters group sub-group | Logical |
|  |  | general-purpose counters is available. | Processor |
| EBX[5] | CNTR_FIXED | If 1, indicates that counters group sub-group | Logical |
|  |  | fixed-function counters is available. | Processor |
| EBX[6] | CNTR_METRICS | If 1, indicates that counters group sub-group | Logical |
|  |  | performance metrics is available. | Processor |
| EBX[7] | Reserved | Reserved. |  |
| EBX[9:8] | LBR | LBR group and both bits [41:40] are available. | Logical Processor |
| EBX[15:10] | Reserved | Reserved. |  |
| EBX[23:16] | XER | XER group bits [50:49] and bits [55:53] are | Logical |
|  |  | available. See Section 11.4.4, "XSAVEEnabled Registers Group," for XER fields. | Processor |
| EBX[28:24] | Reserved | Reserved. |  |
| EBX[29] | GPR | If 1, the GPR group is available. | Logical Processor |
| EBX[30] | AUX | If 1, the AUX group is available. | Logical Processor |
| EBX[31] | Reserved | Reserved. |  |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |
| 21-78  Vol. 1 |  |  |  |

CPUID.23H.05H -- Arch PEBS GP and Fixed Counters supported

**Leaf 23H.05H Architectural Performance Monitoring Extended**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | GP_PEBS | Bit vector of general-purpose counters for | Logical |
|  |  | which the Architectural PEBS mechanism is available (bit n == GP counter #n). If EAX[n] == 1, then the IA32_PMC_GPn_CFG_C MSR is available, and PEBS is supported on that counter; the PEBS_EN[63] field can be set; and the RELOAD[31:0] field can be set. Note that CPUID.23H.04H:EBX governs which adaptive group bits can be set. | Processor |
| EBX[31:0] | GP_PDIST | General-purpose counters for which PEBS | Logical |
|  |  | supports PDIST. | Processor |
| ECX[31:0] | FIXED_PEBS | Bit vector of fixed-function counters for which | Logical |
|  |  | the Architectural PEBS mechanism is available. If ECX[x] == 1, then the IA32_PMC_FXm_CFG_C MSR is available, and PEBS is supported; the PEBS_EN[63] field can be set; and the RELOAD[31:0] field can be set. Note that CPUID.23H.04H:EBX governs which adaptive group bits can be set. | Processor |
| EDX[31:0] | FIXED_PDIST | Fixed-function counters for which PEBS | Logical |
|  |  | supports PDIST. | Processor |

CPUID.24H -- Converged Vector ISA

When CPUID.24H, the processor returns Intel AVX10 converged vector ISA information. This leaf is supported when CPUID.07H.01H:EDX.AVX10[19] = 1. * This leaf is valid if CPUID.07H.01H:EDX.AVX10[19] = 1 and MAX_LEAF  24H. * The maximum sub-leaf value for ECX is specified in CPUID.24H.00H.EAX[31:0] MAX_SUBLEAF. * If ECX contains an invalid sub-leaf index, EAX/EBX/ECX/EDX return 0. Sub-leaf index n is invalid if n exceeds the value that sub-leaf 0 returns in EAX.

CPUID.24H.00H -- Converged Vector ISA Main Sub-Leaf

**Leaf 24H.00H Converged Vector ISA**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | Reports the maximum number of sub-leaves that are supported in leaf 24H. | Platform |
| EBX[7:0] | VECTOR_ISA_VERSION | Reports the Intel(R) AVX10 Converged Vector ISA version. | Platform |
| EBX[15:8] | Reserved | Reserved. |  |
| EBX[18:16] | Reserved at 111 | Always 111b. Earlier versions of this specification documented these bits as enumerating support for different vector lengths. Processors enumerating Intel(R) AVX10 support all vector lengths. | Platform |
| EBX[31:19] | Reserved | Reserved. |  |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |
| 21-80  Vol. 1 |  |  |  |

CPUID.27H -- Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Monitoring

CPUID.27H returns information for the Intel Resource Director Technology Monitoring capabilities with asymmetric topology. As described below, software uses the bit vector returned in EDX by sub-leaf 00H to determine the available resource types (ResID) that can be monitored. This information is necessary for software to program the IA32_PQR_ASSOC and IA32_QM_EVTSEL MSRs such that Quality-of-Service data can be read afterwards from the IA32_QM_CTR MSR. * This leaf is valid if CPUID.07H.01H:ECX.RDT_M_ASYM[0] = 1 and MAX_LEAF  27H. * If the leaf is valid, sub-leaf 00H is always valid. Sub-leaf n (n  1) is only valid when (CPUID.27H.00H:EDX[n] == 1). * This leaf must be read on each logical processor to determine the support on each processor.

CPUID.27H.00H -- Intel(R) RDT Asymmetric Monitoring Main Sub-Leaf

CPUID.27H.00H returns information about Intel RDT Monitoring Asymmetric.

**Leaf 27H.00H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Monitoring**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | Reserved | Reserved. |  |
| EBX[31:0] | MAX_RMID | Maximum range (zero-based) of RMID within | Logical |
|  |  | this physical processor of all types. | Processor |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[0] | Reserved | Reserved. |  |
| EDX[1] | L3_MON | If 1, supports L3 Cache Intel RDT Monitoring. | Logical |
|  |  | Sub-leaf index 0 reports valid resource type starting at bit position 1 of EDX. | Processor |
| EDX[31:2] | Reserved | Reserved. |  |

**Leaf 27H.01H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Monitoring**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[7:0] | CTR_WIDTH | The counter width is encoded as an offset from | Logical |
|  |  | 24b. A value of zero in this field indicates that 24-bit counters are supported. A value of 8 in this field indicates that 32-bit counters are supported. | Processor |
| EAX[8] | RDT_M_OVF | If 1, supports an overflow bit in the | Logical |
|  |  | IA32_QM_CTR MSR (bit 61). | Processor |

EAX[9]        IO_RDT_CMT                            If 1, indicates the presence of non-CPU agent  Logical

```text
                                                    supporting Intel RDT CMT.                      Processor
```

EAX[10]       IO_RDT_MBM                            If 1, indicates the presence of non-CPU agent  Logical

```text
                                                    supporting Intel RDT MBM support.              Processor
```

EAX[31:11]    Reserved                              Reserved. EBX[31:0]     CONV_FACTOR                           Factor used to convert from reported           Logical

```text
                                                    IA32_QM_CTR value to derived occupancy         Processor
```

ECX[31:0]     MAX_RMID_L3                           metric (bytes) and Memory Bandwidth EDX[0]        CMT_L3_OCCUP                          Monitoring (MBM) metrics.                      Logical EDX[1]        MBM_L3_TOTAL                          Maximum range (zero-based) of RMID of this     Processor EDX[2]        MBM_L3_LOCAL                          resource type.                                 Logical EDX[31:3]     Reserved                              If 1, supports L3 occupancy monitoring.        Processor Logical

```text
                                                    If 1, supports L3 total bandwidth monitoring.  Processor
```

Logical

```text
                                                    If 1, supports L3 local bandwidth monitoring.  Processor
```

Reserved.

CPUID.28H -- Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation

CPUID.28H returns information for Intel Resource Director Technology Allocation with asymmetric topology. This leaf is valid when CPUID.07H.01H:ECX.RDT_A_SYM[1] = 1. As described below, software uses the bit vector returned in EBX by subleaf 00H to determine the available QoS Enforcement (allocation) resource types that are supported in the processor. This information is necessary for software to configure each class of services using capability bit masks in the QoS Mask registers, IA32_resourceType_Mask_n. * This leaf is valid if CPUID.07H.01H:ECX.RDT_A_SYM[1] = 1 and MAX_LEAF  28H. * If the leaf is valid, sub-leaf 00H is always valid. Sub-leaf n (n  1) is only valid when (CPUID.28H.00H:EBX[n] == 1).

CPUID.28H.00H -- Intel(R) RDT Asymmetric Allocation Main Sub-Leaf

CPUID.28H.00H returns information about Intel RDT Allocation Asymmetric.

**Leaf 28H.00H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | Reserved | Reserved. |  |
| EBX[0] | Reserved | Reserved. |  |
| EBX[1] | CAT_L3 | Supports L3 Cache Allocation Technology if 1. | Logical Processor |
| EBX[2] | CAT_L2 | Supports L2 Cache Allocation Technology if 1. | Logical Processor |
| EBX[3] | MBA | Supports Memory Bandwidth Allocation if 1. | Logical Processor |
| EBX[4] | Reserved | Reserved. |  |
| EBX[5] | CBA | If 1, supports Cache Bandwidth Allocation. | Logical Processor |
| EBX[6] | RESOURCE_PRIORITY | If 1, supports Resource Priority. | Platform |
| EBX[31:7] | Reserved | Reserved. |  |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |

**Leaf 28H.01H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[4:0] | CAT_L3_BITMASK_LENGTH | Length of the capacity bit mask for the | Logical |
|  |  | corresponding ResID. Add one to the return value to get the result. | Processor |
| EAX[31:5] | Reserved | Reserved. |  |

EBX[31:0]     CAT_L3_CONTENTION                     Bit-granular map of isolation/contention of     Logical ECX[0]        Reserved                              allocation units.                               Processor ECX[1]        CAT_L3_NONCPU ECX[2]        CAT_L3_CDP                            If 1, supports L3 CAT for non-CPU agents.       Logical ECX[3]        CAT_L3_NONCONTIG                                                                      Processor

```text
                                                    N/A                                             Logical
```

ECX[31:4]     Reserved                                                                              Processor EDX[15:0]     CAT_L3_MAX_CLOS                       If 1, supports L3 Code and Data Prioritization  Logical

```text
                                                    Technology.                                     Processor
```

```text
                                                    If 1, supports non-contiguous capacity          Logical
                                                    bitmasks. The bits that are set in the various  Processor
```

IA32_L3_MASK_n registers do not have to be EDX[31:16] Reserved                                 contiguous.

Reserved.

Highest Class of Service (COS) number supported for this ResID.

Reserved.

CPUID.28H.02H -- Asymmetric L2 Cache Allocation Technology

CPUID.28H.ResID=2 returns information about Asymmetric L2 Cache Allocation Technology.

**Leaf 28H.02H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[4:0] | CAT_L2_BITMASK_LENGTH | Length of the capacity bit mask for the | Logical |
|  |  | corresponding ResID. Add one to the return value to get the result. | Processor |
| EAX[31:5] | Reserved | Reserved. |  |
| EBX[31:0] | CAT_L2_CONTENTION | Bit-granular map of isolation/contention of | Logical |
|  |  | allocation units. | Processor |
| ECX[1:0] | Reserved | Reserved. |  |
| ECX[2] | CAT_L2_CDP | If 1, supports L2 Code and Data Prioritization | Logical |
|  |  | Technology. | Processor |
| ECX[3] | CAT_L2_NONCONTIG | If 1, supports non-contiguous capacity | Logical |
|  |  | bitmasks. The bits that are set in the various IA32_L2_MASK_n registers do not have to be contiguous. | Processor |
| ECX[31:4] | Reserved | Reserved. |  |
| EDX[15:0] | CAT_L2_MAX_CLOS | Highest Class of Service (COS) number | Logical |
|  |  | supported for this ResID. | Processor |
| EDX[31:16] | Reserved | Reserved. |  |

**Leaf 28H.03H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| 21-84  Vol. 1 |  |  |  |

EAX[11:0]   MBA_MAX                         Reports the maximum MBA throttling value            Logical

```text
                                            supported for the corresponding ResID. Add          Processor
```

EAX[31:12]  Reserved                        one to the return value to get the result. EBX[31:0]   Reserved                        Reserved.                                           Logical ECX[0]      PER_THREAD_MBA                  Reserved.                                           Processor Per-thread MBA controls are supported. ECX[1]      Reserved                                                                            Logical ECX[2]      MBA_LINEAR                      Reserved.                                           Processor If 1, the response of the delay values is linear. ECX[31:3]   Reserved                                                                            Logical EDX[15:0]   MBA_MAX_CLOS                    Reserved.                                           Processor Highest Class of Service (COS) number EDX[31:16] Reserved                         supported for this ResID. Reserved.

CPUID.28H.05H -- Asymmetric Cache Bandwidth Allocation

**Leaf 28H.05H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[7:0] | CBA_MAX_LEVELS | Reports the maximum core throttling level | Logical |
|  |  | supported for the corresponding ResID. Add one to the return value to get the number of throttling levels supported. | Processor |
| EAX[11:8] | BW_SCOPE | If 1, indicates the logical processor scope of the | Logical |
|  |  | IA32_QoS_Core_BW_Thrtl_n MSRs. Other values are reserved. | Processor |
| EAX[31:12] | Reserved | Reserved. |  |
| EBX[31:0] | Reserved | Reserved. |  |
| ECX[2:0] | Reserved | Reserved. |  |
| ECX[3] | CBA_LINEAR | If 1, the response of the bandwidth control is | Logical |
|  |  | approximately linear. If 0, the response of the bandwidth control is non-linear. | Processor |
| ECX[31:4] | Reserved | Reserved. |  |
| EDX[15:0] | CBA_MAX_CLOS | Highest Class of Service (COS) number | Logical |
|  |  | supported for this ResID. | Processor |
| EDX[31:16] | Reserved | Reserved. |  |
| CPUID.28H.06H - | - Resource Priority Control |  |  |

**Leaf 28H.06H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[0] | THREAD_ENABLE | If 1, supports per-thread enable of RP through the IA32_RESOURCE_PRIORITY MSR. | Platform |

EAX[1]        PACKAGE_ENABLE                        If 1, supports physical processor package  Platform enable of RP through the IA32_RESOURCE EAX[31:2]     Reserved                              PRIORITY_PKG MSR. EBX[31:0]     Reserved ECX[31:0]     Reserved                              Reserved. EDX[31:0]     Reserved Reserved.

Reserved.

Reserved.

CPUID.80000000H -- Maximum Input Value for Extended Function CPUID Information

CPUID.80000000H returns the highest value the processor recognizes for returning extended processor information. The value is returned in the EAX register and is processor specific. * This leaf is supported starting with Pentium 4. * Processors prior to Pentium 4 treat bit 31 as 0, and this leaf returns the values from CPUID.00H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 80000000H Maximum Input Value for Extended Function CPUID Information**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_EXTENDED_LEAF | Maximum input value for Extended Function CPUID Information. | Platform |
| EBX[31:0] | Reserved | Reserved. |  |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |

CPUID.80000001H -- Extended Processor Signature and Feature Bits

CPUID.80000001H returns information about extended processor signature and features bits. * This leaf is valid if MAX_EXTENDED_LEAF  80000001H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 80000001H Extended Processor Signature and Feature Bits**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | Reserved | Reserved. |  |
| EBX[31:0] | Reserved | Reserved. |  |
| ECX[0] | LAHF_SAHF_64 | If 1, supports the LAHF/SAHF instructions in 64-bit mode. LAHF and SAHF are always available in other modes, regardless of the enumeration of this feature flag. | Platform |
| ECX[4:1] | Reserved | Reserved. |  |
| ECX[5] | LZCNT | If 1, supports the LZCNT instruction. | Platform |
| ECX[7:6] | Reserved | Reserved. |  |
| ECX[8] | PREFETCHW | If 1, supports the PREFETCHW instruction. | Platform |
| ECX[31:9] | Reserved | Reserved. |  |
| EDX[10:0] | Reserved | Reserved. |  |
| EDX[11] | SYSCALL_SYSRET_64 | If 1, supports SYSCALL/SYSRET. Intel processors support SYSCALL and SYSRET only in 64-bit mode. This feature flag is always enumerated as 0 outside 64-bit mode. | Platform |
| EDX[19:12] | Reserved | Reserved. |  |
| EDX[20] | EXECUTE_DIS | If 1, supports Execute Disable Bit. | Platform |
| EDX[25:21] | Reserved | Reserved. |  |
| EDX[26] | PAGE_1GB | If 1, supports 1-GByte pages. | Platform |
| EDX[27] | RDTSCP | If 1, supports RDTSCP and IA32_TSC_AUX. | Platform |
| EDX[28] | Reserved | Reserved. |  |
| EDX[29] | INTEL64 | If 1, supports Intel(R) 64 Architecture. | Platform |
| EDX[31:30] | Reserved | Reserved. |  |
| 21-88  Vol. 1 |  | PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION |  |

CPUID.80000002H -- Processor Brand String (Bytes 0 to 15)

CPUID.80000002H returns information about the Processor Brand String. For additional details on Processor Brand String, see Section 21.2, "Methods for Returning Branding Information Using CPUID." * This leaf is valid if MAX_EXTENDED_LEAF  80000002H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 80000002H Processor Brand String (Bytes 0 to 15)**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | BRAND_NAME_0 | Processor brand string. | Platform |
| EBX[31:0] | BRAND_NAME_1 | Processor brand string continued. | Platform |
| ECX[31:0] | BRAND_NAME_2 | Processor brand string continued. | Platform |
| EDX[31:0] | BRAND_NAME_3 | Processor brand string continued. | Platform |

CPUID.80000003H -- Processor brand string (Bytes 16 to 31)

CPUID.80000003H returns information about the Processor Brand String. For additional details on Processor Brand String, see Section 21.2, "Methods for Returning Branding Information Using CPUID." * This leaf is valid if MAX_EXTENDED_LEAF  80000003H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 80000003H Processor brand string (Bytes 16 to 31)**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | BRAND_NAME_4 | Processor brand string continued. | Platform |
| EBX[31:0] | BRAND_NAME_5 | Processor brand string continued. | Platform |
| ECX[31:0] | BRAND_NAME_6 | Processor brand string continued. | Platform |
| EDX[31:0] | BRAND_NAME_7 | Processor brand string continued. | Platform |
| 21-90  Vol. 1 |  |  |  |

CPUID.80000004H -- Processor brand string (Bytes 32 to 47)

CPUID.80000004H returns information about the Processor Brand String. For additional details on Processor Brand String, see Section 21.2, "Methods for Returning Branding Information Using CPUID." * This leaf is valid if MAX_EXTENDED_LEAF  80000004H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 80000004H Processor brand string (Bytes 32 to 47)**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | BRAND_NAME_8 | Processor brand string continued. | Platform |
| EBX[31:0] | BRAND_NAME_9 | Processor brand string continued. | Platform |
| ECX[31:0] | BRAND_NAME_10 | Processor brand string continued. | Platform |
| EDX[31:0] | BRAND_NAME_11 | Processor brand string continued. | Platform |

CPUID.80000005H -- Reserved

This leaf is reserved and returns all zeroes.

Register      Field Name  Table 21-94. Leaf 80000005H Reserved        Domain EAX[31:0]     Reserved EBX[31:0]     Reserved                                   Description ECX[31:0]     Reserved                                   Reserved. EDX[31:0]     Reserved                                   Reserved. Reserved. Reserved.

CPUID.80000006H -- Extended Function CPUID Information

CPUID.80000006H returns Extended Function CPUID information. The preferred method to enumerate caching information description>is to use CPUID.04H--Deterministic Cache Parameters. * This leaf is valid if MAX_EXTENDED_LEAF  80000006H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX

**Leaf 80000006H Extended Function CPUID Information**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | Reserved | Reserved. |  |
| EBX[31:0] | Reserved | Reserved. |  |
| ECX[7:0] | L2_LINE_SIZE | Cache line size in bytes. | Logical Processor |
| ECX[11:8] | Reserved | Reserved. |  |
| ECX[15:12] | L2_ASSOC | L2 associativity field. The L2 associativity  field | Logical |
|  |  | encodings are listed in the table below. | Processor |
| ECX[31:16] | L2_SIZE | Cache size in 1K units. | Logical Processor |
| EDX[7:0] | Reserved | Reserved. |  |
| EDX[31:8] | Reserved | Reserved. |  |

**L2 Associativity Field Encodings**

| Encoding Value | Description | Encoding Value | Description |
| --- | --- | --- | --- |
| 00H | Disabled | 08H | 16 Ways |
| 01H | 1 Way (direct mapped) | 09H | Reserved |
| 02H | 2 Ways | 0AH | 32 Ways |
| 03H | Reserved | 0BH | 48 Ways |
| 04H | 4 Ways | 0CH | 64 Ways |
| 05H | Reserved | 0DH | 96 Ways |
| 06H | 8 Ways | 0EH | 128 Ways |
| 07H | See CPUID leaf 4 sub-leaf 21 | 0FH | Fully Associative |

CPUID.80000007H -- Extended Function CPUID Information 1

CPUID.80000007H returns Extended Function CPUID information. * This leaf is valid if MAX_EXTENDED_LEAF  80000007H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 80000007H Extended Function CPUID Information 1**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[31:0] | Reserved | Reserved. |  |
| EBX[31:0] | Reserved | Reserved. |  |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[7:0] | Reserved | Reserved. |  |
| EDX[8] | TSC_INVARIANT | If 1, supports Invariant TSC. | Platform |
| EDX[31:9] | Reserved | Reserved. |  |
| 21-94  Vol. 1 |  |  |  |

CPUID.80000008H -- Extended Function CPUID Information 2

CPUID.80000008H returns Extended Function CPUID information. * This leaf is valid if MAX_EXTENDED_LEAF  80000008H. * This leaf does not contain sub-leaves and provides the same information regardless of the value of ECX.

**Leaf 80000008H Extended Function CPUID Information 2**

| Register | Field Name | Description | Domain |
| --- | --- | --- | --- |
| EAX[7:0] | PHYS_ADDR_SIZE | Number of physical-address bits. If TME-MK is enabled, the number of bits that can be used to address memory may be reduced by IA32_TME_ACTIVATE[35:32]. | Platform |
| EAX[15:8] | LIN_ADDR_SIZE | Number of linear-address bits. | Platform |
| EAX[23:16] | GUEST_PHYS_ADDR_SIZE | Number of guest-physical-address bits (for software operating in a virtual machine). If this field is zero, PHYS_ADDR_SIZE should be used. Intel processors return zero for this field. Software emulating CPUID may return a different value. | Platform |
| EAX[31:24] | Reserved | Reserved. |  |
| EBX[8:0] | Reserved | Reserved. |  |
| EBX[9] | WBNOINVD | If 1, supports the WBNOINVD instruction. | Platform |
| EBX[31:10] | Reserved | Reserved. |  |
| ECX[31:0] | Reserved | Reserved. |  |
| EDX[31:0] | Reserved | Reserved. |  |
