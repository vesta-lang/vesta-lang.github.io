---
summary: Timed PAUSE
---

## Description

TPAUSE instructs the processor to enter an implementation-dependent optimized state. There are two such optimized states to choose from: light-weight power/performance optimized state, and improved power/performance optimized state. The selection between the two is governed by the explicit input register bit[0] source operand.

TPAUSE is available when CPUID.07H.00H:ECX.WAITPKG[5] is enumerated as 1. TPAUSE may be executed at any privilege level. This instruction's operation is the same in non-64-bit modes and in 64-bit mode.

Unlike PAUSE, the TPAUSE instruction will not cause an abort when used inside a transactional region, described in the chapter Chapter 16, "Programming with Intel(R) AVX10," of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1.

The input register contains information such as the preferred optimized state the processor should enter as described in the following table. Bits other than bit 0 are reserved and will result in #GP if non-zero.

**TPAUSE Input Register Bit Definitions**

| Bit Value | State Name | Wakeup Time | Power Savings | Other Benefits |
| --- | --- | --- | --- | --- |
| bit[0] = 0 | C0.2 | Slower | Larger | Improves performance of the other SMT thread(s) on the same core. |
| bit[0] = 1 | C0.1 | Faster | Smaller | N/A |
| bits[31:1] | N/A | N/A | N/A | Reserved |

## Operation

```text
os_deadline := TSC+(IA32_UMWAIT_CONTROL[31:2]<<2)
instr_deadline := UINT64(EDX:EAX)

IF os_deadline < instr_deadline:
    deadline := os_deadline
    using_os_deadline := 1

ELSE:
    deadline := instr_deadline
    using_os_deadline := 0

WHILE TSC < deadline:
    implementation_dependent_optimized_state(Source register, deadline, IA32_UMWAIT_CONTROL[0])

IF using_os_deadline AND TSC  deadline:
    RFLAGS.CF := 1

ELSE:
    RFLAGS.CF := 0

RFLAGS.AF,PF,SF,ZF,OF := 0
```

## Intel C/C++ compiler intrinsics

```c
TPAUSE uint8_t _tpause(uint32_t control, uint64_t counter);
```

## Numeric Exceptions

None.
