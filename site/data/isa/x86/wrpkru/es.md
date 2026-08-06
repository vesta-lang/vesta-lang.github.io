---
summary: Escriba datos a la página de usuario clave Registro
---

## Descripción

Escribe el valor de EAX en PKRU. ECX y EDX deben ser 0 cuando WRPKRU es ejecutado; de lo contrario, se produce una excepción de protección general (#GP).

WRPKRU se puede ejecutar sólo si CR4.PKE = 1; de lo contrario, una excepción de código de operación no válido (#UD) ocurre. El software puede descubrir el valor de CR4.PKE examinando CPUID.07H.00H:ECX.OSPKE[4].

En los procesadores que apoyan la Arquitectura Intel 64, se ignoran los 32 bits de alto orden de RCX, RDX y RAX.

WRPKRU nunca ejecutará especulativamente. Los accesos de memoria afectados por el registro PKRU no se ejecutarán (incluso especulativamente) hasta que todas las ejecuciones anteriores de WRPKRU hayan completado la ejecución y actualizado el registro PKRU.

## Operación

```text
IF (ECX = 0 AND EDX = 0)
    THEN PKRU := EAX;
    ELSE #GP(0);

FI;
```

## Banderas afectadas

None.

C/C++ Compiler Intrinsic Equivalent WRPKRU void  wrpkru(uint32 t);
