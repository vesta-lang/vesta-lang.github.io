---
summary: Obtener máscara de hasta el más bajo conjunto de bit
---

## Descripción

Establece todos los bits inferiores del operando de destino a "1" hasta e incluyendo el bit set más bajo (=1) en el operando de origen. Si operando de origen es cero, BLSMSK establece todos los pedazos del operando de destino a 1 y también establece CF a 1.

Esta instrucción no es compatible en modo real y modo virtual-8086. El tamaño de operando es siempre 32 bits si no en modo de 64 bits. En modo de 64 bits tamaño de operando 64 requiere VEX.W1. VEX.W1 es ignorado en modos no-64-bit. Un intento de ejecutar esta instrucción con VEX.L no igual a 0 causará #UD.

## Operación

```text
temp := (SRC-1) XOR (SRC) ;
SF := temp[OperandSize -1];
ZF := 0;
IF SRC = 0

    CF := 1;
ELSE

    CF := 0;
FI
DEST := temp;
```

## Banderas afectadas

SF se actualiza sobre la base del resultado. CF se establece si la fuente es cero. ZF y OF flags están despejados. AF y PF flag quedan indefinidas.

## Intel C/C++ compilador intrínseco

```c
BLSMSK unsigned __int32 _blsmsk_u32(unsigned __int32 src);
BLSMSK unsigned __int64 _blsmsk_u64(unsigned __int64 src);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-29, "Tipo 13 Condiciones de Excepción de Clase".
