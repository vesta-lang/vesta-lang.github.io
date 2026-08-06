---
summary: Extracto Lowest Set Isolated Bit
---

## Descripción

Extrae el bit más bajo del operando de origen y establece el bit correspondiente en el registro de destino. Todos los demás bits en el operando de destino se ponen a cero. Si no hay bits en el operando de origen, BLSI establece todos los bits en el destino a 0 y establece ZF y CF.

Esta instrucción no es compatible en modo real y modo virtual-8086. El tamaño de operando es siempre 32 bits si no en modo de 64 bits. En modo de 64 bits tamaño de operando 64 requiere VEX.W1. VEX.W1 es ignorado en modos no-64-bit. Un intento de ejecutar esta instrucción con VEX.L no igual a 0 causará #UD.

## Operación

```text
temp := (-SRC) bitwiseAND (SRC);
SF := temp[OperandSize -1];
ZF := (temp = 0);
IF SRC = 0

    CF := 0;
ELSE

    CF := 1;
FI
DEST := temp;
```

## Banderas afectadas

ZF y SF se actualizan sobre la base del resultado. CF se establece si la fuente no es cero. Las banderas están limpias. AF y PF banderas quedan indefinidas.

## Intel C/C++ compilador intrínseco

```c
BLSI unsigned __int32 _blsi_u32(unsigned __int32 src);
BLSI unsigned __int64 _blsi_u64(unsigned __int64 src);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-29, "Tipo 13 Condiciones de Excepción de Clase".
