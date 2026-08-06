---
summary: Multiply sin marcar banderas
---

## Descripción

Realiza una multiplicación no firmada de la implicit operando de origen (EDX/RDX) y el operando de origen especificado (el tercer operando) y almacena la mitad baja del resultado en el segundo destino (segundo operando), la mitad alta del resultado en el primer operando de destino (primero operando lectura), Esto permite una programación eficiente donde el software puede entrelazar añadir con operaciones de carga y multiplicaciones.

Si el primer y segundo operando son idénticos, contendrá la mitad alta del resultado de la multiplicación.

Esta instrucción no es compatible en modo real y modo virtual-8086. El tamaño de operando es siempre 32 bits si no en modo de 64 bits. En modo de 64 bits tamaño de operando 64 requiere VEX.W1. VEX.W1 es ignorado en modos no-64-bit. Un intento de ejecutar esta instrucción con VEX.L no igual a 0 causará #UD.

## Operación

```text
// DEST1: ModRM:reg
// DEST2: VEX.vvvv
IF (OperandSize = 32)

    SRC1 := EDX;
    DEST2 := (SRC1*SRC2)[31:0];
    DEST1 := (SRC1*SRC2)[63:32];
ELSE IF (OperandSize = 64)
    SRC1 := RDX;

          DEST2 := (SRC1*SRC2)[63:0];
          DEST1 := (SRC1*SRC2)[127:64];
FI
```

## Intel C/C++ compilador intrínseco

```c
Auto-generated from high-level language when possible. unsigned int mulx_u32(unsigned int a, unsigned int b, unsigned int * hi);
unsigned __int64 mulx_u64(unsigned __int64 a, unsigned __int64 b, unsigned __int64 * hi);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-29, "Tipo 13 Condiciones de Excepción de Clase".
