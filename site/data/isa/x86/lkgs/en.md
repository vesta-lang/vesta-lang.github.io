---
summary: Load Kernel GS Base
---

## Description

LKGS operates in the same way as MOV to GS except that the descriptor's base address is loaded into the IA32_KERNEL_GS_BASE MSR instead of the GS segment's descriptor cache.

LKGS takes a single (source) operand, which can be a general-purpose register or a memory location. The operand must be a valid segment selector. The instruction loads the segment descriptor referenced by that segment selector into the GS descriptor cache, with the exception of the base address. The base address in the GS descriptor cache is not modified; the base address from the segment descriptor is loaded into the IA32_KERNEL_GS_BASE MSR. (Since the base address in the descriptor is only 32 bits, the upper 32 bits of the MSR are cleared.)

A null segment selector (values 0000-0003) can be loaded without causing an exception. However, any subsequent attempt to reference GS outside 64-bit mode causes a general protection exception (#GP) and no memory reference occurs. LKGS with a null segment selector loads zero into IA32_KERNEL_GS_BASE.

## Operation

```text
IF CPL > 0 OR logical processor not in 64-bit mode
    THEN #UD; FI;

IF SRC is null
    THEN
          GS.selector := SRC;
          mark GS as null;
          IA32_KERNEL_GS_BASE := 0;
    ELSE
          IF SRC.index is outside descriptor table limits
                THEN #GP(selector); FI;
          read referenced descriptor for descriptor table;
          IF the descriptor is not for a data or readable code segment OR SRC.RPL > descriptor.DPL
                THEN #GP(selector); FI;
          IF the descriptor is not marked present
                THEN #NP(selector);
                ELSE
                      GS.selector := SRC;
                      GS.attributes := descriptor.attributes;
                      IA32_KERNEL_GS_BASE := descriptor.base; // bits 63:32 cleared
          FI;

FI;
```

## Flags affected

None.
