---
summary: Devuelve el número de bits a 1
---

## Descripción

Esta instrucción calcula el número de bits fijados a 1 en el segundo operando (fuente) y devuelve el conteo en el primer operando (un registro de destino).

## Operación

```text
Count = 0;

For (i=0; i < OperandSize; i++)

{    IF (SRC[ i] = 1) // i'th bit

     THEN Count++; FI;

}

DEST := Count;
```

## Banderas afectadas

OF, SF, ZF, AF, CF, PF are all cleared. ZF is set if SRC = 0, otherwise ZF is cleared.

## Intel C/C++ compilador intrínseco

```c
POPCNT int _mm_popcnt_u32(unsigned int a);
POPCNT int64_t _mm_popcnt_u64(unsigned __int64 a);
```
