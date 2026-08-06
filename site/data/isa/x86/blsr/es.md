---
summary: Reset Lowest Set Bit
---

## Descripción

Copia todos los bits del operando de origen al operando de destino y resetea (=0) la posición del bit en el operando de destino que corresponde al bit más bajo del operando de origen. Si el operando de origen es cero BLSR sets CF.

Esta instrucción no es compatible en modo real y modo virtual-8086. El tamaño de operando es siempre 32 bits si no en modo de 64 bits. En modo de 64 bits tamaño de operando 64 requiere VEX.W1. VEX.W1 es ignorado en modos no-64-bit. Un intento de ejecutar esta instrucción con VEX.L no igual a 0 causará #UD.

## Operación

```text
temp := (SRC-1) bitwiseAND ( SRC );
SF := temp[OperandSize -1];
ZF := (temp = 0);
IF SRC = 0

    CF := 1;
ELSE

    CF := 0;
FI
DEST := temp;
```

## Banderas afectadas

Las banderas ZF y SF se actualizan sobre la base del resultado. CF se establece si la fuente es cero. De la bandera se pone a cero. AF y PF banderas quedan indefinidas.

## Intel C/C++ compilador intrínseco

```c
BLSR unsigned __int32 _blsr_u32(unsigned __int32 src);
BLSR unsigned __int64 _blsr_u64(unsigned __int64 src);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-29, "Tipo 13 Condiciones de Excepción de Clase".
