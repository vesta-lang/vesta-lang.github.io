---
summary: Leer Protección Derechos clave para Páginas de Usuario
---

## Descripción

Lee el valor de PKRU en EAX y aclara EDX. ECX debe ser 0 cuando RDPKRU es ejecutado; de lo contrario, se produce una excepción de protección general (#GP).

RDPKRU se puede ejecutar sólo si CR4.PKE = 1; de lo contrario, una excepción de código de operación no válido (#UD) ocurre. El software puede descubrir el valor de CR4.PKE examinando CPUID.07H.00H:ECX.OSPKE[4].

En los procesadores que apoyan la Arquitectura Intel 64, los 32 bits de alto orden de RCX son ignorados y los 32 bits de alto orden de RDX y RAX se limpian.

## Operación

```text
IF (ECX = 0)
    THEN
          EAX := PKRU;
          EDX := 0;
    ELSE #GP(0);

FI;
```

## Banderas afectadas

None.

C/C++ Compiler Intrinsic Equivalent RDPKRU uint32 t  rdpkru u32(void);
