---
summary: Check Upper Bound
---

## Descripción

Compare la dirección en el segundo operando con el límite superior en bnd. El segundo operando puede ser un registro o un operando de memoria. Si la dirección es más alta que el límite superior en bnd.UB, establecerá BNDSTATUS a 01H y señale una excepción #BR.

BNDCU realizar 1's complemento operación en el borde superior de bnd primero antes de proceder con la comparación de la dirección. BNDCN realiza la comparación de direcciones directamente utilizando el límite superior en bnd que ya se revierte fuera de la forma de complemento de 1.

Esta instrucción no causa ningún acceso a la memoria, y no lee ni escribe ninguna bandera.

Computación de dirección efectiva de m32/64 tiene un comportamiento idéntico a LEA

## Operación

```text
BNDCU BND, reg
IF reg > NOT(BND.UB) Then

    BNDSTATUS := 01H;
    #BR;
FI;

BNDCU BND, mem
TEMP := LEA(mem);
IF TEMP > NOT(BND.UB) Then

    BNDSTATUS := 01H;
    #BR;
FI;

BNDCN BND, reg
IF reg > BND.UB Then

    BNDSTATUS := 01H;
    #BR;
FI;


BNDCN BND, mem
TEMP := LEA(mem);
IF TEMP > BND.UB Then

    BNDSTATUS := 01H;
    #BR;
FI;
```

## Intel C/C++ compilador intrínseco

```c
BNDCU .void _bnd_chk_ptr_ubounds(const void *q);
```

## Banderas afectadas

None
