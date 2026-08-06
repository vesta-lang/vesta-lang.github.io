---
summary: Lea la base de segmentos FS/GS
---

## Descripción

Carga el registro de proposito general indicada por el campo ModR/M:r/m con la dirección base del segmento FS o GS.

El operando de destino puede ser un registro de proposito general de 32 bits o de 64 bits. El prefijo REX.W indica que el tamaño de operando es de 64 bits. Si no se utiliza el prefijo REX.W, el tamaño de operando es de 32 bits; se ignoran los 32 bits superiores de la dirección base de origen (para FS o GS) y se eliminan 32 bits superiores del registro de destino. Esta instrucción sólo se admite en modo de 64 bits.

## Operación

```text
DEST := FS/GS segment base address;
```

## Banderas afectadas

None.

C/C++ Compilador Equivalente Intrínseco

RDFSBASE unsigned int  readfsbase u32(void ); RDFSBASE unsigned   int64  readfsbase u64(void ); RDGSBASE unsigned int  readgsbase u32(void ); RDGSBASE unsigned   int64  readgsbase u64(void );
