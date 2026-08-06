---
summary: Invalidate Process-Context Identifier
---

## Description

Invalidates mappings in the translation lookaside buffers (TLBs) and paging-structure caches based on processcontext identifier (PCID). (See Section 5.10, "Caching Translation Information," in the Intel 64 and IA-32 Architecture Software Developer's Manual, Volume 3A.) Invalidation is based on the INVPCID type specified in the register operand and the INVPCID descriptor specified in the memory operand.

Outside 64-bit mode, the register operand is always 32 bits, regardless of the value of CS.D. In 64-bit mode the register operand has 64 bits.

There are four INVPCID types currently defined:

* Individual-address invalidation: If the INVPCID type is 0, the logical processor invalidates mappings--except global translations--for the linear address and PCID specified in the INVPCID descriptor.1 In some cases, the instruction may invalidate global translations or mappings for other linear addresses (or other PCIDs) as well.

* Single-context invalidation: If the INVPCID type is 1, the logical processor invalidates all mappings--except

global translations--associated with the PCID specified in the INVPCID descriptor. In some cases, the instruction may invalidate global translations or mappings for other PCIDs as well.

* All-context invalidation, including global translations: If the INVPCID type is 2, the logical processor invalidates

all mappings--including global translations--associated with any PCID.

* All-context invalidation: If the INVPCID type is 3, the logical processor invalidates all mappings--except global

translations--associated with any PCID. In some case, the instruction may invalidate global translations as well.

The INVPCID descriptor comprises 128 bits and consists of a PCID and a linear address as shown in Figure 3-20. For INVPCID type 0, the processor uses the full 64 bits of the linear address even outside 64-bit mode; the linear address is not used for other INVPCID types.

```text
                    127                                        64 63               12 11 0
```

```text
                                  Linear Address                      Reserved (must be zero) PCID
```

Figure 3-20. INVPCID Descriptor

1. If the paging structures map the linear address using a page larger than 4 KBytes and there are multiple TLB entries for that page (see Section 5.10.2.3, "Details of TLB Use," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3A), the instruction invalidates all of them.

If CR4.PCIDE = 0, a logical processor does not cache information for any PCID other than 000H. In this case,

executions with INVPCID types 0 and 1 are allowed only if the PCID specified in the INVPCID descriptor is 000H;

executions with INVPCID types 2 and 3 invalidate mappings only for PCID 000H. Note that CR4.PCIDE must be 0 outside IA-32e mode (see Section 5.10.1, "Process-Context Identifiers (PCIDs)," of the Intel(R) 64 and IA-32 Archi-

tectures Software Developer's Manual, Volume 3A).

## Operation

```text
INVPCID_TYPE := value of register operand;      // must be in the range of 03

INVPCID_DESC := value of memory operand;

CASE INVPCID_TYPE OF

0:             // individual-address invalidation

       PCID := INVPCID_DESC[11:0];

       L_ADDR := INVPCID_DESC[127:64];

       Invalidate mappings for L_ADDR associated with PCID except global translations;

       BREAK;

1:             // single PCID invalidation

       PCID := INVPCID_DESC[11:0];

       Invalidate all mappings associated with PCID except global translations;

       BREAK;

2:             // all PCID invalidation including global translations

       Invalidate all mappings for all PCIDs, including global translations;

       BREAK;

3:             // all PCID invalidation retaining global translations

       Invalidate all mappings for all PCIDs except global translations;

       BREAK;

ESAC;
```

## Intel C/C++ compiler intrinsics

```c
INVPCID void _invpcid(unsigned __int32 type, void * descriptor);
```

## SIMD Floating-Point Exceptions

None.
