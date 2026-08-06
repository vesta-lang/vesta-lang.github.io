---
summary: Chequee la menor cantidad
---

## Descripción

Compare la dirección en el segundo operando con el límite inferior en bnd. El segundo operando puede ser un registro o operando de memoria. Si la dirección es inferior al límite inferior en bnd.LB, establecerá BNDSTATUS a 01H y señale una excepción #BR.

Esta instrucción no causa ningún acceso a la memoria, y no lee ni escribe ninguna bandera.

## Operación

```text
BNDCL BND, reg
IF reg < BND.LB Then

    BNDSTATUS := 01H;
    #BR;
FI;

BNDCL BND, mem
TEMP := LEA(mem);
IF TEMP < BND.LB Then

    BNDSTATUS := 01H;
    #BR;
FI;
```

## Intel C/C++ compilador intrínseco

```c
BNDCL void _bnd_chk_ptr_lbounds(const void *q);
```

## Banderas afectadas

None
