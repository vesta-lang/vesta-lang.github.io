---
summary: Zero High Bits Comenzando con Posición de Bit Especificada
---

## Descripción

BZHI copia los bits del primer operando de origen (el segundo operando) en el operando de destino (el primer operando) y aclara los bits más altos en el destino según el valor INDEX especificado por el segundo operando de origen (el tercer operando). El INDEX se especifica por bits 7:0 del segundo operando de origen. El valor INDEX está saturado al valor de OperandSize -1. CF se establece, si el número contenido en los 8 bits bajos del tercer operando es mayor que OperandSize -1.

Esta instrucción no es compatible en modo real y modo virtual-8086. El tamaño de operando es siempre 32 bits si no en modo de 64 bits. En modo de 64 bits tamaño de operando 64 requiere VEX.W1. VEX.W1 es ignorado en modos no-64-bit. Un intento de ejecutar esta instrucción con VEX.L no igual a 0 causará #UD.

## Operación

```text
N := SRC2[7:0]
DEST := SRC1
IF (N < OperandSize)

    DEST[OperandSize-1:N] := 0
FI
IF (N > OperandSize - 1)

    CF := 1
ELSE

    CF := 0
FI
```

## Banderas afectadas

Las banderas ZF y SF se actualizan sobre la base del resultado. La bandera CF se establece como se especifica en la sección Operación. De la bandera se pone a cero. AF y PF banderas quedan indefinidas.

## Intel C/C++ compilador intrínseco

```c
BZHI unsigned __int32 _bzhi_u32(unsigned __int32 src, unsigned __int32 index);
BZHI unsigned __int64 _bzhi_u64(unsigned __int64 src, unsigned __int32 index);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-29, "Tipo 13 Condiciones de Excepción de Clase".
