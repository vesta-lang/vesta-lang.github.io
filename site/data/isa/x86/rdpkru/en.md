---
summary: Read Protection Key Rights for User Pages
---

## Description

Reads the value of PKRU into EAX and clears EDX. ECX must be 0 when RDPKRU is executed; otherwise, a generalprotection exception (#GP) occurs.

RDPKRU can be executed only if CR4.PKE = 1; otherwise, an invalid-opcode exception (#UD) occurs. Software can discover the value of CR4.PKE by examining CPUID.07H.00H:ECX.OSPKE[4].

On processors that support the Intel 64 Architecture, the high-order 32-bits of RCX are ignored and the high-order 32-bits of RDX and RAX are cleared.

## Operation

```text
IF (ECX = 0)
    THEN
          EAX := PKRU;
          EDX := 0;
    ELSE #GP(0);

FI;
```

## Flags affected

None.

C/C++ Compiler Intrinsic Equivalent RDPKRU uint32_t _rdpkru_u32(void);
