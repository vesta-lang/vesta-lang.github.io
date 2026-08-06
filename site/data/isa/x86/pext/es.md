---
summary: Extracto de mordiscos paralelos
---

## Descripción

PEXT utiliza una máscara en el segundo operando de origen (el tercer operando) para transferir bits contiguos o no contiguos en el primer operando de origen (el segundo operando) a posiciones contiguas de bajo pedido en el destino (el primer operando). Para cada bit fijado en el MASK, PEXT extrae los bits correspondientes del primer operando de origen y los escribe en pedazos inferiores contiguos de operando de destino. Los bits superiores restantes de destino se ponen a cero.

```text
             SRC1 S31 S30 S29 S28 S27                 S7 S6 S5 S4 S3 S2 S1 S0
```

```text
             SRC2            0  0 01 0                10 1 0 0 1 0 0
```

(mask)

```text
             DEST 0 0 0 0 0                           00               0 0 S28 S7 S5 S2
                     bit 31                                                                         bit 0
```

Figura 4-9. PEXT Ejemplo

Esta instrucción no es compatible en modo real y modo virtual-8086. El tamaño de operando es siempre 32 bits si no en modo de 64 bits. En modo de 64 bits tamaño de operando 64 requiere VEX.W1. VEX.W1 es ignorado en modos no-64-bit. Un intento de ejecutar esta instrucción con VEX.L no igual a 0 causará #UD.

## Operación

```text
TEMP := SRC1;
MASK := SRC2;
DEST := 0 ;
m := 0, k := 0;
DO WHILE m < OperandSize

          IF MASK[ m] = 1 THEN
                DEST[ k] := TEMP[ m];
                k := k+ 1;

          FI
          m := m+ 1;

OD
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
PEXT unsigned __int32 _pext_u32(unsigned __int32 src, unsigned __int32 mask);
PEXT unsigned __int64 _pext_u64(unsigned __int64 src, unsigned __int32 mask);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-29, "Tipo 13 Condiciones de Excepción de Clase".
