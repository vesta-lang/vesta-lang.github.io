---
summary: Compare y agregue si Estado es Met
---

## Descripción

Esta instrucción compara el valor de la memoria con el valor del segundo operando. Si se cumple la condición especificada, el procesador añadirá el tercer operando al operando de memoria y lo escribirá en memoria, de lo contrario la memoria no se cambia por esta instrucción.

Esta instrucción debe tener MODRM.MOD igual a 0, 1, o 2. El valor 3 para MODRM.MOD está reservado y causará una excepción de código de operación no válido (#UD).

El segundo operando siempre se actualiza con el valor original del operando de memoria. Las condiciones EFLAGS se actualizan a partir de los resultados de la comparación.La instrucción utiliza un bloqueo implícito. Esta instrucción no permite el uso de un prefijo de bloqueo explícito.

## Operación

```text
CMPCCXADD srcdest1, srcdest2, src3
tmp1 := load lock srcdest1
tmp2 := tmp1 + src3
EFLAGS.CS,OF,SF,ZF,AF,PF := CMP tmp1, srcdest2
IF <condition>:

    srcdest1 := store unlock tmp2
ELSE

    srcdest1 := store unlock tmp1
srcdest2 :=tmp1

1. ModRM.MOD != 011B
```

## Banderas afectadas

Las condiciones EFLAGS se actualizan a partir de los resultados de la comparación.

## Intel C/C++ compilador intrínseco

```c
CMPCCXADD int _cmpccxadd_epi32 (void* __A, int __B, int __C, const int __D);
CMPCCXADD __int64 _cmpccxadd_epi64 (void* __A, __int64 __B, __int64 __C, const int __D);
```

## SIMD coma flotante Excepciones

None.

Excepciones Tipo 14; véase Tabla 2-31.
