---
summary: Hacer libras
---

## Descripción

Hace límites desde el segundo operando y almacena los bordes inferiores y superiores en el registro atado bnd. El segundo operando debe ser un operando de memoria. El contenido del registro base del operando de memoria se almacena en el bnd.LB inferior. El complemento 1 de la dirección efectiva de m32/m64 se almacena en el b.UB del límite superior. La computación de m32/m64 tiene un comportamiento idéntico a LEA.

Esta instrucción no causa ningún acceso a la memoria, y no lee ni escribe ninguna bandera.

Si la instrucción no especificaba el registro base, el límite inferior será cero. La forma reg-reg de esta instrucción retiene el comportamiento legado (NOP).

La instrucción causa una excepción de código de operación no válido (#UD) si se ejecuta en modo de 64 bits con dirección relativa RIP.

## Operación

```text
BND.LB := SRCMEM.base;
IF 64-bit mode Then

    BND.UB := NOT(LEA.64_bits(SRCMEM));
ELSE

    BND.UB := Zero_Extend.64_bits(NOT(LEA.32_bits(SRCMEM)));
FI;
```

## Intel C/C++ compilador intrínseco

```c
BNDMKvoid * _bnd_set_ptr_bounds(const void * q, size_t size);
```

## Banderas afectadas

None.
