---
summary: Write FS/GS Segment Base
---

## Descripción

Carga la dirección base del segmento FS o GS con el registro de proposito general indicado por el campo modR/M:r/m.

El operando de origen puede ser un registro de proposito general de 32 bits o de 64 bits. El prefijo REX.W indica que el tamaño de operando es de 64 bits. Si no se utiliza el prefijo REX.W, el tamaño de operando es de 32 bits; los 32 bits superiores del registro de origen son ignorados y los 32 bits superiores de la dirección base (para FS o GS) se limpian. Esta instrucción sólo se admite en modo de 64 bits.

## Operación

```text
FS/GS segment base address := SRC;
```

## Banderas afectadas

None.

C/C++ Compilador Equivalente Intrínseco

WRFSBASE void  writefsbase u32( unsigned int ); WRFSBASE  writefsbase u64( unsigned   int64 ); WRGSBASE void  writegsbase u32( unsigned int ); WRGSBASE  writegsbase u64( unsigned   int64 );
